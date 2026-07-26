import { API_METHODS_MAP, PRODUCT_STATUSES_MAP } from '@beautinique/frontend-constants';

import type { TProductSortBy } from '@/types/api.type';
import { createQueryKeys, createRouteHelper } from '@/utils/api.util';

const { DELETE, GET, PATCH, POST } = API_METHODS_MAP;

export const METHODS_AND_PATHS = {
  base: '/api/v1',
  gateway: {
    refreshAccessToken: { method: POST, path: '/refresh-access-token' },
  },
  user_service: {
    base: '/user-service',
    auth: {
      base: '/auth',
      login: {
        base: '/login',
        manual: { method: POST, path: '/manual' },
        oauth: {
          google: {
            redirect: { method: GET, path: '/oauth/google/redirect' },
            callback: { method: GET, path: '/oauth/google/callback' },
          },

          linkedin: {
            redirect: { method: GET, path: '/oauth/linkedin/redirect' },
            callback: { method: GET, path: '/oauth/linkedin/callback' },
          },

          github: {
            redirect: { method: GET, path: '/oauth/github/redirect' },
            callback: { method: GET, path: '/oauth/github/callback' },
          },
        },
      },
      logout: { method: DELETE, path: '/logout' },
      register: {
        base: '/register',
        sendOtp: { method: POST, path: '/send-otp' },
        resendOtp: { method: PATCH, path: '/resend-otp' },
        verifyOtp: { method: POST, path: '/verify-otp' },
        saveUser: { method: POST, path: '/save-user' },
      },
      password: {
        base: '/password',
        forgot: {
          sendOtp: { method: POST, path: '/forgot-send-otp' },
          resendOtp: { method: PATCH, path: '/forgot-resend-otp' },
          verifyOtp: { method: POST, path: '/forgot-verify-otp' },
          save: { method: POST, path: '/forgot-save' },
        },
        change: { method: PATCH, path: '/change' },
        set: { method: PATCH, path: '/set' },
      },
    },
    user: {
      base: '/user',
      session: { method: GET, path: '/session' },
    },
  },
  media_service: {
    base: '/media-service',
    upload: {
      base: '/upload',
      single: { method: POST, path: '/single' },
      multiple: { method: POST, path: '/multiple' },
    },
  },
  product_service: {
    base: '/product-service',
    category: {
      base: '/category',
      add: { method: POST, path: '/' },
      update: { method: PATCH, path: '/:categoryId' },
      delete: { method: DELETE, path: '/:categoryId' },
      get: {
        byParentLevel: { method: GET, path: '/by-parent-level' },
        byHierarchy: { method: GET, path: '/by-hierarchy' },
      },
    },
    product: {
      base: '/product',
      draft: {
        base: '/draft',
        publish: { method: PATCH, path: '/publish' }, // For publish existing draft
        save: { method: POST, path: '/' }, // For upload new Product as draft
        get: { method: GET, path: '/' }, // For get existing draft Product
        remove: { method: DELETE, path: '/' }, // For remove existing draft
        update: { method: PATCH, path: '/' }, // For already published product and seller again made some changes
      },
      publish: { method: PATCH, path: '/publish' }, // For publish existing Product
      get: {
        dashboard: {
          base: '/dashboard',
          products: { method: GET, path: '/products' },
          bySlug: { method: GET, path: '/:slug' },
        },
        suggestions: { method: GET, path: '/suggestions' },
        products: { method: GET, path: '/products' },
        bySlug: { method: GET, path: '/:slug' },
      },
    },
  },
} as const;

export const API_METHODS_AND_URLS = createRouteHelper(METHODS_AND_PATHS);

export const API_QUERY_KEYS = createQueryKeys(METHODS_AND_PATHS);

export const PRODUCTS_TABLE_TITLES: { label: string; sortKey?: TProductSortBy }[] = [
  { label: 'S. No' },
  { label: 'View' },
  { label: 'Thumbnail' },
  { label: 'Title', sortKey: 'title' },
  { label: 'Brand' },
  { label: 'SP', sortKey: 'sellingPrice' },
  { label: 'MRP', sortKey: 'originalPrice' },
  { label: 'Status' },
  { label: 'Stock' },
  { label: 'Created At', sortKey: 'createdAt' },
  { label: 'Updated At', sortKey: 'updatedAt' },
  { label: 'Try-On' },
  { label: 'Variants' },
  { label: 'Sku' },
  { label: 'Slug' },
  { label: 'Sold', sortKey: 'soldCount' },
  { label: 'Returned' },
  { label: 'Avg. Rating' },
] as const;

export const PRODUCT_STATUS_TRANSITIONS = {
  [PRODUCT_STATUSES_MAP.PENDING]: [
    PRODUCT_STATUSES_MAP.PUBLISHED,
    PRODUCT_STATUSES_MAP.REJECTED,
    PRODUCT_STATUSES_MAP.BLOCKED,
  ],

  [PRODUCT_STATUSES_MAP.PUBLISHED]: [PRODUCT_STATUSES_MAP.BLOCKED, PRODUCT_STATUSES_MAP.DELETED],

  [PRODUCT_STATUSES_MAP.REJECTED]: [PRODUCT_STATUSES_MAP.PENDING, PRODUCT_STATUSES_MAP.BLOCKED],

  [PRODUCT_STATUSES_MAP.BLOCKED]: [
    PRODUCT_STATUSES_MAP.PENDING,
    PRODUCT_STATUSES_MAP.PUBLISHED,
    PRODUCT_STATUSES_MAP.DELETED,
  ],

  [PRODUCT_STATUSES_MAP.DELETED]: [
    PRODUCT_STATUSES_MAP.PENDING,
    PRODUCT_STATUSES_MAP.PUBLISHED,
    PRODUCT_STATUSES_MAP.BLOCKED,
  ],
} as const;
