import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

import {
  EYELINER_PATTERN_TUNING,
  type IEyeStrokePatternTuning,
  KAJAL_PATTERN_TUNING,
  LEFT_EYE_LOWER_INDICES,
  LEFT_EYE_UPPER_INDICES,
  NOSE_TIP_INDEX,
  RIGHT_EYE_LOWER_INDICES,
  RIGHT_EYE_UPPER_INDICES,
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

const midpoint = (a: TPoint, b: TPoint): TPoint => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

// Real MediaPipe landmarks are fairly densely spaced along the eyelid margin, but a *linear*
// subdivision between them (an earlier version of this) still kinks sharply exactly at each of
// the 9 original landmark points, especially visible at wider widths (Bold/Thick, Smokey) -
// subdividing a straight segment more finely doesn't round it, it just adds colinear points.
// Same quadratic-curve-through-midpoints technique `traceSmoothClosedPath` (face.ts/lip.ts)
// already uses for exactly this reason, adapted for an *open* path - the smoothing happens
// between interior points; the real first/last points (the actual corners the rest of this file
// keys off - `orderInnerToOuter`'s ends, the wing's own base) stay exact, not shifted to a
// midpoint.
const smoothOpenPath = (points: TPoint[], samplesPerSegment: number): TPoint[] => {
  const first = points[0];
  if (points.length < 3 || !first) return points;

  const dense: TPoint[] = [first];
  let current = first;

  for (let i = 0; i < points.length - 1; i++) {
    const control = points[i + 1];
    const afterControl = points[i + 2];
    if (!control) continue;
    // Last segment: land exactly on the real final point instead of a midpoint, same reasoning
    // as keeping the first point exact above.
    const end = afterControl ? midpoint(control, afterControl) : control;

    for (let s = 1; s <= samplesPerSegment; s++) {
      const t = s / samplesPerSegment;
      const mt = 1 - t;
      dense.push({
        x: mt * mt * current.x + 2 * mt * t * control.x + t * t * end.x,
        y: mt * mt * current.y + 2 * mt * t * control.y + t * t * end.y,
      });
    }
    current = end;
  }
  return dense;
};

const centroid = (points: TPoint[]): TPoint => {
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
};

// The width-offset direction at every point of `pts` - perpendicular to the path's own *local*
// travel direction (so it stays correctly perpendicular everywhere along a curving path,
// including out on a wing, where "away from the eye's centroid" and "perpendicular to the wing"
// can point in visibly different directions the further the wing travels). The rotate-a-tangent-
// 90-degrees step alone isn't enough on its own, though: MediaPipe's left/right eye arcs run in
// *mirrored* directions, so a fixed rotation sign comes out correct for one eye and inverted for
// the other - and re-deciding the sign independently at *every* point by testing against the
// centroid (an earlier version of this) turned out unreliable far out on the wing, where a
// point's own direction from the centroid stops reliably matching "which side is outward" -
// causing the sign to flip mid-wing, self-intersecting the filled polygon into what looked like
// a gap between the lash-line part and a disconnected wing fragment.
//
// Fixed by deciding the sign only *once*, from the centroid, at the path's own first point - then
// propagating it by continuity: each subsequent point's normal is whichever of the two
// perpendicular candidates stays closest (by dot product) to the *previous* point's own chosen
// normal, never re-derived from the centroid again. A smoothly rotating direction field along the
// path, the same "parallel transport" idea a proper curve-offset implementation would use,
// instead of a per-point test that can disagree with its neighbors.
const outwardNormalsAlongPath = (pts: TPoint[], center: TPoint): TPoint[] => {
  const normals: TPoint[] = [];
  let prev: TPoint | null = null;

  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const p = pts[i];
    if (!a || !b || !p) {
      normals.push(prev ?? { x: 0, y: -1 });
      continue;
    }

    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    let nx = -dy / len;
    let ny = dx / len;

    if (prev) {
      if (nx * prev.x + ny * prev.y < 0) {
        nx = -nx;
        ny = -ny;
      }
    } else {
      const towardX = p.x - center.x;
      const towardY = p.y - center.y;
      if (nx * towardX + ny * towardY < 0) {
        nx = -nx;
        ny = -ny;
      }
    }

    prev = { x: nx, y: ny };
    normals.push(prev);
  }

  return normals;
};

// Fills the tapered ribbon as a chain of small quads (one per adjacent point pair) instead of one
// single polygon that walks all the way out along the offset edge and all the way back along the
// path. That single-polygon approach is a textbook offset-curve trap: wherever the path bends
// tighter than the offset width being applied there (exactly what a wing's sharp launch off the
// lash line does at its tightest patterns), the outer edge crosses itself - and a single filled
// path that crosses itself can render as visually disconnected lobes with a gap between them,
// which is what the "wing not attached" reports kept showing, on whichever eye's own real corner
// geometry happened to bend sharply enough in a given photo (a bilateral-symmetric synthetic
// fixture never reproduced it, since it never got a real bend that sharp on either side).
//
// Every quad here is wound the same rotational direction (path point i -> i+1 -> that point's own
// outer offset -> back), so even where two quads overlap each other (the tight-bend case above),
// the canvas's nonzero winding fill rule keeps that overlap solid instead of canceling it to a
// gap - and because it's still one `fill()` call across every quad, the color's own alpha still
// only blends once, not per-quad.
const fillTaperedPath = (
  ctx: CanvasRenderingContext2D,
  pts: TPoint[],
  center: TPoint,
  widthFn: (t: number) => number,
  color: string,
) => {
  if (pts.length < 2) return;

  const normals = outwardNormalsAlongPath(pts, center);
  const outer = pts.map((p, i) => {
    const n = normals[i] ?? { x: 0, y: -1 };
    const w = widthFn(i / (pts.length - 1));
    return { x: p.x + n.x * w, y: p.y + n.y * w };
  });

  ctx.beginPath();
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const o0 = outer[i];
    const o1 = outer[i + 1];
    if (!p0 || !p1 || !o0 || !o1) continue;
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(o1.x, o1.y);
    ctx.lineTo(o0.x, o0.y);
    ctx.closePath();
  }
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

