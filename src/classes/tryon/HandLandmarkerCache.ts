import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';

import type { TRunningMode } from '@/types/tryon-types';

// Pinned to the exact same version FaceLandmarkerCache.ts/HairSegmenterCache.ts use - all three
// tasks ship from the same `@mediapipe/tasks-vision` WASM runtime, so there's no reason for these
// to ever drift apart (see FaceLandmarkerCache.ts's own comment on why the version is pinned at
// all).
const MEDIAPIPE_TASKS_VISION_VERSION = '0.10.32';
const MEDIAPIPE_WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_TASKS_VISION_VERSION}/wasm`;

// Self-hosted rather than fetched from Google's `storage.googleapis.com` - same reasoning as
// `FACE_LANDMARKER_MODEL_URL`/`HAIR_SEGMENTER_MODEL_URL`: that URL sends `Cache-Control:
// max-age=3600` (1 hour), self-hosting gets this app's own far-longer static-asset cache policy
// instead (`vercel.json`'s existing `/models/(.*)` rule already covers this path, no change
// needed there). ~7.8MB, Google's published "Hand Landmarker" model (21 hand-knuckle landmarks
// per detected hand) - see docs/tryons/NAIL-PLAN.md's Research section for why this (not a
// nail-specific segmentation model - none exists off-the-shelf) is the right tracking model.
const HAND_LANDMARKER_MODEL_URL = '/models/tryon/hand_landmarker.task';

const createLandmarker = async (
  canvas: HTMLCanvasElement,
  mode: TRunningMode,
): Promise<HandLandmarker> => {
  const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_BASE_URL);

  const createWithDelegate = (delegate: 'GPU' | 'CPU') =>
    HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: HAND_LANDMARKER_MODEL_URL, delegate },
      runningMode: mode,
      canvas,
      // A real nail try-on almost always wants both hands paintable at once, not just whichever
      // one the model happens to detect first - see docs/tryons/NAIL-PLAN.md's Open question 2 on
      // the extra per-frame cost this adds in Live mode.
      numHands: 2,
    });

  try {
    return await createWithDelegate('GPU');
  } catch (err) {
    console.warn('HandLandmarker GPU delegate failed, falling back to CPU', err);
    return await createWithDelegate('CPU');
  }
};

const landmarkerPromises = new Map<TRunningMode, Promise<HandLandmarker>>();

/**
 * Lazily creates (once) and caches a `HandLandmarker` per running mode, shared across every
 * open/close of the Try-On modal for the lifetime of the page - mirrors
 * `getSharedFaceLandmarker` (FaceLandmarkerCache.ts) exactly, just for NAIL's hand-tracking model
 * instead of the face-landmark one.
 */
export const getSharedHandLandmarker = (
  canvas: HTMLCanvasElement,
  mode: TRunningMode,
  signal?: AbortSignal,
): Promise<HandLandmarker> => {
  if (signal?.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));

  let promise = landmarkerPromises.get(mode);

  if (!promise) {
    promise = createLandmarker(canvas, mode).catch((err: unknown) => {
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
