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
  0: 'businessDetails',
  1: 'bankDetails',
  2: 'address',
  3: 'documents',
  4: 'review',
} as const;

export const SELLER_STEPPER_STEP_COUNT = Object.keys(SELLER_FORM_ID_MAP).map(
  Number,
) as (keyof typeof SELLER_FORM_ID_MAP)[];

export const SELLER_STEPPER_STEP_COUNT_MAP = Object.fromEntries(
  SELLER_STEPPER_STEP_COUNT.map((type) => [type, type]),
) as {
  [K in keyof typeof SELLER_FORM_ID_MAP]: K;
};

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
