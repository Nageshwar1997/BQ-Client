import { ApiStatus, Button, ModalWrapper } from '@beautinique/frontend-components';
import { useIsSmallScreen } from '@beautinique/frontend-hooks';
import { useEffect, useMemo, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { PRODUCTS_PAGE_SIZE } from '@/constants/product-listing.constants';
import { useProductFilters } from '@/hooks/useProductFilters';
import { useGetProducts } from '@/services/product-service/product.service.query';
import type { TCategoryHierarchy } from '@/types/api.type';
import { type TCategoryNode } from '@/utils/category.util';
import { toProductsQuery } from '@/utils/product-filters.util';

import ActiveFilters from './ActiveFilters';
import CategoryNav from './CategoryNav';
import FiltersSidebar from './FiltersSidebar';
import ListingBreadcrumb from './ListingBreadcrumb';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import ProductFiltersPanel from './ProductFilters';
import ProductsToolbar from './ProductsToolbar';

interface IProductListing {
  title: string;
  description?: string;
  /** The category the page is of: only its products (and those of the categories under it) are listed. */
  category?: TCategoryNode;
  /** The categories from the main one down to `category`. */
  trail?: TCategoryNode[];
  /** The tree of categories, for the links beside the list. */
  categories?: TCategoryHierarchy[];
}

const NO_TRAIL: TCategoryNode[] = [];

/** The next page is asked for when the card this many from the end comes into view. */
const PREFETCH_FROM_END = 4;

// one card under 350px (two would be too narrow to read), then 2, 3, 4 and 5 across
const GRID =
  'grid grid-cols-1 gap-x-3 gap-y-8 min-[350px]:grid-cols-2 sm:gap-x-4 md:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5';

/**
 * The storefront listing of products - the page of all of them and the page of one category are this.
 * Search, order and filters live in the URL; the list comes a page at a time as it is scrolled to, from the
 * public listing of the product service. The filters sit beside the list on a wide screen and open in a
 * sheet on a narrow one.
 */
const ProductListing = ({
  title,
  description,
  category,
  trail = NO_TRAIL,
  categories,
}: IProductListing) => {
  const { filters, activeCount, setFilters, clearFilters, clearSearch } = useProductFilters();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  // The filters are in one place: beside the list on a wide screen, in a sheet on a narrow one.
  const isNarrow = useIsSmallScreen(1023);

  const query = useMemo(() => toProductsQuery(filters, category?._id), [filters, category?._id]);

  const {
    data,
    isLoading,
    isError,
    isPlaceholderData,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetProducts(query);

  // The page scrolls inside a container of the app, not the window, so a margin around the screen would not
  // reach past it: the card a few from the end asks for the next page when it comes into view.
  const { ref: sentinelRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, isFetchNextPageError, fetchNextPage]);

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const isEmpty = !isLoading && !isError && products.length === 0;
  const isFiltered = activeCount > 0 || !!filters.search;

  const clearAll = () => {
    clearFilters();
    clearSearch();
  };

  const filtersPanel = (
    <ProductFiltersPanel
      filters={filters}
      facets={data?.filters}
      onChange={setFilters}
      header={
        categories && categories.length > 0 ? (
          <CategoryNav categories={categories} trail={trail} />
        ) : undefined
      }
    />
  );

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:flex-row lg:items-start">
      {!isNarrow && <FiltersSidebar>{filtersPanel}</FiltersSidebar>}

      <div className="lg:border-l-silver/30 min-w-0 flex-1 px-3 pt-6 pb-16 sm:px-5 lg:border-l lg:px-8">
        <header className="flex flex-col gap-3 pb-5">
          <ListingBreadcrumb trail={trail} />
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="text-silver-jet text-sm">
              {isLoading
                ? 'Loading…'
                : `${total.toLocaleString('en-IN')} ${total === 1 ? 'product' : 'products'}`}
            </p>
          </div>
          {description && (
            <p className="text-tertiary max-w-3xl text-sm leading-6">{description}</p>
          )}
        </header>

        <div className="bg-primary-invert/85 sm:sticky sm:top-16 sm:z-30 sm:-mx-5 sm:px-5 sm:py-3 sm:backdrop-blur-md lg:-mx-8 lg:px-8">
          <ProductsToolbar
            sort={filters.sort}
            hasSearch={!!filters.search}
            onSortChange={(sort) => {
              setFilters({ sort });
            }}
            activeFilters={activeCount}
            onOpenFilters={() => {
              setIsFiltersOpen(true);
            }}
          />
        </div>

        <div className="mt-3">
          <ActiveFilters
            filters={filters}
            onChange={setFilters}
            onClearSearch={clearSearch}
            onClearAll={clearAll}
          />
        </div>

        <div className="mt-5">
          <section
            aria-label="Products"
            aria-busy={isLoading || isPlaceholderData}
            className="min-w-0 flex-1"
          >
            <p role="status" className="sr-only">
              {isLoading || isPlaceholderData
                ? 'Loading products'
                : `${String(total)} ${total === 1 ? 'product' : 'products'} found`}
            </p>

            {isLoading && (
              <div className={GRID}>
                {Array.from({ length: PRODUCTS_PAGE_SIZE }, (_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            )}

            {isError && !data && (
              <>
                <ApiStatus
                  status="error"
                  title="We could not load the products"
                  description="Something went wrong on our side. Please try again."
                  className="min-h-[40dvh]"
                />
                <div className="mx-auto w-full max-w-48">
                  <Button
                    pattern="outline"
                    content="Try again"
                    leftIcon={{ icon: 'solar:refresh-linear' }}
                    buttonProps={{
                      onClick: () => {
                        void refetch();
                      },
                    }}
                  />
                </div>
              </>
            )}

            {isEmpty && (
              <>
                <ApiStatus
                  status="empty"
                  title={isFiltered ? 'No products match your filters' : 'No products here yet'}
                  description={
                    isFiltered
                      ? 'Try removing a filter or searching for something else.'
                      : 'New products are added all the time - please check back soon.'
                  }
                  className="min-h-[40dvh]"
                />
                {isFiltered && (
                  <div className="mx-auto w-full max-w-56">
                    <Button
                      pattern="outline"
                      content="Clear all filters"
                      buttonProps={{ onClick: clearAll }}
                    />
                  </div>
                )}
              </>
            )}

            {products.length > 0 && (
              <ul
                className={`${GRID} transition-opacity duration-300 motion-reduce:transition-none ${
                  isPlaceholderData ? 'opacity-50' : ''
                }`}
              >
                {products.map((product, index) => (
                  <li
                    key={product._id}
                    ref={
                      index === Math.max(products.length - PREFETCH_FROM_END, 0)
                        ? sentinelRef
                        : undefined
                    }
                    className="flex"
                  >
                    <ProductCard product={product} priority={index < 4} />
                  </li>
                ))}
                {isFetchingNextPage &&
                  Array.from({ length: 4 }, (_, index) => (
                    <li key={`next-${String(index)}`}>
                      <ProductCardSkeleton />
                    </li>
                  ))}
              </ul>
            )}

            {products.length > 0 && (
              <div className="flex flex-col items-center gap-3 pt-10">
                <p className="text-silver-jet text-xs">
                  Showing {products.length.toLocaleString('en-IN')} of{' '}
                  {total.toLocaleString('en-IN')}
                </p>
                {/* what the scroll would do, for the keyboard, and for when the scroll failed */}
                {hasNextPage && !isFetchingNextPage && (
                  <div className="w-full max-w-56">
                    <Button
                      pattern="outline"
                      content={isFetchNextPageError ? 'Try again' : 'Load more'}
                      buttonProps={{
                        onClick: () => {
                          void fetchNextPage();
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <ModalWrapper
        isOpen={isFiltersOpen && isNarrow}
        onClose={() => {
          setIsFiltersOpen(false);
        }}
        header={{ title: 'Filters', showCloseIcon: true }}
        containerProps={{ className: 'items-end! p-0! sm:items-center! sm:p-8!' }}
        // the sheet is drawn in <body>, outside the app root that sets the text colour
        className="text-primary max-h-[88dvh]! max-w-none! rounded-b-none! sm:max-w-md! sm:rounded-b-xl!"
      >
        {/* `isolate`: the z-indexes inside the filters (the slider thumbs, the bars of the radios) stay inside, under the buttons below */}
        <div className="isolate w-full min-w-0">{filtersPanel}</div>
        <div className="bg-primary-invert border-primary/10 sticky -bottom-4 z-40 -mx-4 mt-4 -mb-4 flex w-[calc(100%+2rem)] gap-3 border-t p-4">
          {activeCount > 0 && (
            <Button
              pattern="transparent"
              content="Clear all"
              buttonProps={{ onClick: clearFilters }}
            />
          )}
          <Button
            pattern="primary"
            content={
              isLoading
                ? 'Show products'
                : `Show ${total.toLocaleString('en-IN')} ${total === 1 ? 'product' : 'products'}`
            }
            buttonProps={{
              onClick: () => {
                setIsFiltersOpen(false);
              },
            }}
          />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default ProductListing;
