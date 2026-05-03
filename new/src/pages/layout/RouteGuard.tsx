import { ROUTE_ACCESS } from '@/constants/common.constant';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import useUserStore from '@/stores/user.store';
import { getLastRoute, matchRoute } from '@/utils/common.util';
import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

const RouteGuard = () => {
  const { navigate } = usePathParams();
  const { queryParams, setParams } = useQueryParams();
  const user = useUserStore((s) => s.user);

  const blocker = useBlocker(({ nextLocation }) => {
    const nextPath = nextLocation.pathname;

    const isPrivate = matchRoute(ROUTE_ACCESS.PRIVATE, nextPath);
    const isGuest = matchRoute(ROUTE_ACCESS.GUEST, nextPath);
    const isSocialOnly = matchRoute(ROUTE_ACCESS.SOCIAL_ONLY, nextPath);

    // 🔒 NOT logged in → block PRIVATE
    if (!user) {
      return isPrivate;
    }

    // 🚫 Logged in cases
    if (user) {
      // ❌ MANUAL users cannot access social-only routes
      if (isSocialOnly && user.providers.includes('MANUAL')) {
        return true;
      }

      // ❌ block guest routes
      if (isGuest) {
        return true;
      }
    }

    return false;
  });

  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    // 🔒 not logged in → open login modal
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
