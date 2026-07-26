import { type MiddlewareFunction, redirect } from 'react-router-dom';

import useUserStore from '@/stores/user.store';

export const authenticate: MiddlewareFunction = (_args, next) => {
  const { user } = useUserStore.getState();

  if (!user) {
    return redirect('/auth');
  }

  return next();
};
