import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { OrderApi } from '../api';
import { QUERY_KEYS } from '../../constants';
import { InvalidateQueries } from '../InvalidateQueries';
import type { TPagination, TParams } from '../../types';
import { usePathParams } from '../../hooks';

export class OrderService extends OrderApi {
  public CreateOrder = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);

    return useMutation({
      mutationKey: QUERY_KEYS.orders.create_order,
      mutationFn: this.create_order,
      onSuccess: invalidate.orders,
    });
  };

  public AllOrders = (params: TParams | TPagination) => {
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.orders.get_all_orders],
      initialPageParam: 1,
      queryFn: ({ pageParam }) => this.get_all_orders({ ...params, page: pageParam }),
      getNextPageParam: (lastPage, allPages) => {
        const hasMore = lastPage.orders.length === params.limit;
        return hasMore ? allPages.length + 1 : undefined;
      },
    });
  };

  public OrderById = () => {
    const { pathParams } = usePathParams();

    return useQuery({
      queryKey: [...QUERY_KEYS.orders.get_order_by_id, pathParams.orderId],
      queryFn: () => this.get_order_by_id(pathParams.orderId ?? ''),
    });
  };

  public CancelPayment = () => {
    return useMutation({
      mutationKey: QUERY_KEYS.orders.cancel_payment,
      mutationFn: this.cancel_payment,
    });
  };

  public CancelOrder = () => {
    const { pathParams } = usePathParams();
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);

    return useMutation({
      mutationKey: [...QUERY_KEYS.orders.cancel_order, pathParams.orderId],
      mutationFn: this.cancel_order,
      onSuccess: () => invalidate.order_by_id(pathParams.orderId),
    });
  };
}
