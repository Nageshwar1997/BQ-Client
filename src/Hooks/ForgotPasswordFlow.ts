import { Hook } from '.';

export const useForgotPasswordFlow = () => {
  const { queryParams, setParams, removeParams } = Hook.QueryParams();

  const step = queryParams.step || 'send';
  const token = queryParams.token;

  const isValidFlow = step === 'send' || (['verify', 'set'].includes(step) && token);

  const goToSend = () => removeParams(['step', 'token']);

  const goToVerify = (token: string) => setParams({ step: 'verify', token });

  const goToSet = () => token && setParams({ step: 'set', token });

  return {
    step: isValidFlow ? step : 'send',
    token,
    goToSend,
    goToVerify,
    goToSet,
  };
};
