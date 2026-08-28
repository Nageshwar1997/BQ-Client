import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import {
  FACE_OVAL_INDICES,
  FOREHEAD_EXTENSION_RATIO,
  FOREHEAD_EXTENSION_TAPER_RATIO,
  LEFT_EYE_INDICES,
  LEFT_EYEBROW_INDICES,
  MOUTH_OUTER_CONTOUR_INDICES,
  RIGHT_EYE_INDICES,
  RIGHT_EYEBROW_INDICES,
} from '@/constants/tryon-face.constants';

// FACE-specific canvas rendering - fresh design (not ported from any reference
// implementation, see docs/tryons/FACE.md), built directly on the same primitives LIP's own
// utils already established in this app (landmark-driven clip paths, `evenodd` hole-punching,
// native `ctx.filter` for blur rather than a manual multi-sample kernel).

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

/* ================= FULL-FACE FINISHES (FOUNDATION / BBCREAM / BRONZER / COMPACTPOWDER) ======
 * All four fill the same region (face oval, minus eyes/eyebrows/mouth) - only their color,
 * alpha, and blend mode differ, so the region-clipping is written once here and reused.
 */

// Clips to the full face oval (forehead-extended), then subtracts eyes/eyebrows/mouth as holes
// - one path (outer loop + each hole traced into the same `beginPath`), clipped once with the
// `evenodd` rule so anything covered an even number of times (inside a hole) falls outside the
// clip. No hair exclusion - MediaPipe's landmarks don't carry any hair-vs-skin signal at all
// (that would need real segmentation, out of scope here), so `FOREHEAD_EXTENSION_RATIO` is
// deliberately conservative specifically to stay clear of most hairlines rather than risk
// painting into hair.
const clipToFaceExcludingFeatures = (
  ctx: CanvasRenderingContext2D,
  face: NormalizedLandmark[],
  dimension: TDimension,
) => {
  ctx.beginPath();
  traceSmoothClosedPath(ctx, applyForeheadExtension(toPoints(face, FACE_OVAL_INDICES, dimension)));
  [LEFT_EYE_INDICES, RIGHT_EYE_INDICES, LEFT_EYEBROW_INDICES, RIGHT_EYEBROW_INDICES].forEach(
    (indices) => {
      traceSmoothClosedPath(ctx, toPoints(face, indices, dimension));
    },
  );
  // Mouth stays a single ring around the *outer* boundary (see MOUTH_OUTER_CONTOUR_INDICES'
  // own comment) - excludes the whole opening regardless of how wide it is, so an open mouth
  // never gets foundation painted across the visible teeth/interior.
  traceSmoothClosedPath(ctx, toPoints(face, MOUTH_OUTER_CONTOUR_INDICES, dimension));
  ctx.clip('evenodd');
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
  ctx.save();
  clipToFaceExcludingFeatures(ctx, face, dimension);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fillRect(0, 0, dimension.width, dimension.height);
  ctx.restore();
};
