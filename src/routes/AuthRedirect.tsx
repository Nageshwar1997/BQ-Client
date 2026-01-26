import { type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthCheck, usePathParams } from '../hooks';
import { store } from '../store';
import { LoadingScreen } from '../components';
import { getUserToken } from '../utils';

const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const token = getUserToken();
  const { authenticated } = store.user();
  const { isLoading } = useAuthCheck(!!token);
  const { state } = usePathParams();

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
