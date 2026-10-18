import type {
  ICreateHeaders,
  TApiMethod,
  TAuthProvider,
  TCategoryLevel,
  TCategoryLevelsMap,
  TCategoryZodSchema,
  TFieldErrors,
  TGlobalErrors,
  TProductBasicInfoZodSchema,
  TProductDescriptionAndContentZodSchema,
  TProductMediaAndGalleryZodSchema,
  TProductStatus,
  TProductWithoutVariantsZodSchema,
  TProductWithVariantsZodSchema,
  TRegisterZodSchema,
  TSellerApprovalStatus,
  TSellerType,
  TStateOrUT,
  TTerritoryAssignmentReason,
  TTryOnSelection,
  TUserRole,
} from '@beautinique/frontend-types';

export interface IErrorResponse {
  message?: string;
  fieldErrors?: TFieldErrors;
  globalErrors?: TGlobalErrors;
}

export interface IId {
  _id: string;
}

export interface ITimeStamp {
  createdAt: string;
  updatedAt: string;
}

export interface IUser
  extends Omit<TRegisterZodSchema, 'confirmPassword' | 'password'>, IId, ITimeStamp {
  providers: TAuthProvider[];
  role: TUserRole;
  avatar?: string;
}

/* -------------------------------------------------------------------------- */
/*                                  CATEGORY                                  */
/* -------------------------------------------------------------------------- */

export type TLevel1 = TCategoryLevelsMap['L1'];
export type TLevel2 = TCategoryLevelsMap['L2'];
export type TLevel3 = TCategoryLevelsMap['L3'];

export type TCategoryBase<TLevel extends TCategoryLevel> = IId &
  Pick<TCategoryZodSchema, 'name'> & { slug: string; level: TLevel; path?: string };

export type TL1Category = TCategoryBase<TLevel1>;
export type TL2Category = TCategoryBase<TLevel2> & { parent: string };
export type TL3Category = TCategoryBase<TLevel3> & { parent: string; description: string };

export type TCategory = TL1Category | TL2Category | TL3Category;

export type TCategoryHierarchyNode<TLevel extends TCategoryLevel> = TLevel extends TLevel1
  ? TCategoryBase<TLevel1> & { subcategories: TCategoryHierarchyNode<TLevel2>[] }
  : TLevel extends TLevel2
    ? TCategoryBase<TLevel2> & { parent: string; subcategories: TCategoryHierarchyNode<TLevel3>[] }
    : TCategoryBase<TLevel3> & { parent: string; description: string; subcategories?: never };

export type TCategoryHierarchy = TCategoryHierarchyNode<TLevel1>;

export type TCreateHeaders = Omit<
  ICreateHeaders<Partial<Pick<IUser, '_id' | 'role'>>>,
  'serviceSecret'
>;

export type TRouteNode = Record<string, unknown> & { base?: string };

export interface IEndpoint {
  path: string;
  method: Lowercase<TApiMethod>;
}

export type TParams = Record<string, string | number>;

type TExtractRouteParams<T extends string> = T extends `${string}:${infer Param}/${infer Rest}`
  ? Record<Param | keyof TExtractRouteParams<`/${Rest}`>, string | number>
  : T extends `${string}:${infer Param}`
    ? Record<Param, string | number>
    : never;

type TUrl<FullPath extends string> =
  TExtractRouteParams<FullPath> extends never
    ? FullPath
    : (params: TExtractRouteParams<FullPath>) => FullPath;

interface IGeneratedEndpoint<T extends IEndpoint, FullPath extends string> {
  method: Uppercase<T['method']>;
  url: TUrl<FullPath>;
}

export type TGenerateRoutes<
  T,
  ParentPath extends string = T extends { base: infer B } ? (B extends string ? B : '') : '',
> = {
  [K in keyof T as K extends 'base' ? never : K]: T[K] extends IEndpoint
    ? IGeneratedEndpoint<T[K], `${ParentPath}${T[K]['path']}`>
    : T[K] extends Record<string, unknown>
      ? TGenerateRoutes<
          T[K],
          `${ParentPath}${T[K] extends {
            base: infer B;
          }
            ? B extends string
              ? B
              : ''
            : ''}`
        >
      : never;
};

type TQueryKey<FullPath extends string, Method extends string> =
  TExtractRouteParams<FullPath> extends never
    ? readonly [Uppercase<Method>, FullPath]
    : (params: TExtractRouteParams<FullPath>) => readonly [Uppercase<Method>, FullPath];

export type TGenerateQueryKeys<
  T,
  ParentPath extends string = T extends { base: infer B } ? (B extends string ? B : '') : '',
> = {
  [K in keyof T as K extends 'base' ? never : K]: T[K] extends IEndpoint
    ? TQueryKey<`${ParentPath}${T[K]['path']}`, T[K]['method']>
    : T[K] extends Record<string, unknown>
      ? TGenerateQueryKeys<
          T[K],
          `${ParentPath}${T[K] extends {
            base: infer B;
          }
            ? B extends string
              ? B
              : ''
            : ''}`
        >
      : never;
};

