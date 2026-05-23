import envs from '@/envs';

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
};

export const API_METHODS_AND_URLS = {
  user_service: {
    auth: {
      register: {
        send_otp: { method: METHODS.POST, url: '/auth/register/send-otp' },
        resend_otp: { method: METHODS.PATCH, url: '/auth/register/resend-otp' },
        verify_otp: { method: METHODS.POST, url: '/auth/register/verify-otp' },
        save_user: { method: METHODS.POST, url: '/auth/register/save-user' },
      },
      login: {
        manual: { method: METHODS.POST, url: '/auth/login/manual' },
      },
      password: {
        forgot: {
          send_otp: { method: METHODS.POST, url: '/auth/password/forgot-send-otp' },
          resend_otp: { method: METHODS.PATCH, url: '/auth/password/forgot-resend-otp' },
          verify_otp: { method: METHODS.POST, url: '/auth/password/forgot-verify-otp' },
          save: { method: METHODS.POST, url: '/auth/password/forgot-save' },
        },
        change: { method: METHODS.PATCH, url: '/auth/password/change' },
        set: { method: METHODS.PATCH, url: '/auth/password/set' },
      },
    },
    user: { session: { method: METHODS.GET, url: '/user/session' } },
  },
  gateway: { token: { refresh: { method: METHODS.POST, url: '/refresh-access-token' } } },
} as const;

export const GATEWAY_USER_SERVICE_QUERY_KEYS = {
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

export const QUERY_KEYS = {
  gateway: {
    user_service: GATEWAY_USER_SERVICE_QUERY_KEYS,
  },
} as const;

export const AUTH_PROVIDERS = ['MANUAL', 'GOOGLE', 'LINKEDIN', 'GITHUB'] as const;

export const ROLES = ['USER', 'SELLER', 'ADMIN', 'MASTER'] as const;
