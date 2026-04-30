import { useEffect, type JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import useUserStore from '@/stores/user.store';
import { queryClient } from '@/configs/queryClient';
import { GATEWAY_USER_SERVICE_QUERY_KEYS } from '@/constants/api.constant';
import type { IUser } from '@/types/api.type';

const AuthCheck = ({ children }: { children: JSX.Element }) => {
  const setUser = useUserStore((s) => s.setUser);
  const storeUser = useUserStore((s) => s.user);

  const location = useLocation();

  const queryKey = GATEWAY_USER_SERVICE_QUERY_KEYS.user.session;
  const cached = queryClient.getQueryData<{ user: IUser }>(queryKey);

  // ✅ cache → store sync
  useEffect(() => {
    if (cached?.user && storeUser?._id !== cached.user._id) {
      setUser(cached.user);
    }
  }, [cached?.user, storeUser?._id, setUser]);

  if (!cached?.user && !storeUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default AuthCheck;