type TApiTryOn =
  | { enabled: boolean; configured: false }
  | ({ enabled: false; configured: true } & Partial<TTryOnSelection>)
  | ({ enabled: true; configured: true } & TTryOnSelection);

export type TRemoveFileType<T> = {
  [K in keyof T]: T[K] extends (infer U)[] ? Exclude<U, File>[] : Exclude<T[K], File>;
};

export type TApiProductBase = IId &
  ITimeStamp &
  Pick<TProductBasicInfoZodSchema, 'title' | 'brand' | 'sellingPrice' | 'originalPrice'> &
  Omit<TProductDescriptionAndContentZodSchema, 'step'> &
  TRemoveFileType<Omit<TProductMediaAndGalleryZodSchema, 'step'>> & {
    tryOn: TApiTryOn;
    seller: string;
    sku: string;
    slug: string;
    discount: number;
    soldCount: number;
    returnCount: number;
    reviews: string[];
    totalReviews: number;
    averageRating: number;
    totalRating: number;
    status: TProductStatus;
    history?: {
      approvedBy?: string | null;
      approvedAt?: string | null;
      blockedBy?: string | null;
      blockedAt?: string | null;
      rejectedBy?: string | null;
      rejectedAt?: string | null;
      rejectReason?: string | null;
    };
  };

type TVariant = TRemoveFileType<TProductWithVariantsZodSchema['variants'][number]> & {
  sku: string;
  discount: number;
  images: string[];
  thumbnail?: string;
} & IId;

type TApiStockAndVariants =
  | Omit<TProductWithoutVariantsZodSchema, 'step'>
  | (Pick<TProductWithVariantsZodSchema, 'hasVariants'> & { variants: TVariant[] });

export type TApiProduct = TApiProductBase & TApiStockAndVariants & { category: string };

export type TApiProductPopulated = TApiProductBase &
  TApiStockAndVariants & { category: TCategory; seller: unknown };

export interface IPagination {
  page: number;
  totalPages: number;
}

/* ----------------------------- STOREFRONT LISTING ----------------------------- */

export type TProductsSort =
  'relevance' | 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating' | 'discount';

/** What the public product listing is asked for (`GET /product/products`). */
export interface IGetProductsQuery {
  page: string;
  limit: string;
  search?: string;
  /** The id of a category of any level: its products are those of every final category under it. */
  category?: string;
  /** Sent as repeated keys: `brand=A&brand=B`. */
  brand?: string[];
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  minDiscount?: string;
  inStock?: 'true';
  tryOn?: 'true';
  sort?: TProductsSort;
}

export interface IStorefrontColor {
  label: string;
  /** The colour itself (a CSS colour). */
  value: string;
  thumbnail?: string;
  inStock: boolean;
}

/** A product as the card of the storefront shows it. */
export interface IStorefrontProduct extends IId {
  title: string;
  slug: string;
  brand: string;
  shortDescription: string;
  thumbnail: string;
  /** A second image, shown when the card is hovered. */
  hoverImage?: string;
  originalPrice: number;
  sellingPrice: number;
  /** Percent off, 0 when it is not on sale. */
  discount: number;
  averageRating: number;
  totalReviews: number;
  soldCount: number;
  inStock: boolean;
  /** In stock, but only a few are left. */
  lowStock: boolean;
  hasTryOn: boolean;
  hasVariants: boolean;
  colors: IStorefrontColor[];
  /** How many colours the product has in all (`colors` holds the first few). */
  colorCount: number;
  createdAt: string;
}

export interface IStorefrontFilters {
  /** The brands of the matching products (every filter but the brand one applied). */
  brands: { name: string; count: number }[];
  /** The cheapest and the dearest of the matching products (every filter but the price ones applied). */
  price: { min: number; max: number } | null;
}

export interface IProductsResponse {
  products: IStorefrontProduct[];
  pagination: IPagination & { limit: number; total: number };
  filters: IStorefrontFilters;
}

/* -------------------------------------------------------------------------- */
/*                                   SELLER                                   */
/* -------------------------------------------------------------------------- */

export interface ISellerAssignedAdminHistoryEntry {
  admin: string;
  assignedAt: string;
  reason: TTerritoryAssignmentReason;
}

// The applicant's own submitted application (`GET /seller/me`) - only the
// fields the status-tracking screen actually shows, not the full backend doc.
export interface ISeller extends IId, ITimeStamp {
  businessDetails: { name: string; type: TSellerType };
  address: { city: string; state: TStateOrUT };
  approvalStatus: TSellerApprovalStatus;
  assignedAdmin?: string | null;
  assignedAdminHistory: ISellerAssignedAdminHistoryEntry[];
  history?: {
    rejectReason?: string | null;
  };
}
