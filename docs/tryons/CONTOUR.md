# CONTOUR Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (jaw-hollow anchor points, one per side) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ka baaki 1 subcategory (COMPACTPOWDER) abhi unbuilt hai, isliye uski apni tracker file nahi bani - uska status abhi bhi [FACE.md](./FACE.md) me hi hai. Jaise hi wo banega, waisi hi ek dedicated file milegi (isi CONTOUR.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[BRONZER.md](./BRONZER.md)/[BBCREAM.md](./BBCREAM.md) jaisi), FACE.md sirf ek index/summary reh jayega - waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyContourFace`](../../src/utils/tryon-utils/face.ts) - jaw-hollow anchor (`JAW_HOLLOW_LEFT_INDEX`/`JAW_HOLLOW_RIGHT_INDEX` - already prepared in constants) par centered ek taller-than-wide feathered shadow (HIGHLIGHTER ka ekdum ulta - `mixTowardBlack` use karke shade ko black ki taraf mix kiya jaata hai, taaki "shadow/hollow" wala look mile, sirf ek dark patch nahi). In dono anchors already face-oval boundary pe hi baithe hain (jaw edge), isliye anchor ko inward + upward offset diya jaata hai taaki wo cheek ki actual hollow mein land ho, seedha jaw edge pe nahi. Face-oval mein clip hota hai (safety net). Eye/mouth-erase ki zaroorat nahi thi - anchor dono se kaafi door hai, synthetic-face check se confirm kiya.

## Summary

| Mode    | Done  | Total | %                                |
| ------- | ----- | ----- | -------------------------------- |
| Live    | 3     | 4     | 75%                              |
| Upload  | 3     | 4     | 75%                              |
| **All** | **6** | **8** | **75% — [detail](./CONTOUR.md)** |

## Checklist

**Live**

- [x] Camera capture + jaw/cheek/nose-hollow landmark tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline already tracks the full 478-point mesh every frame, jaw-hollow indices included, no extra wiring needed.
- [x] Shading blend rendered along facial hollows in real-time — `applyContourFace` wired into `FaceEngineBase.applyEffect`'s switch for `'CONTOUR'`, runs every `renderFrame` tick same as the other three localized finishes. Verified via automated smoke test + a synthetic-face visual check (see Design notes) - **not yet confirmed on an actual live camera feed**.
- [x] Shade/variant picker functional — generic FACE UI, already proven working for FOUNDATION/BLUSH/CONCEALER/HIGHLIGHTER, no CONTOUR-specific change needed.
- [ ] Performance & cross-device QA — real-device pass not started yet.

**Upload**

- [x] Photo upload + jaw/cheek/nose-hollow detection on static image — same shared upload pipeline as the other FACE finishes.
- [x] Shading blend applied along facial hollows on image — same `applyContourFace`, upload path goes through the same `applyEffect`.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — not yet confirmed on a real uploaded photo.

## Design notes

