import type { TParams } from '@/Types/Common.type';
import { ApiRequest } from '../ApiRequest';

export class CartApi extends ApiRequest {
  protected add_product_to_cart = ({ productId, shadeId }: TParams) => {
    const { method, url } = this.routes.cart_products.add;
    return this.request(
      {
        method,
        url: `${url}/${productId}`,
        ...(shadeId && { params: { shadeId } }),
      },
      { isPrivateRoute: true },
    );
  };

  protected update_cart_product_quantity = ({ cartItemId, quantity }: TParams) => {
    const { method, url } = this.routes.cart_products.update_quantity;
    return this.request(
      { method, url: `${url}/${cartItemId}`, data: { quantity: Number(quantity) } },
      { isPrivateRoute: true },
    );
  };

  protected remove_product_from_cart = (cartItemId: string) => {
    const { method, url } = this.routes.cart_products.remove;
    return this.request({ method, url: `${url}/${cartItemId}` }, { isPrivateRoute: true });
  };

  protected clear_cart = () => {
    return this.request(this.routes.carts.clear, { isPrivateRoute: true });
  };

  protected get_cart = () => {
    return this.request(this.routes.carts.get, { isPrivateRoute: true });
  };
}
