import { useEffect } from "react";
import Modal from "..";
import LoginForm from "../../forms/LoginForm";
import useQueryParams from "../../../hooks/useQueryParams";
import { useUserStore } from "../../../store/user.store";
import useActionStore from "../../../store/action.store";

const AuthModal = () => {
  const { queryParams, removeParam } = useQueryParams();
  const { isAuthenticated } = useUserStore();
  const { runAction, clearAction } = useActionStore();

  useEffect(() => {
    removeParam("login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
