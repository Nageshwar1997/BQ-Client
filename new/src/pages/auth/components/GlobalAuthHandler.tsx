import usePathParams from '@/hooks/usePathParams';
import useUserStore from '@/stores/user.store';
import { useEffect } from 'react';
import { useBlocker } from 'react-router-dom';

const PROTECTED_ROUTES = ['/auth/change-password', '/auth/set-password'];
const GUEST_ONLY_ROUTES = ['/auth', '/auth/register', '/auth/forgot-password', '/auth/oauth'];

const GlobalRouteGuard = () => {
  const { location, navigate } = usePathParams();
  const user = useUserStore((s) => s.user);

  const blocker = useBlocker(({ nextLocation }) => {
    const nextPath = nextLocation.pathname;

    // 🔒 block protected routes if NOT logged in
    if (!user) {
      return PROTECTED_ROUTES.some((route) => nextPath.startsWith(route));
    }

    // 🚫 block guest-only routes if logged in
    if (user) {
      return GUEST_ONLY_ROUTES.some((route) => {
        // 🔥 exact match for /auth
        if (route === '/auth') {
          return nextPath === '/auth';
        }

        // 🔥 normal match for others
        return nextPath === route || nextPath.startsWith(route + '/');
      });
    }

    return false;
  });

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const currentParams = new URLSearchParams(location.search);

      // 🔒 case: user NOT logged in → open login modal
      if (!user) {
        if (!currentParams.has('login')) {
          currentParams.set('login', 'true');

          navigate(
            { pathname: location.pathname, search: `?${currentParams.toString()}` },
            { replace: true },
          );
        }
      }

      // 🚫 case: user already logged in → redirect to home or last page
      if (user) {
        navigate('/', { replace: true }); // ya lastPath use kar sakte ho
      }

      blocker.reset();
    }
  }, [blocker, navigate, location, user]);

  return null;
};

export default GlobalRouteGuard;
