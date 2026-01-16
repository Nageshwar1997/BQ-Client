import { type ReactNode } from 'react';
import type { TClassName } from '../../types';

const BorderGradient = ({ children, className = '' }: { children: ReactNode } & TClassName) => {
  return (
    <div className={`bg-border-gradient mx-auto w-full rounded-3xl p-px ${className}`}>
      <div className="shadow-light-dark-soft bg-platinum-black base:p-6 rounded-[23px] p-4">
        {children}
      </div>
    </div>
  );
};

export default BorderGradient;
