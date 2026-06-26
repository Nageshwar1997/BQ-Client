import { categoryApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import type { TCategoryHierarchy } from '@/types/api.type';
import { useQuery } from '@tanstack/react-query';

const { category } = API_QUERY_KEYS.product_service;

export const useGetCategoriesHierarchy = () => {
  return useQuery({
    queryKey: category.get.byHierarchy,
    queryFn: categoryApi.getCategoriesHierarchy,

    // Cache
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 15 * 60 * 1000, // 15 min

    // Refetch
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    // Retry
    retry: 1,

    // UX
    placeholderData: (prev) => prev,
    select: (data) => (data?.categories || []) as TCategoryHierarchy[],
  });
};
