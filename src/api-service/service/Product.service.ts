import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../constants';
import { ProductApi } from '../api';
import type { TAllProductsQuery } from '../../types';

export class ProductService extends ProductApi {
  public GetAllProducts = ({
    data,
    pageParams,
    queryParams,
    enabled = true,
  }: TAllProductsQuery) => {
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.products.all],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) =>
        this.get_all_products({
          data,
          pageParams: { page: pageParam, limit: pageParams?.limit },
          queryParams,
        }),
      getNextPageParam: (lastPage, allPages) => {
        const hasMore = lastPage.products.length === pageParams?.limit;
        return hasMore ? allPages.length + 1 : undefined;
      },
      enabled,
    });
  };

  public GetProductById = ({
    data,
    queryParams,
  }: Pick<TAllProductsQuery, 'queryParams' | 'data'>) => {
    return useQuery({
      queryKey: [...QUERY_KEYS.products.product, data, queryParams],
      queryFn: () => this.get_product_by_id({ data, queryParams }),
      placeholderData: keepPreviousData,
      staleTime: 0.5 * 60 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!queryParams?.productId,
    });
  };
}
