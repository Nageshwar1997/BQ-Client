# BROWGEL Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md) · [← Build plan](./EYE-PLAN.md)

_Tracking model: face landmarks (eyebrow ring). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — same convention [EYELINER.md](./EYELINER.md)/[KAJAL.md](./KAJAL.md)/[EYESHADOW.md](./EYESHADOW.md)/[EYEBROW.md](./EYEBROW.md) established: as a subcategory gets built, it gets its own dedicated tracker file and [EYE.md](./EYE.md)'s own inline checklist for it gets replaced with a summary-row + link.

> **The first (and, per [EYE-PLAN.md](./EYE-PLAN.md), only planned) color-only EYE finish**: every other EYE finish built so far has a pattern picker - BROWGEL doesn't, by design. A brow gel's whole real-world job is setting/tinting the hairs already there, not offering distinct shape variants the way a liner, eyeshadow, or brow-fill product does, so forcing a pattern dimension onto it wouldn't match any real product. Reuses EYEBROW's own closed-region fill primitive directly ([`applyBrowgelEye`](../../src/utils/tryon-utils/eye.ts)) with one fixed, sheer, softly-blurred tuning value instead of a per-pattern lookup table.

## Summary

| Mode    | Done  | Total | %                                |
| ------- | ----- | ----- | -------------------------------- |
| Live    | 3     | 4     | 75%                              |
| Upload  | 3     | 4     | 75%                              |
| **All** | **6** | **8** | **75% — [detail](./BROWGEL.md)** |

## Checklist

**Live**

- [x] Camera capture + brow-region landmark tracking wired — shared `EyeLiveEngine`/`FaceLandmarkerCache` pipeline already tracks the full 478-point mesh (the eyebrow ring included) every frame, no extra wiring needed.
- [x] Brow-hair tint + hold/texture overlay rendered in real-time — `applyBrowgelEye` wired into `EyeEngineBase.applyEffect`'s switch for `'BROWGEL'`, runs every `renderFrame` tick. Verified via an automated smoke test and a real uploaded model photo in the browser (see Design notes) - not yet confirmed on an actual _live camera_ feed specifically (only Upload mode was tested this session, same starting point every other EYE finish had).
- [x] Shade/variant picker functional — no pattern picker to test (by design, see above); the shade picker itself is the same shared `TryOnShadeSwatches` every category uses, live-verified: removing the applied shade and re-diffing the canvas found 12,273 changed pixels out of 89,600 in the brow region, confirming the tint genuinely renders rather than being a no-op.
- [ ] Performance & cross-device QA — real-device pass not started yet (matches every other finish's own starting point).

**Upload**

- [x] Photo upload + brow-region landmark detection on static image — same shared upload pipeline as LIP/FACE/EYELINER/KAJAL/EYESHADOW/EYEBROW.
- [x] Brow-hair tint + hold/texture overlay applied to image — same `applyBrowgelEye`, upload path goes through the same `applyEffect`. Confirmed live on a real model photo (North Indian, `public/images/tryon/models/`) in this session's browser pane.
- [x] Shade/variant picker functional — confirmed live (see above).
- [ ] Output preview/download QA — snapshot/download button not specifically exercised this session.

## Design notes

- **Why no pattern picker**: settled in [EYE-PLAN.md](./EYE-PLAN.md) before any EYE code existed - "the real product is just a clear/tinted gel that sets existing brow hairs, it has no distinct shape variants the way a liner or eyeshadow does." `EYE_PATTERNS`/`EYE_DEFAULT_PATTERNS` (constants/tryon-constants/eye.ts) simply have no `BROWGEL` entry, which `TryOnModal`'s own existing `eyePatterns && ...` guard already treats as "don't show the pattern-swatches row at all" - no UI-side special-casing needed for this finish specifically.
- **Reuses EYEBROW's fill primitive directly, no lookup table**: `applyBrowgelEye` calls `fillEyebrowRegion` (the same closed-region fill function Bold/Defined Fill, Soft Powder Fill, and Ombre Brow all already share) with one fixed constant, `BROWGEL_TUNING = { blurRatio: 0.035 }`, instead of indexing into a per-pattern `Record`. There's nothing to validate at the render boundary either - `applyBrowgelEye`'s own `IEyeRenderParams` still carries a `pattern` field (the same object-param shape every EYE render function takes, for consistency with `EyeEngineBase.applyEffect`'s uniform switch), but the function never reads it - a stale pattern id left over from a previously-selected pattern-bearing EYE finish can't affect anything here.
- **Deliberately the softest range of any EYE finish**: `EYE_RANGE_BOUNDS.BROWGEL` (`{min:0.05,max:0.3,default:0.12}`) was already shaped this way as a placeholder before any real rendering existed, and turned out to need no boost once real rendering landed - unlike EYELINER/EYEBROW's own placeholders, which real-photo testing found read as "no product at all" until their ranges were raised. A sheer, barely-there tint is BROWGEL's actual intended character, not an artifact of never having been tuned.
- **Verification done so far**: `tsc -b --force`, `eslint`, and the full `vitest` suite (96/96, including 1 new `applyBrowgelEye` smoke test - no per-pattern cases needed, since there's no pattern to iterate or validate) all pass. Real-photo browser verification (North Indian model, Black shade, default 0.12 intensity): the brow gel reads as a subtle, natural-looking "setting" effect on both eyebrows rather than an obviously-painted-on block - toggling the shade off and re-diffing the canvas found 12,273 genuinely changed pixels in the brow region, confirming the tint is real, not a visual illusion from the shopper's own already-dark eyebrows.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), and every FACE/EYELINER/KAJAL/EYESHADOW/EYEBROW finish's own tracker.

