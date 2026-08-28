import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import {
  FACE_OVAL_INDICES,
  LEFT_EYE_INDICES,
  LEFT_EYEBROW_INDICES,
  LIPS_LOWER_INDICES,
  LIPS_UPPER_INDICES,
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

const toPoints = (face: NormalizedLandmark[], indices: number[], dimension: TDimension) =>
  indices
    .map((index) => face[index])
    .filter((point): point is NormalizedLandmark => point !== undefined)
    .map((point) => ({ x: point.x * dimension.width, y: point.y * dimension.height }));

const tracePath = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
  const first = points[0];
  if (!first) return;
  ctx.moveTo(first.x, first.y);
  points.slice(1).forEach((point) => {
    ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
};

/* ================= FULL-FACE FINISHES (FOUNDATION / BBCREAM / BRONZER / COMPACTPOWDER) ======
 * All four fill the same region (face oval, minus eyes/eyebrows/lips) - only their color,
 * alpha, and blend mode differ, so the region-clipping is written once here and reused.
 */

// Clips to the full face oval, then subtracts eyes/eyebrows/lips as holes - one path (outer
// loop + each hole traced into the same `beginPath`), clipped once with the `evenodd` rule so
// anything covered an even number of times (inside a hole) falls outside the clip.
const clipToFaceExcludingFeatures = (
  ctx: CanvasRenderingContext2D,
  face: NormalizedLandmark[],
  dimension: TDimension,
) => {
  ctx.beginPath();
  tracePath(ctx, toPoints(face, FACE_OVAL_INDICES, dimension));
  [
    LEFT_EYE_INDICES,
    RIGHT_EYE_INDICES,
    LEFT_EYEBROW_INDICES,
    RIGHT_EYEBROW_INDICES,
    LIPS_UPPER_INDICES,
    LIPS_LOWER_INDICES,
  ].forEach((indices) => {
    tracePath(ctx, toPoints(face, indices, dimension));
  });
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
