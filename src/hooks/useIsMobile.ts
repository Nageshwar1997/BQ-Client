import { useState, useEffect } from 'react';

export const useIsMobile = (width?: number) => {
  const [isMobile, setIsMobile] = useState(false);

  const newWidth = width ?? 1023;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.matchMedia(`(max-width: ${newWidth}px)`).matches);
    };

    checkIsMobile(); // Initial check

    const mediaQuery = window.matchMedia(`(max-width: ${newWidth}px)`);

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Clean up the event listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [newWidth]);

  return isMobile;
};
