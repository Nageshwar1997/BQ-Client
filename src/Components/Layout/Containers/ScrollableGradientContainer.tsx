import { LinearGradient } from '@/Components/Ui';
import { Hook } from '@/Hooks';
import type { IScrollableGradientContainer, TGradientPos } from '@/Types/Common.type';

export const ScrollableGradientContainer = ({
  className = '',
  children,
  containerClassName = '',
  gradientClassNames = {},
  direction,
}: IScrollableGradientContainer) => {
  const { showH_Gradient, showV_Gradient, containerRef } = Hook.Scrollable(direction);

  const isHorizontal = direction === 'horizontal';
  const isVertical = direction === 'vertical';

  const gradients = { ...showH_Gradient, ...showV_Gradient };

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
          className={`flex h-full w-full gap-2 ${isVertical ? 'flex-col' : 'flex-row'} ${
            isVertical
              ? !gradients.top && !gradients.bottom
                ? 'items-center justify-center'
                : 'items-start justify-start'
              : !gradients.left && !gradients.right
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
