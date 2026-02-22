import { boolean, object } from 'zod';
import { zodCustomIssue, zodEnum, zodSingleFileOrUrl, zodString } from '../Utils/zod';
import {
  emailValidation,
  firstNameValidation,
  lastNameValidation,
  otpValidationOptions,
  passwordValidationOptions,
  phoneNumberValidation,
  phoneValidationOptions,
} from '../Constants';

export const loginSchema = object({
  loginMethod: zodEnum({
    field: 'loginMethod',
    label: 'Login method',
    enumValues: ['email', 'phoneNumber'],
  }),
  email: emailValidation.optional(),
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

export const sendOtpSchema = object({ email: emailValidation });

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
  password: zodString(passwordValidationOptions),
  confirmPassword: zodString({
    ...passwordValidationOptions,
    field: 'confirmPassword',
    label: 'Confirm Password',
  }),
  remember: boolean().optional().default(false),
});
