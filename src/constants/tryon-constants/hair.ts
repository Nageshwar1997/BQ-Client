import type { IRangeBounds } from '@/types/tryon-types';
import type { THairFinish } from '@/types/tryon-types/hair';

import type { ITryOnInstruction } from '.';

// Same shape/role as `FACE_RANGE_BOUNDS`/`LIP_RANGE_BOUNDS` - the intensity slider's bounds, one
// entry per finish. `Record<THairFinish, IRangeBounds>` needs every finish keyed regardless of
// which ones have dedicated rendering yet (see `UNSUPPORTED_HAIR_FINISHES`,
// classes/tryon/categories/hair/HairEngineBase.ts) - HIGHLIGHTS/HENNA/OMBRE's bounds below are a
// starting placeholder (same shape COLOR's own, since they currently render as COLOR's fallback),
// expected to get their own real values once each finish gets dedicated rendering.
export const HAIR_RANGE_BOUNDS: Record<THairFinish, IRangeBounds> = {
  // No reference equivalent (no reference implementation covers hair recolor at all - see
  // docs/tryons/HAIR-PLAN.md's Research section) - own judgment call. The `'color'` blend
  // composite (`applyColorHair`, utils/tryon-utils/hair.ts) already reads as a full recolor even
  // at a modest alpha (unlike a flat wash, it's not fighting the frame's own luminance for
  // visibility), so this doesn't need FOUNDATION's wide 0.1-0.8 range to read clearly - expected
  // to get real-device tuned once rendering, same as every other range in this app.
  COLOR: { min: 0.3, max: 1, default: 0.7 },
  HIGHLIGHTS: { min: 0.3, max: 1, default: 0.7 },
  HENNA: { min: 0.3, max: 1, default: 0.7 },
  OMBRE: { min: 0.3, max: 1, default: 0.7 },
};

// Category-wide fallback, deliberately NOT any one finish's own default above - same reasoning as
// `FACE_DEFAULT_RANGE`/`LIP_DEFAULT_RANGE`. Used only for the brief blank-slate moment before a
// real `type` is known (`HairEngineBase.getInitialState()`).
export const HAIR_DEFAULT_RANGE = 0.7;

/* ================= INSTRUCTIONS =================
 * Shown before a shopper picks/takes a photo - see `getTryOnInstructions` in `./index` for why
 * these are independent per category. HAIR's own real constraint: the segmentation model reads
 * hair from the photo/frame's own pixels (no landmark ring to fall back on), so anything that
 * obscures or disguises where the hair actually is - a hat, a hood, hair tucked out of frame -
 * genuinely breaks detection in a way FACE/LIP/EYE's landmark tracking doesn't have to worry about.
 */

export const HAIR_UPLOAD_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Good, even lighting - avoid backlight or heavy shadows' },
  { icon: 'solar:radial-blur-linear', text: 'Sharp and in focus, not blurry' },
  {
    icon: 'solar:user-rounded-linear',
    text: 'Hair fully visible - not tucked under a collar or cut off by the frame',
  },
  {
    icon: 'solar:cap-linear',
    text: 'No hat, hood, or scarf covering your hair',
  },
];

export const HAIR_LIVE_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Find good, even lighting - avoid strong backlight' },
  { icon: 'solar:user-rounded-linear', text: 'Keep your hair fully visible in frame' },
  {
    icon: 'solar:videocamera-record-linear',
    text: 'Hold still for a moment so the camera can find your hair clearly',
  },
  {
    icon: 'solar:cap-linear',
    text: 'Remove any hat, hood, or scarf covering your hair',
  },
];
