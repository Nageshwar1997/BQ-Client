import useUserStore from '@/stores/user.store';
import { getLastRoute } from '@/utils/common.util';
import { redirect, type MiddlewareFunction } from 'react-router-dom';

type AccessType = 'guest' | 'public' | 'private' | 'social-providers-only';

const routeAccess =
  (access: AccessType): MiddlewareFunction =>
  ({ request }, next) => {
    const { user } = useUserStore.getState();

    const url = new URL(request.url);
    const lastPath = getLastRoute();
    const redirectUrl = new URL(lastPath, url.origin);

    // 🔒 PRIVATE → login required
    if (access === 'private') {
      if (!user) {
        if (!redirectUrl.searchParams.has('login')) {
          redirectUrl.searchParams.set('login', 'true');
        }

        return redirect(`${redirectUrl.pathname}?${redirectUrl.searchParams.toString()}`);
      }
    }

    // 🚫 GUEST → logged-in users not allowed
    if (access === 'guest') {
      if (user) {
        return redirect(lastPath);
      }
    }

    // 🔥 SOCIAL ONLY → only social login users allowed
    if (access === 'social-providers-only') {
      if (!user) {
        // not logged in → trigger login modal
        if (!redirectUrl.searchParams.has('login')) {
          redirectUrl.searchParams.set('login', 'true');
        }

        return redirect(`${redirectUrl.pathname}?${redirectUrl.searchParams.toString()}`);
      }

      // logged in but MANUAL → block
      if (user.providers.includes('MANUAL')) {
        return redirect(lastPath);
      }
    }

    // 🌍 PUBLIC → always allowed
    return next();
  };

export default routeAccess;
