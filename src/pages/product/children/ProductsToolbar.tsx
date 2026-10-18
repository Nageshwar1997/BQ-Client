import { Button, Input, Select } from '@beautinique/frontend-components';
import { useQueryParamInput, useQueryParams } from '@beautinique/frontend-hooks';

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
        className="min-w-0 flex-1 basis-full sm:basis-64"
        onSubmit={(event) => {
          event.preventDefault();
          search.flush();
        }}
      >
        <Input
          inputProps={{
            type: 'search',
            // the field has no label on its border, so this is its name
            'aria-label': 'Search products',
            placeholder: 'Search products, brands…',
            autoComplete: 'off',
            value: search.value,
            onChange: (event) => {
              search.setValue(event.target.value);
            },
            className: '[&::-webkit-search-cancel-button]:hidden',
          }}
          icons={{
            left: { icon: 'solar:magnifer-linear', className: 'text-primary/50 size-4.5' },
            right: search.value
              ? {
                  icon: 'lucide:x',
                  label: 'Clear search',
                  onClick: clearSearch,
                  className:
                    'text-primary/50 hover:text-primary size-4 transition-colors duration-200',
                }
              : undefined,
          }}
        />
      </form>

      <div className="flex w-full items-stretch gap-3 sm:w-auto">
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

        {/* the filters sit beside the list on a wide screen: the button is for the narrow one */}
        <Button
          pattern="transparent"
          content={activeFilters > 0 ? `Filters (${String(activeFilters)})` : 'Filters'}
          leftIcon={{ icon: 'solar:filter-linear', className: 'size-4' }}
          // as tall as the sort field beside it (the button's own padding is for a bigger button)
          className="w-auto! shrink-0 py-0! lg:hidden"
          buttonProps={{ onClick: onOpenFilters }}
        />
      </div>
    </div>
  );
};

export default ProductsToolbar;
