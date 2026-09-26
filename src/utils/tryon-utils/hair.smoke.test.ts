// @vitest-environment jsdom
//
// Same reasoning as face.smoke.test.ts's identical header - `applyColorHair` calls
// `document.createElement('canvas')` internally (temp-canvas compositing), which needs a real
// `HTMLCanvasElement`/2D context that plain Node doesn't have. jsdom alone still isn't enough -
// its own `HTMLCanvasElement.getContext` returns `null` unless the `canvas` package (real
// Cairo-backed 2D rendering, already a devDependency for lip.smoke.test.ts) is present.
//
// The side-effect import right below is *not* dead weight - see lip.smoke.test.ts's own comment
// on why an explicit reference has to exist somewhere or unused-dependency tooling could flag
// `canvas` as unused and someone acts on that, silently breaking every jsdom-backed test file.
import 'canvas';

import { describe, expect, it } from 'vitest';

import type { IHairMask } from '@/types/tryon-types/hair';
import { createOffscreenCtx } from '@/utils/tryon-utils';

import { applyColorHair, getHairDetectionStatus } from './hair';

const DIMENSION = { width: 200, height: 200 };
const RGB: [number, number, number] = [140, 60, 30];
const ALPHA = 0.7;

// Same "deterministic synthetic fixture, not real anatomical/model data" approach as
// face.smoke.test.ts's fixture face - a radial confidence falloff (solid center, fading to 0 at
// the edges) exercises `applyColorHair`'s full alpha range (some pixels above, some below, some
// at the detection threshold) without needing a real segmenter output for a smoke test that only
// checks "doesn't throw, paints something".
const MASK_SIZE = 64;

const makeFixtureMask = (): IHairMask => {
  const data = new Float32Array(MASK_SIZE * MASK_SIZE);
  const center = (MASK_SIZE - 1) / 2;
  const maxRadius = Math.SQRT2 * center;

  for (let y = 0; y < MASK_SIZE; y++) {
    for (let x = 0; x < MASK_SIZE; x++) {
      const distance = Math.hypot(x - center, y - center);
      data[y * MASK_SIZE + x] = Math.max(0, 1 - distance / maxRadius);
    }
  }

  return { data, width: MASK_SIZE, height: MASK_SIZE };
};

const makeCtx = (): CanvasRenderingContext2D => {
  const ctx = createOffscreenCtx(DIMENSION);
  if (!ctx) throw new Error('2D context unavailable - is the `canvas` package installed?');
  return ctx;
};

// Same reasoning as face.smoke.test.ts's identical helper - confirms the fill actually painted
// *something*, not just "ran without throwing".
const hasNonTransparentPixel = (ctx: CanvasRenderingContext2D): boolean => {
  const { data } = ctx.getImageData(0, 0, DIMENSION.width, DIMENSION.height);
  for (let i = 3; i < data.length; i += 4) {
    if ((data[i] ?? 0) > 0) return true;
  }
  return false;
};

describe('applyColorHair smoke test', () => {
  it('renders without throwing and paints at least one pixel', () => {
    const mask = makeFixtureMask();
    const ctx = makeCtx();

    expect(() => {
      applyColorHair({ mask, ctx, rgb: RGB, dimension: DIMENSION, alpha: ALPHA });
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });
});

describe('getHairDetectionStatus', () => {
  it('returns "not-in-frame" for a null mask', () => {
    expect(getHairDetectionStatus(null)).toBe('not-in-frame');
  });

  it('returns "not-in-frame" for a mask with no confident hair pixels', () => {
    const mask: IHairMask = { data: new Float32Array(100), width: 10, height: 10 };
    expect(getHairDetectionStatus(mask)).toBe('not-in-frame');
  });

  it('returns "detected" for a mask with enough confident hair pixels', () => {
    expect(getHairDetectionStatus(makeFixtureMask())).toBe('detected');
  });
});
