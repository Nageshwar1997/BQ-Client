// @vitest-environment jsdom
//
// Same reasoning as hair.smoke.test.ts's identical header - `applyLiquidNail` draws directly onto
// a real `CanvasRenderingContext2D`, which needs the `canvas` package (real Cairo-backed 2D
// rendering) since jsdom's own `HTMLCanvasElement.getContext` returns `null` otherwise.
//
// The side-effect import right below is *not* dead weight - see lip.smoke.test.ts's own comment
// on why an explicit reference has to exist somewhere or unused-dependency tooling could flag
// `canvas` as unused and someone acts on that, silently breaking every jsdom-backed test file.
import 'canvas';

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { describe, expect, it } from 'vitest';

import { createOffscreenCtx } from '@/utils/tryon-utils';

import { applyLiquidNail, getHandDetectionStatus } from './nail';

const DIMENSION = { width: 200, height: 200 };
const RGB: [number, number, number] = [180, 20, 90];
const ALPHA = 0.85;

const makeCtx = (): CanvasRenderingContext2D => {
  const ctx = createOffscreenCtx(DIMENSION);
  if (!ctx) throw new Error('2D context unavailable - is the `canvas` package installed?');
  return ctx;
};

const point = (x: number, y: number): NormalizedLandmark => ({ x, y, z: 0, visibility: 1 });

// A deterministic synthetic fixture, not a real HandLandmarker output - same "doesn't need real
// anatomical data for a smoke test that only checks doesn't-throw/paints-something" reasoning
// face.smoke.test.ts's fixture face and hair.smoke.test.ts's fixture mask already use. Index
// 0 (WRIST) and the MCP/PIP joints are left at a plausible filler position - `applyLiquidNail`
// only ever reads the near-joint/TIP pairs (`FINGER_TIP_JOINT_INDICES`), so only those 10 indices
// need real, distinct positions with a genuine direction between them.
const makeFixtureHand = (offsetX = 0): NormalizedLandmark[] => {
  const hand = new Array<NormalizedLandmark>(21).fill(point(0.5, 0.9));
  const withOffset = (x: number, y: number) => point(x + offsetX, y);

  hand[3] = withOffset(0.27, 0.7); // thumb IP
  hand[4] = withOffset(0.25, 0.6); // thumb TIP
  hand[7] = withOffset(0.4, 0.45); // index DIP
  hand[8] = withOffset(0.4, 0.3); // index TIP
  hand[11] = withOffset(0.5, 0.38); // middle DIP
  hand[12] = withOffset(0.5, 0.2); // middle TIP
  hand[15] = withOffset(0.6, 0.45); // ring DIP
  hand[16] = withOffset(0.6, 0.3); // ring TIP
  hand[19] = withOffset(0.68, 0.55); // pinky DIP
  hand[20] = withOffset(0.68, 0.42); // pinky TIP

  return hand;
};

// Same reasoning as face.smoke.test.ts's identical helper - confirms the fill actually painted
// *something*, not just "ran without throwing".
const countNonTransparentPixels = (ctx: CanvasRenderingContext2D): number => {
  const { data } = ctx.getImageData(0, 0, DIMENSION.width, DIMENSION.height);
  let count = 0;
  for (let i = 3; i < data.length; i += 4) {
    if ((data[i] ?? 0) > 0) count++;
  }
  return count;
};

describe('applyLiquidNail smoke test', () => {
  it('renders without throwing and paints at least one pixel for a detected hand', () => {
    const hands = [makeFixtureHand()];
    const ctx = makeCtx();

    expect(() => {
      applyLiquidNail({ hands, ctx, rgb: RGB, dimension: DIMENSION, alpha: ALPHA });
    }).not.toThrow();
    expect(countNonTransparentPixels(ctx)).toBeGreaterThan(0);
  });

  it('renders nothing (but does not throw) when no hands are detected', () => {
    const ctx = makeCtx();

    expect(() => {
      applyLiquidNail({ hands: [], ctx, rgb: RGB, dimension: DIMENSION, alpha: ALPHA });
    }).not.toThrow();
    expect(countNonTransparentPixels(ctx)).toBe(0);
  });

  it('paints more pixels for two detected hands than for one', () => {
    // Confirms every detected hand actually gets its own 5 nails drawn, not just the first one in
    // the array - `numHands: 2` (HandLandmarkerCache.ts) exists specifically so both hands can be
    // painted at once.
    const oneHandCtx = makeCtx();
    applyLiquidNail({
      hands: [makeFixtureHand()],
      ctx: oneHandCtx,
      rgb: RGB,
      dimension: DIMENSION,
      alpha: ALPHA,
    });

    const twoHandsCtx = makeCtx();
    // Second hand shifted well clear of the first (both in 0-1 normalized space) so their nails
    // don't overlap and cancel out in the pixel count.
    applyLiquidNail({
      hands: [makeFixtureHand(), makeFixtureHand(-0.4)],
      ctx: twoHandsCtx,
      rgb: RGB,
      dimension: DIMENSION,
      alpha: ALPHA,
    });

    expect(countNonTransparentPixels(twoHandsCtx)).toBeGreaterThan(
      countNonTransparentPixels(oneHandCtx),
    );
  });

  it('handles a horizontally-pointing finger (rotation math, not just the vertical fixture case)', () => {
    // The fixture hand above happens to have every finger pointing roughly "up" (mostly vertical
    // DIP->TIP vectors) - this pins down that the per-instance rotation itself works for a finger
    // pointing sideways too, not just the specific angle the fixture already covers.
    const sidewaysHand = new Array<NormalizedLandmark>(21).fill(point(0.5, 0.5));
    sidewaysHand[7] = point(0.3, 0.5); // index DIP
    sidewaysHand[8] = point(0.6, 0.5); // index TIP, directly to the right of DIP

    const ctx = makeCtx();
    expect(() => {
      applyLiquidNail({
        hands: [sidewaysHand],
        ctx,
        rgb: RGB,
        dimension: DIMENSION,
        alpha: ALPHA,
      });
    }).not.toThrow();
    expect(countNonTransparentPixels(ctx)).toBeGreaterThan(0);
  });
});

describe('getHandDetectionStatus', () => {
  it('returns "not-in-frame" when no hands are detected', () => {
    expect(getHandDetectionStatus([])).toBe('not-in-frame');
  });

  it('returns "detected" when at least one hand is detected', () => {
    expect(getHandDetectionStatus([makeFixtureHand()])).toBe('detected');
  });
});
