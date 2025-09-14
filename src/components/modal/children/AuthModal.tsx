import Modal from "..";
import LoginForm from "../../forms/LoginForm";
import useQueryParams from "../../../hooks/useQueryParams";
import { useUserStore } from "../../../store/user.store";

const AuthModal = ({ onLoginSuccess }: { onLoginSuccess?: () => void }) => {
  const { queryParams, removeParam } = useQueryParams();
  const { isAuthenticated } = useUserStore();

  if (isAuthenticated && !queryParams.login) return null;

  return (
    <Modal
      isOpen={queryParams.login === "true"}
      onClose={() => removeParam("login")}
      children={
        <LoginForm
          onLoginSuccess={() => {
            removeParam("login");
            if (onLoginSuccess) {
              onLoginSuccess();
            }
          }}
        />
      }
    />
  );
};

export default AuthModal;
