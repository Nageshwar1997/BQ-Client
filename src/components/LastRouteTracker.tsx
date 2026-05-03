import { LAST_ROUTE_KEY } from '@/constants/common.constants';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LastRouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // ❌ auth pages ignore
    if (location.pathname.startsWith('/auth')) return;

    const path = location.pathname + location.search + location.hash;

    sessionStorage.setItem(LAST_ROUTE_KEY, path);
  }, [location]);

  return null;
};

export default LastRouteTracker;
