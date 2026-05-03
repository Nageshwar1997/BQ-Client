import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import { ApiRequest } from '../ApiRequest';

export class UserApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.gateway.user_service.user;

  constructor() {
    super('gateway-user-service');
  }

  /* ===================== GET API ===================== */

  public getSessionUser = async () => {
    return this.request({ ...this.routes.session });
  };
}
