import Modal from "..";
import useQueryParams from "../../../hooks/useQueryParams";
import { InfoIcon } from "../../../icons";
import { IConfirmModal } from "../../../types";
import Button from "../../button/Button";

const TopIconLayer = ({ type }: { type: IConfirmModal["type"] }) => (
  <div
    className={`w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14 p-0.5 sm:p-1 md:p-1.5 lg:p-2 rounded-full ${
      type === "success"
        ? "bg-green-300"
        : type === "error"
        ? "bg-red-300"
        : type === "warning"
        ? "bg-yellow-300"
        : ""
    }`}
  >
    <div
      className={`w-full h-full p-0.5 sm:p-1 md:p-1.5 lg:p-2 rounded-full ${
        type === "success"
          ? "bg-green-400"
          : type === "error"
          ? "bg-red-400"
          : type === "warning"
          ? "bg-yellow-400"
          : ""
      }`}
    >
      <div
        className={`w-full h-full p-0.5 sm:p-1 md:p-1.5 lg:p-2 rounded-full flex items-center justify-center ${
          type === "success"
            ? "bg-green-500"
            : type === "error"
            ? "bg-red-500"
            : type === "warning"
            ? "bg-yellow-500"
            : ""
        }`}
      >
        <InfoIcon className="min-w-4 min-h-4 max-w-4 max-h-4 sm:min-w-5 sm:min-h-5 sm:max-w-5 sm:max-h-5 md:min-w-6 md:min-h-6 md:max-w-6 md:max-h-6 lg:min-w-7 lg:min-h-7 lg:max-w-7 lg:max-h-7" />
      </div>
    </div>
  </div>
);
const InitialNotCloseConfirmModal = ({
  type,
  title,
  children,
  description,
  modalProps,
  buttons,
}: IConfirmModal) => {
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
        className: `p-6! ${modalProps?.containerProps?.className || ""}`,
      }}
      className={`[&>div>div>svg]:hidden bg-primary-inverted! [&>div]:p-4! [&>div>div]:p-0! max-w-md border-2 ${
        type !== "custom"
          ? type === "success"
            ? "border-green-500"
            : type === "error"
            ? "border-red-500"
            : type === "warning"
            ? "border-yellow-500"
            : ""
          : ""
      } ${modalProps?.className || ""}`}
    >
      <div className="rounded-xl! p-1.5">
        {type !== "custom" ? (
          <div className="flex flex-col items-center justify-center gap-6">
            <TopIconLayer type={type} />
            <div className="flex flex-col gap-2 text-center">
              <h4 className="text-lg/5 md:text-xl/6 lg:text-2xl/6 font-semibold bg-clip-text text-transparent bg-silver-duo">
                {title}
              </h4>
              <p className="text-xs/4 md:text-sm/5 lg:text-base/5 font-light text-tertiary">
                {description}
              </p>
            </div>
            {buttons && (
              <div className="w-full flex items-center justify-center gap-4">
                {buttons.left && (
                  <Button
                    {...buttons.left}
                    pattern="secondary"
                    className={`max-h-10 rounded-md! ${
                      buttons.left.className || ""
                    }`}
                    buttonProps={{
                      ...buttons.left.buttonProps,
                      onClick: (e) => {
                        buttons.left?.buttonProps?.onClick?.(e);
                        modalProps?.onClose();
                      },
                    }}
                  />
                )}
                {buttons.right && (
                  <Button
                    {...buttons.right}
                    pattern="primary"
                    className={`max-h-10 rounded-md! ${
                      buttons.right.className || ""
                    }`}
                    buttonProps={{
                      ...buttons.right.buttonProps,
                      onClick: (e) => {
                        if (buttons.right?.buttonProps?.onClick) {
                          buttons.right.buttonProps.onClick(e);
                        } else {
                          modalProps?.onClose();
                        }
                      },
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          children
        )}
      </div>
    </Modal>
  );
};

export default InitialNotCloseConfirmModal;
