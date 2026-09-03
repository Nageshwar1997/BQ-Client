# BRONZER Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)

_Tracking model: face landmarks (face-oval region, minus eyes/eyebrows/mouth) — same shared MediaPipe FaceLandmarker engine every category uses, see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — FACE ke baaki 2 subcategories (BBCREAM/COMPACTPOWDER) abhi unbuilt hain, isliye unki apni-apni tracker file nahi bani - unka status abhi bhi [FACE.md](./FACE.md) me hi hai. Jaise-jaise wo ban'te jayenge, waisi hi ek-ek dedicated file milegi (isi BRONZER.md/[FOUNDATION.md](./FOUNDATION.md)/[BLUSH.md](./BLUSH.md)/[CONCEALER.md](./CONCEALER.md)/[HIGHLIGHTER.md](./HIGHLIGHTER.md)/[CONTOUR.md](./CONTOUR.md) jaisi), FACE.md sirf ek index/summary reh jayega - waisa hi jaisa README.md poori feature ke liye hai.

> Engine built: reuses [classes/tryon/categories/face/](../../src/classes/tryon/categories/face/) (`FaceEngineBase` + `FaceLiveEngine`/`FaceUploadEngine`) as-is - koi engine-level change nahi lagi, sirf ek naya render function aur `FaceEngineBase`'s `applyEffect` switch mein ek naya case. Rendering: [`applyBronzerFace`](../../src/utils/tryon-utils/face.ts) - BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR ke localized blobs se alag, ye **FOUNDATION jaisa hi full-face wash** hai (face-oval clip, eyes/eyebrows/mouth punched out) - FACE.md ki apni description ("full-face segmentation", "warm all-over glow") ke saath match karta hai. FOUNDATION ka poora fill/clip/erase/composite logic ek shared `fillFaceOvalRegion` helper mein nikal liya gaya (koi behavior change nahi, sirf extraction - FOUNDATION ka smoke test wahi pass hota hai jo pehle karta tha), phir BRONZER usi helper ko reuse karta hai. Farak sirf itna hai: paint karne se pehle chosen shade ko **warm-shift** kiya jaata hai (`applyWarmShift` - red thoda badhta hai, blue thoda ghatta hai) taaki ek neutral color-match wash na lage, balki ek genuine warm/sun-kissed glow lage.

## Summary

| Mode    | Done  | Total | %                                |
| ------- | ----- | ----- | -------------------------------- |
| Live    | 3     | 4     | 75%                              |
| Upload  | 3     | 4     | 75%                              |
| **All** | **6** | **8** | **75% — [detail](./BRONZER.md)** |

## Checklist

**Live**

- [x] Camera capture + full-face segmentation wired — shared `FaceLiveEngine`/`FaceLandmarkerCache` pipeline already tracks the full 478-point mesh every frame, no extra wiring needed.
- [x] Warm all-over glow blend rendered in real-time — `applyBronzerFace` wired into `FaceEngineBase.applyEffect`'s switch for `'BRONZER'`, runs every `renderFrame` tick same as FOUNDATION. Verified via automated smoke test + a synthetic-face visual check (see Design notes) - **not yet confirmed on an actual live camera feed**.
- [x] Shade/variant picker functional — generic FACE UI, already proven working for FOUNDATION and every other FACE finish, no BRONZER-specific change needed.
- [ ] Performance & cross-device QA — real-device pass not started yet.

**Upload**

- [x] Photo upload + full-face segmentation on static image — same shared upload pipeline as FOUNDATION.
- [x] Warm all-over glow blend applied to image — same `applyBronzerFace`, upload path goes through the same `applyEffect`.
- [x] Shade/variant picker functional — generic, shared.
- [ ] Output preview/download QA — not yet confirmed on a real uploaded photo.

## Design notes

