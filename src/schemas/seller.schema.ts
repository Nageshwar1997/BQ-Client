import { z } from 'zod';

// TODO: migrate these to @beautinique/frontend-zod (with matching inferred types moved to
// @beautinique/frontend-types) once the seller-review endpoints ship server-side — this repo can't
// bump those shared packages on its own, so the seller onboarding wizard's schemas live here for
// now, following the same `xZodSchema`/`TXZodSchema` naming convention used everywhere else.

const MAX_DOCUMENT_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_DOCUMENT_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PINCODE_REGEX = /^[0-9]{6}$/;

/* -------------------------------------------------------------------------- */
/*                          STEP 1 — BUSINESS DETAILS                         */
/* -------------------------------------------------------------------------- */

export const sellerBusinessDetailsZodSchema = z.object({
  businessName: z.string().trim().min(2, 'Business name is required'),
  businessType: z.string().trim().min(1, 'Select a business type'),
  gstin: z.string().trim().regex(GSTIN_REGEX, 'Enter a valid GSTIN'),
  pan: z.string().trim().regex(PAN_REGEX, 'Enter a valid PAN'),
});

export type TSellerBusinessDetailsZodSchema = z.infer<typeof sellerBusinessDetailsZodSchema>;

/* -------------------------------------------------------------------------- */
/*                         STEP 2 — BANK & TAX DETAILS                        */
/* -------------------------------------------------------------------------- */

export const sellerBankDetailsZodSchema = z.object({
  accountHolderName: z.string().trim().min(2, 'Account holder name is required'),
  accountNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{9,18}$/, 'Enter a valid account number'),
  ifscCode: z.string().trim().regex(IFSC_REGEX, 'Enter a valid IFSC code'),
  bankName: z.string().trim().optional(),
});

export type TSellerBankDetailsZodSchema = z.infer<typeof sellerBankDetailsZodSchema>;

/* -------------------------------------------------------------------------- */
/*                       STEP 3 — ADDRESS & DOCUMENTS                         */
/* -------------------------------------------------------------------------- */

export const sellerPickupAddressZodSchema = z.object({
  addressLine1: z.string().trim().min(1, 'Address line 1 is required'),
  addressLine2: z.string().trim().optional(),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  pincode: z.string().trim().regex(PINCODE_REGEX, 'Enter a valid 6-digit pincode'),
  country: z.string().trim().min(1, 'Country is required'),
});

export type TSellerPickupAddressZodSchema = z.infer<typeof sellerPickupAddressZodSchema>;

// Form-level: the wizard step holds a raw `File` here once the user picks one, which gets
// uploaded via media-service before the step's data is sent to the draft-save endpoint (see
// SellerOnboardingWizard/DocumentsStep). Resuming a saved draft prefills this with the *string*
// URL already returned by a previous upload instead — re-uploading it would be redundant — so
// each field accepts either.
const sellerDocumentFileZodSchema = z
  .instanceof(File, { message: 'Please upload a file' })
  .refine((file) => file.size <= MAX_DOCUMENT_SIZE_BYTES, 'File must be 5MB or smaller')
  .refine(
    (file) => ALLOWED_DOCUMENT_MIME_TYPES.includes(file.type),
    'Only JPG, PNG or PDF files are allowed',
  );

const sellerDocumentFileOrUrlZodSchema = z.union([
  sellerDocumentFileZodSchema,
  z.string().trim().min(1, 'Please upload a file'),
]);

export const sellerDocumentsFormZodSchema = z.object({
  pickupAddress: sellerPickupAddressZodSchema,
  idProof: sellerDocumentFileOrUrlZodSchema,
  addressProof: sellerDocumentFileOrUrlZodSchema,
  businessLicense: sellerDocumentFileOrUrlZodSchema,
});

export type TSellerDocumentsFormZodSchema = z.infer<typeof sellerDocumentsFormZodSchema>;

// Wire-level: same shape, but each document is already the URL returned by media-service.
export const sellerDocumentsZodSchema = z.object({
  pickupAddress: sellerPickupAddressZodSchema,
  idProof: z.string().trim().min(1, 'idProof upload failed'),
  addressProof: z.string().trim().min(1, 'addressProof upload failed'),
  businessLicense: z.string().trim().min(1, 'businessLicense upload failed'),
});

export type TSellerDocumentsZodSchema = z.infer<typeof sellerDocumentsZodSchema>;

/* -------------------------------------------------------------------------- */
/*                         STEP 4 — REVIEW & SUBMIT                           */
/* -------------------------------------------------------------------------- */

export const sellerReviewZodSchema = z.object({
  confirmDetails: z
    .boolean()
    .refine((value) => value, { message: 'Please confirm the details before submitting' }),
});

export type TSellerReviewZodSchema = z.infer<typeof sellerReviewZodSchema>;

/* -------------------------------------------------------------------------- */
/*                            DRAFT SAVE (PER STEP)                           */
/* -------------------------------------------------------------------------- */

// Body sent to `useSaveDraftSellerApplication` — mirrors the shared
// `TDraftProductStepBodyZodSchema` pattern: a `step` discriminator tells the backend which section
// of the application the payload belongs to.
export const sellerDraftStepBodyZodSchema = z.discriminatedUnion('step', [
  sellerBusinessDetailsZodSchema.extend({ step: z.literal(0) }),
  sellerBankDetailsZodSchema.extend({ step: z.literal(1) }),
  sellerDocumentsZodSchema.extend({ step: z.literal(2) }),
]);

export type TSellerDraftStepBodyZodSchema = z.infer<typeof sellerDraftStepBodyZodSchema>;

/* -------------------------------------------------------------------------- */
/*                          FULL APPLICATION (ASSEMBLED)                      */
/* -------------------------------------------------------------------------- */

// The fully-assembled application, used to validate the draft before the final "submit for
// review" call once all three steps have been saved.
export const sellerApplicationZodSchema = sellerBusinessDetailsZodSchema.extend({
  ...sellerBankDetailsZodSchema.shape,
  pickupAddress: sellerPickupAddressZodSchema,
  documents: z.object({
    idProof: z.string().trim().min(1),
    addressProof: z.string().trim().min(1),
    businessLicense: z.string().trim().min(1),
  }),
});

export type TSellerApplicationZodSchema = z.infer<typeof sellerApplicationZodSchema>;
