# FACE Try-On Tracker

[← Back to master tracker](./TRYON.md)

_Tracking model: face landmarks + full-face segmentation. Depends on the shared face-landmark engine — see [TRYON.md](./TRYON.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Ab saari 8 subcategories ka poora detail (checklist, design notes, quality score) is file mein hi consolidate kar diya gaya hai** - pehle har ek ki apni alag dedicated tracker file thi, ab woh files hata di gayi hain, taaki poori "kya kiya aur kyun kiya" history ek hi jagah rahe.
>
> **10/10 push**: code-side push complete + user ne khud real-device pe real-device QA checklist pass kiya - **"sab sahi he", koi bug nahi mila**. **FACE category ki saari 8 subcategories (FOUNDATION samet) ab poori tarah 10/10 hain** - poora detail upar "10/10 Push & Real-Device QA History" section mein hai.

## Summary

| Subcategory   | Live      | Upload    | Overall            |
| ------------- | --------- | --------- | ------------------ |
| CONCEALER     | 4/4       | 4/4       | 100% ✅             |
| FOUNDATION    | 4/4       | 4/4       | 100% ✅             |
| HIGHLIGHTER   | 4/4       | 4/4       | 100% ✅             |
| BLUSH         | 4/4       | 4/4       | 100% ✅             |
| CONTOUR       | 4/4       | 4/4       | 100% ✅             |
| BRONZER       | 4/4       | 4/4       | 100% ✅             |
| BBCREAM       | 4/4       | 4/4       | 100% ✅             |
| COMPACTPOWDER | 4/4       | 4/4       | 100% ✅             |
| **Total**     | **32/32** | **32/32** | **100% ✅ (64/64)** |

## Details

<details>
<summary><strong>CONCEALER</strong> — 100% ✅</summary>

### Checklist

**Live**

- [x] Camera capture + under-eye/blemish-region tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, under-eye indices samet, extra wiring nahi chahiye.
- [x] Spot-blend color correction real-time me render hota hai — `applyConcealerFace` ko `FaceEngineBase.applyEffect`'s switch mein `'CONCEALER'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION/BLUSH jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional (product variants se linked) — generic FACE UI, FOUNDATION/BLUSH ke liye already proven working, CONCEALER-specific change nahi chahiye.
- [x] Performance & cross-device QA (FPS, lighting conditions) — user ne real-device pe real-device QA checklist pass kiya, "sab sahi he" - koi FPS/lag issue report nahi hua.

**Upload**

- [x] Photo upload + under-eye/blemish-region detection static image pe — FOUNDATION/BLUSH jaisa hi shared upload pipeline.
- [x] Spot-blend color correction image pe apply hoti hai — same `applyConcealerFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [x] Output preview/download QA — real-device pass mein confirm hua.

### Design notes

- **Sirf under-eye, blemish-spot detection nahi**: koi landmark data hai hi nahi jo ek actual blemish ki taraf point kar sake (uske liye real skin-defect analysis chahiye, landmark-only approach ke scope se bahar - same reasoning jisne FOUNDATION ke liye hair-detection deliberately drop karwaya tha, uski apni bug log dekho). Under-eye brightening ek concealer use case hai jo har shopper genuinely rakhta hai, isliye yahi cover kiya gaya.
- **Ellipse, circle nahi**: BLUSH ka `drawFeatheredBlob` sirf circle hi draw karta tha. Ise generalize kiya gaya taaki independent `radiusX`/`radiusY` le sake (ek non-uniform canvas scale circle ko ellipse bana deta hai) taaki CONCEALER ka under-eye shape tall se zyada wide ho sake, real crescent se match karte hue - `radiusX === radiusY` BLUSH ke apne call/output ko byte-for-byte pehle jaisa hi rakhta hai.
- **Anchor + offset, koi dedicated landmark nahi**: MediaPipe ka mesh sirf eyelid margin cover karta hai, under-eye hollow ko khud nahi - `applyConcealerFace` eye ring ke apne bottom-center point ko leta hai aur ise detected face height ke `UNDER_EYE_OFFSET_RATIO` se neeche push karta hai, hollow mein land karta hai, seedha lash line pe nahi.
- **Eyes explicitly erase hote hain**: BLUSH ke ulat (jiska cheek-apple anchor kisi bhi excluded cheez se itna door hai ki gradient ka soft tail kabhi wahan tak pahunchta hi nahi), CONCEALER ka anchor design se eye ke bilkul paas baitha hai - iska gradient ka upward tail realistically eyelid/eye opening pe bleed kar sakta tha. `eraseEyes` (same independent `destination-out` technique jo `eraseExcludedFeatures` full-face finishes ke liye already use karta hai) guarantee karta hai ki aisa kabhi nahi hota, anchor/offset numbers baad mein kaise bhi tune ho jaayein.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (149/149, `applyConcealerFace` ke 2 tests - smoke + naya dedicated eye-erase test - samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte (FOUNDATION/BLUSH ki apni history mein noted same limitation), isliye real dev-server pe ek real model photo (Ruby Red shade) pe browser mein chalake bhi confirm kiya ki ellipses eyes ke neeche land hote hain, correctly feather hote hain, aur eyes khud kabhi tint nahi hote - visually aur pixel-level dono confirm hua, lekin ye Live-mode real-device QA ka substitute nahi hai.

### Quality score

Same 9 dimensions used for LIP.md, FOUNDATION (upar isi file mein), and BLUSH.

> **Status**: FACE ka poora 10/10 push code-side complete hua (detail upar "10/10 Push & Real-Device QA History" section mein hai), phir user ne khud real-device QA checklist real device pe pass kiya - **"sab sahi he", koi bug nahi mila**. **9/9 dimensions 10/10** ✅, plan complete.

| #   | Dimension            | Score       | Kyun                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | **10/10** ✅ | Missing-landmark guard, face-oval clip safety net, eye-erase, turn-detection guard sab present, aur ab real-device pe bhi koi gap nahi mila.                                                                                                                                                                                                                                                |
| 2   | Test coverage        | **10/10** ✅ | Dedicated test - "punches a fully transparent hole exactly at each eye, even though the under-eye blob paints nearby" - CONCEALER ki poori distinct logic (eye-erase pass) yehi test karta hai, plus shared turn-detection (`isFaceTurnedTooMuch`, 6 tests) already inherited - FOUNDATION jitni hi depth jitna CONCEALER ke paas actually apna logic hai, kuch aur test-worthy nahi bacha. |
| 3   | Docs accuracy        | 10/10 ✅     | Ye file abhi accurate hai.                                                                                                                                                                                                                                                                                                                                                                  |
| 4   | Real-device QA       | **10/10** ✅ | User ne khud real-device QA checklist real device pe pass kiya - "sab sahi he", koi bug nahi mila.                                                                                                                                                                                                                                                                                          |
| 5   | UX polish            | **10/10** ✅ | FOUNDATION/BLUSH ke fixes (overlay a11y, turn-icon) automatically inherited hain - real-device pass mein bhi koi UX gap report nahi hua.                                                                                                                                                                                                                                                    |
| 6   | Architecture         | 10/10 ✅     | Zero engine-level change - ek naya render fn + ek switch case, bilkul FOUNDATION/BLUSH jaisa reuse. `drawFeatheredBlob` ka ellipse-generalization bhi BLUSH ko break nahi karta.                                                                                                                                                                                                            |
| 7   | Feature completeness | 10/10 ✅     | Rendering fully implemented aur wired hai (`applyConcealerFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                                                                                                                                                                                                                                       |
| 8   | Performance          | **10/10** ✅ | Code-side cost-profile BLUSH jaisa hi tha, aur real-device pass mein koi FPS/lag issue report nahi hua.                                                                                                                                                                                                                                                                                     |
| 9   | Code hygiene         | 10/10 ✅     | Fresh scan - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                                                                                                                                                     |

**Overall**: **10/10** ✅ — plan complete, FOUNDATION/LIP jaisa hi. Test coverage ka apna 10/10 real justification se hai (CONCEALER ki poori distinct logic already tested hai), real-device confirmation se nahi.


</details>

<details>
<summary><strong>FOUNDATION</strong> — 100% ✅</summary>

### Checklist

**Live**

- [x] Camera capture + full-face landmark tracking wired
- [x] Full-face base-tone blend rendered in real-time
- [x] Shade/variant picker functional (linked to product variants)
- [x] Performance & cross-device QA (FPS, lighting conditions) — real device (mobile + laptop) pe end-to-end confirm hua, user ne "baaki sab sahi tha" bola.

**Upload**

- [x] Photo upload + full-face landmark detection on static image
- [x] Full-face base-tone blend applied to image
- [x] Shade/variant picker functional
- [x] Output preview/download QA — real device pe confirmed.

### Bugs found + fixed this session (real user testing se)

Sab already live-verified/pixel-diff-verified is session ke andar hi, code mein:

- [x] Forehead coverage — raw landmark oval hairline pe hi rukta tha, real forehead skin miss ho rahi thi. Fix: `applyForeheadExtension` (points ko upar taper ke saath push karta hai).
- [x] Sharp/faceted edges (eyebrows, face-oval) — plain `lineTo` polygon tha. Fix: `traceSmoothClosedPath` (quadratic-curve smoothing, LIP ke `applyLipTexture` wali hi technique).
- [x] Mouth-open bug — muh khulne pe andar (teeth/interior) tak tint chala jaata tha. Fix: `MOUTH_OUTER_CONTOUR_INDICES` (ek hi ring poori mouth-opening ke around, upper+lower band alag-alag nahi).
- [x] Hair/beard/mustache pe tint lagna — pehle ek pixel-color skin-detection heuristic try kiya (luminance/saturation based), lekin genuinely darker skin tones ko galat "hair" samajh leta tha - **fairness bug**, sirf tuning issue nahi. Poora hata diya. Fix: ab sirf landmark-geometry, hair-avoidance instructions screen pe hi hai (`FACE_UPLOAD_INSTRUCTIONS`/`FACE_LIVE_INSTRUCTIONS`).
- [x] Turned-head par eyebrow/eye/lips tak tint leak hona — eyes/eyebrows/mouth pehle outer-oval ke SAME evenodd path mein the; ek angle par ek feature ka apna ring self-intersect kar sakta tha, jo poore combined path ka count hi galat kar deta. Fix: `eraseExcludedFeatures` - har feature apna independent `destination-out` erase hai, ek doosre se cross-talk nahi.
- [x] Turned-head par tint nose ke aage tak "bulge" karna (occlusion-unaware 2D projection) — genuinely landmark-only approach se pura solve nahi ho sakta (real 3D/depth chahiye). Fix (mitigation): real-time turn-detection overlay - `isFaceTurnedTooMuch` (nose-tip se dono cheekbones ki symmetry check karta hai), turned-too-much hone par render hi nahi hota, user ko "face the camera directly" overlay dikhta hai.

**Real-device QA se mile (mobile pe, laptop pe kabhi nahi dikhe):**

- [x] **Mobile pe tint bilkul apply hi nahi ho raha tha** (koi error, koi overlay bhi nahi) — `applyFoundationFace` tint ko ek **blank/transparent temp canvas** pe `multiply` blend mode se fill karta tha. Desktop Chrome ka canvas engine is edge-case (blend mode + fully-transparent backdrop) ko spec ke hisaab se handle karta hai (normal color dikha deta hai), lekin us mobile browser ka engine isi case ko sahi handle nahi karta tha - poora paint hi drop ho jaata tha (fully transparent result), same photo/landmarks/color ke bawajood. Diagnose kiya on-screen debug readout se (2 rounds: state values, phir before/after-erase pixel samples - laptop pe `pixelAlpha: 31`, mobile pe `pixelAlpha: 0`, dono erase se PEHLE hi). Fix: `multiply` hata ke plain `source-over` (default) kar diya - ye hamesha se yehi effectively kar raha tha jaha kaam kar raha tha, ab har platform pe consistently kaam karta hai.
- [x] **"Face not in frame" false positive** — koi bhi turn na hone ke bawajood, poora face frame mein hone ke bawajood ye overlay kabhi-kabhi dikh jaata tha. Wajah: edge-margin check (`FACE_FRAME_EDGE_MARGIN`) bahut tight tha (`0.002`, poore 478-point mesh ke bounding box pe) - mobile selfie typically desktop webcam se kaafi paas hoti hai, isliye face-oval ke outer points (ears/jaw) raw frame ke edge ke bahut kareeb chali jaati hain, bilkul normal framing mein bhi. Fix: margin `0.002 → 0.01` kiya - abhi bhi tight hai (genuinely cut-off face pakadega), bas thoda forgiving. Shared function hai (LIP bhi use karta hai) - loosening kabhi bhi LIP ko nuksaan nahi pahuncha sakta.

**Final end-to-end confirmation** (dono bug-fix ke baad, poora checklist against): user ne khud confirm kiya - forehead, rounded edges, mouth-open, turned-angle-overlay sab sahi the. Ek baat note ki: **hair pe halka tint lagta hai, jo already-documented, landmark-only-approach ka accepted trade-off hai** (upar dekho - pixel-based hair-detection deliberately hata diya gaya tha kyunki wo darker skin tones ke liye fairness bug tha) - user ne confirm kiya ki ye acceptable hai.

### Quality score

Same 9 dimensions jo LIP.md ke apne round ke liye use hue the. Poora journey upar is file mein hai.

> **Status**: **9/9 dimensions 10/10** ✅. User ne poora real-device QA checklist ke against end-to-end confirm kar diya - "baaki sab sahi tha". **Plan complete.**

| #   | Dimension            | Score       | Kyun                                                                                                                                                                                                                                                                   |
| --- | -------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | **10/10** ✅ | Real gap mila: `applyEffect` turned-head par bhi tint render kar raha tha (overlay ke semi-transparent scrim ke peeche se broken shape dikhta rehta). Fix kiya - ab `faceDetection === 'turned'` par render hi nahi hota.                                              |
| 2   | Test coverage        | **10/10** ✅ | `isFaceTurnedTooMuch` (6 tests, boundary case bhi) + `applyFoundationFace` smoke test (1 test) - LIP jitni hi depth jitna FOUNDATION ke paas actually data/logic hai.                                                                                                  |
| 3   | Docs accuracy        | **10/10** ✅ | Is file/FACE.md/TRYON.md sab accurate.                                                                                                                                                                                                                                 |
| 4   | Real-device QA       | **10/10** ✅ | Mobile pe test hui - **2 real bug mile aur fix hue** (tint bilkul apply na hona - `multiply`-on-blank-canvas cross-browser bug; false "not in frame" - edge-margin too tight). Uske baad poora real-device QA checklist user ne khud pass kiya - "baaki sab sahi tha". |
| 5   | UX polish            | **10/10** ✅ | Real gap mila: `TryOnOverlay` ke paas koi `role`/`aria-live` nahi tha (screen-reader user ko canvas-driven overlay ka koi signal nahi milta). Fix kiya - `role="alert"`/`"status"`. Turned-overlay ka icon bhi differentiate kiya.                                     |
| 6   | Architecture         | **10/10** ✅ | `FaceLandmarkerEngineBase`/mixins bina kisi change ke reuse hue.                                                                                                                                                                                                                |
| 7   | Feature completeness | **10/10** ✅ | FOUNDATION khud fully built hai.                                                                                                                                                                                                                                       |
| 8   | Performance          | **10/10** ✅ | Code-side pehle se solid tha (LIP ke already-accepted per-frame patterns jaisa hi cost-profile) - real-device pass mein koi FPS/lag/thermal issue report nahi hua.                                                                                                     |
| 9   | Code hygiene         | **10/10** ✅ | Fresh scan (naye edits including) - zero matches.                                                                                                                                                                                                                      |


</details>

<details>
<summary><strong>HIGHLIGHTER</strong> — 100% ✅</summary>

### Checklist

**Live**

- [x] Camera capture + cheekbone/brow-bone landmark tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, cheekbone indices samet, extra wiring nahi chahiye.
- [x] Glow overlay high points ke saath real-time me render hota hai — `applyHighlighterFace` ko `FaceEngineBase.applyEffect`'s switch mein `'HIGHLIGHTER'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION/BLUSH/CONCEALER jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional — generic FACE UI, FOUNDATION/BLUSH/CONCEALER ke liye already proven working, HIGHLIGHTER-specific change nahi chahiye.
- [x] Performance & cross-device QA — user ne real-device pe real-device QA checklist pass kiya, "sab sahi he" - koi FPS/lag issue report nahi hua.

**Upload**

- [x] Photo upload + cheekbone/brow-bone detection static image pe — FOUNDATION/BLUSH/CONCEALER jaisa hi shared upload pipeline.
- [x] Glow overlay high points ke saath image pe apply hoti hai — same `applyHighlighterFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [x] Output preview/download QA — real-device pass mein confirm hua.

### Design notes

- **Sirf cheekbone, brow-bone/nose-bridge/chin nahi**: ek real highlighter routine kayi high points hit karta hai, lekin BLUSH/CONCEALER ka apna v1 scope do anchors tak hi seemit raha - ye bhi same precedent follow karta hai (cheekbone ka top sabse universal, hamesha-recognizable placement hai) har real-world spot ek saath cover karne ki jagah. `CHEEKBONE_LEFT_INDEX`/`CHEEKBONE_RIGHT_INDEX` is build se pehle hi constants file ke apne comment mein exactly isi ke liye reserve the.
- **White ki taraf lightened, raw shade color pe painted nahi**: BLUSH/CONCEALER dono chosen shade ko directly paint karte hain (bas low alpha pe). Ek highlighter ka poora cosmetic kaam light catch aur reflect karna hai - product ki apni swatch se _lighter_ dikhna, sirf ek paler version nahi. `mixTowardWhite` (`HIGHLIGHTER_WHITEN_RATIO = 0.45`) shade ke RGB ko gradient tak pahunchne se pehle hi white ki taraf blend karta hai, poori tarah plain JS math mein - deliberately koi canvas blend mode nahi (`screen`/`lighten` waghera), kyunki FOUNDATION ki apni real-device history ne already prove kar diya tha ki ek blank temp canvas pe blend mode ek genuine cross-browser inconsistency hai (FOUNDATION ki bug log dekho). Ye poori bug class ko construction se hi sidestep kar deta hai.
- **BLUSH se tighter blob**: `HIGHLIGHTER_BLOB_RADIUS_RATIO` (0.1) `LOCALIZED_BLOB_RADIUS_RATIO` (0.16, BLUSH ka) se notably chhota hai - ek highlight ek concentrated point jaisa dikhta hai, broad flush nahi.
- **Eye-erase ki zaroorat nahi**: CONCEALER ke ulat (jiska under-eye anchor seedha eye ke saath baithta hai), cheekbone anchor eyes se itna door hai ki gradient ka soft tail kabhi wahan tak nahi pahunchta - same reasoning jispe BLUSH ka apna cheek-apple anchor already depend karta hai. Synthetic-face visual check se confirm kiya, sirf assume nahi kiya.
- **`drawFeatheredBlob` as-is reuse hua**: shared gradient-blob primitive mein koi change nahi chahiye (CONCEALER ne already `radiusX`/`radiusY` ke liye generalize kar diya apne ellipse ke liye; HIGHLIGHTER bas equal radii ke saath call karta hai, BLUSH jaisa).
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (149/149, `applyHighlighterFace` ke 2 tests - smoke + naya dedicated white-mix test - samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte, isliye real dev-server pe ek real model photo (Ruby Red shade) pe browser mein chalake bhi confirm kiya - glow cheekbone pe land hota hai, base tone se visibly lighter rehta hai, aur kabhi eyes ko touch nahi karta. Visually aur pixel-level dono confirm hua, lekin ye Live-mode real-device QA ka substitute nahi hai.

### Quality score

Same 9 dimensions used for LIP.md, FOUNDATION (upar isi file mein), BLUSH, and CONCEALER.

> **Status**: FACE ka poora 10/10 push code-side complete hua (detail upar "10/10 Push & Real-Device QA History" section mein hai), phir user ne khud real-device QA checklist real device pe pass kiya - **"sab sahi he", koi bug nahi mila**. **9/9 dimensions 10/10** ✅, plan complete.

| #   | Dimension            | Score       | Kyun                                                                                                                                                                                                                                                                                                                                                        |
| --- | -------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | **10/10** ✅ | Missing-landmark guard, face-oval clip safety net, turn-detection guard sab present, aur ab real-device pe bhi koi gap nahi mila.                                                                                                                                                                                                                           |
| 2   | Test coverage        | **10/10** ✅ | Dedicated test - "mixes the highlight color toward white, brighter than the raw shade" - HIGHLIGHTER ki poori distinct logic (white-mix) yehi test karta hai, plus shared turn-detection (`isFaceTurnedTooMuch`, 6 tests) already inherited - FOUNDATION jitni hi depth jitna HIGHLIGHTER ke paas actually apna logic hai, kuch aur test-worthy nahi bacha. |
| 3   | Docs accuracy        | 10/10 ✅     | Ye file abhi accurate hai.                                                                                                                                                                                                                                                                                                                                  |
| 4   | Real-device QA       | **10/10** ✅ | User ne khud real-device QA checklist real device pe pass kiya - "sab sahi he", koi bug nahi mila.                                                                                                                                                                                                                                                          |
| 5   | UX polish            | **10/10** ✅ | FOUNDATION/BLUSH/CONCEALER ke fixes (overlay a11y, turn-icon) automatically inherited hain - real-device pass mein bhi koi UX gap report nahi hua.                                                                                                                                                                                                          |
| 6   | Architecture         | 10/10 ✅     | Zero engine-level change - ek naya render fn + ek switch case, bilkul BLUSH/CONCEALER jaisa reuse. Naya `mixTowardWhite` helper bhi self-contained hai.                                                                                                                                                                                                     |
| 7   | Feature completeness | 10/10 ✅     | Rendering fully implemented aur wired hai (`applyHighlighterFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                                                                                                                                                                                                     |
| 8   | Performance          | **10/10** ✅ | Code-side cost-profile BLUSH jaisa hi tha, aur real-device pass mein koi FPS/lag issue report nahi hua.                                                                                                                                                                                                                                                     |
| 9   | Code hygiene         | 10/10 ✅     | Fresh scan - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                                                                                                                     |

**Overall**: **10/10** ✅ — plan complete, FOUNDATION/LIP jaisa hi. Test coverage ka apna 10/10 real justification se hai (HIGHLIGHTER ki poori distinct logic already tested hai), real-device confirmation se nahi.


</details>

<details>
<summary><strong>BLUSH</strong> — 100% ✅</summary>

### Checklist

**Live**

- [x] Camera capture + cheek-region landmark tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, cheek-apple indices samet, extra wiring nahi chahiye.
- [x] Soft cheek color-wash blend real-time me render hota hai — `applyBlushFace` ko `FaceEngineBase.applyEffect`'s switch mein `'BLUSH'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional (product variants se linked) — generic FACE UI, FOUNDATION ke liye already proven working, BLUSH-specific change nahi chahiye.
- [x] Performance & cross-device QA (FPS, lighting conditions) — user ne real-device pe real-device QA checklist pass kiya, "sab sahi he" - koi FPS/lag issue report nahi hua.

**Upload**

- [x] Photo upload + cheek-region detection static image pe — FOUNDATION jaisa hi shared upload pipeline.
- [x] Soft cheek color-wash blend image pe apply hoti hai — same `applyBlushFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [x] Output preview/download QA — real-device pass mein confirm hua.

### Design notes

- **Feathered blob, flat fill nahi**: ek `createRadialGradient` (opaque-ish center → `radius` pe fully transparent) hai, flat circle + blur nahi - blur sirf un edges ko soften karta hai jo already exist karte hain, ye apne aap "beech mein concentrated, edge tak gone" jaisa falloff produce nahi kar sakta, aur itna wide chahiye hota ki color visibly shrink ho jaaye taaki itna soft dikhe. Falloff ko gradient stops mein hi bake karna us poore tuning knob ko sidestep kar deta hai.
- **`source-over`, `multiply` nahi** - FOUNDATION pe hard way se seekha gaya (uska apna bug log dekho): ek blank/transparent temp canvas pe blend mode ek genuine cross-browser rendering inconsistency hai. `applyBlushFace` kabhi `globalCompositeOperation` set hi nahi karta, isliye ye bug class yahan dobara nahi ho sakti.
- **Face-oval clip ek safety net ki tarah**: blob ka apna radius (`LOCALIZED_BLOB_RADIUS_RATIO = 0.16` face width ka) normal proportions mein already face ke andar hi rehta hai - clip bas guarantee karta hai ki kisi unusual face shape pe ye kabhi face oval se bahar paint na kare, cheap insurance jo FOUNDATION ka already-existing `clipToFaceOval` helper reuse karti hai.
- **Turn-detection, instructions, edge-margin fix - sab free mein inherited**: `isFaceTurnedTooMuch`, `FACE_UPLOAD_INSTRUCTIONS`/`FACE_LIVE_INSTRUCTIONS`, aur `FACE_FRAME_EDGE_MARGIN` mobile fix sab FACE-category level pe rehte hain (`FaceEngineBase`/shared constants/utils), FOUNDATION ke apne code ke andar nahi - BLUSH ko ye sab automatically mil jaata hai, kisi bhi future FACE finish ki tarah.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (149/149, `applyBlushFace` ke 2 tests - smoke + naya dedicated cheek-apple placement test - samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte (FOUNDATION ki apni history mein noted same limitation), isliye real dev-server pe ek real model photo (Ruby Red shade) pe browser mein chalake bhi confirm kiya ki blob cheeks pe land hota hai aur correctly feather hota hai - visually aur pixel-level dono confirm hua, lekin ye Live-mode real-device QA ka substitute nahi hai.

### Quality score

Same 9 dimensions used for LIP.md aur FOUNDATION (upar isi file mein).

> **Status**: FACE ka poora 10/10 push code-side complete hua (detail upar "10/10 Push & Real-Device QA History" section mein hai), phir user ne khud real-device QA checklist real device pe pass kiya - **"sab sahi he", koi bug nahi mila**. **9/9 dimensions 10/10** ✅, plan complete.

| #   | Dimension            | Score       | Kyun                                                                                                                                                                                                                                                                                                                                                 |
| --- | -------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | **10/10** ✅ | Missing-landmark guard, face-oval clip safety net, turn-detection guard sab inherited/present, aur ab real-device pe bhi koi gap nahi mila.                                                                                                                                                                                                          |
| 2   | Test coverage        | **10/10** ✅ | Dedicated test - "centers a feathered blob on each cheek-apple landmark" - BLUSH ki poori distinct logic (cheek-apple anchor placement) yehi test karta hai, plus shared turn-detection (`isFaceTurnedTooMuch`, 6 tests) already inherited - FOUNDATION jitni hi depth jitna BLUSH ke paas actually apna logic hai, kuch aur test-worthy nahi bacha. |
| 3   | Docs accuracy        | 10/10 ✅     | Ye file abhi accurate hai.                                                                                                                                                                                                                                                                                                                           |
| 4   | Real-device QA       | **10/10** ✅ | User ne khud real-device QA checklist real device pe pass kiya - "sab sahi he", koi bug nahi mila.                                                                                                                                                                                                                                                   |
| 5   | UX polish            | **10/10** ✅ | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - real-device pass mein bhi koi UX gap report nahi hua.                                                                                                                                                                                                                   |
| 6   | Architecture         | 10/10 ✅     | Zero engine-level change - ek naya render fn + ek switch case, bilkul FOUNDATION jaisa reuse.                                                                                                                                                                                                                                                        |
| 7   | Feature completeness | 10/10 ✅     | Rendering fully implemented aur wired hai (`applyBlushFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                                                                                                                                                                                                    |
| 8   | Performance          | **10/10** ✅ | Code-side cost-profile FOUNDATION jaisa hi tha, aur real-device pass mein koi FPS/lag issue report nahi hua.                                                                                                                                                                                                                                         |
| 9   | Code hygiene         | 10/10 ✅     | Fresh scan - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                                                                                                              |

**Overall**: **10/10** ✅ — plan complete, FOUNDATION/LIP jaisa hi. Test coverage ka apna 10/10 real justification se hai (BLUSH ki poori distinct logic already tested hai), real-device confirmation se nahi.


</details>

<details>
<summary><strong>CONTOUR</strong> — 100% ✅</summary>

### Checklist

**Live**

- [x] Camera capture + jaw/cheek/nose-hollow landmark tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, jaw-hollow indices samet, extra wiring nahi chahiye.
- [x] Shading blend facial hollows ke saath real-time me render hota hai — `applyContourFace` ko `FaceEngineBase.applyEffect`'s switch mein `'CONTOUR'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai baaki teen localized finishes jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional — generic FACE UI, FOUNDATION/BLUSH/CONCEALER/HIGHLIGHTER ke liye already proven working, CONTOUR-specific change nahi chahiye.
- [x] Performance & cross-device QA — user ne real-device pe real-device QA checklist pass kiya, "sab sahi he" - koi FPS/lag issue report nahi hua.

**Upload**

- [x] Photo upload + jaw/cheek/nose-hollow detection static image pe — baaki FACE finishes jaisa hi shared upload pipeline.
- [x] Shading blend facial hollows ke saath image pe apply hoti hai — same `applyContourFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [x] Output preview/download QA — real-device pass mein confirm hua.

### Design notes

- **Sirf jaw hollow, nose-hollow/temple nahi**: ek real contour routine kayi hollows hit karta hai, lekin BLUSH/CONCEALER/HIGHLIGHTER ka apna v1 scope do anchors tak hi seemit raha - ye bhi same precedent follow karta hai (cheekbone ke neeche jaw ke saath wali hollow sabse universal contour placement hai) har real-world spot ek saath cover karne ki jagah. `JAW_HOLLOW_LEFT_INDEX`/`JAW_HOLLOW_RIGHT_INDEX` is build se pehle hi constants file ke apne comment mein exactly isi ke liye reserve the.
- **Anchor + offset, raw landmark nahi**: `JAW_HOLLOW_LEFT_INDEX`/`JAW_HOLLOW_RIGHT_INDEX` `FACE_OVAL_INDICES` ke apne boundary loop ka part hain (wo seedha jaw edge pe baithte hain, cheek ki hollow ke andar nahi) - `applyContourFace` anchor ko draw karne se pehle inward (face ke horizontal center ki taraf, `CONTOUR_INWARD_OFFSET_RATIO`) aur upward (jawline ke upar cheek hollow ki taraf, `CONTOUR_UPWARD_OFFSET_RATIO`) nudge karta hai, same "anchor + offset" pattern jo CONCEALER ka `UNDER_EYE_OFFSET_RATIO` already establish kar chuka hai.
- **Black ki taraf darkened, raw shade color pe painted nahi**: HIGHLIGHTER ke `mixTowardWhite` ka mirror image - ek naya `mixTowardBlack` helper (`CONTOUR_DARKEN_RATIO = 0.35`) shade ke RGB ko gradient tak pahunchne se pehle black ki taraf mix karta hai, poori tarah plain JS math mein, koi canvas blend mode nahi - same reasoning jo HIGHLIGHTER ki apni whitening already establish kar chuki hai (blend-mode-over-blank-canvas bug class ko sidestep karta hai jo FOUNDATION ki real-device history ne already prove kiya tha).
- **Taller ellipse, BLUSH ka circle ya CONCEALER ka flat crescent nahi**: `CONTOUR_BLOB_ASPECT_RATIO = 1.4` (> 1, `radiusY > radiusX`) jaw hollow ke apne vertical drop ko follow karta hai, CONCEALER ke wider-than-tall under-eye shape se ulti orientation.
- **`drawFeatheredBlob` as-is reuse hua**: shared gradient-blob primitive mein koi change nahi chahiye tha (CONCEALER ne already `radiusX`/`radiusY` ke liye generalize kar diya tha); CONTOUR bas `radiusY > radiusX` aur ek darkened color ke saath call karta hai, lightened color ki jagah.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (149/149, `applyContourFace` ke 2 tests - smoke + naya dedicated black-mix test - samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte, isliye real dev-server pe ek real model photo (Ruby Red shade) pe browser mein chalake bhi confirm kiya - shadow cheek hollow mein land hoti hai (raw jaw anchor se visibly offset), base tone se visibly darker rehti hai, aur kabhi eyes ya mouth ko touch nahi karti. Visually aur pixel-level dono confirm hua, lekin ye Live-mode real-device QA ka substitute nahi hai. HIGHLIGHTER ke apne real-device follow-up ne paaya ki uska default alpha real photo pe notice karne layak nahi tha, isliye CONTOUR ka apna default (`0.25`, ek `{0.1, 0.5}` range ka) real-device testing shuru hote hi wahi real-photo sanity check paana chahiye, sirf ye assume karne ki jagah ki synthetic check ki visibility carry over hogi.

### Quality score

Same 9 dimensions used for LIP.md, FOUNDATION (upar isi file mein), BLUSH, CONCEALER, and HIGHLIGHTER.

> **Status**: FACE ka poora 10/10 push code-side complete hua (detail upar "10/10 Push & Real-Device QA History" section mein hai), phir user ne khud real-device QA checklist real device pe pass kiya - **"sab sahi he", koi bug nahi mila** (CONTOUR ke apne default-alpha-visibility concern samet). **9/9 dimensions 10/10** ✅, plan complete.

| #   | Dimension            | Score       | Kyun                                                                                                                                                                                                                                                                                                                                           |
| --- | -------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | **10/10** ✅ | Missing-landmark guard, face-oval clip safety net, turn-detection guard sab present, aur ab real-device pe bhi koi gap nahi mila.                                                                                                                                                                                                              |
| 2   | Test coverage        | **10/10** ✅ | Dedicated test - "mixes the shadow color toward black, darker than the raw shade" - CONTOUR ki poori distinct logic (black-mix) yehi test karta hai, plus shared turn-detection (`isFaceTurnedTooMuch`, 6 tests) already inherited - FOUNDATION jitni hi depth jitna CONTOUR ke paas actually apna logic hai, kuch aur test-worthy nahi bacha. |
| 3   | Docs accuracy        | 10/10 ✅     | Ye file abhi accurate hai.                                                                                                                                                                                                                                                                                                                     |
| 4   | Real-device QA       | **10/10** ✅ | User ne khud real-device QA checklist real device pe pass kiya - "sab sahi he" (default alpha ki visibility bhi confirm hui, HIGHLIGHTER ka lesson yahan koi issue nahi nikla).                                                                                                                                                                |
| 5   | UX polish            | **10/10** ✅ | FOUNDATION/BLUSH/CONCEALER/HIGHLIGHTER ke fixes (overlay a11y, turn-icon) automatically inherited hain - real-device pass mein bhi koi UX gap report nahi hua.                                                                                                                                                                                 |
| 6   | Architecture         | 10/10 ✅     | Zero engine-level change - ek naya render fn + ek switch case, bilkul baaki finishes jaisa reuse. Naya `mixTowardBlack` helper bhi self-contained hai.                                                                                                                                                                                         |
| 7   | Feature completeness | 10/10 ✅     | Rendering fully implemented aur wired hai (`applyContourFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                                                                                                                                                                                            |
| 8   | Performance          | **10/10** ✅ | Code-side cost-profile baaki localized finishes jaisa hi tha, aur real-device pass mein koi FPS/lag issue report nahi hua.                                                                                                                                                                                                                     |
| 9   | Code hygiene         | 10/10 ✅     | Fresh scan - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                                                                                                        |

**Overall**: **10/10** ✅ — plan complete, FOUNDATION/LIP jaisa hi. Test coverage ka apna 10/10 real justification se hai (CONTOUR ki poori distinct logic already tested hai), real-device confirmation se nahi.


</details>

<details>
<summary><strong>BRONZER</strong> — 100% ✅</summary>

### Checklist

**Live**

- [x] Camera capture + full-face segmentation wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, extra wiring nahi chahiye.
- [x] Warm all-over glow blend real-time me render hota hai — `applyBronzerFace` ko `FaceEngineBase.applyEffect`'s switch mein `'BRONZER'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional — generic FACE UI, FOUNDATION aur har doosri FACE finish ke liye already proven working, BRONZER-specific change nahi chahiye.
- [x] Performance & cross-device QA — user ne real-device pe real-device QA checklist pass kiya, "sab sahi he" - koi FPS/lag issue report nahi hua.

**Upload**

- [x] Photo upload + full-face segmentation static image pe — FOUNDATION jaisa hi shared upload pipeline.
- [x] Warm all-over glow blend image pe apply hoti hai — same `applyBronzerFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [x] Output preview/download QA — real-device pass mein confirm hua.

### Design notes

- **Full-face wash, koi localized blob nahi**: BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR (sab single-anchor feathered blobs) ke ulat, BRONZER architecturally FOUNDATION jaisa hi hai - poora face-oval region fill karta hai, ek spot nahi. Ye FACE.md ki apni BRONZER description ("full-face segmentation", "warm all-over glow blend") se match karta hai, ek localized-placement wale se nahi.
- **`fillFaceOvalRegion` FOUNDATION se nikala gaya**: FOUNDATION ka apna function body (temp-canvas, `clipToFaceOval`, fill, `eraseExcludedFeatures`, composite) ek shared helper mein nikal liya gaya taaki BRONZER (aur eventually BBCREAM/COMPACTPOWDER, jo FACE.md ke hisaab se dono full-face hain) usko reuse kar sakein, logic duplicate kiye bina. Ye ek pure extraction hai - FOUNDATION ka apna exported function ab bas helper ko exact same arguments ke saath call karta hai, aur iska apna smoke test unchanged pass hota hai, confirm karta hai ki jo pixels ye produce karta hai wo move nahi hue.
- **Warm-shifted, raw shade color pe painted nahi**: ek real bronzer ka poora kaam ek warm, sun-kissed glow jaisa dikhna hai, sirf ek neutral color-match wash nahi (same "make it read as the real cosmetic effect" reasoning jo HIGHLIGHTER ki whitening aur CONTOUR ki darkening localized finishes ke liye already establish kar chuki hai). `applyWarmShift` (`BRONZER_WARM_SHIFT`/`BRONZER_WARM_RATIO`) red ko upar aur blue ko neeche, ek fixed channel amount se shift karta hai - ek temperature-style shift, ek fixed absolute bronze color ki taraf mix nahi (jo har alag bronzer shade ko same hue ki taraf flatten kar deta). Plain per-channel RGB math hai, koi canvas blend mode nahi - same reasoning jo FOUNDATION ki apni real-device history batati hai ki blank temp canvas pe blend modes risky kyun hain.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (149/149, `applyBronzerFace` ke 2 tests - smoke + naya dedicated warm-shift test - samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte, isliye code-side pixel-math test se confirm hua ki BRONZER FOUNDATION ke plain wash se genuinely warm/golden (red up, blue down) dikhta hai. Ye real-device QA ka substitute nahi hai - aur HIGHLIGHTER ke apne real-device lesson ke hisaab se (default alpha real photo pe notice karne layak nahi tha), BRONZER ka default alpha bhi real-device testing shuru hote hi wahi real-photo sanity check paana chahiye.

### Quality score

Same 9 dimensions used for LIP.md, FOUNDATION (upar isi file mein), BLUSH, CONCEALER, HIGHLIGHTER, and CONTOUR.

> **Status**: FACE ka poora 10/10 push code-side complete hua (detail upar "10/10 Push & Real-Device QA History" section mein hai), phir user ne khud real-device QA checklist real device pe pass kiya - **"sab sahi he", koi bug nahi mila** (warm-shift ki visibility samet). **9/9 dimensions 10/10** ✅, plan complete.

| #   | Dimension            | Score       | Kyun                                                                                                                                                                                                                                                                                                                                             |
| --- | -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Robustness           | **10/10** ✅ | Same guards FOUNDATION already has (missing-landmark, face-oval clip, turn-detection), aur ab real-device pe bhi koi gap nahi mila.                                                                                                                                                                                                              |
| 2   | Test coverage        | **10/10** ✅ | Dedicated test - "warms the shade (more red, less blue) before the full-face wash" - BRONZER ki poori distinct logic (warm-shift) yehi test karta hai, plus shared turn-detection (`isFaceTurnedTooMuch`, 6 tests) already inherited - FOUNDATION jitni hi depth jitna BRONZER ke paas actually apna logic hai, kuch aur test-worthy nahi bacha. |
| 3   | Docs accuracy        | 10/10 ✅     | Ye file abhi accurate hai.                                                                                                                                                                                                                                                                                                                       |
| 4   | Real-device QA       | **10/10** ✅ | User ne khud real-device QA checklist real device pe pass kiya - "sab sahi he", warm-shift ki visibility samet koi issue nahi mila.                                                                                                                                                                                                              |
| 5   | UX polish            | **10/10** ✅ | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - real-device pass mein bhi koi UX gap report nahi hua.                                                                                                                                                                                                               |
| 6   | Architecture         | 10/10 ✅     | Zero engine-level change - ek naya render fn + ek switch case. FOUNDATION ka `fillFaceOvalRegion` extraction bhi clean tha, iska smoke test unchanged pass hua.                                                                                                                                                                                  |
| 7   | Feature completeness | 10/10 ✅     | Rendering fully implemented aur wired hai (`applyBronzerFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                                                                                                                                                                                              |
| 8   | Performance          | **10/10** ✅ | Code-side cost-profile FOUNDATION jaisa hi tha, aur real-device pass mein koi FPS/lag issue report nahi hua.                                                                                                                                                                                                                                     |
| 9   | Code hygiene         | 10/10 ✅     | Fresh scan - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                                                                                                          |

**Overall**: **10/10** ✅ — plan complete, FOUNDATION/LIP jaisa hi. Test coverage ka apna 10/10 real justification se hai (BRONZER ki poori distinct logic already tested hai), real-device confirmation se nahi.


</details>

<details>
<summary><strong>BBCREAM</strong> — 100% ✅</summary>

### Checklist

**Live**

- [x] Camera capture + full-face segmentation wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, extra wiring nahi chahiye.
- [x] Sheer full-face tinted blend (foundation se lighter) real-time me render hota hai — `applyBbCreamFace` ko `FaceEngineBase.applyEffect`'s switch mein `'BBCREAM'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai FOUNDATION/BRONZER jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua**.
- [x] Shade/variant picker functional — generic FACE UI, har doosri FACE finish ke liye already proven working, BBCREAM-specific change nahi chahiye.
- [x] Performance & cross-device QA — user ne real-device pe real-device QA checklist pass kiya, "sab sahi he" - koi FPS/lag issue report nahi hua.

**Upload**

- [x] Photo upload + full-face segmentation static image pe — FOUNDATION/BRONZER jaisa hi shared upload pipeline.
- [x] Sheer full-face tinted blend image pe apply hoti hai — same `applyBbCreamFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [x] Output preview/download QA — real-device pass mein confirm hua.

### Design notes

- **Full-face wash, koi localized blob nahi**: FOUNDATION/BRONZER jaisi hi architecture family (dono shared `fillFaceOvalRegion` helper se poora face-oval region fill karte hain), BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR ke single-anchor feathered blobs jaisa nahi. FACE.md ki apni BB cream description ("full-face segmentation", "sheer full-face tinted blend") se match karta hai.
- **Koi color-mix transform nahi - sheerness ek alpha concern hai, hue concern nahi**: HIGHLIGHTER white ki taraf mix karta hai aur BRONZER warm-shift karta hai kyunki wo effects genuinely skin ka _color_ badalne ke baare me hain. BB cream aisa nahi hai - FACE.md ki apni wording sirf "lighter than foundation" hai, matlab same shade ka kam coverage, alag-color effect nahi. Isliye `applyBbCreamFace` koi bhi per-channel color transform skip karta hai aur iski jagah ek lower `BBCREAM_BASE_ALPHA` (0.35) apni color string mein bake karta hai, FOUNDATION ke fixed 0.6 base opacity ki jagah.
- **Sheerness ko render me kyun bake kiya, sirf slider bounds mein kyun nahi**: `FACE_RANGE_BOUNDS.BBCREAM` ki ceiling already FOUNDATION se kam hai (`max: 0.5`), lekin akeli lower ceiling sirf tab tak "lighter than foundation" guarantee karti hai jab tak koi slider ko us ceiling ke kareeb kisi aise foundation ke against na le jaye jiska apna alpha khud kam ho. `BBCREAM_BASE_ALPHA` ko render me hi bake karne se "sheerer than foundation" ek structural guarantee ban jaata hai, slider kahin bhi ho - same reasoning jo LIP ke `applyStainLips` ne already use ki thi (`Math.min(alpha, 0.35)`) taaki STAIN slider ki parwaah kiye bina genuinely sheer rahe.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (149/149, `applyBbCreamFace` ke 2 tests - smoke + ab ek committed automated "sheerer than FOUNDATION" comparison test, pehle sirf temporary script se manually check kiya tha - samet) sab pass hoti hai. Camera/file-upload flows is session ke sandboxed browser pane mein automate nahi ho sakte, isliye code-side alpha-comparison test se confirm hua ki BBCREAM ka rendered alpha FOUNDATION se same rgb/intensity input pe measurably kam hai (matlab genuinely sheerer). Ye real-device QA ka substitute nahi hai - aur HIGHLIGHTER ke apne real-device lesson ke hisaab se (default alpha real photo pe notice karne layak nahi tha), BBCREAM ka default alpha (already kisi bhi full-face FACE finish ka sabse lowest, design se) real-device testing shuru hote hi wahi real-photo sanity check paana chahiye - ye finish "kuch hua hi nahi" jaisa dikhne ke sabse zyada risk mein hai.

### Quality score

Same 9 dimensions used for LIP.md, FOUNDATION (upar isi file mein), BLUSH, CONCEALER, HIGHLIGHTER, CONTOUR, and BRONZER.

> **Status**: FACE ka poora 10/10 push code-side complete hua (detail upar "10/10 Push & Real-Device QA History" section mein hai), phir user ne khud real-device QA checklist real device pe pass kiya - **"sab sahi he", koi bug nahi mila** (BBCREAM ki sheerness bhi visible nikli, "kuch hua hi nahi" risk confirm nahi hua). **9/9 dimensions 10/10** ✅, plan complete.

| #   | Dimension            | Score       | Kyun                                                                                                                                                                                                                                                                                                                                                                  |
| --- | -------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | **10/10** ✅ | Same guards FOUNDATION/BRONZER already have (missing-landmark, face-oval clip, turn-detection), aur ab real-device pe bhi koi gap nahi mila.                                                                                                                                                                                                                          |
| 2   | Test coverage        | **10/10** ✅ | Dedicated test - "reads sheerer (lower alpha) than FOUNDATION at the same rgb/intensity input" - BBCREAM ki poori distinct logic (base-alpha override) yehi test karta hai, plus shared turn-detection (`isFaceTurnedTooMuch`, 6 tests) already inherited - FOUNDATION jitni hi depth jitna BBCREAM ke paas actually apna logic hai, kuch aur test-worthy nahi bacha. |
| 3   | Docs accuracy        | 10/10 ✅     | Ye file abhi accurate hai.                                                                                                                                                                                                                                                                                                                                            |
| 4   | Real-device QA       | **10/10** ✅ | User ne khud real-device QA checklist real device pe pass kiya - "sab sahi he", BBCREAM ki sheerness bhi visible nikli.                                                                                                                                                                                                                                               |
| 5   | UX polish            | **10/10** ✅ | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - real-device pass mein bhi koi UX gap report nahi hua.                                                                                                                                                                                                                                    |
| 6   | Architecture         | 10/10 ✅     | Zero engine-level change - ek naya render fn (no color-mix helper needed) + ek switch case. Same `fillFaceOvalRegion` reuse jo BRONZER ne establish kiya.                                                                                                                                                                                                             |
| 7   | Feature completeness | 10/10 ✅     | Rendering fully implemented aur wired hai (`applyBbCreamFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya - ab sirf COMPACTPOWDER bacha hai).                                                                                                                                                                                                                 |
| 8   | Performance          | **10/10** ✅ | Code-side cost-profile FOUNDATION/BRONZER jaisa hi tha, aur real-device pass mein koi FPS/lag issue report nahi hua.                                                                                                                                                                                                                                                  |
| 9   | Code hygiene         | 10/10 ✅     | Fresh scan - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                                                                                                                               |

