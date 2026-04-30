import { userApi } from '@/classes/apis';
import { queryClient } from '@/configs/queryClient';
import { GATEWAY_USER_SERVICE_QUERY_KEYS } from '@/constants/api.constant';
import type { IUser } from '@/types/api.type';
import useUserStore from '@/stores/user.store';
import { redirect, type MiddlewareFunction } from 'react-router-dom';

export const authCheck: MiddlewareFunction = async (_args, next) => {
  const { setUser } = useUserStore.getState();
  const queryKey = GATEWAY_USER_SERVICE_QUERY_KEYS.user.session;

  const cached = queryClient.getQueryData<{ user: IUser }>(queryKey);

  // FAST PATH (safe)
  if (cached?.user) {
    setUser(cached.user);
    return next();
  }

  try {
    const data = await queryClient.fetchQuery({
      queryKey,
      queryFn: userApi.getSessionUser,
      staleTime: 5 * 60 * 1000,
      retry: false,
    });

    if (!data?.user) {
      throw new Error('No user found.');
    }

    setUser(data.user);

    return next();
  } catch {
    setUser(null);
    throw redirect('/auth');
  }
};
