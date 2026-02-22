import { type JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '../components';
import { Hook } from '../hooks';
import { store } from '../store';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoading } = Hook.AuthCheck();
  const { authenticated } = store.user();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
