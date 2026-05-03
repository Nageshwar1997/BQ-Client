import type { TClassName } from '@/typess/component.type';

const Divider = ({ className = '' }: TClassName) => (
  <hr className={`bg-hr-line block h-px w-full border-none ${className}`} />
);

export default Divider;
