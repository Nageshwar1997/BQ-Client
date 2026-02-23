import { zodEnum, zodSingleFileOrUrl, zodString } from '@/Utils';
import { contactUsSchema } from './Contact-us.schema';
import { ALLOWED_BUSINESSES, MB, regexes } from '@/Constants';
import { addressSchema } from './Address.schema';
import { boolean, object } from 'zod';

export const personalDetailsSchema = contactUsSchema.pick({
  name: true,
  email: true,
  phoneNumber: true,
});

export const businessDetailsSchema = personalDetailsSchema.extend({
  category: zodEnum({
    enumValues: ALLOWED_BUSINESSES,
    field: 'category',
    label: 'Business Category',
  }),
});

export const businessDetailsAddressSchema = addressSchema
  .pick({ address: true, landmark: true, city: true, state: true, pinCode: true, country: true })
  .extend({
    pan: zodString({
      field: 'pan',
      label: 'PAN Number',
      min: 10,
      max: 10,
      customRegexes: [{ regex: regexes.pan, message: 'must be valid' }],
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
