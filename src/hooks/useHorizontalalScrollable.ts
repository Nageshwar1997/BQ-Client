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

    const handleScroll = () => {
      const hasHorizontalScroll = container.scrollWidth > container.clientWidth;
      const isAtBeginning = container.scrollLeft === 0;
      const isAtEnd =
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth - 1;

      if (hasHorizontalScroll) {
        setShowGradient({
          left: !isAtBeginning,
          right: !isAtEnd,
        });
      } else {
        setShowGradient({ left: false, right: false });
      }
    };

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return [showGradient, containerRef] as const;
};

export default useHorizontalScrollable;
