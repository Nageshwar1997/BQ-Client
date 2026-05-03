import { ROUTE_ACCESS } from '@/constants/common.constants';
import useUserStore from '@/stores/user.store';
import { getLastRoute, matchRoute } from '@/utils/common.util';
import { redirect, type MiddlewareFunction } from 'react-router-dom';

export const authenticate: MiddlewareFunction = ({ request }, next) => {
  const { user } = useUserStore.getState();

  const url = new URL(request.url);
  const pathname = url.pathname;

  const isPrivate = matchRoute(ROUTE_ACCESS.PRIVATE, pathname);

  // 🔒 Only handle PRIVATE routes
  if (!user && isPrivate) {
    const lastPath = getLastRoute();
    const redirectUrl = new URL(lastPath, url.origin);

    // 🔥 same logic as your existing middleware
    redirectUrl.searchParams.set('login', 'true');

    return redirect(redirectUrl.toString());
  }

  return next();
};

export const guestOnly: MiddlewareFunction = ({ request }, next) => {
  const { user } = useUserStore.getState();

  const url = new URL(request.url);
  const pathname = url.pathname;

  const isGuest = matchRoute(ROUTE_ACCESS.GUEST_ONLY, pathname);

  // 🚫 Only handle GUEST routes
  if (user && isGuest) {
    const lastPath = getLastRoute();
    const redirectUrl = new URL(lastPath, url.origin);

    return redirect(redirectUrl.toString());
  }

  return next();
};

export const socialOnly: MiddlewareFunction = ({ request }, next) => {
  const { user } = useUserStore.getState();

  const url = new URL(request.url);
  const pathname = url.pathname;

  const isSocialOnly = matchRoute(ROUTE_ACCESS.SOCIAL_ONLY, pathname);

  // 🔒 NOT logged in → trigger login modal
  if (!user && isSocialOnly) {
    const lastPath = getLastRoute();
    const redirectUrl = new URL(lastPath, url.origin);

    redirectUrl.searchParams.set('login', 'true');

    return redirect(redirectUrl.toString());
  }

  // 🚫 MANUAL users not allowed
  if (user && isSocialOnly && user.providers.includes('MANUAL')) {
    const lastPath = getLastRoute();
    const redirectUrl = new URL(lastPath, url.origin);

    return redirect(redirectUrl.toString());
  }

  return next();
};

export const publicRoute: MiddlewareFunction = (_args, next) => {
  return next();
};
