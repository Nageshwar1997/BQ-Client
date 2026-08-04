import { API_METHODS_MAP, PRODUCT_STATUSES_MAP } from '@beautinique/frontend-constants';

import type { TProductSortBy, TSellerApplicationSortBy } from '@/types/api.type';
import { createQueryKeys, createRouteHelper } from '@/utils/api.util';

// TODO: move to @beautinique/frontend-constants alongside PRODUCT_STATUSES_MAP once the
// seller-review endpoints ship server-side.
export const SELLER_STATUSES_MAP = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

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
      },
    },
    user: {
      base: '/user',
      session: { method: GET, path: '/session' },
      update: { method: PATCH, path: '/' },
      password: {
        base: '/password',
        change: { method: PATCH, path: '/change' },
        set: { method: PATCH, path: '/set' },
      },
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
  organization_service: {
    base: '/organization-service',
    contact: {
      base: '/contact',
      create: { method: POST, path: '/' },
      list: { method: GET, path: '/' },
      updateStatus: { method: PATCH, path: '/:ticketId' },
    },
    seller: {
      base: '/seller',
      draft: {
        base: '/draft',
        save: { method: POST, path: '/' }, // Upsert the current step's data
        get: { method: GET, path: '/' }, // Resume an in-progress application
        submit: { method: PATCH, path: '/submit' }, // Final submit-for-review
      },
      me: { method: GET, path: '/me' }, // Current user's application + status
      get: {
        dashboard: {
          base: '/dashboard',
          applications: { method: GET, path: '/applications' }, // Admin list
          bySellerId: { method: GET, path: '/:sellerId' }, // Admin detail
        },
      },
      approve: { method: PATCH, path: '/:sellerId/approve' },
      reject: { method: PATCH, path: '/:sellerId/reject' },
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

export const SELLER_APPLICATIONS_TABLE_TITLES: {
  label: string;
  sortKey?: TSellerApplicationSortBy;
}[] = [
  { label: 'S. No' },
  { label: 'View' },
  { label: 'Business Name', sortKey: 'businessName' },
  { label: 'Applicant' },
  { label: 'GSTIN' },
  { label: 'Status' },
  { label: 'Submitted At', sortKey: 'createdAt' },
  { label: 'Updated At', sortKey: 'updatedAt' },
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

export const SELLER_STATUS_TRANSITIONS = {
  [SELLER_STATUSES_MAP.PENDING]: [SELLER_STATUSES_MAP.APPROVED, SELLER_STATUSES_MAP.REJECTED],
  [SELLER_STATUSES_MAP.REJECTED]: [SELLER_STATUSES_MAP.PENDING], // Resubmit
  [SELLER_STATUSES_MAP.APPROVED]: [], // Terminal — no revocation flow yet
} as const;
