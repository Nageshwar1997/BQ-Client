import type { TDimension, TFaceDetectionStatus, TRGBTuple } from '@/types/tryon-types';
import type { IHairMask, IHairRenderParams } from '@/types/tryon-types/hair';

import { createOffscreenCtx, toColorString } from '.';

// HAIR's own rendering primitives - fresh design (no reference implementation covers hair
// recolor at all, see docs/tryons/HAIR-PLAN.md's Research section), built on a per-pixel
// confidence mask (`IHairMask`) instead of a landmark ring, unlike every LIP/EYE/FACE primitive
// in this folder.

/* ================= DETECTION ================================================================
 * HAIR's own counterpart to `getFaceDetectionStatus` (utils/tryon-utils/index.ts) - purely
 * mask-confidence based (no landmark positions to read at all), reusing the same
 * `TFaceDetectionStatus` type/field (`IMakeupBaseState.faceDetection`) every category's state
 * already carries, just repurposed to mean "hair region confidently detected" here. Only ever
 * produces 'detected'/'not-in-frame' - HAIR has no notion of a "turned" pose (that's specifically
 * a FACE full-face-fill problem, see `isFaceTurnedTooMuch`) or a "not-clear" partial reading, same
 * "a category only ever reports the status values its own rendering actually needs" precedent
 * BROWGEL/LIP/EYE already set for 'turned'.
 */

// How confident the segmenter has to be that a given pixel is hair before it counts toward
// coverage below - real model output is a smooth 0-1 gradient at hair edges, not a hard
// boundary, so this is a threshold on that gradient, not an exact "is/isn't" read.
const HAIR_DETECTION_CONFIDENCE_THRESHOLD = 0.5;
// How much of the frame has to read as hair (at the threshold above) before this counts as
// "detected" - deliberately low. Real on-frame hair (any length/style) almost always covers far
// more of the frame than this; the point is only to catch "no hair visible at all" (camera
// pointed away, completely out of frame), not to set a realistic minimum hairstyle size - unlike
// a face's bounding box, that varies far too much (buzzcut vs. long hair) to gate on confidently.
// Expected to get visually tuned once rendering, same as every approximate constant in this app.
const HAIR_MIN_COVERAGE_RATIO = 0.03;

export const getHairDetectionStatus = (mask: IHairMask | null): TFaceDetectionStatus => {
  if (!mask || mask.data.length === 0) return 'not-in-frame';

  let hairPixels = 0;
  for (const confidence of mask.data) {
    if (confidence >= HAIR_DETECTION_CONFIDENCE_THRESHOLD) hairPixels++;
  }

  return hairPixels / mask.data.length >= HAIR_MIN_COVERAGE_RATIO ? 'detected' : 'not-in-frame';
};

/* ================= RECOLOR (COLOR / HENNA / OMBRE / HIGHLIGHTS share this) ====================
 * A confidence mask only says "is this pixel hair", never "which strand, or its own direction" -
 * there's no per-strand structure to exploit, so every HAIR finish built on real segmentation
 * data (as opposed to a procedural pattern layered on top, see HIGHLIGHTS in HAIR-PLAN.md) comes
 * down to the same operation: recolor the masked region while preserving the frame's own
 * per-pixel luminance (so strand-level shine/shadow stays visible through the new color, instead
 * of flattening into one solid patch - a flat alpha fill, the technique every LIP/FACE finish
 * uses, would do exactly that here).
 */

// Builds a flat-white, alpha-only layer at the mask's own native resolution (the segmenter's own
// output size, not necessarily the render canvas's `dimension`) - the only per-pixel JS loop in
// this whole primitive, deliberately kept at the mask's own (much smaller) resolution rather than
// upsampled by hand. `drawImage` in `applyHairMaskRecolor` below does the actual upscale to
// `dimension`, letting the browser's own (GPU-accelerated) image scaling handle that instead of a
// manual per-canvas-pixel resample loop - important for Live mode, where this runs every frame
// (see docs/tryons/HAIR-PLAN.md's Open question 2 on Live-mode performance).
//
// `rowAlphaMultiplier`, when given, scales an entire row's alpha by an extra 0-1 factor before
// writing it, on top of that row's own per-pixel mask confidence - OMBRE's root-to-tip fade
// (`applyOmbreHair` below) is the only caller that passes one; COLOR/HENNA leave every row at its
// full mask confidence (`undefined` treated as `1` everywhere).
const buildMaskAlphaLayer = (
  mask: IHairMask,
  rowAlphaMultiplier?: Float32Array,
): HTMLCanvasElement | null => {
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = mask.width;
  maskCanvas.height = mask.height;
  const maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) return null;

  const imageData = maskCtx.createImageData(mask.width, mask.height);
  mask.data.forEach((confidence, i) => {
    const row = Math.floor(i / mask.width);
    const multiplier = rowAlphaMultiplier ? (rowAlphaMultiplier[row] ?? 1) : 1;
    const offset = i * 4;
    imageData.data[offset] = 255;
    imageData.data[offset + 1] = 255;
    imageData.data[offset + 2] = 255;
    imageData.data[offset + 3] = Math.round(confidence * multiplier * 255);
  });
  maskCtx.putImageData(imageData, 0, 0);

  return maskCanvas;
};

