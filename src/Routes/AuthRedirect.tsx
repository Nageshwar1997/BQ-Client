import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

import { UserStore } from '@/Stores';
import { Hook } from '@/Hooks';
import { LoadingScreen } from '@/Components/Layout';
import { getUserToken } from '@/Utils/Storage.util';

const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const token = getUserToken();
  const { authenticated } = UserStore();
  const { isLoading } = Hook.AuthCheck(!!token);
  const { state } = Hook.PathParams();

  if (authenticated) {
    const from = state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return (
    <>
      {isLoading && <LoadingScreen />}
      {children}
    </>
  );
};
export default AuthRedirect;
