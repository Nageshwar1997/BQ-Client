import { z } from 'zod';
import { parsePhoneNumber } from 'react-phone-number-input';

export const indianPhoneNumberRegex = /^[6-9]\d{9}$/;

export const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and number'
    ),
});

export const loginSchema = emailSchema.extend({
  password: passwordSchema.shape.password,
});

export const otpSchema = z.object({
  otp: z.string().min(6, 'OTP must be 6 digits').max(6, 'OTP must be 6 digits'),
  email: emailSchema.shape.email,
});

const newPasswordBaseSchema = z.object({
  newPassword: passwordSchema.shape.password,
  confirmPassword: passwordSchema.shape.password,
});

export const newPasswordSchema = newPasswordBaseSchema.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

export const resetPasswordSchema = newPasswordSchema.extend({
  email: emailSchema.shape.email,
});

export const setPasswordSchema = z
  .object({
    email: emailSchema.shape.email,
    password: loginSchema.shape.password,
    confirmPassword: loginSchema.shape.password,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const phoneVerificationSocialLinksSchema = z.object({
  instagramUser: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || !val.trim()) return true;
        if (!val.includes('.') && !val.includes('://')) return false;
        try {
          const testUrl = val.includes('://') ? val : `https://${val}`;
          new URL(testUrl);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Must be a valid URL' }
    ),
  linkedinUser: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || !val.trim()) return true;
        if (!val.includes('.') && !val.includes('://')) return false;
        try {
          const testUrl = val.includes('://') ? val : `https://${val}`;
          new URL(testUrl);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'Must be a valid URL' }
    ),
});

export const phoneNumberSchema = z
  .string()
  .trim()
  .regex(indianPhoneNumberRegex, 'Please enter a valid 10-digit phone number');

export const isPhoneNumberValid = (countryCode: string, phoneNumber: string) => {
  const parsed = parsePhoneNumber(`${countryCode}${phoneNumber}`.replace(/\s+/g, ''));
  return parsed?.isValid() ?? false;
};