// Draws `mask`'s hair region as a `rgb` recolor over the already-drawn base frame on `ctx`.
// `globalCompositeOperation: 'color'` (hue + saturation from the source layer below, luminosity
// from `ctx`'s own already-drawn frame) is used instead of a plain alpha fill deliberately - see
// this file's own top comment and docs/tryons/HAIR-PLAN.md's Research section for why a flat fill
// would flatten every strand's own shading into one solid patch here, unlike a landmark-region
// fill where that's not a visible problem.
const applyHairMaskRecolor = (
  ctx: CanvasRenderingContext2D,
  mask: IHairMask,
  rgb: TRGBTuple,
  dimension: TDimension,
  alpha: number,
  rowAlphaMultiplier?: Float32Array,
) => {
  const maskCanvas = buildMaskAlphaLayer(mask, rowAlphaMultiplier);
  if (!maskCanvas) return;

  // A flat rect of the target color at the render canvas's own size, punched down to just the
  // hair region by the (GPU-upscaled) mask layer above via `destination-in` - same "build on an
  // off-screen canvas, composite once" shape as `fillFaceOvalRegion` (utils/tryon-utils/face.ts).
  const colorCtx = createOffscreenCtx(dimension);
  if (!colorCtx) return;

  const [r, g, b] = rgb;
  colorCtx.fillStyle = toColorString(r, g, b, 1);
  colorCtx.fillRect(0, 0, dimension.width, dimension.height);
  colorCtx.globalCompositeOperation = 'destination-in';
  colorCtx.drawImage(
    maskCanvas,
    0,
    0,
    mask.width,
    mask.height,
    0,
    0,
    dimension.width,
    dimension.height,
  );

  // Composite the masked color layer onto the already-drawn base frame - `alpha` (the intensity
  // slider) is applied here via `globalAlpha`, not baked into the mask layer above, since
  // `globalCompositeOperation`+`globalAlpha` compose correctly together as one draw call.
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'color';
  ctx.drawImage(colorCtx.canvas, 0, 0);
  ctx.restore();
};

export const applyColorHair = ({ ctx, mask, rgb, dimension, alpha }: IHairRenderParams) => {
  applyHairMaskRecolor(ctx, mask, rgb, dimension, alpha);
};

// HENNA reuses COLOR's exact mechanism, no separate color-math transform - real henna products
// come in their own distinct shades (Natural/Red/Burgundy/Black henna etc.), same as any other
// HAIR product, so the "reddish-brown" character comes from *which* shade the shopper picks (real
// catalog data, same as every other finish in this app), not from a hardcoded hue baked into the
// render. Still its own named export - same "every finish gets its own wrapper, even a thin one"
// convention `applyBrowgelEye` (utils/tryon-utils/eye.ts) already set for EYEBROW's fill
// primitive - so a future divergence (if HENNA ever needs its own texture/warmth treatment) has
// an obvious place to land without touching COLOR's own callers.
export const applyHennaHair = applyColorHair;

/* ================= OMBRE (root-to-tip gradient) ================================================
 * Real ombre hair keeps the roots close to their natural color and only gradually recolors toward
 * the tips - COLOR's own full-mask recolor would flatten that into one uniform color end to end.
 * This reuses the exact same mask + `destination-in` + blend mechanism as COLOR/HENNA, it just
 * multiplies each row's own mask alpha by an extra root(0)-to-tip(1) ramp first, anchored to the
 * mask's own vertical extent of confidently-hair pixels - not the raw 0..height range, since a
 * headshot rarely fills the frame top-to-bottom, and anchoring to the actual hair bounding box is
 * what makes the "root" end of the ramp land on the actual visible roots.
 */

// A lower bar than `HAIR_DETECTION_CONFIDENCE_THRESHOLD` on purpose - this only decides "does this
// row count as part of the hair's own vertical extent at all" (for anchoring the gradient), not
// "should this exact pixel be recolored" (the mask's own per-pixel confidence, multiplied in
// afterwards via `buildMaskAlphaLayer`, still handles that).
const OMBRE_EXTENT_CONFIDENCE_THRESHOLD = 0.3;

const findHairVerticalExtent = (mask: IHairMask): { minRow: number; maxRow: number } => {
  let minRow = mask.height;
  let maxRow = -1;

  mask.data.forEach((confidence, i) => {
    if (confidence < OMBRE_EXTENT_CONFIDENCE_THRESHOLD) return;
    const row = Math.floor(i / mask.width);
    if (row < minRow) minRow = row;
    if (row > maxRow) maxRow = row;
  });

  // No row met the threshold - shouldn't happen once `getHairDetectionStatus` has already gated
  // on 'detected', but keeps this safe to call standalone. Falls back to the mask's own full
  // height so the gradient still spans something sensible instead of dividing by a zero-length
  // range.
  return maxRow < minRow ? { minRow: 0, maxRow: mask.height - 1 } : { minRow, maxRow };
};

const buildRootToTipRowAlpha = (mask: IHairMask): Float32Array => {
  const { minRow, maxRow } = findHairVerticalExtent(mask);
  const span = maxRow - minRow;

  const rowAlpha = new Float32Array(mask.height);
  for (let row = 0; row < mask.height; row++) {
    // `span <= 0` (every confident row landed on one exact line - degenerate, e.g. an extreme
    // close-up crop) falls back to fully recolored rather than dividing by zero.
    rowAlpha[row] = span <= 0 ? 1 : Math.min(1, Math.max(0, (row - minRow) / span));
  }
  return rowAlpha;
};

export const applyOmbreHair = ({ ctx, mask, rgb, dimension, alpha }: IHairRenderParams) => {
  applyHairMaskRecolor(ctx, mask, rgb, dimension, alpha, buildRootToTipRowAlpha(mask));
};
