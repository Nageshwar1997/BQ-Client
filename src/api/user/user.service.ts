import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  add_wishlist_product,
  change_password,
  check_reset_password_token_validity,
  create_seller_request,
  forgot_password,
  get_user_details,
  get_user_wishlist,
  remove_wishlist_product,
  reset_password,
  reset_password_send_link,
  update_password,
  update_user_details,
} from "./user.api";
import { getUserToken } from "../../utils";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";
import useQueryParams from "../../hooks/useQueryParams";
import { useUserStore } from "../../store/user.store";

export const useGetUserDetails = (enabled: boolean = true) => {
  const token = getUserToken();

  return useQuery({
    queryKey: ["get_user_details", !!token],
    queryFn: get_user_details,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled,
    placeholderData: keepPreviousData,
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationKey: ["update_user_details"],
    mutationFn: update_user_details,
    onSuccess: (data) =>
      toastSuccessMessage(data?.message || "User details updated!"),
    onError: (error) => toastErrorMessage(error),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ["change_password"],
    mutationFn: change_password,
    onSuccess: (data) =>
      toastSuccessMessage(data?.message || "Password changed successfully!"),
    onError: (error) => toastErrorMessage(error),
  });
};

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update_password"],
    mutationFn: update_password,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Password updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["get_user_details"] });
    },
    onError: (error) => toastErrorMessage(error),
  });
};

export const useCheckResetPasswordTokenValidity = (token: string) => {
  return useQuery({
    queryKey: ["check_reset_password_token_validity"],
    queryFn: () => check_reset_password_token_validity(token),
    retry: false,
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export const useResetPasswordSendLink = () => {
  return useMutation({
    mutationKey: ["reset_password_send_link"],
    mutationFn: reset_password_send_link,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Password updated successfully!");
    },
    onError: (error) => toastErrorMessage(error),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationKey: ["reset_password"],
    mutationFn: reset_password,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Password Reset successfully!");
    },
    onError: (error) => toastErrorMessage(error),
  });
};
export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ["forgot_password"],
    mutationFn: forgot_password,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Password Reset successfully!");
    },
    onError: (error) => toastErrorMessage(error),
  });
};

export const useCreateSellerRequest = () => {
  return useMutation({
    mutationKey: ["create_seller_request"],
    mutationFn: create_seller_request,
    onSuccess: (data) =>
      toastSuccessMessage(data?.message || "Request sent successfully!"),
    onError: (error) => toastErrorMessage(error),
  });
};

export const useAddProductToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add_wishlist_product"],
    mutationFn: add_wishlist_product,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Added to wishlist!");
      queryClient.invalidateQueries({ queryKey: ["get_user_wishlist"] });
    },
    onError: (error) => toastErrorMessage(error),
  });
};

export const useRemoveProductFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove_wishlist_product"],
    mutationFn: remove_wishlist_product,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Removed from wishlist!");
      queryClient.invalidateQueries({ queryKey: ["get_user_wishlist"] });
    },
    onError: (error) => toastErrorMessage(error),
  });
};

export const useGetUserWishlist = () => {
  const token = getUserToken();
  const { queryParams } = useQueryParams();
  const isAuthenticated = useUserStore.getState().isAuthenticated;

  return useQuery({
    queryKey: [
      "get_user_wishlist",
      !!queryParams.login,
      isAuthenticated,
      !!token,
    ],
    queryFn: get_user_wishlist,
    retry: false,
    staleTime: 0.5 * 60 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
  });
};
