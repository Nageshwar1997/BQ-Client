import type { TClassName } from '../../types';

export const HR = ({ className = '' }: TClassName) => (
  <hr className={`bg-hr-line block h-px border-none ${className}`} />
);
