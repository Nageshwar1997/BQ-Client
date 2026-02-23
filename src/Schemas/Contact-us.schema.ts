import { nameValidation } from './Common.schema';
import { registerSchema } from './Auth.schema';
import { zodString } from '@/Utils';

export const contactUsSchema = registerSchema.pick({ email: true, phoneNumber: true }).extend({
  name: nameValidation,
  message: zodString({ field: 'message', label: 'Message', min: 10, allowSpace: true }),
});