**Overall**: **10/10** ✅ — plan complete, FOUNDATION/LIP jaisa hi. Test coverage ka apna 10/10 real justification se hai (BBCREAM ki poori distinct logic already tested hai), real-device confirmation se nahi.


</details>

<details>
<summary><strong>COMPACTPOWDER</strong> — 100% ✅</summary>

### Checklist

**Live**

- [x] Camera capture + full-face segmentation wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline har frame me poora 478-point mesh already track karti hai, extra wiring nahi chahiye.
- [x] Matte-finish overlay (shine reduction) real-time me render hota hai — `applyCompactPowderFace` ko `FaceEngineBase.applyEffect`'s switch mein `'COMPACTPOWDER'` ke liye wire kiya gaya, har `renderFrame` tick pe chalta hai har doosri full-face finish jaisa. Automated smoke test + synthetic-face visual check se verify kiya (Design notes dekho) - **abhi tak actual live camera feed pe confirm nahi hua** (is session ke sandboxed browser pane ne ek pane-level WebGL limitation hit ki - MediaPipe ka GPU delegate wahan initialize hi nahi hota, console mein `useProgram: program not valid`, kaunsi bhi finish select ho, landmark detection block ho jaata hai - ye is change ki wajah se nahi hua).
- [x] Shade/variant picker functional — generic FACE UI, har doosri FACE finish ke liye already proven working, COMPACTPOWDER-specific change nahi chahiye.
- [x] Performance & cross-device QA — user ne real-device pe real-device QA checklist pass kiya, "sab sahi he" - koi FPS/lag issue report nahi hua.

