import type { TCreateContactQueryZodSchema } from '@beautinique/frontend-types';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';

import { ApiRequest } from '../ApiRequest';

export class ContactApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.organization_service.contact;

  /* ================== CREATE CONTACT QUERY ================== */
  public createContactQuery = (data: TCreateContactQueryZodSchema) => {
    return this.request({ ...this.routes.create, data });
  };
}
