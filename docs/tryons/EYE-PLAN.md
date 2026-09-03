# EYE Category — Build Plan

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md)

_Planning doc, written 2026-09-04 for the EYE build session starting 2026-09-05 ("kal"). Not a progress tracker (that's [EYE.md](./EYE.md), still all-unbuilt placeholders) - this captures the **design decisions** made before writing any code, same reason [LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md)/[FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md) exist as their own docs instead of being buried in a chat log._

## Why this doc exists

LIP (11 finishes) and FACE (8 finishes) were both **color-only** - one shade, one intensity slider (`state.color` + `state.range`), no second customizable dimension. EYE adds a genuinely new axis: **pattern/style**, on top of color - e.g. EYELINER isn't just "what color" but also "thin vs thick vs winged". This doc plans which of EYE's 7 subcategories get a pattern dimension, what the pattern options are per subcategory, how hard each is to build with this app's existing landmark+Canvas2D primitives (no ML segmentation, same constraint every LIP/FACE finish has followed), and a suggested build order.

## Subcategories — pattern or color-only

EYE has 7 subcategories (`TRY_ON_MAP.EYE`): EYEBROW, EYELINER, KAJAL, EYESHADOW, MASCARA, LASHES, BROWGEL.

| Subcategory | Pattern?      | Reuses                                                                                                         | Complexity    |
| ----------- | ------------- | -------------------------------------------------------------------------------------------------------------- | ------------- |
| EYELINER    | ✅            | LIP's `applyLinerLips` stroke+blur primitive                                                                   | Easy          |
| KAJAL       | ✅            | Same stroke+blur primitive as EYELINER                                                                         | Easy          |
| EYESHADOW   | ✅            | FACE's `drawFeatheredBlob`/gradient primitive, eyelid-shaped                                                   | Easy → Medium |
| EYEBROW     | ✅            | FACE's flat-fill/wash primitive; texture variant reuses LIP's texture-asset pipeline                           | Easy → Medium |
| MASCARA     | ✅            | Needs a **new** lash-stroke primitive (doesn't exist yet in any category)                                      | Hard          |
| LASHES      | ✅            | Needs a **new** primitive too - likely texture-asset based (LIP's SHIMMER/GLOSS pattern), not pure stroke math | Hard          |
| BROWGEL     | ❌ color-only | FACE's simple sheer-wash pattern (like BBCREAM)                                                                | Easy          |

**BROWGEL stays color-only** - the real product is just a clear/tinted gel that sets existing brow hairs, it has no distinct "shape" variants the way a liner or eyeshadow does. Forcing a pattern dimension onto it wouldn't match any real product behavior.

## Pattern options per subcategory

### EYELINER

1. **Classic Thin** - fine single line along the lash line
2. **Bold/Thick** - same line, wider
3. **Winged/Cat-eye** - a curved flick extending up-and-out past the outer corner
4. **Double Wing (graphic)** - two flicks, sharper stylized look
5. **Smokey/Smudged** - soft blurred edge, diffused
6. **Tightline** - very thin, fills lash gaps, barely visible
7. **Underliner** - liner on the lower lash line too (placement variant, combinable with the above)

_Build note_: 1/2/3/6 are direct parameter changes (width/curve/blur) on LIP's existing stroke+blur primitive. 4/7 need multiple strokes but no new primitive.

### KAJAL

1. **Thin waterline** - subtle, along the waterline
2. **Tightline lower lash** - thin, hugging the lower lashes
3. **Smudged/Smokey kajal** - thicker, diffused, kohl-like
4. **Full bold kohl** - thick, traditional, extending slightly past the outer corner

_Build note_: All four are the exact same stroke-width + blur-radius combinations EYELINER uses - no new code beyond parameter tuning once the shared primitive exists.

### EYESHADOW

1. **Single wash** - one flat color across the whole lid
2. **Two-tone gradient** - lighter near the brow bone, darker in the crease
3. **Smokey eye** - concentrated dark near the lash line, feathered/blended upward
4. **Cut crease** - a sharp defined line at the crease, high-contrast
5. **Halo eye** - light/shimmer center of the lid, dark at outer corners + crease
6. **Under-eye smudge** - extends onto the lower lash line too (placement variant)

_Build note_: 1/3 are easy (FACE's feathered-blob/gradient primitive, reshaped to the eyelid). 2/5 need a two-color blend (related math, not built yet). 4 is the hardest of the set - needs precise crease-landmark tracing and reads as more failure-prone across different eye shapes.

### EYEBROW

1. **Natural hair-stroke** - individual-hair-like texture (needs a texture asset, LIP's texture pipeline)
2. **Soft powder fill** - diffused soft fill
3. **Bold/Defined fill** - solid, sharp-edged fill (pomade/pencil look)
4. **Ombre brow** - light at the front, bold/dark at the tail (linear gradient)
5. **Feathered/Fluffy (soap-brow)** - brushed-up natural look

_Build note_: 2/3 are easy (FACE's flat-fill primitive). 4 is medium (a new but simple linear - not radial - gradient). 1/5 need a texture asset, reusing LIP's texture-loading pattern rather than new infrastructure.

### MASCARA

1. **Natural** - subtle length, thin coat
2. **Volumizing** - thicker, fuller lashes
3. **Dramatic/Length** - long, fanned-out lashes
4. **Curled** - extra curl at the tips

_Build note_: Needs a genuinely new "lash-stroke" primitive - small curved strokes generated along the upper lash line. Pattern = stroke count/width/length/curl parameters on that new primitive. Nothing to reuse from LIP/FACE here.

### LASHES (false-lash styles)

1. **Natural/Everyday** - subtle, blends with real lashes
2. **Wispy** - feathered, varying lengths
3. **Dramatic/Voluminous** - thick, full coverage
4. **Winged** - longer strands toward the outer corner
5. **Doll-eye** - longer strands in the center

_Build note_: Same complexity tier as MASCARA, but more likely texture-asset based (one image per style, LIP's SHIMMER/GLOSS approach) than pure procedural stroke math - possibly easier to actually implement than MASCARA despite the similar upfront "new primitive" cost, since art assets sidestep needing new stroke-generation math entirely.

### BROWGEL

No pattern - color/alpha only, same shape as FACE's BBCREAM (a single sheer wash, no color-mix transform needed).

## Suggested build order

1. **EYELINER + KAJAL together** - same underlying primitive, two subcategories for the price of one build.
2. **EYESHADOW** - flat wash + smokey first (easy tier), gradient/halo/cut-crease after.
3. **EYEBROW** - fill variants (powder/defined) first, texture-based (hair-stroke/fluffy) once the texture-asset pattern is ported over from LIP.
4. **BROWGEL** - simple, same shape as an existing FACE finish.
5. **MASCARA, then LASHES** - both need a new primitive/asset pipeline, saved for last same as every other "needs new infrastructure" step in this app's build history (e.g. BRONZER waiting on `fillFaceOvalRegion`'s extraction).

## Proposed architecture for the pattern dimension

Not yet locked in - a starting proposal to refine once implementation actually starts:

- `IEyeTryOnState` (types/tryon-types/eye.ts) extends `IMakeupState<TEyeFinish>` with a new `pattern: string | null` field, the same "blank until picked" shape `color`/`type` already use.
- `EYE_PATTERN_OPTIONS: Record<TEyeFinish, { id: string; label: string }[]>` (constants/tryon-constants/eye.ts) - per-subcategory list of valid pattern ids, same shape `FACE_RANGE_BOUNDS`/`LIP_RANGE_BOUNDS` already use for per-finish config, so the UI can drive a picker off it directly.
- `IEyeRenderParams extends IRenderEffectBaseParams { rgb: TRGBTuple; pattern: string }` (types/tryon-types/eye.ts) - following the same object-param + base-type-extend convention LIP/FACE were just retrofitted to (see the earlier session's convention note) - `EyeEngineBase.applyEffect` reads `state.pattern` and passes it straight through to whichever `apply<Finish>Eye` function is selected.
- Each `apply<Finish>Eye` function switches on `pattern` internally to pick its stroke-width/blur/gradient parameters - same shape LIP's `TEXTURED_FINISH_TUNING` record already uses for its own per-finish tuning table.

## Next steps

Start with EYELINER + KAJAL (lowest risk, shared primitive, validates the whole color+pattern shape end to end) - once that pipeline is proven, the rest follow the build order above. Same per-finish pipeline every LIP/FACE finish already used: constants → render function → engine wiring → smoke test → synthetic visual check → tracker doc.

---

[← Back to master tracker](./README.md) · [← Back to EYE category](./EYE.md)
