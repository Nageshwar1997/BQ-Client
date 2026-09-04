import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import {
  EYELINER_PATTERN_TUNING,
  type IEyelinerPatternTuning,
  LEFT_EYE_LOWER_INDICES,
  LEFT_EYE_UPPER_INDICES,
  NOSE_TIP_INDEX,
  RIGHT_EYE_LOWER_INDICES,
  RIGHT_EYE_UPPER_INDICES,
  type TEyelinerPattern,
} from '@/constants/tryon-constants/eye';
import type { TDimension, TPoint } from '@/types/tryon-types';
import type { IEyeRenderParams } from '@/types/tryon-types/eye';
import { createOffscreenCtx, toColorString } from '@/utils/tryon-utils';

// EYE-specific canvas rendering - fresh design (not ported from any reference implementation,
// see docs/tryons/EYE-PLAN.md), built on the same primitives LIP/FACE already established
// (landmark-driven paths, native `ctx.filter` blur, an off-screen temp canvas composited once).
// EYELINER is the first finish built - see docs/tryons/EYELINER.md.

const toPoints = (face: NormalizedLandmark[], indices: number[], dimension: TDimension): TPoint[] =>
  indices
    .map((index) => face[index])
    .filter((point): point is NormalizedLandmark => point !== undefined)
    .map((point) => ({ x: point.x * dimension.width, y: point.y * dimension.height }));

// MediaPipe's own eye-ring indices aren't labeled "inner"/"outer" in a side-independent way (see
// LEFT_EYE_UPPER_INDICES's own comment) - this reorders an arc so it always runs inner (nasal)
// corner first, outer (temporal) corner last, regardless of which literal eye/side it came from,
// by comparing each end's distance to the nose tip. Every builder below assumes this ordering
// (width tapers thin->thick from index 0 toward the end, any wing extends off the *last* point).
const orderInnerToOuter = (
  points: TPoint[],
  face: NormalizedLandmark[],
  dimension: TDimension,
): TPoint[] => {
  const nose = face[NOSE_TIP_INDEX];
  const first = points[0];
  const last = points[points.length - 1];
  if (!nose || !first || !last) return points;

  const noseX = nose.x * dimension.width;
  return Math.abs(first.x - noseX) <= Math.abs(last.x - noseX) ? points : [...points].reverse();
};

// Real MediaPipe landmarks are already fairly densely spaced along the eyelid margin (unlike
// LIP/FACE's much sparser, more curved rings, which is why `traceSmoothClosedPath` there needs
// real quadratic-curve smoothing) - this just linearly subdivides between each pair for a
// smooth-enough per-pixel width taper, not smoothing away real angularity.
const densify = (points: TPoint[], samplesPerSegment: number): TPoint[] => {
  const first = points[0];
  if (points.length < 2 || !first) return points;
  const dense: TPoint[] = [first];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    if (!p0 || !p1) continue;
    for (let s = 1; s <= samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      dense.push({ x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t });
    }
  }
  return dense;
};

const centroid = (points: TPoint[]): TPoint => {
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
};

// Points away from the eye's own center, at `p` - deliberately NOT derived from the local path
// tangent (a rotate-the-tangent-90-degrees formula only points the right way for one specific
// path direction, and MediaPipe's left/right eye arcs run in *mirrored* directions - inner corner
// sits on the opposite side left vs right - so a fixed rotation sign would come out correct for
// one eye and inverted for the other). "Away from the eye's own centroid" is direction-agnostic:
// it always points outward (up, into the brow, for the upper lash line; down, away from the eye,
// for the lower one) regardless of which eye or which way its arc happens to be ordered.
const outwardNormal = (p: TPoint, center: TPoint): TPoint => {
  const dx = p.x - center.x;
  const dy = p.y - center.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
};

