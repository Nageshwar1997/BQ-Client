import type { IZodStringConfigs } from '../types';
import { regexes } from './common';

export const passwordValidationOptions: Partial<IZodStringConfigs> = {
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

export const phoneValidationOptions: Partial<IZodStringConfigs> = {
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

export const emailValidationOptions: Partial<IZodStringConfigs> = {
  allowSpace: false,
  required: false,
  customRegexes: [{ regex: regexes.email, message: 'must be valid' }],
};