- **Full-face wash, not a localized blob**: unlike BLUSH/CONCEALER/HIGHLIGHTER/CONTOUR (all single-anchor feathered blobs), BRONZER is architecturally identical to FOUNDATION - it fills the whole face-oval region, not a spot. This matches FACE.md's own description of BRONZER ("full-face segmentation", "warm all-over glow blend") rather than a localized-placement one.
- **`fillFaceOvalRegion` extracted from FOUNDATION**: FOUNDATION's own function body (temp-canvas, `clipToFaceOval`, fill, `eraseExcludedFeatures`, composite) got pulled out into a shared helper so BRONZER (and eventually BBCREAM/COMPACTPOWDER, both also full-face per FACE.md) can reuse it without duplicating that logic. This is a pure extraction - FOUNDATION's own exported function now just calls the helper with the exact same arguments, and its own smoke test still passes unchanged, confirming the pixels it produces didn't move.
- **Warm-shifted, not painted at the raw shade color**: a real bronzer's whole job is to read as a warm, sun-kissed glow, not just a neutral color-match wash (the same "make it read as the real cosmetic effect" reasoning HIGHLIGHTER's whitening and CONTOUR's darkening already established for the localized finishes). `applyWarmShift` (`BRONZER_WARM_SHIFT`/`BRONZER_WARM_RATIO`) nudges red up and blue down by a fixed channel amount - a temperature-style shift, not a mix toward one fixed absolute bronze color (which would flatten every different bronzer shade toward the same hue). Plain per-channel RGB math, not a canvas blend mode - same reasoning as FOUNDATION's own real-device history of why blend modes over a blank temp canvas are risky.
- **Verification done so far**: `npx tsc --noEmit`, `eslint`, and the full `vitest` suite (64/64, including a new `applyBronzerFace` smoke test) all pass. Camera/file-upload flows aren't automatable in the sandboxed browser pane used for this session, so a synthetic-face script (temporary, not committed) rendered BRONZER and FOUNDATION side-by-side from the exact same starting shade - confirmed both fill the same face-oval region identically (same clip, same eye exclusion) and that BRONZER genuinely reads warmer/more golden than FOUNDATION's plain wash. Visually correct, but this is not a substitute for real-device QA - and per HIGHLIGHTER's own real-device lesson (default alpha too sheer to notice on an actual photo), BRONZER's default alpha should get the same real-photo sanity check once real-device testing starts.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), [BLUSH.md](./BLUSH.md), [CONCEALER.md](./CONCEALER.md), [HIGHLIGHTER.md](./HIGHLIGHTER.md), and [CONTOUR.md](./CONTOUR.md).

> **Status**: Freshly built, same starting point the other four finishes had before their own real-device passes - code/architecture/tests solid, **Real-device QA not started**. No dedicated `BRONZER-10-10-PLAN.md` yet - that gets created once real-device testing actually begins, same order the others followed.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                                |
| --- | -------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10     | Same guards FOUNDATION already has (missing-landmark, face-oval clip, turn-detection) - koi known gap nahi, lekin real-device par kabhi nahi chala.                                 |
| 2   | Test coverage        | 7/10     | 1 smoke test (renders without throwing, paints pixels) - koi dedicated warm-shift unit test nahi.                                                                                   |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                          |
| 4   | Real-device QA       | 0/10     | Shuru hi nahi hua - camera/upload sandboxed browser pane mein test nahi ho sakta. HIGHLIGHTER ke "default alpha real photo pe barely visible tha" lesson yahan bhi check karna hai. |
| 5   | UX polish            | 8/10     | FOUNDATION ke fixes (overlay a11y, turn-icon) automatically inherited hain - BRONZER ka apna dedicated UX audit abhi nahi hua.                                                      |
| 6   | Architecture         | 10/10 ✅ | Zero engine-level change - ek naya render fn + ek switch case. FOUNDATION ka `fillFaceOvalRegion` extraction bhi clean tha, iska smoke test unchanged pass hua.                     |
| 7   | Feature completeness | 10/10 ✅ | Rendering fully implemented aur wired hai (`applyBronzerFace`, switch case, `UNSUPPORTED_FACE_FINISHES` se hataya).                                                                 |
| 8   | Performance          | 6/10     | Code-side cost-profile FOUNDATION jaisa hi (ek temp-canvas, ek fill, warm-shift ek chhota extra RGB math) - real FPS numbers #4 pe depend karte hain.                               |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                             |

**Overall**: ~**7.7/10** — same shape as the other four finishes' own starting score. Next step (jab ready ho): real-device Live + Upload testing (warm-shift ki real-photo visibility bhi explicitly check karna), phir agar gaps milte hain to `BRONZER-10-10-PLAN.md` banega.

---

[← Back to master tracker](./README.md) · [← Back to FACE category](./FACE.md)
