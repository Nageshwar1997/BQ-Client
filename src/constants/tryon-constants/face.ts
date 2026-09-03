import type { IRangeBounds } from '@/types/tryon-types';
import type { TFaceFinish } from '@/types/tryon-types/face';

import type { ITryOnInstruction } from '.';

// Face landmark indices (into MediaPipe FaceLandmarker's 478-point face mesh) for the FACE
// try-on engine. Fresh design (not ported from any reference implementation - see
// docs/tryons/FACE.md) - the index arrays below trace MediaPipe's own standard, publicly
// documented face-mesh topology (face oval, eyes, eyebrows), the same public data every
// MediaPipe-based face-filter app draws from, not anything proprietary. Exact single-point
// anchors (cheek/cheekbone/jaw) are approximate and expected to get visually tuned once
// rendering, same as every other placement constant in this app.

// Outer face boundary, corner-to-corner around the whole face (forehead through jaw) -
// MediaPipe's standard published FACEMESH_FACE_OVAL connector set, already in walk order
// around the face - no convex-hull step needed, unlike a scattered point cloud these trace a
// single closed loop as-is.
export const FACE_OVAL_INDICES = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148,
  176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
];

// `FACE_OVAL_INDICES`' own topmost points sit right at the hairline, not partway up the
// forehead - a full-face fill clipped to the raw oval visibly stops short of covering real
// forehead skin. `applyForeheadExtension` (utils/tryon-utils/face.ts) pushes just the near-top
// points upward by this fraction of the face's own detected height, tapering off by
// `FOREHEAD_EXTENSION_TAPER_RATIO` down from the top so the deformation blends smoothly into
// the unchanged sides/jaw rather than kinking at a hard cutoff. Deliberately conservative -
// overshooting here paints into the hairline instead (hair itself was never covered - no
// landmark data distinguishes hair from skin at all, only real segmentation could), so this
// trades some residual forehead gap for staying clear of hair on most face shapes/hairlines.
export const FOREHEAD_EXTENSION_RATIO = 0.14;
export const FOREHEAD_EXTENSION_TAPER_RATIO = 0.25;

// Eyes/eyebrows/lips - excluded (as holes) from every full-face fill below, so foundation/
// bronzer/etc. never paints over them.
export const LEFT_EYE_INDICES = [
  33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7,
];
export const RIGHT_EYE_INDICES = [
  362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382,
];
export const LEFT_EYEBROW_INDICES = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];
export const RIGHT_EYEBROW_INDICES = [300, 293, 334, 296, 336, 285, 295, 282, 283, 276];
// One ring around the *whole* mouth opening (outer lip boundary, upper arc + lower arc), not
// two separate upper-lip/lower-lip bands - same derivation LIP's own `LIP_OUTER_CONTOUR_INDICES`
// uses (see ./lip.ts), duplicated rather than imported cross-category since these
// are generic face-mesh facts, not LIP business logic (every category's constants file stays
// self-contained). This distinction actually matters here in a way it doesn't for LIP: excluding
// "upper lip band" and "lower lip band" as two *separate* holes only closes the gap between them
// while the mouth is shut - the moment it opens, the space between suddenly isn't inside either
// hole any more, and a full-face fill paints straight over the visible teeth/mouth interior. One
// ring around the outer boundary excludes the whole opening regardless of how wide it is, since
// MediaPipe moves these exact points with the actual jaw/lip position every frame.
const MOUTH_UPPER_OUTER_ARC = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
const MOUTH_LOWER_OUTER_ARC = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
// Same "outer arc forward, then the other outer arc's first 10 points reversed" derivation as
// LIP_OUTER_CONTOUR_INDICES (see ./lip.ts) - both arcs start at the same left
// corner (61) and run to the same right corner (291), so dropping the lower arc's own trailing
// 291 (already the upper arc's last point) before reversing avoids visiting that corner twice.
export const MOUTH_OUTER_CONTOUR_INDICES = [
  ...MOUTH_UPPER_OUTER_ARC,
  ...MOUTH_LOWER_OUTER_ARC.slice(0, -1).reverse(),
];

// Single-point anchors for the localized (not full-face) finishes - blush/highlighter/contour
// each position a soft blended shape at one of these, not a filled region.
export const CHEEK_APPLE_LEFT_INDEX = 50;
export const CHEEK_APPLE_RIGHT_INDEX = 280;
export const CHEEKBONE_LEFT_INDEX = 116;
export const CHEEKBONE_RIGHT_INDEX = 345;
export const JAW_HOLLOW_LEFT_INDEX = 172;
export const JAW_HOLLOW_RIGHT_INDEX = 397;

// MediaPipe's standard, widely-documented nose-tip landmark - used (alongside
// CHEEKBONE_LEFT/RIGHT_INDEX above) purely as a head-turn signal, see `isFaceTurnedTooMuch` in
// utils/tryon-utils/face.ts, not for any rendering placement.
export const NOSE_TIP_INDEX = 1;

