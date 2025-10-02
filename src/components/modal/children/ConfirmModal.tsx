import { JSX, ReactNode } from "react";
import Modal from "..";
import useQueryParams from "../../../hooks/useQueryParams";
import { InfoIcon } from "../../../icons";
import { ModalProps } from "../../../types";
import Button from "../../button/Button";

const ConfirmCard = ({
  icon,
  iconContainerProps,
}: {
  icon: ReactNode;
  iconContainerProps?: JSX.IntrinsicElements["div"];
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        {...iconContainerProps}
        className={`border border-[blue] w-10 h-10 p-1 rounded-full ${
          iconContainerProps?.className || ""
        }`}
      >
        <div className="w-full h-full p-0.5 rounded-full border border-[red] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="">Text and Description</div>
      <div className="">Buttons</div>
    </div>
  );
};

const ConfirmModal = ({
  type,
  title,
  children,
  description,
  modalProps,
}: {
  type: "success" | "error" | "warning" | "custom";
  title?: string;
  description?: string;
  children?: ReactNode;
  modalProps?: ModalProps;
}) => {
  const { queryParams, removeParam } = useQueryParams();

  return (
    <Modal
      {...modalProps}
      onClose={() => modalProps?.onClose ?? removeParam("confirm")}
      isOpen={modalProps?.isOpen ?? !!queryParams.confirm}
      containerProps={{
        ...modalProps?.containerProps,
        onClick: (e) =>
          modalProps?.containerProps?.onClick ?? e.stopPropagation(),
        className: modalProps?.containerProps?.className ?? "!p-6",
      }}
      className="[&>div>div>svg]:hidden !bg-transparent [&>div]:!p-4 [&>div>div]:!p-0 max-w-sm"
    >
      <div className="!rounded-xl border border-[red] bg-primary-inverted-50 p-1.5">
        {type !== "custom" ? (
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className={`w-10 h-10 p-1 rounded-full ${
                type === "success"
                  ? "bg-green-300"
                  : type === "error"
                  ? "bg-red-300"
                  : ""
              }`}
            >
              <div
                className={`w-full h-full p-1 rounded-full ${
                  type === "success"
                    ? "bg-green-400"
                    : type === "error"
                    ? "bg-red-400"
                    : ""
                }`}
              >
                <div
                  className={`w-full h-full p-0.5 rounded-full flex items-center justify-center ${
                    type === "success"
                      ? "bg-green-500"
                      : type === "error"
                      ? "bg-red-500"
                      : ""
                  }`}
                >
                  <InfoIcon />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-center">
              <h4 className="text-lg font-semibold leading-5">{title}</h4>
              <p className="text-sm font-light leading-4">{description}</p>
            </div>
            <div className="w-full flex items-center justify-center gap-4">
              <Button
                pattern="primary"
                content="Cancel"
                className="max-h-10 !rounded-md"
              />
              <Button
                pattern="secondary"
                content="Confirm"
                className="max-h-10 !rounded-md"
              />
            </div>
            <div className="w-full flex items-center justify-center gap-4">
              <Button
                pattern="tertiary"
                content="Cancel"
                className="max-h-10 !rounded-md"
              />
              <Button
                pattern="outline"
                content="Confirm"
                className="max-h-10 !rounded-md"
              />
            </div>
            <div className="w-full flex items-center justify-center gap-4">
              <Button
                pattern="transparent"
                content="Cancel"
                className="max-h-10 !rounded-md"
              />
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </Modal>
  );
};

export default ConfirmModal;
