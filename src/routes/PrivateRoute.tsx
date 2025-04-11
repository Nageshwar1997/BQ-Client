import { JSX } from "react";
import { Navigate } from "react-router-dom";
import LoadingScreen from "../components/loaders/LoadingScreen";
import { useAuthCheck } from "../hooks/useAuthCheck";
import { useUserStore } from "../store/user.store";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoading } = useAuthCheck();
  const { isAuthenticated } = useUserStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
