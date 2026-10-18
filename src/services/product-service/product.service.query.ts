import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import ApiError from '@/classes/ApiError';
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

/**
 * A few products of a category, the best selling first - the "more like this" of a product page. The caller leaves
 * the open product out (`pickRelatedProducts`), which is why one more than it shows is asked for.
 */
export const useGetRelatedProducts = (categoryId: string | undefined) => {
  return useQuery({
    queryKey: [...get.products, 'related', categoryId],
    queryFn: () =>
      productApi.getProducts({
        category: categoryId,
        page: '1',
        limit: '5',
        sort: 'popular',
      }),
    enabled: !!categoryId,
    select: (data) => data.data?.products ?? [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

/**
 * The page of one product. A product that is not there (a 404) is not tried again - the answer will not change -
 * while any other failure is, as every other request is.
 */
export const useGetProductBySlug = (slug: string) => {
  return useQuery({
    queryKey: get.bySlug({ slug }),
    queryFn: () => productApi.getProductBySlug(slug),
    enabled: !!slug,
    select: (data) => data.data,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.statusCode === 404) && failureCount < 3,
  });
};
