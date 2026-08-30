# FOUNDATION Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (face-oval region, minus eyes/eyebrows/mouth) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke baaki 7 subcategories (CONCEALER/HIGHLIGHTER/BLUSH/CONTOUR/BRONZER/BBCREAM/COMPACTPOWDER) abhi unbuilt hain, isliye unki apni-apni tracker file nahi bani - unka status abhi bhi [FACE.md](./FACE.md) me hi hai. Jaise-jaise wo ban'te jayenge, waisi hi ek-ek dedicated file milegi (isi FOUNDATION.md jaisi), FACE.md sirf ek index/summary reh jayega - waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`, same shared `TryOnEngineBase`/`withLiveCamera`/`withImageUpload` LIP already proved out - zero changes needed to any of the three). Rendering: [`applyFoundationFace`](../../src/utils/tryon-utils/face.ts) - face-oval clip (forehead-extended past the raw landmark hairline), eyes/eyebrows/mouth punched out as independent `destination-out` erases, `multiply` blend so real skin shading shows through instead of a flat mask. Both Live aur Upload mode me end-to-end render hota hai. **Quality plan**: [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md) — 7/9 dimensions ab 10/10, baaki 2 [FOUNDATION-REAL-DEVICE-QA.md](./FOUNDATION-REAL-DEVICE-QA.md) pe depend karte hain.

## Summary

| Mode    | Done  | Total | %       |
| ------- | ----- | ----- | ------- |
| Live    | 3     | 4     | 75%     |
| Upload  | 3     | 4     | 75%     |
| **All** | **6** | **8** | **75%** |

## Checklist

**Live**

- [x] Camera capture + full-face landmark tracking wired
- [x] Full-face base-tone blend rendered in real-time
- [x] Shade/variant picker functional (linked to product variants)
- [ ] Performance & cross-device QA (FPS, lighting conditions) — never run on a real device (sandboxed browser pane has no camera access) - see [Quality score](#quality-score) #4 neeche.

**Upload**

- [x] Photo upload + full-face landmark detection on static image
- [x] Full-face base-tone blend applied to image
- [x] Shade/variant picker functional
- [ ] Output preview/download QA — snapshot/download mechanism khud generic hai aur LIP ke liye already verified (`takeSnapshot()`), lekin FOUNDATION output specifically kabhi real device pe check nahi hua.

## Bugs found + fixed this session (real user testing se)

Sab already live-verified/pixel-diff-verified is session ke andar hi, code mein:

- [x] Forehead coverage — raw landmark oval hairline pe hi rukta tha, real forehead skin miss ho rahi thi. Fix: `applyForeheadExtension` (points ko upar taper ke saath push karta hai).
- [x] Sharp/faceted edges (eyebrows, face-oval) — plain `lineTo` polygon tha. Fix: `traceSmoothClosedPath` (quadratic-curve smoothing, LIP ke `applyLipTexture` wali hi technique).
- [x] Mouth-open bug — muh khulne pe andar (teeth/interior) tak tint chala jaata tha. Fix: `MOUTH_OUTER_CONTOUR_INDICES` (ek hi ring poori mouth-opening ke around, upper+lower band alag-alag nahi).
- [x] Hair/beard/mustache pe tint lagna — pehle ek pixel-color skin-detection heuristic try kiya (luminance/saturation based), lekin genuinely darker skin tones ko galat "hair" samajh leta tha - **fairness bug**, sirf tuning issue nahi. Poora hata diya. Fix: ab sirf landmark-geometry, hair-avoidance instructions screen pe hi hai (`FACE_UPLOAD_INSTRUCTIONS`/`FACE_LIVE_INSTRUCTIONS`).
- [x] Turned-head par eyebrow/eye/lips tak tint leak hona — eyes/eyebrows/mouth pehle outer-oval ke SAME evenodd path mein the; ek angle par ek feature ka apna ring self-intersect kar sakta tha, jo poore combined path ka count hi galat kar deta. Fix: `eraseExcludedFeatures` - har feature apna independent `destination-out` erase hai, ek doosre se cross-talk nahi.
- [x] Turned-head par tint nose ke aage tak "bulge" karna (occlusion-unaware 2D projection) — genuinely landmark-only approach se pura solve nahi ho sakta (real 3D/depth chahiye). Fix (mitigation): real-time turn-detection overlay - `isFaceTurnedTooMuch` (nose-tip se dono cheekbones ki symmetry check karta hai), turned-too-much hone par render hi nahi hota, user ko "face the camera directly" overlay dikhta hai.

## Quality score

Same 9 dimensions jo [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md) ke liye use hue the. Poora journey [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md) mein hai.

> **Status**: **7/9 dimensions 10/10** ✅. Baaki 2 (#4 Real-device QA, #8 Performance) ek hi gap ka hissa hain - real device pe end-to-end confirm, jaisa LIP mein bhi tha. [FOUNDATION-REAL-DEVICE-QA.md](./FOUNDATION-REAL-DEVICE-QA.md) ready hai.

| #   | Dimension            | Score        | Kyun                                                                                                                                                                                                                                        |
| --- | -------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | **10/10** ✅ | ~~8/10~~ Real gap mila: `applyEffect` turned-head par bhi tint render kar raha tha (overlay ke semi-transparent scrim ke peeche se broken shape dikhta rehta). Fix kiya - ab `faceDetection === 'turned'` par render hi nahi hota.          |
| 2   | Test coverage        | **10/10** ✅ | ~~8/10~~ `isFaceTurnedTooMuch` (6 tests, boundary case bhi) + `applyFoundationFace` smoke test (1 test) - LIP jitni hi depth jitna FOUNDATION ke paas actually data/logic hai.                                                              |
| 3   | Docs accuracy        | 10/10 ✅     | Is file/FACE.md/README.md sab accurate.                                                                                                                                                                                                     |
| 4   | Real-device QA       | 0/10         | **Abhi bhi baaki** - [FOUNDATION-REAL-DEVICE-QA.md](./FOUNDATION-REAL-DEVICE-QA.md) checklist ready hai, user ka end-to-end confirm chahiye.                                                                                                |
| 5   | UX polish            | **10/10** ✅ | ~~8/10~~ Real gap mila: `TryOnOverlay` ke paas koi `role`/`aria-live` nahi tha (screen-reader user ko canvas-driven overlay ka koi signal nahi milta). Fix kiya - `role="alert"`/`"status"`. Turned-overlay ka icon bhi differentiate kiya. |
| 6   | Architecture         | 10/10 ✅     | `TryOnEngineBase`/mixins bina kisi change ke reuse hue.                                                                                                                                                                                     |
| 7   | Feature completeness | 10/10 ✅     | FOUNDATION khud fully built hai.                                                                                                                                                                                                            |
| 8   | Performance          | 6/10         | Code-side re-confirmed (LIP ke already-accepted per-frame patterns jaisa hi cost-profile). Real FPS/thermal numbers #4 pe depend karte hain.                                                                                                |
| 9   | Code hygiene         | 10/10 ✅     | Fresh scan (naye edits including) - zero matches.                                                                                                                                                                                           |

### 10/10 tak pahunchne ke liye baaki

- [ ] **Real-device QA** (#4) — [FOUNDATION-REAL-DEVICE-QA.md](./FOUNDATION-REAL-DEVICE-QA.md) follow karke user end-to-end test kare.
- [ ] **Performance** (#8) — #4 ka hi real-device data se unlock hoga.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
