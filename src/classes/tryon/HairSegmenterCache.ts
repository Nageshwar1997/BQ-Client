import type { ImageSegmenterResult } from '@mediapipe/tasks-vision';
import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';

import type { TRunningMode } from '@/types/tryon-types';
import type { IHairMask } from '@/types/tryon-types/hair';

// Pinned to the exact same version FaceLandmarkerCache.ts uses - both tasks ship from the same
// `@mediapipe/tasks-vision` WASM runtime, so there's no reason for these to ever drift apart
// (see that file's own comment on why the version is pinned at all).
const MEDIAPIPE_TASKS_VISION_VERSION = '0.10.32';
const MEDIAPIPE_WASM_BASE_URL = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_TASKS_VISION_VERSION}/wasm`;

// Self-hosted rather than fetched from Google's `storage.googleapis.com` - same reasoning as
// `FACE_LANDMARKER_MODEL_URL` (FaceLandmarkerCache.ts): that URL sends `Cache-Control:
// max-age=3600` (1 hour), self-hosting gets this app's own far-longer static-asset cache policy
// instead (`vercel.json`'s `/models/(.*)` rule already covers this path, no change needed there).
// ~782KB, Google's published "Hair Segmenter" model (2-class: background=0, hair=1,
// `outputConfidenceMasks`) - chosen over Selfie Segmentation (no hair-specific class at all),
// Multi-Class Selfie Segmentation (has a hair class, but half the input resolution - 256x256 vs
// this model's 512x512 - since it splits capacity across 6 classes instead of specializing), and
// DeepLab-v3 (wrong domain entirely, general scene objects, no hair class). Full reasoning in
// docs/tryons/HAIR-PLAN.md's Research section.
const HAIR_SEGMENTER_MODEL_URL = '/models/tryon/hair_segmenter.tflite';

const createSegmenter = async (
  canvas: HTMLCanvasElement,
  mode: TRunningMode,
): Promise<ImageSegmenter> => {
  const vision = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_BASE_URL);

  const createWithDelegate = (delegate: 'GPU' | 'CPU') =>
    ImageSegmenter.createFromOptions(vision, {
      baseOptions: { modelAssetPath: HAIR_SEGMENTER_MODEL_URL, delegate },
      runningMode: mode,
      canvas,
      // Confidence masks (per-pixel [0,1] probability), not the hard category mask - a hard
      // 0/1-per-pixel read would show jagged/aliased hair edges, unlike every other soft-edged
      // effect in this app (`drawFeatheredBlob`/`fillFaceOvalRegion`). See HAIR-PLAN.md's Research
      // section.
      outputConfidenceMasks: true,
      outputCategoryMask: false,
    });

  try {
    return await createWithDelegate('GPU');
  } catch (err) {
    console.warn('ImageSegmenter GPU delegate failed, falling back to CPU', err);
    return await createWithDelegate('CPU');
  }
};

const segmenterPromises = new Map<TRunningMode, Promise<ImageSegmenter>>();

/**
 * Lazily creates (once) and caches an `ImageSegmenter` per running mode, shared across every
 * open/close of the Try-On modal for the lifetime of the page - mirrors
 * `getSharedFaceLandmarker` (FaceLandmarkerCache.ts) exactly, just for HAIR's segmentation model
 * instead of the face-landmark one. Deliberately a separate cache/file, not a generalized
 * "shared model loader" the two share - see docs/tryons/HAIR-PLAN.md's "Engine architecture"
 * section for why HAIR's tracking stack stays parallel rather than folded into the landmark one.
 */
export const getSharedHairSegmenter = (
  canvas: HTMLCanvasElement,
  mode: TRunningMode,
  signal?: AbortSignal,
): Promise<ImageSegmenter> => {
  if (signal?.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));

  let promise = segmenterPromises.get(mode);

  if (!promise) {
    promise = createSegmenter(canvas, mode).catch((err: unknown) => {
      segmenterPromises.delete(mode);
      throw err;
    });
    segmenterPromises.set(mode, promise);
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

// Pulls the hair-confidence mask out of a raw `ImageSegmenterResult` into this app's own plain
// `IHairMask` shape - index 1, per the Hair Segmenter model's own published category order
// (background=0, hair=1, see docs/tryons/HAIR-PLAN.md's Research section). `getAsFloat32Array()`
// copies the data into a fresh, independently-owned array (not a live view into MediaPipe's own
// WASM/GPU memory) - safe to hold onto after this call returns, unlike the `MPMask`/`result`
// objects themselves.
//
// `closeMask` matters here: a mask handed to us *inside* a segmentForVideo/segment callback
// (`withLiveCameraSegmentation.ts`'s Live-mode loop) is task-owned and freed automatically once
// the callback returns (per `MPMask.close()`'s own doc comment) - closing it ourselves there would
// be redundant. A mask returned by the *synchronous* `segment()` overload
// (`withImageUploadSegmentation.ts`, called once per uploaded photo) is instead an app-owned copy
// the task explicitly hands off to us - that one this app is responsible for freeing once the
// `Float32Array` copy is safely extracted.
export const extractHairMask = (
  result: ImageSegmenterResult,
  closeMask: boolean,
): IHairMask | null => {
  const hairConfidence = result.confidenceMasks?.[1];
  if (!hairConfidence) return null;

  const mask: IHairMask = {
    data: hairConfidence.getAsFloat32Array(),
    width: hairConfidence.width,
    height: hairConfidence.height,
  };

  if (closeMask) hairConfidence.close();

  return mask;
};
