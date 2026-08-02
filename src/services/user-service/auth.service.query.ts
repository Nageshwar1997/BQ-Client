import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import useUserStore from '@/stores/user.store';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/common.util';

const { login, logout, password, register } = API_QUERY_KEYS.user_service.auth;

/* ===================== REGISTER QUERIES ===================== */

export const useRegisterSendOtp = () => {
  return useMutation({
    mutationKey: register.sendOtp,
    mutationFn: authApi.registerSendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Sending OTP to your email...',
      });

      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useRegisterResendOtp = () => {
  return useMutation({
    mutationKey: register.resendOtp,
    mutationFn: authApi.registerResendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Resending OTP to your email...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useRegisterVerifyOtp = () => {
  return useMutation({
    mutationKey: register.verifyOtp,
    mutationFn: authApi.registerVerifyOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Verifying your OTP...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useRegisterAndSaveUser = () => {
  return useMutation({
    mutationKey: register.saveUser,
    mutationFn: authApi.registerSaveUser,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your details...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

/* ===================== LOGIN QUERIES ===================== */

export const useLogin = () => {
  return useMutation({
    mutationKey: login.manual,
    mutationFn: authApi.login,
    onMutate: () => {
      const toastId = toaster.loading({ title: 'Please wait...', description: 'Logging in...' });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

/* ===================== PASSWORD QUERIES ===================== */

export const useForgotPasswordSendOtp = () => {
  return useMutation({
    mutationKey: password.forgot.sendOtp,
    mutationFn: authApi.forgotPasswordSendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Sending OTP to your email...',
      });

      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useForgotPasswordResendOtp = () => {
  return useMutation({
    mutationKey: password.forgot.resendOtp,
    mutationFn: authApi.forgotPasswordResendOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Resending OTP to your email...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useForgotPasswordVerifyOtp = () => {
  return useMutation({
    mutationKey: password.forgot.verifyOtp,
    mutationFn: authApi.forgotPasswordVerifyOtp,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Verifying your OTP...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useForgotPasswordSave = () => {
  return useMutation({
    mutationKey: password.forgot.save,
    mutationFn: authApi.forgotPasswordSave,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your password...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: password.change,
    mutationFn: authApi.changePassword,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Changing your password...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useSetPassword = () => {
  return useMutation({
    mutationKey: password.set,
    mutationFn: authApi.setPassword,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Setting your password...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

/* ===================== LOGOUT QUERIES ===================== */

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setUser = useUserStore((s) => s.setUser);

  return useMutation({
    mutationKey: logout,
    mutationFn: authApi.logout,
    onMutate: () => {
      const toastId = toaster.loading({ title: 'Please wait...', description: 'Logging out...' });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
      // Drop all cached data so nothing from this session leaks into the next login.
      queryClient.clear();
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
      setUser(null);
    },
  });
};
