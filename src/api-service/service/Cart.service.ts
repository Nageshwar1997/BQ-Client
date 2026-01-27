import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CartApi } from '../api';
import { QUERY_KEYS } from '../../constants';
import { toaster } from '../../utils';
import { InvalidateQueries } from '../InvalidateQueries';
import { store } from '../../store';
import { useQueryParams } from '../../hooks';

export class CartService extends CartApi {
  public AddProductToCart = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);

    return useMutation({
      mutationKey: QUERY_KEYS.cart_products.add,
      mutationFn: this.add_product_to_cart,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
      onSettled: invalidate.cart,
    });
  };

  public UpdateCartProductQuantity = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);

    return useMutation({
      mutationKey: QUERY_KEYS.cart_products.update_quantity,
      mutationFn: this.update_cart_product_quantity,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
      onSettled: invalidate.cart,
    });
  };

  public RemoveProductFromCart = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);

    return useMutation({
      mutationKey: QUERY_KEYS.cart_products.remove,
      mutationFn: this.remove_product_from_cart,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
      onSettled: invalidate.cart,
    });
  };

  public ClearCart = () => {
    const qc = useQueryClient();
    const invalidate = new InvalidateQueries(qc);

    return useMutation({
      mutationKey: QUERY_KEYS.carts.clear,
      mutationFn: this.clear_cart,
      onSuccess: ({ message }) => toaster('success', message),
      onError: ({ message }) => toaster('error', message),
      onSettled: invalidate.cart,
    });
  };

  public GetCart = () => {
    const { queryParams } = useQueryParams();
    const { authenticated } = store.user.getState();
    return useQuery({
      queryKey: ['get_user_cart', queryParams.login, authenticated],
      queryFn: this.get_cart,
      enabled: authenticated,
      placeholderData: keepPreviousData,
      staleTime: 0.5 * 60 * 1000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: false,
    });
  };
}
