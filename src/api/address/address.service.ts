import { useMutation, useQuery } from "@tanstack/react-query";
import { add_address, get_user_addresses, update_address } from "./address.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";

export const useGetUserAddresses = () => {
  return useQuery({
    queryKey: ["get_user_details"],
    queryFn: get_user_addresses,
    retry: false,
    enabled: true,
  });
};

export const useAddAddress = () => {
  return useMutation({
    mutationKey: ["add_address"],
    mutationFn: add_address,
    onError: (error) => toastErrorMessage(error),
    onSuccess: (data) =>
      toastSuccessMessage(data.message || "Address added successfully"),
  });
};

export const useUpdateAddress = () => {
  return useMutation({
    mutationKey: ["update_address"],
    mutationFn: update_address,
    onError: (error) => toastErrorMessage(error),
    onSuccess: (data) =>
      toastSuccessMessage(data.message || "Address updated successfully"),
  });
};
