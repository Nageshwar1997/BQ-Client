import {
  EMAIL_OPTIONS,
  NAME_OPTIONS,
  OTP_OPTIONS,
  PASSWORD_OPTIONS,
  PHONE_OPTIONS,
} from '@/constants/zod.constant';
import { appendCustomIssue, validateEnum, validateString } from '@/utils/zod.util';
import { object, type RefinementCtx } from 'zod';

const passwordMatchValidation = (
  data: { password: string; confirmPassword: string; oldPassword?: string },
  ctx: RefinementCtx,
) => {
  if (data.password !== data.confirmPassword) {
    appendCustomIssue(ctx, 'Passwords do not match', 'confirmPassword');
  }
  if ('oldPassword' in data && data.password === data.oldPassword) {
    appendCustomIssue(ctx, 'New password cannot be same as old password', 'password');
  }
};

const emailValidation = validateString(EMAIL_OPTIONS);

const otpValidation = validateString(OTP_OPTIONS);

const passwordValidation = validateString(PASSWORD_OPTIONS);

const confirmPasswordValidation = validateString({
  ...PASSWORD_OPTIONS,
  field: 'confirmPassword',
  label: 'Confirm Password',
});

const firstNameValidation = validateString({
  ...NAME_OPTIONS,
  field: 'firstName',
  label: 'First name',
});

const lastNameValidation = validateString({
  ...NAME_OPTIONS,
  field: 'lastName',
  label: 'Last name',
});

const phoneValidation = validateString(PHONE_OPTIONS);

export const otpSchema = object({ otp: otpValidation });

export const emailSchema = object({ email: emailValidation });

export const passwordsSchema = object({
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});

export const registerSchema = passwordsSchema
  .extend({
    firstName: firstNameValidation,
    lastName: lastNameValidation,
    phoneNumber: phoneValidation,
  })
  .superRefine(passwordMatchValidation);

export const loginSchema = object({
  loginMethod: validateEnum({
    enumValues: ['email', 'phoneNumber'],
    field: 'loginMethod',
    label: 'Login method',
  }),
  email: emailValidation.optional(),
  phoneNumber: phoneValidation.optional(),
  password: passwordValidation,
}).superRefine((data, ctx) => {
  if (data.loginMethod === 'email' && !data.email) {
    appendCustomIssue(ctx, 'Email is required', 'email');
  }
  if (data.loginMethod === 'phoneNumber' && !data.phoneNumber) {
    appendCustomIssue(ctx, 'Phone number is required', 'phoneNumber');
  }
});

export const setPasswordSchema = passwordsSchema.superRefine(passwordMatchValidation);

export const changePasswordSchema = passwordsSchema
  .extend({
    currentPassword: validateString({
      ...PASSWORD_OPTIONS,
      field: 'currentPassword',
      label: 'Current Password',
    }),
  })
  .superRefine(passwordMatchValidation);
