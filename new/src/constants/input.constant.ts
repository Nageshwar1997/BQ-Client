export const PASSWORD_KEYS = ['password', 'confirmPassword'];

const NAME_DATA = { type: 'text', autoComplete: 'given-name' } as const;

export const EMAIL_INPUT_DATA = {
  name: 'email',
  label: 'Email',
  type: 'text',
  autoComplete: 'email',
  placeholder: 'Enter your email',
} as const;

export const OTP_INPUT_DATA = {
  label: 'OTP',
  name: 'otp',
  type: 'number',
  autoComplete: 'tel',
  placeholder: 'Enter your OTP',
} as const;

const FIRST_NAME_INPUT_DATA = {
  ...NAME_DATA,
  name: 'firstName',
  label: 'First Name',
  placeholder: 'Enter first name',
} as const;

const LAST_NAME_INPUT_DATA = {
  ...NAME_DATA,
  name: 'lastName',
  label: 'Last Name',
  placeholder: 'Enter last name',
} as const;

const PHONE_NUMBER_INPUT_DATA = {
  name: 'phoneNumber',
  label: 'Phone Number',
  type: 'number',
  autoComplete: 'tel',
  placeholder: 'Enter your number',
} as const;

const PASSWORD_INPUT_DATA = {
  name: 'password',
  label: 'Password',
  type: 'password',
  autoComplete: 'current-password',
  placeholder: 'Enter your password',
} as const;

export const LOGIN_INPUT_MAP_DATA = [
  { ...EMAIL_INPUT_DATA, name: 'email' },
  { ...PHONE_NUMBER_INPUT_DATA, name: 'phoneNumber' },
  { ...PASSWORD_INPUT_DATA, name: 'password' },
] as const;

export const SET_PASSWORDS_FIELDS = [
  PASSWORD_INPUT_DATA,
  {
    ...PASSWORD_INPUT_DATA,
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Reenter password',
  },
] as const;

export const REGISTER_INPUT_MAP_DATA = [
  FIRST_NAME_INPUT_DATA,
  LAST_NAME_INPUT_DATA,
  EMAIL_INPUT_DATA,
  PHONE_NUMBER_INPUT_DATA,
  ...SET_PASSWORDS_FIELDS,
] as const;
