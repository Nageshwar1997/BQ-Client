import {  Navigate } from "react-router-dom";
import Register from "../pages/auth/Register";
import { useUserStore } from "../store/user.store";
import { useAuthCheck } from "../hooks/useAuthCheck";
import LoadingScreen from "../components/loaders/LoadingScreen";

const RegisterRedirect = () => {
  const { isAuthenticated } = useUserStore();
  const { isLoading } = useAuthCheck();

  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Register />;
};

export default RegisterRedirect;
