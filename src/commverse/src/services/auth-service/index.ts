import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addBrandItem,
  checkIfEmailExists,
  deleteAccount,
  deleteBrandItem,
  editBrandItem,
  forgotPassword,
  getBrand,
  getSettings,
  getUserDetail,
  loginUser,
  registerUser,
  resetPassword,
  sendOTP,
  signoutAll,
  updateBrand,
  updateProfile,
  updateSettings,
  verifyForgotPasswordOTP,
  verifyOTP,
  getSites,
  createSite,
  updateSite,
  deleteSite,
  sendPhoneOtp,
  verifyPhoneOtp,
  sendPhoneOtpForUser,
  verifyPhoneOtpForUser,
  getSubscriptionPricingCatalog,
  savePhoneNumber,
} from '../api';
import type { SubscriptionPricingApiResponse } from '../../types/api.types';

export const useCheckIfEmailExists = () => {
  return useMutation({
    mutationKey: ['checkIfEmailExists'],
    mutationFn: checkIfEmailExists,
  });
};

export const useLoginUser = () => {
  return useMutation({
    mutationKey: ['loginUser'],
    mutationFn: loginUser,
  });
};

export const useRegisterUser = () => {
  return useMutation({
    mutationKey: ['registerUser'],
    mutationFn: registerUser,
  });
};

export const useSendOTP = () => {
  return useMutation({
    mutationKey: ['sendOTP'],
    mutationFn: sendOTP,
  });
};

export const useResendOTP = () => {
  return useMutation({
    mutationKey: ['resendOTP'],
    mutationFn: sendOTP,
  });
};

export const useVerifyOTP = () => {
  return useMutation({
    mutationKey: ['verifyOTP'],
    mutationFn: verifyOTP,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: forgotPassword,
  });
};

export const useForgotPasswordVerifyOTP = () => {
  return useMutation({
    mutationKey: ['verifyForgotPasswordOTP'],
    mutationFn: verifyForgotPasswordOTP,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: resetPassword,
  });
};

export const useSignOutAll = () => {
  return useMutation({
    mutationKey: ['signoutAll'],
    mutationFn: signoutAll,
  });
};

export const useDeleteAccount = () => {
  return useMutation({
    mutationKey: ['deleteAccount'],
    mutationFn: deleteAccount,
  });
};

export const useGetUserDetail = () => {
  return useQuery({
    queryKey: ['get-user-detail'],
    queryFn: getUserDetail,
    select: (data) => data?.data,
  });
};

export function useSubscriptionPricingCatalog() {
  return useQuery({
    queryKey: ['subscription-pricing-catalog'],
    queryFn: () =>
      getSubscriptionPricingCatalog() as Promise<SubscriptionPricingApiResponse>,
    staleTime: 60_000,
  });
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-profile'],
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-user-detail'] });
    },
  });
};

export const useGetBrand = () => {
  return useQuery({
    queryKey: ['get-brand'],
    queryFn: getBrand,
  });
};

export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-brand'],
    mutationFn: updateBrand,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-brand'] });
    },
  });
};

export const useAddBrandItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['add-brand-item'],
    mutationFn: addBrandItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-brand'] });
    },
  });
};

export const useEditBrandItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['edit-brand-item'],
    mutationFn: editBrandItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-brand'] });
    },
  });
};

export const useDeleteBrandItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-brand-item'],
    mutationFn: deleteBrandItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-brand'] });
    },
  });
};

export const useGetSettings = () => {
  return useQuery({
    queryKey: ['get-settings'],
    queryFn: getSettings,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-settings'],
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-settings'] });
    },
  });
};

export const useGetSites = () => {
  return useQuery({
    queryKey: ['get-sites'],
    queryFn: getSites,
  });
};

export const useCreateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['create-site'],
    mutationFn: (data: { value: string }) => createSite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-sites'] });
    },
  });
};

export const useUpdateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['update-site'],
    mutationFn: ({ id, body }: { id: string; body: FormData | any }) =>
      updateSite(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-sites'] });
    },
  });
};

export const useDeleteSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-site'],
    mutationFn: (id: string) => deleteSite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-sites'] });
    },
  });
};

export const useSendPhoneOtp = () => {
  return useMutation({
    mutationKey: ['send-phone-otp'],
    mutationFn: sendPhoneOtp,
  });
};
export const useSavePhoneNumber = () => {
  return useMutation({
    mutationKey: ['save-phone-number'],
    mutationFn: savePhoneNumber,
  });
};

export const useVerifyPhoneOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['verify-phone-otp'],
    mutationFn: verifyPhoneOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-user-detail'] });
    },
  });
};

export const useSendPhoneOtpForUser = () => {
  return useMutation({
    mutationKey: ['send-phone-otp-for-user'],
    mutationFn: sendPhoneOtpForUser,
  });
};

export const useVerifyPhoneOtpForUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['verify-phone-otp-for-user'],
    mutationFn: verifyPhoneOtpForUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-user-detail'] });
    },
  });
};