**Upload**

- [x] Photo upload + full-face segmentation static image pe — har doosri full-face finish jaisa hi shared upload pipeline.
- [x] Matte-finish overlay image pe apply hoti hai — same `applyCompactPowderFace`, upload path bhi same `applyEffect` se guzarta hai.
- [x] Shade/variant picker functional — generic, shared.
- [x] Output preview/download QA — real-device pass mein confirm hua.

### Design notes

- **Full-face wash, koi localized blob nahi**: FOUNDATION/BRONZER/BBCREAM jaisi hi architecture family (sab shared `fillFaceOvalRegion` helper se poora face-oval region fill karte hain), BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR ke single-anchor feathered blobs jaisa nahi. FACE.md ki apni compact powder description ("full-face segmentation", "matte-finish overlay, shine reduction") se match karta hai.
- **Desaturation, ek absolute color ki taraf mix nahi**: HIGHLIGHTER white ki taraf mix karta hai aur CONTOUR black ki taraf, kyunki wo effects genuinely badalte hain ki skin kitni light ya dark dikhti hai. Compact powder aisa nahi karta - ek real mattifying powder skin ko lighten ya darken nahi karta, ye _shine/gloss_ ko flatten karta hai. Is renderer ka koi lighting model nahi hai (koi specular highlights nahi jinko directly dampen kiya ja sake), isliye `desaturateTowardGray` "kam shine" ko "kam vibrant" se approximate karta hai: har shade ko apne hi luminance-matched gray (Rec. 601 luma weights) ki taraf mix karta hai, kisi ek fixed absolute color ki taraf nahi - isliye `mixTowardWhite`/`mixTowardBlack`/`applyWarmShift` ke ulat, ye kabhi hue ya overall brightness shift nahi karta, sirf vibrancy. `COMPACTPOWDER_MATTIFY_RATIO` (0.3) shade ka apna hue clearly recognizable rakhta hai, phir bhi ek straight wash se flatter dikhta hai.
- **Kisi bhi full-face finish ka sabse lowest baked base-alpha**: `COMPACTPOWDER_BASE_ALPHA` (0.25) `BBCREAM_BASE_ALPHA` (0.35) se bhi neeche baithta hai - ek real compact powder ka poora kaam ek near-invisible finishing veil hona hai (makeup set karna, shine kam karna), consciously dekhne layak color layer nahi, isliye ye ab tak build hui har FACE finish mein structurally sabse subtle hai. Same "render mein hi bake karo, sirf slider ki apni bounds pe depend mat karo" reasoning jo `BBCREAM_BASE_ALPHA` ka apna comment already use kar chuka hai - aur `FACE_RANGE_BOUNDS.COMPACTPOWDER` ki bhi kisi bhi FACE finish se sabse lowest ceiling hai (`max: 0.3`), isliye dono ek doosre ko compensate karne ki jagah saath mein kaam karte hain.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur poori `vitest` suite (149/149, `applyCompactPowderFace` ke 2 tests - smoke + ab ek committed automated desaturation test, pehle sirf temporary script se manually check kiya tha - samet) sab pass hoti hai. Code-side channel-spread comparison test se confirm hua ki COMPACTPOWDER ka rendered spread (max-min channel gap) raw shade se genuinely chhota hai (matlab kam saturated/zyada matte). Actual in-app flow bhi try kiya (Upload → ek project model photo) is session ke sandboxed browser pane mein, lekin MediaPipe ka GPU delegate wahan initialize hi nahi hua (`useProgram: program not valid` WebGL errors) aur landmark detection kabhi complete nahi hua - ye ek pane-level limitation hai, code regression nahi (model file khud theek se load hui, 200 OK, aur ye har FACE finish ko equally block karta hai, sirf isko nahi). Ye real-device QA ka substitute nahi hai - aur HIGHLIGHTER ke apne real-device lesson ke hisaab se (default alpha real photo pe notice karne layak nahi tha), COMPACTPOWDER ka default alpha (kisi bhi FACE finish ka sabse lowest, design se) real-device testing shuru hote hi wahi real-photo sanity check paana chahiye - BBCREAM jaisa, ye "kuch hua hi nahi" jaisa dikhne ke real risk mein hai, shayad aur zyada, kyunki desaturation ek color shift se zyada subtle visual cue hai.

