import { Store } from '@/Stores';
import { Hook } from '.';

export const useRequireAuth = () => {
  const { authenticated } = Store.User();
  const { setParams } = Hook.QueryParams();
  const { setAction } = Store.Action();

  const requireAuth = (action: () => void) => {
    if (!authenticated) {
      setParams({ login: 'true' }); // open login modal
      setAction(action); // store action for after login
      return false;
    }
    return true;
  };

  return requireAuth;
};
