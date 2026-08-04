import { OAUTH_REDIRECT_KEY } from '@/constants/common.constants';

import useAuthAction from './useAuthAction';
import usePathParams from './usePathParams';

// Navigates immediately for public paths; for private ones, runs the navigation only once the
// user is authenticated (queuing it and opening the login modal otherwise).
const useAuthNavigate = () => {
  const { navigate } = usePathParams();
  const { runAction } = useAuthAction();

  return (path: string, isPrivate?: boolean) => {
    const action = () => navigate(path);

    if (isPrivate) {
      // The queued action above only lives in memory — if the user ends up completing login via
      // OAuth (a full-page redirect round trip to the provider and back), that memory is wiped.
      // Stash the target path so it survives that round trip too (see SocialAuth/OAuth pages).
      sessionStorage.setItem(OAUTH_REDIRECT_KEY, path);
      runAction(action);
      return;
    }

    void action();
  };
};

export default useAuthNavigate;
