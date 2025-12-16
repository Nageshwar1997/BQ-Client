import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  cancel_order,
  cancel_payment,
  create_order,
  get_all_orders,
  get_order_by_id,
} from "./order.api";
import useQueryParams from "../../hooks/useQueryParams";
import { TQueryParams } from "../types";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["create_order"],
    mutationFn: create_order,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_all_orders_infinite"] });
    },
  });
};

export const useGetAllOrders = () => {
  const { queryParams } = useQueryParams();
  return useQuery({
    queryKey: ["get_all_orders_non_infinite", queryParams],
    queryFn: () => get_all_orders({ queryParams }),
    placeholderData: keepPreviousData,
    staleTime: 0.5 * 60 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllOrdersInfinite = ({
  limit,
  queryParams,
}: {
  limit: number;
  queryParams?: TQueryParams;
}) => {
  return useInfiniteQuery({
    queryKey: ["get_all_orders_infinite", queryParams],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      return get_all_orders({
        pageParams: { page: pageParam, limit },
        queryParams,
      });
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity, // 30 seconds
    gcTime: Infinity, // 5 minutes
    enabled: true,
    refetchOnWindowFocus: false,
    getNextPageParam: (lastPage, allPages) => {
      const hasMore = lastPage.orders.length === limit;
      return hasMore ? allPages.length + 1 : undefined;
    },
  });
};

export const useGetOrderById = (orderId: string) => {
  return useQuery({
    queryKey: ["get_order_by_id", orderId],
    queryFn: () => get_order_by_id(orderId),
    enabled: true,
    refetchOnWindowFocus: false,
  });
};

export const useCancelPayment = () => {
  return useMutation({
    mutationKey: ["cancel_payment"],
    mutationFn: cancel_payment,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cancel_order"],
    mutationFn: cancel_order,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_all_orders_infinite"] });
    },
  });
};
