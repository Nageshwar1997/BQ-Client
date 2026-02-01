import type { TClassName } from '../../../types';

export const Skeleton = ({ className }: TClassName) => {
  return <div className={`bg-primary/50 h-4 w-full animate-pulse rounded-xs ${className}`} />;
};