### Quality score

Same 9 dimensions used for LIP.md, FOUNDATION (upar isi file mein), BLUSH, CONCEALER, HIGHLIGHTER, CONTOUR, BRONZER, and BBCREAM.

> **Status**: FACE ka poora 10/10 push code-side complete hua (detail upar "10/10 Push & Real-Device QA History" section mein hai), phir user ne khud real-device QA checklist real device pe pass kiya - **"sab sahi he", koi bug nahi mila** (COMPACTPOWDER ki subtlety bhi visible nikli). **9/9 dimensions 10/10** ✅, plan complete. **Isi ke saath FACE category ki saari 8 subcategories (FOUNDATION samet) ab poori tarah 10/10 hain.**

| #   | Dimension            | Score       | Kyun                                                                                                                                                                                                                                                                                                                                                             |
| --- | -------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | **10/10** ✅ | Same guards FOUNDATION/BRONZER/BBCREAM already have (missing-landmark, face-oval clip, turn-detection), aur ab real-device pe bhi koi gap nahi mila.                                                                                                                                                                                                             |
| 2   | Test coverage        | **10/10** ✅ | Dedicated test - "desaturates the shade toward its own gray before the full-face wash" - COMPACTPOWDER ki poori distinct logic (desaturate) yehi test karta hai, plus shared turn-detection (`isFaceTurnedTooMuch`, 6 tests) already inherited - FOUNDATION jitni hi depth jitna COMPACTPOWDER ke paas actually apna logic hai, kuch aur test-worthy nahi bacha. |
| 3   | Docs accuracy        | 10/10 ✅     | Ye file abhi accurate hai.                                                                                                                                                                                                                                                                                                                                       |
| 4   | Real-device QA       | **10/10** ✅ | User ne khud real-device QA checklist real device pe pass kiya - "sab sahi he", subtlety samet koi "kuch hua hi nahi" jaisa issue nahi mila.                                                                                                                                                                                                                     |
| 5   | UX polish            | **10/10** ✅ | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - real-device pass mein bhi koi UX gap report nahi hua.                                                                                                                                                                                                                               |
| 6   | Architecture         | 10/10 ✅     | Zero engine-level change - ek naya render fn (naya `desaturateTowardGray` helper, `mixTowardWhite`/`mixTowardBlack`/`applyWarmShift` jaisa hi pattern) + ek switch case. `UNSUPPORTED_FACE_FINISHES` ab poori tarah empty.                                                                                                                                       |
| 7   | Feature completeness | 10/10 ✅     | Rendering fully implemented aur wired hai (`applyCompactPowderFace`, switch case) - **FACE category ki saari 8 subcategories ab dedicated rendering rakhti hain**.                                                                                                                                                                                               |
| 8   | Performance          | **10/10** ✅ | Code-side cost-profile FOUNDATION/BRONZER/BBCREAM jaisa hi tha, aur real-device pass mein koi FPS/lag issue report nahi hua.                                                                                                                                                                                                                                     |
| 9   | Code hygiene         | 10/10 ✅     | Fresh scan - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                                                                                                                          |

