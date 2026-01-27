import type { TAllProductsQuery } from '../../types';
import { ApiRequest } from '../ApiRequest';

export class ProductApi extends ApiRequest {
  protected get_all_products = ({
    data,
    pageParams,
    queryParams,
  }: Omit<TAllProductsQuery, 'enabled'>) => {
    return this.request({
      ...this.routes.products.all,
      params: { ...pageParams, ...queryParams, ...data },
    });
  };

  protected get_product_by_id = ({
    data,
    queryParams,
  }: Pick<TAllProductsQuery, 'queryParams' | 'data'>) => {
    const { method, url } = this.routes.products.product;
    return this.request({
      method,
      url: `${url}/${queryParams?.productId ?? ''}`,
      params: { ...queryParams, ...data },
    });
  };
}
