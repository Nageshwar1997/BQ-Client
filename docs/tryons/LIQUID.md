# LIQUID (NAIL) Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to NAIL category](./NAIL.md) · [← Build plan](./NAIL-PLAN.md)

_Tracking model: hand/finger landmarks (MediaPipe `HandLandmarker`, 21 points per hand) - NAIL ki apni poori tarah alag `HandTrackingEngineBase`/`withLiveCameraHands`/`withImageUploadHands` stack pe bani hai, LIP/EYE/FACE ka shared `TryOnEngineBase` reuse nahi karti. Poori reasoning [NAIL-PLAN.md](./NAIL-PLAN.md#engine-architecture---shared-tryonenginebase-phir-bhi-reuse-nahi-ho-sakta-lekin-hair-jitna-alag-nahi) mein hai._

> **NAIL ka pehla built finish, aur poore is category ke naye engine/type/rendering stack ka foundation**. GEL/DIPPOWDER/GLITTER/CHROME abhi LIQUID ke hi fallback pe render hote hain (`UNSUPPORTED_NAIL_FINISHES`, [NailEngineBase.ts](../../src/classes/tryon/categories/nail/NailEngineBase.ts)) - GEL/DIPPOWDER sabse kam marginal cost honge (LIQUID ka fill primitive + existing FACE color-math), GLITTER ko HIGHLIGHTS ka deterministic-PRNG pattern chhote scale pe, CHROME ko ek naya metallic-gradient technique chahiye, [NAIL-PLAN.md](./NAIL-PLAN.md#suggested-build-order)'s build order ke hisaab se.

## Summary

| Mode    | Done  | Total | %                               |
| ------- | ----- | ----- | ------------------------------- |
| Live    | 0     | 4     | 0%                              |
| Upload  | 4     | 4     | 100%                            |
| **All** | **4** | **8** | **50% — [detail](./LIQUID.md)** |

## Checklist

**Live**

- [ ] Camera capture + hand/finger-landmark tracking wired - `NailLiveEngine`/`withLiveCameraHands` likhe gaye, `withLiveCamera`'s exact shape mirror karte hain (HAIR ke `withLiveCameraSegmentation` jitna divergent nahi - `HandLandmarker.detectForVideo` bhi synchronous hai). Is session mein genuinely test nahi hua (real camera hardware is environment mein available nahi tha).
- [ ] Standard-finish full-nail color fill real-time me render ho - same `applyLiquidNail` jo Upload mode mein verified hai - Live-specific execution abhi untested.
- [ ] Variant/intensity picker functional - engine-level `setMakeupState({color, range})` script se verified (neeche Design notes dekho) - real product page ke through abhi exercise nahi hua.
- [ ] Performance & cross-device QA - `numHands: 2` ka per-frame cost Live mode mein genuinely check nahi hua ([NAIL-PLAN.md](./NAIL-PLAN.md)'s Open question 2) - standing convention ke hisaab se bhi deferred hai (dekho [tryon-qa-deferred-until-all-built memory]).

**Upload**

- [x] Photo upload + hand/finger-landmark detection static image pe - is session mein end-to-end browser-verified: real dev server pe, real self-hosted `hand_landmarker.task` model download+load hua, ek real hand photo (Wikimedia Commons ka "Hand, fingers - back.jpg", back-of-hand view) pe detection chala, `imageReady: true` aur `faceDetection: 'detected'` dono confirm hue.
- [x] Standard-finish full-nail color fill image pe apply ho - do alag colors (red `#c41e3a`, purple `#8b5cf6`) ke saath screenshot-verified - har visible fingertip pe ek nail-shaped ellipse apne finger ke local angle pe correctly rotated dikha (pinky ka thoda tilt bhi sahi follow hua), skin/background bilkul untouched raha.
- [x] Shade/variant picker functional - engine-level verified (`setMakeupState` se color change karke re-render confirm kiya, screenshot se dikha).
- [x] Output preview/download QA - `takeSnapshot()` verified, ek valid `data:image/png` data URL return karta hai (CORS-enabled test photo ki wajah se canvas taint nahi hua).

## Design notes

- **Poora naya engine stack, LIP/EYE/FACE/HAIR ka nahi**: `TryOnEngineBase`/`SegmentationEngineBase` dono apne-apne tracking model (FaceLandmarker/ImageSegmenter) ke against hardcoded hain, aur `HandLandmarkerResult.landmarks` ek `NormalizedLandmark[][]` hai (**multiple** hands) jo `IRenderTargetParams`'s single-`face` shape fit nahi karta. Isliye ek poora parallel stack likha gaya: `HandTrackingEngineBase` (`TryOnEngineBase` ka close mirror), `withLiveCameraHands`/`withImageUploadHands` (mixins ka fork), `HandLandmarkerCache` (`FaceLandmarkerCache` ka mirror, `HandLandmarker` ke liye, `numHands: 2`), aur `INailRenderTargetParams`/`INailRenderEffectBaseParams`/`INailRenderParams`/`IApplyNailEffectParams` (`types/tryon-types/nail.ts`). Poori reasoning [NAIL-PLAN.md](./NAIL-PLAN.md#engine-architecture---shared-tryonenginebase-phir-bhi-reuse-nahi-ho-sakta-lekin-hair-jitna-alag-nahi) mein hai.
- **HAIR se kam divergent - `HandLandmarker` bhi synchronous hai**: `ImageSegmenter` (HAIR) ka sync overload "high-throughput mein mat use karo" warning deta tha, isliye Live mode ko callback overload chahiye tha. `HandLandmarker.detect`/`detectForVideo` mein aisi koi warning nahi hai (`FaceLandmarker` jaisa hi) - isliye `withLiveCameraHands`/`withImageUploadHands` `withLiveCamera`/`withImageUpload` ke bahut kareeb hain, HAIR ke segmentation-specific callback complexity ki zaroorat nahi padi.
- **Model choice, aur ek honest ceiling**: Google ka published "Hand Landmarker" (`hand_landmarker.task`, ~7.8MB, 21 landmarks/hand, `numHands: 2`) - official docs se URL confirm kiya, directly hit karke bhi verify kiya. HAIR ke Hair Segmenter jaisa koi ready-made **nail-segmentation** model exist nahi karta (web research se confirm kiya - real production apps HandLandmarker + ek custom-trained model combine karte hain, jo kahin drop-in available nahi hai) - isliye NAIL landmark+geometric-approximation approach use karta hai, pixel segmentation nahi.
- **Naya primitive: per-finger anchor + rotate**: `drawNail` (`utils/tryon-utils/nail.ts`) har finger ke apne last-do-joints (`FINGER_TIP_JOINT_INDICES` - TIP aur DIP/IP) ke beech ka vector leta hai, us vector ke length ka ek fraction (`NAIL_START_RATIO`-`NAIL_END_RATIO`) center anchor ke liye, aur ek rotated ellipse fill karta hai us finger ke apne local angle pe. Is app ka **pehla** primitive jo per-instance rotation use karta hai - har existing FACE/EYE blob sirf translate+scale karta hai (face hamesha roughly upright hoti hai), lekin fingers kisi bhi direction mein point kar sakte hain. Real photo pe verify kiya - pinky ka apna thoda tilt bhi sahi reflect hua.
- **Flat opaque fill, HAIR ka luminance-preserving blend nahi**: HAIR ko `'color'` blend chahiye tha (strand shading preserve karne ke liye), lekin real nail polish opaque hota hai (FOUNDATION/CONCEALER jaisa) - isliye `drawNail` seedha `ctx` pe ek flat `fillStyle` + `alpha` ke saath ellipse draw karta hai, koi offscreen-canvas indirection ya blend mode nahi chahiye (koi exclusion-hole ya multi-step composite bhi nahi hai jo ek intermediate buffer maange).
- **`getHandDetectionStatus` - naya, hand-count based**: `getFaceDetectionStatus`/`getHairDetectionStatus` dono ke apne bounding-box/coverage checks NAIL ke liye meaningful nahi hain - iska apna parallel sirf "kam se kam ek hand detect hua ya nahi" check karta hai. Sirf `'detected'`/`'not-in-frame'` produce karta hai, same precedent jo BROWGEL/HAIR ne already establish kiya tha.
- **Ab tak ki verification**: `tsc -b --force`, `eslint`, aur `src/utils/tryon-utils` + `src/constants/tryon-constants` ki poori `vitest` suite (126/126, `nail.smoke.test.ts` samet - render smoke test, empty-hands no-op, multi-hand test, aur ek dedicated rotation-math test) sab clean/pass hoti hain. Real dev-server browser verification: `NailUploadEngine` ko directly instantiate karke (real product page ke through nahi, kyunki dev DB mein koi NAIL-configured product nahi tha), ek real, freely-licensed hand photo (Wikimedia Commons, CORS-enabled) pe do alag colors try kiye, screenshot se confirm kiya ki nails genuinely visible hain aur sahi position/rotation pe hain, `takeSnapshot()` bhi verify kiya.
- **Abhi kya baaki hai**: Live camera mode bilkul untested (no hardware is environment mein). Real product page ka poora flow bhi untested. GEL/DIPPOWDER/GLITTER/CHROME abhi LIQUID ke fallback pe render hote hain, apni dedicated rendering nahi hai. Palm-vs-back-of-hand detection ([NAIL-PLAN.md](./NAIL-PLAN.md)'s Open question 1) algorithmically solve nahi kiya gaya - instructions screen pe hi bola gaya hai.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), aur har FACE/EYE/HAIR finish ka apna tracker.

> **Status**: NAIL category ka pehla build, aur is poore try-on feature ka pehla hand-tracked finish. Naya engine stack (`HandTrackingEngineBase` + hand-tracking mixins) end-to-end kaam karta hua verify hua - real model, real photo, real nail placement/rotation. Full formal real-device QA - is session ke apne standing convention ke hisaab se - deliberately deferred hai jab tak har planned NAIL subcategory exist na kar le.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                                 |
| --- | -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Robustness           | 7/10     | Naya engine stack hai lekin `HandLandmarker`'s sync API `FaceLandmarker`'s already-battle-tested shape ke bahut kareeb hai - HAIR ke callback-based divergence jitna naya risk nahi. |
| 2   | Test coverage        | 8/10     | 6 dedicated tests (render smoke, empty-hands, multi-hand, rotation-math, 2 detection-status) - Live-mode ka path bilkul untested.                                                    |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                           |
| 4   | Real-device QA       | 1/10     | Live camera mode bilkul test nahi hua; Upload mode ko engine-level ek real photo/browser verification mili is session mein.                                                          |
| 5   | UX polish            | 6/10     | Shared shade picker/intensity slider reuse karta hai (naya UI surface nahi), real product-page flow abhi kabhi exercise nahi hua.                                                    |
| 6   | Architecture         | 8/10     | Clean parallel-hierarchy design, `TryOnEngineBase`/`FaceEngineBase` ka exact mirror - lekin abhi sirf ek hi consumer (LIQUID khud), doosre 4 finishes ne isse stress nahi kiya.      |
| 7   | Feature completeness | 2/10     | 5 mein se 1 NAIL finish ka apna dedicated rendering hai, baaki 4 fallback pe hain.                                                                                                   |
| 8   | Performance          | 5/10     | `numHands: 2` ka per-frame cost Live mode mein genuinely measure nahi hua abhi - design-time decision hai, verified nahi.                                                            |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                              |

**Overall**: ~**6.3/10** — poora naya foundation kaam karta hua verify hua (yehi sabse bada risk tha, real photo pe genuinely convincing result mila), lekin Live-mode/real-device/multi-finish coverage abhi genuinely bacha hai, HAIR ke COLOR jaisa hi starting point. Next step: GEL + DIPPOWDER (dono LIQUID ke fill primitive pe existing FACE color-math laga dete hain, near-zero marginal cost), phir GLITTER, phir CHROME - [NAIL-PLAN.md](./NAIL-PLAN.md#suggested-build-order)'s build order ke hisaab se.

---

[← Back to master tracker](./README.md) · [← Back to NAIL category](./NAIL.md) · [← Build plan](./NAIL-PLAN.md)
