import { OAUTH_REDIRECT_KEY } from '@/constants/common.constants';
import useUserStore from '@/stores/user.store';

import usePathParams from './usePathParams';
import useQueryParams from './useQueryParams';

// Navigates immediately for public paths (or if already logged in); for private ones while
// logged out, remembers the target path and opens the login modal instead. sessionStorage (not
// React/Zustand state) is what survives an OAuth login's full-page redirect round trip, so that's
// where the target is stashed — the same key/mechanism SocialAuth/OAuth already use.
const useAuthNavigate = () => {
  const { navigate } = usePathParams();
  const user = useUserStore((s) => s.user);
  const { queryParams, setParams } = useQueryParams();

  return (path: string, isPrivate?: boolean) => {
    if (!isPrivate || !!user) {
      void navigate(path);
      return;
    }

    sessionStorage.setItem(OAUTH_REDIRECT_KEY, path);

    if (!queryParams.login) {
      setParams({ login: 'true' });
    }
  };
};

export default useAuthNavigate;
