import { useMutation } from "@tanstack/react-query";
import { toastErrorMessage, toastSuccessMessage } from "../../utils/toast.util";
import {
  delete_product,
  get_all_products,
  get_product_by_id,
  update_product,
  upload_product,
} from "./product.api";
import { IProductPossibleBodyFields } from "../../types";

export const useUploadProduct = () => {
  return useMutation({
    mutationFn: (bodyData: FormData) => upload_product(bodyData),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Product uploaded successfully!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Failed to upload product!"
      );
    },
  });
};

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

export const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({ data, productId }: { data: FormData; productId: string }) =>
      update_product({ data, productId }),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Product updated successfully!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Failed to update product!"
      );
    },
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (productId: string) => delete_product(productId),
    onSuccess: (data) => {
      toastSuccessMessage(data?.message || "Product deleted successfully!");
    },
    onError: (error: unknown) => {
      toastErrorMessage(
        typeof error === "string" ? error : "Failed to delete product!"
      );
    },
  });
};
