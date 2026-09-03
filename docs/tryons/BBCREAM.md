# BBCREAM Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (face-oval region, minus eyes/eyebrows/mouth) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke sabhi 8 subcategories ki ab apni-apni dedicated tracker file ban chuki hai (isi BBCREAM.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md)/[BRONZER.md](./BRONZER.md)/[COMPACTPOWDER.md](./COMPACTPOWDER.md) jaisi) - [FACE.md](./FACE.md) ab sirf ek index/summary reh gaya hai, waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyBbCreamFace`](../../src/utils/tryon-utils/face.ts) - FOUNDATION/BRONZER jaisa hi **full-face wash** hai (face-oval clip, eyes/eyebrows/mouth punched out, same shared `fillFaceOvalRegion` helper), FACE.md ki apni description ("full-face segmentation", "sheer full-face tinted blend, lighter than foundation") ke saath match karta hai. Farak sirf itna hai: koi color-mix transform nahi lagta (na HIGHLIGHTER jaisa whitening, na BRONZER jaisa warm-shift) - "lighter than foundation" ek alpha concern hai, hue concern nahi, isliye `applyBbCreamFace` seedha `BBCREAM_BASE_ALPHA` (0.35) ko apne color string mein bake karta hai FOUNDATION ke fixed 0.6 ki jagah, phir wahi `fillFaceOvalRegion` ko reuse karta hai.

## Summary

| Mode    | Done  | Total | %                                |
| ------- | ----- | ----- | -------------------------------- |
| Live    | 3     | 4     | 75%                              |
| Upload  | 3     | 4     | 75%                              |
| **All** | **6** | **8** | **75% — [detail](./BBCREAM.md)** |

## Checklist

**Live**

- [x] Camera capture + full-face segmentation wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline already tracks the full 478-point mesh every frame, no extra wiring needed.
- [x] Sheer full-face tinted blend (lighter than foundation) rendered in real-time — `applyBbCreamFace` wired into `FaceEngineBase.applyEffect`'s switch for `'BBCREAM'`, runs every `renderFrame` tick same as FOUNDATION/BRONZER. Verified via automated smoke test + a synthetic-face visual check (see Design notes) - **not yet confirmed on an actual live camera feed**.
- [x] Shade/variant picker functional — generic FACE UI, already proven working for every other FACE finish, no BBCREAM-specific change needed.
- [ ] Performance & cross-device QA — real-device pass not started yet.

**Upload**

- [x] Photo upload + full-face segmentation on static image — same shared upload pipeline as FOUNDATION/BRONZER.
- [x] Sheer full-face tinted blend applied to image — same `applyBbCreamFace`, upload path goes through the same `applyEffect`.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — not yet confirmed on a real uploaded photo.

## Design notes

- **Full-face wash, not a localized blob**: same architecture family as FOUNDATION/BRONZER (both fill the whole face-oval region via the shared `fillFaceOvalRegion` helper), unlike BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR's single-anchor feathered blobs. Matches FACE.md's own description of BB cream ("full-face segmentation", "sheer full-face tinted blend").
- **No color-mix transform - sheerness is an alpha concern, not a hue concern**: HIGHLIGHTER mixes toward white and BRONZER warm-shifts because those effects are genuinely about changing the _color_ the skin reads as. BB cream isn't - FACE.md's own wording is just "lighter than foundation", i.e. less coverage of the same shade, not a different-colored effect. So `applyBbCreamFace` skips any per-channel color transform and instead bakes a lower `BBCREAM_BASE_ALPHA` (0.35) into its own color string, in place of FOUNDATION's fixed 0.6 base opacity.
- **Why bake sheerness into the render, not just the slider bounds**: `FACE_RANGE_BOUNDS.BBCREAM` already has a lower ceiling (`max: 0.5`) than FOUNDATION's, but a lower ceiling alone only guarantees "lighter than foundation" as long as nobody ever raises the slider close to that ceiling on a foundation whose own alpha sits lower. Baking `BBCREAM_BASE_ALPHA` into the render itself makes "sheerer than foundation" a structural guarantee independent of wherever the slider sits - the same reasoning LIP's `applyStainLips` already used (`Math.min(alpha, 0.35)`) to keep STAIN genuinely sheer regardless of the slider.
- **Verification done so far**: `npx tsc --noEmit`, `eslint`, and the full `vitest` suite (65/65, including a new `applyBbCreamFace` smoke test) all pass. Camera/file-upload flows aren't automatable in the sandboxed browser pane used for this session, so a synthetic-face script (temporary, not committed) rendered BBCREAM and FOUNDATION side-by-side over an identical mid-tone background, at the same shade and same slider alpha - confirmed both fill the same face-oval region identically (same clip, same eye/eyebrow/mouth exclusion) and that BBCREAM's average color sits measurably closer to the background than FOUNDATION's does (i.e. genuinely sheerer, background shows through more), matching what the eye sees in the exported PNGs. Visually correct, but this is not a substitute for real-device QA - and per HIGHLIGHTER's own real-device lesson (default alpha too sheer to notice on an actual photo), BBCREAM's default alpha (already the lowest of any full-face FACE finish, by design) should get the same real-photo sanity check once real-device testing starts - it's the finish most at risk of reading as "did nothing" on a real photo.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), [CONCEALER.md](./CONCEALER.md), [HIGHLIGHTER.md](./HIGHLIGHTER.md), [CONTOUR.md](./CONTOUR.md), and [BRONZER.md](./BRONZER.md).

> **Status**: Freshly built, same starting point the other five finishes had before their own real-device passes - code/architecture/tests solid, **Real-device QA not started**. No dedicated `BBCREAM-10-10-PLAN.md` yet - that gets created once real-device testing actually begins, same order the others followed.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                                                                      |
| --- | -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10     | Same guards FOUNDATION/BRONZER already have (missing-landmark, face-oval clip, turn-detection) - koi known gap nahi, lekin real-device par kabhi nahi chala.                                                              |
| 2   | Test coverage        | 7/10     | 1 smoke test (renders without throwing, paints pixels) - koi dedicated "sheerer than FOUNDATION" comparison test committed nahi hai (sirf temporary script se manually confirm kiya).                                     |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                                |
| 4   | Real-device QA       | 0/10     | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta. HIGHLIGHTER ke "default alpha real photo pe barely visible tha" lesson yahan sabse zyada relevant hai (BBCREAM sabse sheer finish hai). |
| 5   | UX polish            | 8/10     | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - BBCREAM ka apna dedicated UX audit abhi nahi hua.                                                                                            |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn (no color-mix helper needed) + ek switch case. Same `fillFaceOvalRegion` reuse jo BRONZER ne establish kiya.                                                                 |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyBbCreamFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya - ab sirf COMPACTPOWDER bacha hai).                                                                     |
| 8   | Performance          | 6/10     | Code-side cost-profile FOUNDATION/BRONZER jaisa hi (ek temp-canvas, ek fill, koi extra color-math bhi nahi) - real FPS numbers #4 pe depend karte hain.                                                                   |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                   |

**Overall**: ~**7.7/10** — same shape as the other five finishes' own starting score. Next step (jab ready ho): real-device Live + Upload testing (BBCREAM ki sheerness real photo pe visible/subtle dono check karna, kyunki ye sabse low-alpha FACE finish hai), phir agar gaps milte hain to `BBCREAM-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
