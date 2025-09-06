import { useMutation, useQuery } from "@tanstack/react-query";
import { add_product_to_cart, get_user_cart } from "./cart.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";
import { QueryParams } from "../../types";

export const useAddProductToCart = () => {
  return useMutation({
    mutationKey: ["add_product_to_cart"],
    mutationFn: (data: QueryParams) => add_product_to_cart(data),
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

export const useGetUserCart = () => {
  return useQuery({
    queryKey: ["get_user_cart"],
    queryFn: () => get_user_cart(),
  });
};
