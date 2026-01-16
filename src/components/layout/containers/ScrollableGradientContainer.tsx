import type { ReactNode, RefObject } from 'react';
import type { TClassName, TGradientPos } from '../../../types';
import { LinearGradient } from '../../ui/LinearGradient';

const ScrollableGradientContainer = ({
  className = '',
  ref,
  children,
  gradient = {},
  gradientClassName = '',
}: {
  ref?: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  gradient: Partial<Record<TGradientPos, boolean>>;
  gradientClassName?: string;
} & TClassName) => {
  return (
    <div ref={ref} className={`relative h-full w-full overflow-hidden ${className}`}>
      <div className="w-full overflow-y-scroll scroll-smooth">
        {Object.entries(gradient).map(
          ([key, value], i) =>
            value && (
              <LinearGradient
                position={key as TGradientPos}
                key={i}
                className={gradientClassName}
              />
            ),
        )}
        {children}
      </div>
    </div>
  );
};

export default ScrollableGradientContainer;