// Generic per-eye orchestration for the shared tapered-stroke primitive - takes an already-
// resolved tuning object rather than a finish-specific pattern id, so it has no idea whether
// EYELINER or KAJAL (or any future finish reusing this) is the one calling it. `primaryArc` is
// whichever arc this finish actually decorates (EYELINER's upper lash line, KAJAL's lower lash
// line/waterline - see KAJAL_PATTERN_TUNING's own comment on why that's the only structural
// difference between the two); `secondaryArc` is only read for `tuning.underlinerWidthRatio`
// (EYELINER's Underliner pattern only - KAJAL's own tuning table never sets that field, so this
// parameter is simply unused whenever `applyKajalEye` calls in).
const renderTaperedStrokeForEye = (
  tempCtx: CanvasRenderingContext2D,
  primaryArc: TPoint[],
  secondaryArc: TPoint[],
  tuning: IEyeStrokePatternTuning,
  color: string,
) => {
  const first = primaryArc[0];
  const last = primaryArc[primaryArc.length - 1];
  if (!first || !last) return;

  const eyeWidth = Math.hypot(last.x - first.x, last.y - first.y);
  const horizontalSign = Math.sign(last.x - first.x) || 1;
  const center = centroid([...primaryArc, ...secondaryArc]);

  const lashPts = smoothOpenPath(primaryArc, 10);
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

  if (tuning.underlinerWidthRatio && secondaryArc.length >= 2) {
    const denseSecondary = smoothOpenPath(secondaryArc, 10);
    const width = eyeWidth * tuning.underlinerWidthRatio;
    fillTaperedPath(tempCtx, denseSecondary, center, () => width, color);
  }
};

// Both eyes' upper+lower arcs, ordered inner-to-outer - shared setup every `apply<Finish>Eye`
// entry point below needs, regardless of which arc it ends up treating as "primary".
const getOrderedEyeArcs = (face: NormalizedLandmark[], dimension: TDimension) => ({
  leftUpper: orderInnerToOuter(toPoints(face, LEFT_EYE_UPPER_INDICES, dimension), face, dimension),
  leftLower: orderInnerToOuter(toPoints(face, LEFT_EYE_LOWER_INDICES, dimension), face, dimension),
  rightUpper: orderInnerToOuter(
    toPoints(face, RIGHT_EYE_UPPER_INDICES, dimension),
    face,
    dimension,
  ),
  rightLower: orderInnerToOuter(
    toPoints(face, RIGHT_EYE_LOWER_INDICES, dimension),
    face,
    dimension,
  ),
});

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
  const tuning = (EYELINER_PATTERN_TUNING as Record<string, IEyeStrokePatternTuning | undefined>)[
    pattern
  ];
  if (!tuning) return;

  const [r, g, b] = rgb;
  const color = toColorString(r, g, b, alpha);

  const { leftUpper, leftLower, rightUpper, rightLower } = getOrderedEyeArcs(face, dimension);
  if (leftUpper.length < 2 || rightUpper.length < 2) return;

  const tempCtx = createOffscreenCtx(dimension);
  if (!tempCtx) return;

  // EYELINER decorates the upper lash line - the lower arc is only read for its own Underliner
  // pattern's second pass.
  renderTaperedStrokeForEye(tempCtx, leftUpper, leftLower, tuning, color);
  renderTaperedStrokeForEye(tempCtx, rightUpper, rightLower, tuning, color);

  ctx.drawImage(tempCtx.canvas, 0, 0);
};

export const applyKajalEye = ({ face, ctx, rgb, dimension, alpha, pattern }: IEyeRenderParams) => {
  // Same safe-lookup reasoning as `applyEyelinerEye` above, against KAJAL's own tuning table -
  // `pattern` genuinely could be an EYELINER id here (a stale `state.pattern` left over from
  // switching finishes without picking a new pattern yet), which must render nothing rather than
  // silently reusing EYELINER's own tuning for a KAJAL pick.
  const tuning = (KAJAL_PATTERN_TUNING as Record<string, IEyeStrokePatternTuning | undefined>)[
    pattern
  ];
  if (!tuning) return;

  const [r, g, b] = rgb;
  const color = toColorString(r, g, b, alpha);

  const { leftUpper, leftLower, rightUpper, rightLower } = getOrderedEyeArcs(face, dimension);
  if (leftLower.length < 2 || rightLower.length < 2) return;

  const tempCtx = createOffscreenCtx(dimension);
  if (!tempCtx) return;

  // KAJAL decorates the lower lash line/waterline instead - primary/secondary swapped relative to
  // `applyEyelinerEye`. KAJAL_PATTERN_TUNING never sets `underlinerWidthRatio`, so the upper arc
  // passed as `secondaryArc` here is simply never read.
  renderTaperedStrokeForEye(tempCtx, leftLower, leftUpper, tuning, color);
  renderTaperedStrokeForEye(tempCtx, rightLower, rightUpper, tuning, color);

  ctx.drawImage(tempCtx.canvas, 0, 0);
};