const fillTaperedPath = (
  ctx: CanvasRenderingContext2D,
  pts: TPoint[],
  center: TPoint,
  widthFn: (t: number) => number,
  color: string,
) => {
  const first = pts[0];
  if (!first) return;

  const outer = pts.map((p, i) => {
    const n = outwardNormal(p, center);
    const w = widthFn(i / (pts.length - 1));
    return { x: p.x + n.x * w, y: p.y + n.y * w };
  });

  ctx.beginPath();
  ctx.moveTo(first.x, first.y);
  outer.forEach((p) => {
    ctx.lineTo(p.x, p.y);
  });
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    if (p) ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

// A winged-liner flick sweeps up and out from the outer corner at a shallow angle, independent
// of exactly how the lash line's own tangent happens to be curving right at that corner.
// `horizontalSign` mirrors the whole wing for whichever eye this is - the outer corner sits on
// the opposite side of the face left vs right, so "out and away from the nose" is a *leftward*
// angle for one eye and *rightward* for the other; a fixed direction would only be correct for
// one of the two.
const buildWingPoints = (
  base: TPoint,
  {
    length,
    angleDeg,
    curveAmount,
    horizontalSign,
    steps = 24,
  }: {
    length: number;
    angleDeg: number;
    curveAmount: number;
    horizontalSign: number;
    steps?: number;
  },
): TPoint[] => {
  const angle = (angleDeg * Math.PI) / 180;
  const dirX = Math.cos(angle) * horizontalSign;
  const dirY = -Math.sin(angle); // canvas y grows downward, so "up" is negative
  // perpendicular to the wing's own direction, rotated toward "up" so the flick bulges into a
  // swoosh shape rather than straight-lining to its tip.
  let perpX = -dirY;
  let perpY = dirX;
  if (perpY > 0) {
    perpX = -perpX;
    perpY = -perpY;
  }

  const ctrlX = base.x + dirX * length * 0.5 + perpX * curveAmount;
  const ctrlY = base.y + dirY * length * 0.5 + perpY * curveAmount;
  const tipX = base.x + dirX * length;
  const tipY = base.y + dirY * length;

  const pts: TPoint[] = [];
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    pts.push({
      x: mt * mt * base.x + 2 * mt * t * ctrlX + t * t * tipX,
      y: mt * mt * base.y + 2 * mt * t * ctrlY + t * t * tipY,
    });
  }
  return pts;
};

// t=0..splitT covers the lash line (inner -> outer corner), t=splitT..1 covers a wing extension.
// Ramps base->peak across the lash line, then peak->tip across the wing.
const lashToWingWidth =
  (splitT: number, base: number, peak: number, tip: number) =>
  (t: number): number => {
    if (t <= splitT) return base + (t / splitT) * (peak - base);
    const wt = (t - splitT) / (1 - splitT);
    return peak * (1 - wt) + tip * wt;
  };

