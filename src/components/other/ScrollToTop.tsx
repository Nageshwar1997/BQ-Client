import { useEffect } from 'react';
import { useQueryParams } from '../../hooks';

export const ScrollToTop = () => {
  const { pathname } = useQueryParams();

  useEffect(() => {
    const el = document.getElementById('main');

    if (!el) return;
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [pathname]);

  return null;
};
