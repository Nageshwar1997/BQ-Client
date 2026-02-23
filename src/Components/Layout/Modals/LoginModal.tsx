import { useEffect } from 'react';
import { Hook } from '@/Hooks';
import { ModalWrapper } from './ModalWrapper';
import { Store } from '@/Stores';
import { LoginForm } from '../Forms/LoginForm';

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
      <LoginForm onLoginSuccess={() => (removeParam('login'), runAction())} />
    </ModalWrapper>
  );
};
