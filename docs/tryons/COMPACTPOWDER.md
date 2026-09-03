# COMPACTPOWDER Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (face-oval region, minus eyes/eyebrows/mouth) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi COMPACTPOWDER.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md)/[BRONZER.md](./BRONZER.md)/[BBCREAM.md](./BBCREAM.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case (aur `UNSUPPORTED_FACE_FINISHES` ab poori tarah empty hai - FACE ki har finish ki apni dedicated rendering hai). Rendering: [`applyCompactPowderFace`](../../src/utils/tryon-utils/face.ts) - FOUNDATION/BRONZER/BBCREAM jaisa hi **full-face wash** hai (face-oval clip, eyes/eyebrows/mouth punched out, same shared `fillFaceOvalRegion` helper), FACE.md ki apni description ("full-face segmentation", "matte-finish overlay, shine reduction") ke saath match karta hai. Farak: koi doosri full-face finish jaisa mix-toward-white/black/warm nahi lagta - iski jagah shade ko **desaturate karke apne hi grayscale equivalent ki taraf mix** kiya jaata hai (`desaturateTowardGray`), jo "matte/shine-reduced" effect ka closest 2D-color-math approximation hai (is app ke flat, lighting-agnostic fill me real specular-highlight data hai hi nahi), phir sabse lowest baked base-alpha (`COMPACTPOWDER_BASE_ALPHA`) ke saath paint hota hai - kyunki compact powder real life me bhi ek near-invisible finishing veil hi hota hai, ek bold color layer nahi.

## Summary

| Mode    | Done  | Total | %                                      |
| ------- | ----- | ----- | -------------------------------------- |
| Live    | 3     | 4     | 75%                                    |
| Upload  | 3     | 4     | 75%                                    |
| **All** | **6** | **8** | **75% — [detail](./COMPACTPOWDER.md)** |

## Checklist

**Live**

- [x] Camera capture + full-face segmentation wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline already tracks the full 478-point mesh every frame, no extra wiring needed.
- [x] Matte-finish overlay (shine reduction) rendered in real-time — `applyCompactPowderFace` wired into `FaceEngineBase.applyEffect`'s switch for `'COMPACTPOWDER'`, runs every `renderFrame` tick same as every other full-face finish. Verified via automated smoke test + a synthetic-face visual check (see Design notes) - **not yet confirmed on an actual live camera feed** (this session's sandboxed browser pane hit a pane-level WebGL limitation - MediaPipe's GPU delegate itself fails to initialize there, `useProgram: program not valid` in console, blocking landmark detection regardless of which finish is selected - not something this change caused).
- [x] Shade/variant picker functional — generic FACE UI, already proven working for every other FACE finish, no COMPACTPOWDER-specific change needed.
- [ ] Performance & cross-device QA — real-device pass not started yet.

**Upload**

- [x] Photo upload + full-face segmentation on static image — same shared upload pipeline as every other full-face finish.
- [x] Matte-finish overlay applied to image — same `applyCompactPowderFace`, upload path goes through the same `applyEffect`.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — not yet confirmed on a real uploaded photo.

## Design notes

