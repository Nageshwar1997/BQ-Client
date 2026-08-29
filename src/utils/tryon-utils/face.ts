import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import {
  CHEEKBONE_LEFT_INDEX,
  CHEEKBONE_RIGHT_INDEX,
  FACE_OVAL_INDICES,
  FOREHEAD_EXTENSION_RATIO,
  FOREHEAD_EXTENSION_TAPER_RATIO,
  LEFT_EYE_INDICES,
  LEFT_EYEBROW_INDICES,
  MOUTH_OUTER_CONTOUR_INDICES,
  NOSE_TIP_INDEX,
  RIGHT_EYE_INDICES,
  RIGHT_EYEBROW_INDICES,
} from '@/constants/tryon-constants/face';

// FACE-specific canvas rendering - fresh design (not ported from any reference
// implementation, see docs/tryons/FACE.md), built directly on the same primitives LIP's own
// utils already established in this app (landmark-driven clip paths, native `ctx.filter` for
// blur rather than a manual multi-sample kernel).
//
// Deliberately landmark-only - an earlier version of this file also tried to detect and erase
// hair/beard/mustache from the tint using a pixel-color heuristic (sampling the source frame to
// guess "skin" vs "not skin" by luminance/saturation). That was dropped: a color-only guess has
// no real way to tell dark hair from dark *skin*, so any threshold that catches hair reliably
// also risks misreading a deeper skin tone as hair near the face's edges - a fairness problem,
// not just a tuning one. Instead, the upload/live instructions screen (see
// `FACE_UPLOAD_INSTRUCTIONS`/`FACE_LIVE_INSTRUCTIONS` in constants/tryon-constants/face.ts)
// tells the shopper up front to keep hair off their face - the same "set the shopper up for a
// good frame" approach already used there for lighting/framing/no-sunglasses, rather than
// trying to algorithmically fix a bad frame after the fact.

interface TDimension {
  width: number;
  height: number;
}

interface IPoint {
  x: number;
  y: number;
}

const toPoints = (face: NormalizedLandmark[], indices: number[], dimension: TDimension) =>
  indices
    .map((index) => face[index])
    .filter((point): point is NormalizedLandmark => point !== undefined)
    .map((point) => ({ x: point.x * dimension.width, y: point.y * dimension.height }));

const midpoint = (a: IPoint, b: IPoint): IPoint => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

// Traces a *smoothed* closed loop through every point - each point becomes a quadratic-curve
// control point, with the curve actually passing through the midpoint before/after it, rather
// than a sharp `lineTo` polygon corner at the point itself. Same technique LIP's own
// `applyLipTexture` already uses successfully in this app for its texture-clip path, just
// closed (wraps last point back to first) instead of padded/open. Any full-face region or
// exclusion hole traced this way reads as a naturally rounded contour instead of a faceted
// polygon - most noticeable on the eyebrows/mouth, whose landmark rings are sparse enough that
// straight edges between them look visibly angular.
const traceSmoothClosedPath = (ctx: CanvasRenderingContext2D, points: IPoint[]) => {
  if (points.length < 3) return;

  const last = points[points.length - 1];
  const first = points[0];
  if (!last || !first) return;

  const start = midpoint(last, first);
  ctx.moveTo(start.x, start.y);

  points.forEach((point, i) => {
    const next = points[(i + 1) % points.length];
    if (!next) return;
    const mid = midpoint(point, next);
    ctx.quadraticCurveTo(point.x, point.y, mid.x, mid.y);
  });

  ctx.closePath();
};

// `FACE_OVAL_INDICES`' own topmost points sit right at the hairline, not partway up the
// forehead (see the constant's own comment) - pushes just the near-top points upward, tapering
// smoothly down to unchanged by `FOREHEAD_EXTENSION_TAPER_RATIO` of the face's own detected
// height, so the added coverage blends into the untouched sides/jaw rather than kinking at a
// hard cutoff.
const applyForeheadExtension = (points: IPoint[]): IPoint[] => {
  const ys = points.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const faceHeight = maxY - minY;
  const extension = faceHeight * FOREHEAD_EXTENSION_RATIO;
  const taperBand = faceHeight * FOREHEAD_EXTENSION_TAPER_RATIO;
  if (taperBand <= 0) return points;

  return points.map((point) => {
    const distanceFromTop = point.y - minY;
    if (distanceFromTop >= taperBand) return point;
    const falloff = 1 - distanceFromTop / taperBand;
    return { x: point.x, y: point.y - extension * falloff };
  });
};

/* ================= POSE CHECK ================================================================
 * A head turned too far to one side is a hard case for every full-face finish here: the clip
 * region is built entirely from 2D landmark positions with no real notion of depth/occlusion
 * (see `eraseExcludedFeatures`'s own comment on the self-intersection bug a turned head already
 * exposed once, and `applyFoundationFace`'s history on the same root cause painting past the
 * visible nose). Fully solving that would need real 3D pose awareness - this instead catches the
 * clearly-too-far cases up front and asks for a better frame, the same "set the shopper up
 * right" approach `FACE_UPLOAD_INSTRUCTIONS`/`FACE_LIVE_INSTRUCTIONS` (constants/
 * tryon-constants/face.ts) already take for lighting/hair, rather than trying to render through
 * an angle this approach was never going to handle well.
 */

// How symmetric the two side-to-nose distances have to stay before a head reads as "turned too
// far" - 1 is perfectly frontal (both sides equidistant from the nose), 0 is a full profile (one
// side has collapsed to the nose itself). Picked to allow a real, natural amount of turn (a
// shopper glancing slightly to the side, or a head that isn't perfectly square to the camera)
// without flagging it - only meaningfully lopsided readings trip this.
const FACE_TURN_SYMMETRY_THRESHOLD = 0.5;

