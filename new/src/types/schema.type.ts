import type {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  otpSchema,
  passwordsSchema,
  registerSchema,
  setPasswordSchema,
} from '@/schemas/user.schema';
import type { infer as zodInfer } from 'zod';

export type TOtp = zodInfer<typeof otpSchema>;

export type TEmail = zodInfer<typeof emailSchema>;

export type TPasswords = zodInfer<typeof passwordsSchema>;

export type TChangePassword = zodInfer<typeof changePasswordSchema>;

export type TLogin = zodInfer<typeof loginSchema>;

export type TRegister = zodInfer<typeof registerSchema>;

export type TSetPassword = zodInfer<typeof setPasswordSchema>;
