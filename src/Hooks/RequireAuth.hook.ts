import { ActionStore, UserStore } from '@/Stores';
import { Hook } from '.';

export const useRequireAuth = () => {
  const { authenticated } = UserStore();
  const { setParams } = Hook.QueryParams();
  const { setAction } = ActionStore();

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
