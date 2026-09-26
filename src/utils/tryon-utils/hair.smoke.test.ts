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

import {
  applyColorHair,
  applyHennaHair,
  applyHighlightsHair,
  applyOmbreHair,
  getHairDetectionStatus,
} from './hair';

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

describe('applyHennaHair smoke test', () => {
  it('is the exact same function as applyColorHair (no separate color-math transform)', () => {
    // See applyHennaHair's own comment (hair.ts) - HENNA's "reddish-brown" comes from which real
    // product shade gets picked, not from a hardcoded hue baked into the render, so this is a
    // direct alias, not a wrapper - pinning that down so it can't silently drift into one later
    // without a deliberate decision.
    expect(applyHennaHair).toBe(applyColorHair);
  });

  it('renders without throwing and paints at least one pixel', () => {
    const mask = makeFixtureMask();
    const ctx = makeCtx();

    expect(() => {
      applyHennaHair({ mask, ctx, rgb: RGB, dimension: DIMENSION, alpha: ALPHA });
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });
});

describe('applyOmbreHair smoke test', () => {
  it('renders without throwing and paints at least one pixel', () => {
    const mask = makeFixtureMask();
    const ctx = makeCtx();

    expect(() => {
      applyOmbreHair({ mask, ctx, rgb: RGB, dimension: DIMENSION, alpha: ALPHA });
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });

  it('leaves the root mostly unrecolored while fully recoloring the tip', () => {
    // A full-height, full-confidence vertical strip - unlike the radial fixture above, this gives
    // the root (top row) and tip (bottom row) meaningfully different positions along the
    // root-to-tip gradient, which is exactly the behavior this test needs to distinguish.
    const stripMask: IHairMask = {
      data: new Float32Array(MASK_SIZE * MASK_SIZE).fill(1),
      width: MASK_SIZE,
      height: MASK_SIZE,
    };

    const NEUTRAL_GRAY: [number, number, number] = [150, 150, 150];
    const ctx = makeCtx();
    ctx.fillStyle = `rgb(${NEUTRAL_GRAY.join(',')})`;
    ctx.fillRect(0, 0, DIMENSION.width, DIMENSION.height);

    applyOmbreHair({ mask: stripMask, ctx, rgb: RGB, dimension: DIMENSION, alpha: 1 });

    const [rootR, rootG, rootB] = ctx.getImageData(100, 2, 1, 1).data;
    const [tipR, tipG, tipB] = ctx.getImageData(100, DIMENSION.height - 2, 1, 1).data;
    const [grayR, grayG, grayB] = NEUTRAL_GRAY;

    const distanceFromGray = (r: number, g: number, b: number) =>
      Math.hypot(r - grayR, g - grayG, b - grayB);

    // Root: still close to the original gray (the gradient's own alpha multiplier is ~0 there).
    expect(distanceFromGray(rootR ?? 0, rootG ?? 0, rootB ?? 0)).toBeLessThan(10);
    // Tip: clearly shifted toward the target color (multiplier ~1, same as a full COLOR recolor).
    expect(distanceFromGray(tipR ?? 0, tipG ?? 0, tipB ?? 0)).toBeGreaterThan(30);
  });
});

describe('applyHighlightsHair smoke test', () => {
  it('renders without throwing and paints at least one pixel', () => {
    const mask = makeFixtureMask();
    const ctx = makeCtx();

    expect(() => {
      applyHighlightsHair({ mask, ctx, rgb: RGB, dimension: DIMENSION, alpha: ALPHA });
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });

  it('produces a deterministic streak pattern - some columns recolored, others left alone', () => {
    // A fully-confident mask spanning the whole frame - unlike the radial fixture above, every
    // column starts at the same mask confidence, so any color variation across columns has to
    // come from the streak pattern itself, not from the mask's own shape.
    const fullMask: IHairMask = {
      data: new Float32Array(MASK_SIZE * MASK_SIZE).fill(1),
      width: MASK_SIZE,
      height: MASK_SIZE,
    };

    const NEUTRAL_GRAY: [number, number, number] = [150, 150, 150];
    const [grayR, grayG, grayB] = NEUTRAL_GRAY;
    const distanceFromGray = (r: number, g: number, b: number) =>
      Math.hypot(r - grayR, g - grayG, b - grayB);

    const ctx = makeCtx();
    ctx.fillStyle = `rgb(${NEUTRAL_GRAY.join(',')})`;
    ctx.fillRect(0, 0, DIMENSION.width, DIMENSION.height);

    applyHighlightsHair({ mask: fullMask, ctx, rgb: RGB, dimension: DIMENSION, alpha: 1 });

    const midRow = Math.floor(DIMENSION.height / 2);
    const distances: number[] = [];
    for (let x = 0; x < DIMENSION.width; x += 4) {
      const [r, g, b] = ctx.getImageData(x, midRow, 1, 1).data;
      distances.push(distanceFromGray(r ?? 0, g ?? 0, b ?? 0));
    }

    // Genuine streaks, not a uniform wash: some sampled columns stay close to the original gray
    // (between streaks) while others shift clearly toward the target color (a streak center) -
    // this is exactly what would fail if the pattern accidentally recolored every column equally.
    expect(Math.min(...distances)).toBeLessThan(10);
    expect(Math.max(...distances)).toBeGreaterThan(30);
  });

  it('is deterministic - the same mask size produces the exact same pattern every time', () => {
    // Two separate `applyHighlightsHair` calls (not shared state) - if this ever regressed to a
    // `Math.random()`-seeded pattern, this would flake instead of consistently pass, unlike a
    // genuinely fixed-seed pattern which reproduces pixel-for-pixel every time (see this file's
    // own top comment on why a per-frame-random pattern would flicker in Live mode).
    const mask = makeFixtureMask();

    const ctxA = makeCtx();
    applyHighlightsHair({ mask, ctx: ctxA, rgb: RGB, dimension: DIMENSION, alpha: ALPHA });

    const ctxB = makeCtx();
    applyHighlightsHair({ mask, ctx: ctxB, rgb: RGB, dimension: DIMENSION, alpha: ALPHA });

    expect(ctxA.getImageData(0, 0, DIMENSION.width, DIMENSION.height).data).toEqual(
      ctxB.getImageData(0, 0, DIMENSION.width, DIMENSION.height).data,
    );
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
