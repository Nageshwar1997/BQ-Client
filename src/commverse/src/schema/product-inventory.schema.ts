import { z } from 'zod';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const productIdRegex = /^[a-zA-Z0-9_-]+$/;
const priceRegex = /^\d+(\.\d{1,2})?$/;

const assetItemSchema = z.object({
  file: z.any(),
  url: z.string().trim().min(1, 'Asset URL is required'),
  name: z.string().trim().min(1, 'Asset name is required'),
  type: z.enum(['image', 'video', 'model']),
  sizeBytes: z.number().nonnegative().optional(),
  key: z.string().trim().optional(),
  assetId: z.string().trim().optional(),
  thumbnailUrl: z.string().trim().optional(),
  spriteFile: z.any().optional(),
  thumbnailFile: z.any().optional(),
});

const editionSchema = z.object({
  name: z.string().trim(),
  imageUrl: z.string().trim(),
  color: z.string().trim(),
});

const variantSchema = z
  .object({
    selectedType: z.enum(['colour', 'texture', 'size', 'other'], {
      message: 'Variant type is required',
    }),
    activeTabId: z.enum(['image', 'pipette']),
    editions: z.array(editionSchema).min(1, 'At least one edition is required'),
    customType: z.string().optional(),
  })
  .superRefine((variant, ctx) => {
    if (variant.selectedType === 'other' && !variant.customType?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['customType'],
        message: 'Custom variant type is required',
      });
    }

    variant.editions.forEach((edition, index) => {
      if (!edition.name.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['editions', index, 'name'],
          message: 'Edition name is required',
        });
      }

      if (variant.activeTabId === 'image' && !edition.imageUrl.trim()) {
        ctx.addIssue({
          code: 'custom',
          path: ['editions', index, 'imageUrl'],
          message: 'Edition image is required',
        });
      }

      if (
        variant.activeTabId === 'pipette' &&
        !hexColorRegex.test(edition.color)
      ) {
        ctx.addIssue({
          code: 'custom',
          path: ['editions', index, 'color'],
          message: 'Enter a valid hex color (e.g., #FF5733)',
        });
      }
    });
  });

export const productInventorySchema = z.object({
  productName: z.string().trim().min(1, 'Product name is required'),
  productId: z
    .string()
    .trim()
    .min(1, 'Product ID is required')
    .regex(
      productIdRegex,
      'Product ID can only contain letters, numbers, underscores, and hyphens'
    ),
  categoryId: z
    .string()
    .nullable()
    .refine((value) => !!value?.trim(), 'Category is required'),
  subCategoryId: z.string().nullable().optional(),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .regex(priceRegex, 'Enter a valid price (e.g., 99.99)'),
  productDescription: z.string().trim().optional().or(z.literal('')),
  productSlug: z.string().trim().min(1, 'Slug is required'),
  productLink: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (value) => !value || /^https?:\/\/\S+$/i.test(value),
      'Enter a valid URL (e.g., https://example.com)'
    ),
  media: z
    .object({
      images: z.array(assetItemSchema),
      videos: z.array(assetItemSchema),
      models: z.array(assetItemSchema),
    })
    .refine(
      (media) =>
        media.images.length + media.videos.length + media.models.length > 0,
      'At least one asset is required'
    ),
  variants: z.array(variantSchema).optional().default([]),
});
