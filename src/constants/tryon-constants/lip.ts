import type { IRangeBounds } from '@/types/tryon-types';
import type { TLipFinish } from '@/types/tryon-types/lip';

import type { ITryOnInstruction } from '.';

// Lip landmark indices (into MediaPipe FaceLandmarker's 478-point face mesh) and texture
// asset paths for the LIP Try-On engine. Ported from the reference implementation at
// `src/commverse/src/pages/virtual-tryon/data/index.ts` (lip-relevant subset only) - the
// index arrays trace the actual lip contour, they aren't values to tweak by feel.

export const UPPER_LIP_INDICES = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 311, 312, 13, 82, 81, 80, 191, 78,
];

export const LOWER_LIP_INDICES = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95,
  78,
];

// The first 11 entries of each array above are exactly its OUTER arc, corner-to-corner (61 is
// the left mouth corner, 291 the right) - the remaining entries trace back along the INNER
// edge, where the lip meets the mouth opening, which is only needed to close off each array's
// own fill *region* (see `clipLipsOnFace`), not for an outline. Concatenating just those outer
// arcs (lower one reversed, since it runs the same corner-to-corner direction as the upper one)
// traces one continuous closed loop around the outer lip border - what a lip LINER actually
// follows (see `applyLinerLips`). Derived rather than hand-transcribed so it can never drift out
// of sync with the two vetted arrays above.
export const LIP_OUTER_CONTOUR_INDICES = [
  ...UPPER_LIP_INDICES.slice(0, 11),
  ...LOWER_LIP_INDICES.slice(0, 10).reverse(),
];

// Secondary "inner highlight" rings used to add a lighter texture pass on dark shades
// (see `applyTexture` usage in `utils/tryon-utils/lip.ts`) - not the same rings as above.
export const UPPER_WHITE_LIP_INDICES_INSET = [74, 39, 37, 11, 267, 269, 304, 271, 268, 13, 38, 41];

export const LOWER_WHITE_LIP_INDICES_INSET = [
  15, 316, 403, 319, 325, 307, 320, 404, 315, 16, 85, 180, 77, 96, 89, 179, 86, 15,
];

// Blur amount for the soft "dot highlight" compositing pass in the texture-based finishes
// (gloss/crayon/shimmer).
export const LOWER_LIP_DOT_BLUR_AMOUNT = 2.5;

export const LIP_TEXTURE_COMPOSITE_OPERATION: GlobalCompositeOperation = 'overlay';

// Same asset naming as the reference (crayon and shimmer each reuse one file for both the
// upper/lower lip passes; gloss has dedicated upper/lower textures) - files already exist
// under public/images/tryon/lips/textures/.
//
const TEXTURE_FOLDER = '/images/tryon/lips/textures' as const;
// Genuinely shared by all four finish - GLOSS/SATIN/BALM/PLUMPER (see LipEngineBase.ts's
// `loadCategoryAssets`, which loads this once and assigns the same loaded image to each
// finish's own `ILipAssets` field) - named this way so the sharing is obvious at the filename,
// not something you only discover by reading that file. If any one of these four ever gets its
// own dedicated art, give it its own constant here and its own `loadImage` call in
// `loadCategoryAssets` - nothing else needs to change, since every finish already reads from
// its own named `assets.<finish>Upper/Lower` field in LipEngineBase.applyEffect.
export const GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_UPPER = `${TEXTURE_FOLDER}/Gloss-or-Satin-or-Balm-or-Plumper-Upper.webp`;
export const GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_LOWER = `${TEXTURE_FOLDER}/Gloss-or-Satin-or-Balm-or-Plumper-Lower.webp`;

export const CRAYON_TEXTURE_PATH = `${TEXTURE_FOLDER}/Crayon.webp`;
export const SHIMMER_TEXTURE_PATH = `${TEXTURE_FOLDER}/Shimmer.webp`;

// OIL and METALLIC are derived from the same originals above (no new photography/AI generation
// - see docs/tryons/LIP.md) rather than sourced separately:
//  - OIL: Gloss-or-Satin-or-Balm-or-Plumper-Upper/Lower Gaussian-blurred (softer, more
//    spread-out - a fluid "wet" glow instead of gloss's tighter, more defined catch-light).
//  - METALLIC: Gloss-or-Satin-or-Balm-or-Plumper-Upper/Lower contrast-boosted (a harder, more
//    mirror-like highlight core) with a contrast-boosted `shimmer` layered on top via 'lighten'
//    (tiny sharp metallic-flake glints, distinct from shimmer's own softer glitter look).
export const OIL_TEXTURE_PATH_UPPER = `${TEXTURE_FOLDER}/Oil-Upper.webp`;
export const OIL_TEXTURE_PATH_LOWER = `${TEXTURE_FOLDER}/Oil-Lower.webp`;
export const METALLIC_TEXTURE_PATH_UPPER = `${TEXTURE_FOLDER}/Metallic-Upper.webp`;
export const METALLIC_TEXTURE_PATH_LOWER = `${TEXTURE_FOLDER}/Metallic-Lower.webp`;

