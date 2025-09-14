import { JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "../components/loaders/LoadingScreen";
import { useAuthCheck } from "../hooks/useAuthCheck";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoading, isAuthenticated } = useAuthCheck();
  const location = useLocation();

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;
