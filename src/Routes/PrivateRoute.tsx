import { LoadingScreen } from '@/Components';
import { Hook } from '@/Hooks';
import { Store } from '@/Stores';
import { type JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoading } = Hook.AuthCheck();
  const { authenticated } = Store.User();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
