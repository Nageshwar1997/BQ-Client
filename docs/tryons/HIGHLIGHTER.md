# HIGHLIGHTER Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (cheekbone anchor points, one per side) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke baaki 4 subcategories (CONTOUR/BRONZER/BBCREAM/COMPACTPOWDER) abhi unbuilt hain, isliye unki apni-apni tracker file nahi bani - unka status abhi bhi [FACE.md](./FACE.md) me hi hai. Jaise-jaise wo ban'te jayenge, waisi hi ek-ek dedicated file milegi (isi HIGHLIGHTER.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md) jaisi), FACE.md sirf ek index/summary reh jayega - waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyHighlighterFace`](../../src/utils/tryon-utils/face.ts) - cheekbone anchor (`CHEEKBONE_LEFT_INDEX`/`CHEEKBONE_RIGHT_INDEX` - already prepared in constants, pehle sirf turn-detection ke liye use ho rahe the) par centered ek tight, feathered glow blob (BLUSH ke broader cheek-wash se chhota - `HIGHLIGHTER_BLOB_RADIUS_RATIO` `LOCALIZED_BLOB_RADIUS_RATIO` se kam hai, kyunki real highlight ek concentrated point hoti hai, poori cheek ka flush nahi). Sabse bada difference: color khud shade ke raw hue se paint nahi hota - `mixTowardWhite` use karke white ki taraf mix kiya jaata hai (`HIGHLIGHTER_WHITEN_RATIO`) taaki "light catch karna" wala glow-jaisa look mile, sirf ek flat pale patch nahi. Ye pure RGB math hai (koi canvas blend mode nahi) - FOUNDATION ke `multiply`-on-blank-canvas history ke baad, blend modes deliberately avoid kiye gaye hain. Face-oval mein clip hota hai (safety net). Eye-erase ki zaroorat nahi thi (CONCEALER ke ulat) - cheekbone anchor eyes se kaafi door hai, synthetic-face check se confirm kiya.

## Summary

| Mode    | Done  | Total | %                                    |
| ------- | ----- | ----- | ------------------------------------ |
| Live    | 3     | 4     | 75%                                  |
| Upload  | 3     | 4     | 75%                                  |
| **All** | **6** | **8** | **75% — [detail](./HIGHLIGHTER.md)** |

## Checklist

**Live**

- [x] Camera capture + cheekbone/brow-bone landmark tracking wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline already tracks the full 478-point mesh every frame, cheekbone indices included, no extra wiring needed.
- [x] Glow overlay rendered along high points in real-time — `applyHighlighterFace` wired into `FaceEngineBase.applyEffect`'s switch for `'HIGHLIGHTER'`, runs every `renderFrame` tick same as FOUNDATION/BLUSH/CONCEALER. Verified via automated smoke test + a synthetic-face visual check (see Design notes) - **not yet confirmed on an actual live camera feed**.
- [x] Shade/variant picker functional — generic FACE UI, already proven working for FOUNDATION/BLUSH/CONCEALER, no HIGHLIGHTER-specific change needed.
- [ ] Performance & cross-device QA — real-device pass not started yet.

**Upload**

- [x] Photo upload + cheekbone/brow-bone detection on static image — same shared upload pipeline as FOUNDATION/BLUSH/CONCEALER.
- [x] Glow overlay applied along high points on image — same `applyHighlighterFace`, upload path goes through the same `applyEffect`.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — not yet confirmed on a real uploaded photo.

## Design notes

