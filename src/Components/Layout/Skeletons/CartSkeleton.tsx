import { Fragment } from 'react';
import { Skeleton } from './Skeleton';

export const CartSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="flex-1 space-y-6 p-6">
        <Skeleton className="h-8! max-w-28" />
        <div className="h-full space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="shadow-primary/10 border-primary/10 flex gap-4 rounded-xl border p-2 shadow-md"
            >
              <div className="space-y-2.5">
                <Skeleton className="h-24! w-24 rounded-xs shadow-sm" />
                <div className="flex w-24 grow items-center justify-center gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className={`h-6 ${index === 1 ? 'w-4!' : 'w-6! rounded-full!'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-1 grow flex-col justify-between">
                <div className="w-full space-y-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className={`max-w-28 ${
                        index === 0 ? 'h-5! max-w-lg!' : index === 1 ? 'max-w-24' : 'h-3.75!'
                      }`}
                    />
                  ))}
                </div>
                <Skeleton className="h-7 max-w-25.25 rounded-sm!" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="top-16 w-full max-w-93 p-6 lg:sticky">
        <Skeleton className="mb-6 h-8! max-w-28" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Fragment key={index}>
              <Skeleton className="h-6" />
              {index === 1 && <div className="border-t-primary/10 border-t" />}
            </Fragment>
          ))}
        </div>
        <Skeleton className="mt-5 h-12! rounded-lg!" />
        <Skeleton className="mt-3 h-5!" />
      </div>
    </div>
  );
};
