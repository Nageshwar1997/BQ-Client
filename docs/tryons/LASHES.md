# LASHES Try-On Tracker

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md) · [← Build plan](./EYE-PLAN.md)

_Tracking model: face landmarks (upper lash-line arc). Depends on the shared face-landmark engine — see [README.md](./README.md#shared-prerequisites-ye-pehle-banao--sabko-block-karte-hain)._

> **Per-subcategory tracker** — same convention [EYELINER.md](./EYELINER.md)/[KAJAL.md](./KAJAL.md)/[EYESHADOW.md](./EYESHADOW.md)/[EYEBROW.md](./EYEBROW.md)/[BROWGEL.md](./BROWGEL.md)/[MASCARA.md](./MASCARA.md) established: as a subcategory gets built, it gets its own dedicated tracker file and [EYE.md](./EYE.md)'s own inline checklist for it gets replaced with a summary-row + link. **This is the last EYE subcategory** - EYE is now 7/7 built.

> **A deliberate departure from EYE-PLAN.md's own original guess**: the plan doc speculated LASHES would likely need a texture-asset pipeline (one image per style, like LIP's own SHIMMER/GLOSS), written before MASCARA's own lash-stroke primitive existed. Once MASCARA proved that primitive out, extending it turned out to be the better call - see Design notes below for why.

## Summary

| Mode    | Done  | Total | %                               |
| ------- | ----- | ----- | ------------------------------- |
| Live    | 3     | 4     | 75%                             |
| Upload  | 3     | 4     | 75%                             |
| **All** | **6** | **8** | **75% — [detail](./LASHES.md)** |

## Checklist

**Live**

