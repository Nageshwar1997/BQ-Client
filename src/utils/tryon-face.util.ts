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
// clip. This alone still doesn't know beard/mustache/forehead-hair from skin - the oval tracks
// bone/face-shape structure, not what's actually visible on top of it - see the skin-mask step
// in `applyFoundationFace` below for that.
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

// Luminance/saturation-based skin-tone heuristic (not ML/segmentation) - the same underlying
// problem the reference implementation solved with its own pixel scan (see FACE.md's history),
// bounded and downsampled here instead of a full-canvas scan (see `buildSkinMask` below) so it
// stays cheap enough for Live mode's 60fps loop. Deliberately lenient, not a tight per-channel
// RGB-ratio match: an early, stricter version of this (checking things like `r - g > 8`) rejected
// large stretches of ordinary skin under completely normal lighting - false *negatives* there
// read as a patchy, holed-out face (worse than under-covering) - while a false *positive* here
// (a few genuinely dark-toned skin pixels or a soft shadow edge left untinted) is far less
// visually distracting. Luminance is what actually separates hair/beard/mustache from skin
// reliably across lighting conditions and skin tones - dark hair reads unambiguously darker than
// even a deep, shadowed skin tone; a loose saturation floor on top catches grey/white hair
// (skin is never fully desaturated, hair often is).
const isSkinPixel = (r: number, g: number, b: number): boolean => {
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  if (luminance < 45) return false;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  return saturation >= 0.08;
};

// Small, *fixed* resolution regardless of the video/canvas's own actual resolution - this is
// the entire reason the mask stays cheap: the per-pixel classification cost below is constant
// (96*120 = 11,520 checks) whether the source is a 480p webcam or a 4K upload.
const SKIN_MASK_GRID_WIDTH = 96;
const SKIN_MASK_GRID_HEIGHT = 120;

// How close to the bbox's own edge (as a fraction of its width/height) a grid cell has to be
// before the color heuristic even runs on it - see `isInBorderZone`'s own comment for why.
const BORDER_BAND_TOP = 0.18;
const BORDER_BAND_BOTTOM = 0.3;
const BORDER_BAND_SIDE = 0.12;

// Only pixels near the bbox's own outer edge are ever candidates for exclusion. Hair falling
// onto the forehead, sideburns, and beard/mustache are all, by definition, close to the face
// oval's own boundary (top/sides/bottom respectively) - nose bridge, under-eye, nasolabial-fold,
// and chin-center shading are all deep in the interior and can never be hair. Restricting the
// color check to this outer band was the actual fix for a "patchy" result seen during
// development: running `isSkinPixel` over the *entire* bbox instead of just this band excluded
// large, clearly-visible chunks of ordinary face shading - a shine down the nose/forehead
// center, tear-trough shadows under the eyes, nasolabial-fold shadows - since a photo has no
// notion of *why* a pixel is dark or desaturated, only *where* it plausibly can be tells shading
// apart from actual hair, which is what this band encodes. Everywhere outside the band is always
// treated as skin, color notwithstanding.
const isInBorderZone = (col: number, row: number): boolean =>
  col < SKIN_MASK_GRID_WIDTH * BORDER_BAND_SIDE ||
  col > SKIN_MASK_GRID_WIDTH * (1 - BORDER_BAND_SIDE) ||
  row < SKIN_MASK_GRID_HEIGHT * BORDER_BAND_TOP ||
  row > SKIN_MASK_GRID_HEIGHT * (1 - BORDER_BAND_BOTTOM);

