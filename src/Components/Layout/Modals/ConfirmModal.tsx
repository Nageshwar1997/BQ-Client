import { useEffect } from 'react';
import { InitialNotCloseConfirmModal } from './InitialNotCloseConfirmModal';
import { Hook } from '@/Hooks';
import type { IConfirmModal } from '@/Types/Common.type';

export const ConfirmModal = (props: IConfirmModal) => {
  const { removeParams } = Hook.QueryParams();

  useEffect(() => {
    removeParams('confirm');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <InitialNotCloseConfirmModal {...props} />;
};
