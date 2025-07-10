import Skeleton from "..";

const SearchModalSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-1 p-1">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="border border-primary-30 flex items-center gap-2 p-1 rounded"
        >
          <Skeleton className="!w-8 h-8 rounded aspect-square" />
          <div className="w-full flex flex-col gap-1">
            <Skeleton />
            <Skeleton className="!h-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchModalSkeleton;
