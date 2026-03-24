import { useEffect } from 'react';
import { Hook } from '@/Hooks';
import { ModalWrapper } from './ModalWrapper';
import { ActionStore, UserStore } from '@/Stores';
import { LoginForm } from '../Forms';

export const LoginModal = () => {
  const { queryParams, removeParams } = Hook.QueryParams();
  const { authenticated } = UserStore();
  const { runAction, clearAction } = ActionStore();

  useEffect(() => {
    removeParams('login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authenticated && !queryParams.login) return null;

  return (
    <ModalWrapper
      isOpen={queryParams.login === 'true'}
      onClose={() => (removeParams('login'), clearAction())}
    >
      <LoginForm onLoginSuccess={() => (removeParams('login'), runAction())} />
    </ModalWrapper>
  );
};
