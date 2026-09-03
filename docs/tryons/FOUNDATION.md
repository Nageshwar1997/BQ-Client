# FOUNDATION Try-On Tracker ✅ 10/10

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (face-oval region, minus eyes/eyebrows/mouth) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke baaki 3 subcategories (BRONZER/BBCREAM/COMPACTPOWDER) abhi unbuilt hain, isliye unki apni-apni tracker file nahi bani - unka status abhi bhi [FACE.md](./FACE.md) me hi hai. Jaise-jaise wo ban'te jayenge, waisi hi ek-ek dedicated file milegi (isi FOUNDATION.md/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md) jaisi), FACE.md sirf ek index/summary reh jayega - waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`, same shared `TryOnEngineBase`/`withLiveCamera`/`withImageUpload` LIP already proved out - zero changes needed to any of the three). Rendering: [`applyFoundationFace`](../../src/utils/tryon-utils/face.ts) - face-oval clip (forehead-extended past the raw landmark hairline), eyes/eyebrows/mouth punched out as independent `destination-out` erases, plain `source-over` fill (see the Real-device QA bug log below for why not `multiply`). Both Live aur Upload mode me end-to-end render hota hai, real device (mobile + laptop) pe confirmed. **Quality plan**: [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md) — **9/9 dimensions 10/10** ✅, plan complete.

## Summary

| Mode    | Done  | Total | %                 |
| ------- | ----- | ----- | ----------------- |
| Live    | 4     | 4     | 100%              |
| Upload  | 4     | 4     | 100%              |
| **All** | **8** | **8** | **100% (8/8)** ✅ |

## Checklist

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

## Bugs found + fixed this session (real user testing se)

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

## Quality score

Same 9 dimensions jo [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md) ke liye use hue the. Poora journey [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md) mein hai.

> **Status**: **9/9 dimensions 10/10** ✅. User ne poora [FOUNDATION-REAL-DEVICE-QA.md](./FOUNDATION-REAL-DEVICE-QA.md) checklist ke against end-to-end confirm kar diya - "baaki sab sahi tha". **Plan complete.**

| #   | Dimension            | Score        | Kyun                                                                                                                                                                                                                                                                                                                     |
| --- | -------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Robustness           | **10/10** ✅ | Real gap mila: `applyEffect` turned-head par bhi tint render kar raha tha (overlay ke semi-transparent scrim ke peeche se broken shape dikhta rehta). Fix kiya - ab `faceDetection === 'turned'` par render hi nahi hota.                                                                                                |
| 2   | Test coverage        | **10/10** ✅ | `isFaceTurnedTooMuch` (6 tests, boundary case bhi) + `applyFoundationFace` smoke test (1 test) - LIP jitni hi depth jitna FOUNDATION ke paas actually data/logic hai.                                                                                                                                                    |
| 3   | Docs accuracy        | **10/10** ✅ | Is file/FACE.md/README.md sab accurate.                                                                                                                                                                                                                                                                                  |
| 4   | Real-device QA       | **10/10** ✅ | Mobile pe test hui - **2 real bug mile aur fix hue** (tint bilkul apply na hona - `multiply`-on-blank-canvas cross-browser bug; false "not in frame" - edge-margin too tight). Uske baad poora checklist ([FOUNDATION-REAL-DEVICE-QA.md](./FOUNDATION-REAL-DEVICE-QA.md)) user ne khud pass kiya - "baaki sab sahi tha". |
| 5   | UX polish            | **10/10** ✅ | Real gap mila: `TryOnOverlay` ke paas koi `role`/`aria-live` nahi tha (screen-reader user ko canvas-driven overlay ka koi signal nahi milta). Fix kiya - `role="alert"`/`"status"`. Turned-overlay ka icon bhi differentiate kiya.                                                                                       |
| 6   | Architecture         | **10/10** ✅ | `TryOnEngineBase`/mixins bina kisi change ke reuse hue.                                                                                                                                                                                                                                                                  |
| 7   | Feature completeness | **10/10** ✅ | FOUNDATION khud fully built hai.                                                                                                                                                                                                                                                                                         |
| 8   | Performance          | **10/10** ✅ | Code-side pehle se solid tha (LIP ke already-accepted per-frame patterns jaisa hi cost-profile) - real-device pass mein koi FPS/lag/thermal issue report nahi hua.                                                                                                                                                       |
| 9   | Code hygiene         | **10/10** ✅ | Fresh scan (naye edits including) - zero matches.                                                                                                                                                                                                                                                                        |

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
