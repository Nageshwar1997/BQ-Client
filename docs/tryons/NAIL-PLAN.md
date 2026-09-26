# NAIL Category — Build Plan

[← Back to master tracker](./README.md) · [← Back to NAIL category](./NAIL.md)

_Planning doc, koi bhi NAIL code likhne se pehle likha gaya - same reason [EYE-PLAN.md](./EYE-PLAN.md)/[HAIR-PLAN.md](./HAIR-PLAN.md) apni alag doc mein hain, chat log mein dabi hui nahi. Progress tracker nahi hai (wo [NAIL.md](./NAIL.md) hai, abhi bhi saare unbuilt placeholders) - ye un **design decisions** ko capture karta hai jo koi bhi code likhne se pehle liye gaye._

## Ye doc kyun banaya

[README.md](./README.md)'s apna shared-prerequisites list shuru se hi flag kar chuka tha: _"Hand/finger-landmark tracking engine select + integrate — sirf NAIL ke liye alag model chahiye"_ - abhi tak unchecked. NAIL LIP/EYE/FACE se bhi alag hai aur HAIR se bhi - teeno alag tracking foundations chahiye is poore feature mein (face mesh, pixel segmentation, ab hand skeleton). Ye doc HAIR-PLAN.md jaisa hi research karta hai: NAIL ka sahi tracking model kya hoga, real nail-plate shape approximate karne ka sahi technique kya hai (ek confirmed **honest ceiling** ke saath - koi ready-made nail-segmentation model exist nahi karta, HAIR ke Hair Segmenter jaisa), shared `TryOnEngineBase` reuse ho sakta hai ya nahi, 5 subcategories ka apna build order, aur proposed architecture.

## Research: NAIL ka tracking model kya hoga

