// TODO: migrate these to @beautinique/frontend-zod (with matching inferred types moved to
// @beautinique/frontend-types) once the seller-review endpoints ship server-side — this repo can't
// bump those shared packages on its own, so the seller onboarding wizard's schemas live here for
// now, following the same `xZodSchema`/`TXZodSchema` naming convention used everywhere else.

import { imageUnionZodSchema, object, string, type TInfer } from '@beautinique/frontend-zod';

const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_DOCUMENT_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;

/* -------------------------------------------------------------------------- */
/*                          STEP 1 — BUSINESS DETAILS                         */
/* -------------------------------------------------------------------------- */

export const sellerBusinessDetailsZodSchema = object({
  businessName: string().trim().min(2, 'Business name is required'),
  businessType: string().trim().min(1, 'Select a business type'),
  gstin: string().trim().regex(GSTIN_REGEX, 'Enter a valid GSTIN'),
  pan: string().trim().regex(PAN_REGEX, 'Enter a valid PAN'),
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
