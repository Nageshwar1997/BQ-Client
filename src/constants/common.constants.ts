import type { IStepperStep } from '@beautinique/frontend-components/stepper';
import type { TAuthProvider } from '@beautinique/frontend-types';

import { ROUTES } from './routes.constants';

export const USER_KEY = 'user' as const;

// Path the user was on right before starting an OAuth redirect, so the callback page can send
// them back to it instead of always landing on home.
export const OAUTH_REDIRECT_KEY = 'oauth_redirect_path' as const;

export const SIDEBAR_DATA = [
  {
    title: 'Profile',
    icon: 'solar:user-circle-linear',
    path: `/${ROUTES.PROFILE.BASE}`,
    handler: null,
  },
  {
    title: 'Become a Seller',
    icon: 'solar:shop-2-linear',
    path: `/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.BECOME_SELLER}`,
    handler: null,
  },
  {
    title: 'Orders',
    icon: 'solar:delivery-linear',
    path: `/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.ORDERS}`,
    handler: null,
  },
  {
    title: 'Addresses',
    icon: 'solar:map-point-linear',
    path: `/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.ADDRESSES}`,
    handler: null,
  },
  {
    title: 'Wishlist',
    icon: 'solar:heart-linear',
    path: `/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.WISHLIST}`,
    handler: null,
  },
  {
    title: 'Reviews',
    icon: 'solar:star-linear',
    path: `/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.REVIEWS}`,
    handler: null,
  },
  {
    title: 'Refer a Friend',
    icon: 'solar:users-group-rounded-linear',
    path: `/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.REFER_A_FRIEND}`,
    handler: null,
  },
  {
    title: 'Gift Cards',
    icon: 'solar:gift-linear',
    path: `/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.GIFT_CARDS}`,
    handler: null,
  },
  {
    title: 'Notifications',
    icon: 'solar:bell-linear',
    path: `/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.NOTIFICATIONS}`,
    handler: null,
  },
  {
    title: 'Update Password',
    icon: 'solar:lock-password-linear',
    path: `/${ROUTES.PROFILE.BASE}/${ROUTES.PROFILE.UPDATE_PASSWORD}`,
    handler: null,
  },
  {
    title: 'Logout',
    icon: 'solar:logout-2-linear',
    handler: 'logout',
  },
] as const;

export const QUERY_PARAMS_KEY_MAP = {
  category: {
    mode: 'mode', // To Set Mode (Edit or Add)
    add: 'add', // To Open Add Category Modal
    edit: 'edit', // To Open Edit Category Modal
    level: {
      l1: { search: 'search_1', sort: 'sort_1' }, // To Set Filter Query for Level 1 Category
      l2: { search: 'search_2', sort: 'sort_2' }, // To Set Filter Query for Level 2 Category
      l3: { search: 'search_3', sort: 'sort_3' }, // To Set Filter Query for Level 3 Category
    },
  },
  confirm: 'confirm', // To Open Confirm Modal
  sort: 'sort', // To Set Sort Order
} as const;

export const CATEGORY_MODAL_STEPS: IStepperStep[] = [
  { title: 'Category info', description: 'Name and hierarchy', icon: 'solar:hanger-2-linear' },
  {
    title: 'Review',
    description: 'Confirm before save',
    icon: 'solar:checklist-minimalistic-linear',
  },
];

export const ADD_PRODUCT_STEPS: IStepperStep[] = [
  {
    title: 'Basic information',
    description: 'Set product title, pricing, brand and category details',
    icon: 'solar:tag-price-linear',
  },
  {
    title: 'Media and gallery',
    description: 'Upload product images, thumbnail and video',
    icon: 'solar:gallery-linear',
  },
  {
    title: 'Description and details',
    description:
      'Add short description, full description, usage instructions, ingredients and additional details',
    icon: 'solar:document-text-linear',
  },
  {
    title: 'Product variants and stock',
    description: 'Set product type and Configure variants, pricing and stock',
    icon: 'solar:list-check-linear',
  },
  {
    title: 'TryOn configuration',
    description: 'Setup TryOn category and configure TryOn details',
    icon: 'solar:face-scan-square-linear',
  },
  {
    title: 'Review and confirm',
    description: 'Verify all details before saving product',
    icon: 'solar:check-circle-linear',
  },
];

export const CATEGORY_STEPPER_STEP_COUNT = [0, 1] as const;

export const CATEGORY_STEPPER_STEP_COUNT_MAP = Object.fromEntries(
  CATEGORY_STEPPER_STEP_COUNT.map((type) => [type, type]),
) as { [K in (typeof CATEGORY_STEPPER_STEP_COUNT)[number]]: K };

export const VIDEO_PLACEHOLDER = '/images/Video-Placeholder.webp';

export const PRODUCT_VARIANT_ACTIONS = [
  { content: 'Remove', className: 'bg-electric-purple-c' },
  { content: 'Clear', className: 'bg-primary-red' },
  { content: 'Add', className: 'bg-primary-yellow' },
] as const;

export const HOME_VIDEOS_DATA = [
  {
    posterUrl:
      'https://res.cloudinary.com/drbhw0nwt/image/upload/v1742736104/Beautinique/Posters/1742736102775_3_Ace_of_Face_Foundation.webp',
    m3u8Url:
      'https://res.cloudinary.com/dag2xvurz/video/upload/sp_auto/v1742719904/Beautinique/Home_Videos/1742719884229_SUGAR_Ace_of_Face_Dewy_Foundation_New_Launch_SUGAR_Cosmetics.m3u8',
    mp4Url:
      'https://res.cloudinary.com/dag2xvurz/video/upload/v1742719904/Beautinique/Home_Videos/1742719884229_SUGAR_Ace_of_Face_Dewy_Foundation_New_Launch_SUGAR_Cosmetics.mp4',
  },
  {
    posterUrl:
      'https://res.cloudinary.com/drbhw0nwt/image/upload/v1742736080/Beautinique/Posters/1742736077422_2_Glide_Peptide_Lip_Treatement.webp',
    m3u8Url:
      'https://res.cloudinary.com/dag2xvurz/video/upload/sp_auto/v1742130156/Beautinique/Home_Videos/1742130132099_3_Glide_Peptide_SPF50_PA%2B%2B_Lip_Treatment_Must-Have_for_Daily_Protection.m3u8',
    mp4Url:
      'https://res.cloudinary.com/dag2xvurz/video/upload/v1742130156/Beautinique/Home_Videos/1742130132099_3_Glide_Peptide_SPF50_PA%2B%2B_Lip_Treatment_Must-Have_for_Daily_Protection.mp4',
  },
  {
    posterUrl:
      'https://res.cloudinary.com/drbhw0nwt/image/upload/v1742736002/Beautinique/Posters/1742735999781_1_Makeup_Reimagine.webp',
    m3u8Url:
      'https://res.cloudinary.com/dag2xvurz/video/upload/sp_auto/v1742127534/Beautinique/Home_Videos/1742127444038_1_Makeup_Reimagine.m3u8',
    mp4Url:
      'https://res.cloudinary.com/dag2xvurz/video/upload/v1742127534/Beautinique/Home_Videos/1742127444038_1_Makeup_Reimagine.mp4',
  },
] as const;

export const PROVIDER_ICON_MAP: Record<TAuthProvider, string> = {
  MANUAL: 'devicon:magento',
  GOOGLE: 'devicon:google',
  LINKEDIN: 'devicon:linkedin',
  GITHUB: 'devicon:github',
};
