// eslint-disable-next-line simple-import-sort/imports
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import {
  CRAYON_TEXTURE_PATH,
  GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_LOWER,
  GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_UPPER,
  LIP_RANGE_BOUNDS,
  METALLIC_TEXTURE_PATH_LOWER,
  METALLIC_TEXTURE_PATH_UPPER,
  OIL_TEXTURE_PATH_LOWER,
  OIL_TEXTURE_PATH_UPPER,
  SHIMMER_TEXTURE_PATH,
} from '@/constants/tryon-lip.constants';
import type { ColorTuple, IMakeupState } from '@/types/tryon-engine.type';
import type { TTryOnSubCategory } from '@/types/tryon.type';
import {
  applyBalmLips,
  applyCrayonLips,
  applyGlossLips,
  applyLinerLips,
  applyMatteLips,
  applyMetallicLips,
  applyOilLips,
  applyPlumperLips,
  applySatinLips,
  applyShimmerLips,
  applyStainLips,
} from '@/utils/tryon-lip.util';
import { loadImage } from '@/utils/tryon.util';

import { TryOnEngineBase } from '../../TryOnEngineBase';

export type TLipFinish = TTryOnSubCategory<'LIP'>;
export type ILipTryOnState = IMakeupState<TLipFinish>;

export interface ILipAssets {
  glossUpper: HTMLImageElement;
  glossLower: HTMLImageElement;
  crayon: HTMLImageElement;
  shimmer: HTMLImageElement;
  oilUpper: HTMLImageElement;
  oilLower: HTMLImageElement;
  metallicUpper: HTMLImageElement;
  metallicLower: HTMLImageElement;
  plumperUpper: HTMLImageElement;
  plumperLower: HTMLImageElement;
  satinUpper: HTMLImageElement;
  satinLower: HTMLImageElement;
  balmUpper: HTMLImageElement;
  balmLower: HTMLImageElement;
}

// Finishes that don't have dedicated rendering yet (need new texture art or new stroke/
// dilation logic that doesn't exist in the reference this was ported from) - see
// docs/tryons/LIP.md. Rendered as MATTE with a console warning rather than silently pretending
// to be correct. Empty now that all 11 LIP subcategories have dedicated rendering - kept (not
// deleted) as the landing spot for any future subcategory added to `TLipFinish` before its own
// renderer exists.
const UNSUPPORTED_LIP_FINISHES = new Set<TLipFinish>([]);

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
    const [
      glossOrSatinOrBalmOrPlumperUpper,
      glossOrSatinOrBalmOrPlumperLower,
      crayon,
      shimmer,
      oilUpper,
      oilLower,
      metallicUpper,
      metallicLower,
    ] = await Promise.allSettled([
      loadImage(GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_UPPER, signal),
      loadImage(GLOSS_OR_SATIN_OR_BALM_OR_PLUMPER_TEXTURE_PATH_LOWER, signal),
      loadImage(CRAYON_TEXTURE_PATH, signal),
      loadImage(SHIMMER_TEXTURE_PATH, signal),
      loadImage(OIL_TEXTURE_PATH_UPPER, signal),
      loadImage(OIL_TEXTURE_PATH_LOWER, signal),
      loadImage(METALLIC_TEXTURE_PATH_UPPER, signal),
      loadImage(METALLIC_TEXTURE_PATH_LOWER, signal),
    ]);

    if (
      glossOrSatinOrBalmOrPlumperUpper.status !== 'fulfilled' ||
      glossOrSatinOrBalmOrPlumperLower.status !== 'fulfilled' ||
      crayon.status !== 'fulfilled' ||
      shimmer.status !== 'fulfilled' ||
      oilUpper.status !== 'fulfilled' ||
      oilLower.status !== 'fulfilled' ||
      metallicUpper.status !== 'fulfilled' ||
      metallicLower.status !== 'fulfilled'
    ) {
      console.error('Failed to load one or more lip textures', {
        glossOrSatinOrBalmOrPlumperUpper,
        glossOrSatinOrBalmOrPlumperLower,
        crayon,
        shimmer,
        oilUpper,
        oilLower,
        metallicUpper,
        metallicLower,
      });
      return null;
    }

    return {
      crayon: crayon.value,
      shimmer: shimmer.value,
      oilUpper: oilUpper.value,
      oilLower: oilLower.value,
      glossUpper: glossOrSatinOrBalmOrPlumperUpper.value,
      glossLower: glossOrSatinOrBalmOrPlumperLower.value,
      plumperUpper: glossOrSatinOrBalmOrPlumperUpper.value,
      plumperLower: glossOrSatinOrBalmOrPlumperLower.value,
      balmLower: glossOrSatinOrBalmOrPlumperLower.value,
      balmUpper: glossOrSatinOrBalmOrPlumperUpper.value,
      satinLower: glossOrSatinOrBalmOrPlumperLower.value,
      satinUpper: glossOrSatinOrBalmOrPlumperUpper.value,
      metallicUpper: metallicUpper.value,
      metallicLower: metallicLower.value,
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
      case 'LINER':
        applyLinerLips(face, ctx, color, size, alpha);
        return;
    }

    // Everything past this point needs the loaded texture assets.
    if (!assets) return;

    switch (state.type) {
      case 'SATIN':
        applySatinLips(face, ctx, color, assets.satinUpper, assets.satinLower, size, alpha);
        return;
      case 'GLOSS':
        applyGlossLips(face, ctx, color, assets.glossUpper, assets.glossLower, size, alpha);
        return;
      case 'BALM':
        applyBalmLips(face, ctx, color, assets.balmUpper, assets.balmLower, size, alpha);
        return;
      case 'PLUMPER':
        applyPlumperLips(face, ctx, color, assets.plumperUpper, assets.plumperLower, size, alpha);
        return;
      case 'OIL':
        applyOilLips(face, ctx, color, assets.oilUpper, assets.oilLower, size, alpha);
        return;
      case 'SHIMMER':
        applyShimmerLips(face, ctx, color, assets.shimmer, size, alpha);
        return;
      case 'CRAYON':
        applyCrayonLips(face, ctx, color, assets.crayon, size, alpha);
        return;
      case 'METALLIC':
        applyMetallicLips(
          face,
          ctx,
          color,
          assets.metallicUpper,
          assets.metallicLower,
          size,
          alpha,
        );
        return;
    }
  }
}
