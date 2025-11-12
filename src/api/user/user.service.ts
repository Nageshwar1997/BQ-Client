import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { create_seller_request, get_user_details } from "./user.api";
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
    mutationFn: create_seller_request,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Login successful!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Something went wrong!"
      );
    },
  });
};
