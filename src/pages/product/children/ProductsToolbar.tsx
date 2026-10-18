import { Select } from '@beautinique/frontend-components';
import { useQueryParamInput, useQueryParams } from '@beautinique/frontend-hooks';
import { Icon } from '@iconify/react';

import { PRODUCT_FILTER_PARAMS, PRODUCT_SORT_OPTIONS } from '@/constants/product-listing.constants';
import type { TProductsSort } from '@/types/api.type';

interface IProductsToolbar {
  sort: TProductsSort;
  /** There is a search, so "Most relevant" is an order the list can have. */
  hasSearch: boolean;
  onSortChange: (sort: TProductsSort) => void;
  /** How many filters are on; shown on the button that opens them (the filters sit beside the list on a wide screen). */
  activeFilters: number;
  onOpenFilters: () => void;
}

/**
 * The bar over the list: the search (kept in `?search=`, sent a moment after the last key or at Enter), the
 * order, and on a narrow screen the button that opens the filters.
 */
const ProductsToolbar = ({
  sort,
  hasSearch,
  onSortChange,
  activeFilters,
  onOpenFilters,
}: IProductsToolbar) => {
  const search = useQueryParamInput(PRODUCT_FILTER_PARAMS.search, { delay: 500 });
  const { removeParams } = useQueryParams();

  // `search.clear()` only empties the box - the URL is the caller's to change - so the param is taken out too
  const clearSearch = () => {
    search.clear();
    removeParams(PRODUCT_FILTER_PARAMS.search, { replace: true });
  };

  const sortOptions = PRODUCT_SORT_OPTIONS.filter(
    (option) => option.value !== 'relevance' || hasSearch,
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <form
        role="search"
        className="relative min-w-0 flex-1 basis-full sm:basis-64"
        onSubmit={(event) => {
          event.preventDefault();
          search.flush();
        }}
      >
        <Icon
          icon="solar:magnifer-linear"
          aria-hidden="true"
          className="text-silver-jet pointer-events-none absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2"
        />
        <input
          type="search"
          aria-label="Search products"
          placeholder="Search products, brands…"
          autoComplete="off"
          value={search.value}
          className="bg-secondary-invert border-primary/15 focus:border-blue-crayola-c placeholder:text-silver-jet h-12 w-full rounded-xl border pr-11 pl-10 text-sm outline-none [&::-webkit-search-cancel-button]:hidden"
          onChange={(event) => {
            search.setValue(event.target.value);
          }}
        />
        {search.value && (
          <button
            type="button"
            aria-label="Clear search"
            className="text-silver-jet hover:text-primary focus-visible:outline-blue-crayola-c absolute top-1/2 right-2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full outline-offset-0 transition-colors duration-200"
            onClick={clearSearch}
          >
            <Icon icon="lucide:x" className="size-4" aria-hidden="true" />
          </button>
        )}
      </form>

      <div className="flex w-full items-center gap-3 sm:w-auto">
        <Select
          label="Sort by"
          containerClassName="min-w-0 flex-1 sm:w-56 sm:flex-none"
          options={sortOptions}
          clearable={false}
          // the list is drawn over the sticky bar and the links of the cards
          optionsClassName="z-40"
          selectProps={{
            value: sort,
            onChange: (value) => {
              onSortChange(String(value) as TProductsSort);
            },
          }}
        />

        <button
          type="button"
          aria-label={activeFilters > 0 ? `Filters, ${String(activeFilters)} in use` : 'Filters'}
          className="bg-secondary-invert border-primary/15 hover:border-primary/40 focus-visible:outline-blue-crayola-c flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-xl border px-4 text-sm font-semibold outline-offset-2 transition-colors duration-200 lg:hidden"
          onClick={onOpenFilters}
        >
          <Icon icon="solar:filter-linear" className="size-4.5" aria-hidden="true" />
          Filters
          {activeFilters > 0 && (
            <span
              aria-hidden="true"
              className="bg-accent-duo grid size-5 place-items-center rounded-full text-xs font-bold text-white"
            >
              {activeFilters}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductsToolbar;
