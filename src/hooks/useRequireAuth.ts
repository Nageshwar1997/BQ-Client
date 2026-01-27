import { store } from '../store';
import { useQueryParams } from './useParams';

const useRequireAuth = () => {
  const { authenticated } = store.user();
  const { setParams } = useQueryParams();
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

export default useRequireAuth;
