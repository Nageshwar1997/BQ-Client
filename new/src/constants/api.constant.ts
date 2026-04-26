import envs from '@/envs';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};
export const API_METHODS_AND_URLS = {
  gateway: {
    user_service: {
      auth: {
        register: {
          send_otp: { method: METHODS.POST, url: '/auth/register/send-otp' },
          resend_otp: { method: METHODS.PATCH, url: '/auth/register/resend-otp' },
          verify_otp: { method: METHODS.POST, url: '/auth/register/verify-otp' },
          save_user: { method: METHODS.POST, url: '/auth/register/save-user' },
        },
      },
    },
  },
} as const;

export const API_BASE_URLS = {
  'gateway-user-service': `${envs.urls.gateway}/gateway/api/v1/user-service`,
};

export const QUERY_KEYS = {
  gateway: {
    user_service: {
      auth: {
        register: {
          send_otp: ['register_send_otp'],
          resend_otp: ['register_resend_otp'],
          verify_otp: ['register_verify_otp'],
          save_user: ['register_save_user'],
        },
      },
    },
  },
} as const;
