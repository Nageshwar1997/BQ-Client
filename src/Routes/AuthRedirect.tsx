import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';

import { Store } from '@/Stores';
import { getUserToken } from '@/Utils';
import { Hook } from '@/Hooks';
import { LoadingScreen } from '@/Components';

export const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const token = getUserToken();
  const { authenticated } = Store.User();
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
