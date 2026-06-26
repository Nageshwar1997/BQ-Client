import type { IZodStringConfigs } from '@/types/zod.type';
import { REGEX } from '@beautinique/shared-constants';

export const EMAIL_OPTIONS: IZodStringConfigs = {
  allowSpace: 'noSpace',
  field: 'email',
  label: 'Email',
  lowerOrUpper: 'lower',
  customRegex: { regex: REGEX.EMAIL, message: 'must be valid' },
};

export const PHONE_OPTIONS: IZodStringConfigs = {
  field: 'phoneNumber',
  label: 'Phone number',
  allowSpace: 'noSpace',
  customRegexes: [
    { regex: REGEX.PHONE_START, message: 'must be start with 6, 7, 8, or 9' },
    { regex: REGEX.PHONE_EXACT_LENGTH, message: 'must be exactly 10 digits' },
    {
      regex: REGEX.PHONE,
      message: 'must be exactly 10 digits and must start with 6, 7, 8, or 9',
    },
  ],
};

export const PASSWORD_OPTIONS: IZodStringConfigs = {
  field: 'password',
  label: 'Password',
  allowSpace: 'noSpace',
  min: 6,
  max: 20,
  customRegexes: [
    {
      regex: REGEX.AT_LEAST_ONE_UPPERCASE_LETTER,
      message: 'must contain at least one uppercase letter',
    },
    {
      regex: REGEX.AT_LEAST_ONE_LOWERCASE_LETTER,
      message: 'must contain at least one lowercase letter',
    },
    { regex: REGEX.AT_LEAST_ONE_DIGIT, message: 'must contain at least one number' },
    {
      regex: REGEX.AT_LEAST_ONE_SPECIAL_CHARACTER,
      message: 'must contain at least one special character e.g. @$!%*?&#',
    },
    {
      regex: REGEX.PASSWORD,
      message:
        'must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  ],
};

export const NAME_OPTIONS: IZodStringConfigs = {
  field: 'name',
  label: 'Name',
  min: 2,
  max: 50,
  allowSpace: 'singleSpace',
  customRegex: { regex: REGEX.NAME, message: 'can only contain letters' },
};

export const OTP_OPTIONS: IZodStringConfigs = {
  field: 'otp',
  label: 'OTP',
  min: 6,
  max: 6,
  allowSpace: 'noSpace',
  customRegex: { regex: REGEX.OTP, message: 'must be 6 digits' },
};
