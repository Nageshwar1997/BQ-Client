import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/user.store";
import { useAuthCheck } from "../hooks/useAuthCheck";
import LoadingScreen from "../components/loaders/LoadingScreen";
import { JSX } from "react";

const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useUserStore();
  const { isLoading } = useAuthCheck();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated) {
    const state = location.state as { from?: { pathname?: string } } | null;
    const from = state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default AuthRedirect;
