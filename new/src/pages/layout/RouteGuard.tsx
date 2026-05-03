import usePathParams from '@/hooks/usePathParams';
import useUserStore from '@/stores/user.store';
import { useEffect, useRef } from 'react';
import { useBlocker } from 'react-router-dom';

const PROTECTED_ROUTES = ['/auth/change-password', '/auth/set-password'];
const GUEST_ONLY_ROUTES = ['/auth', '/auth/register', '/auth/forgot-password', '/auth/oauth'];

const RouteGuard = () => {
  const { location, navigate } = usePathParams();
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

    if (blocker.state === 'blocked') {
      const currentParams = new URLSearchParams(location.search);

      // 🔒 NOT logged in → open login modal
      if (!user) {
        if (!currentParams.has('login')) {
          currentParams.set('login', 'true');

          navigate(
            { pathname: location.pathname, search: `?${currentParams.toString()}` },
            { replace: true },
          );
        }
      }

      // 🚫 already logged in → go back to previous path
      if (user) {
        navigate(prevPathRef.current || '/', { replace: true });
      }

      // 🔥 MUST: cancel navigation
      blocker.reset();
    }
  }, [blocker, navigate, location, user]);

  return null;
};

export default RouteGuard;
