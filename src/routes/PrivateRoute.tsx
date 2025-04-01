import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "../components/loaders/LoadingScreen";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useUserStore } from "../store/user.store";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { pathname } = useLocation();
  const { isLoading } = useAuthCheck();
  const { isAuthenticated } = useUserStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;
