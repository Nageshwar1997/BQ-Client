import { Hook } from '@/Hooks';
import type { IAddress } from '@/Types/Api.type';
import { useEffect } from 'react';
import { ModalWrapper } from './ModalWrapper';
import { AddressForm } from '../Forms';

export const AddressFormModal = ({
  onClose,
  addresses,
}: {
  onClose: () => void;
  addresses?: IAddress[];
}) => {
  const { queryParams, removeParams } = Hook.QueryParams();

  useEffect(() => {
    removeParams(['add', 'edit']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ModalWrapper
      onClose={onClose}
      isOpen={!!queryParams.add || !!queryParams.edit}
      header={{ title: 'Add Address', showCloseIcon: true }}
      className="max-w-3xl!"
    >
      <AddressForm addresses={addresses} className="mt-2" />
    </ModalWrapper>
  );
};
