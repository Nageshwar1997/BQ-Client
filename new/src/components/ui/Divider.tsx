import type { TClassName } from '@/types/component.type';

const Divider = ({ className = '' }: TClassName) => (
  <hr className={`w-full bg-hr-line block h-px border-none ${className}`} />
);

export default Divider;
