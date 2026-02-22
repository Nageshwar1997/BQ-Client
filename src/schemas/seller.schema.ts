import { boolean, object } from 'zod';
import { zodEnum, zodSingleFileOrUrl, zodString } from '../Utils/zod';
import {
  ALLOWED_BUSINESSES,
  ALLOWED_COUNTRIES,
  emailValidationOptions,
  MB,
  nameValidationOptions,
  phoneNumberValidation,
  regexes,
  STATES_AND_UNION_TERRITORIES,
} from '../Constants';

export const personalDetailsSchema = object({
  name: zodString({ ...nameValidationOptions, field: 'name', label: 'Name' }),
  email: emailValidationOptions,
  phoneNumber: phoneNumberValidation,
});

export const businessDetailsSchema = personalDetailsSchema.extend({
  category: zodEnum({
    enumValues: ALLOWED_BUSINESSES,
    field: 'category',
    label: 'Business Category',
  }),
});

export const businessDetailsAddressSchema = object({
  address: zodString({ field: 'address', label: 'Address', min: 3 }),
  landmark: zodString({ field: 'Landmark', label: 'Address', min: 2, nonEmpty: false }).optional(),
  city: zodString({ field: 'city', label: 'City', min: 2 }),
  state: zodEnum({
    field: 'state',
    label: 'State/Province',
    enumValues: STATES_AND_UNION_TERRITORIES,
  }),
  pinCode: zodString({
    field: 'pinCode',
    label: 'Pin Code',
    allowSpace: false,
    min: 6,
    max: 6,
    customRegexes: [
      { regex: regexes.pin_code, message: 'must be exactly 6 digits, valid pin code' },
    ],
  }),
  country: zodEnum({ field: 'country', label: 'Country', enumValues: ALLOWED_COUNTRIES }),
  pan: zodString({
    field: 'pan',
    label: 'PAN Number',
    min: 10,
    max: 10,
    customRegexes: [{ regex: regexes.pan, message: 'must be valid' }],
  }).toUpperCase(),
  gst: zodString({
    field: 'gst',
    label: 'GST Number',
    min: 15,
    max: 15,
    customRegexes: [{ regex: regexes.gst, message: 'must be valid GST number' }],
  }).toUpperCase(),
});

const maxImageFileSize = 0.2 * MB;

export const requiredDocumentsSchema = object({
  gst: zodSingleFileOrUrl({
    field: 'gst',
    label: 'GST Registration Certificate',
    maxImageFileSize,
  }),
  itr: zodSingleFileOrUrl({ field: 'itr', label: 'Income Tax Proof', maxImageFileSize }),
  addressProof: zodSingleFileOrUrl({
    field: 'addressProof',
    label: 'Address Proof',
    maxImageFileSize,
  }),
  geoTagging: zodSingleFileOrUrl({
    field: 'geoTagging',
    label: 'Geo-Tagging Image',
    maxImageFileSize,
  }),
});

export const becomeSellerBaseSchema = object({
  personalDetails: personalDetailsSchema,
  businessDetails: businessDetailsSchema,
  businessAddress: businessDetailsAddressSchema,
  requiredDocuments: requiredDocumentsSchema,
});

export const becomeSellerSchema = becomeSellerBaseSchema.extend({
  agreeTerms: boolean().refine((val) => val, 'You must accept terms & conditions.'),
});
