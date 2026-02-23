import type z from 'zod';

export type TLogin = z.infer<typeof loginSchema>;
export type TRegister = z.infer<typeof registerSchema>;
export type TAddress = z.infer<typeof addressSchema>;
export type TContactUs = z.infer<typeof contactUsSchema>;
export type TProduct = { title: string; brand: string };
export type TShade = { stock: number; shadeName: string };
export type TReview = z.infer<typeof addReviewSchema>;
export type TChangePassword = z.infer<typeof changePasswordSchema>;
export type TUpdatePassword = z.infer<typeof updatePasswordSchema>;
