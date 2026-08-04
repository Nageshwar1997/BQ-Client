import type { TUserRole } from '@beautinique/frontend-types';
import { type MiddlewareFunction, redirect } from 'react-router-dom';

import { ROUTES } from '@/constants/routes.constants';
import useUserStore from '@/stores/user.store';

export const authenticate: MiddlewareFunction = ({ request }, next) => {
  const { user } = useUserStore.getState();

  if (!user) {
    // Remember where the user was trying to go, so login can send them back here instead of Home.
    const { pathname, search } = new URL(request.url);
    const intendedPath = `${pathname}${search}`;
    const redirectParam =
      intendedPath === ROUTES.HOME ? '' : `?redirect=${encodeURIComponent(intendedPath)}`;

    return redirect(`/${ROUTES.AUTH.BASE}${redirectParam}`);
  }

  return next();
};

// Keeps already-logged-in users off guest-only pages (login/register/forgot-password).
export const guestOnly: MiddlewareFunction = (_args, next) => {
  const { user } = useUserStore.getState();

  if (user) {
    return redirect(ROUTES.HOME);
  }

  return next();
};

// Gates a route behind one of the given roles (e.g. the admin seller-review area). Assumes
// `authenticate` already ran (or is listed first in the same route's `middleware` array) — this
// only checks the role, not login state, so an anonymous user falls through the `!user` branch
// the same way an under-privileged one does.
export const requireRole =
  (roles: TUserRole[]): MiddlewareFunction =>
  (_args, next) => {
    const { user } = useUserStore.getState();

    if (!user || !roles.includes(user.role)) {
      return redirect(ROUTES.HOME);
    }

    return next();
  };
