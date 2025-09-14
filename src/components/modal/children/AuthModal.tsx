import Modal from "..";
import LoginForm from "../../forms/LoginForm";
import useQueryParams from "../../../hooks/useQueryParams";
import { useUserStore } from "../../../store/user.store";
import useAuthActionStore from "../../../store/authAction";

const AuthModal = () => {
  const { queryParams, removeParam } = useQueryParams();
  const { isAuthenticated } = useUserStore();
  const { runAction, clearAction } = useAuthActionStore();

  if (isAuthenticated && !queryParams.login) return null;

  return (
    <Modal
      isOpen={queryParams.login === "true"}
      onClose={() => {
        removeParam("login");
        clearAction();
      }}
    >
      <LoginForm
        onLoginSuccess={() => {
          removeParam("login");
          runAction();
        }}
      />
    </Modal>
  );
};

export default AuthModal;
