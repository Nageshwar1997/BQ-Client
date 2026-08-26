// Category-agnostic Try-On constants - shared by every category's modal, not just LIP
// (compare to `tryon-lip.constants.ts`, which is LIP-specific rendering data).

// Preset stock-model photos a shopper can try a shade on without their own camera/photo.
// Matches the reference implementation's hardcoded `COSMETIC_MODEL_IMAGES` (same 6 assets,
// already present under public/images/try-on/models/).
export const TRYON_MODEL_IMAGES = [
  '/images/try-on/models/1.webp',
  '/images/try-on/models/2.webp',
  '/images/try-on/models/3.webp',
  '/images/try-on/models/4.webp',
  '/images/try-on/models/5.webp',
  '/images/try-on/models/6.webp',
];

export interface ITryOnInstruction {
  icon: string;
  text: string;
}

// Shown before a shopper picks/takes a photo - in the sidebar's compact popover and the full
// instructions screen - so they know what makes a try-on actually work well, before finding
// out after a bad shot/frame gives a bad result.
export const UPLOAD_INSTRUCTIONS: ITryOnInstruction[] = [
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

export const LIVE_INSTRUCTIONS: ITryOnInstruction[] = [
  { icon: 'solar:sun-2-linear', text: 'Find good, even lighting - avoid strong backlight' },
  { icon: 'solar:user-rounded-linear', text: 'Keep your face centered and clearly visible' },
  { icon: 'solar:videocamera-record-linear', text: 'Hold still and look straight at the camera' },
  {
    icon: 'solar:glasses-linear',
    text: 'Remove sunglasses, masks, or anything covering your face',
  },
];

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
