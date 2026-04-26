import type {
  changePasswordSchema,
  loginSchema,
  passwordsSchema,
  registerEmailSchema,
  registerOtpSchema,
  registerSchema,
  setPasswordSchema,
} from '@/schemas/user.schema';
import type { infer as zodInfer } from 'zod';

export type TRegisterOtp = zodInfer<typeof registerOtpSchema>;

export type TRegisterEmail = zodInfer<typeof registerEmailSchema>;

export type TPasswords = zodInfer<typeof passwordsSchema>;

export type TChangePassword = zodInfer<typeof changePasswordSchema>;

export type TLogin = zodInfer<typeof loginSchema>;

export type TRegister = zodInfer<typeof registerSchema>;

export type TSetPassword = zodInfer<typeof setPasswordSchema>;
