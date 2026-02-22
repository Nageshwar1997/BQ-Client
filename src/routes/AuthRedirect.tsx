import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { Hook } from '../hooks';
import { store } from '../store';
import { LoadingScreen } from '../components';
import { getUserToken } from '../utils';

export const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const token = getUserToken();
  const { authenticated } = store.user();
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
