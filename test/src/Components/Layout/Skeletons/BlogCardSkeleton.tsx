import { Skeleton } from '.';

export const BlogCardSkeleton = () => (
  <div className="shadow-primary/8 hover:shadow-primary/10 bg-secondary-inverted/50 border-secondary/30 flex max-w-xs flex-col overflow-hidden rounded-2xl border shadow-xl transition-all hover:shadow-xl">
    <Skeleton className="h-56" />
    <div className="shadow-light-dark-soft flex flex-1 flex-col justify-between gap-2 p-4">
      <div className="space-y-1">
        <Skeleton className="h-5" />
        <Skeleton className="h-5 w-2/3!" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-5 rounded-full! ${index === 3 ? 'max-w-8' : 'max-w-20'}`}
          />
        ))}
      </div>
      <div className="space-y-1">
        <Skeleton className="h-3!" />
        <Skeleton className="h-3!" />
        <Skeleton className="h-3! w-2/3!" />
      </div>
      <div className="flex justify-between gap-2">
        <Skeleton className="h-3!" />
        <Skeleton className="h-3!" />
      </div>
    </div>
  </div>
);

export const BlogCardsSkeleton = () => {
  return (
    <div className="mx-auto grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-6">
      {Array.from({ length: 8 })?.map((_, index) => {
        return <BlogCardSkeleton key={index} />;
      })}
    </div>
  );
};
