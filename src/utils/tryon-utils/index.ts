import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import type {
  ColorTuple,
  IObjectFitContentRect,
  TFaceDetectionStatus,
} from '@/types/tryon-engine.type';

// Category-agnostic helpers for the Try-On rendering engine (`@/classes/tryon`) - canvas
// sizing, snapshot capture, color parsing, abort-aware image loading. Ported from the
// reference implementation's `virtual-tryon/utils/index.ts`; nothing here is LIP-specific
// (that lives in `./lip.ts`).

// Landmark x/y are normalized 0-1 fractions of the analyzed frame - a point at/past this margin
// from any edge counts as the face being cut off by the frame boundary, not fully "in frame".
// Deliberately tiny: MediaPipe's face mesh covers the *whole* face oval, including the jaw,
// ears, and hairline - for any normal, reasonably-close headshot (the expected framing for a
// makeup try-on, since people want to actually see their lips), those outer contour points
// routinely sit within a few percent of the image edge even though nothing is actually cut off.
// A looser margin (this was 0.02) was flagging completely normal framing as "not in frame" -
// this should only trip for a landmark genuinely at/past the boundary.
const FACE_FRAME_EDGE_MARGIN = 0.002;
// The detected face's own bounding box (in that same 0-1 space) must span at least this much of
// the frame on both axes - below it, the face is too small/far away to trust makeup placement
// on, even though MediaPipe still reports landmarks for it.
const FACE_MIN_SIZE_RATIO = 0.15;

// Derives a coarse "can we trust this frame's face enough to draw makeup on it" signal purely
// from landmark positions (no pixel/brightness analysis) - see `TFaceDetectionStatus`'s own
// comment for what each result means and why it's recomputed every frame rather than latched
// once. `face` is `TryOnEngineBase`'s `this.landmark.faceLandmarks[0]` - `undefined` when
// MediaPipe found no face at all this frame.
export const getFaceDetectionStatus = (
  face: NormalizedLandmark[] | undefined,
): TFaceDetectionStatus => {
  if (!face || face.length === 0) return 'not-in-frame';

  let minX = 1;
  let maxX = 0;
  let minY = 1;
  let maxY = 0;
  for (const point of face) {
    if (point.x < minX) minX = point.x;
    if (point.x > maxX) maxX = point.x;
    if (point.y < minY) minY = point.y;
    if (point.y > maxY) maxY = point.y;
  }

  const touchesFrameEdge =
    minX <= FACE_FRAME_EDGE_MARGIN ||
    maxX >= 1 - FACE_FRAME_EDGE_MARGIN ||
    minY <= FACE_FRAME_EDGE_MARGIN ||
    maxY >= 1 - FACE_FRAME_EDGE_MARGIN;
  if (touchesFrameEdge) return 'not-in-frame';

  const isTooSmall = maxX - minX < FACE_MIN_SIZE_RATIO || maxY - minY < FACE_MIN_SIZE_RATIO;
  if (isTooSmall) return 'not-clear';

  return 'detected';
};

// The core `object-fit` scale-factor math, shared by `resizeElements` and
// `getObjectFitContentRect` below - see that function's own comment for what each value means.
const getObjectFitScale = (
  boxWidth: number,
  boxHeight: number,
  contentWidth: number,
  contentHeight: number,
  objectFit: string,
): number => {
  const widthScale = boxWidth / contentWidth;
  const heightScale = boxHeight / contentHeight;

  switch (objectFit) {
    case 'cover':
      return Math.max(widthScale, heightScale);
    case 'fill':
      // Stretches independently per axis to exactly match the box - width always ends up
      // exactly `boxWidth`, which `widthScale` alone already produces here.
      return widthScale;
    case 'none':
      return 1;
    case 'scale-down':
      return Math.min(1, widthScale, heightScale);
    case 'contain':
    default:
      return Math.min(widthScale, heightScale);
  }
};

// `object-fit` is a static class on a Try-On canvas - never toggled at runtime - so it's safe
// (and, for `resizeElements` below, important - it runs on every video frame in Live mode) to
// read it only once per canvas rather than forcing a style recalculation on every call.
const objectFitCache = new WeakMap<HTMLCanvasElement, string>();

