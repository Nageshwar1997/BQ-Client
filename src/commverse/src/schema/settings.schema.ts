import z from 'zod';
import { emailSchema } from './auth.schema';

const getPhotoSchema = (message: string) =>
  z
    .any()
    .optional()
    .refine(
      (val) => {
        if (val === null || val === undefined) return true;
        if (val instanceof File) return true;
        if (typeof val === 'string') return val.trim().length > 0;
        return false;
      },
      { message }
    );

export const profileSchema = z.object({
  photo: getPhotoSchema('Photo is required'),
  name: z.string().trim().min(1, 'Name is required'),
  email: emailSchema.shape.email,
  profession: z.string().trim().min(1, { message: 'Profession is required' }),
  language: z.string().trim().min(1, { message: 'Language is required' }),
});

export const linkSchema = z.object({
  link: z
    .string()
    .trim()
    .min(1, 'Link is required')
    .pipe(z.url({ message: 'Invalid URL' })),
});

const optionalLinkSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => {
      if (!val) return true;
      if (!val.includes('.')) return true; // handle
      try {
        const testUrl = val.includes('://') ? val : `https://${val}`;
        new URL(testUrl);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid URL' }
  );

const optionalBrandNameSchema = z
  .union([z.string().trim().min(1, 'Brand name is required'), z.literal('')])
  .optional();

const optionalEmailSchema = z
  .union([emailSchema.shape.email, z.literal('')])
  .optional();

const optionalBrandPhotoSchema = z
  .any()
  .optional()
  .refine(
    (val) => {
      if (val === null || val === undefined || val === '') return true;
      if (val instanceof File) return true;
      if (typeof val === 'string') return val.trim().length > 0;
      return false;
    },
    { message: 'Brand logo is required' }
  );

export const updateBrandProfileSchema = z.object({
  photo: optionalBrandPhotoSchema,
  name: optionalBrandNameSchema,
  email: optionalEmailSchema,
  instagram: optionalLinkSchema,
  facebook: optionalLinkSchema,
  x: optionalLinkSchema,
  tiktok: optionalLinkSchema,
  youtube: optionalLinkSchema,
  linkedin: optionalLinkSchema,
});

const uniqueColorSchema = z
  .array(
    z.object({
      value: z
        .string()
        .trim()
        .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, 'Invalid color format'),
    })
  )
  .refine(
    (arr) => new Set(arr.map((c) => c.value.toLowerCase())).size === arr.length,
    'Duplicate colors are not allowed'
  );

export const colorsSchema = z.object({
  brandColors: uniqueColorSchema,
  secondaryColors: uniqueColorSchema,
  otherColors: uniqueColorSchema,
});

export const typographySchema = z.object({
  link: linkSchema.shape.link.refine((val) => {
    try {
      const url = new URL(val);
      return (
        url.hostname === 'fonts.googleapis.com' &&
        (url.pathname.startsWith('/css') || url.pathname.startsWith('/css2')) &&
        url.searchParams.has('family')
      );
    } catch {
      return false;
    }
  }, 'Must be a valid Google Fonts CSS link'),
});

const getTagSchema = (tagName: string) =>
  z
    .array(
      z.object({
        value: z.string().trim().min(1, `${tagName} is required`),
      })
    )
    .refine(
      (arr) =>
        new Set(arr.map((c) => c.value.toLowerCase())).size === arr.length,
      `Duplicate ${tagName.toLowerCase()}s are not allowed`
    );

export const assetsSchema = z.object({
  photo: getPhotoSchema('Image is required'),
  name: z.string().trim().min(1, 'Name is required'),
  tags: getTagSchema('Tag').optional(),
});

export const brandVoiceValues = ['high', 'moderate', 'low'] as const;

const brandVoiceSchema = z.enum(brandVoiceValues, {
  message: 'Brand voice is required',
});

