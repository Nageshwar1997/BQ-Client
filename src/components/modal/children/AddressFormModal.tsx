import { useEffect } from "react";
import Modal from "..";
import useQueryParams from "../../../hooks/useQueryParams";
import AddressForm from "../../../pages/address/children/AddressForm";
import { IAddress } from "../../../types";

const AddressFormModal = ({
  onClose,
  addresses,
}: {
  onClose: () => void;
  addresses?: IAddress[];
}) => {
  const { queryParams, removeParam } = useQueryParams();

  useEffect(() => {
    removeParam("add");
    removeParam("edit");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Modal
      onClose={onClose}
      isOpen={!!queryParams.add || !!queryParams.edit}
      heading="Add Address"
      className="!max-w-3xl"
    >
      <AddressForm addresses={addresses} />
    </Modal>
  );
};

export default AddressFormModal;