const renderEyelinerForEye = (
  tempCtx: CanvasRenderingContext2D,
  upperArc: TPoint[],
  lowerArc: TPoint[],
  pattern: TEyelinerPattern,
  color: string,
) => {
  const tuning = EYELINER_PATTERN_TUNING[pattern];
  const first = upperArc[0];
  const last = upperArc[upperArc.length - 1];
  if (!first || !last) return;

  const eyeWidth = Math.hypot(last.x - first.x, last.y - first.y);
  const horizontalSign = Math.sign(last.x - first.x) || 1;
  const center = centroid([...upperArc, ...lowerArc]);

  const lashPts = densify(upperArc, 10);
  let pts = lashPts;
  let widthFn: (t: number) => number;

  if (tuning.wing) {
    const wingBase = lashPts[lashPts.length - 1];
    if (!wingBase) return;
    const wingPts = buildWingPoints(wingBase, {
      length: eyeWidth * tuning.wing.lengthRatio,
      angleDeg: tuning.wing.angleDeg,
      curveAmount: eyeWidth * tuning.wing.curveRatio,
      horizontalSign,
    });
    pts = lashPts.concat(wingPts);
    const splitT = lashPts.length / pts.length;
    widthFn = lashToWingWidth(
      splitT,
      eyeWidth * tuning.baseWidthRatio,
      eyeWidth * tuning.peakWidthRatio,
      eyeWidth * tuning.tipWidthRatio,
    );
  } else {
    const base = eyeWidth * tuning.baseWidthRatio;
    const peak = eyeWidth * tuning.peakWidthRatio;
    widthFn = (t) => base + t * (peak - base);
  }

  if (tuning.blurRatio) {
    tempCtx.save();
    tempCtx.filter = `blur(${String(eyeWidth * tuning.blurRatio)}px)`;
    fillTaperedPath(tempCtx, pts, center, widthFn, color);
    tempCtx.restore();
  } else {
    fillTaperedPath(tempCtx, pts, center, widthFn, color);
  }

  if (tuning.secondWing) {
    const insetBase = lashPts[Math.round((lashPts.length - 1) * 0.86)];
    if (insetBase) {
      const wingPts = buildWingPoints(insetBase, {
        length: eyeWidth * tuning.secondWing.lengthRatio,
        angleDeg: tuning.secondWing.angleDeg,
        curveAmount: eyeWidth * tuning.secondWing.curveRatio,
        horizontalSign,
        steps: 16,
      });
      const secondPts = [insetBase, ...wingPts];
      const peakWidth = eyeWidth * tuning.peakWidthRatio;
      fillTaperedPath(
        tempCtx,
        secondPts,
        center,
        (t) => peakWidth * 0.7 * (1 - t) + eyeWidth * 0.003 * t,
        color,
      );
    }
  }

  if (tuning.underlinerWidthRatio && lowerArc.length >= 2) {
    const denseLower = densify(lowerArc, 10);
    const width = eyeWidth * tuning.underlinerWidthRatio;
    fillTaperedPath(tempCtx, denseLower, center, () => width, color);
  }
};

export const applyEyelinerEye = ({
  face,
  ctx,
  rgb,
  dimension,
  alpha,
  pattern,
}: IEyeRenderParams) => {
  // `pattern` is a plain `string` at this boundary (see `IEyeRenderParams`'s own comment on why -
  // different EYE finishes have different pattern sets) - genuinely possibly not a valid
  // `TEyelinerPattern` id (a stale/mismatched `state.pattern` value), so this indexes the lookup
  // as a generic dictionary rather than asserting the narrow type first, to keep this a real
  // runtime guard instead of a statically-always-true one `noUncheckedIndexedAccess` would trust
  // completely as soon as the key type itself claimed to be the closed `TEyelinerPattern` union.
  const tuning = (EYELINER_PATTERN_TUNING as Record<string, IEyelinerPatternTuning | undefined>)[
    pattern
  ];
  if (!tuning) return;

  const [r, g, b] = rgb;
  const color = toColorString(r, g, b, alpha);

  const leftUpper = orderInnerToOuter(
    toPoints(face, LEFT_EYE_UPPER_INDICES, dimension),
    face,
    dimension,
  );
  const leftLower = orderInnerToOuter(
    toPoints(face, LEFT_EYE_LOWER_INDICES, dimension),
    face,
    dimension,
  );
  const rightUpper = orderInnerToOuter(
    toPoints(face, RIGHT_EYE_UPPER_INDICES, dimension),
    face,
    dimension,
  );
  const rightLower = orderInnerToOuter(
    toPoints(face, RIGHT_EYE_LOWER_INDICES, dimension),
    face,
    dimension,
  );
  if (leftUpper.length < 2 || rightUpper.length < 2) return;

  const tempCtx = createOffscreenCtx(dimension);
  if (!tempCtx) return;

  renderEyelinerForEye(tempCtx, leftUpper, leftLower, pattern as TEyelinerPattern, color);
  renderEyelinerForEye(tempCtx, rightUpper, rightLower, pattern as TEyelinerPattern, color);

  ctx.drawImage(tempCtx.canvas, 0, 0);
};
