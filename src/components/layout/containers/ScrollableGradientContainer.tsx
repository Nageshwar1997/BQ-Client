import { useScrollable } from '../../../hooks';
import type { IScrollableGradientContainer, TGradientPos } from '../../../types';
import { LinearGradient } from '../../ui/LinearGradient';

const ScrollableGradientContainer = ({
  className = '',
  children,
  containerClassName = '',
  gradientClassName = '',
  direction,
}: IScrollableGradientContainer) => {
  const { showGradient, containerRef } = useScrollable(direction);

  const isHorizontal = direction === 'horizontal';
  const isVertical = direction === 'vertical';
  const gradients = Object.entries(showGradient).filter(([_key, value]) => !!value);

  return (
    <div className={`relative h-full w-full overflow-hidden ${containerClassName}`}>
      {gradients.map(([key]) => (
        <LinearGradient key={key} position={key as TGradientPos} className={gradientClassName} />
      ))}

      <div
        ref={containerRef}
        className={`relative z-0 h-full w-full scroll-smooth ${isVertical ? 'overflow-y-auto' : ''} ${isHorizontal ? 'overflow-x-auto whitespace-nowrap' : ''} ${className} `}
      >
        <div
          className={`flex gap-2 ${isVertical ? 'flex-col' : 'flex-row'} ${
            isVertical
              ? !showGradient.top && !showGradient.bottom
                ? 'items-center justify-center'
                : 'items-start justify-start'
              : !showGradient.left && !showGradient.right
                ? 'items-center justify-center'
                : 'items-start justify-start'
          } `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollableGradientContainer;