export const vibeSchema = z.object({
  brandArchetype: z.string().trim().min(1, 'Brand Archetype is required'),
  description: z.string().trim().min(1, 'Description is required'),
  brandVoice: z.object({
    confident: brandVoiceSchema,
    energetic: brandVoiceSchema,
    professional: brandVoiceSchema,
    trust: brandVoiceSchema,
    friendly: brandVoiceSchema,
    authority: brandVoiceSchema,
  }),
  writingStyle: z
    .array(
      z.object({
        styleName: z.string().trim().min(1, 'Style name is required'),
        instructions: z.string().trim().min(1, 'Instructions are required'),
        tags: z.string().trim().min(1, 'Tag is required'),
      })
    )
    .min(1, 'At least one writing style is required'),
  preferredTerms: getTagSchema('Preferred Term').min(1, {
    message: 'At least one preferred term is required',
  }),
  forbiddenTerms: getTagSchema('Forbidden Term').min(1, {
    message: 'At least one forbidden term is required',
  }),
});

const optionalBrandVoiceSchema = z
  .object({
    confident: brandVoiceSchema.optional(),
    energetic: brandVoiceSchema.optional(),
    professional: brandVoiceSchema.optional(),
    trust: brandVoiceSchema.optional(),
    friendly: brandVoiceSchema.optional(),
    authority: brandVoiceSchema.optional(),
  })
  .optional();

export const updateVibeSchema = z.object({
  brandArchetype: z.string().trim().optional(),
  description: z.string().trim().optional(),
  brandVoice: optionalBrandVoiceSchema,
  writingStyle: z
    .array(
      z.object({
        styleName: z.string().trim().min(1, 'Style name is required'),
        instructions: z.string().trim().min(1, 'Instructions are required'),
        tags: z.string().trim().min(1, 'Tag is required'),
      })
    )
    .optional(),
  preferredTerms: getTagSchema('Preferred Term').optional(),
  forbiddenTerms: getTagSchema('Forbidden Term').optional(),
});

const generalSchema = z.object({
  domains: z
    .array(
      z.object({
        value: z.string().trim().min(1, 'Domain is required'),
        // .refine(
        //   (val) =>
        //     /^[a-z0-9-]+$/.test(val.split('.commverse.studio')[0] || ''),
        //   'Domain must contain lowercase letters, numbers, and hyphens only'
        // )
        // .refine(
        //   (val) => val.endsWith('.commverse.studio'),
        //   'Domain must end with .commverse.studio'
        // ),
      })
    )
    .min(1, { message: 'At least one domain is required' })
    .refine(
      (arr) =>
        new Set(arr.map((c) => c.value.toLowerCase())).size === arr.length,
      { message: 'Duplicate domains are not allowed' }
    ),
  view: z.string().trim().min(1, { message: 'Who can view is required' }),
  currency: z.string().trim().min(1, { message: 'Base currency is required' }),
  title: z.string().trim().min(1, { message: 'Site title is required' }),
  language: z.string().trim().min(1, { message: 'Site language is required' }),
  description: z
    .string()
    .trim()
    .min(1, { message: 'Site description is required' }),
  lightFavicon: getPhotoSchema('Light favicon is required'),
  darkFavicon: getPhotoSchema('Dark favicon is required'),
  socialSharingImage: getPhotoSchema('Social sharing image is required'),
  googleAnalyticsId: z
    .string()
    .trim()
    .min(1, { message: 'Google analytics measurement id is required' })
    .startsWith('G-', {
      message: "Google analytics measurement id must start with 'G-'",
    })
    .refine((val) => val.length >= 8 && val.length <= 14, {
      message:
        'Google analytics measurement id must be between 8 and 14 characters',
    })
    .refine((val) => /^G-[A-Z0-9]+$/.test(val), {
      message:
        'Google analytics measurement id can only contain uppercase letters and numbers',
    }),
  enableCookies: z.boolean().default(false).optional(),
});

export const updateGeneralSchema = generalSchema.partial();
