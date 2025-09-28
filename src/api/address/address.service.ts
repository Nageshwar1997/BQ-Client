import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { add_address, get_user_addresses, update_address } from "./address.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";

export const useGetUserAddresses = () => {
  return useQuery({
    queryKey: ["get_user_addresses"],
    queryFn: get_user_addresses,
    retry: false,
    enabled: true,
    staleTime: Infinity,
    gcTime: Infinity,
    placeholderData: keepPreviousData,
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add_address"],
    mutationFn: add_address,
    onError: (error) => toastErrorMessage(error),
    onSuccess: (data) => {
      toastSuccessMessage(data.message || "Address added successfully");
      queryClient.invalidateQueries({ queryKey: ["get_user_addresses"] });
    },
  });
};

export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update_address"],
    mutationFn: update_address,
    onError: (error) => toastErrorMessage(error),
    onSuccess: (data) => {
      toastSuccessMessage(data.message || "Address updated successfully");
      queryClient.invalidateQueries({ queryKey: ["get_user_addresses"] });
    },
  });
};
