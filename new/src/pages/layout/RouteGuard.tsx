import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import useUserStore from '@/stores/user.store';
import { getLastRoute } from '@/utils/common.util';
import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

const PROTECTED_ROUTES = ['/auth/change-password', '/auth/set-password'];
const GUEST_ONLY_ROUTES = ['/auth', '/auth/register', '/auth/forgot-password', '/auth/oauth'];

const RouteGuard = () => {
  const { navigate } = usePathParams();
  const { queryParams, setParams } = useQueryParams();
  const user = useUserStore((s) => s.user);

  const blocker = useBlocker(({ nextLocation }) => {
    const nextPath = nextLocation.pathname;

    // 🔒 NOT logged in → block protected routes
    if (!user) {
      return PROTECTED_ROUTES.some((route) => nextPath.startsWith(route));
    }

    // 🚫 Logged in cases
    if (user) {
      // ❌ MANUAL users cannot access set-password
      if (nextPath.startsWith('/auth/set-password') && user.providers.includes('MANUAL')) {
        return true;
      }

      // ❌ block guest-only routes
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

      blocker.reset();
      return;
    }

    // 🚫 logged in → redirect to last route
    navigate(getLastRoute(), { replace: true });

    blocker.reset();
  }, [blocker, user, queryParams.login, setParams, navigate]);

  return null;
};

export default RouteGuard;
