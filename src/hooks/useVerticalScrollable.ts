import { useEffect, useRef, useState } from "react";
import { VerticalScrollType } from "../types";

const useVerticalScrollable = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [showGradient, setShowGradient] = useState<VerticalScrollType>({
    top: false,
    bottom: false,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const hasVerticalScroll = container.scrollHeight > container.clientHeight;
      const isAtBeginning = container.scrollTop === 0;
      const isAtEnd =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 1;

      if (hasVerticalScroll) {
        setShowGradient({
          top: !isAtBeginning,
          bottom: !isAtEnd,
        });
      } else {
        setShowGradient({ top: false, bottom: false });
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

export default useVerticalScrollable;
