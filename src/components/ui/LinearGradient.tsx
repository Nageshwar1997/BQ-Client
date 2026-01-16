import { useMemo } from 'react';
import type { TClassName, TGradientPos } from '../../types';

export const LinearGradient = ({
  className,
  position,
}: TClassName & { position: TGradientPos }) => {
  if (!position) return null;

  const positionClass = useMemo(() => {
    switch (position) {
      case 'top':
        return 'top-0 bg-linear-to-b';
      case 'bottom':
        return 'bottom-0 bg-linear-to-t';
      case 'left':
        return 'top-0 bg-linear-to-r';
      case 'right':
        return 'top-0 bg-linear-to-l';
      default:
        return '';
    }
  }, [position]);

  return (
    <div
      className={`from-primary-invert pointer-events-none absolute z-1 to-transparent ${positionClass} ${className}`}
    />
  );
};
