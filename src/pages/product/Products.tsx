import { SORT_MAP } from '@beautinique/frontend-constants';
import type { TProductStatus, TSort } from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

import ApiStatus from '@/components/layout/ApiStatus';
import ScrollableGradientContainer from '@/components/layout/containers/ScrollableGradientContainer';
import LoadingText from '@/components/layout/loaders/LoadingText';
import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  TableRow,
  TableRowCell,
} from '@/components/layout/table';
import { PRODUCTS_TABLE_TITLES } from '@/constants/api.constants';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetDashboardProducts } from '@/services/product-service/product.service.query';
import type { TProductSortBy } from '@/types/api.type';
import { formatDate, formatINRCurrency } from '@/utils/common.util';

const Products = () => {
  const { queryParams, setParams } = useQueryParams();
  const { ref, inView } = useInView();

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetDashboardProducts({
    search: queryParams.search,
    status: queryParams.status?.toUpperCase() as TProductStatus,
    sortBy: (queryParams.sortBy ?? 'updatedAt') as TProductSortBy,
    sortOrder: (queryParams.sortOrder ?? SORT_MAP.desc) as TSort,
    category: queryParams.category,
  });

  const handleSort = (sortBy: TProductSortBy) => {
    const currentSortBy = queryParams.sortBy;
    const currentSortOrder = queryParams.sortOrder ?? SORT_MAP.desc;

    const nextOrder =
      currentSortBy === sortBy
        ? currentSortOrder === SORT_MAP.asc
          ? SORT_MAP.desc
          : SORT_MAP.asc
        : SORT_MAP.desc;

    setParams({ sortBy, sortOrder: nextOrder });
  };

  useEffect(() => {
    if (inView && hasNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
      {!!data?.products.length && (
        <ScrollableGradientContainer
          direction="horizontal"
          gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
        >
          <Table className="relative text-xs">
            <TableHead>
              <TableRow>
                {PRODUCTS_TABLE_TITLES.map(({ label, sortKey }, index) => (
                  <TableHeadCell
                    key={`th-${String(index)}`}
                    className={`${sortKey ? 'hover:text-primary/90 cursor-pointer select-none' : ''} `}
                    onClick={() => {
                      if (sortKey) handleSort(sortKey);
                    }}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {label}
                      {sortKey && (
                        <Icon
                          icon={
                            queryParams.sortBy === sortKey
                              ? queryParams.sortOrder === SORT_MAP.asc
                                ? 'solar:alt-arrow-up-linear'
                                : 'solar:alt-arrow-down-linear'
                              : 'solar:sort-linear'
                          }
                          className="size-3.5 shrink-0"
                        />
                      )}
                    </div>
                  </TableHeadCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.products.map((product, index) => {
                return (
                  <TableRow
                    key={`${product._id}-${String(index)}`}
                    tabIndex={0}
                    className="border-y-primary/5 odd:bg-primary/5 even:bg-primary/2.5 border-y first:border-t-0 last:border-b-0 [&>td]:px-3 [&>td]:py-2 [&>td]:text-xs"
                    ref={index === data.products.length - 4 ? ref : undefined}
                  >
                    <TableRowCell>{index + 1}</TableRowCell>
                    <TableRowCell>
                      <Link className="mx-auto block size-4.5 shrink-0" to={product.slug}>
                        <Icon
                          icon="material-symbols:eye-tracking-outline"
                          className="text-primary hover:text-blue-crayola-c mx-auto size-full"
                        />
                      </Link>
                    </TableRowCell>
                    <TableRowCell className="grid place-items-center">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        loading="lazy"
                        className="border-tertiary/20 aspect-square size-10 rounded-lg border object-cover"
                      />
                    </TableRowCell>
                    <TableRowCell>
                      <p className="max-w-sm truncate text-left">{product.title}</p>
                    </TableRowCell>
                    <TableRowCell>{product.brand}</TableRowCell>
                    <TableRowCell className="text-primary-green font-medium">
                      {formatINRCurrency(product.sellingPrice)}
                    </TableRowCell>
                    <TableRowCell className="text-primary-red font-medium">
                      {formatINRCurrency(product.originalPrice)}
                    </TableRowCell>
                    <TableRowCell>{product.status}</TableRowCell>
                    <TableRowCell>
                      {!product.hasVariants
                        ? product.stock
                        : product.variants.reduce((acc, variant) => acc + variant.stock, 0)}
                    </TableRowCell>
                    <TableRowCell>
                      {formatDate(product.createdAt, { month: '2-digit' })}
                    </TableRowCell>
                    <TableRowCell>
                      {formatDate(product.updatedAt, { month: '2-digit' })}
                    </TableRowCell>
                    <TableRowCell>
                      {product.tryOn.configured && product.tryOn.enabled
                        ? `${product.tryOn.category} - ${product.tryOn.subCategory}`
                        : 'N/A'}
                    </TableRowCell>
                    <TableRowCell>
                      {product.hasVariants ? product.variants.length : 'N/A'}
                    </TableRowCell>
                    <TableRowCell>{product.sku}</TableRowCell>
                    <TableRowCell>{product.slug}</TableRowCell>
                    <TableRowCell>{product.soldCount}</TableRowCell>
                    <TableRowCell>{product.returnCount}</TableRowCell>
                    <TableRowCell>{product.averageRating}</TableRowCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollableGradientContainer>
      )}

      {(isLoading ||
        isFetchingNextPage ||
        isError ||
        // typescript-eslint's no-unnecessary-condition misreads isFetchNextPageError as always
        // falsy for this react-query hook shape, even though tsc confirms it's a real boolean.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        isFetchNextPageError ||
        data?.products.length === 0) && (
        <div
          className={`flex items-center justify-center ${!isFetchingNextPage ? 'min-h-[40dvh]' : ''}`}
        >
          {isLoading || isFetchingNextPage ? (
            <LoadingText
              text={isLoading ? 'Loading products...' : 'Loading more products...'}
              className="my-2"
            />
          ) : (
            <ApiStatus
              className="min-h-0!"
              status={
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see note above
                isError || isFetchNextPageError ? 'error' : 'empty'
              }
              title={
                isError
                  ? 'Failed to load products'
                  : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see note above
                    isFetchNextPageError
                    ? 'Failed to load more products'
                    : 'No products available'
              }
              description={
                isError
                  ? 'Something went wrong while fetching products. Please try again.'
                  : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see note above
                    isFetchNextPageError
                    ? 'Something went wrong while fetching more products. Please try again.'
                    : 'No products have been added yet.'
              }
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
