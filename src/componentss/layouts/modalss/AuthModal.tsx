import useQueryParams from '@/hooks/useQueryParams';
import { useCallback, useEffect } from 'react';
import LoginForm from '../formss/LoginForm';
import { ModalWrapper } from './ModalWrapper';

const AuthModal = () => {
  const { queryParams, removeParams } = useQueryParams();

  const onClose = useCallback(() => {
    removeParams(['login']);
  }, []);

  useEffect(onClose, []);

  return (
    <ModalWrapper isOpen={!!queryParams.login} onClose={onClose}>
      <LoginForm />
    </ModalWrapper>
  );
};

export default AuthModal;
