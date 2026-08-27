// Lip landmark indices (into MediaPipe FaceLandmarker's 478-point face mesh) and texture
// asset paths for the LIP try-on engine. Ported from the reference implementation at
// `src/commverse/src/pages/virtual-tryon/data/index.ts` (lip-relevant subset only) - the
// index arrays trace the actual lip contour, they aren't values to tweak by feel.

export const UPPER_LIP_INDICES = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 311, 312, 13, 82, 81, 80, 191, 78,
];

export const LOWER_LIP_INDICES = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95,
  78,
];

// Secondary "inner highlight" rings used to add a lighter texture pass on dark shades
// (see `applyTexture` usage in `tryon-lip.util.ts`) - not the same rings as above.
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
// under public/images/try-on/lips/textures/.
//
const TEXTURE_FOLDER = '/images/try-on/lips/textures' as const;
// `gloss-or-plumper-*` is genuinely shared: GLOSS/SATIN/BALM read it via the constants below,
// and PLUMPER (see GLOSS_OR_PLUMPER_TEXTURE_PATH_UPPER/_LOWER further down) currently points at the
// exact same file too - named this way (rather than just "gloss") so that sharing is obvious
// at the filename, not something you only discover by reading LipEngineBase.ts.
export const GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_UPPER = `${TEXTURE_FOLDER}/Gloss-or-Satin-or-Balm-or-Plumper-Upper.webp`;
export const GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_LOWER = `${TEXTURE_FOLDER}/Gloss-or-Satin-or-Balm-or-Plumper-Lower.webp`;

export const CRAYON_TEXTURE_PATH = `${TEXTURE_FOLDER}/Crayon.webp`;
export const SHIMMER_TEXTURE_PATH = `${TEXTURE_FOLDER}/Shimmer.webp`;

// OIL and METALLIC are derived from the same originals above (no new photography/AI generation
// - see docs/tryons/LIP.md) rather than sourced separately:
//  - OIL: `gloss-or-plumper-u`/`-l` Gaussian-blurred (softer, more spread-out - a fluid "wet"
//    glow instead of gloss's tighter, more defined catch-light).
//  - METALLIC: `gloss-or-plumper-u`/`-l` contrast-boosted (a harder, more mirror-like highlight
//    core) with a contrast-boosted `shimmer` layered on top via 'lighten' (tiny sharp
//    metallic-flake glints, distinct from shimmer's own softer glitter look).
export const OIL_TEXTURE_PATH_UPPER = `${TEXTURE_FOLDER}/Oil-Upper.webp`;
export const OIL_TEXTURE_PATH_LOWER = `${TEXTURE_FOLDER}/Oil-Lower.webp`;
export const METALLIC_TEXTURE_PATH_UPPER = `${TEXTURE_FOLDER}/Metallic-Upper.webp`;
export const METALLIC_TEXTURE_PATH_LOWER = `${TEXTURE_FOLDER}/Metallic-Lower.webp`;

// Intensity-slider bounds per finish (maps to engine state's `range`, i.e. how strongly the
// finish's texture/filter pass shows through - see tryon-lip.util.ts). Values for
// MATTE/GLOSS/SHIMMER/CRAYON are ported from the reference's `getRangeValues`; the rest
// (SATIN/STAIN/BALM/OIL/LINER/METALLIC/PLUMPER) reuse a sensible default rather than
// invented per-finish numbers, since those finishes don't have validated tuning yet either.
export const LIP_RANGE_BOUNDS = { min: 0.3, max: 0.9, default: 0.5 } as const;
