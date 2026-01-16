import type { IScrollableGradientContainer, TGradientPos } from '../../../types';
import { LinearGradient } from '../../ui/LinearGradient';

const ScrollableGradientContainer = ({
  className = '',
  ref,
  children,
  gradient = {},
  gradientClassName = '',
}: IScrollableGradientContainer) => {
  const isVertical = !!(gradient.top || gradient.bottom);
  const isHorizontal = !!(gradient.left || gradient.right);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {Object.entries(gradient).map(([key, value]) =>
        value ? (
          <LinearGradient key={key} position={key as TGradientPos} className={gradientClassName} />
        ) : null,
      )}
      <div
        ref={ref}
        className={`relative z-0 h-full w-full scroll-smooth ${isVertical ? 'overflow-y-auto' : ''} ${isHorizontal ? 'overflow-x-auto whitespace-nowrap' : ''} `}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollableGradientContainer;
