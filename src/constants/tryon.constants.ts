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
