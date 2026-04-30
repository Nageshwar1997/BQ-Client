import { useEffect, useState } from 'react';

import usePathParams from '@/hooks/usePathParams';
import useQueryParams from '@/hooks/useQueryParams';
import ApiStatus from '@/components/layout/ApiStatus';
import GradientText from '@/components/ui/GradientText';
import { useGetSessionUser } from '@/services/user-service/user.service.query';

const OAuth = () => {
  const [readyToCall, setReadyToCall] = useState(false);
  const { navigate } = usePathParams();
  const { queryParams } = useQueryParams();
  const { isLoading, isError } = useGetSessionUser({ enabled: readyToCall });

  useEffect(() => {
    if (!Boolean(queryParams.success) && !Boolean(queryParams.error)) {
      navigate('/auth');
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    if (Boolean(queryParams.success)) {
      setReadyToCall(true);
    }

    return () => {
      if (timer) clearTimeout(timer); // 🔥 cleanup
    };
  }, [queryParams.success, queryParams.error, navigate]);

  const showLoading = !queryParams.error && (!readyToCall || isLoading);
  const showError = isError || queryParams.error;
  return (
    <div className="flex w-full flex-col gap-4">
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
    </div>
  );
};

export default OAuth;
