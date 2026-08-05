import type { StepperStep } from '@/components/ui/Stepper';

export const SELLER_BUSINESS_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Individual / Sole Proprietorship', value: 'INDIVIDUAL' },
  { label: 'Partnership', value: 'PARTNERSHIP' },
  { label: 'Private Limited Company', value: 'PRIVATE_LIMITED' },
  { label: 'Public Limited Company', value: 'PUBLIC_LIMITED' },
  { label: 'LLP', value: 'LLP' },
];

export const SELLER_ONBOARDING_STEPS: StepperStep[] = [
  {
    title: 'Business details',
    description: 'Business name, type, GSTIN and PAN',
    icon: 'solar:case-round-linear',
  },
  {
    title: 'Bank & tax details',
    description: 'Account and IFSC details for payouts',
    icon: 'solar:card-linear',
  },
  {
    title: 'Address & documents',
    description: 'Pickup address and KYC document uploads',
    icon: 'solar:gallery-linear',
  },
  {
    title: 'Review and submit',
    description: 'Verify all details before submitting for review',
    icon: 'solar:check-circle-linear',
  },
];

export const SELLER_FORM_ID_MAP = {
  0: 'seller-business-details-form',
  1: 'seller-bank-details-form',
  2: 'seller-documents-form',
  3: 'seller-review-form',
} as const;