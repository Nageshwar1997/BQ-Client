import { boolean, literal, object } from 'zod';
import { zodCustomIssue, zodEnum, zodSingleFileOrUrl, zodString } from '@/Utils/Zod.util';
import {
  emailValidation,
  firstNameValidation,
  lastNameValidation,
  passwordValidation,
  phoneNumberValidation,
} from './Common.schema';
import { otpValidationOptions, passwordValidationOptions } from '@/Constants';

export const registerSchema = object({
  profilePic: zodSingleFileOrUrl({
    field: 'profilePic',
    label: 'Profile Pic',
    required: true,
  }),
  otp: zodString(otpValidationOptions),
  firstName: firstNameValidation,
  lastName: lastNameValidation,
  email: emailValidation,
  phoneNumber: phoneNumberValidation,
  password: passwordValidation,
  confirmPassword: zodString({
    ...passwordValidationOptions,
    field: 'confirmPassword',
    label: 'Confirm Password',
  }),
  remember: boolean().optional().default(false),
});

export const loginSchema = object({
  loginMethod: zodEnum({
    field: 'loginMethod',
    label: 'Login method',
    enumValues: ['email', 'phoneNumber'],
  }),
  email: registerSchema.shape.email.optional().or(literal(undefined)),
  phoneNumber: registerSchema.shape.phoneNumber.optional().or(literal(undefined)),
  password: registerSchema.shape.password,
  remember: registerSchema.shape.remember,
}).superRefine((data, ctx) => {
  if (data.loginMethod === 'email') {
    if (!data.email || data.email?.trim() === '') {
      zodCustomIssue(ctx, 'Email is required.', data.loginMethod);
    }
  }
  if (data.loginMethod === 'phoneNumber') {
    if (!data.phoneNumber || data.phoneNumber?.trim() === '') {
      zodCustomIssue(ctx, 'Phone number is required.', data.loginMethod);
    }
  }
});

export const sendOtpSchema = registerSchema.pick({ email: true });

const baseNewConfirmSchema = object({
  password: registerSchema.shape.password,
  confirmPassword: registerSchema.shape.confirmPassword,
});

export const updatePasswordSchema = baseNewConfirmSchema.superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    zodCustomIssue(ctx, 'Confirm password does not match new password', 'confirmPassword');
  }
});

export const changePasswordSchema = baseNewConfirmSchema
  .extend({
    oldPassword: zodString({
      ...passwordValidationOptions,
      field: 'oldPassword',
      label: 'Current password',
    }),
  })
  .superRefine((data, ctx) => {
    const { oldPassword, password, confirmPassword } = data ?? {};

    // Old & New must not be same
    if (oldPassword === password) {
      zodCustomIssue(ctx, 'New password must be different from current password', 'password');
    }

    // Old & Confirm must not be same
    if (oldPassword === confirmPassword) {
      zodCustomIssue(
        ctx,
        'Confirm password must be different from current password',
        'confirmPassword',
      );
    }

    // New & Confirm must match
    if (password !== confirmPassword) {
      zodCustomIssue(ctx, 'Confirm password does not match new password', 'confirmPassword');
    }
  });

export const sendForgotPasswordLinkAndOtpSchema = registerSchema.pick({ email: true });
export const verifyForgotPasswordOtpSchema = registerSchema.pick({ otp: true });
