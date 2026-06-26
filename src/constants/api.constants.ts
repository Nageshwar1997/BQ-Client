import envs from '@/envs';
import { createQueryKeys, createRouteHelper } from '@/utils/api.util';
import { API_METHODS_MAP, SERVICES_MAP } from '@beautinique/shared-constants';

export const METHODS_AND_PATHS = {
  base: '/api/v1',
  gateway: {
    home: { method: API_METHODS_MAP.GET, path: '/' },
    health: { method: API_METHODS_MAP.GET, path: '/health' },
    wakeUp: { method: API_METHODS_MAP.GET, path: '/wake-up' },
    refreshAccessToken: { method: API_METHODS_MAP.POST, path: '/refresh-access-token' },
  },
  user_service: {
    base: '/user-service',
    auth: {
      base: '/auth',
      login: {
        base: '/login',
        manual: { method: API_METHODS_MAP.POST, path: '/manual' },
        oauth: {
          google: {
            redirect: { method: API_METHODS_MAP.GET, path: '/oauth/google/redirect' },
            callback: { method: API_METHODS_MAP.GET, path: '/oauth/google/callback' },
          },

          linkedin: {
            redirect: { method: API_METHODS_MAP.GET, path: '/oauth/linkedin/redirect' },
            callback: { method: API_METHODS_MAP.GET, path: '/oauth/linkedin/callback' },
          },

          github: {
            redirect: { method: API_METHODS_MAP.GET, path: '/oauth/github/redirect' },
            callback: { method: API_METHODS_MAP.GET, path: '/oauth/github/callback' },
          },
        },
      },
      logout: { method: API_METHODS_MAP.DELETE, path: '/logout' },
      register: {
        base: '/register',
        sendOtp: { method: API_METHODS_MAP.POST, path: '/send-otp' },
        resendOtp: { method: API_METHODS_MAP.PATCH, path: '/resend-otp' },
        verifyOtp: { method: API_METHODS_MAP.POST, path: '/verify-otp' },
        saveUser: { method: API_METHODS_MAP.POST, path: '/save-user' },
      },
      password: {
        base: '/password',
        forgot: {
          sendOtp: { method: API_METHODS_MAP.POST, path: '/forgot-send-otp' },
          resendOtp: { method: API_METHODS_MAP.PATCH, path: '/forgot-resend-otp' },
          verifyOtp: { method: API_METHODS_MAP.POST, path: '/forgot-verify-otp' },
          save: { method: API_METHODS_MAP.POST, path: '/forgot-save' },
        },
        change: { method: API_METHODS_MAP.PATCH, path: '/change' },
        set: { method: API_METHODS_MAP.PATCH, path: '/set' },
      },
    },
    user: {
      base: '/user',
      session: { method: API_METHODS_MAP.GET, path: '/session' },
    },
  },
  media_service: { base: '/media-service' },
  product_service: {
    base: '/product-service',
    category: {
      base: '/category',
      add: { method: API_METHODS_MAP.POST, path: '/' },
      update: { method: API_METHODS_MAP.PATCH, path: '/:categoryId' },
      delete: { method: API_METHODS_MAP.DELETE, path: '/:categoryId' },
      get: {
        byParentLevel: { method: API_METHODS_MAP.GET, path: '/by-parent-level' },
        byHierarchy: { method: API_METHODS_MAP.GET, path: '/by-hierarchy' },
      },
    },
  },
} as const;

export const API_BASE_URLS = {
  gateway: envs.urls.gateway,
  [SERVICES_MAP['user-service']]:
    `${envs.urls.gateway}${METHODS_AND_PATHS.base}/${SERVICES_MAP['user-service']}`,
  [SERVICES_MAP['product-service']]:
    `${envs.urls.gateway}${METHODS_AND_PATHS.base}/${SERVICES_MAP['product-service']}`,
} as const;

export const API_METHODS_AND_URLS = createRouteHelper(METHODS_AND_PATHS);

export const API_QUERY_KEYS = createQueryKeys(METHODS_AND_PATHS);
