import { ROUTE_ACCESS } from '@/constants/common.constant';
import useUserStore from '@/stores/user.store';
import { getLastRoute, matchRoute } from '@/utils/common.util';
import { redirect, type MiddlewareFunction } from 'react-router-dom';

const routeAccess: MiddlewareFunction = ({ request }, next) => {
  const { user } = useUserStore.getState();

  const url = new URL(request.url);
  const pathname = url.pathname;

  const lastPath = getLastRoute();
  const redirectUrl = new URL(lastPath, url.origin);

  const isPrivate = matchRoute(ROUTE_ACCESS.PRIVATE, pathname);
  const isGuest = matchRoute(ROUTE_ACCESS.GUEST, pathname);
  const isSocialOnly = matchRoute(ROUTE_ACCESS.SOCIAL_ONLY, pathname);

  // 🔒 PRIVATE (includes SOCIAL_ONLY as subset)
  if (!user && isPrivate) {
    redirectUrl.searchParams.set('login', 'true');
    return redirect(redirectUrl.toString());
  }

  // 🚫 GUEST (logged-in user should not access)
  if (user && isGuest) {
    return redirect(redirectUrl.toString());
  }

  // 🔥 SOCIAL_ONLY restriction (after login)
  if (user && isSocialOnly && user.providers.includes('MANUAL')) {
    return redirect(redirectUrl.toString());
  }

  return next();
};

export default routeAccess;
