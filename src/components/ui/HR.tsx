import type { TClassName } from '@/Types';

export const HR = ({ className = '' }: TClassName) => (
  <hr className={`bg-hr-line block h-px border-none ${className}`} />
);
