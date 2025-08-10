import {
  CategoryType,
  FetchedProductType,
  FetchedReviewType,
  FetchedShadeType,
  UserTypes,
} from "../types";

interface IProductPossibleBodyFields {
  requiredFields?: (keyof FetchedProductType)[];
  populateFields?: {
    shades?: (keyof FetchedShadeType | "images")[];
    seller?: Exclude<keyof UserTypes, "password">[];
    category?: (keyof CategoryType | "parentCategory")[];
    reviews?: (keyof FetchedReviewType)[];
  };
}

export type TPageParams = { page: number; limit: number };
export type TQueryParams = Record<string, string>;
export type TBodyParams = IProductPossibleBodyFields;

export interface IReviewsApiParams {
  pageParams?: TPageParams;
  queryParams?: TQueryParams;
  enabled?: boolean;
  data?: {
    populateFields?: {
      user: Exclude<keyof UserTypes, "password">[];
    };
  };
}
export interface IReviewsInfiniteApiParams
  extends Omit<IReviewsApiParams, "pageParams"> {
  pageParams: Omit<TPageParams, "page">;
  refetchOnWindowFocus?: boolean;
}

export type TUseGetProduct = {
  data?: TBodyParams;
  queryParams?: TQueryParams;
};

export interface TGetProductsParams extends TUseGetProduct {
  pageParams?: TPageParams;
}

export interface TUseGetAllProducts extends TUseGetProduct, TGetProductsParams {
  enabled?: boolean;
}

export interface TUseGetAllProductInfinite extends TUseGetProduct {
  pageParams: Omit<TPageParams, "page">;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
}
