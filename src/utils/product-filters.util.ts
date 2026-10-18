import {
  BRAND_PARAM_SEPARATOR,
  PRODUCT_FILTER_PARAMS,
  PRODUCT_SORT_OPTIONS,
} from '@/constants/product-listing.constants';
import type { IGetProductsQuery, TProductsSort } from '@/types/api.type';

/** The filters of the product listing, read from the URL. */
export interface IProductFilters {
  search?: string;
  /** What the listing is ordered by: `relevance` only with a search, `newest` otherwise. */
  sort: TProductsSort;
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
  /** The lowest rating to show (1 to 5). */
  minRating?: number;
  /** The least percent off to show (1 to 100). */
  minDiscount?: number;
  inStock: boolean;
  tryOn: boolean;
}

const SORTS = PRODUCT_SORT_OPTIONS.map((option) => option.value);

const isSort = (value: string | undefined): value is TProductsSort =>
  SORTS.some((sort) => sort === value);

/** A number the URL holds, or `undefined` when it holds none (or one that is not usable). */
const toNumber = (value: string | undefined, { min, max }: { min: number; max: number }) => {
  if (!value?.trim()) return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : undefined;
};

const MAX_PRICE = 10_000_000;

/** The order a listing has when the URL does not say: by relevance while there is a search, else the newest. */
export const getDefaultSort = (search: string | undefined): TProductsSort =>
  search ? 'relevance' : 'newest';

/**
 * Reads the filters of the listing out of the query params. A value that is not usable is left out, so a
 * link with a stale or hand-edited filter still opens (the service does the same with what it is sent).
 */
export const parseProductFilters = (
  params: Record<string, string | undefined>,
): IProductFilters => {
  const search = params[PRODUCT_FILTER_PARAMS.search]?.trim() ?? '';
  const sort = params[PRODUCT_FILTER_PARAMS.sort];
  const hasSearch = search !== '';

  let minPrice = toNumber(params[PRODUCT_FILTER_PARAMS.minPrice], { min: 0, max: MAX_PRICE });
  let maxPrice = toNumber(params[PRODUCT_FILTER_PARAMS.maxPrice], { min: 0, max: MAX_PRICE });

  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  const brands = [
    ...new Set(
      (params[PRODUCT_FILTER_PARAMS.brand] ?? '')
        .split(BRAND_PARAM_SEPARATOR)
        .map((brand) => brand.trim())
        .filter(Boolean),
    ),
  ];

  return {
    search: search || undefined,
    // `relevance` is the order of a search - without one it is the newest
    sort: isSort(sort) && (sort !== 'relevance' || hasSearch) ? sort : getDefaultSort(search),
    brands,
    minPrice,
    maxPrice,
    minRating: toNumber(params[PRODUCT_FILTER_PARAMS.minRating], { min: 1, max: 5 }),
    minDiscount: toNumber(params[PRODUCT_FILTER_PARAMS.minDiscount], { min: 1, max: 100 }),
    inStock: params[PRODUCT_FILTER_PARAMS.inStock] === 'true',
    tryOn: params[PRODUCT_FILTER_PARAMS.tryOn] === 'true',
  };
};

/**
 * Turns a change of the filters into the params to put in the URL: a filter that is off (`undefined`, an
 * empty list, `false`) gets `''`, which takes it out of the URL.
 */
export const serializeProductFilters = (
  change: Partial<Omit<IProductFilters, 'search'>>,
): Record<string, string> => {
  const params: Record<string, string> = {};
  const text = (value: number | undefined) => (value === undefined ? '' : String(value));

  if ('sort' in change) params[PRODUCT_FILTER_PARAMS.sort] = change.sort ?? '';
  if ('brands' in change) {
    params[PRODUCT_FILTER_PARAMS.brand] = (change.brands ?? []).join(BRAND_PARAM_SEPARATOR);
  }
  if ('minPrice' in change) params[PRODUCT_FILTER_PARAMS.minPrice] = text(change.minPrice);
  if ('maxPrice' in change) params[PRODUCT_FILTER_PARAMS.maxPrice] = text(change.maxPrice);
  if ('minRating' in change) params[PRODUCT_FILTER_PARAMS.minRating] = text(change.minRating);
  if ('minDiscount' in change) params[PRODUCT_FILTER_PARAMS.minDiscount] = text(change.minDiscount);
  if ('inStock' in change) params[PRODUCT_FILTER_PARAMS.inStock] = change.inStock ? 'true' : '';
  if ('tryOn' in change) params[PRODUCT_FILTER_PARAMS.tryOn] = change.tryOn ? 'true' : '';

  return params;
};

/** How many filters are on (the search and the order are not filters). A price range counts once. */
export const countActiveFilters = (filters: IProductFilters) =>
  filters.brands.length +
  (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
  (filters.minRating === undefined ? 0 : 1) +
  (filters.minDiscount === undefined ? 0 : 1) +
  (filters.inStock ? 1 : 0) +
  (filters.tryOn ? 1 : 0);

/** The request of one page of the listing for these filters (and the category the page is of, if any). */
export const toProductsQuery = (
  filters: IProductFilters,
  category?: string,
): Omit<IGetProductsQuery, 'page' | 'limit'> => ({
  ...(filters.search && { search: filters.search }),
  ...(category && { category }),
  ...(filters.brands.length > 0 && { brand: filters.brands }),
  ...(filters.minPrice !== undefined && { minPrice: String(filters.minPrice) }),
  ...(filters.maxPrice !== undefined && { maxPrice: String(filters.maxPrice) }),
  ...(filters.minRating !== undefined && { minRating: String(filters.minRating) }),
  ...(filters.minDiscount !== undefined && { minDiscount: String(filters.minDiscount) }),
  ...(filters.inStock && { inStock: 'true' as const }),
  ...(filters.tryOn && { tryOn: 'true' as const }),
  sort: filters.sort,
});
