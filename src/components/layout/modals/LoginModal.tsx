import { Hook } from '@/Hooks';
import { Store } from '@/Store';
import { useEffect } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { Login } from '@/Pages/Auth';

export const LoginModal = () => {
  const { queryParams, removeParam } = Hook.QueryParams();
  const { authenticated } = Store.User();
  const { runAction, clearAction } = Store.Action();

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
