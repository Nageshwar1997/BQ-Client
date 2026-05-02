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
  EMAIL_INPUT_DATA,
  PHONE_NUMBER_INPUT_DATA,
  PASSWORD_INPUT_DATA,
] as const;

export const PASSWORDS_INPUT_MAP_DATA = [
  PASSWORD_INPUT_DATA,
  {
    ...PASSWORD_INPUT_DATA,
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Reenter password',
  },
] as const;

export const CHANGE_PASSWORD_INPUT_MAP_DATA = [
  {
    ...PASSWORD_INPUT_DATA,
    name: 'currentPassword',
    label: 'Current Password',
    placeholder: 'Enter current password',
  },
  {
    ...PASSWORD_INPUT_DATA,
    label: 'New Password',
    placeholder: 'Enter new password',
  },
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
  PHONE_NUMBER_INPUT_DATA,
  ...PASSWORDS_INPUT_MAP_DATA,
] as const;
