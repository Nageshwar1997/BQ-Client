import { CATEGORY_LEVELS_MAP } from '@beautinique/frontend-constants';

import type { StepperStep } from '@/components/ui/Stepper';

const passwords = { password: '', confirmPassword: '' };

const changePassword = { ...passwords, currentPassword: '' };

export const FORM_DEFAULT_VALUES = {
  passwords,
  changePassword,
  email: { email: '' },
  phoneNumber: { phoneNumber: '' },
  otp: { otp: '' },
  register: {
    ...passwords,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  },
  login: {
    loginMethod: 'email',
    email: undefined,
    phoneNumber: undefined,
    password: '',
  },
  addProduct: {
    title: '',
    brand: '',
    mainCategory: '',
    subCategory: '',
    productCategory: '',
    mrp: '',
    salePrice: '',
    stock: '',
    imageUrl: '',
    confirmDetails: false,
  },
  category: {
    activeStep: 0,
    name: '',
    level: CATEGORY_LEVELS_MAP.L1,
    mainCategory: '',
    subCategory: '',
    description: '',
  },
} as const;

export const SELLER_FORM_ID_MAP = {
  0: 'seller-business-details-form',
  1: 'seller-bank-details-form',
  2: 'seller-address-form',
  3: 'seller-documents-form',
  4: 'seller-review-form',
} as const;

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
    title: 'Address',
    description: 'Pickup address for orders',
    icon: 'solar:map-point-linear',
  },
  {
    title: 'Documents',
    description: 'KYC document uploads',
    icon: 'solar:gallery-linear',
  },
  {
    title: 'Review and submit',
    description: 'Verify all details before submitting for review',
    icon: 'solar:check-circle-linear',
  },
];
