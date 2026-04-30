import { LAST_NON_AUTH_PATH_KEY } from '@/constants/common.constant';
import useUserStore from '@/stores/user.store';
import { getSafeNonAuthPath } from '@/utils/common.util';
import { redirect, type MiddlewareFunction } from 'react-router-dom';

export const authCheck: MiddlewareFunction = (_args, next) => {
  const { user } = useUserStore.getState();

  if (!user) return redirect('/auth');

  return next();
};

export const authRedirect: MiddlewareFunction = (_args, next) => {
  const { user } = useUserStore.getState();

  if (!user) return next();

  const lastPath = getSafeNonAuthPath(sessionStorage.getItem(LAST_NON_AUTH_PATH_KEY));

  return redirect(lastPath ?? '/');
};
