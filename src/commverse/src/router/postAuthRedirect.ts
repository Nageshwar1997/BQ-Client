import type { UserData } from '../services/api';

export const PHONE_VERIFICATION_PATH = '/auth/phone-verification';
export const ONBOARDING_PATH = '/onboarding';
export const ONBOARDING_SUCCESS_PATH = '/onboarding/success';

type StoredUser = UserData['user'] & {
  phone?: { isVerified?: boolean } | null;
  isOnboarded?: boolean;
  onboardingStepKey?: string;
};

/**
 * First incomplete setup route, or null if the stored user has no gate fields
 * (e.g. OAuth JWT-only cookie) or setup is complete.
 */
export function getRequiredNextPath(user: UserData | null): string | null {
  if (!user?.user) return null;

  const u = user.user as StoredUser;
  const hasPhone = Object.prototype.hasOwnProperty.call(u, 'phone');
  const hasOnboarded = Object.prototype.hasOwnProperty.call(u, 'isOnboarded');

  if (!hasPhone && !hasOnboarded) return null;

  if (hasPhone) {
    const phoneVerified =
      u.phone != null &&
      typeof u.phone === 'object' &&
      u.phone.isVerified === true;
    if (!phoneVerified) return PHONE_VERIFICATION_PATH;
  }

  if (hasOnboarded && u.isOnboarded !== true) {
    return ONBOARDING_PATH;
  }

  return null;
}

function pathMatchesBase(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

/**
 * Where to send the user on this navigation so setup order is respected.
 * Returns null when no redirect is needed.
 */
export function getPostAuthRedirectPath(
  pathname: string,
  user: UserData | null
): string | null {
  const required = getRequiredNextPath(user);

  if (required) {
    if (pathMatchesBase(pathname, required)) {
      return null;
    }
    return required;
  }

  // Setup complete — keep users off setup-only routes
  if (pathMatchesBase(pathname, ONBOARDING_SUCCESS_PATH)) {
    return null;
  }

  if (
    pathMatchesBase(pathname, PHONE_VERIFICATION_PATH) ||
    pathMatchesBase(pathname, ONBOARDING_PATH)
  ) {
    return '/dashboard';
  }

  return null;
}