**Overall**: **10/10** ✅ — plan complete, FOUNDATION/LIP jaisa hi. Test coverage ka apna 10/10 real justification se hai (COMPACTPOWDER ki poori distinct logic already tested hai), real-device confirmation se nahi. **Isi ke saath FACE category ki saari 8 subcategories (FOUNDATION samet) ab poori tarah 10/10 hain, sabki score sahi justification ke saath** - FACE ka apna "sabko 10/10 banao" milestone complete.


</details>


## 10/10 Push & Real-Device QA History

### FOUNDATION's own earlier 10/10 round



Last review score: **~7.5/10** (breakdown FOUNDATION ke apne quality-score section mein, upar is file mein hi). FOUNDATION khud fully built hai — koi finish add nahi karni, sirf jo gaps score neeche kheech rahe the unko close karna hai. Same shape jaisa LIP ka apna journey tha (LIP.md).

> **Status**: **9/9 dimensions 10/10** ✅ — Docs accuracy, Architecture, Feature completeness, Code hygiene, Robustness, Test coverage, UX polish (sab is journey ke dauraan close hue), aur ab **Real-device QA** + **Performance** bhi - user ne poora real-device QA checklist ke against end-to-end confirm kar diya ("baaki sab sahi tha"), 2 real mobile bug mile aur fix hue is process mein. **Plan complete.**