- **Cheekbone only, not brow-bone/nose-bridge/chin**: a real highlighter routine hits several high points, but BLUSH/CONCEALER's own v1 scope stuck to two anchors - this follows the same precedent (top-of-cheekbone is the single most universal, always-recognizable placement) rather than trying to cover every real-world spot at once. `CHEEKBONE_LEFT_INDEX`/`CHEEKBONE_RIGHT_INDEX` were already reserved for exactly this in the constants file's own comment, ahead of this build.
- **Lightened toward white, not painted at the raw shade color**: BLUSH/CONCEALER both paint the chosen shade directly (just at low alpha). A highlighter's whole cosmetic job is catching and reflecting light - reading _lighter_ than the product's own swatch, not just a paler version of it. `mixTowardWhite` (`HIGHLIGHTER_WHITEN_RATIO = 0.45`) blends the shade's RGB toward white before it ever reaches the gradient, entirely in plain JS math - deliberately not a canvas blend mode (`screen`/`lighten` etc.), since FOUNDATION's own real-device history already proved a blend mode over a blank temp canvas is a genuine cross-browser inconsistency (see FOUNDATION.md's bug log). This sidesteps that whole class of bug by construction.
- **Tighter blob than BLUSH**: `HIGHLIGHTER_BLOB_RADIUS_RATIO` (0.1) is notably smaller than `LOCALIZED_BLOB_RADIUS_RATIO` (0.16, BLUSH's) - a highlight reads as a concentrated point, not a broad flush.
- **No eye-erase needed**: unlike CONCEALER (whose under-eye anchor sits right against the eye), the cheekbone anchor is far enough from the eyes that a gradient's soft tail never reaches them - same reasoning BLUSH's own cheek-apple anchor already relies on. Confirmed via the synthetic-face visual check, not just assumed.
- **`drawFeatheredBlob` reused as-is**: no changes needed to the shared gradient-blob primitive itself (CONCEALER already generalized it to `radiusX`/`radiusY` for its own ellipse; HIGHLIGHTER just calls it with equal radii, same as BLUSH).
- **Verification done so far**: `npx tsc --noEmit`, `eslint`, and the full `vitest` suite (62/62, including a new `applyHighlighterFace` smoke test) all pass. Camera/file-upload flows aren't automatable in the sandboxed browser pane used for this session, so a synthetic-face script (temporary, not committed) was used to render `applyHighlighterFace` onto an actual oval-shaped fixture with eyes drawn in - confirmed the glow lands at the cheekbone, stays visibly lighter than the base tone, and never touches the eyes. Visually correct, but this is not a substitute for real-device QA.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), and [CONCEALER.md](./CONCEALER.md).

> **Status**: Freshly built, same starting point BLUSH/CONCEALER/FOUNDATION had before their own 10/10 pushes - code/architecture/tests solid, **Real-device QA not started**. No dedicated `HIGHLIGHTER-10-10-PLAN.md` yet - that gets created once real-device testing actually begins, same order the others followed.

| #   | Dimension            | Score    | Kyun                                                                                                                                                    |
| --- | -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10     | Missing-landmark guard, face-oval clip safety net, turn-detection guard sab present - koi known gap nahi, lekin real-device par kabhi nahi chala.       |
| 2   | Test coverage        | 7/10     | 1 smoke test (renders without throwing, paints pixels) - koi dedicated geometry/whitening unit test nahi.                                               |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                              |
| 4   | Real-device QA       | 0/10     | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta.                                                                       |
| 5   | UX polish            | 8/10     | FOUNDATION/BLUSH/CONCEALER ke fixes (overlay a11y, turn-icon) automatically inherited hain - HIGHLIGHTER ka apna dedicated UX audit abhi nahi hua.      |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case, bilkul BLUSH/CONCEALER jaisa reuse. Naya `mixTowardWhite` helper bhi self-contained hai. |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyHighlighterFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                 |
| 8   | Performance          | 6/10     | Code-side cost-profile BLUSH jaisa hi (ek temp-canvas, do gradient fill) - real FPS numbers #4 pe depend karte hain.                                    |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                 |

**Overall**: ~**7.7/10** — same shape as BLUSH/CONCEALER/FOUNDATION's own starting score. Next step (jab ready ho): real-device Live + Upload testing, phir agar gaps milte hain to `HIGHLIGHTER-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
