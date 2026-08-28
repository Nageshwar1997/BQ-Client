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
// Same outer-lip fill regions LIP's own engine uses (see tryon-lip.constants.ts) - duplicated
// rather than imported cross-category, since these are generic face-mesh facts, not LIP
// business logic, and every category's constants file stays self-contained (no category ever
// imports another's constants file).
export const LIPS_UPPER_INDICES = [
  61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 311, 312, 13, 82, 81, 80, 191, 78,
];
export const LIPS_LOWER_INDICES = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95,
  78,
];

// Single-point anchors for the localized (not full-face) finishes - blush/highlighter/contour
// each position a soft blended shape at one of these, not a filled region.
export const CHEEK_APPLE_LEFT_INDEX = 50;
export const CHEEK_APPLE_RIGHT_INDEX = 280;
export const CHEEKBONE_LEFT_INDEX = 116;
export const CHEEKBONE_RIGHT_INDEX = 345;
export const JAW_HOLLOW_LEFT_INDEX = 172;
export const JAW_HOLLOW_RIGHT_INDEX = 397;

// How wide a localized blob (blush/highlighter/contour) renders, as a fraction of the face's
// own width (the detected face oval's bounding box) - scales automatically with face size/
// distance from camera instead of a fixed pixel radius, same reasoning as every size in this
// app being derived from the detected face rather than a screen-space constant.
export const LOCALIZED_BLOB_RADIUS_RATIO = 0.16;

// Same shape/role as LIP's own `LIP_RANGE_BOUNDS` - the intensity slider's bounds, per category
// since each category's finishes read differently at the same raw alpha.
export const FACE_RANGE_BOUNDS = { min: 0.2, max: 0.8, default: 0.45 } as const;
