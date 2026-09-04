// @vitest-environment jsdom
//
// Same reasoning as face.smoke.test.ts/lip.smoke.test.ts's identical header - `applyEyelinerEye`
// calls `document.createElement('canvas')` internally (temp-canvas compositing, via
// `createOffscreenCtx`), which needs a real `HTMLCanvasElement`/2D context that plain Node
// doesn't have. jsdom alone still isn't enough - its own `HTMLCanvasElement.getContext` returns
// `null` unless the `canvas` package (real Cairo-backed 2D rendering, already a devDependency)
// is present.
//
// The side-effect import right below is *not* dead weight - see lip.smoke.test.ts's own comment
// on why an explicit reference has to exist somewhere or unused-dependency tooling could flag
// `canvas` as unused and someone acts on that, silently breaking every jsdom-backed test file.
import 'canvas';

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { describe, expect, it } from 'vitest';

import { EYELINER_PATTERNS } from '@/constants/tryon-constants/eye';
import { createOffscreenCtx } from '@/utils/tryon-utils';

import { applyEyelinerEye } from './eye';

// Same fixture-face approach as face.smoke.test.ts/lip.smoke.test.ts (see their own comments) -
// a deterministic sunflower-seed spiral guarantees every index any of these functions might read
// (both eye rings, nose tip) resolves to a valid, distinct, in-bounds point, without needing
// real anatomical positions for a smoke test that only checks "doesn't throw, paints something".
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
const RGB: [number, number, number] = [40, 30, 30];
const ALPHA = 0.8;

const hasNonTransparentPixel = (ctx: CanvasRenderingContext2D): boolean => {
  const { data } = ctx.getImageData(0, 0, DIMENSION.width, DIMENSION.height);
  for (let i = 3; i < data.length; i += 4) {
    if ((data[i] ?? 0) > 0) return true;
  }
  return false;
};

describe('applyEyelinerEye smoke test', () => {
  it.each(EYELINER_PATTERNS)(
    '$id pattern renders without throwing and paints at least one pixel',
    ({ id }) => {
      const face = makeFixtureFace();
      const ctx = createOffscreenCtx(DIMENSION);
      if (!ctx) throw new Error('2D context unavailable - is the `canvas` package installed?');

      expect(() => {
        applyEyelinerEye({ face, ctx, rgb: RGB, dimension: DIMENSION, alpha: ALPHA, pattern: id });
      }).not.toThrow();
      expect(hasNonTransparentPixel(ctx)).toBe(true);
    },
  );

  it('an unrecognized pattern id renders nothing rather than throwing', () => {
    const face = makeFixtureFace();
    const ctx = createOffscreenCtx(DIMENSION);
    if (!ctx) throw new Error('2D context unavailable - is the `canvas` package installed?');

    expect(() => {
      applyEyelinerEye({
        face,
        ctx,
        rgb: RGB,
        dimension: DIMENSION,
        alpha: ALPHA,
        pattern: 'NOT_A_REAL_PATTERN',
      });
    }).not.toThrow();
    expect(hasNonTransparentPixel(ctx)).toBe(false);
  });
});
