import { EYE_DEFAULT_RANGE, EYELINER_DEFAULT_PATTERN } from '@/constants/tryon-constants/eye';
import type { IApplyEffectParams } from '@/types/tryon-types';
import type { IEyeAssets, IEyeTryOnState, TEyeFinish } from '@/types/tryon-types/eye';
import { applyEyelinerEye } from '@/utils/tryon-utils/eye';

import { TryOnEngineBase } from '../../TryOnEngineBase';

// Finishes that don't have dedicated rendering yet - see docs/tryons/EYE-PLAN.md's build order.
// Unlike LIP's `UNSUPPORTED_LIP_FINISHES`/FACE's `UNSUPPORTED_FACE_FINISHES` (which fall back to
// rendering as that category's most basic finish, MATTE/FOUNDATION), EYE's subcategories are
// different *product types* applied to different regions (a brow fill and a lash-line liner
// aren't variants of the same effect the way two lipstick finishes are) - falling back to
// EYELINER's rendering for, say, an unsupported EYESHADOW pick would paint the wrong region
// entirely. So this just skips rendering (with a console warning) rather than substituting a
// mismatched effect.
const UNSUPPORTED_EYE_FINISHES = new Set<TEyeFinish>([
  'EYEBROW',
  'KAJAL',
  'EYESHADOW',
  'MASCARA',
  'LASHES',
  'BROWGEL',
]);

/**
 * EYE category engine - fresh design (not ported from any reference implementation, see
 * docs/tryons/EYE-PLAN.md), built on the exact same shared machinery LIP/FACE already proved out
 * (`TryOnEngineBase`/`withLiveCamera`/`withImageUpload`). Still abstract -
 * `getRunningMode`/`onTryOnReady`/`onStateUpdated` are filled in by whichever mode mixin wraps
 * this (see EyeLiveEngine.ts/EyeUploadEngine.ts).
 */
export abstract class EyeEngineBase extends TryOnEngineBase<IEyeTryOnState> {
  protected getInitialState(): IEyeTryOnState {
    return {
      type: null,
      color: null,
      // No `type` yet to pick a finish-specific default from - same reasoning as
      // LipEngineBase/FaceEngineBase's identical comment. Uses the category-wide
      // `EYE_DEFAULT_RANGE` rather than borrowing any one finish's own default.
      range: EYE_DEFAULT_RANGE,
      // Same "blank until picked" reasoning as `color`/`type` - EYELINER's own default
      // (`EYELINER_DEFAULT_PATTERN`) only actually applies once `type` is 'EYELINER'; this is
      // just the pre-selection placeholder.
      pattern: EYELINER_DEFAULT_PATTERN,
      cameraReady: false,
      imageReady: false,
      tryOnStarted: false,
      faceDetection: 'not-in-frame',
    };
  }

  protected loadCategoryAssets(): Promise<IEyeAssets> {
    return Promise.resolve(null);
  }

  protected applyEffect({
    face,
    ctx,
    dimension,
    rgb,
    state,
  }: IApplyEffectParams<IEyeTryOnState, IEyeAssets>): void {
    if (!state.type) return;
    // Unlike FaceEngineBase, this doesn't override `refineFaceDetectionStatus` yet, so
    // `state.faceDetection` can never actually report 'turned' here - no guard for it exists for
    // that reason (a dead check would be misleading about what's actually implemented). EYE's
    // liner is precision-heavy right up against the lash line, likely *more* sensitive to a
    // turned head than FACE's full-face fills - worth adding once real-device QA is underway.

    if (UNSUPPORTED_EYE_FINISHES.has(state.type)) {
      console.warn(`EYE finish "${state.type}" doesn't have dedicated rendering yet.`);
      return;
    }

    const alpha = state.range;
    const pattern = state.pattern ?? EYELINER_DEFAULT_PATTERN;

    switch (state.type) {
      case 'EYELINER':
        applyEyelinerEye({ face, ctx, rgb, dimension, alpha, pattern });
        return;
    }
  }
}