// Intensity-slider bounds, one entry per finish (maps to engine state's `range`, i.e. how
// strongly the finish's texture/filter pass shows through - see utils/tryon-utils/lip.ts).
// Previously this was a single bounds object shared by every finish, collapsed down from the
// reference's own per-type `getRangeValues` (which genuinely differs per finish there - matte/
// glossy/shimmer/crayon each had their own numbers). That collapsing was a real problem: a
// slider position that read as "medium" on MATTE could read as way too strong or barely-there on
// a finish with a different natural intensity curve, since every finish shared one min/max/
// default regardless. Split back out below - MATTE/GLOSS/SHIMMER/CRAYON are the reference's own
// validated numbers, ported as-is (unchanged from before). The other 7 finishes have no
// reference equivalent, so each reuses the bounds of whichever finish its own rendering is
// closest to (see utils/tryon-utils/lip.ts's own per-finish comments for exactly how each is
// built) rather than inventing unrelated numbers:
//  - SATIN's fill is literally `applyMatteLips` underneath -> MATTE's bounds.
//  - BALM/PLUMPER/OIL/METALLIC are all built on the same `applyTexturedLips` composite GLOSS
//    uses -> GLOSS's bounds (each finish's own visual difference from GLOSS comes from its
//    `TEXTURED_FINISH_TUNING` entry's opacities, not from a different raw alpha range).
//  - STAIN's own fill function already hard-caps its effective alpha (`Math.min(alpha, 0.35)`
//    in `applyStainLips`) - its slider bounds match that cap exactly, so there's no dead zone
//    where moving the slider past a point does nothing.
//  - LINER isn't a fill at all (a stroke - see `applyLinerLips`), so it reuses the reference's
//    own Eyeliner/Kajal bounds instead of any lip-fill finish's - a stroke's "how solid the line
//    reads" is a much closer match to those than to how a lip fill blends.
export const LIP_RANGE_BOUNDS: Record<TLipFinish, IRangeBounds> = {
  MATTE: { min: 0.3, max: 0.8, default: 0.5 },
  GLOSS: { min: 0.4, max: 0.9, default: 0.5 },
  SHIMMER: { min: 0.3, max: 0.8, default: 0.5 },
  CRAYON: { min: 0.3, max: 0.9, default: 0.5 },
  SATIN: { min: 0.3, max: 0.8, default: 0.5 },
  BALM: { min: 0.4, max: 0.9, default: 0.5 },
  PLUMPER: { min: 0.4, max: 0.9, default: 0.5 },
  OIL: { min: 0.4, max: 0.9, default: 0.5 },
  METALLIC: { min: 0.4, max: 0.9, default: 0.5 },
  STAIN: { min: 0.15, max: 0.35, default: 0.25 },
  LINER: { min: 0.5, max: 1, default: 0.9 },
};

// Category-wide fallback, deliberately NOT any one finish's own default above - used only for
// the brief blank-slate moment before a real `type` is known (`LipEngineBase.getInitialState()`,
// called before the caller's `initialState` - which does know the finish - merges in). Picking a
// specific finish's default there (e.g. MATTE's) would be misleading, since it isn't actually
// MATTE at that point, just "no finish yet" - a standalone category-level number reads honestly
// as exactly that.
export const LIP_DEFAULT_RANGE = 0.5;

/* ================= INSTRUCTIONS =================
 * Shown before a shopper picks/takes a photo - see `getTryOnInstructions` in `./index` for why
 * these are independent per category instead of built off one shared base list.
 */

export const LIP_UPLOAD_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Good, even lighting - avoid backlight or heavy shadows' },
  { icon: 'solar:radial-blur-linear', text: 'Sharp and in focus, not blurry' },
  {
    icon: 'solar:user-rounded-linear',
    text: 'Face fully visible and looking straight at the camera',
  },
  {
    icon: 'solar:glasses-linear',
    text: 'No sunglasses, masks, or heavy filters covering your face',
  },
];

export const LIP_LIVE_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Find good, even lighting - avoid strong backlight' },
  { icon: 'solar:user-rounded-linear', text: 'Keep your face centered and clearly visible' },
  { icon: 'solar:videocamera-record-linear', text: 'Hold still and look straight at the camera' },
  {
    icon: 'solar:glasses-linear',
    text: 'Remove sunglasses, masks, or anything covering your face',
  },
];