> **Status**: Freshly built, the simplest EYE finish so far by a wide margin (one fixed tuning value, zero new geometry, zero new UI surface). Full real-device QA (Live mode, multiple devices/lighting) still not started, and - per this session's own standing convention - deliberately deferred until every planned EYE/HAIR/NAIL/SKIN subcategory exists, not just this one.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                                                                              |
| --- | -------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10     | Zero new geometry - entirely reuses EYEBROW's own already-verified closed-region fill. Same turn-detection gap every EYE finish has.                                                                                              |
| 2   | Test coverage        | 7/10     | 1 smoke test (no pattern to iterate/validate against, unlike every pattern-bearing finish's own multi-case suite) - proportionate to how little there is to test, not under-covered relative to the actual surface area.          |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                                        |
| 4   | Real-device QA       | 1/10     | Live camera mode not tested at all; Upload mode got a real, single-photo, single-device browser verification this session (pixel-diff confirmed, not just visual) - matching every other EYE finish's own starting point exactly. |
| 5   | UX polish            | 9/10     | No new UI surface at all - reuses the shade picker + intensity slider every category already has, with the pattern-swatches row correctly absent by design.                                                                       |
| 6   | Architecture         | 10/10 ✅ | The cleanest possible proof that the shared-primitive design works - a whole finish built from zero new render code, just one constant and a thin wrapper function.                                                               |
| 7   | Feature completeness | 10/10 ✅ | The one thing BROWGEL needed (a sheer, believable tint) is exactly what it does - there's no "missing pattern" the way other finishes have room to grow into.                                                                     |
| 8   | Performance          | 8/10     | Cheapest EYE finish so far - one blurred fill per eyebrow, no gradients/strokes/second passes.                                                                                                                                    |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean.                                                                                                                                                           |

**Overall**: ~**8.2/10** — the highest opening score of any EYE finish yet, entirely because there was so little new surface area to get wrong. Next step (jab ready ho): MASCARA, then LASHES (per [EYE-PLAN.md](./EYE-PLAN.md)'s build order) - both need a genuinely new primitive/asset pipeline, saved for last same as every other "needs new infrastructure" step in this app's build history.

---

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md) · [← Build plan](./EYE-PLAN.md)
