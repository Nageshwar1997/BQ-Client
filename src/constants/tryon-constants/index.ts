import type { TTryOnCategory } from '@beautinique/frontend-types';

import { FACE_LIVE_INSTRUCTIONS, FACE_UPLOAD_INSTRUCTIONS } from './face';
import { LIP_LIVE_INSTRUCTIONS, LIP_UPLOAD_INSTRUCTIONS } from './lip';

// Category-agnostic Try-On constants - shared by every category's modal, not just LIP (compare
// to `./lip.ts`, which is LIP-specific rendering data - every other category has its own
// same-shaped file alongside it in this folder).

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
 * Deliberately one full, independent list per category (defined in that category's own file -
 * `./lip.ts`'s `LIP_UPLOAD_INSTRUCTIONS`/`LIP_LIVE_INSTRUCTIONS`, `./face.ts`'s equivalents)
 * rather than a shared base list every category extends: each category's own try-on pipeline has
 * its own real constraints, and those don't generalize. FACE's full-face fill genuinely breaks
 * on a turned head or hair falling across the forehead in a way LIP's lip-only region never has
 * to care about; a future NAIL flow wouldn't need "face" advice at all. A shared base would
 * either miss a category's actual gotchas or hand every other category advice that doesn't apply
 * to it. Independent lists do mean the handful of genuinely universal tips (lighting, focus) get
 * repeated per category - a fine trade for each list staying accurate and independently
 * editable, matching how this app already keeps everything else category-specific in its own
 * place (separate engine classes, separate landmark-constants files, etc. per category).
 *
 * This file only wires those category-owned lists together into one lookup - it doesn't define
 * any instruction text itself.
 */

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
