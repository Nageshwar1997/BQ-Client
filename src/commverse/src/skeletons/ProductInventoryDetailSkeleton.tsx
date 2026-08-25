export const ProductDetailSidebarFiltersSkeleton = () => {
  return (
    <div className="flex gap-2">
      <div className="bg-neutral-gray-100 border-neutral-gray-300 h-10 flex-1 animate-pulse rounded-xl border" />
      <div className="bg-neutral-gray-100 border-neutral-gray-300 h-10 flex-1 animate-pulse rounded-xl border" />
    </div>
  );
};

export const ProductDetailSidebarDataSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 pb-1">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={`product-detail-sidebar-data-skeleton-${index}`}
          className="flex items-start gap-3 rounded-2xl px-2 py-2"
        >
          <div className="bg-neutral-gray-100 h-16 w-16 animate-pulse rounded-xl" />
          <div className="flex min-w-0 flex-1 flex-col gap-2 pt-3">
            <div className="bg-neutral-gray-400 h-4 w-30 animate-pulse rounded-full" />
            <div className="bg-neutral-gray-400 h-3 w-24 animate-pulse rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

type ProductInventoryDetailContentSkeletonProps = {
  type?: 'experience' | 'assets';
};

export const ProductSummarySkeleton = () => {
  return (
    <div className="flex justify-between gap-6 py-5.75 pr-12 pl-8">
      <div className="flex gap-4">
        <div className="border-neutral-gray-300 bg-neutral-gray-300 h-30 w-31.5 animate-pulse rounded-xl border" />
        <div className="flex flex-col gap-2 py-2">
          <div className="bg-neutral-gray-300 h-6 w-36 animate-pulse rounded-full" />
          <div className="bg-neutral-gray-300 h-4 w-44 animate-pulse rounded-full" />
          <div className="bg-neutral-gray-300 h-4 w-28 animate-pulse rounded-full" />
          <div className="bg-neutral-gray-300 h-6 w-20 animate-pulse rounded-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="bg-neutral-gray-300 h-11 w-50 animate-pulse rounded-2xl opacity-85" />
        <div className="bg-neutral-gray-300 size-10.5 animate-pulse rounded-xl" />
      </div>
    </div>
  );
};

const ExperienceCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-4 gap-3 pb-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`product-detail-experience-card-skeleton-${index}`}
          className="border-neutral-gray-300 rounded-3xl border bg-white p-3"
        >
          <div className="bg-neutral-gray-300 mb-3 h-35 w-full animate-pulse rounded-2xl" />
          <div className="bg-neutral-gray-300 mb-2 h-4 w-28 animate-pulse rounded-full" />
          <div className="bg-neutral-gray-300 mb-4 h-3.5 w-20 animate-pulse rounded-full" />
          <div className="flex gap-2">
            <div className="bg-neutral-gray-300 h-8 flex-1 animate-pulse rounded-xl" />
            <div className="bg-neutral-gray-300 h-8 w-8 animate-pulse rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
};

const AssetCardsSkeleton = () => {
  return (
    <div className="grid w-full grid-cols-4 gap-3 pb-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={`product-detail-asset-card-skeleton-${index}`}
          className="border-neutral-gray-300 rounded-3xl border bg-white p-3"
        >
          <div className="bg-neutral-gray-300 mb-3 h-50 w-full animate-pulse rounded-2xl" />
          <div className="bg-neutral-gray-300 mb-2 h-4 w-24 animate-pulse rounded-full" />
          <div className="bg-neutral-gray-300 h-3.5 w-32 animate-pulse rounded-full" />
        </div>
      ))}
    </div>
  );
};

export const ProductInventoryDetailExperienceSectionSkeleton = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="w-full overflow-x-auto pb-1">
        <div className="flex items-center gap-2 pr-4 whitespace-nowrap">
          <div className="bg-neutral-gray-900 h-14 w-22 shrink-0 animate-pulse rounded-xl" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`experience-tab-skeleton-${index}`}
              className="border-neutral-gray-300 h-14 w-38 shrink-0 animate-pulse rounded-xl border bg-white"
            />
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1">
        <div>
          <div className="bg-neutral-gray-300 mb-3 h-8 w-52 animate-pulse rounded-full" />
          <ExperienceCardsSkeleton />
        </div>
        <div>
          <div className="bg-neutral-gray-300 mb-3 h-8 w-20 animate-pulse rounded-full" />
          <ExperienceCardsSkeleton />
        </div>
      </div>
    </div>
  );
};

export const ProductInventoryDetailAssetsSectionSkeleton = () => {
  return (
    <div className="flex h-full min-h-0 flex-col gap-5">
      <div className="flex min-w-max gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`asset-tab-skeleton-${index}`}
            className={`border-neutral-gray-300 h-14 shrink-0 animate-pulse rounded-xl border ${
              index === 0 ? 'bg-neutral-gray-200 w-18' : 'w-38 bg-white'
            }`}
          />
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1">
        <div>
          <div className="bg-neutral-gray-300 mb-3 h-8 w-64 animate-pulse rounded-full" />
          <AssetCardsSkeleton />
        </div>
        <div>
          <div className="bg-neutral-gray-300 mb-3 h-8 w-56 animate-pulse rounded-full" />
          <AssetCardsSkeleton />
        </div>
      </div>
    </div>
  );
};

export const ProductInventoryDetailContentSkeleton = ({
  type = 'experience',
}: ProductInventoryDetailContentSkeletonProps) => {
  return (
    <div className="bg-neutral-gray-100 flex h-full w-full flex-col overflow-hidden">
      <header className="border-neutral-gray-300 flex justify-between border-b py-7 pr-12 pl-8">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-gray-300 size-6 animate-pulse rounded-full" />
          <div className="bg-neutral-gray-300 h-8 w-48 animate-pulse rounded-full" />
        </div>
        <div className="bg-neutral-gray-300 size-9 animate-pulse rounded-full" />
      </header>

      <ProductSummarySkeleton />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-hidden pr-12 pb-0 pl-8">
        <div className="bg-neutral-gray-200 border-neutral-gray-300 grid h-18 shrink-0 grid-cols-2 rounded-2xl border p-1">
          <div className="h-full animate-pulse rounded-xl bg-white" />
          <div className="h-full animate-pulse rounded-xl" />
        </div>

        <div className="min-h-0 flex-1">
          {type === 'experience' ? (
            <ProductInventoryDetailExperienceSectionSkeleton />
          ) : (
            <ProductInventoryDetailAssetsSectionSkeleton />
          )}
        </div>
      </div>
    </div>
  );
};
