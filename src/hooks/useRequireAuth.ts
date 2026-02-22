import { Hook } from '.';
import { store } from '../store';

export const useRequireAuth = () => {
  const { authenticated } = store.user();
  const { setParams } = Hook.QueryParams();
  const { setAction } = store.action();

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
