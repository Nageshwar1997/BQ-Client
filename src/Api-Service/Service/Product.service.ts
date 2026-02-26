import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ProductApi } from '../Api/Product.api';
import type { IApiProductQueryProps } from '@/Types/Common.type';
import { QUERY_KEYS } from '@/Constants';

export class ProductService extends ProductApi {
  public GetAllProducts = (params: IApiProductQueryProps) => {
    const { enabled, pageParams = { limit: 10 }, ...restParams } = params ?? {};
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.products.all],
      initialPageParam: 1,
      queryFn: ({ pageParam = 1 }) =>
        this.get_all_products({
          pageParams: { page: pageParam, limit: pageParams.limit },
          ...restParams,
        }),
      getNextPageParam: (lastPage, allPages) => {
        const hasMore = lastPage.products.length === pageParams?.limit;
        return hasMore ? allPages.length + 1 : undefined;
      },
      enabled,
    });
  };

  public GetProductById = (params: Omit<IApiProductQueryProps, 'enabled' | 'pageParams'>) => {
    return useQuery({
      queryKey: [...QUERY_KEYS.products.product, params],
      queryFn: () => this.get_product_by_id(params),
      placeholderData: keepPreviousData,
      staleTime: 0.5 * 60 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!params?.queryParams?.productId,
    });
  };
}
