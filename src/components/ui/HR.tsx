import type { TClassName } from '../../types';

export const HR = ({ className = '' }: TClassName) => {
  return <hr className={`bg-hr-line mb-4 block h-px border-none ${className}`} />;
};
