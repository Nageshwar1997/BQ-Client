import type { TProductsSort } from '@/types/api.type';

/** Products come 12 to a page: whole rows for the grids of 2, 3 and 4 columns. */
export const PRODUCTS_PAGE_SIZE = 12;

/** The query params of the listing, as they are in the URL. */
export const PRODUCT_FILTER_PARAMS = {
  search: 'search',
  sort: 'sort',
  brand: 'brand',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  minRating: 'minRating',
  minDiscount: 'minDiscount',
  inStock: 'inStock',
  tryOn: 'tryOn',
} as const;

/** What "Clear all" takes out of the URL: the filters, not the search or the order. */
export const PRODUCT_FILTER_KEYS = [
  PRODUCT_FILTER_PARAMS.brand,
  PRODUCT_FILTER_PARAMS.minPrice,
  PRODUCT_FILTER_PARAMS.maxPrice,
  PRODUCT_FILTER_PARAMS.minRating,
  PRODUCT_FILTER_PARAMS.minDiscount,
  PRODUCT_FILTER_PARAMS.inStock,
  PRODUCT_FILTER_PARAMS.tryOn,
] as const;

/**
 * The brands share one query param (`?brand=A|B`), because the URL helpers of the app hold a single value
 * per key. A `|` does not come in the name of a brand.
 */
export const BRAND_PARAM_SEPARATOR = '|';

export const PRODUCT_SORT_OPTIONS: { value: TProductsSort; label: string }[] = [
  { value: 'relevance', label: 'Most relevant' },
  { value: 'newest', label: 'Newest first' },
  { value: 'popular', label: 'Best selling' },
  { value: 'rating', label: 'Top rated' },
  { value: 'discount', label: 'Biggest discount' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

/** The lowest ratings the filter offers ("4 & up"). */
export const RATING_FILTER_OPTIONS = [4, 3, 2] as const;

/** The least discounts the filter offers ("20% & above"). */
export const DISCOUNT_FILTER_OPTIONS = [10, 20, 30, 50] as const;

/** More brands than this are folded behind "Show more". */
export const BRANDS_SHOWN_FOLDED = 6;
