import type { TPagination, TParams } from '@/types';
import { ApiRequest } from '../ApiRequest';

export class OrderApi extends ApiRequest {
  protected get_all_orders = (params: TParams | TPagination) => {
    return this.request({ ...this.routes.orders.get_all_orders, params }, { isPrivateRoute: true });
  };

  protected create_order = (params: TParams) => {
    return this.request({ ...this.routes.orders.create_order, params }, { isPrivateRoute: true });
  };

  protected get_order_by_id = (orderId: string) => {
    const { method, url } = this.routes.orders.get_order_by_id;
    return this.request({ method, url: `${url}/${orderId}` }, { isPrivateRoute: true });
  };

  protected cancel_payment = ({
    orderId,
    ...data
  }: TParams & { flag: 'modal_closed' | 'tab_closed' }) => {
    const { method, url } = this.routes.orders.cancel_payment;
    return this.request({ method, url: `${url}/${orderId}`, data }, { isPrivateRoute: true });
  };

  protected cancel_order = ({ orderId, ...data }: TParams) => {
    const { method, url } = this.routes.orders.cancel_order;
    return this.request({ method, url: `${url}/${orderId}`, data }, { isPrivateRoute: true });
  };
}