**Explicitly out of scope for this plan:**

- FACE ke baaki 7 subcategories (CONCEALER/HIGHLIGHTER/BLUSH/CONTOUR/BRONZER/BBCREAM/COMPACTPOWDER) — abhi unbuilt, is file me tracked, apna alag kaam hoga.
- EYE/HAIR/NAIL categories — [TRYON.md](./TRYON.md) me tracked.

### Score breakdown (before → after this round)

| #   | Dimension            | Before  | After       | Notes                                                                                                                |
| --- | -------------------- | ------- | ----------- | -------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10    | **10/10** ✅ | 1 real gap mila + fix kiya (neeche dekho)                                                                            |
| 2   | Test coverage        | 8/10    | **10/10** ✅ | 2 naye test files (7 tests)                                                                                          |
| 3   | Docs accuracy        | 10/10 ✅ | 10/10 ✅     | already done                                                                                                         |
| 4   | Real-device QA       | 0/10    | **10/10** ✅ | Mobile testing se 2 real bug mile aur fix hue, uske baad poora checklist user ne end-to-end pass kiya (neeche dekho) |
| 5   | UX polish            | 8/10    | **10/10** ✅ | 1 real a11y gap mila + fix kiya                                                                                      |
| 6   | Architecture         | 10/10 ✅ | 10/10 ✅     | already done                                                                                                         |
| 7   | Feature completeness | 10/10 ✅ | 10/10 ✅     | already done                                                                                                         |
| 8   | Performance          | 6/10    | **10/10** ✅ | code-side re-confirmed + real-device pass mein koi FPS/lag issue report nahi hua                                     |
| 9   | Code hygiene         | 10/10 ✅ | 10/10 ✅     | fresh scan, zero matches                                                                                             |

---

### 1. Robustness → 10/10 ✅ done

- [x] **Real gap mila re-checking karte waqt**: `FaceEngineBase.applyEffect()` `state.faceDetection === 'turned'` hone par bhi tint render kar raha tha - turn-detection sirf overlay dikhata tha, underlying paint kabhi rukta hi nahi tha. `TryOnOverlay` ka scrim `bg-black/45` hai (semi-transparent, poora opaque nahi), isliye turned-head ka broken/bulging tint overlay ke **peeche se dikhta rehta** - jabki poori feature ka maksad hi tha ye bad-angle render kabhi na dikhe. Fix: `applyEffect` ab `state.faceDetection === 'turned'` par turant return kar deta hai, koi tint paint nahi hota jab tak face wapas frontal na ho jaye.
- [x] Baaki sab (no-face/error paths, RAF loop try/catch, `startTryOn` catch-block) LIP ke session mein hi generic/shared level pe fix ho chuke the - `FaceLandmarkerEngineBase`/`withLiveCameraFaceLandmarker`/`withImageUploadFaceLandmarker` sabko equally milte hain, dobara check karne ki zaroorat nahi thi.

### 2. Test coverage → 10/10 ✅ done

**58 → 59 tests** (is session mein +7 naye, ek chhota consolidation ke saath) - `npm run test` se chalta hai.

- [x] `isFaceTurnedTooMuch` unit tests ([tryon-utils/face.test.ts](../../src/utils/tryon-utils/face.test.ts)) - frontal/symmetric, natural slight-turn (allowed), turned (dono directions), missing-landmark fail-safe, aur exact-threshold boundary - 6 tests
- [x] `applyFoundationFace` smoke test ([tryon-utils/face.smoke.test.ts](../../src/utils/tryon-utils/face.smoke.test.ts)) - LIP ke `lip.smoke.test.ts` wala hi jsdom+canvas pattern reuse kiya (throw nahi karta + kam se kam ek non-transparent pixel paint karta hai) - 1 test
- [x] Shared/agnostic tests (`getFaceDetectionStatus`, `getObjectFitContentRect`, `hexToRGBA` - [tryon-utils/index.test.ts](../../src/utils/tryon-utils/index.test.ts)) already FACE ke liye bhi equally applicable hain - LIP ke time hi likhe gaye the, dobara likhne ki zaroorat nahi

FOUNDATION LIP jitna data/logic-heavy nahi hai (koi textured-finish tuning table nahi, ek hi finish hai) - isliye proportionally chhota test count expected hai, lekin har genuinely testable pure function (turn-detection heuristic, rendering function) ab covered hai - LIP jitni hi depth, jitna FOUNDATION ke paas actually hai.

### 3. Docs accuracy → 10/10 ✅ (already done, pichle turn mein)

FOUNDATION khud hi is round ke pehle bana - koi naya gap nahi.

### 4. Real-device QA → 0/10 → 10/10 ✅ done

Ye ek hi section hai jo **mujhse nahi ho sakti** — sandboxed browser pane me camera access blocked hai, isliye Live mode ka real behavior kabhi mujhse actually measure nahi ho sakta.

**Checklist ban gaya** (upar is file mein) - forehead coverage, rounded edges, mouth-open, hair/beard exclusion, aur sabse important **turned-angle overlay + no-render-underneath** (abhi jo fix hua) sab specifically cover karta hai.

- [x] User ne mobile pe test kiya - **2 real bug mile, dono fix hue**:
  - Tint bilkul apply hi nahi ho raha tha (koi error/overlay bhi nahi) - root cause `multiply` blend mode ek blank temp canvas pe (cross-browser edge-case, desktop pe spec-compliant fallback milta hai, mobile ke engine pe nahi). On-screen debug readout se diagnose kiya (console access nahi tha), 2 rounds mein narrow kiya (state values → before/after-erase pixel samples). Fix: `multiply` hata ke `source-over`.
  - False "face not in frame" jab face poora frame mein tha. Root cause: edge-margin (`FACE_FRAME_EDGE_MARGIN`) bahut tight - mobile selfie distance pe normal framing mein bhi trip ho jaata tha. Fix: `0.002 → 0.01`.
- [x] User confirm kiya: "badiya kaam kar raha he" - core render ab mobile pe kaam karta hai
- [x] Poora real-device QA checklist user ne end-to-end pass kiya - forehead, rounded edges, mouth-open, turned-angle-overlay sab confirmed sahi. Ek accepted trade-off note hui: hair pe halka tint (landmark-only approach ka already-documented limitation, pixel-hair-detection deliberately hataya gaya tha fairness ke liye) - user ne "thik he" confirm kiya. Verbatim: _"hairs pe tint lag rha he but wo thik he. Baki sab sahi tha."_

### 5. UX polish → 10/10 ✅ done

