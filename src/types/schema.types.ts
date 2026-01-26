import type z from 'zod';
import type { addressSchema, contactUsSchema, loginSchema, registerSchema } from '../schemas';

export type TLogin = z.infer<typeof loginSchema>;
export type TRegister = z.infer<typeof registerSchema>;
export type TAddress = z.infer<typeof addressSchema>;
export type TContactUs = z.infer<typeof contactUsSchema>;
