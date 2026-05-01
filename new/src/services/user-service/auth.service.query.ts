import { authApi } from '@/classes/apis';
import { GATEWAY_USER_SERVICE_QUERY_KEYS } from '@/constants/api.constant';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';
import { useMutation } from '@tanstack/react-query';

/* ===================== REGISTER QUERIES ===================== */

export const useRegisterSendOtp = () => {
  return useMutation({
    mutationKey: GATEWAY_USER_SERVICE_QUERY_KEYS.auth.register.send_otp,
    mutationFn: authApi.registerSendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Sending OTP to your email...',
      });

      return { toastId };
    },
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useRegisterResendOtp = () => {
  return useMutation({
    mutationKey: GATEWAY_USER_SERVICE_QUERY_KEYS.auth.register.resend_otp,
    mutationFn: authApi.registerResendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Resending OTP to your email...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useRegisterVerifyOtp = () => {
  return useMutation({
    mutationKey: GATEWAY_USER_SERVICE_QUERY_KEYS.auth.register.verify_otp,
    mutationFn: authApi.registerVerifyOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Verifying your OTP...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useRegisterAndSaveUser = () => {
  return useMutation({
    mutationKey: GATEWAY_USER_SERVICE_QUERY_KEYS.auth.register.save_user,
    mutationFn: authApi.registerSaveUser,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your details...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

/* ===================== LOGIN QUERIES ===================== */

export const useManualLogin = () => {
  return useMutation({
    mutationKey: GATEWAY_USER_SERVICE_QUERY_KEYS.auth.login.manual,
    mutationFn: authApi.manualLogin,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Logging in...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

/* ===================== PASSWORD QUERIES ===================== */
