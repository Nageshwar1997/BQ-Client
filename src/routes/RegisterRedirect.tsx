import { useLocation, Navigate } from "react-router-dom";
import Register from "../pages/auth/Register";
import { useUserStore } from "../store/user.store";
import { useAuthCheck } from "../hooks/useAuthCheck";
import LoadingScreen from "../components/loaders/LoadingScreen";

const RegisterRedirect = () => {
  const { isAuthenticated } = useUserStore();
  const { state } = useLocation();
  const { isLoading } = useAuthCheck();

  if (isLoading) return <LoadingScreen />;

  const from = state?.from || "/";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <Register />;
};

export default RegisterRedirect;
