import { Skeleton } from '@beautinique/frontend-components';

/** The shape of the page of a product while it comes: the gallery on one side, the lines of the name, price and choices on the other. */
const ProductDetailsSkeleton = () => (
  <div role="status" aria-busy="true" className="grid items-start gap-8 lg:grid-cols-2 xl:gap-14">
    <span className="sr-only">Loading product</span>

    <div aria-hidden="true" className="flex flex-col gap-4">
      <Skeleton className="aspect-square size-auto rounded-3xl opacity-20" />
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((index) => (
          <Skeleton key={index} className="size-16 rounded-xl opacity-20" />
        ))}
      </div>
    </div>

    <div aria-hidden="true" className="flex flex-col gap-5">
      <Skeleton className="h-4 w-24 opacity-20" />
      <Skeleton className="h-10 w-4/5 opacity-20" />
      <Skeleton className="h-4 w-48 opacity-20" />
      <Skeleton className="h-4 w-full opacity-20" />
      <Skeleton className="h-10 w-40 opacity-20" />
      <div className="flex gap-3">
        {[0, 1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="size-11 rounded-full opacity-20" />
        ))}
      </div>
      <Skeleton className="h-12 w-full rounded-lg opacity-20" />
      <Skeleton className="h-24 w-full opacity-20" />
    </div>
  </div>
);

export default ProductDetailsSkeleton;
