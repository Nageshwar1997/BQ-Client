import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { productApi } from '@/classes/apis';
import { API_QUERY_KEYS } from '@/constants/api.constants';
import { PRODUCTS_PAGE_SIZE } from '@/constants/product-listing.constants';
import type { IGetProductsQuery } from '@/types/api.type';
import { handleApiErrorToaster, handleApiSuccessToaster } from '@/utils/api.util';
import { toaster } from '@/utils/toaster';

const { draft, get } = API_QUERY_KEYS.product_service.product;

export const useSaveDraftProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: draft.save,
    mutationFn: productApi.saveDraftProduct,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Saving your product in draft...',
      });
      return { toastId };
    },
    onSuccess: async ({ message }) => {
      await queryClient.invalidateQueries({ queryKey: [draft.get] });
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const usePublishProduct = () => {
  return useMutation({
    mutationKey: draft.publish,
    mutationFn: productApi.publishDraftProduct,
    onMutate: () => {
      const toastId = toaster.loading({
        title: 'Please wait...',
        description: 'Sending your product for approval...',
      });
      return { toastId };
    },
    onSuccess: ({ message }) => {
      handleApiSuccessToaster(message);
    },
    onError: (error) => {
      handleApiErrorToaster(error);
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.toastId) toaster.remove(context.toastId);
    },
  });
};

export const useGetDraftProduct = () => {
  return useQuery({
    queryKey: draft.get,
    queryFn: productApi.getDraftProduct,
    retry: false,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

/**
 * The public listing of the storefront, a page at a time. A change of the filters starts a new list, and
 * the old one stays on the screen (`isPlaceholderData`) until the new one comes, so the grid does not
 * flash empty while a filter is being chosen.
 */
export const useGetProducts = (query: Omit<IGetProductsQuery, 'page' | 'limit'>) => {
  return useInfiniteQuery({
    queryKey: [...get.products, query],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      productApi.getProducts({
        ...query,
        page: pageParam.toString(),
        limit: PRODUCTS_PAGE_SIZE.toString(),
      }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;

      if (!pagination) return undefined;

      return pagination.page < pagination.totalPages ? pagination.page + 1 : undefined;
    },

    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    placeholderData: (prev) => prev,

    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    select: (data) => {
      const first = data.pages[0]?.data;

      return {
        products: data.pages.flatMap((page) => page.data?.products ?? []),
        total: first?.pagination.total ?? 0,
        filters: first?.filters,
      };
    },
  });
};

export const useGetDashboardProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: [...get.dashboard.bySlug({ slug }), slug],
    queryFn: () => productApi.getDashboardProductBySlug(slug),
    enabled: !!slug,
    select: (data) => data.data,
  });
};
