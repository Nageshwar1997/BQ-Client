import { HAIR_DEFAULT_RANGE } from '@/constants/tryon-constants/hair';
import type {
  IApplyHairEffectParams,
  IHairAssets,
  IHairTryOnState,
  THairFinish,
} from '@/types/tryon-types/hair';
import {
  applyColorHair,
  applyHennaHair,
  applyHighlightsHair,
  applyOmbreHair,
} from '@/utils/tryon-utils/hair';

import { SegmentationEngineBase } from '../../SegmentationEngineBase';

// Finishes that don't have dedicated rendering yet - same "fall back to the most basic finish,
// with a console warning" landing-spot pattern LIP/FACE's own `UNSUPPORTED_<CATEGORY>_FINISHES`
// use. COLOR is HAIR's own "most basic" finish (a full-strand recolor, the foundation every other
// HAIR finish builds on - see docs/tryons/HAIR-PLAN.md's Subcategories section), the same role
// FOUNDATION plays for FACE. Empty now that every HAIR finish has dedicated rendering - kept
// (rather than deleted) as the landing spot for any future HAIR finish added later, same as
// FACE/LIP's own sets never got removed either.
const UNSUPPORTED_HAIR_FINISHES = new Set<THairFinish>([]);

/**
 * HAIR category engine - fresh design (no reference implementation covers hair recolor at all,
 * see docs/tryons/HAIR-PLAN.md), built on `SegmentationEngineBase` (this category's own parallel
 * to `TryOnEngineBase` - see that file's comment for why) instead of the landmark-based one every
 * other category uses. Still abstract - `getRunningMode`/`onTryOnReady`/`onStateUpdated` are
 * filled in by whichever mode mixin wraps this (see HairLiveEngine.ts/HairUploadEngine.ts).
 */
export abstract class HairEngineBase extends SegmentationEngineBase<IHairTryOnState> {
  protected getInitialState(): IHairTryOnState {
    return {
      type: null,
      color: null,
      // No `type` yet to pick a finish-specific default from - same reasoning as
      // FaceEngineBase's identical comment.
      range: HAIR_DEFAULT_RANGE,
      cameraReady: false,
      imageReady: false,
      tryOnStarted: false,
      faceDetection: 'not-in-frame',
    };
  }

  protected loadCategoryAssets(): Promise<IHairAssets> {
    return Promise.resolve(null);
  }

  protected applyEffect({
    mask,
    ctx,
    dimension,
    rgb,
    state,
  }: IApplyHairEffectParams<IHairTryOnState, IHairAssets>): void {
    if (!state.type) return;

    const alpha = state.range;
    const params = { mask, ctx, rgb, dimension, alpha };

    if (UNSUPPORTED_HAIR_FINISHES.has(state.type)) {
      console.warn(
        `HAIR finish "${state.type}" doesn't have dedicated rendering yet - falling back to COLOR.`,
      );
      applyColorHair(params);
      return;
    }

    switch (state.type) {
      case 'COLOR':
        applyColorHair(params);
        return;
      case 'HENNA':
        applyHennaHair(params);
        return;
      case 'OMBRE':
        applyOmbreHair(params);
        return;
      case 'HIGHLIGHTS':
        applyHighlightsHair(params);
        return;
    }
  }
}
