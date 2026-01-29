import type { TAddressInput, TLoginInput, TRegisterInput } from '../types';
import { STATES_AND_UNION_TERRITORIES } from './common';

export const PASSWORD_KEYS = ['password', 'confirmPassword'];

const nameData = {
  type: 'text',
  autoComplete: 'given-name',
  placeholder: 'Enter first name',
};

export const emailData = {
  name: 'email',
  label: 'Email',
  type: 'text',
  autoComplete: 'email',
  placeholder: 'Enter your email',
};

const firstNameData = { ...nameData, name: 'firstName', label: 'First Name' };
const lastNameData = { ...nameData, name: 'lastName', label: 'Last Name' };

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
  firstNameData,
  lastNameData,
  phoneNumberData,
  passwordData,
  {
    ...passwordData,
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Reenter password',
  },
] as TRegisterInput[];

export const ADD_ADDRESS_INPUT_MAP_DATA: TAddressInput[] = [
  firstNameData,
  lastNameData,
  phoneNumberData,
  {
    ...phoneNumberData,
    name: 'altPhoneNumber',
    label: 'Alternate Phone Number (Optional)',
    placeholder: 'Enter alternate phone number',
  },
  {
    name: 'address',
    label: 'Address',
    placeholder: 'Enter address',
    autoComplete: 'address-line1',
    type: 'text',
  },
  {
    name: 'landmark',
    label: 'Landmark (Optional)',
    placeholder: 'Enter landmark',
    autoComplete: 'address-line2',
    type: 'text',
  },
  {
    name: 'city',
    label: 'City',
    placeholder: 'Enter city',
    autoComplete: 'address-level2',
    type: 'text',
  },
  emailData,
  {
    name: 'pinCode',
    label: 'Pin Code',
    placeholder: 'Enter pin code',
    autoComplete: 'postal-code',
    type: 'number',
  },
  {
    name: 'gst',
    label: 'GST Number (Optional)',
    placeholder: 'Enter GST number',
    autoComplete: 'off',
    type: 'string',
  },
  {
    name: 'state',
    label: 'State/Province',
    placeholder: 'Select state/Province',
    autoComplete: 'address-level1',
    options: STATES_AND_UNION_TERRITORIES.map((state) => ({ label: state, value: state })),
  },
  {
    name: 'country',
    label: 'Country',
    placeholder: 'Select country',
    autoComplete: 'country',
    options: [{ label: 'India', value: 'India' }],
  },
] as TAddressInput[];
