import type { TClassName } from '@/Types/Common.type';

export const Skeleton = ({ className }: TClassName) => {
  return <div className={`bg-primary/50 h-4 w-full animate-pulse rounded-xs ${className}`} />;
};
