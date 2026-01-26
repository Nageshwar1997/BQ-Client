import { object } from 'zod';
import { zodString } from '../utils/zod';
import { emailValidation, nameValidationOptions, phoneNumberValidation } from '../constants';

export const contactUsSchema = object({
  name: zodString({ ...nameValidationOptions, field: 'name', label: 'Name' }),
  phoneNumber: phoneNumberValidation,
  email: emailValidation,
  message: zodString({ field: 'message', label: 'Message', min: 10, allowSpace: true }),
});
