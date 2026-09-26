# HAIR Category — Build Plan

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md)

_Planning doc, koi bhi HAIR code likhne se pehle likha gaya - same reason [EYE-PLAN.md](./EYE-PLAN.md) apni alag doc me hai. Progress tracker nahi hai (wo [HAIR.md](./HAIR.md) hai, abhi bhi saare unbuilt placeholders) - ye un **design decisions** ko capture karta hai jo koi bhi code likhne se pehle liye gaye._

## Ye doc kyun banaya

Ab tak build hui har category - LIP, FACE, EYE (aur NAIL bhi, jab banega) - ek hi tracking foundation pe khadi hai: MediaPipe **FaceLandmarker**, ek 478-point face mesh, jisse ek closed region (lip outline, face oval, eyebrow ring, eyelid) trace ki jaati hai aur us path ko Canvas2D se fill/stroke kiya jaata hai. [README.md](./README.md) ki apni HAIR tracking-model line pehle se hi flag kar chuki thi ki ye alag hai: _"hair segmentation (full-strand mask), point landmarks nahi ... isko apna alag segmentation model chahiye"_. Ye doc us line ko seriously leke actually verify karta hai ki kitna alag hai - aur jawaab hai: **bahut zyada**, sirf tracking model hi nahi, poora shared engine (`TryOnEngineBase`, `withLiveCamera`, `withImageUpload`, `IRenderTargetParams`) bhi HAIR ke liye reuse nahi ho sakta as-is, jaisa neeche ka Research section line-by-line dikhata hai. Ye HAIR ko is poore try-on feature ki sabse badi naya-infrastructure category banata hai - MASCARA/LASHES ne EYE ke andar ek nayi render-primitive maangi thi, lekin HAIR ko ek nayi **tracking + engine + type-hierarchy** teeno chahiye.

## Research: HAIR ka tracking model kya hoga (aur kyun landmark kaam nahi karega)

Face landmarks kaam kyun nahi karte, seedha reasoning: `FaceLandmarker` sirf face ke 478 fixed anatomical points deta hai (aankh, naak, mooh, eyebrow, face-oval boundary) - inme se koi bhi point hair strands ko trace nahi karta, kyunki hair ki koi fixed anatomical shape nahi hoti (length/style/volume person-to-person, aur ek hi person ke liye din-ba-din, poori tarah alag hota hai). Isliye HAIR ko **pixel-level segmentation** chahiye - "is pixel pe hair hai ya nahi" - landmark ring nahi.

