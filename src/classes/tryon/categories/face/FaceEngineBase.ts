// eslint-disable-next-line simple-import-sort/imports
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import { FACE_RANGE_BOUNDS } from '@/constants/tryon-face.constants';
import type { ColorTuple, IMakeupState } from '@/types/tryon-engine.type';
import type { TTryOnSubCategory } from '@/types/tryon.type';
import { applyFoundationFace } from '@/utils/tryon-face.util';

import { TryOnEngineBase } from '../../TryOnEngineBase';

export type TFaceFinish = TTryOnSubCategory<'FACE'>;
export type IFaceTryOnState = IMakeupState<TFaceFinish>;

// No textures yet - every finish built so far is a pure color/blend effect, no asset needed.
// Follows LIP's own precedent (MATTE/STAIN/LINER need none either) - add fields here only once
// a finish genuinely needs one, same as LIP's `ILipAssets` grew incrementally.
export type IFaceAssets = null;

// Finishes that don't have dedicated rendering yet - same landing-spot pattern as LIP's
// `UNSUPPORTED_LIP_FINISHES` (see LipEngineBase.ts), falls back to FOUNDATION (the most basic
// full-face tint) with a console warning rather than silently doing nothing.
const UNSUPPORTED_FACE_FINISHES = new Set<TFaceFinish>([
  'CONCEALER',
  'HIGHLIGHTER',
  'BLUSH',
  'CONTOUR',
  'BRONZER',
  'BBCREAM',
  'COMPACTPOWDER',
]);

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
      range: FACE_RANGE_BOUNDS.default,
      cameraReady: false,
      imageReady: false,
      tryOnStarted: false,
      faceDetection: 'not-in-frame',
    };
  }

  protected loadCategoryAssets(): Promise<IFaceAssets> {
    return Promise.resolve(null);
  }

  protected applyEffect(
    face: NormalizedLandmark[],
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    rgb: ColorTuple,
    state: IFaceTryOnState,
  ): void {
    if (!state.type) return;

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
    }
  }
}
