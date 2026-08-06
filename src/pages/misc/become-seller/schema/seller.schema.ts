// TODO: migrate these to @beautinique/frontend-zod (with matching inferred types moved to
// @beautinique/frontend-types) once the seller-review endpoints ship server-side — this repo can't
// bump those shared packages on its own, so the seller onboarding wizard's schemas live here for
// now, following the same `xZodSchema`/`TXZodSchema` naming convention used everywhere else.

import { REGEX, SELLER_TYPES } from '@beautinique/frontend-constants';
import { imageUnionZodSchema, object, string, type TInfer, z } from '@beautinique/frontend-zod';

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;

/* -------------------------------------------------------------------------- */
/*                          STEP 1 — BUSINESS DETAILS                         */
/* -------------------------------------------------------------------------- */

export const sellerBusinessDetailsZodSchema = object({
  businessName: string('Business name is required')
    .nonempty('Business name is required')
    .trim()
    .min(2, 'Business name must be at least 2 characters long'),
  businessType: z.enum(SELLER_TYPES, 'Business type is required'),
  gstin: string().trim().toUpperCase().regex(REGEX.GST, 'Enter a valid GSTIN'),
  pan: string().trim().toUpperCase().regex(REGEX.PAN, 'Enter a valid PAN'),
});

export type TSellerBusinessDetailsZodSchema = TInfer<typeof sellerBusinessDetailsZodSchema>;

/* -------------------------------------------------------------------------- */
/*                         STEP 2 — BANK & TAX DETAILS                        */
/* -------------------------------------------------------------------------- */

export const sellerBankDetailsZodSchema = object({
  accountHolderName: string().trim().min(2, 'Account holder name is required'),
  accountNumber: string()
    .trim()
    .regex(/^[0-9]{9,18}$/, 'Enter a valid account number'),
  ifscCode: string().trim().regex(IFSC_REGEX, 'Enter a valid IFSC code'),
  bankName: string().trim().optional(),
});

export type TSellerBankDetailsZodSchema = TInfer<typeof sellerBankDetailsZodSchema>;

/* -------------------------------------------------------------------------- */
/*                       STEP 3 — ADDRESS & DOCUMENTS                         */
/* -------------------------------------------------------------------------- */

export const sellerPickupAddressZodSchema = object({
  addressLine1: string().trim().min(1, 'Address line 1 is required'),
  addressLine2: string().trim().optional(),
  city: string().trim().min(1, 'City is required'),
  state: string().trim().min(1, 'State is required'),
  pincode: string().trim().regex(PINCODE_REGEX, 'Enter a valid 6-digit pincode'),
  country: string().trim().min(1, 'Country is required'),
});

export type TSellerPickupAddressZodSchema = TInfer<typeof sellerPickupAddressZodSchema>;

export const sellerDocumentsFormZodSchema = object({
  pickupAddress: sellerPickupAddressZodSchema,
  idProof: imageUnionZodSchema,
  addressProof: imageUnionZodSchema,
  businessLicense: imageUnionZodSchema,
});

export type TSellerDocumentsFormZodSchema = TInfer<typeof sellerDocumentsFormZodSchema>;
