# BLUSH Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (cheek-apple anchor points, one per cheek) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi BLUSH.md/[FOUNDATION.md](./FOUNDATION.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md)/[BRONZER.md](./BRONZER.md)/[BBCREAM.md](./BBCREAM.md)/[COMPACTPOWDER.md](./COMPACTPOWDER.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyBlushFace`](../../src/utils/tryon-utils/face.ts) - cheek-apple anchor (`CHEEK_APPLE_LEFT_INDEX`/`CHEEK_APPLE_RIGHT_INDEX`) par centered ek soft, radially-feathered blob (flat fill nahi, ek `createRadialGradient` jo center se radius tak fully-transparent ho jaata hai) - FOUNDATION ke poore-face wash se bilkul alag shape, real blush stick jaisa "ek dab, blend outward". Radius face ke apne detected width se scale hota hai (`LOCALIZED_BLOB_RADIUS_RATIO`), aur face-oval mein clip hota hai (safety net - normal proportions mein already andar rehta hai). FOUNDATION ke turn-detection overlay aur upload/live instructions dono automatically inherit hote hain (`FaceEngineBase`/`refineFaceDetectionStatus`/constants sab category-level hain, finish-specific nahi).

## Summary

| Mode    | Done  | Total | %                              |
| ------- | ----- | ----- | ------------------------------ |
| Live    | 3     | 4     | 75%                            |
| Upload  | 3     | 4     | 75%                            |
| **All** | **6** | **8** | **75% — [detail](./BLUSH.md)** |

## Checklist

**Live**

- [x] Camera capture + cheek-region landmark tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline already tracks the full 478-point mesh every frame, cheek-apple indices included, no extra wiring needed.
- [x] Soft cheek color-wash blend rendered in real-time — `applyBlushFace` wired into `FaceEngineBase.applyEffect`'s switch for `'BLUSH'`, runs every `renderFrame` tick same as FOUNDATION. Verified via automated smoke test + a synthetic-face visual check (see Design notes) - **not yet confirmed on an actual live camera feed**.
- [x] Shade/variant picker functional (linked to product variants) — generic FACE UI, already proven working for FOUNDATION, no BLUSH-specific change needed.
- [ ] Performance & cross-device QA (FPS, lighting conditions) — real-device pass not started yet.

**Upload**

- [x] Photo upload + cheek-region detection on static image — same shared upload pipeline as FOUNDATION.
- [x] Soft cheek color-wash blend applied to image — same `applyBlushFace`, upload path goes through the same `applyEffect`.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — not yet confirmed on a real uploaded photo.

## Design notes

- **Feathered blob, not a flat fill**: a `createRadialGradient` (opaque-ish center → fully transparent at `radius`) rather than a flat circle + blur - blur only softens edges that already exist, it can't produce a "concentrated in the middle, gone by the edge" falloff on its own, and would need to be wide enough to visibly shrink the color to look this soft. Baking the falloff into the gradient stops sidesteps that tuning knob entirely.
- **`source-over`, not `multiply`** - learned the hard way on FOUNDATION (see its own bug log): a blend mode over a blank/transparent temp canvas is a genuine cross-browser rendering inconsistency. `applyBlushFace` never sets `globalCompositeOperation` at all, so this class of bug can't recur here.
- **Face-oval clip as a safety net**: the blob's own radius (`LOCALIZED_BLOB_RADIUS_RATIO = 0.16` of face width) already stays well inside the face under normal proportions - the clip just guarantees it can never paint past the face oval on an unusual face shape, cheap insurance reusing the same `clipToFaceOval` helper FOUNDATION already has.
- **Turn-detection, instructions, edge-margin fix - all inherited for free**: `isFaceTurnedTooMuch`, `FACE_UPLOAD_INSTRUCTIONS`/`FACE_LIVE_INSTRUCTIONS`, and the `FACE_FRAME_EDGE_MARGIN` mobile fix all live at the FACE-category level (`FaceEngineBase`/shared constants/utils), not inside FOUNDATION's own code - BLUSH gets all of it automatically, same as any future FACE finish will.
- **Verification done so far**: `npx tsc --noEmit`, `eslint`, and the full `vitest` suite (60/60, including a new `applyBlushFace` smoke test) all pass. Camera/file-upload flows aren't automatable in the sandboxed browser pane used for this session (same limitation noted in FOUNDATION's own history), so a synthetic-face script (temporary, not committed) was used to render `applyBlushFace` onto an actual oval-shaped fixture and confirm the blob lands on the cheeks and feathers correctly - visually correct, but this is not a substitute for real-device QA.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md) and [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md).

> **Status**: Freshly built, same starting point FOUNDATION had before its own 10/10 push - code/architecture/tests solid, **Real-device QA not started**. No dedicated `BLUSH-10-10-PLAN.md` yet - that gets created once real-device testing actually begins, same order FOUNDATION followed.

| #   | Dimension            | Score    | Kyun                                                                                                                                                              |
| --- | -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10     | Missing-landmark guard, face-oval clip safety net, turn-detection guard sab inherited/present - koi known gap nahi, lekin real-device par kabhi nahi chala.       |
| 2   | Test coverage        | 7/10     | 1 smoke test (renders without throwing, paints pixels) - koi dedicated geometry/placement unit test nahi (jaisa FOUNDATION ke `isFaceTurnedTooMuch` ko mila tha). |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                        |
| 4   | Real-device QA       | 0/10     | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta.                                                                                 |
| 5   | UX polish            | 8/10     | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - BLUSH ka apna dedicated UX audit abhi nahi hua.                                      |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case, bilkul FOUNDATION jaisa reuse.                                                                     |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyBlushFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                 |
| 8   | Performance          | 6/10     | Code-side cost-profile FOUNDATION jaisa hi (ek temp-canvas, ek gradient fill x2) - real FPS numbers #4 pe depend karte hain.                                      |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                           |

**Overall**: ~**7.7/10** — same shape as FOUNDATION's own starting score. Next step (jab ready ho): real-device Live + Upload testing, phir agar gaps milte hain to `BLUSH-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
