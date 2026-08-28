import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

import type { TRunningMode } from '@/types/tryon-types';

// Pinned to match the CDN WASM version below - an unversioned WASM URL can let the browser
// cache mismatched JS/WASM assets, which fails at runtime with errors like
// `ASM_CONSTS[code] is not a function`. Bump both together, deliberately.
const MEDIAPIPE_TASKS_VISION_VERSION = '0.10.32';
const MEDIAPIPE_WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_TASKS_VISION_VERSION}/wasm`;

// Self-hosted rather than fetched from Google's `storage.googleapis.com` (where this file
// originally comes from - float16 face_landmarker.task, ~3.7MB) - that URL sends
// `Cache-Control: max-age=3600`, just 1 hour, so any return visit past that re-downloads the
// full model over the network. Same-origin static assets get this app's own (far longer) cache
// policy instead, same as every other file in `public/` - no code-side caching logic needed for
// that win. Also sidesteps relying on Google's CORS headers staying permissive, and drops one
// extra DNS/TLS handshake to a third-party origin. Purely a hosting change - the file's bytes
// are unmodified from the original download, and `FilesetResolver`/`FaceLandmarker` read it
// exactly the same way regardless of where it came from. The WASM runtime above is NOT moved
// here - jsDelivr already serves it `immutable, max-age=31536000` (1 year), so there's nothing
// left to win there.
const FACE_LANDMARKER_MODEL_URL = '/models/try-on/face_landmarker.task';

const createLandmarker = async (
  canvas: HTMLCanvasElement,
  mode: TRunningMode,
): Promise<FaceLandmarker> => {
  const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_BASE_URL);

  const createWithDelegate = (delegate: 'GPU' | 'CPU') =>
    FaceLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: FACE_LANDMARKER_MODEL_URL, delegate },
      outputFaceBlendshapes: true,
      runningMode: mode,
      canvas,
      numFaces: 1,
    });

  try {
    return await createWithDelegate('GPU');
  } catch (err) {
    console.warn('FaceLandmarker GPU delegate failed, falling back to CPU', err);
    return await createWithDelegate('CPU');
  }
};

const landmarkerPromises = new Map<TRunningMode, Promise<FaceLandmarker>>();

/**
 * Lazily creates (once) and caches a `FaceLandmarker` per running mode, shared across every
 * category engine and every open/close of the Try-On modal for the lifetime of the page -
 * MediaPipe binds a landmarker to a mode at creation, so VIDEO and IMAGE each get their own
 * instance, but re-entering Live mode or reopening the modal reuses the existing one instead
 * of re-downloading/re-initializing the ~3.7MB model.
 *
 * `signal` only governs whether *this* call bails out of waiting - it never cancels an
 * in-flight shared creation another caller may still be waiting on, so the cache still warms
 * up even if the first caller to trigger it unmounts before it resolves.
 */
export const getSharedFaceLandmarker = (
  canvas: HTMLCanvasElement,
  mode: TRunningMode,
  signal?: AbortSignal,
): Promise<FaceLandmarker> => {
  if (signal?.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));

  let promise = landmarkerPromises.get(mode);

  if (!promise) {
    promise = createLandmarker(canvas, mode).catch((err: unknown) => {
      // Creation failed - drop the cache entry so the next caller retries instead of being
      // stuck with a permanently-rejected cached promise.
      landmarkerPromises.delete(mode);
      throw err;
    });
    landmarkerPromises.set(mode, promise);
  }

  if (!signal) return promise;

  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      signal.addEventListener('abort', () => {
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }),
  ]);
};
