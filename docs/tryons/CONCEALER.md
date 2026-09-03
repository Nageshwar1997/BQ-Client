# CONCEALER Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (under-eye anchor points, one per eye) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ka baaki 1 subcategory (COMPACTPOWDER) abhi unbuilt hai, isliye uski apni tracker file nahi bani - uska status abhi bhi [FACE.md](./FACE.md) me hi hai. Jaise hi wo banega, waisi hi ek dedicated file milegi (isi CONCEALER.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md)/[BRONZER.md](./BRONZER.md)/[BBCREAM.md](./BBCREAM.md) jaisi), FACE.md sirf ek index/summary reh jayega - waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyConcealerFace`](../../src/utils/tryon-utils/face.ts) - under-eye anchor (`UNDER_EYE_LEFT_INDEX`/`UNDER_EYE_RIGHT_INDEX`, offset down into the under-eye hollow by `UNDER_EYE_OFFSET_RATIO`) par centered ek soft, feathered **ellipse** (BLUSH ke plain circular blob se alag - `drawFeatheredBlob` ab `radiusX`/`radiusY` dono leta hai, wider-than-tall shape jo real under-eye crescent jaisi dikhti hai). Radius eye ki apni detected width se scale hota hai (face ki nahi - under-eye area eye ke size ke saath scale karta hai). Face-oval mein clip hota hai (safety net, FOUNDATION/BLUSH jaisa hi), **plus eyes khud bhi `destination-out` se erase hote hain** (BLUSH ko iski zaroorat nahi thi - uska anchor kaafi door hai - lekin CONCEALER ka anchor eye ke bilkul paas hai, isliye gradient ka soft upar wala tail eye opening tak bleed kar sakta tha bina iske). FOUNDATION/BLUSH ke turn-detection overlay aur upload/live instructions dono automatically inherit hote hain.

## Summary

| Mode    | Done  | Total | %                                  |
| ------- | ----- | ----- | ---------------------------------- |
| Live    | 3     | 4     | 75%                                |
| Upload  | 3     | 4     | 75%                                |
| **All** | **6** | **8** | **75% — [detail](./CONCEALER.md)** |

## Checklist

**Live**

- [x] Camera capture + under-eye/blemish-region tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline already tracks the full 478-point mesh every frame, under-eye indices included, no extra wiring needed.
- [x] Spot-blend color correction rendered in real-time — `applyConcealerFace` wired into `FaceEngineBase.applyEffect`'s switch for `'CONCEALER'`, runs every `renderFrame` tick same as FOUNDATION/BLUSH. Verified via automated smoke test + a synthetic-face visual check (see Design notes) - **not yet confirmed on an actual live camera feed**.
- [x] Shade/variant picker functional (linked to product variants) — generic FACE UI, already proven working for FOUNDATION/BLUSH, no CONCEALER-specific change needed.
- [ ] Performance & cross-device QA (FPS, lighting conditions) — real-device pass not started yet.

**Upload**

- [x] Photo upload + under-eye/blemish-region detection on static image — same shared upload pipeline as FOUNDATION/BLUSH.
- [x] Spot-blend color correction applied to image — same `applyConcealerFace`, upload path goes through the same `applyEffect`.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — not yet confirmed on a real uploaded photo.

## Design notes

- **Under-eye only, not blemish-spot detection**: there's no landmark data that can point at an actual blemish (that needs real skin-defect analysis, out of scope for a landmark-only approach - same reasoning that got hair-detection deliberately dropped for FOUNDATION, see that file's own bug log). Under-eye brightening is the one concealer use case every shopper genuinely has, so that's what this covers.
- **Ellipse, not a circle**: BLUSH's `drawFeatheredBlob` only ever drew a circle. Generalized it to take independent `radiusX`/`radiusY` (a non-uniform canvas scale turns the circle into an ellipse) so CONCEALER's under-eye shape can be wider than tall, matching the real crescent - `radiusX === radiusY` keeps BLUSH's own call/output byte-for-byte the same as before.
- **Anchor + offset, not a dedicated landmark**: MediaPipe's mesh only covers the eyelid margin, not the under-eye hollow itself - `applyConcealerFace` takes the eye ring's own bottom-center point and pushes it down by `UNDER_EYE_OFFSET_RATIO` of the detected face height, landing in the hollow instead of right on the lash line.
- **Eyes explicitly erased**: unlike BLUSH (whose cheek-apple anchor sits far enough from anything excluded that a gradient's soft tail never reaches it), CONCEALER's anchor sits right next to the eye by design - its gradient's upward tail could realistically bleed onto the eyelid/eye opening. `eraseEyes` (same independent `destination-out` technique `eraseExcludedFeatures` already uses for the full-face finishes) guarantees it never does, regardless of how the anchor/offset numbers get tuned later.
- **Verification done so far**: `npx tsc --noEmit`, `eslint`, and the full `vitest` suite (all passing, including a new `applyConcealerFace` smoke test) all pass. Camera/file-upload flows aren't automatable in the sandboxed browser pane used for this session (same limitation noted in FOUNDATION/BLUSH's own history), so a synthetic-face script (temporary, not committed) was used to render `applyConcealerFace` onto an actual oval-shaped fixture and confirm the ellipses land under the eyes and feather correctly - visually correct, but this is not a substitute for real-device QA.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), and [BLUSH.md](./BLUSH.md).

> **Status**: Freshly built, same starting point BLUSH/FOUNDATION had before their own 10/10 pushes - code/architecture/tests solid, **Real-device QA not started**. No dedicated `CONCEALER-10-10-PLAN.md` yet - that gets created once real-device testing actually begins, same order FOUNDATION/BLUSH followed.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                             |
| --- | -------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10     | Missing-landmark guard, face-oval clip safety net, eye-erase, turn-detection guard sab present - koi known gap nahi, lekin real-device par kabhi nahi chala.                     |
| 2   | Test coverage        | 7/10     | 1 smoke test (renders without throwing, paints pixels) - koi dedicated geometry/placement unit test nahi.                                                                        |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                       |
| 4   | Real-device QA       | 0/10     | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta.                                                                                                |
| 5   | UX polish            | 8/10     | FOUNDATION/BLUSH ke fixes (overlay a11y, turn-icon) automatically inherited hain - CONCEALER ka apna dedicated UX audit abhi nahi hua.                                           |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case, bilkul FOUNDATION/BLUSH jaisa reuse. `drawFeatheredBlob` ka ellipse-generalization bhi BLUSH ko break nahi karta. |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyConcealerFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                            |
| 8   | Performance          | 6/10     | Code-side cost-profile BLUSH jaisa hi (ek temp-canvas, do gradient fill, ek chhota eye-erase pass) - real FPS numbers #4 pe depend karte hain.                                   |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                          |

**Overall**: ~**7.7/10** — same shape as BLUSH/FOUNDATION's own starting score. Next step (jab ready ho): real-device Live + Upload testing, phir agar gaps milte hain to `CONCEALER-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
