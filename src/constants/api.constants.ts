import envs from '@/envs';
import { createRouteHelper } from '@/utils/api.util';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

export const API_BASE_URLS = {
  gateway: envs.urls.gateway,
  'user-service': `${envs.urls.gateway}/api/v1/user-service`,
  'product-service': `${envs.urls.gateway}/api/v1/product-service`,
};

export const METHOD_MAP = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
} as const;

export const METHODS_AND_PATHS = {
  base: '/api/v1',
  gateway: {
    home: { method: METHOD_MAP.GET, path: '/' },
    health: { method: METHOD_MAP.GET, path: '/health' },
    wakeUp: { method: METHOD_MAP.GET, path: '/wake-up' },
    refreshAccessToken: { method: METHOD_MAP.POST, path: '/refresh-access-token' },
  },
  user_service: {
    base: '/user-service',
    auth: {
      base: '/auth',
      login: {
        base: '/login',
        manual: { method: METHOD_MAP.POST, path: '/manual' },
        oauth: {
          google: {
            redirect: { method: METHOD_MAP.GET, path: '/oauth/google/redirect' },
            callback: { method: METHOD_MAP.GET, path: '/oauth/google/callback' },
          },

          linkedin: {
            redirect: { method: METHOD_MAP.GET, path: '/oauth/linkedin/redirect' },
            callback: { method: METHOD_MAP.GET, path: '/oauth/linkedin/callback' },
          },

          github: {
            redirect: { method: METHOD_MAP.GET, path: '/oauth/github/redirect' },
            callback: { method: METHOD_MAP.GET, path: '/oauth/github/callback' },
          },
        },
      },
      logout: { method: METHOD_MAP.DELETE, path: '/logout' },
      register: {
        base: '/register',
        sendOtp: { method: METHOD_MAP.POST, path: '/send-otp' },
        resendOtp: { method: METHOD_MAP.PATCH, path: '/resend-otp' },
        verifyOtp: { method: METHOD_MAP.POST, path: '/verify-otp' },
        saveUser: { method: METHOD_MAP.POST, path: '/save-user' },
      },
      password: {
        base: '/password',
        forgot: {
          sendOtp: { method: METHOD_MAP.POST, path: '/forgot-send-otp' },
          resendOtp: { method: METHOD_MAP.PATCH, path: '/forgot-resend-otp' },
          verifyOtp: { method: METHOD_MAP.POST, path: '/forgot-verify-otp' },
          save: { method: METHOD_MAP.POST, path: '/forgot-save' },
        },
        change: { method: METHOD_MAP.PATCH, path: '/change' },
        set: { method: METHOD_MAP.PATCH, path: '/set' },
      },
    },
    user: {
      base: '/user',
      session: { method: METHOD_MAP.GET, path: '/session' },
    },
  },
  media_service: { base: '/media-service' },
  product_service: {
    base: '/product-service',
    category: {
      base: '/category',
      add: { method: METHOD_MAP.POST, path: '/' },
      update: { method: METHOD_MAP.PATCH, path: '/:categoryId' },
      delete: { method: METHOD_MAP.DELETE, path: '/:categoryId' },
      get: {
        byParentLevel: { method: METHOD_MAP.GET, path: '/by-parent-level' },
        byHierarchy: { method: METHOD_MAP.GET, path: '/by-hierarchy' },
      },
    },
  },
} as const;

export const API_METHODS_AND_URLS = createRouteHelper(METHODS_AND_PATHS);

export const USER_SERVICE_QUERY_KEYS = {
  auth: {
    register: {
      send_otp: ['register_send_otp'],
      resend_otp: ['register_resend_otp'],
      verify_otp: ['register_verify_otp'],
      save_user: ['register_save_user'],
    },
    password: {
      forgot: {
        send_otp: ['password_forgot_send_otp'],
        resend_otp: ['password_forgot_resend_otp'],
        verify_otp: ['password_forgot_verify_otp'],
        save: ['password_forgot_save'],
      },
      change: ['password_change'],
      set: ['password_set'],
    },
    login: {
      manual: ['manual_login'],
    },
  },
  user: {
    session: ['get_session_user'],
  },
} as const;

export const PRODUCT_SERVICE_QUERY_KEYS = {
  category: {
    get: {
      byHierarchy: ['get_categories_hierarchy'],
    },
  },
} as const;

export const AUTH_PROVIDERS = ['MANUAL', 'GOOGLE', 'LINKEDIN', 'GITHUB'] as const;

export const ROLES = ['USER', 'SELLER', 'ADMIN', 'MASTER'] as const;
