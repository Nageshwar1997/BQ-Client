import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import { ApiRequest } from '../ApiRequest';

export class CategoryApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.product_service.category;

  constructor() {
    super('product-service');
  }

  /* ===================== CATEGORY API ===================== */

  public getCategoriesHierarchy = () => {
    return this.request({ ...this.routes.get.byHierarchy });
  };
}