// Builds a small, fixed-resolution skin-likelihood mask over the face's own bounding box, from
// the *source* frame (before any tint is drawn) - `applyFoundationFace` uses this to erase
// non-skin areas (beard, mustache, hair falling across the forehead) from the tint layer, which
// the landmark-oval clip alone has no way to know about. Downscaling the box straight into the
// small grid (rather than reading full-resolution pixels one at a time) does the "shrink to
// 96x120" and "read every pixel" work in one native `drawImage` call - the browser's own image
// smoothing during that downscale is a free, cheap blur, which also happens to soften the
// mask's eventual edges (a hard per-pixel skin/not-skin boundary would read as noisy static,
// not a natural hairline/beard edge).
const buildSkinMask = (
  source: HTMLVideoElement | HTMLImageElement,
  bbox: { x: number; y: number; width: number; height: number },
  dimension: TDimension,
): HTMLCanvasElement | null => {
  if (bbox.width <= 0 || bbox.height <= 0) return null;

  // `bbox` is in `dimension` space (`canvas2`'s own pixel size) - `face`/`toPoints` are always
  // computed against that, since that's what everything else here draws into. `source`'s own
  // native resolution isn't the same thing: `resizeElements` (tryon.util.ts) can size `canvas2`
  // up to 2x past the source's native width/height for device-pixel-ratio sharpness (see its
  // own comment). `drawImage`'s source-rectangle args are always in the *source*'s own pixel
  // space, not the destination's - sampling with unscaled `dimension`-space coordinates would
  // silently read the wrong region once that DPR scale-up is active (exactly what happened
  // during development here: a noisy, patchy-looking mask that didn't respond to threshold
  // tuning, because the pixels being classified weren't the ones actually under the face at
  // all). Scaling back down to the source's own space first keeps this correct regardless of
  // DPR.
  const sourceWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const sourceHeight =
    source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
  const scaleX = sourceWidth / dimension.width;
  const scaleY = sourceHeight / dimension.height;

  // Clamped to the source's actual bounds - `FOREHEAD_EXTENSION_RATIO` (tryon-face.constants.ts)
  // deliberately pushes the oval's top points upward, which can push `bbox.y` negative for a
  // close-cropped photo (face fills most of the frame already). `drawImage`'s source-rectangle
  // going even partially outside the source's own bounds reads as undefined/garbage data in
  // that region rather than clamping automatically - which silently corrupted a chunk of the
  // sampled grid into "not skin" noise here (the actual bug behind the patchy first attempt,
  // not the skin heuristic itself - the DPR-scale mismatch above was a real, separate bug, but
  // didn't happen to be the cause *in this specific test*, since this photo's canvas wasn't
  // actually DPR-upscaled).
  const sx = Math.max(0, bbox.x * scaleX);
  const sy = Math.max(0, bbox.y * scaleY);
  const sWidth = Math.min(bbox.width * scaleX, sourceWidth - sx);
  const sHeight = Math.min(bbox.height * scaleY, sourceHeight - sy);
  if (sWidth <= 0 || sHeight <= 0) return null;

  const sample = document.createElement('canvas');
  sample.width = SKIN_MASK_GRID_WIDTH;
  sample.height = SKIN_MASK_GRID_HEIGHT;
  const sampleCtx = sample.getContext('2d');
  if (!sampleCtx) return null;

  sampleCtx.drawImage(
    source,
    sx,
    sy,
    sWidth,
    sHeight,
    0,
    0,
    SKIN_MASK_GRID_WIDTH,
    SKIN_MASK_GRID_HEIGHT,
  );

  const { data } = sampleCtx.getImageData(0, 0, SKIN_MASK_GRID_WIDTH, SKIN_MASK_GRID_HEIGHT);
  const mask = sampleCtx.createImageData(SKIN_MASK_GRID_WIDTH, SKIN_MASK_GRID_HEIGHT);
  for (let row = 0; row < SKIN_MASK_GRID_HEIGHT; row++) {
    for (let col = 0; col < SKIN_MASK_GRID_WIDTH; col++) {
      const i = (row * SKIN_MASK_GRID_WIDTH + col) * 4;
      // `noUncheckedIndexedAccess` guard only - `i`/`i+1`/`i+2` always land inside `data` here,
      // the loop bounds mirror the exact grid `data` was rasterized at.
      const skin =
        !isInBorderZone(col, row) || isSkinPixel(data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0);
      mask.data[i] = 255;
      mask.data[i + 1] = 255;
      mask.data[i + 2] = 255;
      mask.data[i + 3] = skin ? 255 : 0;
    }
  }
  sampleCtx.putImageData(mask, 0, 0);
  return sample;
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
  drawSource: HTMLVideoElement | HTMLImageElement,
) => {
  // Composited on a temp canvas first (tint fill, *then* the skin mask erases non-skin areas
  // from it), so the final `drawImage` onto the real, possibly-mirrored `ctx` is one already-
  // finished layer - same "build on an off-screen canvas, composite once" shape as LIP's own
  // `applyMatteLips`, and for the same reason: `ctx` may have a mirror transform active (Live
  // mode) that only the *final* draw should go through, not every intermediate step.
  const temp = document.createElement('canvas');
  temp.width = dimension.width;
  temp.height = dimension.height;
  const tempCtx = temp.getContext('2d');
  if (!tempCtx) return;

  const ovalPoints = applyForeheadExtension(toPoints(face, FACE_OVAL_INDICES, dimension));
  const ovalXs = ovalPoints.map((p) => p.x);
  const ovalYs = ovalPoints.map((p) => p.y);
  const bbox = {
    x: Math.min(...ovalXs),
    y: Math.min(...ovalYs),
    width: Math.max(...ovalXs) - Math.min(...ovalXs),
    height: Math.max(...ovalYs) - Math.min(...ovalYs),
  };

  tempCtx.save();
  clipToFaceExcludingFeatures(tempCtx, face, dimension);
  tempCtx.globalCompositeOperation = 'multiply';
  tempCtx.fillStyle = color;
  tempCtx.globalAlpha = alpha;
  tempCtx.fillRect(0, 0, dimension.width, dimension.height);
  tempCtx.restore();

  const mask = buildSkinMask(drawSource, bbox, dimension);
  if (mask) {
    // `destination-in` keeps only the parts of the tint layer that overlap something drawn
    // into it now (the mask) - anywhere the mask is transparent (classified "not skin") erases
    // the tint there, everywhere it's opaque (classified "skin") leaves the tint untouched.
    tempCtx.save();
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.drawImage(mask, bbox.x, bbox.y, bbox.width, bbox.height);
    tempCtx.restore();
  }

  ctx.drawImage(temp, 0, 0);
};
