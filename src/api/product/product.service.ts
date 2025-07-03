import { useMutation } from "@tanstack/react-query";
import { get_all_products, get_product_by_id } from "./product.api";
import { IProductPossibleBodyFields } from "../../types";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toasts";

export const useGetAllProducts = () => {
  return useMutation({
    mutationFn: ({
      data,
      params,
    }: {
      data?: IProductPossibleBodyFields;
      params: { page: number; limit: number };
    }) => get_all_products({ data, params }),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Product fetched successfully!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Failed to fetch product!"
      );
    },
  });
};

export const useGetProductById = () => {
  return useMutation({
    mutationFn: ({
      data,
      params,
    }: {
      data: IProductPossibleBodyFields;
      params: { productId: string };
    }) => get_product_by_id({ data, params }),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Product fetched successfully!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Failed to fetch product!"
      );
    },
  });
};
