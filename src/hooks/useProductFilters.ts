import { useQueryParams } from '@beautinique/frontend-hooks';
import { useCallback, useMemo } from 'react';

import { PRODUCT_FILTER_KEYS, PRODUCT_FILTER_PARAMS } from '@/constants/product-listing.constants';
import {
  countActiveFilters,
  type IProductFilters,
  parseProductFilters,
  serializeProductFilters,
} from '@/utils/product-filters.util';

/**
 * The filters of the product listing, kept in the URL (`?brand=A&minPrice=100&sort=rating`): a filtered
 * list can be shared and bookmarked, and the Back button goes to the page before the listing, not
 * through every filter that was tried (a change replaces the entry, it does not add one).
 *
 * `setFilters` changes the filters it is given and leaves the others; `clearFilters` turns every filter
 * off but keeps the search and the order.
 */
export const useProductFilters = () => {
  const { queryParams, setParams, removeParams } = useQueryParams();

  const filters = useMemo(() => parseProductFilters(queryParams), [queryParams]);
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);

  const setFilters = useCallback(
    (change: Partial<Omit<IProductFilters, 'search'>>) => {
      setParams(serializeProductFilters(change), { replace: true });
    },
    [setParams],
  );

  const clearFilters = useCallback(() => {
    removeParams([...PRODUCT_FILTER_KEYS], { replace: true });
  }, [removeParams]);

  const clearSearch = useCallback(() => {
    removeParams(PRODUCT_FILTER_PARAMS.search, { replace: true });
  }, [removeParams]);

  return { filters, activeCount, setFilters, clearFilters, clearSearch };
};
