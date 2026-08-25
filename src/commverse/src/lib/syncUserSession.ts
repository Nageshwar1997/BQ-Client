import { getUserDetail } from '../services/api';
import type { UserData } from '../services/api';
import { getUser, saveUser } from './utils';

type UserDetailResponse = Awaited<ReturnType<typeof getUserDetail>>;

/**
 * Loads full profile from API and persists it next to the token so
 * post-auth redirects (phone / onboarding) match email/password login.
 * Call after OAuth callback once the access token is saved.
 *
 * @param profileResponse — When you already fetched `/auth/user-detail` (e.g. route
 *   middleware), pass it here to avoid a duplicate request.
 */
export async function syncUserSessionFromApi(
  token: string,
  profileResponse?: UserDetailResponse
): Promise<UserDetailResponse | undefined> {
  try {
    const raw =
      profileResponse !== undefined ? profileResponse : await getUserDetail();
    const body = raw as { data?: Record<string, unknown> };
    const p = body?.data;
    if (!p || typeof p !== 'object') return raw;

    saveUser({
      token,
      user: mapProfileToStoredUser(p),
    } as UserData);
    return raw;
  } catch {
    // Keep minimal JWT session if profile fetch fails (offline, etc.)
    return undefined;
  }
}

/**
 * Re-fetches profile with the current session token and updates the encrypted cookie.
 * Prefer this after mutations (e.g. onboarding complete) so the token is never
 * threaded through callbacks — reads from the existing session only.
 */
export async function syncUserSessionFromCurrentToken(): Promise<
  UserDetailResponse | undefined
> {
  const token = getUser()?.token;
  if (!token) return undefined;
  return syncUserSessionFromApi(token);
}

function mapProfileToStoredUser(p: Record<string, unknown>): UserData['user'] {
  return {
    id: String(p._id ?? p.id ?? ''),
    email: String(p.email ?? ''),
    name: (p.name as string | null) ?? '',
    isEmailVerified: Boolean(p.isEmailVerified),
    profilePhoto:
      typeof p.profilePhoto === 'string' ? p.profilePhoto : undefined,
    phone: p.phone as UserData['user']['phone'],
    isOnboarded: p.isOnboarded as boolean | undefined,
  };
}
