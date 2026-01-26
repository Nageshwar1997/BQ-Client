import type { TContactUs } from '../../types';
import { ApiRequest } from '../ApiRequest';

export class GFormApi extends ApiRequest {
  protected contact_us = (data: TContactUs) => {
    return this.request({ ...this.routes.g_form.contact_us, data });
  };
  protected job_application = (portfolio: string) => {
    return this.request({ ...this.routes.g_form.job_application, data: { portfolio } });
  };
}
