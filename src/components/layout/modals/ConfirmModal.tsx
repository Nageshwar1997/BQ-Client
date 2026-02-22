import { useEffect } from 'react';
import type { IConfirmModal } from '../../../types';
import { Hook } from '../../../hooks';
import { InitialNotCloseConfirmModal } from './InitialNotCloseConfirmModal';

export const ConfirmModal = (props: IConfirmModal) => {
  const { removeParam } = Hook.QueryParams();

  useEffect(() => {
    removeParam('confirm');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <InitialNotCloseConfirmModal {...props} />;
};
