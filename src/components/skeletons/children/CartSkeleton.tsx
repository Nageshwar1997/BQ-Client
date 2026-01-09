import { Fragment } from "react";
import Skeleton from "..";

const CartSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="max-w-28 h-8!" />
        <div className="h-full space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="p-2 flex gap-4 border shadow-md shadow-primary-10 border-primary-10 rounded-xl"
            >
              <div className="space-y-2.5">
                <Skeleton className="w-24 h-24! rounded-xs shadow-sm" />
                <div className="grow w-24 flex items-center justify-center gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className={`h-6 ${
                        index === 1 ? "w-4!" : "w-6! rounded-full!"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex-1 grow flex flex-col justify-between">
                <div className="w-full space-y-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className={`max-w-28 ${
                        index === 0
                          ? "h-5! max-w-lg!"
                          : index === 1
                          ? "max-w-24"
                          : "h-3.75!"
                      }`}
                    />
                  ))}
                </div>
                <Skeleton className="max-w-25.25 h-7 rounded-sm!" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 max-w-93 w-full lg:sticky top-16">
        <Skeleton className="max-w-28 h-8! mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Fragment key={index}>
              <Skeleton className="h-6" />
              {index === 1 && <div className="border-t border-t-primary-10" />}
            </Fragment>
          ))}
        </div>
        <Skeleton className="h-12! mt-5 rounded-lg!" />
        <Skeleton className="h-5! mt-3" />
      </div>
    </div>
  );
};

export default CartSkeleton;
