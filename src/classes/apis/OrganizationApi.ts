import type {
  TCreateContactQueryZodSchema,
  TDraftSellerDetailsZodSchema,
  TDraftSellerStepBodyZodSchema,
} from '@beautinique/frontend-types';

import { API_METHODS_AND_URLS } from '@/constants/api.constants';
import type { ISeller } from '@/types/api.type';

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

  /* ================== SAVE DRAFT STEP ================== */
  public saveDraftSeller = (data: TDraftSellerStepBodyZodSchema) => {
    return this.request({ ...this.routes.draft.save, data });
  };

  /* ================== GET DRAFT (resume) ================== */
  public getDraftSeller = () => {
    return this.request<TDraftSellerDetailsZodSchema | null>(this.routes.draft.get);
  };

  /* ================== SUBMIT DRAFT ================== */
  public submitSellerDraft = () => {
    return this.request<ISeller>(this.routes.draft.submit);
  };

  /* ================== MY APPLICATION (status tracking) ================== */
  public getMySeller = () => {
    return this.request<ISeller | null>(this.routes.me);
  };
}
