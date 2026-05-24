import { categoryApi } from '@/classes/apis';
import { PRODUCT_SERVICE_QUERY_KEYS } from '@/constants/api.constants';
import type { ICategory } from '@/types/api.type';
import { useQuery } from '@tanstack/react-query';

const CATEGORY_KEY = PRODUCT_SERVICE_QUERY_KEYS.category;

export const useGetCategoriesHierarchy = () => {
  return useQuery({
    queryKey: CATEGORY_KEY.get.byHierarchy,
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
    select: (data) => (data?.categories || []) as ICategory[],
  });
};
