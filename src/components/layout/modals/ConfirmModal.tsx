import { useEffect } from 'react';
import { InitialNotCloseConfirmModal } from './InitialNotCloseConfirmModal';
import { Hook } from '@/Hooks';
import type { IConfirmModal } from '@/Types';

export const ConfirmModal = (props: IConfirmModal) => {
  const { removeParam } = Hook.QueryParams();

  useEffect(() => {
    removeParam('confirm');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <InitialNotCloseConfirmModal {...props} />;
};
