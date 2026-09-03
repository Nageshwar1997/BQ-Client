import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import { FACE_DEFAULT_RANGE } from '@/constants/tryon-constants/face';
import type { ColorTuple } from '@/types/tryon-types';
import type { IFaceAssets, IFaceTryOnState, TFaceFinish } from '@/types/tryon-types/face';
import {
  applyBlushFace,
  applyBronzerFace,
  applyConcealerFace,
  applyContourFace,
  applyFoundationFace,
  applyHighlighterFace,
  isFaceTurnedTooMuch,
} from '@/utils/tryon-utils/face';

import { TryOnEngineBase } from '../../TryOnEngineBase';

// Finishes that don't have dedicated rendering yet - same landing-spot pattern as LIP's
// `UNSUPPORTED_LIP_FINISHES` (see LipEngineBase.ts), falls back to FOUNDATION (the most basic
// full-face tint) with a console warning rather than silently doing nothing.
const UNSUPPORTED_FACE_FINISHES = new Set<TFaceFinish>(['BBCREAM', 'COMPACTPOWDER']);

/**
 * FACE category engine - fresh design (not ported from any reference implementation, see
 * docs/tryons/FACE.md), built on the exact same shared machinery LIP already proved out
 * (`TryOnEngineBase`/`withLiveCamera`/`withImageUpload`). Still abstract -
 * `getRunningMode`/`onTryOnReady`/`onStateUpdated` are filled in by whichever mode mixin wraps
 * this (see FaceLiveEngine.ts/FaceUploadEngine.ts).
 */
export abstract class FaceEngineBase extends TryOnEngineBase<IFaceTryOnState> {
  protected getInitialState(): IFaceTryOnState {
    return {
      type: null,
      color: null,
      // No `type` yet to pick a finish-specific default from (`FACE_RANGE_BOUNDS` is now keyed
      // per finish) - same reasoning as LipEngineBase's identical comment. Uses the category-wide
      // `FACE_DEFAULT_RANGE` rather than borrowing FOUNDATION's own default.
      range: FACE_DEFAULT_RANGE,
      cameraReady: false,
      imageReady: false,
      tryOnStarted: false,
      faceDetection: 'not-in-frame',
    };
  }

  protected loadCategoryAssets(): Promise<IFaceAssets> {
    return Promise.resolve(null);
  }

  // Only downgrades an already-'detected' reading - a face that's out of frame or too small is
  // already flagged for a more basic reason, and checking turn on landmarks that unreliable
  // would just be noise. See `isFaceTurnedTooMuch`'s own comment for why FACE specifically needs
  // this (its full-face finishes, unlike LIP's lip-only region) and why no other category
  // overrides this hook.
  protected refineFaceDetectionStatus(
    status: IFaceTryOnState['faceDetection'],
    face: NormalizedLandmark[] | undefined,
  ): IFaceTryOnState['faceDetection'] {
    if (status !== 'detected' || !face) return status;
    return isFaceTurnedTooMuch(face) ? 'turned' : status;
  }

  protected applyEffect(
    face: NormalizedLandmark[],
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    rgb: ColorTuple,
    state: IFaceTryOnState,
    _assets: IFaceAssets,
  ): void {
    if (!state.type) return;
    // `renderFrame` (TryOnEngineBase) only ever uses `faceDetection` to drive the overlay - it
    // still calls this on a 'not-clear'/'not-in-frame' reading too, deliberately (a stray frame
    // of jitter shouldn't blank the canvas before the debounced overlay even shows), and for
    // those two a face that's just small/blurry still renders a reasonably faithful tint anyway.
    // 'turned' is different on purpose: the whole reason it exists is that a turned head can
    // render a genuinely *wrong* shape here (see tryon-utils/face.ts's own history - tint
    // bulging past the visible nose). The overlay (`TryOnOverlay`) sits on a semi-transparent
    // `bg-black/45` scrim, not a fully opaque one, so without this guard that bad shape would
    // still show dimly *through* the "face the camera" message instead of actually going away.
    if (state.faceDetection === 'turned') return;

    const [r, g, b] = rgb;
    const color = `rgba(${String(r)},${String(g)},${String(b)},0.6)`;
    const alpha = state.range;

    if (UNSUPPORTED_FACE_FINISHES.has(state.type)) {
      console.warn(
        `FACE finish "${state.type}" doesn't have dedicated rendering yet - falling back to FOUNDATION.`,
      );
      applyFoundationFace(face, ctx, color, size, alpha);
      return;
    }

    switch (state.type) {
      case 'FOUNDATION':
        applyFoundationFace(face, ctx, color, size, alpha);
        return;
      case 'BLUSH':
        applyBlushFace(face, ctx, rgb, size, alpha);
        return;
      case 'CONCEALER':
        applyConcealerFace(face, ctx, rgb, size, alpha);
        return;
      case 'HIGHLIGHTER':
        applyHighlighterFace(face, ctx, rgb, size, alpha);
        return;
      case 'CONTOUR':
        applyContourFace(face, ctx, rgb, size, alpha);
        return;
      case 'BRONZER':
        applyBronzerFace(face, ctx, rgb, size, alpha);
        return;
    }
  }
}