Ye app already `@mediapipe/tasks-vision` (`package.json`, version `1.0.1`) use kar rahi hai `FaceLandmarker` ke liye - **wahi package** ek dusra task bhi export karta hai jo exactly ye deta hai: `ImageSegmenter` (`node_modules/@mediapipe/tasks-vision/vision.d.ts` me confirm kiya - `segment()`/`segmentForVideo()` dono sync-return aur callback variants, `ImageSegmenterResult.confidenceMasks: MPMask[]` per-pixel [0,1] confidence, aur `categoryMask: MPMask` hard per-pixel class id). Koi nayi npm dependency nahi chahiye - bilkul `FaceLandmarker` jaisa hi, bas ek naya self-hosted model file chahiye (Google ka published **Hair Segmenter** model - 2-class output, background vs hair - jaisa `face_landmarker.task` already `public/models/tryon/` me self-hosted hai [FaceLandmarkerCache.ts](../../src/classes/tryon/FaceLandmarkerCache.ts)'s comments dekho, exact wahi hosting-pattern reuse hoga - Google ke CDN se ek baar download karke apne origin pe rakhna, `vercel.json` me immutable cache header).

**Confidence mask vs category mask - confidence lena hai**: `categoryMask` (`Uint8ClampedArray`, hard 0/1 per pixel) hair ke edges pe jagged/aliased dikhega - koi soft transition nahi. `confidenceMasks` (`Float32Array`, 0-1 per pixel) exactly wahi "soft-edged" quality deta hai jo is app ke har existing blob/wash primitive (`drawFeatheredBlob`, `fillFaceOvalRegion`) already prioritize karte hain - isliye `ImageSegmenterOptions.outputConfidenceMasks: true, outputCategoryMask: false` sahi choice hai.

**Recolor technique - naya hai, kisi FACE/EYE primitive se nahi milta**: Har existing category (LIP/FACE/EYE) apna color ek flat alpha-composited fill se laga rahi hai - `ctx.fillStyle` + `globalAlpha`, `source-over`. Hair pe wahi technique lagane se natural strand shading/highlights poori tarah flat ho jaate (ek solid color patch jaisa dikhega, hair jaisa nahi). Iski jagah Canvas2D ka built-in `globalCompositeOperation = 'hue'` ya `'color'` blend mode use karna sahi technique hai - ye dono sirf hue/saturation badalte hain, underlying luminance (yaani natural shine, strand-to-strand shading, highlights) ko preserve karte hain - real hair-color AR filters isi tarah ka hue-preserving blend use karte hain, flat overpaint nahi. Concretely: confidence mask ko ek offscreen alpha layer banao (target color, per-pixel alpha = confidence value), phir usko main canvas pe `'color'` (ya `'hue'`) composite mode se, `state.range`-driven `globalAlpha` ke saath draw karo. Ye is poore app ka **pehla** effect hoga jo flat `source-over` alpha-fill se hatke koi blend mode use karta hai - koi existing LIP/FACE/EYE primitive isse directly nahi deta, genuinely naya canvas math hai (lekin standard, well-supported Canvas2D API - koi shader/WebGL nahi chahiye).

## Engine architecture - shared `TryOnEngineBase` reuse nahi ho sakta as-is

Ye sabse important finding hai, aur koi bhi HAIR code likhne se pehle explicitly likh dena zaroori tha: `TryOnEngineBase`'s apna doc comment khud ko "category-agnostic engine machinery shared by every Try-On category (LIP today, EYE/FACE/HAIR later)" bolta hai - lekin ye galat nikla, code directly check karne pe:

- `TryOnEngineBase.startTryOn()` ([TryOnEngineBase.ts:213](../../src/classes/tryon/TryOnEngineBase.ts)) seedha `getSharedFaceLandmarker(...)` call karta hai - kisi generic "detector" abstraction ke peeche nahi, hardcoded.
- `withLiveCamera`'s render loop ([withLiveCamera.ts:181](../../src/classes/tryon/withLiveCamera.ts)) seedha `this.landmarker.detectForVideo(this.video, performance.now())` call karta hai.
- `withImageUpload` ([withImageUpload.ts:53,67](../../src/classes/tryon/withImageUpload.ts)) seedha `this.landmarker.detect(img)` call karta hai.
- `IRenderTargetParams` (`types/tryon-types/index.ts:23`) - jo `IRenderEffectBaseParams` aur `IApplyEffectParams` dono ki base hai - apna pehla field hi `face: NormalizedLandmark[]` hai.

Yaani "sabhi categories reuse kar sakti hain" wala shared infra (`TryOnEngineBase` + dono mixins + poora render-param type hierarchy) apne core mein FaceLandmarker-shaped hai, kisi generic detector pe parametrized nahi. HAIR ka data shape (per-pixel confidence mask) is shape mein fit hi nahi hota - koi missing field nahi hai jo add kar de, poori foundation hi mismatch hai.

**Decision**: Is shared base class ko abhi generic banane ki koshish **na karo** - EYE/FACE ne already apne landmark-constants ke liye jo convention establish ki hai ("self-contained per category, cross-import ki bajaye duplicate karo"), wahi yahan bhi extend hoga, ek level upar. HAIR apna poora **parallel** hierarchy banayega:

- `HairSegmenterCache.ts` (`classes/tryon/`) - `FaceLandmarkerCache.ts` ka mirror, bas `FaceLandmarker` ki jagah `ImageSegmenter`, hair-segmenter model self-hosted.
- `HairEngineBase` (`classes/tryon/categories/hair/`) - `TryOnEngineBase` ka apna state/lifecycle/snapshot/compare-slider machinery reimplement karta hai (concept wahi hai, copy-paste jaisa hi rahega), bas `this.landmark`/`FaceLandmarker` ki jagah `this.mask`/`ImageSegmenter`.
- `withLiveCameraSegmentation`/`withImageUploadSegmentation` (naye mixins, existing do ka fork) - same RAF-loop/load-once-render-on-change shape, `segmentForVideo`/`segment()` call karte hain.
- `IHairRenderTargetParams { mask: ...; ctx; dimension }` (`types/tryon-types/hair.ts`) - `IRenderTargetParams` ko **extend nahi karta**, ek alag parallel base hai (isi wajah se memory me bhi note kar diya, taaki future me koi galti se HAIR ko `IRenderEffectBaseParams` pe force-fit karne ki koshish na kare).

**Open question yahi choti si hai**: NAIL ko bhi apna alag tracking model (hand/finger landmarks) chahiye hoga - jab wo build hoga, exact yehi decision phir se aayega (ek teesra parallel hierarchy, ya ab dono duplicate hone ke baad ek genuinely generic `TryOnEngineBase<TState, TAssets, TDetection>` banane ka time aa gaya - "rule of three"). Abhi ke liye HAIR akela hai, isliye duplicate karna hi sahi call hai - NAIL start hote waqt ye revisit karna.

## Subcategories - technique, buildability, complexity

HAIR ki 4 subcategories hain (`TRY_ON_MAP.HAIR`, `@beautinique/shared-constants` ke against confirm kiya): COLOR, HIGHLIGHTS, HENNA, OMBRE.

| Subcategory | Visual language                                                                          | Technique                                                                                                                                                                    | Reuses                                                                 | Complexity           |
| ----------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------- |
| COLOR       | Poore hair region ka full-strand recolor - sabse basic, sabse zyada visible              | Confidence-mask alpha layer + `'color'`/`'hue'` blend composite (upar Research dekho)                                                                                        | Kuch nahi (naya pipeline ka foundation) - saari baaki isi pe bani hain | Hard (first build)   |
| HENNA       | Same full-strand recolor, bas fixed warm reddish-brown target hue                        | COLOR jaisa hi exact primitive, alag target RGB                                                                                                                              | COLOR ka poora pipeline, zero naya code                                | Easy (COLOR ke baad) |
| OMBRE       | Root pe natural, tip ki taraf gradually recolored/lighter - real ombre ka signature look | COLOR ka mask + ek vertical linear-gradient alpha ramp (root=0, tip=1) multiply kiya hua - dono alpha sources ko per-pixel multiply karna hai                                | COLOR ka mask-compositing math, `ctx.createLinearGradient` (naya)      | Medium               |
| HIGHLIGHTS  | Poore hair mein selective streak-shaped lighter/colored strands                          | Ek procedural stripe/noise pattern (naya - randomized soft vertical streaks) ko hair-confidence-mask se multiply karke ek "subset mask" banao, phir COLOR jaisa hi composite | COLOR ka mask-compositing math, streak-pattern generation naya hai     | Hard                 |

**Honest ceiling**: confidence mask sirf "ye pixel hair hai" batata hai, "ye kaunsi individual strand hai ya uski direction kya hai" nahi - is app me kahin bhi real per-strand tracking possible nahi hai. Isliye HIGHLIGHTS **true per-strand highlighting nahi** de sakta - jo milega wo "hair region ke andar procedurally-placed streak-shaped tinted patches" hai, real balayage/foil-highlight jaisa exact nahi, lekin phir bhi genuinely visible aur distinct effect hai (near-invisible risk nahi - ek colored streak pattern clearly dikhega, chahe wo real highlighting se thoda approximate ho).

_Build note_: Kisi bhi subcategory ko drop karne ki zaroorat nahi padi - chaaron genuinely visible/distinct effect de sakte hain is app ke constraint ke saath bhi. HIGHLIGHTS sabse zyada uncertain hai (naya procedural pattern chahiye, exact algorithm abhi decide nahi hua - neeche Open questions dekho), isliye sabse last.

## Suggested build order

1. **COLOR** - poore naye segmentation-based pipeline (`HairSegmenterCache` → `HairEngineBase`/`HairLiveEngine`/`HairUploadEngine` → mask-compositing primitive) ko end-to-end validate karta hai. Sabse zyada upfront infra cost isi mein hai, baaki teeno usi ke upar bante hain.
2. **HENNA** - COLOR ke turant baad, kyunki ye literally same primitive hai bas alag target hue - EYE ke "EYELINER + KAJAL saath mein" jaisa hi "ek build ki price mein do subcategories" pattern.
3. **OMBRE** - COLOR ka mask-compositing math reuse karta hai, bas ek naya vertical-gradient-alpha step add karta hai - genuinely naya lekin chhota increment.
4. **HIGHLIGHTS** - naya procedural streak-pattern chahiye, sabse uncertain/least-proven math, isliye baaki teeno ke baad jab poora pipeline already stable ho chuka ho.

## Proposed architecture

- `IHairTryOnState = IMakeupState<THairFinish>` - **koi extension nahi chahiye**, koi bhi HAIR subcategory ko EYE jaisa "pattern/style" dimension nahi chahiye (sab chaar effectively ek hi masked-recolor idea ke variants hain, alag target-color/gradient logic ke saath).
- `IHairRenderTargetParams { mask: Float32Array (ya jo bhi processed shape ho); ctx: CanvasRenderingContext2D; dimension: TDimension }` (naya `types/tryon-types/hair.ts`) - `IRenderTargetParams` ko extend **nahi** karta (upar Engine architecture section dekho, wajah).
- `IHairRenderEffectBaseParams extends IHairRenderTargetParams { alpha: number }` - `IRenderEffectBaseParams` ka apna parallel, same shape/spirit, alag base.
- `IHairRenderParams extends IHairRenderEffectBaseParams { rgb: TRGBTuple }` (COLOR/HENNA ke liye) - OMBRE/HIGHLIGHTS apne extra fields (gradient bounds / streak-seed) isi ko aage extend karke add karenge, jaisa `ILipSingleTextureRenderParams` LIP ke base ko extend karta hai.
- `HairSegmenterCache.ts`, `HairEngineBase`, `HairLiveEngine`, `HairUploadEngine`, naye mixins - upar Engine architecture section mein already describe kiya.
- Render functions naye `utils/tryon-utils/hair.ts` mein - is app ka established "self-contained per category" convention follow karte hue.

## Open questions - build karte waqt decision chahiye

1. **Face-detection step chahiye ya nahi?** README ki tracking-model line "chahe head region locate karne ke liye face-detection step share kar sake" keh chuki thi - lekin real hair-segmenter models poore frame pe directly kaam karte hain, kisi face bounding-box crop ki zaroorat nahi hoti. **Recommendation**: pehle `ImageSegmenter` akele try karo (ek hi model load, `FaceLandmarker` ke bina) - simpler aur lighter. Sirf agar real-device testing mein accuracy poor nikle tab hi ek face-detection pre-step add karne pe socho.
2. **Live-mode performance**: ek segmentation model per-frame real-time video pe chalana landmark detection se zyada heavy ho sakta hai (poore frame ka per-pixel classification vs 478 discrete points) - is app ka pehla case hoga jahan Live mode ka FPS genuinely risk mein ho sakta hai. Isse jald hi real device pe test karna chahiye (COLOR ban jaane ke turant baad), na ki sabse last real-device-QA pass tak wait karke.
3. **HIGHLIGHTS ka streak-pattern algorithm** abhi khula hai - kitni streaks, kitni width/spacing, deterministic seed (jaisa EYEBROW ke hair-stroke patterns ka apna deterministic jitter tha) ya per-frame random. Build karte waqt decide karna hai, COLOR/HENNA/OMBRE ko block nahi karta.
4. **Model source/exact file**: Google ka published Hair Segmenter model (`hair_segmenter.tflite`, MediaPipe model zoo) download/self-host karna hoga, `face_landmarker.task` jaisa hi pattern - exact download step build session mein hoga, is doc ka scope nahi.

## Next steps

COLOR se start karo (poora naya pipeline validate karta hai, baaki sab isi pe depend karte hain). Same per-finish pipeline jo har LIP/FACE/EYE finish already use kar chuki hai, bas ek naya infra-step upar: **naya segmentation model self-host** → `HairSegmenterCache` → `HairEngineBase`/mixins → `utils/tryon-utils/hair.ts` (mask-compositing primitive) → COLOR render function → smoke test → synthetic visual check → real-device performance spot-check (Open question 2) → tracker doc. Us ke baad HENNA (near-zero cost), phir OMBRE, phir HIGHLIGHTS.

---

[← Back to master tracker](./README.md) · [← Back to HAIR category](./HAIR.md)
