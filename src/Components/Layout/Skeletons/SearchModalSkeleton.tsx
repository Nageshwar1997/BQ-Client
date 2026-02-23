import { Skeleton } from './Skeleton';

export const SearchModalSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="flex w-full flex-col gap-1 p-1">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="border-primary/30 flex items-center gap-2 rounded-sm border p-1"
        >
          <Skeleton className="aspect-square size-8 rounded-sm" />
          <div className="flex w-full flex-col gap-1">
            <Skeleton />
            <Skeleton className="h-3!" />
          </div>
        </div>
      ))}
    </div>
  );
};