- **Full-face wash, not a localized blob**: same architecture family as FOUNDATION/BRONZER/BBCREAM (all fill the whole face-oval region via the shared `fillFaceOvalRegion` helper), unlike BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR's single-anchor feathered blobs. Matches FACE.md's own description of compact powder ("full-face segmentation", "matte-finish overlay, shine reduction").
- **Desaturation, not a mix toward an absolute color**: HIGHLIGHTER mixes toward white and CONTOUR mixes toward black because those effects genuinely change how light or dark the skin reads. Compact powder doesn't - a real mattifying powder doesn't lighten or darken the skin, it flattens _shine/gloss_. This renderer has no lighting model (no specular highlights to directly dampen), so `desaturateTowardGray` approximates "less shine" as "less vibrant": it mixes each shade toward its own luminance-matched gray (Rec. 601 luma weights), not toward one fixed absolute color - so unlike `mixTowardWhite`/`mixTowardBlack`/`applyWarmShift`, it never shifts hue or overall brightness, only vibrancy. `COMPACTPOWDER_MATTIFY_RATIO` (0.3) keeps the shade's own hue clearly recognizable while still reading flatter than a straight wash.
- **The lowest baked base-alpha of any full-face finish**: `COMPACTPOWDER_BASE_ALPHA` (0.25) sits below even `BBCREAM_BASE_ALPHA` (0.35) - a real compact powder's whole job is a near-invisible finishing veil (set makeup, knock down shine), not a color layer meant to be consciously seen, so it's structurally the most subtle of every FACE finish built so far. Same "bake it into the render, don't rely purely on the slider's own bounds" reasoning `BBCREAM_BASE_ALPHA`'s own comment already used - and `FACE_RANGE_BOUNDS.COMPACTPOWDER` also has the lowest ceiling of any FACE finish (`max: 0.3`), so both work together rather than one compensating for the other.
- **Verification done so far**: `npx tsc --noEmit`, `eslint`, and the full `vitest` suite (66/66, including a new `applyCompactPowderFace` smoke test) all pass. A synthetic-face script (temporary, not committed) rendered COMPACTPOWDER and FOUNDATION side-by-side over an identical background, using a deliberately vivid/saturated shade so desaturation would be visually obvious - confirmed both fill the same face-oval region identically (same clip, same eye/eyebrow/mouth exclusion) and that COMPACTPOWDER's average color has a measurably smaller max-min channel spread than FOUNDATION's (i.e. genuinely less saturated/more matte), matching what the eye sees in the exported PNGs. Also attempted the real in-app flow (Upload → a project model photo) in this session's sandboxed browser pane, but MediaPipe's GPU delegate failed to initialize there (`useProgram: program not valid` WebGL errors) and landmark detection never completed - a pane-level limitation, not a code regression (the model file itself loaded fine, 200 OK, and this blocks every FACE finish equally, not just this one). Visually correct via the synthetic check, but this is not a substitute for real-device QA - and per HIGHLIGHTER's own real-device lesson (default alpha too sheer to notice on an actual photo), COMPACTPOWDER's default alpha (the lowest of any FACE finish, by design) should get the same real-photo sanity check once real-device testing starts - like BBCREAM, it's at real risk of reading as "did nothing" on a real photo, possibly more so since desaturation is a subtler visual cue than a color shift.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), [CONCEALER.md](./CONCEALER.md), [HIGHLIGHTER.md](./HIGHLIGHTER.md), [CONTOUR.md](./CONTOUR.md), [BRONZER.md](./BRONZER.md), and [BBCREAM.md](./BBCREAM.md).

> **Status**: Freshly built, same starting point the other six finishes had before their own real-device passes - code/architecture/tests solid, **Real-device QA not started**. No dedicated `COMPACTPOWDER-10-10-PLAN.md` yet - that gets created once real-device testing actually begins, same order the others followed.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                                                                                                                                    |
| --- | -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10     | Same guards FOUNDATION/BRONZER/BBCREAM already have (missing-landmark, face-oval clip, turn-detection) - koi known gap nahi, lekin real-device par kabhi nahi chala.                                                                                                                    |
| 2   | Test coverage        | 7/10     | 1 smoke test (renders without throwing, paints pixels) - koi dedicated "less saturated than FOUNDATION" comparison test committed nahi hai (sirf temporary script se manually confirm kiya).                                                                                            |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                                                                                              |
| 4   | Real-device QA       | 0/10     | Shuru hi nahi hua - is session ke sandboxed browser pane me MediaPipe ka GPU delegate hi initialize nahi hua (WebGL limitation), landmark detection kabhi complete nahi hua. HIGHLIGHTER/BBCREAM ke "default alpha real photo pe barely visible" lesson yahan sabse zyada relevant hai. |
| 5   | UX polish            | 8/10     | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - COMPACTPOWDER ka apna dedicated UX audit abhi nahi hua.                                                                                                                                                    |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn (naya `desaturateTowardGray` helper, `mixTowardWhite`/`mixTowardBlack`/`applyWarmShift` jaisa hi pattern) + ek switch case. `UNSUPPORTED_FACE_FINISHES` ab poori tarah empty.                                                              |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyCompactPowderFace`, switch case) - **FACE category ki saari 8 subcategories ab dedicated rendering rakhti hain**.                                                                                                                      |
| 8   | Performance          | 6/10     | Code-side cost-profile FOUNDATION/BRONZER/BBCREAM jaisa hi (ek temp-canvas, ek fill, desaturate ek chhota extra RGB math) - real FPS numbers #4 pe depend karte hain.                                                                                                                   |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                                                                                 |

**Overall**: ~**7.7/10** — same shape as every other finish's own starting score. Next step (jab ready ho): real-device Live + Upload testing (COMPACTPOWDER ki subtlety real photo pe kaafi zyada check karna hai - ye sabse low-alpha FACE finish hai), phir agar gaps milte hain to `COMPACTPOWDER-10-10-PLAN.md` banega. Iske saath **FACE category ki saari 8 subcategories build ho chuki hain** - agla milestone poori category ka real-device QA pass hoga.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
