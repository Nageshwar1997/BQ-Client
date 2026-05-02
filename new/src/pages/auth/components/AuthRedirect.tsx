import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

import { LAST_NON_AUTH_PATH_KEY } from '@/constants/common.constant';
import usePathParams from '@/hooks/usePathParams';
import useUserStore from '@/stores/user.store';

const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const user = useUserStore((s) => s.user);

  const { state, paths } = usePathParams();

  const isAllowedRoute = ['change-password', 'set-password'].some((route) => paths.includes(route));

  // ✅ logged-in → redirect back (except allowed routes)
  if (user && !isAllowedRoute) {
    const from = state?.from?.pathname || sessionStorage.getItem(LAST_NON_AUTH_PATH_KEY);

    const safeRedirect = from && !from.startsWith('/auth') ? from : '/';

    return <Navigate to={safeRedirect} replace />;
  }

  return children;
};

export default AuthRedirect;
