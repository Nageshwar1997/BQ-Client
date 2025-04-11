import { Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import { useUserStore } from "../store/user.store";
import { useAuthCheck } from "../hooks/useAuthCheck";
import LoadingScreen from "../components/loaders/LoadingScreen";

const LoginRedirect = () => {
  const { isAuthenticated } = useUserStore();
  const { isLoading } = useAuthCheck();

  if (isLoading) return <LoadingScreen />;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Login />;
};

export default LoginRedirect;
