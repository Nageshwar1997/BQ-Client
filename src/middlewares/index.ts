import { type MiddlewareFunction, redirect } from 'react-router-dom';

import { ROUTES } from '@/constants/routes.constants';
import useUserStore from '@/stores/user.store';

export const authenticate: MiddlewareFunction = (_args, next) => {
  const { user } = useUserStore.getState();

  if (!user) {
    return redirect(`/${ROUTES.AUTH.BASE}`);
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
