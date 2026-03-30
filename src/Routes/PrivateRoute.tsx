import { type JSX } from 'react';
import { LoadingScreen } from '@/Components/Layout';
import { Hook } from '@/Hooks';
import { UserStore } from '@/Stores';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoading } = Hook.AuthCheck();
  const { authenticated } = UserStore();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (!authenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
