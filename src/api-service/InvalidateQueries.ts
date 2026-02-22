import { type QueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constants';

type QueryKey = readonly string[];

export class InvalidateQueries {
  private qc: QueryClient;
  private readonly authQueries: QueryKey[] = [
    QUERY_KEYS.users.user.details,
    QUERY_KEYS.users.wishlist.get,
    QUERY_KEYS.carts.get,
  ];

  constructor(queryClient: QueryClient) {
    this.qc = queryClient;
  }

  private invalidateQuery = (key: QueryKey) => {
    this.qc.invalidateQueries({ queryKey: key, refetchType: 'active' });
  };

  private removeQuery = (key: QueryKey) => {
    this.qc.removeQueries({ queryKey: key });
  };

  user() {
    this.invalidateQuery(this.authQueries[0]);
  }

  wishlist() {
    this.invalidateQuery(this.authQueries[1]);
  }

  cart() {
    this.invalidateQuery(this.authQueries[2]);
  }

  addresses() {
    this.invalidateQuery(QUERY_KEYS.addresses.get);
  }

  orders() {
    this.invalidateQuery(QUERY_KEYS.orders.get_all_orders);
  }

  order_by_id(id?: string) {
    this.invalidateQuery([...QUERY_KEYS.orders.get_order_by_id, id ?? '']);
  }

  multiple(keys: readonly QueryKey[]) {
    keys.forEach(this.invalidateQuery);
  }

  logout() {
    this.authQueries.forEach(this.removeQuery);
  }
}
