import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  add_product_to_cart,
  get_user_cart,
  remove_product_from_cart,
  update_product_quantity_in_cart,
} from "./cart.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";
import useQueryParams from "../../hooks/useQueryParams";
import { useUserStore } from "../../store/user.store";

export const useAddProductToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add_product_to_cart"],
    mutationFn: add_product_to_cart,
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Product added to cart");
    },
    onError: (error) => {
      toastErrorMessage(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get_user_cart"] });
    },
  });
};

export const useUpdateProductQuantityInCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update_product_quantity_in_cart"],
    mutationFn: update_product_quantity_in_cart,
    onError: (error) => toastErrorMessage(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get_user_cart"] });
    },
  });
};

export const useRemoveProductFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["remove_product_from_cart"],
    mutationFn: remove_product_from_cart,
    onError: (error) => toastErrorMessage(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["get_user_cart"] });
    },
  });
};

export const useGetUserCart = () => {
  const { queryParams } = useQueryParams();
  const isAuthenticated = useUserStore.getState().isAuthenticated;
  return useQuery({
    queryKey: ["get_user_cart", queryParams.login, isAuthenticated],
    queryFn: get_user_cart,
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
    staleTime: 0.5 * 60 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
