import type { ColorTuple } from '@/types/tryon-engine.type';

// Category-agnostic helpers for the Try-On rendering engine (`@/classes/tryon`) - canvas
// sizing, snapshot capture, color parsing, abort-aware image loading. Ported from the
// reference implementation's `virtual-tryon/utils/index.ts`; nothing here is LIP-specific
// (that lives in `tryon-lip.util.ts`).

// Sizes both render canvases to the source's native resolution, then scales their CSS
// display size to fill the parent container height while preserving aspect ratio.
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
  const displayHeight = parent?.height ?? height;
  const displayWidth = displayHeight * (width / height);

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
