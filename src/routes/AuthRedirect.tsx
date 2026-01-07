import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/user.store";
import { useAuthCheck } from "../hooks/useAuthCheck";
import LoadingScreen from "../components/loaders/LoadingScreen";
import { JSX } from "react";
import { getUserToken } from "../utils";

const AuthRedirect = ({ children }: { children: JSX.Element }) => {
  const token = getUserToken();
  const { isAuthenticated } = useUserStore();
  const { isLoading } = useAuthCheck(!!token);
  const location = useLocation();

  if (isAuthenticated) {
    const state = location.state as { from?: { pathname?: string } } | null;
    const from = state?.from?.pathname || "/";
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
