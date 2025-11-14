import Skeleton from "..";

export const BlogCardSkeleton = () => (
  <div className="max-w-xs rounded-2xl overflow-hidden shadow-xl shadow-primary-8 hover:shadow-xl hover:shadow-primary-10 transition-all bg-secondary-inverted-50 flex flex-col border border-secondary-30">
    <Skeleton className="h-56" />
    <div className="p-4 flex flex-col gap-2 flex-1 justify-between shadow-light-dark-soft">
      <div className="space-y-1">
        <Skeleton className="h-5" />
        <Skeleton className="h-5 !w-2/3" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className={`h-5 !rounded-full ${
              index === 3 ? "max-w-8" : "max-w-20"
            }`}
          />
        ))}
      </div>
      <div className="space-y-1">
        <Skeleton className="!h-3" />
        <Skeleton className="!h-3" />
        <Skeleton className="!h-3 !w-2/3" />
      </div>
      <div className="flex gap-2 justify-between">
        <Skeleton className="!h-3" />
        <Skeleton className="!h-3" />
      </div>
    </div>
  </div>
);

const BlogCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] mx-auto gap-6">
      {Array.from({ length: 8 })?.map((_, index) => {
        return <BlogCardSkeleton key={index} />;
      })}
    </div>
  );
};

export default BlogCardsSkeleton;
