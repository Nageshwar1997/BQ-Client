import { useEffect, type JSX } from 'react';
import { Navigate } from 'react-router-dom';

import { queryClient } from '@/configs/queryClient';
import { GATEWAY_USER_SERVICE_QUERY_KEYS } from '@/constants/api.constant';
import usePathParams from '@/hooks/usePathParams';
import useUserStore from '@/stores/user.store';
import type { IUser } from '@/types/api.type';

const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const setUser = useUserStore((s) => s.setUser);
  const storeUser = useUserStore((s) => s.user);
  console.log("🚀 ~ AuthRedirect ~ storeUser:", storeUser)

  const { state } = usePathParams();

  const queryKey = GATEWAY_USER_SERVICE_QUERY_KEYS.user.session;
  const cached = queryClient.getQueryData<{ user: IUser }>(queryKey);

  // ✅ cache → store sync
  useEffect(() => {
    if (cached?.user && storeUser?._id !== cached.user._id) {
      setUser(cached.user);
    }
  }, [cached?.user, storeUser?._id, setUser]);

  // ✅ logged-in → redirect back
  if (cached?.user || storeUser) {
    const from = state?.from?.pathname;

    const safeRedirect = from && !from.startsWith('/auth') ? from : '/';

    return <Navigate to={safeRedirect} replace />;
  }

  return children;
};

export default AuthRedirect;
