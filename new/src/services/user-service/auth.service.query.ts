import { authApi } from '@/classes/apis';
import { GATEWAY_USER_SERVICE_QUERY_KEYS } from '@/constants/api.constant';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { useMutation } from '@tanstack/react-query';

export const useRegisterSendOtp = () => {
  return useMutation({
    mutationKey: GATEWAY_USER_SERVICE_QUERY_KEYS.auth.register.send_otp,
    mutationFn: authApi.registerSendOtp,
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
  });
};

export const useRegisterResendOtp = () => {
  return useMutation({
    mutationKey: GATEWAY_USER_SERVICE_QUERY_KEYS.auth.register.resend_otp,
    mutationFn: authApi.registerResendOtp,
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
  });
};

export const useRegisterVerifyOtp = () => {
  return useMutation({
    mutationKey: GATEWAY_USER_SERVICE_QUERY_KEYS.auth.register.verify_otp,
    mutationFn: authApi.registerVerifyOtp,
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
  });
};

export const useRegisterAndSaveUser = () => {
  return useMutation({
    mutationKey: GATEWAY_USER_SERVICE_QUERY_KEYS.auth.register.verify_otp,
    mutationFn: authApi.registerSaveUser,
    onSuccess: ({ message }) => handleApiSuccessToaster(message),
    onError: (error) => handleApiErrorToaster(error),
  });
};
