import { useEffect, useRef, useState } from 'react';

import type { TScrollDirection } from '../Types';

type THorizontal = { left: boolean; right: boolean };
type TVertical = { top: boolean; bottom: boolean };
type TScroll =
  | ({ direction: 'horizontal' } & THorizontal)
  | ({ direction: 'vertical' } & TVertical);

export const useScrollable = (direction: TScrollDirection) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showGradient, setShowGradient] = useState<TScroll>(
    direction === 'horizontal'
      ? { direction: 'horizontal', left: false, right: false }
      : { direction: 'vertical', top: false, bottom: false },
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      if (direction === 'horizontal') {
        const hasScroll = container.scrollWidth > container.clientWidth;
        const isAtLeft = container.scrollLeft <= 0;
        const isAtRight =
          Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth;

        setShowGradient({
          direction: 'horizontal',
          left: hasScroll && !isAtLeft,
          right: hasScroll && !isAtRight,
        });
      } else {
        const hasScroll = container.scrollHeight > container.clientHeight;
        const isAtTop = container.scrollTop <= 0;
        const isAtBottom =
          Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight;

        setShowGradient({
          direction: 'vertical',
          top: hasScroll && !isAtTop,
          bottom: hasScroll && !isAtBottom,
        });
      }
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [direction]);

  const showV_Gradient = {
    ...(showGradient.direction === 'vertical' && {
      top: showGradient.top,
      bottom: showGradient.bottom,
    }),
  };
  const showH_Gradient = {
    ...(showGradient.direction === 'horizontal' && {
      left: showGradient.left,
      right: showGradient.right,
    }),
  };

  return { showV_Gradient, showH_Gradient, containerRef } as const;
};
