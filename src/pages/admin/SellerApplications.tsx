import { SORT_MAP } from '@beautinique/frontend-constants';
import type { TSort } from '@beautinique/frontend-types';
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
import Badge from '@/components/ui/Badge';
import { SELLER_APPLICATIONS_TABLE_TITLES, SELLER_STATUSES_MAP } from '@/constants/api.constants';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetSellerApplications } from '@/services/organization-service/seller.service.query';
import type { TSellerApplicationSortBy, TSellerStatus } from '@/types/api.type';
import { formatDate } from '@/utils/common.util';

const STATUS_TABS: { label: string; value: TSellerStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: SELLER_STATUSES_MAP.PENDING },
  { label: 'Approved', value: SELLER_STATUSES_MAP.APPROVED },
  { label: 'Rejected', value: SELLER_STATUSES_MAP.REJECTED },
];

const statusBadgeClassName = (status: TSellerStatus) => {
  switch (status) {
    case SELLER_STATUSES_MAP.APPROVED:
      return 'border-primary-green/30 bg-primary-green/10 text-primary-green';
    case SELLER_STATUSES_MAP.REJECTED:
      return 'border-primary-red/30 bg-primary-red/10 text-primary-red';
    case SELLER_STATUSES_MAP.PENDING:
    default:
      return 'border-primary-yellow/30 bg-primary-yellow/10 text-primary-yellow';
  }
};

const SellerApplications = () => {
  const { queryParams, setParams } = useQueryParams();
  const { ref, inView } = useInView();

  const activeStatus = queryParams.status?.toUpperCase() as TSellerStatus | undefined;

  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
  } = useGetSellerApplications({
    search: queryParams.search,
    status: activeStatus,
    sortBy: (queryParams.sortBy ?? 'updatedAt') as TSellerApplicationSortBy,
    sortOrder: (queryParams.sortOrder ?? SORT_MAP.desc) as TSort,
  });

  const handleSort = (sortBy: TSellerApplicationSortBy) => {
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {STATUS_TABS.map((tab) => {
          const active = (activeStatus ?? 'ALL') === tab.value;
          const count = data?.counts?.[tab.value];

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setParams({ status: tab.value === 'ALL' ? '' : tab.value });
              }}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'border-blue-crayola-c bg-accent-duo text-white'
                  : 'border-primary/10 text-primary/60 hover:text-primary'
              }`}
            >
              {tab.label}
              {typeof count === 'number' && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      <div className="border-primary/10 bg-secondary-invert overflow-hidden rounded-xl border">
        {!!data?.applications.length && (
          <ScrollableGradientContainer
            direction="horizontal"
            gradientClassNames={{ left: 'from-secondary-invert', right: 'from-secondary-invert' }}
          >
            <Table className="relative text-xs">
              <TableHead>
                <TableRow>
                  {SELLER_APPLICATIONS_TABLE_TITLES.map(({ label, sortKey }, index) => (
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
                {data.applications.map((application, index) => (
                  <TableRow
                    key={`${application._id}-${String(index)}`}
                    tabIndex={0}
                    className="border-y-primary/5 odd:bg-primary/5 even:bg-primary/2.5 border-y first:border-t-0 last:border-b-0 [&>td]:px-3 [&>td]:py-2 [&>td]:text-xs"
                    ref={index === data.applications.length - 4 ? ref : undefined}
                  >
                    <TableRowCell>{index + 1}</TableRowCell>
                    <TableRowCell>
                      <Link className="mx-auto block size-4.5 shrink-0" to={application._id}>
                        <Icon
                          icon="solar:eye-linear"
                          className="text-primary hover:text-blue-crayola-c mx-auto size-full"
                        />
                      </Link>
                    </TableRowCell>
                    <TableRowCell>
                      <p className="max-w-sm truncate text-left">{application.businessName}</p>
                    </TableRowCell>
                    {/* TODO: show the applicant's name/email once the admin endpoint populates
                    userId, mirroring TApiProductPopulated.seller for products. */}
                    <TableRowCell>
                      <p className="max-w-sm truncate">{application.userId}</p>
                    </TableRowCell>
                    <TableRowCell>{application.gstin}</TableRowCell>
                    <TableRowCell>
                      <Badge
                        content={application.status}
                        className={statusBadgeClassName(application.status)}
                      />
                    </TableRowCell>
                    <TableRowCell>
                      {formatDate(application.createdAt, { month: '2-digit' })}
                    </TableRowCell>
                    <TableRowCell>
                      {formatDate(application.updatedAt, { month: '2-digit' })}
                    </TableRowCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableGradientContainer>
        )}

        {(isLoading ||
          isFetchingNextPage ||
          isError ||
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- mirrors Products.tsx
          isFetchNextPageError ||
          data?.applications.length === 0) && (
          <div
            className={`flex items-center justify-center ${!isFetchingNextPage ? 'min-h-[40dvh]' : ''}`}
          >
            {isLoading || isFetchingNextPage ? (
              <LoadingText
                text={isLoading ? 'Loading applications...' : 'Loading more applications...'}
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
                    ? 'Failed to load applications'
                    : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see note above
                      isFetchNextPageError
                      ? 'Failed to load more applications'
                      : 'No seller applications yet'
                }
                description={
                  isError
                    ? 'Something went wrong while fetching seller applications. Please try again.'
                    : // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- see note above
                      isFetchNextPageError
                      ? 'Something went wrong while fetching more applications. Please try again.'
                      : 'No one has applied to become a seller yet.'
                }
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerApplications;
