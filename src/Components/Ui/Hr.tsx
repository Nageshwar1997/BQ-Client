import type { TClassName } from '@/Types/Common.type';

export const Hr = ({ className = '' }: TClassName) => (
  <hr className={`bg-hr-line block h-px border-none ${className}`} />
);
