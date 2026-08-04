import { useEffect } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import GradientText from '@/components/ui/GradientText';
import { OAUTH_REDIRECT_KEY } from '@/constants/common.constants';
import { ROUTES } from '@/constants/routes.constants';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetSessionUser } from '@/services/user-service/user.service.query';
import useUserStore from '@/stores/user.store';

const OAUTH_SUCCESS_REDIRECT_DELAY_MS = 5000;

const OAuth = () => {
  const { navigate } = usePathParams();
  const { queryParams } = useQueryParams();
  const setUser = useUserStore((s) => s.setUser);
  const user = useUserStore((s) => s.user);

  const session = useGetSessionUser({ enabled: !!queryParams.success && !user });

  useEffect(() => {
    if (!queryParams.success && !queryParams.error) {
      void navigate(`/${ROUTES.AUTH.BASE}`);
    }
  }, [queryParams.success, queryParams.error, navigate]);

  useEffect(() => {
    if (!user && session.data) {
      setUser(session.data);
    }
  }, [session.data, setUser, user]);

  const isSuccess = !!user;
  const showError = !isSuccess && (session.isError || !!queryParams.error);
  const showLoading = !isSuccess && !showError && (!queryParams.success || session.isLoading);

  // Once logged in, show the success state briefly, then send the user back to wherever
  // they started the OAuth flow from (falls back to home if nothing was stashed). The stash
  // (OAUTH_REDIRECT_KEY in sessionStorage) is set either by a private nav item before opening
  // the login modal, or by SocialAuth when the OAuth flow itself was started from /auth.
  useEffect(() => {
    if (!isSuccess) return;

    const redirectPath = sessionStorage.getItem(OAUTH_REDIRECT_KEY) ?? ROUTES.HOME;
    sessionStorage.removeItem(OAUTH_REDIRECT_KEY);

    const timer = setTimeout(() => {
      void navigate(redirectPath);
    }, OAUTH_SUCCESS_REDIRECT_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [isSuccess, navigate]);

  return (
    <ApiStatus
      status={showLoading ? 'loading' : showError ? 'error' : isSuccess ? 'success' : 'empty'}
      text="Logging in..."
      title={
        showError ? 'Login failed...' : isSuccess ? 'Login successful!' : 'User details not found.'
      }
      description={
        showError ? (
          <>
            There was a problem signing you in. Please{' '}
            <GradientText type="accent" path="/auth" text="Try again" />.
          </>
        ) : isSuccess ? (
          'Redirecting you back shortly...'
        ) : (
          <>
            There was a problem finding user details. Please{' '}
            <GradientText type="silver" path="/contact" text="Contact Us" />.
          </>
        )
      }
    />
  );
};

export default OAuth;
