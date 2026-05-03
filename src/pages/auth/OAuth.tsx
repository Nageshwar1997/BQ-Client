import { useEffect, useState } from 'react';

import ApiStatus from '@/components/layout/ApiStatus';
import GradientText from '@/components/ui/GradientText';
import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import { useGetSessionUser } from '@/services/user-service/user.service.query';
import useUserStore from '@/storess/user.store';

const OAuth = () => {
  const [readyToCall, setReadyToCall] = useState(false);
  const { navigate } = usePathParams();
  const { queryParams } = useQueryParams();
  const setUser = useUserStore((s) => s.setUser);
  const user = useUserStore((s) => s.user);

  const { isLoading, isError, data } = useGetSessionUser({ enabled: readyToCall });
  useEffect(() => {
    if (!queryParams || (!Boolean(queryParams.success) && !Boolean(queryParams.error))) {
      navigate('/auth');
      return;
    }

    if (Boolean(queryParams.success)) {
      setReadyToCall(true);
    }
  }, [queryParams.success, queryParams.error, navigate]);

  useEffect(() => {
    if (user) {
      navigate('/');
      return;
    }
    if (data?.user) {
      setUser(data.user);
    }
  }, [data?.user]);

  const showLoading = !queryParams.error && (!readyToCall || isLoading);
  const showError = isError || queryParams.error;
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