const getCachedObjectFit = (canvas: HTMLCanvasElement): string => {
  let objectFit = objectFitCache.get(canvas);
  if (objectFit === undefined) {
    objectFit = getComputedStyle(canvas).objectFit;
    objectFitCache.set(canvas, objectFit);
  }
  return objectFit;
};

// Ceiling on how far `resizeElements` below will scale `canvas2`'s backing store up for device
// pixel density. Perceived sharpness past 2x is marginal, while every per-frame `drawImage`/
// fill/stroke cost in Live mode's continuous render loop scales with the *square* of this
// number - uncapped, a 3x phone would pay 2.25x the render cost of a capped 2x for a difference
// nobody can actually see. 2 is the same ceiling most canvas/WebGL apps settle on for this exact
// tradeoff. Read fresh every call (not cached like `object-fit` above) since, unlike a fixed CSS
// class, `devicePixelRatio` can genuinely change mid-session (dragging the window to a different
// monitor, browser zoom) - it's a plain property read, not a forced style recalculation, so
// there's no real cost to staying correct here.
const MAX_RENDER_DEVICE_PIXEL_RATIO = 2;

// Sizes both render canvases to the source's native resolution, then scales their CSS display
// size to fit within the parent container on *both* axes - matching whichever `object-fit` the
// canvas is actually set to (`contain` for Upload, `cover` for Live - see TryOnUploadStage.tsx/
// TryOnLiveStage.tsx). This used to only scale to fill the parent's height, uncapped on width;
// on a narrow/tall container (a mobile canvas panel) with a landscape-aspect photo, that could
// size the canvas wider than its box - `overflow-hidden` on the panel then silently cropped the
// sides instead of showing the whole photo, which is exactly wrong for Upload's intended
// `contain` behavior (Live's `cover` happened to still look fine, since cropping overflow *is*
// what `cover` wants - this was only ever visibly broken for Upload).
export const resizeElements = (
  source: HTMLVideoElement | HTMLImageElement,
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement,
) => {
  const width = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
  const height = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;

  if (!width || !height) return;

  // `canvas1` only ever feeds MediaPipe's FaceLandmarker (as a GL-context host at init - see
  // `getSharedFaceLandmarker` - detection itself runs directly against the source `<video>`/
  // `<img>` element, see `withLiveCamera.ts`/`withImageUpload.ts`, never against this canvas's
  // pixels). Detection accuracy comes from the source's own real pixel content, not from how
  // many pixels the canvas *holding a GL context* has, so this always stays at the source's
  // native resolution - the device-pixel-ratio upscaling below deliberately never touches it,
  // since that would only add cost for zero detection benefit.
  canvas1.width = width;
  canvas1.height = height;

  const parent = canvas1.parentElement?.getBoundingClientRect();
  const parentWidth = parent?.width ?? width;
  const parentHeight = parent?.height ?? height;

  const scale = getObjectFitScale(
    parentWidth,
    parentHeight,
    width,
    height,
    getCachedObjectFit(canvas1),
  );
  const displayWidth = width * scale;
  const displayHeight = height * scale;

  canvas1.style.width = `${String(displayWidth)}px`;
  canvas1.style.height = `${String(displayHeight)}px`;
  canvas2.style.width = `${String(displayWidth)}px`;
  canvas2.style.height = `${String(displayHeight)}px`;

  // `canvas2` is the actual visible/downloadable output (see `TryOnEngineBase.renderFrame`,
  // `captureSnapShot`) - every draw call there already reads its own width/height back off
  // `canvas2` rather than assuming it matches `canvas1`, so scaling only this one up is fully
  // self-contained: nothing downstream needs to know it happened. `scale * dpr` is exactly the
  // backing-store multiplier `displayWidth`/`displayHeight` (CSS px) need to be fully covered by
  // real device pixels - one multiplication covers both axes because `getObjectFitScale`
  // guarantees a single *uniform* factor for both (true for `cover`/`contain`, the only two
  // modes either stage class uses; only `fill`'s independent per-axis stretch would break this).
  // `Math.max(1, ...)` means this only ever *adds* resolution for a source that's genuinely
  // under-resolved for its display size (e.g. Live's webcam feed shown large on a high-DPR
  // screen) - never shrinks `canvas2` below the source's native resolution, which an uploaded
  // photo already exceeds in the common case.
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_RENDER_DEVICE_PIXEL_RATIO);
  const renderScale = Math.max(1, scale * dpr);

  canvas2.width = width * renderScale;
  canvas2.height = height * renderScale;
};

