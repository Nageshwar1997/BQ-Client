import { useEffect } from 'react';
import { customHooks } from '../../hooks';

export const ScrollToTop = () => {
  const { pathname } = customHooks.PathParams();

  useEffect(() => {
    const el = document.getElementById('main');

    if (!el) return;
    el.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [pathname]);

  return null;
};
