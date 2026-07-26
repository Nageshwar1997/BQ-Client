import { useEffect } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import GradientText from '@/components/ui/GradientText';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetSessionUser } from '@/services/user-service/user.service.query';
import useUserStore from '@/stores/user.store';

const OAuth = () => {
  const { navigate } = usePathParams();
  const { queryParams } = useQueryParams();
  const setUser = useUserStore((s) => s.setUser);
  const user = useUserStore((s) => s.user);

  const session = useGetSessionUser({ enabled: !!queryParams.success });

  useEffect(() => {
    if (!queryParams.success && !queryParams.error) {
      void navigate('/auth');
    }
  }, [queryParams.success, queryParams.error, navigate]);

  useEffect(() => {
    if (user) {
      void navigate('/');
      return;
    }
    if (session.data) {
      setUser(session.data);
      void navigate('/');
    }
  }, [session.data, navigate, setUser, user]);

  const showLoading = !queryParams.error && (!queryParams.success || session.isLoading);
  const showError = session.isError || queryParams.error;
  return (
    <ApiStatus
      status={showLoading ? 'loading' : showError ? 'error' : 'empty'}
      text="Logging in..."
      title={showError ? 'Login failed...' : 'User details not found.'}
      description={
        showError ? (
          <>
            There was a problem signing you in. Please{' '}
            <GradientText type="accent" path="/auth" text="Try again" />.
          </>
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
