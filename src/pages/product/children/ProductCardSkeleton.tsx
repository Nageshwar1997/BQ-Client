import { Skeleton } from '@beautinique/frontend-components';

/** The shape of a `ProductCard` while the products are on their way. */
const ProductCardSkeleton = () => (
  <div className="flex flex-col gap-3" aria-hidden="true">
    <Skeleton className="aspect-4/5 size-auto rounded-2xl opacity-20" />
    <div className="flex flex-col gap-2 px-1">
      <Skeleton className="h-3 w-1/3 opacity-20" />
      <Skeleton className="h-4 w-full opacity-20" />
      <Skeleton className="h-4 w-2/3 opacity-20" />
      <Skeleton className="mt-1 h-5 w-1/2 opacity-20" />
    </div>
  </div>
);

export default ProductCardSkeleton;
