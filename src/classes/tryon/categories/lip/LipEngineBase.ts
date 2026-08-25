import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import {
  CRAYON_TEXTURE_PATH,
  GLOSSY_TEXTURE_PATH_LOWER,
  GLOSSY_TEXTURE_PATH_UPPER,
  LIP_RANGE_BOUNDS,
  SHIMMER_TEXTURE_PATH,
} from '@/constants/tryon-lip.constants';
import type { TTryOnSubCategory } from '@/types/tryon.type';
import type { ColorTuple, IMakeupState } from '@/types/tryon-engine.type';
import { loadImage } from '@/utils/tryon.util';
import {
  applyBalmLips,
  applyCrayonLips,
  applyGlossLips,
  applyMatteLips,
  applyOilLips,
  applySatinLips,
  applyShimmerLips,
  applyStainLips,
} from '@/utils/tryon-lip.util';

import { TryOnEngineBase } from '../../TryOnEngineBase';

export type TLipFinish = TTryOnSubCategory<'LIP'>;
export type ILipTryOnState = IMakeupState<TLipFinish>;

export interface ILipAssets {
  glossyUpper: HTMLImageElement;
  glossyLower: HTMLImageElement;
  crayon: HTMLImageElement;
  shimmer: HTMLImageElement;
}

// Finishes that don't have dedicated rendering yet (need new texture art or new stroke/
// dilation logic that doesn't exist in the reference this was ported from) - see
// docs/tryons/LIP.md. Rendered as MATTE with a console warning rather than silently
// pretending to be correct.
const UNSUPPORTED_LIP_FINISHES = new Set<TLipFinish>(['LINER', 'METALLIC', 'PLUMPER']);

/**
 * LIP category engine: loads the 4 lip texture images once, and applies the right finish
 * rendering per `state.type`. Still abstract - `getRunningMode`/`onTryOnReady`/
 * `onStateUpdated` are filled in by whichever mode mixin wraps this (see LipLiveEngine.ts /
 * LipUploadEngine.ts) - this class only ever needs to know about LIP, never about Live vs
 * Upload.
 */
export abstract class LipEngineBase extends TryOnEngineBase<ILipTryOnState, ILipAssets> {
  protected getInitialState(): ILipTryOnState {
    return {
      type: null,
      color: null,
      range: LIP_RANGE_BOUNDS.default,
      cameraReady: false,
      imageReady: false,
      tryOnStarted: false,
    };
  }

  protected async loadCategoryAssets(signal: AbortSignal): Promise<ILipAssets | null> {
    const [glossyUpper, glossyLower, crayon, shimmer] = await Promise.allSettled([
      loadImage(GLOSSY_TEXTURE_PATH_UPPER, signal),
      loadImage(GLOSSY_TEXTURE_PATH_LOWER, signal),
      loadImage(CRAYON_TEXTURE_PATH, signal),
      loadImage(SHIMMER_TEXTURE_PATH, signal),
    ]);

    if (
      glossyUpper.status !== 'fulfilled' ||
      glossyLower.status !== 'fulfilled' ||
      crayon.status !== 'fulfilled' ||
      shimmer.status !== 'fulfilled'
    ) {
      console.error('Failed to load one or more lip textures', {
        glossyUpper,
        glossyLower,
        crayon,
        shimmer,
      });
      return null;
    }

    return {
      glossyUpper: glossyUpper.value,
      glossyLower: glossyLower.value,
      crayon: crayon.value,
      shimmer: shimmer.value,
    };
  }

  protected applyEffect(
    face: NormalizedLandmark[],
    ctx: CanvasRenderingContext2D,
    size: { width: number; height: number },
    rgb: ColorTuple,
    state: ILipTryOnState,
    assets: ILipAssets | null,
  ): void {
    if (!state.type) return;

    const [r, g, b] = rgb;
    const color = `rgba(${String(r)},${String(g)},${String(b)},0.6)`;
    const alpha = state.range;

    if (UNSUPPORTED_LIP_FINISHES.has(state.type)) {
      console.warn(
        `LIP finish "${state.type}" doesn't have dedicated rendering yet - falling back to MATTE.`,
      );
      applyMatteLips(face, ctx, color, size, alpha);
      return;
    }

    switch (state.type) {
      case 'MATTE':
        applyMatteLips(face, ctx, color, size, alpha);
        return;
      case 'STAIN':
        applyStainLips(face, ctx, color, size, alpha);
        return;
    }

    // Everything past this point needs the loaded texture assets.
    if (!assets) return;

    switch (state.type) {
      case 'SATIN':
        applySatinLips(face, ctx, color, assets.glossyUpper, assets.glossyLower, size, alpha);
        return;
      case 'GLOSS':
        applyGlossLips(face, ctx, color, assets.glossyUpper, assets.glossyLower, size, alpha);
        return;
      case 'BALM':
        applyBalmLips(face, ctx, color, assets.glossyUpper, assets.glossyLower, size, alpha);
        return;
      case 'OIL':
        applyOilLips(face, ctx, color, assets.glossyUpper, assets.glossyLower, size, alpha);
        return;
      case 'SHIMMER':
        applyShimmerLips(face, ctx, color, assets.shimmer, size, alpha);
        return;
      case 'CRAYON':
        applyCrayonLips(face, ctx, color, assets.crayon, size, alpha);
        return;
    }
  }
}
