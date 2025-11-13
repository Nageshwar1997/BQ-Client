import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  add_wishlist_product,
  create_seller_request,
  get_user_details,
  get_user_wishlist,
  remove_wishlist_product,
} from "./user.api";
import { getUserToken } from "../../utils";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";

export const useGetUserDetails = () => {
  const token = getUserToken();

  return useQuery({
    queryKey: ["get_user_details", !!token],
    queryFn: get_user_details,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!token,
    placeholderData: keepPreviousData,
  });
};

export const useCreateSellerRequest = () => {
  return useMutation({
    mutationKey: ["create_seller_request"],
    mutationFn: create_seller_request,
    onSuccess: (data) =>
      toastSuccessMessage(data?.message || "Login successful!"),
    onError: (error) => toastErrorMessage(error),
  });
};

export const useAddProductToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add_wishlist_product"],
    mutationFn: add_wishlist_product,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Login successful!");
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
      toastSuccessMessage(data?.message || "Login successful!");
      queryClient.invalidateQueries({ queryKey: ["get_user_wishlist"] });
    },
    onError: (error) => toastErrorMessage(error),
  });
};

export const useGetUserWishlist = () => {
  const token = getUserToken();

  return useQuery({
    queryKey: ["get_user_wishlist", !!token],
    queryFn: get_user_wishlist,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!token,
    placeholderData: keepPreviousData,
  });
};
