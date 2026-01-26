import { boolean, object } from 'zod';
import {
  ADDRESS_TYPES,
  ALLOWED_COUNTRIES,
  emailValidation,
  firstNameValidation,
  lastNameValidation,
  phoneNumberValidation,
  phoneValidationOptions,
  regexes,
  STATES_AND_UNION_TERRITORIES,
} from '../constants';
import { zodEnum, zodString } from '../utils/zod';

export const addressSchema = object({
  type: zodEnum({ field: 'type', label: 'Address Type', enumValues: ADDRESS_TYPES }),
  firstName: firstNameValidation,
  lastName: lastNameValidation,
  email: emailValidation,
  phoneNumber: phoneNumberValidation,
  altPhoneNumber: zodString({
    ...phoneValidationOptions,
    field: 'altPhoneNumber',
    label: 'Alternate phone number',
  }).optional(),
  address: zodString({ field: 'address', label: 'Address' }),
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
  }),
  isDefaultAddress: boolean().optional().default(false),
});
