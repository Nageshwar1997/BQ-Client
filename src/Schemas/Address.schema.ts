import { boolean } from 'zod';
import { zodEnum, zodString } from '@/Utils';
import { registerSchema } from './Auth.schema';
import {
  ADDRESS_TYPES,
  ALLOWED_COUNTRIES,
  phoneValidationOptions,
  regexes,
  STATES_AND_UNION_TERRITORIES,
} from '@/Constants';

export const addressSchema = registerSchema
  .pick({ firstName: true, lastName: true, email: true, phoneNumber: true })
  .extend({
    type: zodEnum({ field: 'type', label: 'Address Type', enumValues: ADDRESS_TYPES }),
    altPhoneNumber: zodString({
      ...phoneValidationOptions,
      field: 'altPhoneNumber',
      label: 'Alternate phone number',
    }).optional(),
    address: zodString({ field: 'address', label: 'Address', min: 3 }),
    landmark: zodString({ field: 'landmark', label: 'Landmark', nonEmpty: false }).optional(),
    city: zodString({ field: 'city', label: 'City' }),
    state: zodEnum({
      field: 'state',
      label: 'State/Province',
      enumValues: STATES_AND_UNION_TERRITORIES,
    }),
    pinCode: zodString({
      field: 'pinCode',
      label: 'Pin Code',
      min: 6,
      max: 6,
      customRegexes: [
        { regex: regexes.pin_code, message: 'must be exactly 6 digits, valid pin code' },
      ],
    }),
    country: zodEnum({ field: 'country', label: 'Country', enumValues: ALLOWED_COUNTRIES }),
    gst: zodString({
      field: 'gst',
      label: 'GST Number',
      nonEmpty: false,
      min: 15,
      max: 15,
      customRegexes: [{ regex: regexes.gst, message: 'must be a valid GSTN' }],
    }).toUpperCase(),
    isDefaultAddress: boolean().optional().default(false),
  });
