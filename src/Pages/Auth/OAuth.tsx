import { ApiStatus } from '@/Components/Common';
import { GradientText } from '@/Components/Ui';
import { Hook } from '@/Hooks';
import { saveLocalToken } from '@/Utils/Storage.util';
import { useEffect, useState } from 'react';

const OAuth = () => {
  const [readyToCall, setReadyToCall] = useState(false);
  const { navigate } = Hook.PathParams();
  const { queryParams } = Hook.QueryParams();
  const { isLoading, isError } = Hook.AuthCheck(readyToCall);

  useEffect(() => {
    if (!queryParams.token && !queryParams.error) {
      navigate('/auth');
      return;
    }
    if (queryParams.token) {
      saveLocalToken(queryParams.token);
      setReadyToCall(true);
    }
  }, [queryParams.token, queryParams.error, navigate]);

  const showLoading = !queryParams.error && (!readyToCall || isLoading);
  const showError = isError || queryParams.error;
  return (
    <div className="flex w-full flex-col gap-4">
      <ApiStatus
        status={showLoading ? 'loading' : showError ? 'error' : 'empty'}
        loading={{ title: 'Loading in...' }}
        error={{
          title: 'Login failed...',
          description: (
            <>
              There was a problem signing you in. Please{' '}
              <GradientText type="accent" path="/auth" text="Try again" />.
            </>
          ),
        }}
        empty={{
          title: 'User details not found.',
          description: (
            <>
              There was a problem finding user details. Please{' '}
              <GradientText type="silver" path="/contact" text="Contact Us" />.
            </>
          ),
        }}
      />
    </div>
  );
};

export default OAuth;
