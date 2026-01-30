import type z from 'zod';
import type { addressSchema, contactUsSchema, loginSchema, registerSchema } from '../schemas';
import type { addReviewSchema } from '../schemas/review.schema';

export type TLogin = z.infer<typeof loginSchema>;
export type TRegister = z.infer<typeof registerSchema>;
export type TAddress = z.infer<typeof addressSchema>;
export type TContactUs = z.infer<typeof contactUsSchema>;
export type TProduct = { title: string; brand: string };
export type TShade = { stock: number; shadeName: string };
export type TReview = z.infer<typeof addReviewSchema>;
