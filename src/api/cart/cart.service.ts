import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  add_product_to_cart,
  get_user_cart,
  remove_product_from_cart,
  update_product_quantity_in_cart,
} from "./cart.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";
import { IQueryParams } from "../../types";
import useQueryParams from "../../hooks/useQueryParams";
import { useUserStore } from "../../store/user.store";

export const useAddProductToCart = () => {
  return useMutation({
    mutationKey: ["add_product_to_cart"],
    mutationFn: (data: IQueryParams) => add_product_to_cart(data),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Product added to cart");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Something went wrong!"
      );
    },
  });
};

export const useUpdateProductQuantityInCart = () => {
  return useMutation({
    mutationKey: ["update_product_quantity_in_cart"],
    mutationFn: (data: IQueryParams) => update_product_quantity_in_cart(data),
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Something went wrong!"
      );
    },
  });
};

export const useRemoveProductFromCart = () => {
  return useMutation({
    mutationKey: ["remove_product_from_cart"],
    mutationFn: (data: IQueryParams) => remove_product_from_cart(data),
  });
};

export const useGetUserCart = () => {
  const { queryParams } = useQueryParams();
  const { isAuthenticated } = useUserStore();
  return useQuery({
    queryKey: ["get_user_cart", queryParams.login, isAuthenticated],
    queryFn: () => get_user_cart(),
    enabled: isAuthenticated,
    placeholderData: keepPreviousData,
    staleTime: 0.5 * 60 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
