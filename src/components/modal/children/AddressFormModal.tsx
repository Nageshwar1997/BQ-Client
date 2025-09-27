// import { useEffect } from "react";
import Modal from "..";
import useQueryParams from "../../../hooks/useQueryParams";
import AddressForm from "../../../pages/address/children/AddressForm";

const AddressFormModal = ({ onClose }: { onClose: () => void }) => {
  const {
    queryParams,
    // removeParam
  } = useQueryParams();

  //   useEffect(() => {
  //     removeParam("add");
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);
  return (
    <Modal onClose={onClose} isOpen={queryParams.add === "true"}>
      <AddressForm />
    </Modal>
  );
};

export default AddressFormModal;
