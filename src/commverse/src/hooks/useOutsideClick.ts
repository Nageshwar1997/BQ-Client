import { useEffect } from 'react';
import type { UseOutsideClickParams } from '../types';

const useOutsideClick = ({
  ref,
  handler,
  enabled = true,
}: UseOutsideClickParams<HTMLElement>): void => {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      const refs = Array.isArray(ref) ? ref : [ref];
      const isInside = refs.some((r) => r.current?.contains(target));
      if (isInside) return;
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, enabled]);
};

export default useOutsideClick;