// Purely landmark-position based (no pixel/color analysis, same reasoning as
// `getFaceDetectionStatus` in tryon-utils/index.ts) - compares how far the nose tip sits from
// each cheekbone horizontally. A frontal face keeps these two distances close to equal; turning
// the head (yaw) foreshortens the far side toward the nose while the near side stays roughly put,
// skewing the ratio well before the landmark-oval rendering itself visibly breaks down. Doesn't
// need to know which cheekbone is anatomically left/right - only the ratio between the two
// matters, so `CHEEKBONE_LEFT_INDEX`/`CHEEKBONE_RIGHT_INDEX`'s own camera-vs-anatomical labeling
// is irrelevant here.
export const isFaceTurnedTooMuch = (face: NormalizedLandmark[]): boolean => {
  const nose = face[NOSE_TIP_INDEX];
  const leftCheek = face[CHEEKBONE_LEFT_INDEX];
  const rightCheek = face[CHEEKBONE_RIGHT_INDEX];
  if (!nose || !leftCheek || !rightCheek) return false;

  const leftDistance = Math.abs(nose.x - leftCheek.x);
  const rightDistance = Math.abs(rightCheek.x - nose.x);
  const larger = Math.max(leftDistance, rightDistance);
  if (larger === 0) return false;

  const symmetry = Math.min(leftDistance, rightDistance) / larger;
  return symmetry < FACE_TURN_SYMMETRY_THRESHOLD;
};

/* ================= FULL-FACE FINISHES (FOUNDATION / BBCREAM / BRONZER / COMPACTPOWDER) ======
 * All four fill the same region (face oval, minus eyes/eyebrows/mouth) - only their color,
 * alpha, and blend mode differ, so the region-clipping is written once here and reused.
 */

// Clips to the full face oval (forehead-extended) only - eyes/eyebrows/mouth are punched out
// separately, by `eraseExcludedFeatures` below, *after* the tint is filled in.
const clipToFaceOval = (
  ctx: CanvasRenderingContext2D,
  face: NormalizedLandmark[],
  dimension: TDimension,
) => {
  ctx.beginPath();
  traceSmoothClosedPath(ctx, applyForeheadExtension(toPoints(face, FACE_OVAL_INDICES, dimension)));
  ctx.clip();
};

// Erases eyes/eyebrows/mouth from whatever's already painted on `ctx`, one feature at a time.
// Originally these were traced as holes in the *same* path as the outer oval, subtracted in one
// `evenodd` clip - correct on a frontal face, but a turned/angled head foreshortens a thin
// feature like an eyebrow enough that its own point ring can self-intersect (a "bowtie" instead
// of a simple loop). `evenodd` counts crossings *across the whole combined path*, so a
// self-intersecting hole doesn't just fail to exclude itself - it can miscount for the outer
// oval too, which is exactly what turning the head exposed: eyebrow/eye/lips getting tinted
// instead of staying excluded. Erasing each feature as its own independent
// `destination-out` fill has no such cross-talk - even if one feature's own ring
// self-intersects under an extreme angle, the damage stays contained to that one feature
// (worst case, part of it doesn't get excluded) instead of corrupting the whole face region.
const eraseExcludedFeatures = (
  ctx: CanvasRenderingContext2D,
  face: NormalizedLandmark[],
  dimension: TDimension,
) => {
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  [
    LEFT_EYE_INDICES,
    RIGHT_EYE_INDICES,
    LEFT_EYEBROW_INDICES,
    RIGHT_EYEBROW_INDICES,
    // Mouth stays a single ring around the *outer* boundary (see MOUTH_OUTER_CONTOUR_INDICES'
    // own comment) - excludes the whole opening regardless of how wide it is, so an open mouth
    // never gets foundation painted across the visible teeth/interior.
    MOUTH_OUTER_CONTOUR_INDICES,
  ].forEach((indices) => {
    ctx.beginPath();
    traceSmoothClosedPath(ctx, toPoints(face, indices, dimension));
    ctx.fill();
  });
  ctx.restore();
};

// Base-tone color correction, blended rather than flatly painted - `multiply` (not the default
// `source-over`) lets the skin's own natural light/shadow variation show through the tint
// instead of flattening the whole face into one uniform flat color, which would read as a mask
// rather than makeup. Foundation especially needs this - unlike lips, a face has a lot of
// natural shading variance the eye is sensitive to losing.
export const applyFoundationFace = (
  face: NormalizedLandmark[],
  ctx: CanvasRenderingContext2D,
  color: string,
  dimension: TDimension,
  alpha: number,
) => {
  // Composited on a temp canvas first, so the final `drawImage` onto the real, possibly-mirrored
  // `ctx` is one already-finished layer - same "build on an off-screen canvas, composite once"
  // shape as LIP's own `applyMatteLips`, and for the same reason: `ctx` may have a mirror
  // transform active (Live mode) that only the *final* draw should go through, not every
  // intermediate step.
  const temp = document.createElement('canvas');
  temp.width = dimension.width;
  temp.height = dimension.height;
  const tempCtx = temp.getContext('2d');
  if (!tempCtx) return;

  tempCtx.save();
  clipToFaceOval(tempCtx, face, dimension);
  tempCtx.globalCompositeOperation = 'multiply';
  tempCtx.fillStyle = color;
  tempCtx.globalAlpha = alpha;
  tempCtx.fillRect(0, 0, dimension.width, dimension.height);
  tempCtx.restore();

  eraseExcludedFeatures(tempCtx, face, dimension);

  ctx.drawImage(temp, 0, 0);
};
