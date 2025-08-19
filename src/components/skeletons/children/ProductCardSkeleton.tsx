import Skeleton from "..";
import { StarFillIcon } from "../../../icons";
import { ClassName } from "../../../types";

const ProductCardSkeleton = ({ className = "" }: ClassName) => {
  return (
    <div
      className={`p-4 rounded-lg shadow-sm bg-primary-inverted flex flex-col gap-4 border-rounded-corners-gradient cursor-pointer h-full ${className}`}
    >
      <Skeleton className="w-full h-full aspect-square rounded-lg overflow-hidden" />
      <hr className="h-px block border-none bg-gradient-line animate-pulse" />
      <div className="flex flex-col justify-between gap-2 grow">
        <Skeleton />
        <Skeleton className="w-2/3" />
        <Skeleton className="!w-1/2" />
        <Skeleton className="w-2/3" />
        <div className=" flex items-center gap-3">
          <Skeleton className="w-1/4" />
          <Skeleton className="w-1/4" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarFillIcon
                key={index}
                className="stroke-none fill-primary-50 animate-pulse"
              />
            ))}
          </div>
          <Skeleton className="!w-6 h-6 !rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