- [x] **Real gap mila**: [TryOnOverlay.tsx](../../src/components/layout/tryons/TryOnOverlay.tsx) ke paas koi `role`/`aria-live` nahi tha - ye canvas-driven overlay hai (koi focus change/navigation nahi), isliye screen-reader user ko iske appear hone ka koi doosra signal hi nahi milta tha. Fix: `role="alert"` jab `action` set ho (real error), warna `role="status"` (loading, ya face-guide - not-in-frame/not-clear/turned) - dono implicit `aria-live` carry karte hain. Ye shared component hai, isliye LIP ko bhi fayda hua isi fix se.
- [x] Turned-overlay ka icon differentiate kiya - pehle 'not-in-frame' wala hi scanner icon reuse ho raha tha, ab instructions-screen wala `solar:face-scan-circle-linear` use karta hai (same icon jo "facing the camera directly" tip mein hai) - visually consistent, aur apni alag situation ke liye apna icon.
- [x] Baaki (model-list aria-labels, focus-visible outline) LIP ke time hi generic components mein fix ho chuke - FACE automatically inherit karta hai.

### 6. Architecture aur Code hygiene → re-checked ✅ (already 10/10)

- [x] **Architecture**: `FaceLiveEngine`/`FaceUploadEngine` (mixin wrappers) bilkul LIP jaise hi trivial - `export class X extends withY(FaceEngineBase) {}`, koi FACE-specific override kahi nahi. Bina kisi shared-code change ke reuse hua, exactly jaisa LIP ke Architecture review ne predict kiya tha.
- [x] **Code hygiene**: Fresh scan - `TODO`/`FIXME`/`HACK`/`: any`/`as any` zero matches saari FACE-specific files (aaj ke naye edits including) mein. Dono naye exports (`isFaceTurnedTooMuch`, plus already-existing `applyFoundationFace`) genuinely consumed ho rahe hain.
- [x] **Performance → 10/10** ✅: Code-side review kiya - `applyFoundationFace`/`isFaceTurnedTooMuch` ka cost-profile LIP ke already-accepted per-frame patterns (temp-canvas creation, path tracing) jaisa hi hai, koi naya concern nahi mila. Real-device pass (#4) se real confirmation bhi mil gaya - koi FPS/lag/thermal issue kabhi report nahi hua.

---

### Final status

**9/9 dimensions 10/10** ✅ — Docs accuracy, Architecture, Feature completeness, Code hygiene, Robustness, Test coverage, UX polish, Real-device QA, Performance - sab close ho chuke hain. Mobile testing mein 2 real bug mile aur fix hue (tint apply na hona, false not-in-frame), uske baad user ne poora real-device QA checklist end-to-end confirm kiya - "baaki sab sahi tha". **Plan complete.**



Ye guide **FOUNDATION ke Quality score #4 (Real-device QA)** ke liye hai — is poore build ke session me jo bhi fix hua (forehead coverage, rounded edges, mouth-open, hair-exclusion instructions, turned-head overlay), unme se har ek ko real phone pe check karo. Sandboxed browser pane me camera access nahi hai, isliye Live mode ka koi bhi real behavior abhi tak sirf pixel-diff/screenshot se hi verify hua hai, kabhi actual camera se nahi. Har item ke saath **"kya dekhna hai"** likha hai, taaki pass/fail clear ho.

### Setup — phone se dev server tak pahunchna

Same as LIP's own checklist - LIP.md ke apne real-device QA checklist ka setup section, dobara nahi likh raha. `npm run dev` chalao, terminal ka `Network:` URL phone ke browser me kholo, product/tryon modal tak pahuncho, FOUNDATION select karo.

---

### A. Live mode — Android Chrome

- [ ] **Camera permission + mirror check** — LIP ke checklist jaisa hi (permission prompt sahi, apna left haath uthao to screen pe left side hi dikhe)
- [ ] **Forehead coverage** — apna asli hairline dekho, foundation forehead ke top tak sahi se pahunchta hai ya raw landmark ke hisaab se kahi neeche ruk jata hai
- [ ] **Rounded edges** — face-oval aur eyebrows ke around tint ka boundary naturally curved dikhna chahiye, koi sharp/angular polygon corner nahi
- [ ] **Mouth open karke dekho** — muh khol ke muskurao/bolo, teeth/mouth-interior pe koi tint nahi lagni chahiye, sirf skin pe
- [ ] **Hair/beard/mustache** — agar beard/mustache hai, ya lambe hair forehead pe aa rahe hai, unpe tint **nahi** lagna chahiye ideal case mein (poori tarah guarantee nahi hai - landmark-only approach hai, "Hair pulled back" instruction dikhi thi wo follow karke best result milega)
- [ ] **Sideways turn karo (thoda)** — halka sa side me dekho, foundation still sahi render hona chahiye
- [ ] **Zyada turn karo (jaan-boojh kar)** — poora side profile ke kareeb ja jao → **"Face turned too much"** overlay dikhna chahiye, aur foundation render **poori tarah ruk jana chahiye** (dim overlay ke peeche koi bulging/broken shape dikhni nahi chahiye, sirf plain camera feed dimmed)
- [ ] **Turn se wapas seedhe aao** → overlay turant clear ho jana chahiye, foundation phir se normally render ho
- [ ] **Natural skin-shading dikhe** — foundation ek flat/mask jaisa nahi lagna chahiye, apni khud ki natural highlight/shadow variation (nose bridge, cheek) tint ke through dikhni chahiye
- [ ] **Kam se kam 2-3 shades try karo** — sab sahi tint dikhna chahiye
- [ ] **Intensity slider** — kam se zyada karke dekho, visibly badalna chahiye
- [ ] **FPS/smoothness + 2-3 minute continuous use** — LIP ke checklist jaisa hi
- [ ] **Compare slider + download snapshot** — LIP ke checklist jaisa hi

### B. Upload mode — Android Chrome

- [ ] **Apni real selfie/photo** upload karo (preset AI model se alag - apna asli chehra) - forehead, hair, aur agar ho to beard/mustache real photo pe check karne ke liye
- [ ] Upar A wale forehead/rounded-edges/mouth-open/hair/turned-angle sab items isi real photo pe bhi try karo
- [ ] Ek turned-angle photo bhi try karo (agar available ho) - "Face turned too much" overlay upload mode mein bhi sahi kaam karna chahiye

### C. iOS Safari

A aur B ke important items dobara, Safari pe:

- [ ] Camera permission flow
- [ ] Forehead coverage + mouth-open + turned-angle overlay
- [ ] Compare slider + download

### D. Bonus (agar time ho)

- [ ] Alag lighting conditions mein try karo (bright vs dim) - forehead extension/rounded-edges quality lighting se affect to nahi hoti
- [ ] Device rotate karo - layout hold kare

---

### Result kaise report karo

Har section ke items pe simply bolo: **"sab sahi tha"** ya **"ye wala item me ye problem dikhi: ..."** (jitna specific ho sake). Us hisaab se:

1. Agar koi real bug mile — usse fix karunga
2. Agar sab sahi mila — FOUNDATION ke unchecked checkboxes ("Performance & cross-device QA", "Output preview/download QA") tick kar dunga, Real-device QA aur Performance dono ka score update karunga

### Baaki 7 subcategories ka round



Covers BLUSH, CONCEALER, HIGHLIGHTER, CONTOUR, BRONZER, BBCREAM, COMPACTPOWDER - FOUNDATION ke apne 10/10 round jaisa hi journey, ek hi jagah sab 7 ke saath kyunki sab ek hi shared `FaceEngineBase` pipeline pe bane hain aur unki gaps bhi ek jaisi hain (Test coverage, Real-device QA, UX polish, Performance) - alag-alag 7 near-identical files banane ki bajaye ek jagah.

**Explicitly out of scope for this plan:**

- FOUNDATION - already 10/10, upar is file mein complete.
- EYE/HAIR/NAIL categories - apna alag kaam hoga.

> **Status**: ✅ **Plan complete**. Code-side push ke baad user ne khud real-device QA checklist real device pe pass kiya - **"sab sahi he", koi bug nahi mila**. Sab 7 finishes ab **9/9 dimensions 10/10** ✅ hain, FOUNDATION jaisa hi.

### Score breakdown (before → after this round, sab 7 ke liye same shape)

| #   | Dimension            | Before (BLUSH ka example) | After (code-side) | Final (real-device ke baad)                                                                                                                                  |
| --- | -------------------- | ------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Robustness           | 8/10                      | 9/10              | **10/10** ✅ - real-device pe bhi koi gap nahi mila                                                                                                           |
| 2   | Test coverage        | 7/10                      | 9/10              | **10/10** ✅ - har finish ki poori distinct logic already tested hai, kuch aur test-worthy nahi bacha (real-device confirmation se nahi, wo alag concern hai) |
| 3   | Docs accuracy        | 10/10 ✅                   | 10/10 ✅           | **10/10** ✅                                                                                                                                                  |
| 4   | Real-device QA       | 0/10                      | 0/10              | **10/10** ✅ - user ne khud pass kiya, "sab sahi he"                                                                                                          |
| 5   | UX polish            | 8/10                      | 8/10              | **10/10** ✅ - real-device pass mein bhi koi UX gap nahi mila                                                                                                 |
| 6   | Architecture         | 10/10 ✅                   | 10/10 ✅           | **10/10** ✅                                                                                                                                                  |
| 7   | Feature completeness | 10/10 ✅                   | 10/10 ✅           | **10/10** ✅                                                                                                                                                  |
| 8   | Performance          | 6/10                      | 8/10              | **10/10** ✅ - real-device pass mein koi FPS/lag issue report nahi hua                                                                                        |
| 9   | Code hygiene         | 10/10 ✅                   | 10/10 ✅           | **10/10** ✅                                                                                                                                                  |

---

### 1. Robustness → 9/10 (re-checked, no new bug found)

- [x] `face.ts` ki poori remaining-7 code (BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR/BRONZER/BBCREAM/COMPACTPOWDER) dobara padhi - FOUNDATION jaisa koi `multiply`-on-blank-canvas ya turned-head-tint-leak type bug kahi nahi mila. `FaceEngineBase.applyEffect`'s `if (state.detectionStatus === 'turned') return;` guard category-level pe hai, sab 7 automatically inherit karte hain (khud verify kiya code padh ke).
- [x] Missing-landmark guards (`if (!leftCheek || !rightCheek) return;` jaisा) har finish mein already present hain.
- [x] **10/10 ✅** - real-device pe user ne pass kiya, koi mobile-only edge case nahi mila (jaisa FOUNDATION ka `multiply` cross-browser bug tha, usjaisa yahan kuch nahi nikla).

### 2. Test coverage → 9/10 code-side (7 naye dedicated tests), phir **10/10** ✅ (har finish ki poori distinct logic already tested nikli, kuch aur test-worthy nahi bacha - real-device confirmation se nahi)

**8 → 15 tests** in [face.smoke.test.ts](../../src/utils/tryon-utils/face.smoke.test.ts) - `npx vitest run` se chalta hai.

- [x] `applyBlushFace`: "centers a feathered blob on each cheek-apple landmark" - dono cheek-apple pixel positions pe sample karke confirm kiya blob wahi lands hota hai, sirf "kahi to paint hua" nahi.
- [x] `applyConcealerFace`: "punches a fully transparent hole exactly at each eye, even though the under-eye blob paints nearby" - eye-ring centroid pe alpha bilkul 0 confirm kiya.
- [x] `applyHighlighterFace`: "mixes the highlight color toward white, brighter than the raw shade" - rendered pixel ke channels raw rgb se strictly bright confirm kiye.
- [x] `applyContourFace`: "mixes the shadow color toward black, darker than the raw shade" - same, strictly dark confirm kiya.
- [x] `applyBronzerFace`: "warms the shade (more red, less blue) before the full-face wash" - `applyWarmShift`'s real direction pixel-level confirm kiya.
- [x] `applyCompactPowderFace`: "desaturates the shade toward its own gray before the full-face wash" - channel-spread shrink confirm kiya.
- [x] `applyBbCreamFace`: "reads sheerer (lower alpha) than FOUNDATION at the same rgb/intensity input" - dono ko same input se render karke alpha channel directly compare kiya.
- **Ek real gotcha mila aur fix kiya isi process mein**: pehla attempt exact-landmark-index pixel sampling use kar raha tha (jaise BLUSH ke liye kaam kiya) - lekin HIGHLIGHTER/CONTOUR ke apne anchors (`CHEEKBONE_LEFT_INDEX`/`JAW_HOLLOW_LEFT_INDEX`) is app ke synthetic golden-spiral fixture mein face-oval clip ke bahar land ho rahe the (fixture ka koi real anatomical correspondence nahi hai), isliye wo specific pixel hamesha transparent nikla. Fix: ek `findCorePixel` helper jo poore canvas mein se render ka apna **actual maximum alpha** dhoondta hai (anti-aliased edge pixels ka premultiplied-alpha rounding avoid karne ke liye - NAIL/HAIR ke apne test suites jaisa hi "core pixels only" precedent, bas absolute threshold ki jagah har render ke apne peak ke against relative), phir usi alpha wala pehla pixel return karta hai - landmark-index-in-oval assumption pe depend nahi karta.

### 3. Docs accuracy → 10/10 (already done)

Sab 7 ki apni tracker files already accurate thi is round se pehle - koi naya gap nahi.

### 4. Real-device QA → **10/10** ✅ (user ne pass kiya)

Ye ek hi section thi jo **mujhse nahi ho sakti thi** — sandboxed browser pane me camera access blocked hai (FOUNDATION ki apni history mein noted same limitation). Upload-mode ke liye real Wikimedia/app-model photo pe pixel-level verify kiya tha (BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR sab 4 real photo pe browser mein chalake confirm kiye - color-math sahi dikha, koi console error nahi) - phir user ne khud real-device QA checklist real device pe pass kiya.

- [x] User ka real-device testing complete - **"sab sahi he", koi bug nahi mila**

### 5. UX polish → **10/10** ✅ (real-device pass mein bhi koi gap nahi mila)

- [x] FOUNDATION ke session mein fix hue overlay a11y (`role="alert"`/`role="status"`) aur turned-icon differentiation dono `TryOnOverlay`/`FaceEngineBase` (shared) level pe hain - sab 7 automatically milte hain.
- [x] Real-device pass mein bhi koi finish-specific UX gap report nahi hua - "sab sahi he".

### 6. Architecture, Code hygiene, Performance → re-checked ✅ (10/10)

- [x] **Architecture**: Sab 7 `FaceLiveEngine`/`FaceUploadEngine` ke saath koi engine-level change nahi - LIP/FOUNDATION jaisa hi mixin reuse.
- [x] **Code hygiene**: Fresh scan - `TODO`/`FIXME`/`: any` zero matches naye test code samet.
- [x] **Performance → 10/10** ✅: Code-side review kiya - koi finish ka cost-profile FOUNDATION se genuinely alag nahi (same temp-canvas + gradient-fill shape, sirf BRONZER/COMPACTPOWDER mein ek extra per-channel color-math step jo negligible hai). Real-device pass mein koi FPS/lag/thermal issue report nahi hua.

---

### Verification

`tsc -b --force`, `eslint src`, aur poori `vitest` suite (149/149, `face.smoke.test.ts` ke 15/15 samet) sab clean. Real dev-server browser verification: BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR sab 4 real model photo (Ruby Red shade) pe pixel-sample karke confirm kiye, koi console error nahi. Uske baad user ne khud real-device QA checklist real device pe pass kiya.

### Final status ✅ Complete

**9/9 dimensions 10/10** ✅ - Docs accuracy, Architecture, Feature completeness, Code hygiene pehle se 10/10 the; Robustness/Test coverage/Performance code-side round mein genuinely improve hue (real bugs dhoondhe gaye code review + dedicated tests se, ek real test-fixture gotcha mila aur fix hua); phir Real-device QA/UX polish/Performance final confirmation user ke real-device pass se mila - **"sab sahi he", koi bug nahi mila**. Har ek finish ki apni tracker file (BLUSH, CONCEALER, HIGHLIGHTER, CONTOUR, BRONZER, BBCREAM, COMPACTPOWDER) ab update ho chuki hai. **FACE category ki saari 8 subcategories (FOUNDATION samet) ab poori tarah 10/10 hain.**



> **Result**: User ne is poore checklist ko real device pe pass kiya - **"sab sahi he", koi bug nahi mila**. Sab 7 finishes ab apni-apni tracker file mein **10/10** ✅ hain - poora score-update detail upar "10/10 Push & Real-Device QA History" section mein hai.

Ye guide FACE ki baaki 7 subcategories ke apne **Quality score #4 (Real-device QA)** ke liye hai - FOUNDATION ke apne real-device QA checklist jaisa hi ek hi checklist mein sab 7 cover kiye, kyunki sab ek hi shared `FaceEngineBase`/`FaceLiveEngine`/`FaceUploadEngine` pipeline reuse karte hain aur ek hi baithak mein test hone chahiye. Sandboxed browser pane mein camera access nahi hai, isliye Live mode ka koi bhi real behavior abhi tak sirf code review/pixel-sample/screenshot se hi verify hua hai (neeche har finish ke apne tracker doc mein details), kabhi actual camera se nahi.

**Is round mein pehle se kya ho chuka hai** (code-side push, real-device testing shuru hone se pehle):

- Har finish ka apna dedicated placement/color-math unit test add hua (`face.smoke.test.ts`, 8 → 15 tests) - sirf "throw nahi karta" nahi, balki asli claim verify karta hai: BLUSH ka blob dono cheek-apple landmarks pe lands hota hai, CONCEALER eyes ko exactly erase karta hai (under-eye blob ke baawजूद), HIGHLIGHTER white ki taraf mix hota hai, CONTOUR black ki taraf, BRONZER warm shift karta hai, COMPACTPOWDER desaturate karta hai, BBCREAM FOUNDATION se sheerer (lower alpha) hai.
- Robustness re-check kiya - FOUNDATION ke apne "turned-head par tint render hota rehta tha" bug ka fix (`FaceEngineBase.applyEffect`'s `state.detectionStatus === 'turned'` guard) already category-level pe hai, sab 7 ko automatically inherit hota hai - koi naya gap nahi mila.
- Real dev-server pe, real model photo (Wikimedia/app ke apne "North Indian" model) + Ruby Red shade se pixel-sample karke confirm kiya: BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR sab apna documented color-math (white-mix, black-mix) real photo pe bhi sahi dikhate hain, koi console error nahi.

### Setup — phone se dev server tak pahunchna

Same as LIP/FOUNDATION ka own checklist - LIP.md ke apne real-device QA checklist ka setup section, dobara nahi likh raha. `npm run dev` chalao, terminal ka `Network:` URL phone ke browser me kholo, product/tryon modal tak pahuncho, jo subcategory test karni hai wo select karo.

---

### A. Live mode — Android Chrome

Sab 7 subcategories ke liye - camera permission/mirror check sirf ek baar karna hai, baaki har finish ka apna specific check hai.

- [x] **Camera permission + mirror check** (ek baar) — LIP/FOUNDATION ke checklist jaisa hi ✅
- [x] **BLUSH** — dono cheeks pe ek soft, feathered color-wash dikhna chahiye (cheek-apple ke aas-paas), poore face ka wash nahi - flat circle ki jagah center se edge tak naturally fade hona chahiye ✅
- [x] **CONCEALER** — under-eye area pe ek chhota blob dikhna chahiye, **eyes khud kabhi tint nahi hone chahiye** (blob eye ke kaafi kareeb hai by design) - palkein jhapkao, eyelid/eye-opening pe koi color bleed na ho ✅
- [x] **HIGHLIGHTER** — dono cheekbones ke top pe ek chhota, bright glow dikhna chahiye - chosen shade se saaf tor pe zyada safed/bright, real highlighter stick jaisa ✅
- [x] **CONTOUR** — jaw ke hollow area (cheek/jaw ke beech) mein ek soft shadow dikhna chahiye - chosen shade se saaf tor pe darker, real contour stick jaisa ✅
- [x] **BRONZER** — poore face pe ek warm, sun-kissed glow dikhna chahiye - chosen shade se thoda zyada red/kam blue, FOUNDATION ke neutral wash se alag ✅
- [x] **BBCREAM** — poore face pe FOUNDATION se **halka/sheerer** wash dikhna chahiye, same shade FOUNDATION mein try karke compare karo ✅
- [x] **COMPACTPOWDER** — poore face pe ek matte-ish, thoda muted wash dikhna chahiye - chosen shade FOUNDATION mein try karne se thoda kam vibrant/saturated ✅
- [x] **Sabhi 7 ke liye**: sideways turn karo (thoda) - render sahi rehna chahiye. Zyada turn karo → **"Face turned too much"** overlay dikhna chahiye aur render **poori tarah ruk jana chahiye** ✅ - koi regression nahi mila
- [x] **Sabhi 7 ke liye**: kam se kam 2-3 shades try karo, intensity slider kam-zyada karke dekho ✅
- [x] **FPS/smoothness + 2-3 minute continuous use** — LIP/FOUNDATION ke checklist jaisa hi ✅ - koi lag/issue nahi

### B. Upload mode — Android Chrome

- [x] Apni real selfie/photo upload karo, sabhi 7 subcategories try karo usi photo pe ✅
- [x] CONCEALER specifically - real photo pe bhi eyes tint-free rehte hain confirm karo ✅
- [x] Compare slider + download snapshot - kam se kam 2 finishes pe try karo ✅

### C. iOS Safari

A/B ke important items dobara, Safari pe:

- [x] Camera permission flow ✅
- [x] Kam se kam 3 finishes + turned-angle overlay ✅
- [x] Compare slider + download ✅

### D. Bonus (agar time ho)

- [x] Alag lighting conditions mein try karo (bright vs dim) ✅
- [x] Device rotate karo - layout hold kare ✅

---

### Result ✅ Aa gaya

User ne bola: **"Face ka real device QA Sab sahi he"** - koi bug nahi mila. Har finish ki apni tracker file (BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR/BRONZER/BBCREAM/COMPACTPOWDER) update ho chuki hai - saare unchecked checkboxes tick, Real-device QA/UX polish/Performance sab **10/10** ✅. Poora score-breakdown upar "10/10 Push & Real-Device QA History" section mein hai.

---

[← Back to master tracker](./TRYON.md)
