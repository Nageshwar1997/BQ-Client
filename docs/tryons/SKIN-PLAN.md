# SKIN Category — Build Plan

[← Back to master tracker](./README.md) · [← Back to SKIN category](./SKIN.md)

_Planning doc, written before any SKIN code exists - same reason [EYE-PLAN.md](./EYE-PLAN.md)/[LIP-10-10-PLAN.md](./LIP-10-10-PLAN.md)/[FOUNDATION-10-10-PLAN.md](./FOUNDATION-10-10-PLAN.md) exist as their own docs instead of being buried in a chat log. Not a progress tracker (that's [SKIN.md](./SKIN.md), still all-unbuilt placeholders) - this captures the **design decisions** made before writing any code._

## Why this doc exists

Every category built so far (LIP, FACE, EYE) tries on a real product **color** - a shade you pick, then a render function paints that shade onto a region. SKIN breaks that assumption: moisturizer, serum, sunscreen etc. don't have a shade to match at all - [SKIN.md](./SKIN.md)'s own opening note already flagged this as the reason SKIN was pushed to the very end of the build order (see [README.md](./README.md)'s suggested build order, item 6). This doc resolves that open question before any code gets written: what does a SKIN "try-on" actually _show_, given this app's landmark-only constraint (no ML segmentation anywhere - confirmed against every existing FACE finish, see Research below), which of the 8 subcategories are worth building a distinct visual for, and what the state/architecture should look like.

**Also fixing a stale fact while here**: [SKIN.md](./SKIN.md)'s own tracking-model line currently says "face segmentation (skin region only, no fine landmarks needed)" - checked directly against the actual codebase (`src/utils/tryon-utils/face.ts`) and this is wrong. There is no segmentation anywhere in this app, FACE included - every full-face finish (FOUNDATION/BRONZER/BBCREAM/COMPACTPOWDER) works off the same 478-point MediaPipe landmark mesh EYE/LIP use, clipped to `FACE_OVAL_INDICES` (the standard face-oval landmark ring) with eyes/eyebrows/mouth punched out as holes. SKIN will need the exact same thing, not real segmentation - corrected in [SKIN.md](./SKIN.md) itself alongside this doc.

## Research: what's actually available to build a "glow" with

Checked every FACE finish that comes closest to simulating skin quality (not color) for a real technique to build on, rather than guessing:

- **`fillFaceOvalRegion`** (`utils/tryon-utils/face.ts`) - the shared full-face-wash primitive FOUNDATION/BRONZER/BBCREAM/COMPACTPOWDER all already use: clip to the face oval (forehead-extended via `applyForeheadExtension`, since the raw oval's own top edge sits at the hairline not partway up the forehead), fill at a flat color/alpha, punch out eyes/eyebrows/mouth as holes, composite once. This is the obvious region primitive for every full-face SKIN effect.
- **HIGHLIGHTER** (`applyHighlighterFace`) - the closest thing to a "glow" that exists today, and it's a **fake**: a tight `drawFeatheredBlob` (radial gradient, solid center fading to transparent) at each cheekbone, with the color itself pushed toward white via `mixTowardWhite`. No blur, no blend mode, no lighting simulation - "glow" here is purely "a lighter color, in a soft-edged blob, at a high point on the face."
- **BBCREAM** - same `fillFaceOvalRegion` wash as FOUNDATION, just a lower fixed alpha (0.35 vs 0.6). "Sheer/natural" is an alpha value, nothing else.
- **COMPACTPOWDER** (matte) - `desaturateTowardGray` (luma-matched per-channel desaturation) applied before the same wash. "Matte" is "less saturated," since there's no specular/shine data to actually dampen.
- **Nothing else exists** - no blur-based texture smoothing, no shimmer/specular technique, no pore-level anything, anywhere in this codebase.

**The honest conclusion**: without real segmentation or a lighting model, this app cannot simulate genuine dewiness, skin-texture smoothing, or a specular highlight that tracks a light source. Every SKIN finish has to be built from the same three ingredients FACE already proved out - **a full-oval wash at some alpha** (`fillFaceOvalRegion`), **localized feathered-blob highlights** at anatomical high points (`drawFeatheredBlob`, HIGHLIGHTER's own anchors), and **per-channel color math** (whiten/desaturate/warm-shift, all already written) - plus `ctx.filter` blur for softening. This isn't a limitation specific to SKIN; it's the same ceiling every FACE finish already accepted. The real planning work below is deciding which combination of those three ingredients reads as "moisturizer" vs "serum" vs "sunscreen" etc., since none of them get a real product-photo reference to render toward the way a lipstick shade does.

## Subcategories — visual language & buildability

SKIN has 8 subcategories (`TRY_ON_MAP.SKIN`, confirmed against `@beautinique/shared-constants`): MOISTURIZER, SERUM, TONER, CLEANSER, SUNSCREEN, MASK, EYECREAM, EXFOLIATOR.

| Subcategory | Visual language                                                                                                 | Reuses                                                                                                                                          | Complexity    |
| ----------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| SERUM       | Even, subtle brightening wash across the whole face                                                             | `fillFaceOvalRegion` (BBCREAM's own low-alpha shape)                                                                                            | Easy          |
| TONER       | Same wash, very slightly desaturated (reduces redness)                                                          | `fillFaceOvalRegion` + `desaturateTowardGray` (COMPACTPOWDER's math, much lighter touch)                                                        | Easy          |
| SUNSCREEN   | Matte, no-shine finish                                                                                          | `fillFaceOvalRegion` + `desaturateTowardGray` (COMPACTPOWDER, direct reuse)                                                                     | Easy          |
| MOISTURIZER | Even wash **plus** soft highlight blobs at the skin's own high points (forehead, nose bridge, cheekbones, chin) | `fillFaceOvalRegion` + `drawFeatheredBlob` × 4 anchors (HIGHLIGHTER's own technique, more points)                                               | Easy → Medium |
| MASK        | Strongest version of the above - more saturated highlight blobs, slightly higher wash alpha                     | Same primitives as MOISTURIZER, tuned stronger                                                                                                  | Easy → Medium |
| EYECREAM    | Brightening **only** under the eyes, not the whole face                                                         | `drawFeatheredBlob` with an under-eye anchor + wide/short ellipse radii (CONCEALER's own technique, direct reuse) - **no** `fillFaceOvalRegion` | Medium        |
| CLEANSER    | ⚠️ Genuinely little to show - see Open questions below                                                          | -                                                                                                                                               | Low value     |
| EXFOLIATOR  | ⚠️ "Smoothness" needs texture-level detail this app can't see - see Open questions below                        | -                                                                                                                                               | Low value     |

_Build note_: SERUM/TONER/SUNSCREEN are the same shape as an existing FACE finish with different color math, zero new primitives - the fastest way to prove the SKIN engine/state pipeline end-to-end, same reasoning [EYE-PLAN.md](./EYE-PLAN.md) used for starting with EYELINER+KAJAL. MOISTURIZER/MASK need HIGHLIGHTER's blob technique repeated at more anchor points (new landmark anchors - forehead center, nose bridge, chin - not new rendering math). EYECREAM is the only subcategory that skips the full-face wash entirely and needs its own region, but that region already exists as CONCEALER's own under-eye ellipse blob - no new geometry.

## Open questions - need a decision before/while building

1. **What does `state.color` (the shade picker) mean for a product with no shade?** Real skincare listings don't have color swatches the way a lipstick does, but this app's shared architecture (`IMakeupState.color`, `TryOnModal`'s `shades` prop) assumes every category has one. **Recommendation**: keep the existing shape (no new state type needed - see Architecture below) and reinterpret `color` as the _glow's own tint anchor_ rather than a literal applied shade - e.g. a "Golden Glow" vs "Pearl Glow" vs "Natural" pick maps to a warm-white / cool-white / neutral-white `mixTowardWhite` target, the same way real skincare marketing already names finish tones. This needs a product-catalog-side confirmation (do SKIN products actually ship with named finish-tone variants?) before the shade picker UI copy is written, but doesn't block the render code - the render function just takes whatever `rgb` it's given, same as every other category.
2. **CLEANSER**: [SKIN.md](./SKIN.md)'s own original note already flagged this - a cleanser's real effect (removing dirt/makeup) has nothing to render as an overlay. Recommendation: either (a) give it the exact same subtle wash as SERUM/TONER with different UI copy ("clean, refreshed" framing) purely so the product page isn't broken, or (b) deprioritize it to the very end of SKIN's own build order and revisit once the other 7 are proven out. Not a blocker for starting SKIN - just shouldn't be the first subcategory built.
3. **EXFOLIATOR**: same problem as CLEANSER, newly identified in this planning pass - "smoother texture" is a pore/microtexture-level effect this app has no data to render at all (not even the approximate techniques above simulate it). Same recommendation as CLEANSER: reuse the plain wash with distinct copy, or deprioritize.
4. **MASK vs MOISTURIZER visual overlap**: as tuned above these are the same two primitives at different strengths - worth a real side-by-side check once both are built to confirm they read as genuinely different products, not just "moisturizer but more."

## Suggested build order

1. **SERUM, TONER, SUNSCREEN together** - all three are `fillFaceOvalRegion` plus a color-math variant already written for FACE (BBCREAM's alpha, COMPACTPOWDER's desaturation) - lowest risk, proves the whole SKIN engine/state pipeline end-to-end fastest, same "shared primitive, multiple subcategories for the price of one build" reasoning EYE-PLAN used for EYELINER+KAJAL.
2. **MOISTURIZER** - adds the multi-point highlight-blob layer on top of the proven wash.
3. **MASK** - same primitives as MOISTURIZER, tuned stronger; build right after so the two can be compared side by side (Open question 4).
4. **EYECREAM** - the one subcategory with its own region instead of the full oval; CONCEALER's under-eye blob technique needs porting over but not reinventing.
5. **CLEANSER, EXFOLIATOR** - last, pending the Open-questions decision above on whether they get a distinct visual or just reuse SERUM's own wash with different copy.

## Proposed architecture

Simpler than EYE's, since SKIN doesn't need a second customization axis the way EYE needed `pattern` (no subcategory here has real "style variants" the way EYELINER has winged vs thin - each is one visual effect at one tunable intensity):

- `ISkinTryOnState = IMakeupState<TSkinFinish>` - **no extension needed at all**, straight reuse of the existing shape (`type`/`color`/`range`), matching FACE's own state exactly rather than EYE's extended one.
- `ISkinRenderParams extends IRenderEffectBaseParams { rgb: TRGBTuple }` (types/tryon-types/skin.ts) - identical shape to `IFaceRenderParams`, no extra fields (no `pattern` to carry).
- `SkinEngineBase` (classes/tryon/categories/skin/SkinEngineBase.ts) + `SkinLiveEngine`/`SkinUploadEngine` - clone `FaceEngineBase`'s own structure directly (same `withLiveCamera`/`withImageUpload` mixins every category already reuses), not EYE's - FACE is the closer architectural sibling here since neither has a pattern dimension.
- Render functions live in a new `utils/tryon-utils/skin.ts`, following this file's own established "self-contained per category, duplicate the handful of shared landmark constants rather than cross-import" convention - `FACE_OVAL_INDICES` and the exclusion-hole indices get their own SKIN-local copies, same as EYE duplicated FACE's eyebrow indices.
- Each `apply<Finish>Skin` function is a thin wrapper choosing which combination of `fillFaceOvalRegion`-equivalent wash + `drawFeatheredBlob`-equivalent highlight anchors + color-math transform to apply - most of the actual "building" here is porting three already-proven FACE techniques into a new file, not inventing new canvas math.

## Next steps

Start with SERUM + TONER + SUNSCREEN (lowest risk, shared primitives, validates the whole state/engine shape end to end) - once that pipeline is proven, MOISTURIZER/MASK/EYECREAM follow the build order above. Same per-finish pipeline every LIP/FACE/EYE finish already used: constants → render function → engine wiring → smoke test → synthetic visual check → tracker doc. Before writing the shade-picker UI copy specifically, resolve Open question 1 (what `color` means for a shadeless product) with whoever owns the SKIN product catalog.

---

[← Back to master tracker](./README.md) · [← Back to SKIN category](./SKIN.md)
