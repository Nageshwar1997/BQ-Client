import Modal from "..";
import LoginForm from "../../forms/LoginForm";
import useQueryParams from "../../../hooks/useQueryParams";
import { useUserStore } from "../../../store/user.store";

const AuthModal = () => {
  const { queryParams, removeParam } = useQueryParams();
  const { isAuthenticated } = useUserStore();

  if (isAuthenticated) {
    removeParam("login");
    return null;
  }

  return (
    <Modal
      isOpen={queryParams.login === "true"}
      onClose={() => removeParam("login")}
      children={<LoginForm />}
    />
  );
};

export default AuthModal;
