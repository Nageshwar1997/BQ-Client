import useUserStore from '@/stores/user.store';
import { redirect, type MiddlewareFunction } from 'react-router-dom';

export const authCheck: MiddlewareFunction = (_args, next) => {
  const { user } = useUserStore.getState();

  if (!user) return redirect('/auth');

  return next();
};
