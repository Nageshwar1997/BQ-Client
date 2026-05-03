import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import useUserStore from '@/stores/user.store';
import { useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

const PROTECTED_ROUTES = ['/auth/change-password', '/auth/set-password'];
const GUEST_ONLY_ROUTES = ['/auth', '/auth/register', '/auth/forgot-password', '/auth/oauth'];

const RouteGuard = () => {
  const { location, navigate } = usePathParams();
  const { queryParams, setParams } = useQueryParams();
  const user = useUserStore((s) => s.user);

  // 🔥 previous path memory
  const prevPathRef = useRef<string | null>(null);

  // ✅ track last non-auth route
  useEffect(() => {
    if (!location.pathname.startsWith('/auth')) {
      prevPathRef.current = location.pathname + location.search + location.hash;
    }
  }, [location]);

  const blocker = useBlocker(({ nextLocation }) => {
    const nextPath = nextLocation.pathname;

    if (!user) {
      return PROTECTED_ROUTES.some((route) => nextPath.startsWith(route));
    }

    if (user) {
      return GUEST_ONLY_ROUTES.some((route) => {
        if (route === '/auth') return nextPath === '/auth';
        return nextPath === route || nextPath.startsWith(route + '/');
      });
    }

    return false;
  });

  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    // 🔒 NOT logged in → open login modal
    if (!user) {
      if (!queryParams.login) {
        setParams({ login: 'true' });
      }

      blocker.reset(); // 🔥 must
      return;
    }

    // 🚫 already logged in → go back
    navigate(prevPathRef.current || '/', { replace: true });

    blocker.reset(); // 🔥 must
  }, [blocker, navigate, user, queryParams.login, setParams]);
  return null;
};

export default RouteGuard;
