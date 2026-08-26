import type { IObjectFitContentRect } from '@/types/tryon.type';
import type { ColorTuple } from '@/types/tryon-engine.type';

// Category-agnostic helpers for the Try-On rendering engine (`@/classes/tryon`) - canvas
// sizing, snapshot capture, color parsing, abort-aware image loading. Ported from the
// reference implementation's `virtual-tryon/utils/index.ts`; nothing here is LIP-specific
// (that lives in `tryon-lip.util.ts`).

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

  canvas1.width = width;
  canvas1.height = height;
  canvas2.width = width;
  canvas2.height = height;

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
