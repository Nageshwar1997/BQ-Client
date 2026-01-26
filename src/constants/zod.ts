import type { IZodStringConfigs } from '../types';
import { zodString } from '../utils/zod';
import { regexes } from './common';

export const passwordValidationOptions: IZodStringConfigs = {
  field: 'password',
  label: 'Password',
  allowSpace: false,
  min: 6,
  max: 20,
  customRegexes: [
    {
      regex: regexes.atLeastOneUppercaseLetter,
      message: 'must contain at least one uppercase letter',
    },
    {
      regex: regexes.atLeastOneLowercaseLetter,
      message: 'must contain at least one lowercase letter',
    },
    {
      regex: regexes.atLeastOneDigit,
      message: 'must contain at least one number',
    },
    {
      regex: regexes.atLeastOneSpecialCharacter,
      message: 'must contain at least one special character e.g. @$!%*?&#',
    },
    {
      regex: regexes.password,
      message:
        'must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  ],
};

export const phoneValidationOptions: IZodStringConfigs = {
  field: 'phoneNumber',
  label: 'Phone number',
  allowSpace: false,
  customRegexes: [
    { regex: regexes.phoneStart, message: 'must be start with 6, 7, 8, or 9' },
    { regex: regexes.phoneExactLength, message: 'must be exactly 10 digits' },
    {
      regex: regexes.phone,
      message: 'must be exactly 10 digits and must start with 6, 7, 8, or 9',
    },
  ],
};

export const emailValidationOptions: IZodStringConfigs = {
  allowSpace: false,
  field: 'email',
  label: 'Email',
  lowerOrUpper: 'lower',
  customRegexes: [{ regex: regexes.email, message: 'must be valid' }],
};

export const nameValidationOptions: Partial<IZodStringConfigs> = {
  min: 2,
  max: 50,
  customRegexes: [
    {
      regex: regexes.name,
      message: 'can only contain letters and only one space is allowed between words',
    },
  ],
};

export const otpValidationOptions: IZodStringConfigs = {
  field: 'otp',
  label: 'OTP',
  allowSpace: false,
  min: 6,
  max: 6,
  customRegexes: [
    { regex: regexes.otp, message: 'must be a valid 6 digit number. It can contain only digits' },
  ],
};

export const firstNameValidation = zodString({
  ...nameValidationOptions,
  field: 'firstName',
  label: 'First Name',
});

export const lastNameValidation = zodString({
  ...nameValidationOptions,
  field: 'lastName',
  label: 'Last Name',
});

export const emailValidation = zodString(emailValidationOptions);

export const phoneNumberValidation = zodString(phoneValidationOptions);
