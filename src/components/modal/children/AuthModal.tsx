import Modal from "..";
import LoginForm from "../../forms/LoginForm";
import useQueryParams from "../../../hooks/useQueryParams";

const AuthModal = () => {
  const { queryParams, removeParam } = useQueryParams();
  return (
    <Modal
      isOpen={queryParams.login === "true"}
      onClose={() => removeParam("login")}
      children={<LoginForm />}
    />
  );
};

export default AuthModal;
