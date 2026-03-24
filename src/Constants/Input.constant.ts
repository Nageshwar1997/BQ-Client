import type {
  IChangePasswordInput,
  ISetPasswordInput,
  IUpdatePasswordInput,
  TAddressInput,
  TLoginInput,
  TRegisterInput,
  TSendForgotPasswordLinkAndOtpInput,
  TVerifyForgotPasswordOtpInput,
} from '@/Types/Common.type';
import { STATES_AND_UNION_TERRITORIES } from './Common.constant';

export const PASSWORD_KEYS = ['password', 'confirmPassword'];

const nameData = { type: 'text', autoComplete: 'given-name' };

export const EMAIL_INPUT_DATA: TSendForgotPasswordLinkAndOtpInput = {
  name: 'email',
  label: 'Email',
  type: 'text',
  autoComplete: 'email',
  placeholder: 'Enter your email',
};

export const OTP_INPUT_DATA: TVerifyForgotPasswordOtpInput = {
  label: 'OTP',
  name: 'otp',
  type: 'number',
  autoComplete: 'tel',
  placeholder: 'Enter your OTP',
}

const firstNameData = {
  ...nameData,
  name: 'firstName',
  label: 'First Name',
  placeholder: 'Enter first name',
};
const lastNameData = {
  ...nameData,
  name: 'lastName',
  label: 'Last Name',
  placeholder: 'Enter last name',
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
  { ...EMAIL_INPUT_DATA, name: 'email' },
  { ...phoneNumberData, name: 'phoneNumber' },
  { ...passwordData, name: 'password' },
];

export const SET_PASSWORDS_FIELDS: ISetPasswordInput[] = [
  { ...passwordData, name: 'password' },
  {
    ...passwordData,
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Reenter password',
  },
];

export const REGISTER_INPUT_MAP_DATA: TRegisterInput[] = [
  EMAIL_INPUT_DATA,
  OTP_INPUT_DATA,
  { ...firstNameData, name: 'firstName' },
  { ...lastNameData, name: 'lastName' },
  { ...phoneNumberData, name: 'phoneNumber' },
  ...SET_PASSWORDS_FIELDS
];

export const ADD_ADDRESS_INPUT_MAP_DATA: TAddressInput[] = [
  { ...firstNameData, name: 'firstName' },
  { ...lastNameData, name: 'lastName' },
  { ...phoneNumberData, name: 'phoneNumber' },
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
  { ...EMAIL_INPUT_DATA, name: 'email' },
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
    type: '',
    options: STATES_AND_UNION_TERRITORIES.map((state) => ({ label: state, value: state })),
  },
  {
    name: 'country',
    label: 'Country',
    placeholder: 'Select country',
    autoComplete: 'country',
    type: '',
    options: [{ label: 'India', value: 'India' }],
  },
];

export const updatePasswordFields: IUpdatePasswordInput[] = [
  {
    ...passwordData,
    name: 'password',
    label: 'New Password',
    placeholder: 'Enter new password',
  },
  {
    ...passwordData,
    name: 'confirmPassword',
    label: 'Confirm Password',
    placeholder: 'Confirm new password',
  },
];

export const changePasswordFields: IChangePasswordInput[] = [
  {
    ...passwordData,
    name: 'oldPassword',
    label: 'Current Password',
    placeholder: 'Enter current password',
  },
  ...updatePasswordFields,
];
