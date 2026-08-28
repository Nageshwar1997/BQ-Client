import type { TTryOnCategory } from '@beautinique/frontend-types';

// Category-agnostic Try-On constants - shared by every category's modal, not just LIP
// (compare to `tryon-lip.constants.ts`, which is LIP-specific rendering data).

// Preset stock-model photos a shopper can try a shade on without their own camera/photo.
// Matches the reference implementation's hardcoded `COSMETIC_MODEL_IMAGES` (same 6 assets,
// already present under public/images/try-on/models/).
export const TRYON_MODEL_IMAGES = [
  '/images/try-on/models/Central-Indian.webp',
  '/images/try-on/models/East-Indian.webp',
  '/images/try-on/models/North-Indian.webp',
  '/images/try-on/models/Northeast-Indian.webp',
  '/images/try-on/models/South-Indian.webp',
  '/images/try-on/models/West-Indian.webp',
];

export interface ITryOnInstruction {
  icon: string;
  text: string;
}

type TTryOnMode = 'live' | 'upload';

/* ================= PER-CATEGORY INSTRUCTIONS ==================================================
 * Shown before a shopper picks/takes a photo - in the sidebar's compact popover and the full
 * instructions screen - so they know what makes a try-on actually work well, before finding out
 * after a bad shot/frame gives a bad result.
 *
 * Deliberately one full, independent list per category rather than a shared base list every
 * category extends: each category's own try-on pipeline has its own real constraints, and those
 * don't generalize. FACE's full-face fill genuinely breaks on a turned head or hair falling
 * across the forehead in a way LIP's lip-only region never has to care about; a future NAIL flow
 * wouldn't need "face" advice at all. A shared base would either miss a category's actual
 * gotchas or hand every other category advice that doesn't apply to it. Independent lists do
 * mean the handful of genuinely universal tips (lighting, focus) get repeated per category - a
 * fine trade for each list staying accurate and independently editable, matching how this app
 * already keeps everything else category-specific in its own place (separate engine classes,
 * separate landmark-constants files, etc. per category).
 */

const LIP_UPLOAD_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Good, even lighting - avoid backlight or heavy shadows' },
  { icon: 'solar:radial-blur-linear', text: 'Sharp and in focus, not blurry' },
  {
    icon: 'solar:user-rounded-linear',
    text: 'Face fully visible and looking straight at the camera',
  },
  {
    icon: 'solar:glasses-linear',
    text: 'No sunglasses, masks, or heavy filters covering your face',
  },
];

const LIP_LIVE_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Find good, even lighting - avoid strong backlight' },
  { icon: 'solar:user-rounded-linear', text: 'Keep your face centered and clearly visible' },
  { icon: 'solar:videocamera-record-linear', text: 'Hold still and look straight at the camera' },
  {
    icon: 'solar:glasses-linear',
    text: 'Remove sunglasses, masks, or anything covering your face',
  },
];

// The last two tips here (facing the camera directly, hair off the forehead) exist specifically
// because of how FACE's full-face finishes render (see tryon-face.util.ts) - a turned head can
// project part of the face oval past what the camera actually sees (no true 3D/occlusion
// awareness), and there's no reliable way to tell hair from skin by color alone (see
// tryon-face.util.ts's own history) - so the shopper is asked for a good frame up front instead
// of the app trying to algorithmically fix a bad one after the fact.
const FACE_UPLOAD_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Good, even lighting - avoid backlight or heavy shadows' },
  { icon: 'solar:radial-blur-linear', text: 'Sharp and in focus, not blurry' },
  {
    icon: 'solar:user-rounded-linear',
    text: 'Face fully visible, facing the camera directly - not turned to the side',
  },
  {
    icon: 'solar:glasses-linear',
    text: 'No sunglasses, masks, or heavy filters covering your face',
  },
  {
    icon: 'solar:face-scan-circle-linear',
    text: 'Hair pulled back, away from your forehead and face',
  },
];

const FACE_LIVE_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Find good, even lighting - avoid strong backlight' },
  { icon: 'solar:user-rounded-linear', text: 'Keep your face centered and clearly visible' },
  {
    icon: 'solar:videocamera-record-linear',
    text: 'Hold still, facing the camera directly - not turned to the side',
  },
  {
    icon: 'solar:glasses-linear',
    text: 'Remove sunglasses, masks, or anything covering your face',
  },
  {
    icon: 'solar:face-scan-circle-linear',
    text: 'Pull hair back, away from your forehead and face',
  },
];

// Central registry - one entry per category that has a real try-on flow built (see `TRY_ON_MAP`
// in `@beautinique/frontend-types` for the full, eventual category list; only LIP/FACE exist
// today). `Partial` on purpose: a category without its own try-on flow yet has nothing real to
// give tips about - `getTryOnInstructions` falls back to an empty list rather than guessing.
const TRY_ON_INSTRUCTIONS: Partial<
  Record<TTryOnCategory, Record<TTryOnMode, ITryOnInstruction[]>>
> = {
  LIP: { upload: LIP_UPLOAD_INSTRUCTIONS, live: LIP_LIVE_INSTRUCTIONS },
  FACE: { upload: FACE_UPLOAD_INSTRUCTIONS, live: FACE_LIVE_INSTRUCTIONS },
};

export const getTryOnInstructions = (
  category: TTryOnCategory,
  mode: TTryOnMode,
): ITryOnInstruction[] => TRY_ON_INSTRUCTIONS[category]?.[mode] ?? [];

export const TRYON_MODE_OPTIONS = [
  {
    icon: 'solar:camera-linear',
    mode: 'live',
    title: 'Try it Live',
    description: 'Use your camera for a real-time try-on',
  },
  {
    icon: 'solar:gallery-send-linear',
    mode: 'upload',
    title: 'Upload Photo',
    description: 'Upload a photo for a static try-on',
  },
] as const;
