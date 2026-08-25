type ProductInventorySkeletonProps = {
  viewType: 'grid' | 'list';
};

const GridSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={`inventory-grid-skeleton-${index}`}
          className="border-neutral-gray-200 bg-neutral-gray-100 flex items-center justify-between gap-10 rounded-xl border p-2"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="bg-neutral-gray-300 size-12 animate-pulse rounded-xl" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="bg-neutral-gray-300 h-3.5 w-40 animate-pulse rounded-full" />
              <div className="bg-neutral-gray-200 h-3 w-28 animate-pulse rounded-full" />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <div className="bg-neutral-gray-200 h-8 w-36 animate-pulse rounded-full" />
            <div className="bg-neutral-gray-200 h-8 w-8 animate-pulse rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

const ListSkeleton = () => {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {[
                'Product Name',
                'Product ID',
                'Category',
                'Price',
                'Experiences',
                '',
              ].map((column, index) => (
                <th
                  key={`${column}-${index}`}
                  className="text-neutral-gray-700 font-metropolis rounded-lg px-4 py-3 text-center text-sm font-medium tracking-wider whitespace-nowrap uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, index) => (
              <tr
                key={`inventory-list-skeleton-${index}`}
                className={
                  index % 2 === 0
                    ? 'bg-neutral-gray-100'
                    : 'bg-neutral-gray-150'
                }
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-neutral-gray-300 h-8 w-8 animate-pulse rounded" />
                    <div className="bg-neutral-gray-300 h-3.5 w-28 animate-pulse rounded-full" />
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="bg-neutral-gray-200 mx-auto h-3.5 w-24 animate-pulse rounded-full" />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="bg-neutral-gray-200 mx-auto h-3.5 w-20 animate-pulse rounded-full" />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="bg-neutral-gray-200 mx-auto h-3.5 w-16 animate-pulse rounded-full" />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="bg-neutral-gray-200 mx-auto h-8 w-36 animate-pulse rounded-full" />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="bg-neutral-gray-200 mx-auto h-8 w-8 animate-pulse rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductInventorySkeleton = ({
  viewType,
}: ProductInventorySkeletonProps) => {
  return viewType === 'list' ? <ListSkeleton /> : <GridSkeleton />;
};

export default ProductInventorySkeleton;
