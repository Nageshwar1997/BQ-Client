import { useEffect, useRef, useState } from "react";
import { HorizontalScrollType } from "../types";

const useHorizontalScrollable = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showGradient, setShowGradient] = useState<HorizontalScrollType>({
    left: false,
    right: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const hasScroll = container.scrollWidth > container.clientWidth;
      const isAtLeft = container.scrollLeft <= 0;
      const isAtRight =
        Math.ceil(container.scrollLeft + container.clientWidth) >=
        container.scrollWidth;

      if (hasScroll) {
        setShowGradient({
          left: !isAtLeft,
          right: !isAtRight,
        });
      } else {
        setShowGradient({ left: false, right: false });
      }
    };

    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll); // to detect layout shifts
    checkScroll();

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  return [showGradient, containerRef] as const;
};

export default useHorizontalScrollable;