- [x] Camera capture + lash-line tracking wired — shared `EyeLiveEngine`/`FaceLandmarkerCache` pipeline already tracks the full 478-point mesh (the upper lash-line ring included) every frame, no extra wiring needed.
- [x] False-lash strip/extension overlay rendered along lash line in real-time — `applyLashesEye` wired into `EyeEngineBase.applyEffect`'s switch for `'LASHES'`, runs every `renderFrame` tick. Verified via automated smoke tests and a real uploaded model photo in the browser (see Design notes) - not yet confirmed on an actual _live camera_ feed specifically (only Upload mode was tested this session, same starting point every other EYE finish had).
- [x] Shade/variant picker functional (style/length variants) — reuses `TryOnPatternSwatches` (no component changes needed), live-verified: all 5 patterns render visibly distinct results on the same real photo, and a pixel-diff between Natural/Everyday and Winged found 1,881 changed pixels out of 49,500 in the lash region, confirming the pattern picker genuinely changes the render.
- [ ] Performance & cross-device QA — real-device pass not started yet (matches every other finish's own starting point). Dramatic/Voluminous draws up to 58 individual tapered-fill calls per eye, same performance-watch flag MASCARA's own Volumizing pattern already raised.

**Upload**

- [x] Photo upload + lash-line detection on static image — same shared upload pipeline as LIP/FACE/EYELINER/KAJAL/EYESHADOW/EYEBROW/BROWGEL/MASCARA.
- [x] False-lash strip/extension overlay applied to image — same `applyLashesEye`, upload path goes through the same `applyEffect`. Confirmed live on a real model photo (North Indian, `public/images/tryon/models/`) in this session's browser pane.
- [x] Shade/variant picker functional — confirmed live (see above).
- [ ] Output preview/download QA — snapshot/download button not specifically exercised this session.

## Design notes

- **Why procedural won over texture assets, contradicting EYE-PLAN.md's own original guess**: the plan doc's own LASHES section speculated texture assets would likely be easier, since it was written before any lash-stroke code existed. By the time LASHES came up for real, MASCARA had already built and proven a curved-lash-stroke primitive (`buildLashPoints`/`rotateTowardUp`/`fillTaperedPath`) on a real photo. False-lash _styles_ (Natural, Wispy, Dramatic, Winged, Doll-eye) turn out to differ from mascara _styles_ (Natural, Volumizing, Dramatic/Length, Curled) only in **how many strokes, how thick, how curled, and - newly - how each stroke's own length varies by position along the lash line** - every one of those is a tuning knob on the exact same primitive, not a new rendering technique. Reusing it avoided sourcing/licensing real lash-strip art, handling alpha-channel warping to fit each detected eye shape, and building a whole new asset-loading path (LIP's own texture pipeline) for a difference that turned out to be purely parametric.
- **The lash-stroke tuning interface is now explicitly shared, not duplicated**: `IMascaraPatternTuning` was renamed to `ILashStrokeTuning` (constants/tryon-constants/eye.ts) and `renderMascaraForEye` to `renderLashStrokesForEye` (utils/tryon-utils/eye.ts) - the exact same "one interface/one render function shared instead of two near-identical ones" pattern `IEyeStrokePatternTuning`/`renderTaperedStrokeForEye` already established for EYELINER/KAJAL. `applyMascaraEye` and `applyLashesEye` are now both thin wrappers: look up their own pattern in their own tuning table, call the same shared renderer.
- **The one genuinely new capability - per-position length shaping**: `lengthShape` (`{ kind: 'ramp-outer' | 'peak-center', amount }`) modulates each stroke's own base length by where it sits along the lash line (`t`, 0 at the inner corner, 1 at the outer) - `ramp-outer` grows monotonically toward the outer corner for Winged, `peak-center` reuses the exact sine-arch shape EYESHADOW's own `eyelidBandHeight` already established for "tall in the middle, tapering at both ends" (applied to length instead of band height) for Doll-eye. Both MASCARA's own 4 patterns and LASHES' own Natural/Everyday, Wispy, and Dramatic/Voluminous leave this field unset, so `lashLengthShapeMultiplier` returns a flat `1` (no-op) for them - MASCARA's own rendering is unaffected by this addition.
- **Wispy's own irregularity is a jitter-amplitude knob, not a new shape**: `extraLengthJitter` widens the existing per-stroke random-length spread (`strokeJitter`) rather than introducing a second randomization system - genuinely uneven strand lengths (the "feathered" look) without any new math.
- **Range bounds started pre-boosted, not discovered the hard way**: `EYE_RANGE_BOUNDS.LASHES` (`{min:0.3,max:0.85,default:0.6}`) matched MASCARA's own already-learned "thin individual strokes need boosted alpha to read against real texture" lesson from the start, rather than shipping a soft placeholder.
- **Pattern-preview icons**: the 5 icons (`public/images/tryon/eye/lashes/*.webp`) reuse the same base template every other EYE finish's own icon set uses, generated with a one-off `canvas`-package Node script (not checked in, same temporary-tooling treatment as every other EYE finish's own icon generation) that reimplements `rotateTowardUp`/`buildLashPoints`/`lashLengthShapeMultiplier` directly, so the Winged/Doll-eye previews show the actual length-ramp/length-peak shape, not an approximation.
- **This closes out the EYE category's own "dedicated rendering" milestone**: all 7 planned EYE subcategories (EYELINER, KAJAL, EYESHADOW, EYEBROW, BROWGEL, MASCARA, LASHES) now have real rendering - `UNSUPPORTED_EYE_FINISHES` (EyeEngineBase.ts) is now an empty set, kept in place (rather than removed) as a landing spot if EYE ever gains a new finish later.
- **Verification done so far**: `tsc -b --force`, `eslint`, and the full `vitest` suite (109/109, including 8 new `applyLashesEye` smoke tests - all 5 patterns, one unrecognized-pattern-id case, and one MASCARA-id-cross-contamination case) all pass. Real-photo browser verification (North Indian model, Ruby Red, all 5 patterns): every pattern renders symmetrically on both eyes with a visibly distinct look (Natural/Everyday's clean fine strands; Wispy's genuinely irregular lengths; Dramatic/Voluminous's dense full coverage; Winged's strands ramping longer toward the outer corner; Doll-eye's strands peaking at the horizontal center) - and a pixel-diff between Natural/Everyday and Winged found 1,881 genuinely changed pixels, confirming the pattern picker actually changes the render. A stray typo (`#` instead of `//`) briefly broke the dev server's own hot-reload mid-edit - caught and fixed before it ever reached a commit, confirmed clean via a fresh `tsc -b --force` and a full page reload afterward.

## Quality score

Same 9 dimensions used for [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md), [FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md), and every FACE/EYELINER/KAJAL/EYESHADOW/EYEBROW/BROWGEL/MASCARA finish's own tracker.

> **Status**: Freshly built, the EYE category's last planned subcategory, proven out end-to-end on a real photo across all 5 patterns. Full real-device QA (Live mode, multiple devices/lighting) still not started, and - per this session's own standing convention - deliberately deferred until every planned EYE/HAIR/NAIL/SKIN subcategory exists, not just this one.

| #   | Dimension            | Score    | Kyun                                                                                                                                                                                                                                                                         |
| --- | -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Robustness           | 8/10     | Zero new geometry primitive - entirely reuses MASCARA's own already-verified lash-stroke rendering, plus one already-proven sine-arch shape borrowed from EYESHADOW. Same turn-detection gap every EYE finish has.                                                           |
| 2   | Test coverage        | 8/10     | 8 smoke tests (all 5 patterns + unrecognized-pattern + MASCARA-id-cross-contamination cases) - same shape every other pattern-bearing EYE finish's own suite already established.                                                                                            |
| 3   | Docs accuracy        | 10/10 ✅ | Ye file abhi accurate hai.                                                                                                                                                                                                                                                   |
| 4   | Real-device QA       | 1/10     | Live camera mode not tested at all; Upload mode got a real, single-photo, single-device browser verification this session (pixel-diff confirmed, not just visual) - matching every other EYE finish's own starting point exactly.                                            |
| 5   | UX polish            | 8/10     | Reuses `TryOnPatternSwatches` with zero component changes - inherits the already-fixed "correct default shown immediately" behavior for free.                                                                                                                                |
| 6   | Architecture         | 9/10     | The cleanest EYE finish addition yet - no new primitive, no new geometry, just a generalized shared interface (`ILashStrokeTuning`) and one new optional tuning field reused across both finishes that need it.                                                              |
| 7   | Feature completeness | 10/10 ✅ | All 5 planned LASHES patterns implemented and wired - this was the last unbuilt EYE subcategory, so EYE's own "dedicated rendering" milestone is now fully complete (7/7).                                                                                                   |
| 8   | Performance          | 5/10     | Same per-frame draw-call profile as MASCARA (up to ~58 individual tapered-fill calls per eye for Dramatic/Voluminous) - real FPS numbers depend on dimension #4/real-device testing, and this is the second EYE finish (after MASCARA) where that's a genuine open question. |
| 9   | Code hygiene         | 10/10 ✅ | Fresh code - `TODO`/`FIXME`/`: any` zero matches, `tsc`/`eslint` clean (after fixing one transient typo mid-edit, caught before it reached a commit).                                                                                                                        |

**Overall**: ~**7.7/10** — on par with KAJAL's own opening shape, the highest of any pattern-bearing EYE finish yet, since it needed zero new rendering primitives at all. Next step (jab ready ho): real-device Live + Upload QA across the whole EYE category, once HAIR/NAIL/SKIN also exist (per this session's own standing deferred-QA convention) - or move on to the next Try-On category per [README.md](./README.md)'s own suggested build order (HAIR next).

---

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md) · [← Build plan](./EYE-PLAN.md)
