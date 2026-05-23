import { authApi } from '@/classes/apis';
import { USER_SERVICE_QUERY_KEYS } from '@/constants/api.constants';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';
import { useMutation } from '@tanstack/react-query';

const QUERY_KEY = USER_SERVICE_QUERY_KEYS.auth;

/* ===================== REGISTER QUERIES ===================== */

export const useRegisterSendOtp = () => {
  return useMutation({
    mutationKey: QUERY_KEY.register.send_otp,
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
    mutationKey: QUERY_KEY.register.resend_otp,
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
    mutationKey: QUERY_KEY.register.verify_otp,
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
    mutationKey: QUERY_KEY.register.save_user,
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
    mutationKey: QUERY_KEY.login.manual,
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

export const useForgotPasswordSendOtp = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.forgot.send_otp,
    mutationFn: authApi.forgotPasswordSendOtp,
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

export const useForgotPasswordResendOtp = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.forgot.resend_otp,
    mutationFn: authApi.forgotPasswordResendOtp,
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

export const useForgotPasswordVerifyOtp = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.forgot.verify_otp,
    mutationFn: authApi.forgotPasswordVerifyOtp,
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

export const useForgotPasswordSave = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.forgot.save,
    mutationFn: authApi.forgotPasswordSave,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your password...',
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

export const useChangePassword = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.change,
    mutationFn: authApi.changePassword,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Changing your password...',
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

export const useSetPassword = () => {
  return useMutation({
    mutationKey: QUERY_KEY.password.set,
    mutationFn: authApi.setPassword,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Setting your password...',
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
