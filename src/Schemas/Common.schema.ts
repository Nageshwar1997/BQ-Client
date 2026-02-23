import {
  emailValidationOptions,
  nameValidationOptions,
  passwordValidationOptions,
  phoneValidationOptions,
} from '@/Constants';
import { zodString } from '@/Utils';

export const nameValidation = zodString(nameValidationOptions);

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
export const passwordValidation = zodString(passwordValidationOptions);
