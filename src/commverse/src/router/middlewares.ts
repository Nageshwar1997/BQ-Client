import { redirect, type MiddlewareFunction } from 'react-router';
import { trackUserLogin } from '../lib/mixpanel';
import { syncUserSessionFromApi } from '../lib/syncUserSession';
import { decodeJWT, getUser, saveUser, clearStorages } from '../lib/utils';
import type { UserData } from '../services/api';
import { getUserDetail } from '../services/api';
import { getPostAuthRedirectPath } from './postAuthRedirect';

type RouteAccess = 'public' | 'private';

const clearSessionAndRedirectToAuth = () => {
  clearStorages();
  return redirect('/auth');
};

const validateStoredSession = async () => {
  const user = getUser();
  const token = user?.token;

  if (!token) return null;

  const decodedPayload = decodeJWT(token) as { exp?: number } | null;
  const expiresAt = decodedPayload?.exp;
  if (
    typeof expiresAt === 'number' &&
    Number.isFinite(expiresAt) &&
    expiresAt * 1000 <= Date.now()
  ) {
    clearStorages();
    return null;
  }

  try {
    const profile = await getUserDetail();
    await syncUserSessionFromApi(token, profile);
    return getUser();
  } catch {
    clearStorages();
    return null;
  }
};

export const authMiddleware =
  (access: RouteAccess): MiddlewareFunction =>
  async ({ request }, next) => {
    const url = new URL(request.url);
    const tokenParam = url.searchParams.get('token');

    if (tokenParam) {
      const decodedPayload = decodeJWT(tokenParam);
      if (decodedPayload) {
        const userEmail = decodedPayload.email;
        saveUser({
          token: tokenParam,
          user: {
            id: decodedPayload._id || decodedPayload.id,
            email: userEmail,
            name: decodedPayload.name,
            isEmailVerified: decodedPayload.isEmailVerified,
            profilePhoto: decodedPayload.profilePhoto, // if you attach profile photos dynamically later
          },
        } as UserData);
        await syncUserSessionFromApi(tokenParam);
        trackUserLogin(userEmail);
        // Optional: clear query string cleanly
        window.history.replaceState({}, document.title, url.pathname);
      }
    }

    const user = await validateStoredSession();

    // // Private routes → must be logged in
    // if (access === 'private' && !user) {
    //   throw clearSessionAndRedirectToAuth();
    // }

    // if (access === 'private' && user) {
    //   const pathname = new URL(request.url).pathname;
    //   const nextPath = getPostAuthRedirectPath(pathname, user);
    //   if (nextPath) {
    //     throw redirect(nextPath);
    //   }
    // }

    await next();
  };

export const userExistsMiddleware =
  (): MiddlewareFunction =>
  async ({ request }, next) => {
    const url = new URL(request.url);
    const tokenParam = url.searchParams.get('token');

    // If an auth token is in the redirect URL string, do not bounce them!
    if (tokenParam) {
      return redirect(`/dashboard?token=${tokenParam}`);
    }

    const user = await validateStoredSession();

    if (user) {
      const nextPath = getPostAuthRedirectPath('/auth', user) ?? '/dashboard';
      throw redirect(nextPath);
    }

    await next();
  };
