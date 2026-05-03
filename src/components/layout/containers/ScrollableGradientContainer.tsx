import LinearGradient from '@/components/ui/LinearGradient';
import useScrollable from '@/hooks/useScrollable';
import type { IScrollableGradientContainer } from '@/typess/component.type';
import type { TGradientPos } from '@/typess/hook.type';

const ScrollableGradientContainer = ({
  className = '',
  children,
  containerClassName = '',
  gradientClassNames = {},
  direction,
}: IScrollableGradientContainer) => {
  const { showH_Gradient, showV_Gradient, containerRef } = useScrollable(direction);

  const isHorizontal = direction === 'horizontal';
  const isVertical = direction === 'vertical';

  const gradients = { ...showH_Gradient, ...showV_Gradient };
  const isScrollable = isVertical
    ? !!(gradients.top || gradients.bottom)
    : !!(gradients.left || gradients.right);

  const gradientKeys = Object.entries(gradients)
    .filter(([, value]) => value === true)
    .map(([key]) => key as TGradientPos);

  return (
    <div className={`relative flex h-full w-full flex-col overflow-hidden ${containerClassName}`}>
      {gradientKeys.map((key) => (
        <LinearGradient key={key} position={key} className={gradientClassNames[key] || ''} />
      ))}
      <div
        ref={containerRef}
        className={`relative w-full flex-1 scroll-smooth ${isVertical ? 'overflow-y-auto' : ''} ${isHorizontal ? 'overflow-x-auto whitespace-nowrap' : ''} ${className} `}
      >
        <div
          className={`flex w-full gap-2 ${isVertical ? 'min-h-full flex-col' : 'min-w-full flex-row'} ${
            isScrollable ? 'items-start justify-start' : 'items-center justify-center'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollableGradientContainer;
