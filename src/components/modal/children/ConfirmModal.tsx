import { useEffect } from "react";
import useQueryParams from "../../../hooks/useQueryParams";
import { IConfirmModal } from "../../../types";
import InitialNotCloseConfirmModal from "./InitialNotCloseConfirmModal";

const ConfirmModal = (props: IConfirmModal) => {
  const { removeParam } = useQueryParams();

  useEffect(() => {
    removeParam("confirm");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <InitialNotCloseConfirmModal {...props} />;
};

export default ConfirmModal;
