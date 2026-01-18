import type { TLogin, TRecordString, TRegister } from '../types';

interface TLoginInput extends TRecordString {
  name: keyof TLogin;
}
interface TRegisterInput extends TRecordString {
  name: keyof TRegister;
}

export const PASSWORD_KEYS = ['password', 'confirmPassword'];

export const emailData = {
  name: 'email',
  label: 'Email',
  type: 'text',
  autoComplete: 'email',
  placeholder: 'Enter your email',
};

const phoneNumberData = {
  name: 'phoneNumber',
  label: 'Phone Number',
  type: 'number',
  autoComplete: 'tel',
  placeholder: 'Enter your number',
};

const passwordData = {
  name: 'password',
  label: 'Password',
  type: 'password',
  autoComplete: 'current-password',
  placeholder: 'Enter your password',
};

export const LOGIN_INPUT_MAP_DATA: TLoginInput[] = [
  emailData,
  phoneNumberData,
  passwordData,
] as TLoginInput[];

export const REGISTER_INPUT_MAP_DATA: TRegisterInput[] = [
  emailData,
  {
    label: 'OTP',
    name: 'otp',
    type: 'number',
    autoComplete: 'tel',
    placeholder: 'Enter your OTP',
  },
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    autoComplete: 'given-name',
    placeholder: 'Enter first name',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    autoComplete: 'given-name',
    placeholder: 'Enter last name',
  },
  phoneNumberData,
  passwordData,
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    autoComplete: 'current-password',
    placeholder: 'Reenter password',
  },
] as TRegisterInput[];
