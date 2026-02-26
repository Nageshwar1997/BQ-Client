import type { IApiProductQueryProps } from '@/Types/Common.type';
import { ApiRequest } from '../ApiRequest';

export class ProductApi extends ApiRequest {
  protected get_all_products = (params: Omit<IApiProductQueryProps, 'enabled'>) => {
    return this.request({ ...this.routes.products.all, params });
  };

  protected get_product_by_id = (params: Omit<IApiProductQueryProps, 'enabled' | 'pageParams'>) => {
    const { method, url } = this.routes.products.product;
    const { queryParams, ...restParams } = params;
    const { productId, ...restQueryParams } = queryParams ?? {};
    return this.request({
      method,
      url: `${url}/${productId ?? ''}`,
      params: { ...restQueryParams, ...restParams },
    });
  };
}
