import { LAST_ROUTE_KEY } from '@/constants/common.constants';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useEffect } from 'react';

const LastRouteTracker = () => {
  const { pathname, search, hash } = usePathParams();
  const { removeParams } = useQueryParams();

  useEffect(() => {
    // ❌ auth pages ignore
    if (pathname.startsWith('/auth')) return;

    const path = pathname + (search ? `?${search}` : '') + hash;

    removeParams('login');

    sessionStorage.setItem(LAST_ROUTE_KEY, path);
  }, [pathname, search, hash]);

  return null;
};

export default LastRouteTracker;
