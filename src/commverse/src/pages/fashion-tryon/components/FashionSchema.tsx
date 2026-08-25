import z from 'zod';

const fashionHexColorRegex = /^#([0-9A-Fa-f]{6})$/;
const requiredButtonFieldMessage = 'Button text/color is required';
const requiredButtonFieldSchema = z.preprocess(
  (value) => (value === undefined || value === null ? '' : value),
  z.string().trim().min(1, requiredButtonFieldMessage)
);

export const FashionVariantSchema = z.object({
  name: z.string().trim().min(1, 'Variant name is required'),
  hexColor: z.string().trim().regex(fashionHexColorRegex, 'Invalid hex color'),
});

export const FashionProductSchema = z.object({
  _id: z.string(),
  image: z.union([
    z.string(),
    z.file().mime(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ]),
  name: z.string().trim(),
  fileName: z.string().trim(),
  url: z
    .string()
    .trim()
    .refine(
      (value) => !value || /^https?:\/\/\S+$/i.test(value),
      'Enter a valid URL (e.g. https://example.com)'
    ),
  price: z.string(),
});

const FashionModelPhotoSchema = z.object({
  value: z.union([z.string(), z.instanceof(File)]),
});

const CTA_KEYS = ['try-on', 'buy-now', 'retry'] as const;
export type CtaKey = (typeof CTA_KEYS)[number];

const ctaButtonSchema = z.object({
  text: requiredButtonFieldSchema,
  buttonColor: requiredButtonFieldSchema,
  textColor: requiredButtonFieldSchema,
});

export const fashionTryOnSchema = z.object({
  title: z.string(),
  products: z.array(FashionProductSchema).nullable(),
  modelPhotos: z.array(FashionModelPhotoSchema).optional().default([]),
  type: z.enum(['top', 'bottom', 'dress']).nullable().optional(),
  downloadable: z.boolean(),
  compare: z.boolean(),
  photoUpload: z.boolean(),
  buyNowEnabled: z.boolean().default(true),
  cta: z.object({
    'try-on': ctaButtonSchema,
    'buy-now': ctaButtonSchema,
    retry: ctaButtonSchema,
  }),
  activeCta: z.enum(CTA_KEYS).default('try-on'),
  visibleIds: z.array(z.string()),
});
