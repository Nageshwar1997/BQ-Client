import { useUserStore } from "../store/user.store";
import useQueryParams from "./useQueryParams";
import useActionStore from "../store/action.store";

const useRequireAuth = () => {
  const { isAuthenticated } = useUserStore();
  const { setParams } = useQueryParams();
  const { setAction } = useActionStore();

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setParams({ login: "true" }); // open login modal
      setAction(action); // store action for after login
      return false;
    }
    return true;
  };

  return requireAuth;
};

export default useRequireAuth;
