import { useEffect } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { Login } from '../../../pages/Auth';
import { Hook } from '../../../hooks';
import { Store } from '../../../store';

export const LoginModal = () => {
  const { queryParams, removeParam } = Hook.QueryParams();
  const { authenticated } = Store.User();
  const { runAction, clearAction } = store.Action();

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
