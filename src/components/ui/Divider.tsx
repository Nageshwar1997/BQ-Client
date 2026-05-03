import type { TClassName } from '@/types/component.type';

const Divider = ({ className = '' }: TClassName) => (
  <hr className={`bg-hr-line block h-px w-full border-none ${className}`} />
);

export default Divider;
