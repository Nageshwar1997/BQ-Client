import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import {
  FINGER_TIP_JOINT_INDICES,
  NAIL_END_RATIO,
  NAIL_START_RATIO,
  NAIL_WIDTH_RATIO,
} from '@/constants/tryon-constants/nail';
import type { TDimension, TFaceDetectionStatus, TPoint, TRGBTuple } from '@/types/tryon-types';
import type { INailRenderParams } from '@/types/tryon-types/nail';

import { toColorString } from '.';

// NAIL's own rendering primitives - fresh design (no reference implementation covers nail try-on
// at all, see docs/tryons/NAIL-PLAN.md's Research section), built on per-hand landmark arrays
// instead of a single face mesh or a pixel mask, unlike every other primitive in this folder.

/* ================= DETECTION ================================================================
 * NAIL's own counterpart to `getFaceDetectionStatus`/`getHairDetectionStatus` - purely
 * hand-count based (no confidence mask or bounding-box-size check like the other two), reusing
 * the same `TFaceDetectionStatus` type/field (`IMakeupBaseState.faceDetection`) every category's
 * state already carries, just repurposed to mean "at least one hand confidently detected" here.
 * Only ever produces 'detected'/'not-in-frame' - same "a category only ever reports the status
 * values its own rendering actually needs" precedent BROWGEL/HAIR already set.
 */
export const getHandDetectionStatus = (hands: NormalizedLandmark[][]): TFaceDetectionStatus =>
  hands.length > 0 ? 'detected' : 'not-in-frame';

/* ================= NAIL SHAPE (LIQUID / GEL / DIPPOWDER / GLITTER / CHROME share this) =========
 * `HandLandmarker` has no landmark dedicated to the nail plate itself - every NAIL finish
 * approximates its shape from a finger's own last two joints (`FINGER_TIP_JOINT_INDICES`,
 * constants/tryon-constants/nail.ts): the vector from the near joint to the fingertip gives that
 * finger's own local direction, and a rotated ellipse anchored partway along (and slightly past)
 * that vector approximates the nail plate. This is this app's first primitive that needs a
 * per-instance *rotation* - every existing FACE/EYE blob only ever translates+scales, since a face
 * is always roughly upright in a normal selfie, but individual fingers point in whatever direction
 * the hand happens to be posed in.
 */

const toPixelPoint = (landmark: NormalizedLandmark, dimension: TDimension): TPoint => ({
  x: landmark.x * dimension.width,
  y: landmark.y * dimension.height,
});

// A flat, fairly opaque fill - unlike HAIR's translucent recolor (which needs to preserve the
// frame's own luminance so strand shading stays visible), real nail polish is meant to fully cover
// the natural nail, closer to how FOUNDATION/CONCEALER read. Drawn directly onto `ctx` (not built
// on an offscreen canvas first, unlike `fillFaceOvalRegion`/`applyHairMaskRecolor`) - there's no
// exclusion-hole punching or blend-mode step here that would need an intermediate buffer, and
// `ctx` already carries whatever mirror transform Live mode applied before `applyEffect` runs, so
// drawing straight onto it is both simpler and still correctly mirrored.
const drawNail = (
  ctx: CanvasRenderingContext2D,
  nearJoint: TPoint,
  tip: TPoint,
  rgb: TRGBTuple,
  alpha: number,
) => {
  const dx = tip.x - nearJoint.x;
  const dy = tip.y - nearJoint.y;
  const segmentLength = Math.hypot(dx, dy);
  if (segmentLength === 0) return;

  const angle = Math.atan2(dy, dx);
  const centerRatio = (NAIL_START_RATIO + NAIL_END_RATIO) / 2;
  const centerX = nearJoint.x + dx * centerRatio;
  const centerY = nearJoint.y + dy * centerRatio;

  const nailLength = segmentLength * (NAIL_END_RATIO - NAIL_START_RATIO);
  const nailWidth = segmentLength * NAIL_WIDTH_RATIO;

  const [r, g, b] = rgb;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(angle);
  ctx.fillStyle = toColorString(r, g, b, alpha);
  ctx.beginPath();
  ctx.ellipse(0, 0, nailLength / 2, nailWidth / 2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// Draws every visible nail (up to 5 per hand, across every detected hand) for a flat `rgb` fill.
const applyNailFill = (
  ctx: CanvasRenderingContext2D,
  hands: NormalizedLandmark[][],
  rgb: TRGBTuple,
  dimension: TDimension,
  alpha: number,
) => {
  for (const hand of hands) {
    for (const [nearIndex, tipIndex] of FINGER_TIP_JOINT_INDICES) {
      const nearLandmark = hand[nearIndex];
      const tipLandmark = hand[tipIndex];
      if (!nearLandmark || !tipLandmark) continue;

      drawNail(
        ctx,
        toPixelPoint(nearLandmark, dimension),
        toPixelPoint(tipLandmark, dimension),
        rgb,
        alpha,
      );
    }
  }
};

export const applyLiquidNail = ({ ctx, hands, rgb, dimension, alpha }: INailRenderParams) => {
  applyNailFill(ctx, hands, rgb, dimension, alpha);
};
