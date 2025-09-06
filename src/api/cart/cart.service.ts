import { useMutation } from "@tanstack/react-query";
import { add_product_to_cart } from "./cart.api";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";

export const useAddProductToCart = () => {
  return useMutation({
    mutationKey: ["add_product_to_cart"],
    mutationFn: (productId: string) => add_product_to_cart(productId),
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
