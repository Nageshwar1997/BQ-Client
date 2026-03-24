import { useEffect } from 'react';
import { Hook } from '.';

export const useForgotPasswordFlow = () => {
  const { queryParams, setParams, removeParams } = Hook.QueryParams();

  let step = queryParams.step;
  const token = queryParams.token;

  if (!step && token) {
    step = 'set';
  }

  step = step || 'send';

  const isValidFlow = step === 'send' || (['verify', 'set'].includes(step) && token);

  useEffect(() => {
    if (!isValidFlow) {
      removeParams(['step', 'token']);
    }
  }, [isValidFlow, removeParams]);

  useEffect(() => {
    if (token && !queryParams.step) {
      setParams({ step: 'set', token });
    }
  }, [token, queryParams.step, setParams]);

  const goToSend = () => removeParams(['step', 'token']);

  const goToVerify = (token: string) => setParams({ step: 'verify', token });

  const goToSet = () => {
    if (!token) return;
    setParams({ step: 'set', token });
  };

  return {
    step,
    token,
    goToSend,
    goToVerify,
    goToSet,
  };
};
