import { type JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '../components';
import { useAuthCheck } from '../hooks';
import { store } from '../store';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoading } = useAuthCheck();
  const { authenticated } = store.user();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