- **Jaw hollow only, not nose-hollow/temple**: a real contour routine hits several hollows, but BLUSH/CONCEALER/HIGHLIGHTER's own v1 scope stuck to two anchors each - this follows the same precedent (the hollow beneath the cheekbone, along the jaw, is the single most universal contour placement) rather than covering every real-world spot at once. `JAW_HOLLOW_LEFT_INDEX`/`JAW_HOLLOW_RIGHT_INDEX` were already reserved for exactly this in the constants file's own comment, ahead of this build.
- **Anchor + offset, not the raw landmark**: `JAW_HOLLOW_LEFT_INDEX`/`JAW_HOLLOW_RIGHT_INDEX` are part of `FACE_OVAL_INDICES`' own boundary loop (they sit right on the jaw edge, not inside the hollow of the cheek) - `applyContourFace` nudges the anchor inward (toward the face's horizontal center, `CONTOUR_INWARD_OFFSET_RATIO`) and upward (toward the cheek hollow above the jawline, `CONTOUR_UPWARD_OFFSET_RATIO`) before drawing, same "anchor + offset" pattern CONCEALER's `UNDER_EYE_OFFSET_RATIO` already established.
- **Darkened toward black, not painted at the raw shade color**: the mirror image of HIGHLIGHTER's `mixTowardWhite` - a new `mixTowardBlack` helper (`CONTOUR_DARKEN_RATIO = 0.35`) mixes the shade's RGB toward black before it reaches the gradient, entirely in plain JS math, not a canvas blend mode - same reasoning as HIGHLIGHTER's own whitening (sidesteps the blend-mode-over-blank-canvas bug class FOUNDATION's real-device history already proved out).
- **Taller ellipse, not BLUSH's circle or CONCEALER's flat crescent**: `CONTOUR_BLOB_ASPECT_RATIO = 1.4` (> 1, `radiusY > radiusX`) follows the jaw hollow's own vertical drop, the opposite orientation from CONCEALER's wider-than-tall under-eye shape.
- **`drawFeatheredBlob` reused as-is**: no changes needed to the shared gradient-blob primitive (already generalized to `radiusX`/`radiusY` by CONCEALER); CONTOUR just calls it with `radiusY > radiusX` and a darkened color instead of a lightened one.
- **Verification done so far**: `npx tsc --noEmit`, `eslint`, and the full `vitest` suite (63/63, including a new `applyContourFace` smoke test) all pass. Camera/file-upload flows aren't automatable in the sandboxed browser pane used for this session, so a synthetic-face script (temporary, not committed) was used to render `applyContourFace` onto an actual oval-shaped fixture with eyes/mouth drawn in - confirmed the shadow lands in the cheek hollow (visibly offset from the raw jaw anchor, marked separately), stays visibly darker than the base tone, and never touches the eyes or mouth. Visually correct, but this is not a substitute for real-device QA. Given HIGHLIGHTER's own real-device follow-up found its default alpha too sheer to notice on an actual photo, CONTOUR's own default (`0.25` of a `{0.1, 0.5}` range) should get the same real-photo sanity check once real-device testing starts, rather than assuming the synthetic check's visibility carries over.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), [CONCEALER.md](./CONCEALER.md), and [HIGHLIGHTER.md](./HIGHLIGHTER.md).

> **Status**: Freshly built, same starting point the other three localized finishes had before their own real-device passes - code/architecture/tests solid, **Real-device QA not started**. No dedicated `CONTOUR-10-10-PLAN.md` yet - that gets created once real-device testing actually begins, same order the others followed.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                                                              |
| --- | -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10     | Missing-landmark guard, face-oval clip safety net, turn-detection guard sab present - koi known gap nahi, lekin real-device par kabhi nahi chala.                                                                 |
| 2   | Test coverage        | 7/10     | 1 smoke test (renders without throwing, paints pixels) - koi dedicated geometry/darkening unit test nahi.                                                                                                         |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                        |
| 4   | Real-device QA       | 0/10     | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta. HIGHLIGHTER ke "default alpha real photo pe barely visible tha" lesson yahan bhi lag sakta hai - explicitly flag kiya gaya hai. |
| 5   | UX polish            | 8/10     | FOUNDATION/BLUSH/CONCEALER/HIGHLIGHTER ke fixes (overlay a11y, turn-icon) automatically inherited hain - CONTOUR ka apna dedicated UX audit abhi nahi hua.                                                        |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case, bilkul baaki finishes jaisa reuse. Naya `mixTowardBlack` helper bhi self-contained hai.                                                            |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyContourFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                                                               |
| 8   | Performance          | 6/10     | Code-side cost-profile baaki localized finishes jaisa hi (ek temp-canvas, do gradient fill) - real FPS numbers #4 pe depend karte hain.                                                                           |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                           |

**Overall**: ~**7.7/10** — same shape as BLUSH/CONCEALER/HIGHLIGHTER's own starting score. Next step (jab ready ho): real-device Live + Upload testing (default alpha ki real-photo visibility bhi explicitly check karna, HIGHLIGHTER ke real-device lesson ke baad), phir agar gaps milte hain to `CONTOUR-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