// Composites the source frame (mirrored for a live camera, as-is for an uploaded image)
// with the makeup overlay canvas on top, and returns a downloadable PNG data URL.
export const captureSnapShot = (
  source: HTMLVideoElement | HTMLImageElement,
  overlayCanvas: HTMLCanvasElement,
): string | null => {
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return null;

  tempCanvas.width = overlayCanvas.width;
  tempCanvas.height = overlayCanvas.height;

  if (source instanceof HTMLVideoElement) {
    ctx.save();
    ctx.translate(tempCanvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(source, 0, 0, tempCanvas.width, tempCanvas.height);
    ctx.restore();
  } else {
    ctx.drawImage(source, 0, 0, tempCanvas.width, tempCanvas.height);
  }

  ctx.drawImage(overlayCanvas, 0, 0);

  return tempCanvas.toDataURL('image/png');
};

export const hexToRGBA = (hex: string, alpha = 1): ColorTuple => {
  const clean = hex.replace('#', '');

  const [r, g, b] =
    clean.length === 3
      ? [
          parseInt(clean.charAt(0) + clean.charAt(0), 16),
          parseInt(clean.charAt(1) + clean.charAt(1), 16),
          parseInt(clean.charAt(2) + clean.charAt(2), 16),
        ]
      : [
          parseInt(clean.slice(0, 2), 16),
          parseInt(clean.slice(2, 4), 16),
          parseInt(clean.slice(4, 6), 16),
        ];

  return [r, g, b, alpha];
};

// Computes where a CSS `object-fit`-sized element's content actually renders within its own
// box, as a horizontal offset/width in percent of that box. `object-fit` only changes how the
// *content* fits inside an element's box, never the box itself - `object-contain` can letterbox
// it smaller (see TryOnUploadStage.tsx), `object-cover` can crop it larger (see
// TryOnLiveStage.tsx) - so naive box-relative positioning (e.g. an overlay driven by plain
// percentages of the box) can end up visibly misaligned with what's actually drawn. Handles
// every standard `object-fit` value, not just contain/cover, so a future category's stage
// canvas can use any of them without this silently going wrong again. Assumes the default
// centered `object-position: 50% 50%` - every current/planned category's stage centers its
// subject, so this isn't expected to need generalizing further; used by
// TryOnCompareSlider.tsx to line its drag handle up with `TryOnEngineBase.renderFrame`'s split.
export const getObjectFitContentRect = (
  boxWidth: number,
  boxHeight: number,
  contentWidth: number,
  contentHeight: number,
  objectFit: string,
): IObjectFitContentRect => {
  if (!boxWidth || !boxHeight || !contentWidth || !contentHeight) {
    return { leftPercent: 0, widthPercent: 100 };
  }

  const scale = getObjectFitScale(boxWidth, boxHeight, contentWidth, contentHeight, objectFit);
  const renderedWidth = contentWidth * scale;
  const offsetX = (boxWidth - renderedWidth) / 2;

  return {
    leftPercent: (offsetX / boxWidth) * 100,
    widthPercent: (renderedWidth / boxWidth) * 100,
  };
};

// Abort-aware image loader - used for both texture assets (once, at engine start) and
// user-uploaded photos (on demand, re-abortable if the user picks another photo mid-load).
export const loadImage = (src: string, signal?: AbortSignal): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    const cleanup = () => {
      img.onload = null;
      img.onerror = null;
      signal?.removeEventListener('abort', onAbort);
    };

    const onAbort = () => {
      cleanup();
      img.src = '';
      reject(new DOMException('Aborted', 'AbortError'));
    };

    signal?.addEventListener('abort', onAbort);

    img.onload = () => {
      cleanup();
      resolve(img);
    };

    img.onerror = () => {
      cleanup();
      reject(new Error(`Failed to load image: ${src}`));
    };

    img.src = src;
  });
};