// How wide a localized blob (blush/highlighter/contour) renders, as a fraction of the face's
// own width (the detected face oval's bounding box) - scales automatically with face size/
// distance from camera instead of a fixed pixel radius, same reasoning as every size in this
// app being derived from the detected face rather than a screen-space constant.
export const LOCALIZED_BLOB_RADIUS_RATIO = 0.16;

// Same shape/role as LIP's own `LIP_RANGE_BOUNDS` - the intensity slider's bounds, one entry per
// finish (not one shared per category) since each finish reads differently at the same raw
// alpha - a slider position that looks right on FOUNDATION's full-face wash can be way too
// strong or too faint on a small localized blob like BLUSH.
export const FACE_RANGE_BOUNDS: Record<TFaceFinish, IRangeBounds> = {
  // Real-device tuned + confirmed (see docs/tryons/FOUNDATION.md) - do not change without
  // re-testing on a real device, same reasoning as FACE_FRAME_EDGE_MARGIN above.
  FOUNDATION: { min: 0.1, max: 0.8, default: 0.2 },
  // Derived from the reference implementation's own Blush bounds
  // (`getRangeValues` in commverse: `{ min: 0, max: 0.15, default: 0.1 }`), converted for this
  // app's different alpha convention - the reference applies `state.range` directly as the
  // gradient's own alpha, this app instead multiplies it by a fixed 0.6 base first (see
  // `drawFeatheredBlob` in utils/tryon-utils/face.ts, the same "0.6 base x range" convention
  // FOUNDATION and every LIP finish also use), so hitting the reference's ~0.15 visual peak needs
  // a raw max here around 0.15 / 0.6 = 0.25. Min kept non-zero (unlike the reference's 0) so the
  // slider can never render an effectively invisible blush - a shopper who wants none can just
  // close the try-on instead.
  BLUSH: { min: 0.08, max: 0.25, default: 0.15 },
  // Everything below doesn't have dedicated rendering yet - falls back to FOUNDATION's full-face
  // wash (see `UNSUPPORTED_FACE_FINISHES` in FaceEngineBase.ts). These bounds are placeholders
  // chosen for each finish's eventual intended character (concealer meant to read more
  // pigmented/opaque, powder/highlighter meant to stay subtle, BB cream explicitly "lighter than
  // foundation" per FACE.md) rather than validated tuning - revisit once each gets its own
  // dedicated renderer, same as FOUNDATION/BLUSH did.
  CONCEALER: { min: 0.15, max: 0.9, default: 0.35 },
  HIGHLIGHTER: { min: 0.05, max: 0.3, default: 0.15 },
  CONTOUR: { min: 0.1, max: 0.5, default: 0.25 },
  BRONZER: { min: 0.08, max: 0.4, default: 0.2 },
  BBCREAM: { min: 0.08, max: 0.5, default: 0.15 },
  COMPACTPOWDER: { min: 0.05, max: 0.3, default: 0.12 },
};

// Category-wide fallback, deliberately NOT any one finish's own default above - same reasoning
// as LIP's identical `LIP_DEFAULT_RANGE`. Used only for the brief blank-slate moment before a
// real `type` is known (`FaceEngineBase.getInitialState()`) - picking FOUNDATION's default there
// would be misleading, since it isn't actually FOUNDATION at that point, just "no finish yet".
export const FACE_DEFAULT_RANGE = 0.2;

/* ================= INSTRUCTIONS =================
 * Shown before a shopper picks/takes a photo - see `getTryOnInstructions` in `./index` for why
 * these are independent per category instead of built off one shared base list. The last two
 * tips here (facing the camera directly, hair off the forehead) exist specifically because of
 * how FACE's full-face finishes render (see utils/tryon-utils/face.ts) - a turned head can
 * project part of the face oval past what the camera actually sees (no true 3D/occlusion
 * awareness), and there's no reliable way to tell hair from skin by color alone (see that
 * file's own history) - so the shopper is asked for a good frame up front instead of the app
 * trying to algorithmically fix a bad one after the fact.
 */

export const FACE_UPLOAD_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Good, even lighting - avoid backlight or heavy shadows' },
  { icon: 'solar:radial-blur-linear', text: 'Sharp and in focus, not blurry' },
  {
    icon: 'solar:user-rounded-linear',
    text: 'Face fully visible, facing the camera directly - not turned to the side',
  },
  {
    icon: 'solar:glasses-linear',
    text: 'No sunglasses, masks, or heavy filters covering your face',
  },
  {
    icon: 'solar:face-scan-circle-linear',
    text: 'Hair pulled back, away from your forehead and face',
  },
];

export const FACE_LIVE_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Find good, even lighting - avoid strong backlight' },
  { icon: 'solar:user-rounded-linear', text: 'Keep your face centered and clearly visible' },
  {
    icon: 'solar:videocamera-record-linear',
    text: 'Hold still, facing the camera directly - not turned to the side',
  },
  {
    icon: 'solar:glasses-linear',
    text: 'Remove sunglasses, masks, or anything covering your face',
  },
  {
    icon: 'solar:face-scan-circle-linear',
    text: 'Pull hair back, away from your forehead and face',
  },
];
