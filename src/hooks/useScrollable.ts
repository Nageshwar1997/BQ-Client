import { useEffect, useRef, useState } from 'react';

export const useHorizontalScrollable = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showGradient, setShowGradient] = useState({ left: false, right: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const hasScroll = container.scrollWidth > container.clientWidth;
      const isAtLeft = container.scrollLeft <= 0;
      const isAtRight =
        Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth;

      if (hasScroll) {
        setShowGradient({ left: !isAtLeft, right: !isAtRight });
      } else {
        setShowGradient({ left: false, right: false });
      }
    };

    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll); // to detect layout shifts
    checkScroll();

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return { showGradient, containerRef } as const;
};

export const useVerticalScrollable = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showGradient, setShowGradient] = useState({ top: false, bottom: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const hasScroll = container.scrollHeight > container.clientHeight;
      const isAtTop = container.scrollTop <= 0;
      const isAtBottom =
        Math.ceil(container.scrollTop + container.clientHeight) >= container.scrollHeight;

      if (hasScroll) {
        setShowGradient({ top: !isAtTop, bottom: !isAtBottom });
      } else {
        setShowGradient({ top: false, bottom: false });
      }
    };

    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll); // for dynamic content resize
    checkScroll();

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  return { showGradient, containerRef } as const;
};
