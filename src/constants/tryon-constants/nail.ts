import type { IRangeBounds } from '@/types/tryon-types';
import type { TNailFinish } from '@/types/tryon-types/nail';

import type { ITryOnInstruction } from '.';

// Hand landmark indices (into MediaPipe HandLandmarker's 21-point-per-hand skeleton) for the NAIL
// Try-On engine. Fresh design (no reference implementation covers nail try-on at all - see
// docs/tryons/NAIL-PLAN.md's Research section) - the indices below trace MediaPipe's own standard,
// publicly documented hand-landmark topology (wrist + 4 joints per finger), the same kind of
// public data `FACE_OVAL_INDICES` (constants/tryon-constants/face.ts) already draws on for its own
// mesh, not anything proprietary.

// Each finger's last two joints, in [nearer-to-palm, fingertip] order - `TIP` is the fingertip
// itself, the joint right before it is `DIP` for the four fingers or `IP` for the thumb (the thumb
// has one fewer joint than the others). A nail plate has no dedicated landmark of its own - every
// NAIL render function approximates its shape from this pair (see `NAIL_START_RATIO`/
// `NAIL_END_RATIO`/`NAIL_WIDTH_RATIO` below), the same "real landmark + geometric approximation"
// technique `FACE_OVAL_INDICES`'s own forehead extension or `CONCEALER_BLOB_WIDTH_RATIO`'s
// under-eye anchor already use elsewhere in this app.
export const FINGER_TIP_JOINT_INDICES: [nearJoint: number, tip: number][] = [
  [3, 4], // thumb: IP -> TIP
  [7, 8], // index: DIP -> TIP
  [11, 12], // middle: DIP -> TIP
  [15, 16], // ring: DIP -> TIP
  [19, 20], // pinky: DIP -> TIP
];

// Where the approximated nail shape starts/ends along its own [nearJoint -> TIP] segment, as a
// fraction of that segment's own length (0 = exactly at the near joint, 1 = exactly at the TIP
// landmark). A real nail plate starts roughly at the last knuckle crease and extends a little
// *past* the TIP landmark itself (the fingertip's own flesh, and then the nail's natural overhang,
// both continue beyond that single point) - `NAIL_END_RATIO > 1` is deliberate, not a typo.
export const NAIL_START_RATIO = 0.5;
export const NAIL_END_RATIO = 1.3;

// The nail shape's width (perpendicular to its own [nearJoint -> TIP] direction), as a fraction of
// that same segment's length - there's no dedicated "finger width" landmark to read this from
// directly, so it's derived from the one length measurement that *is* available. Expected to get
// real-device tuned once rendering, same as every other approximate ratio in this app.
export const NAIL_WIDTH_RATIO = 0.55;

// Same shape/role as `FACE_RANGE_BOUNDS`/`HAIR_RANGE_BOUNDS` - the intensity slider's bounds, one
// entry per finish.
export const NAIL_RANGE_BOUNDS: Record<TNailFinish, IRangeBounds> = {
  // No reference equivalent (no reference implementation covers nail try-on at all - see
  // docs/tryons/NAIL-PLAN.md's Research section) - own judgment call. Real nail polish reads as
  // fairly opaque even at a modest coat, unlike HAIR's translucent-strand recolor - a flat fill at
  // a mid-high default should already read as "painted", expected to get real-device tuned once
  // rendering.
  LIQUID: { min: 0.4, max: 1, default: 0.85 },
  GEL: { min: 0.4, max: 1, default: 0.85 },
  DIPPOWDER: { min: 0.4, max: 1, default: 0.85 },
  GLITTER: { min: 0.4, max: 1, default: 0.85 },
  CHROME: { min: 0.4, max: 1, default: 0.85 },
};

// Category-wide fallback, deliberately NOT any one finish's own default above - same reasoning as
// `FACE_DEFAULT_RANGE`/`HAIR_DEFAULT_RANGE`. Used only for the brief blank-slate moment before a
// real `type` is known (`NailEngineBase.getInitialState()`).
export const NAIL_DEFAULT_RANGE = 0.85;

/* ================= INSTRUCTIONS =================
 * Shown before a shopper picks/takes a photo - see `getTryOnInstructions` in `./index` for why
 * these are independent per category. NAIL's own real constraint: nails are only visible on the
 * *back* of the hand (dorsal side) - if the palm faces the camera, no nails are visible at all,
 * and hand landmarks alone can't reliably tell which side is showing (see docs/tryons/NAIL-PLAN.md's
 * Open question 1) - so the shopper is asked for the right hand orientation up front instead of
 * the app trying to algorithmically detect a bad one, the same "set the shopper up right" approach
 * FACE_UPLOAD_INSTRUCTIONS/HAIR_UPLOAD_INSTRUCTIONS already take for their own real constraints.
 */

export const NAIL_UPLOAD_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Good, even lighting - avoid backlight or heavy shadows' },
  { icon: 'solar:radial-blur-linear', text: 'Sharp and in focus, not blurry' },
  {
    icon: 'solar:hand-stars-linear',
    text: 'Back of your hand facing the camera - nails need to be visible, not your palm',
  },
  {
    icon: 'solar:widget-4-linear',
    text: 'Fingers spread apart a little, fully in frame',
  },
];

export const NAIL_LIVE_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Find good, even lighting - avoid strong backlight' },
  {
    icon: 'solar:hand-stars-linear',
    text: 'Show the back of your hand to the camera - nails need to be visible, not your palm',
  },
  {
    icon: 'solar:videocamera-record-linear',
    text: 'Hold your hand still for a moment so the camera can find your fingers clearly',
  },
  {
    icon: 'solar:widget-4-linear',
    text: 'Spread your fingers apart a little, fully in frame',
  },
];
