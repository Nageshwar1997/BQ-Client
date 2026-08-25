import { z } from 'zod';
import { POSSIBLE_TRYON_TYPES } from '../../../constants';

const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;

export const VariantSchema = z.object({
  name: z.string().trim().min(1, 'Variant name is required'),
  hexColor: z.string().trim().regex(hexColorRegex, 'Invalid hex color'),
});

export const PatternSchema = z.object({
  label: z.string().trim().min(1, 'Variant name is required'),
  icon: z.string().trim(),
  value: z.enum([
    ...POSSIBLE_TRYON_TYPES.eyeliner,
    ...POSSIBLE_TRYON_TYPES.kajal,
  ]),
});

export const tryOnSchema = z.object({
  variants: z
    .array(VariantSchema)
    .min(1, 'At least one variant is required')
    .max(15, 'You can add maximum 15 shades')
    .superRefine((variants, ctx) => {
      const nameSet = new Set<string>();
      const colorSet = new Set<string>();

      variants.forEach((variant, index) => {
        const nameKey = variant.name.toLowerCase();
        const colorKey = variant.hexColor.toLowerCase();

        if (nameSet.has(nameKey)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Duplicate variant name',
            path: [index, 'name'],
          });
        }

        if (colorSet.has(colorKey)) {
          ctx.addIssue({
            code: 'custom',
            message: 'Duplicate variant color',
            path: [index, 'hexColor'],
          });
        }

        nameSet.add(nameKey);
        colorSet.add(colorKey);
      });
    }),
  patterns: z.array(PatternSchema).nullable(),
  type: z
    .enum([
      ...POSSIBLE_TRYON_TYPES.lipstick,
      ...POSSIBLE_TRYON_TYPES.eyeliner,
      ...POSSIBLE_TRYON_TYPES.kajal,
    ])
    .nullable()
    .optional(),
  downloadable: z.boolean(),
  compare: z.boolean(),
  photoUpload: z.boolean(),
  title: z.string(),
});
