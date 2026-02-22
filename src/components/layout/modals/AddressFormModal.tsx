import { useEffect } from 'react';
import type { IAddress } from '../../../types';
import { Hook } from '../../../hooks';
import { ModalWrapper } from './ModalWrapper';
import AddressForm from '../forms/AddressForm';

export const AddressFormModal = ({
  onClose,
  addresses,
}: {
  onClose: () => void;
  addresses?: IAddress[];
}) => {
  const { queryParams, removeParam } = Hook.QueryParams();

  useEffect(() => {
    removeParam('add');
    removeParam('edit');
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
