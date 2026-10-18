import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';

interface IFilterSection {
  title: string;
  children: ReactNode;
  /** The section is open when the page opens. @default true */
  defaultOpen?: boolean;
}

/** One group of filters that can be folded away (a native `<details>`, so it works with the keyboard and is announced). */
const FilterSection = ({ title, children, defaultOpen = true }: IFilterSection) => (
  <details
    open={defaultOpen}
    className="group border-primary/10 border-b py-4 first:pt-0 last:border-b-0"
  >
    <summary className="focus-visible:outline-blue-crayola-c flex cursor-pointer list-none items-center justify-between gap-2 rounded-md text-sm font-semibold outline-offset-4 select-none [&::-webkit-details-marker]:hidden">
      {title}
      <Icon
        icon="solar:alt-arrow-down-linear"
        className="text-silver-jet size-4 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </summary>
    <div className="pt-3">{children}</div>
  </details>
);

export default FilterSection;
