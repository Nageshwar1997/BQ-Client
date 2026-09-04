import type { IRangeBounds } from '@/types/tryon-types';
import type { IEyePatternOption, TEyeFinish } from '@/types/tryon-types/eye';

import type { ITryOnInstruction } from '.';

// Eye landmark indices (into MediaPipe FaceLandmarker's 478-point face mesh) for the EYE Try-On
// engine. Same "self-contained per category" reasoning FACE's own constants file already
// documents (see face.ts's MOUTH_OUTER_CONTOUR_INDICES comment) - these are generic, publicly
// documented face-mesh facts (MediaPipe's standard eye-contour topology), duplicated rather than
// imported from face.ts even though FACE's LEFT_EYE_INDICES/RIGHT_EYE_INDICES cover the same
// points (as a closed ring, used there only for eye-exclusion holes, not an ordered liner path).

// MediaPipe's standard eye ring, split at the two corners into an upper arc (used as the
// lash-line path every EYELINER/KAJAL pattern traces) and a lower arc (KAJAL's waterline,
// EYELINER's Underliner pattern) - both ordered corner-to-corner, not anatomically labeled
// "inner"/"outer" here since that depends on which side of the face this is and gets resolved at
// render time instead (see `orderInnerToOuter` in utils/tryon-utils/eye.ts) - same "don't assume
// which numeric index is anatomically which side, only relative position matters" reasoning
// `isFaceTurnedTooMuch` (face.ts) already uses.
export const LEFT_EYE_UPPER_INDICES = [33, 246, 161, 160, 159, 158, 157, 173, 133];
export const LEFT_EYE_LOWER_INDICES = [133, 155, 154, 153, 145, 144, 163, 33];
export const RIGHT_EYE_UPPER_INDICES = [362, 398, 384, 385, 386, 387, 388, 466, 263];
export const RIGHT_EYE_LOWER_INDICES = [263, 249, 390, 373, 374, 380, 381, 382, 362];

// Same nose-tip landmark FACE's own `isFaceTurnedTooMuch` uses, duplicated here per this file's
// own self-contained-per-category rule - used purely to tell which end of an eye's upper/lower
// arc is the inner (nasal) corner vs the outer (temporal) one, by comparing x-distance, rather
// than trusting a specific numeric index to always mean "inner" regardless of which eye/side.
export const NOSE_TIP_INDEX = 1;

/* ================= EYELINER ====================================================================
 * 7 patterns, all built on one shared primitive: a tapered stroke following the upper lash line
 * (thin near the inner corner, thicker near the outer), optionally extended past the outer
 * corner with a curved "wing". See docs/tryons/EYE-PLAN.md for the full design reasoning and
 * docs/tryons/EYELINER.md for this finish's own tracker.
 *
 * Every ratio below is relative to the eye's own detected width (inner-to-outer corner distance
 * in pixel space) - same "scale off the feature's own size, not a fixed pixel constant" reasoning
 * every other placement/size constant in this app already follows (e.g. FACE's
 * CONCEALER_BLOB_WIDTH_RATIO). Starting values, ported from the same proportions used to build
 * the 7 pattern-preview icons (public/images/tryon/eyes/eyeliners/) on a fixed 500px canvas
 * (360px eye-width there) - expected to get visually tuned once rendering, same as every other
 * placement constant in this app.
 */

export type TEyelinerPattern =
  | 'CLASSIC_THIN'
  | 'BOLD_THICK'
  | 'WINGED_CAT_EYE'
  | 'DOUBLE_WING'
  | 'SMOKEY_SMUDGED'
  | 'TIGHTLINE'
  | 'UNDERLINER';

export const EYELINER_PATTERNS: IEyePatternOption[] = [
  {
    id: 'CLASSIC_THIN',
    label: 'Classic Thin',
    image: '/images/tryon/eyes/eyeliners/Classic-Thin.webp',
  },
  {
    id: 'BOLD_THICK',
    label: 'Bold / Thick',
    image: '/images/tryon/eyes/eyeliners/Bold-Thick.webp',
  },
  {
    id: 'WINGED_CAT_EYE',
    label: 'Winged / Cat-eye',
    image: '/images/tryon/eyes/eyeliners/Winged-Cat-Eye.webp',
  },
  {
    id: 'DOUBLE_WING',
    label: 'Double Wing',
    image: '/images/tryon/eyes/eyeliners/Double-Wing.webp',
  },
  {
    id: 'SMOKEY_SMUDGED',
    label: 'Smokey / Smudged',
    image: '/images/tryon/eyes/eyeliners/Smokey-Smudged.webp',
  },
  { id: 'TIGHTLINE', label: 'Tightline', image: '/images/tryon/eyes/eyeliners/Tightline.webp' },
  { id: 'UNDERLINER', label: 'Underliner', image: '/images/tryon/eyes/eyeliners/Underliner.webp' },
];

// Which EYE finishes have a pattern picker at all, and which option list to show for each -
// `Partial` on purpose, same reasoning as `TRY_ON_INSTRUCTIONS` (constants/tryon-constants/
// index.ts): a finish without its own dedicated rendering yet (or one that's color-only by
// design, like BROWGEL - see EYE-PLAN.md) has no real pattern list to show. `TryOnModal` reads
// this to decide whether to render `TryOnPatternSwatches` at all for the current subCategory.
export const EYE_PATTERNS: Partial<Record<TEyeFinish, IEyePatternOption[]>> = {
  EYELINER: EYELINER_PATTERNS,
};

