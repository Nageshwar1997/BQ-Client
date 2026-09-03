// @vitest-environment jsdom
//
// Same reasoning as lip.smoke.test.ts's identical header - `applyFoundationFace` calls
// `document.createElement('canvas')` internally (temp-canvas compositing), which needs a real
// `HTMLCanvasElement`/2D context that plain Node doesn't have. jsdom alone still isn't enough -
// its own `HTMLCanvasElement.getContext` returns `null` unless the `canvas` package (real
// Cairo-backed 2D rendering, already a devDependency for lip.smoke.test.ts) is present.
//
// The side-effect import right below is *not* dead weight - see lip.smoke.test.ts's own comment
// on why an explicit reference has to exist somewhere or unused-dependency tooling could flag
// `canvas` as unused and someone acts on that, silently breaking every jsdom-backed test file.
import 'canvas';

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { describe, expect, it } from 'vitest';

import {
  applyBlushFace,
  applyBronzerFace,
  applyConcealerFace,
  applyContourFace,
  applyFoundationFace,
  applyHighlighterFace,
} from './face';

// Same fixture-face approach as lip.smoke.test.ts (see its own comment) - a deterministic
// sunflower-seed spiral guarantees every index `applyFoundationFace` might read (face oval,
// eyes, eyebrows, mouth) resolves to a valid, distinct, in-bounds point, without needing real
// anatomical positions for a smoke test that only checks "doesn't throw, paints something".
const FACE_MESH_POINT_COUNT = 478;

const makeFixtureFace = (): NormalizedLandmark[] => {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: FACE_MESH_POINT_COUNT }, (_, i) => {
    const radius = 0.4 * Math.sqrt(i / FACE_MESH_POINT_COUNT);
    const theta = i * goldenAngle;
    return {
      x: 0.5 + radius * Math.cos(theta),
      y: 0.5 + radius * Math.sin(theta),
      z: 0,
      visibility: 1,
    };
  });
};

const DIMENSION = { width: 200, height: 200 };
const COLOR = 'rgba(200, 150, 120, 0.6)';
const ALPHA = 0.45;

const makeCtx = (): CanvasRenderingContext2D => {
  const canvas = document.createElement('canvas');
  canvas.width = DIMENSION.width;
  canvas.height = DIMENSION.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D context unavailable - is the `canvas` package installed?');
  return ctx;
};

// Same reasoning as lip.smoke.test.ts's identical helper - confirms the fill actually painted
// *something*, not just "ran without throwing" (a landmark-index typo making `face[index]`
// always `undefined` could still pass a throw-only check while silently rendering nothing).
const hasNonTransparentPixel = (ctx: CanvasRenderingContext2D): boolean => {
  const { data } = ctx.getImageData(0, 0, DIMENSION.width, DIMENSION.height);
  for (let i = 3; i < data.length; i += 4) {
    if ((data[i] ?? 0) > 0) return true;
  }
  return false;
};

describe('applyFoundationFace smoke test', () => {
  it('renders without throwing and paints at least one pixel', () => {
    const face = makeFixtureFace();
    const ctx = makeCtx();

    expect(() => {
      applyFoundationFace(face, ctx, COLOR, DIMENSION, ALPHA);
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });
});

describe('applyBlushFace smoke test', () => {
  it('renders without throwing and paints at least one pixel', () => {
    const face = makeFixtureFace();
    const ctx = makeCtx();
    const rgb: [number, number, number, number] = [200, 150, 120, 1];

    expect(() => {
      applyBlushFace(face, ctx, rgb, DIMENSION, ALPHA);
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });
});

describe('applyConcealerFace smoke test', () => {
  it('renders without throwing and paints at least one pixel', () => {
    const face = makeFixtureFace();
    const ctx = makeCtx();
    const rgb: [number, number, number, number] = [230, 190, 160, 1];

    expect(() => {
      applyConcealerFace(face, ctx, rgb, DIMENSION, ALPHA);
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });
});

describe('applyHighlighterFace smoke test', () => {
  it('renders without throwing and paints at least one pixel', () => {
    const face = makeFixtureFace();
    const ctx = makeCtx();
    const rgb: [number, number, number, number] = [255, 235, 205, 1];

    expect(() => {
      applyHighlighterFace(face, ctx, rgb, DIMENSION, ALPHA);
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });
});

describe('applyContourFace smoke test', () => {
  it('renders without throwing and paints at least one pixel', () => {
    const face = makeFixtureFace();
    const ctx = makeCtx();
    const rgb: [number, number, number, number] = [150, 100, 80, 1];

    expect(() => {
      applyContourFace(face, ctx, rgb, DIMENSION, ALPHA);
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });
});

describe('applyBronzerFace smoke test', () => {
  it('renders without throwing and paints at least one pixel', () => {
    const face = makeFixtureFace();
    const ctx = makeCtx();
    const rgb: [number, number, number, number] = [180, 130, 90, 1];

    expect(() => {
      applyBronzerFace(face, ctx, rgb, DIMENSION, ALPHA);
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(true);
  });
});
