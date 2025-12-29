import { Controller, useForm } from "react-hook-form";
import { useCancelOrder } from "../../../api/order/order.service";
import usePathParams from "../../../hooks/usePathParams";
import useQueryParams from "../../../hooks/useQueryParams";
import { toastErrorMessage, toastSuccessMessage } from "../../../utils/toasts";
import ConfirmModal from "./ConfirmModal";
import { ORDER_CANCEL_REASONS } from "../../../constants";
import Textarea from "../../input/Textarea";
import Button from "../../button/Button";

type TReason = { cancelReason: string; otherReason?: string };

const CancelOrderConfirmationModal = ({ orderId }: { orderId: string }) => {
  const { queryParams, removeParam } = useQueryParams();
  const { pathParams } = usePathParams();
  const { mutateAsync: cancelOrder, isPending: isCancelPending } =
    useCancelOrder(pathParams.orderId!);

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<TReason>({
    defaultValues: {
      cancelReason: "",
      otherReason: "",
    },
  });

  const selectedReason = watch("cancelReason");

  const handleClose = () => {
    reset();
    removeParam("confirm");
  };
  const handleCancelOrder = async (data: TReason) => {
    const reason =
      data.cancelReason === "Other" ? data.otherReason : data.cancelReason;
    if (!reason) return toastErrorMessage("Please provide a cancel reason");

    await cancelOrder(
      { orderId, reason },
      {
        onSuccess: () => {
          toastSuccessMessage("Order cancelled successfully");
          handleClose();
        },
        onError: (error) => toastErrorMessage(error),
      }
    );
  };

  return (
    <ConfirmModal
      type="custom"
      modalProps={{ isOpen: !!queryParams.confirm, onClose: handleClose }}
    >
      <form
        className="flex flex-col items-center justify-center gap-6 !z-[100]"
        onSubmit={handleSubmit(handleCancelOrder)}
      >
        <div className="flex flex-col gap-2 text-center">
          <h4 className="text-lg/5 md:text-xl/6 lg:text-2xl/6 font-semibold bg-clip-text text-transparent bg-silver-duo">
            Why do you want to cancel this order?
          </h4>

          <Controller
            control={control}
            name="cancelReason"
            render={({ field }) => (
              <ul className="flex flex-col gap-2 items-start mt-4">
                {ORDER_CANCEL_REASONS.map((reason) => (
                  <li
                    key={reason}
                    className="text-xs/4 md:text-sm/5 lg:text-base/5 font-light text-tertiary flex items-center gap-2 cursor-pointer"
                    onClick={() => field.onChange(reason)}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={field.value === reason}
                      readOnly
                    />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            )}
          />
          <Controller
            control={control}
            name="otherReason"
            render={({ field }) => (
              <Textarea
                textAreaProps={{
                  rows: 3,
                  placeholder: "Write reason here...",
                  disabled:
                    isSubmitting ||
                    isCancelPending ||
                    !selectedReason ||
                    selectedReason !== "Other",
                  ...field,
                }}
                containerClassName="mt-4"
              />
            )}
          />
        </div>
        <div className="w-full flex items-center justify-center gap-4">
          <Button
            content="Cancel"
            pattern="secondary"
            className={`max-h-10 !rounded-md`}
            buttonProps={{
              type: "button",
              onClick: handleClose,
            }}
          />
          <Button
            content="Confirm"
            pattern="primary"
            className={`max-h-10 !rounded-md`}
            buttonProps={{
              disabled: isSubmitting || isCancelPending || !selectedReason,
              type: "submit",
            }}
          />
        </div>
      </form>
    </ConfirmModal>
  );
};

export default CancelOrderConfirmationModal;