// The pattern a fresh EYELINER selection starts on before the shopper picks one explicitly -
// same "blank-slate needs *a* value" reasoning as LIP_DEFAULT_RANGE/FACE_DEFAULT_RANGE, just for
// `pattern` instead of `range`. Classic Thin, the least visually aggressive option, so a shopper
// who never touches the pattern picker still gets a tasteful default rather than nothing.
export const EYELINER_DEFAULT_PATTERN: TEyelinerPattern = 'CLASSIC_THIN';

interface IEyelinerWingTuning {
  lengthRatio: number;
  angleDeg: number;
  curveRatio: number;
}

export interface IEyelinerPatternTuning {
  baseWidthRatio: number;
  peakWidthRatio: number;
  tipWidthRatio: number;
  wing?: IEyelinerWingTuning;
  secondWing?: IEyelinerWingTuning;
  blurRatio?: number;
  underlinerWidthRatio?: number;
}

export const EYELINER_PATTERN_TUNING: Record<TEyelinerPattern, IEyelinerPatternTuning> = {
  CLASSIC_THIN: { baseWidthRatio: 0.022, peakWidthRatio: 0.039, tipWidthRatio: 0.039 },
  BOLD_THICK: { baseWidthRatio: 0.044, peakWidthRatio: 0.089, tipWidthRatio: 0.089 },
  WINGED_CAT_EYE: {
    baseWidthRatio: 0.022,
    peakWidthRatio: 0.056,
    tipWidthRatio: 0,
    wing: { lengthRatio: 0.194, angleDeg: 24, curveRatio: 0.039 },
  },
  DOUBLE_WING: {
    baseWidthRatio: 0.022,
    peakWidthRatio: 0.056,
    tipWidthRatio: 0,
    wing: { lengthRatio: 0.194, angleDeg: 24, curveRatio: 0.039 },
    secondWing: { lengthRatio: 0.153, angleDeg: 12, curveRatio: 0.028 },
  },
  SMOKEY_SMUDGED: {
    baseWidthRatio: 0.061,
    peakWidthRatio: 0.144,
    tipWidthRatio: 0.144,
    blurRatio: 0.044,
  },
  TIGHTLINE: { baseWidthRatio: 0.011, peakWidthRatio: 0.011, tipWidthRatio: 0.011 },
  UNDERLINER: {
    baseWidthRatio: 0.022,
    peakWidthRatio: 0.039,
    tipWidthRatio: 0.039,
    underlinerWidthRatio: 0.022,
  },
};

/* ================= RANGE BOUNDS ================================================================
 * Same shape/role as LIP_RANGE_BOUNDS/FACE_RANGE_BOUNDS - the intensity slider's bounds, one
 * entry per finish. Only EYELINER has dedicated rendering so far (see EYE-PLAN.md's build
 * order) - the other 6 are placeholders (their own eventual intended character, not validated
 * tuning), revisited once each gets its own dedicated renderer, same as every FACE finish did.
 */
export const EYE_RANGE_BOUNDS: Record<TEyeFinish, IRangeBounds> = {
  // Real intensity here is mostly carried by the pattern's own width/blur tuning above (same
  // "don't rely purely on the slider" reasoning BBCREAM_BASE_ALPHA's own comment used) - this
  // range just controls how opaque/dark the liner reads, not its shape.
  EYELINER: { min: 0.3, max: 1, default: 0.7 },
  KAJAL: { min: 0.05, max: 0.3, default: 0.15 },
  EYESHADOW: { min: 0.1, max: 0.6, default: 0.3 },
  EYEBROW: { min: 0.1, max: 0.6, default: 0.3 },
  MASCARA: { min: 0.1, max: 0.6, default: 0.3 },
  LASHES: { min: 0.1, max: 0.6, default: 0.3 },
  BROWGEL: { min: 0.05, max: 0.3, default: 0.12 },
};

// Category-wide fallback, deliberately NOT any one finish's own default - same reasoning as
// LIP_DEFAULT_RANGE/FACE_DEFAULT_RANGE. Used only for the brief blank-slate moment before a real
// `type` is known (`EyeEngineBase.getInitialState()`).
export const EYE_DEFAULT_RANGE = 0.4;

/* ================= INSTRUCTIONS =================
 * Same role as FACE_UPLOAD_INSTRUCTIONS/FACE_LIVE_INSTRUCTIONS (see that file's own comment) -
 * independent per category rather than a shared base list, since EYE's real constraints
 * (precision-heavy thin lines right up against the lash line) genuinely differ from FACE's
 * full-face-fill concerns.
 */

export const EYE_UPLOAD_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Good, even lighting - avoid backlight or heavy shadows' },
  { icon: 'solar:radial-blur-linear', text: 'Sharp and in focus, not blurry' },
  {
    icon: 'solar:user-rounded-linear',
    text: 'Eyes fully open and facing the camera directly',
  },
  {
    icon: 'solar:glasses-linear',
    text: 'No glasses, sunglasses, or hair covering your eyes',
  },
];

export const EYE_LIVE_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Find good, even lighting - avoid strong backlight' },
  { icon: 'solar:user-rounded-linear', text: 'Keep your eyes open, centered and clearly visible' },
  {
    icon: 'solar:videocamera-record-linear',
    text: 'Hold still, facing the camera directly - not turned to the side',
  },
  {
    icon: 'solar:glasses-linear',
    text: 'Remove glasses, sunglasses, or anything covering your eyes',
  },
];
