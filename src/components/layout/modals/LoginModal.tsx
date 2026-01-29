import { useEffect } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { Login } from '../../../pages/auth';
import { customHooks } from '../../../hooks';
import { store } from '../../../store';

export const LoginModal = () => {
  const { queryParams, removeParam } = customHooks.QueryParams();
  const { authenticated } = store.user();
  const { runAction, clearAction } = store.action();

  useEffect(() => {
    removeParam('login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authenticated && !queryParams.login) return null;

  return (
    <ModalWrapper
      isOpen={queryParams.login === 'true'}
      onClose={() => (removeParam('login'), clearAction())}
    >
      <Login onLoginSuccess={() => (removeParam('login'), runAction())} />
    </ModalWrapper>
  );
};
