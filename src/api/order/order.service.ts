import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  cancel_payment,
  create_order,
  get_all_orders,
  verify_payment,
} from "./order.api";
import useQueryParams from "../../hooks/useQueryParams";

export const useCreateOrder = () => {
  return useMutation({ mutationFn: create_order });
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

export const useGetAllOrdersInfinite = ({ limit }: { limit: number }) => {
  const { queryParams } = useQueryParams();

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

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verify_payment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_user_cart"] });
    },
  });
};

export const useCancelPayment = () => {
  return useMutation({ mutationFn: cancel_payment });
};
