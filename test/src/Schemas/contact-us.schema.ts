import { object } from 'zod';
import { zodString } from '../Utils/zod';
import { emailValidation, nameValidationOptions, phoneNumberValidation } from '../Constants';

export const contactUsSchema = object({
  name: zodString({ ...nameValidationOptions, field: 'name', label: 'Name' }),
  phoneNumber: phoneNumberValidation,
  email: emailValidation,
  message: zodString({ field: 'message', label: 'Message', min: 10, allowSpace: true }),
});
