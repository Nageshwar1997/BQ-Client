import type { TClassName, TContainerClassName } from '@/typess/component.type';
import type { ReactNode } from 'react';

const BorderGradient = ({
  children,
  className = '',
  containerClassName = '',
}: { children: ReactNode } & TClassName & TContainerClassName) => {
  return (
    <div className={`bg-border-gradient mx-auto w-full rounded-3xl p-px ${containerClassName}`}>
      <div
        className={`shadow-light-dark-soft bg-platinum-black base:p-6 rounded-[23px] p-4 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default BorderGradient;
