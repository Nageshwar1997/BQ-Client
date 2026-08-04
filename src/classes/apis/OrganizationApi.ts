import type { TCreateContactQueryZodSchema } from '@beautinique/frontend-types';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type { TSellerDraftStepBodyZodSchema } from '@/schemas/seller.schema';
import type {
  IGetSellerApplicationsQuery,
  ISellerApplicationsDashboardResponse,
  TApiSellerApplicationBase,
} from '@/types/api.type';

import { ApiRequest } from '../ApiRequest';

export class ContactApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.organization_service.contact;

  /* ================== CREATE CONTACT QUERY ================== */
  public createContactQuery = (data: TCreateContactQueryZodSchema) => {
    return this.request({ ...this.routes.create, data });
  };
}

export class SellerApi extends ApiRequest {
  private routes = API_METHODS_AND_URLS.organization_service.seller;

  /* ===================== POST API ===================== */

  public saveDraftSellerApplication = (data: TSellerDraftStepBodyZodSchema) => {
    return this.request({ ...this.routes.draft.save, data });
  };

  /* ===================== PATCH API ===================== */

  public submitSellerApplication = () => {
    return this.request(this.routes.draft.submit);
  };

  public approveSellerApplication = (sellerId: string) => {
    const { method, url } = this.routes.approve;
    return this.request({ method, url: url({ sellerId }) });
  };

  public rejectSellerApplication = ({ sellerId, reason }: { sellerId: string; reason: string }) => {
    const { method, url } = this.routes.reject;
    return this.request({ method, url: url({ sellerId }), data: { reason } });
  };

  /* ===================== GET API ===================== */

  public getDraftSellerApplication = () => {
    return this.request<Partial<TApiSellerApplicationBase>>(this.routes.draft.get);
  };

  public getMySellerApplication = () => {
    return this.request<TApiSellerApplicationBase | null>(this.routes.me);
  };

  public getSellerApplications = (params: IGetSellerApplicationsQuery) => {
    return this.request<ISellerApplicationsDashboardResponse>({
      ...this.routes.get.dashboard.applications,
      params,
    });
  };

  public getSellerApplicationById = (sellerId: string) => {
    const { method, url } = this.routes.get.dashboard.bySellerId;
    return this.request<TApiSellerApplicationBase>({ method, url: url({ sellerId }) });
  };
}
