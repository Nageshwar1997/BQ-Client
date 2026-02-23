import { VITE_IS_DEV, VITE_LOCALHOST_BACKEND_URL, VITE_PRODUCTION_BACKEND_URL } from '@/Envs';
import {
  CareIcon,
  DownloadIcon,
  HandCoinIcon,
  LogoutIcon,
  ReviewIcon,
  ShoppingBag,
  TrackIcon,
  TruckIcon,
  UserCircleIcon,
} from '@/Icons';
import type { ICategoryL1, TRegexes } from '@/Types';

export const BACKEND_URL =
  VITE_IS_DEV === 'true' ? VITE_LOCALHOST_BACKEND_URL : VITE_PRODUCTION_BACKEND_URL;

export const MB = 1024 ** 2;
export const MAX_IMAGE_FILE_SIZE = 2 * MB; // 2MB
export const MAX_VIDEO_FILE_SIZE = 50 * MB; // 50MB
export const ALLOWED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
export const ALLOWED_VIDEO_FORMATS = ['video/mp4', 'video/webm'];
export const DEFAULT_POSTER = '/images/logo/BQ_gradient_logo.webp';

export const ADDRESS_TYPES = ['shipping', 'billing', 'both'];

export const LOADING_RINGS_DATA = [
  {
    border: { side: 'borderBottomWidth', color: 'red' },
    rotation: { rx: 45, ry: -45, z: 0 },
  },
  {
    border: { side: 'borderRightWidth', color: 'green' },
    rotation: { rx: 55, ry: 15, z: 90 },
  },
  {
    border: { side: 'borderTopWidth', color: 'blue' },
    rotation: { rx: 40, ry: 65, z: 180 },
  },
  {
    border: { side: 'borderLeftWidth', color: 'yellow' },
    rotation: { rx: 50, ry: -25, z: 270 },
  },
] as const;

export const regexes: Record<TRegexes, RegExp> = {
  noSpace: /^\S+$/, // No spaces allowed
  singleSpace: /^(?!.* {2,}).*$/s, // Single space allowed
  hexCode: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, // Hex color code
  date: /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d+)?(Z|([+-]\d{2}:\d{2}))?)?$/, // Date e.g. 2022-01-01T12:00:00Z
  name: /^(?!.*\d)(?!.* {2})([A-Za-z]+( [A-Za-z]+)*)$/, // Only letters & single space
  password: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])(?=\S.*$).{6,20}$/, // Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long
  email: /^[a-zA-Z0-9]+([._%+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(-?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,})+$/, // Email e.g. 3oYQK@example.com
  phoneStart: /^[6-9]/, // Starts with 6, 7, 8, or 9
  phoneExactLength: /^\d{10}$/, // Exactly 10 digits
  phone: /^[6-9][0-9]{9}$/, // Phone number e.g. 9876543210
  atLeastOneUppercaseLetter: /[A-Z]/, // At least one uppercase letter
  atLeastOneLowercaseLetter: /[a-z]/, // At least one lowercase letter
  atLeastOneDigit: /\d/, // At least one digit
  atLeastOneSpecialCharacter: /[@$!%*?&#]/, // At least one special character
  onlyDigits: /^\d+$/, // All characters are digits
  onlyUppercase: /^[A-Z]+$/, // All characters are uppercase
  onlyLowercase: /^[a-z]+$/, // All characters are lowercase
  onlyLetters: /^[a-zA-Z]+$/, // All characters are letters
  onlyLettersAndSpaces: /^[a-zA-Z\s]+$/, // All characters are letters and spaces
  only_letters_and_spaces_and_dots: /^[a-zA-Z\s.]+$/, // Only letters, spaces, and dots
  pin_code: /^[1-9][0-9]{5}$/, // Check valid pin code
  otp: /^[0-9]{6}$/,
  gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i, // Check valid GST number
  url: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=%]*)?$/i,
  pan: /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/,
};
export const XMLNS = { xmlns: 'http://www.w3.org/2000/svg' } as const;
export const SVG24WH = { ...XMLNS, width: '24', height: '24' } as const;
export const SVG24VB = { viewBox: '0 0 24 24' } as const;
export const SVG24WH_VB = { ...SVG24WH, ...SVG24VB } as const;
export const SVG_LC_LJ_ROUND = { strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
export const SVG_PATH_FR_CR = { fillRule: 'evenodd', clipRule: 'evenodd' } as const;
export const SVG24WH_VB_LC_LJ_R = { ...SVG24WH_VB, ...SVG_LC_LJ_ROUND } as const;
export const SVG_F_C_RULE = { fillRule: 'evenodd', clipRule: 'evenodd' } as const;

export const AUTH_PROVIDER = {
  GOOGLE: 'GOOGLE',
  MANUAL: 'MANUAL',
  LINKEDIN: 'LINKEDIN',
  GITHUB: 'GITHUB',
} as const;

export const ALLOWED_COUNTRIES = ['India'];
export const STATES_AND_UNION_TERRITORIES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi (National Capital Territory of Delhi)',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export const ALLOWED_BUSINESSES = [
  'Individual',
  'Freelance Seller',
  'Small Business',
  'Home-based Seller',
  'Retail Store',
  'Salon',
  'Wholesale Distributor',
];

export const DEFAULT_FILTER = { label: 'All', value: 'all', default: true };

export const NAVBAR_CATEGORIES_DATA: ICategoryL1[] = [
  //   for_you,
  //   lips,
  // eyes,
  // face,
  // skin,
  //   collections,
  // about,
];

export const ADDRESS_DEFAULT_VALUES = {
  type: 'both',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address: '',
  altPhoneNumber: '',
  city: '',
  country: 'India',
  gst: '',
  landmark: '',
  pinCode: '',
  state: '',
  email: '',
  isDefaultAddress: false,
};

export const SIDEBAR_DATA = [
  {
    id: 1,
    label: 'Account',
    icon: UserCircleIcon,
    path: '/account',
    className: 'stroke-tertiary group-hover:stroke-primary',
  },
  {
    id: 2,
    label: 'Cart',
    icon: ShoppingBag,
    path: '/account/cart',
    className: 'stroke-tertiary group-hover:stroke-primary',
  },
  {
    id: 3,
    label: 'Orders',
    icon: TruckIcon,
    path: '/account/orders',
    className: 'stroke-tertiary group-hover:stroke-primary',
  },
  {
    id: 4,
    label: 'Track Orders',
    icon: TrackIcon,
    path: '/account/track',
    className: 'stroke-tertiary group-hover:stroke-primary',
  },
  {
    id: 5,
    label: 'Refunds & Returns',
    icon: HandCoinIcon,
    path: '/account/orders/return-refund',
    className: 'stroke-tertiary group-hover:stroke-primary',
  },
  {
    id: 6,
    label: 'Reviews & Ratings',
    icon: ReviewIcon,
    path: '/account/reviews-and-ratings',
    className: 'stroke-tertiary group-hover:stroke-primary',
  },
  {
    id: 7,
    label: 'Customer Support',
    icon: CareIcon,
    path: '/account/contact',
    className: 'fill-tertiary group-hover:fill-primary',
  },
  {
    id: 8,
    label: 'Change Password',
    icon: DownloadIcon,
    path: '',
    className: '-rotate-90 stroke-tertiary group-hover:stroke-primary',
  },
  {
    id: 9,
    label: 'Logout',
    icon: LogoutIcon,
    className: 'stroke-tertiary group-hover:stroke-primary',
  },
];