**Hand landmarks - `HandLandmarker`**: `@mediapipe/tasks-vision` (already installed, same package jo `FaceLandmarker`/`ImageSegmenter` deta hai) ek teesra task bhi export karta hai: `HandLandmarker` - `node_modules/@mediapipe/tasks-vision/vision.d.ts` mein confirm kiya. Har detected hand ke liye 21 standard, publicly-documented "hand-knuckle" landmarks deta hai (wrist + har finger ke 4 joints - thumb: CMC/MCP/IP/TIP, baaki 4 fingers: MCP/PIP/DIP/TIP) - MediaPipe ka apna long-standing hand-topology standard, `FACEMESH_FACE_OVAL` jaisa hi public data, proprietary nahi. `numHands` option se multiple hands ek saath detect ho sakte hain (default 1, hum `2` use karenge - real nail try-on mein aksar dono haath dikhte hain). `detect()`/`detectForVideo()` **synchronous** hain (`FaceLandmarker` jaisa hi, `ImageSegmenter`'s apne callback-vs-sync-copy-cost tradeoff jaisa kuch nahi hai yahan - koi documented "high-throughput mein mat use karo" warning nahi mili) - matlab Live mode ka per-frame loop bhi `withLiveCamera`'s original shape jaisa hi simple reh sakta hai, HAIR ke segmentation-specific callback complexity ki zaroorat nahi.

**Model self-hosting**: Google ka published Hand Landmarker model (`hand_landmarker.task`, ~7.8MB float16) - `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task` (official docs se confirm kiya, URL directly hit karke verify bhi kiya - HTTP 200). `face_landmarker.task`/`hair_segmenter.tflite` jaisa hi self-host hoga (`public/models/tryon/hand_landmarker.task`) - same 1-hour `Cache-Control` problem, same `vercel.json`'s existing `/models/(.*)` rule already isse cover karta hai.

**Honest ceiling - koi real nail-segmentation model exist nahi karta**: HAIR ke liye Google ka apna published Hair Segmenter tha (ek off-the-shelf, ready-to-self-host model) - NAIL ke liye aisa kuch nahi hai. Web research se confirm kiya: real production nail try-on apps (jaise academic paper "Nail Polish Try-On: Realtime Semantic Segmentation of Small Objects" aur "Nailed" jaisi apps) MediaPipe HandLandmarker se hand/finger detect karte hain, **phir** ek custom-trained nail-specific model (jaisa ek chhota U-Net) se actual nail-plate shape segment karte hain - ye custom model kahin bhi ready-made, license-clear, drop-in available nahi hai jaisa Hair Segmenter tha. Isliye NAIL ko HAIR ka pixel-segmentation approach copy nahi karna - iski jagah wahi **landmark + geometric approximation** technique chahiye jo is app ke har doosre category (FACE_OVAL, EYEBROW ring, CONCEALER's under-eye blob) already use kar rahi hai: fingertip (`TIP`) aur uske pehle wale joint (`DIP`, thumb ke liye `IP`) ke beech ka vector lo, usi vector pe ek chhota ellipse/rounded-rect anchor karo (nail plate ka approximate shape), finger ke apne local direction pe **rotate** karke (naya - FACE ke blobs kabhi rotate nahi karte the, kyunki face hamesha roughly upright hota hai, lekin fingers kisi bhi direction mein point kar sakte hain).

## Engine architecture - shared `TryOnEngineBase` phir bhi reuse nahi ho sakta, lekin HAIR jitna alag nahi

`HandLandmarkerResult.landmarks` ek `NormalizedLandmark[][]` hai (**multiple** hands, har ek apna 21-point array) - `TryOnEngineBase`/`IRenderTargetParams` ka `face: NormalizedLandmark[]` (ek hi face) is shape ko fit nahi karta, aur `TryOnEngineBase.startTryOn()` phir bhi `getSharedFaceLandmarker` ko hardcoded call karta hai (HAIR-PLAN.md ka wahi finding). Isliye NAIL ko bhi apna parallel engine chahiye - lekin HAIR jitna divergent nahi, kyunki `HandLandmarker`'s sync `detect`/`detectForVideo` shape `FaceLandmarker`'s shape ke bahut kareeb hai (koi callback/mask-lifetime complexity nahi jo `ImageSegmenter` ne majboor kiya tha).

Proposed: `HandEngineBase` (`TryOnEngineBase`'s bilkul close mirror, bas `this.landmark: FaceLandmarkerResult` ki jagah `this.hands: NormalizedLandmark[][]`, `getSharedFaceLandmarker` ki jagah `getSharedHandLandmarker`) + `withLiveCameraHands`/`withImageUploadHands` (`withLiveCamera`/`withImageUpload` ka fork, bas sync `detectForVideo`/`detect` seedha call karte hain - `withLiveCameraSegmentation`'s callback-based loop jitna divergent nahi). `INailRenderTargetParams { hands: NormalizedLandmark[][]; ctx; dimension }` (`types/tryon-types/nail.ts`) - `IRenderTargetParams` extend nahi karta (same reasoning `IHairRenderTargetParams`'s apna tha - `face` field yahan meaningful nahi hai, plural `hands` chahiye).

## Subcategories - technique, buildability, aur final decision

NAIL ki 5 subcategories hain (`TRY_ON_MAP.NAIL`, `@beautinique/shared-constants` ke against confirm kiya): GEL, LIQUID, DIPPOWDER, GLITTER, CHROME. Kisi ko bhi drop nahi kiya - nail polish shade-driven products hain, SKIN jaisa koi "shade hi nahi hoti" ambiguity nahi hai, aur landmark+geometry se ek genuinely visible painted-nail effect milta hai (HAIR ke fallback-risk jaisa "kuch hua hi nahi" concern yahan nahi).

| Subcategory | Visual language                                | Technique                                                                                                                                            | Reuses                                                               | Complexity            |
| ----------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------- |
| LIQUID      | Standard nail-polish finish - flat, even color | Har fingertip pe ek rotated ellipse/rounded-rect fill (naya "per-finger anchor+rotate" primitive)                                                    | Kuch nahi (naya pipeline ka foundation) - baaki sab isi pe bane hain | Hard (first build)    |
| GEL         | Glossy finish - shine ka ek concentrated point | LIQUID ka fill + ek chhota feathered highlight blob (HIGHLIGHTER ki apni technique, nail region ke andar)                                            | LIQUID ka poora fill primitive + `drawFeatheredBlob`-jaisi technique | Easy (LIQUID ke baad) |
| DIPPOWDER   | Matte-textured finish                          | LIQUID ka fill + `desaturateTowardGray` (COMPACTPOWDER ki apni technique)                                                                            | LIQUID ka poora fill primitive + COMPACTPOWDER ka color-math         | Easy (LIQUID ke baad) |
| GLITTER     | Sparkle-particle overlay                       | LIQUID ka fill + fixed-seed procedural sparkle-dots (HIGHLIGHTS ke streak-pattern jaisa hi "deterministic PRNG" technique, per nail chhota scale pe) | LIQUID ka fill + HIGHLIGHTS ka `createSeededRandom` pattern          | Medium                |
| CHROME      | Mirror-metallic reflective overlay             | LIQUID ka fill ki jagah ek metallic-sheen linear gradient (light-dark-light bands, koi real reflection/lighting model nahi)                          | Koi existing primitive nahi - naya gradient technique                | Hard                  |

_Build note_: LIQUID sabse zyada upfront cost leta hai (naya per-finger rotate+anchor geometry primitive) - GEL/DIPPOWDER us primitive pe seedha existing FACE color-math techniques laga dete hain, zero naya geometry. GLITTER ko HIGHLIGHTS ka hi deterministic-PRNG pattern chhote scale pe chahiye. CHROME sabse uncertain hai - koi real lighting model ke bina "metallic" sirf ek static gradient illusion hai, jaisa HIGHLIGHTS real balayage jaisa exact nahi tha.

## Suggested build order

1. **LIQUID** - poore naye per-finger geometry pipeline (`HandLandmarkerCache` → `HandEngineBase`/mixins → `utils/tryon-utils/nail.ts`'s anchor+rotate primitive) ko end-to-end validate karta hai.
2. **GEL, phir DIPPOWDER** - dono LIQUID ke exact fill primitive pe existing FACE color-math techniques (highlight blob / desaturate) laga dete hain, near-zero marginal cost - EYE ke "EYELINER + KAJAL saath mein" jaisa hi pattern.
3. **GLITTER** - HIGHLIGHTS ka deterministic-PRNG streak-pattern technique chhote per-nail scale pe adapt karna hai.
4. **CHROME** - naya metallic-gradient technique, sabse last, sabse uncertain math.

## Proposed architecture

- `INailTryOnState = IMakeupState<TNailFinish>` - **koi extension nahi chahiye**, EYE jaisa "pattern/style" dimension yahan nahi hai (GEL/LIQUID/DIPPOWDER/GLITTER/CHROME khud hi finish-type hain, LIP ke MATTE/GLOSS/SHIMMER jaisa) - COLOR/HENNA/OMBRE/HIGHLIGHTS ka HAIR ke liye jo conclusion tha, wahi yahan bhi.
- `HandLandmarkerCache.ts` (`FaceLandmarkerCache.ts` ka mirror, `HandLandmarker`, `numHands: 2` ke saath).
- `HandEngineBase` (`TryOnEngineBase` ka close mirror) + `withLiveCameraHands`/`withImageUploadHands` (`withLiveCamera`/`withImageUpload` ka fork, sync detect).
- `NailEngineBase` (`HandEngineBase` extend karta hai, `FaceEngineBase` jaisa hi role) + `NailLiveEngine`/`NailUploadEngine`.
- `INailRenderTargetParams`/`INailRenderEffectBaseParams`/`INailRenderParams`/`IApplyNailEffectParams` (`types/tryon-types/nail.ts`) - `IHairRenderTargetParams` jaisa hi parallel hierarchy, `hands: NormalizedLandmark[][]` carry karte hain.
- Render functions `utils/tryon-utils/nail.ts` mein - naya "per-finger anchor (TIP/DIP se), local-direction rotate, ellipse/rounded-rect fill" primitive, jise GEL/DIPPOWDER/GLITTER/CHROME sab reuse karenge.
- `constants/tryon-constants/nail.ts` - MediaPipe ka standard hand-landmark topology (finger tip/dip index arrays), nail-width/length ratios (FACE ke apne approximate-constants jaisa hi "expected to get real-device tuned" judgment calls).

## Open questions - build karte waqt decision chahiye

1. **Palm vs back-of-hand kaise handle karein**: nails sirf tab dikhte hain jab hand ka peeche wala hissa camera ki taraf ho - landmarks khud ye distinguish nahi karte (dono orientations mein wahi 21 points milte hain). Geometrically detect karna (cross-product/winding-order se) possible hai lekin uncertain/complex - **recommendation**: FACE ke turned-head problem jaisa hi handle karo, algorithmically fix karne ki koshish mat karo - instructions screen mein explicitly bolo "hand ka peeche wala hissa (nails wala side) camera ki taraf rakhein".
2. **`numHands: 2` ka performance cost**: do hands process karna ek hand se zyada compute leta hai per frame - Live mode mein real-device pe genuinely check karna hoga (HAIR ke apne segmentation-performance open question jaisa hi).
3. **Nail-shape ratios** (width/length TIP-DIP segment ke against, kitna tip se aage extend kare) - abhi koi real reference nahi hai, build karte waqt visually tune karna hoga.
4. **CHROME ka gradient direction** - fixed (jaise hamesha top-left se) ya finger ke apne rotation ke saath consistent rahe - build karte waqt decide karna hai, LIQUID/GEL/DIPPOWDER/GLITTER ko block nahi karta.

## Next steps

LIQUID se start karo (poora naya hand-tracking + per-finger-geometry pipeline validate karta hai). Same per-finish pipeline jo har LIP/FACE/EYE/HAIR finish already use kar chuki hai, bas ek naya infra-step upar: **naya `hand_landmarker.task` self-host** → `HandLandmarkerCache` → `HandEngineBase`/mixins → `utils/tryon-utils/nail.ts` (anchor+rotate fill primitive) → LIQUID render function → smoke test → real-device performance spot-check (Open question 2) → tracker doc. Us ke baad GEL + DIPPOWDER (dono near-zero marginal cost), phir GLITTER, phir CHROME.

---

[← Back to master tracker](./README.md) · [← Back to NAIL category](./NAIL.md)
