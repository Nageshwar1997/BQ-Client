import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { get_all_products, get_product_by_id } from "./product.api";
import {
  TUseGetAllProductInfinite,
  TUseGetAllProducts,
  TUseGetProduct,
} from "../types";

export const useGetAllProducts = ({
  data,
  queryParams,
  pageParams,
  enabled = true,
}: TUseGetAllProducts) => {
  return useQuery({
    queryKey: ["get_all_products_non_infinite", data, queryParams, pageParams],
    queryFn: () => get_all_products({ data, queryParams, pageParams }),
    enabled,
  });
};

export const useGetAllProductsInfinite = ({
  data,
  pageParams,
  queryParams,
}: TUseGetAllProductInfinite) => {
  return useInfiniteQuery({
    queryKey: ["get_all_products_infinite", data, queryParams, pageParams],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      return get_all_products({
        data,
        pageParams: { page: pageParam, limit: pageParams.limit },
        queryParams,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.products.length === pageParams.limit;
      return hasMore ? allPages.length + 1 : undefined;
    },
  });
};

export const useGetProductById = ({ data, queryParams }: TUseGetProduct) => {
  return useQuery({
    queryKey: ["get_product_by_id", data, queryParams],
    queryFn: () => get_product_by_id({ data, queryParams }),
    enabled: !!queryParams?.productId,
  });
};
