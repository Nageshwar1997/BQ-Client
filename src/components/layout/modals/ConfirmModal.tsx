import { useEffect } from 'react';
import type { IConfirmModal } from '../../../types';
import { customHooks } from '../../../hooks';
import { InitialNotCloseConfirmModal } from './InitialNotCloseConfirmModal';

export const ConfirmModal = (props: IConfirmModal) => {
  const { removeParam } = customHooks.QueryParams();

  useEffect(() => {
    removeParam('confirm');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <InitialNotCloseConfirmModal {...props} />;
};
