import { boolean, object } from 'zod';
import { zodCustomIssue, zodEnum, zodSingleFileOrUrl, zodString } from '../utils/zod';
import {
  emailValidationOptions,
  nameValidationOptions,
  otpValidationOptions,
  passwordValidationOptions,
  phoneValidationOptions,
} from '../constants';

export const loginSchema = object({
  loginMethod: zodEnum({
    field: 'loginMethod',
    label: 'Login method',
    enumValues: ['email', 'phoneNumber'],
  }),
  email: zodString(emailValidationOptions).optional(),
  phoneNumber: zodString(phoneValidationOptions).optional(),
  password: zodString(passwordValidationOptions),
  remember: boolean().optional().default(false),
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

export const sendOtpSchema = object({
  email: zodString(emailValidationOptions),
});

export const registerSchema = object({
  profilePic: zodSingleFileOrUrl({
    field: 'profilePic',
    label: 'Profile Pic',
    required: true,
  }),
  otp: zodString(otpValidationOptions),
  firstName: zodString({
    ...nameValidationOptions,
    field: 'firstName',
    label: 'First Name',
  }),
  lastName: zodString({
    ...nameValidationOptions,
    field: 'lastName',
    label: 'Last Name',
  }),
  email: zodString(emailValidationOptions),
  phoneNumber: zodString(phoneValidationOptions),
  password: zodString(passwordValidationOptions),
  confirmPassword: zodString({
    ...passwordValidationOptions,
    field: 'confirmPassword',
    label: 'Confirm Password',
  }),
  remember: boolean().optional().default(false),
});
