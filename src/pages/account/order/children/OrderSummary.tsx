import { useMemo } from "react";
import Button from "../../../../components/button/Button";
import { ORDER_STATUS_CLASSES } from "../../../../constants";
import { ClassName, IOrder } from "../../../../types";
import { toINRCurrency } from "../../../../utils";
import OrderKeyValue from "./OrderKeyValue";
import { DeleteIcon, TrackIcon } from "../../../../icons";
import usePathParams from "../../../../hooks/usePathParams";
import { Link } from "react-router-dom";
import { useCancelOrder } from "../../../../api/order/order.service";
import {
  toastErrorMessage,
  toastSuccessMessage,
} from "../../../../utils/toasts";

interface Props extends ClassName {
  order: IOrder;
}

const OrderSummary = ({ order, className = "" }: Props) => {
  const { paths } = usePathParams();

  const { mutateAsync: cancelOrder, isPending: isCancelPending } =
    useCancelOrder();

  const orderSummaryFields = useMemo(
    () => [
      {
        field: "Status",
        value: order.order_result?.order_status,
        className: `[&>span:nth-child(2)]:${
          ORDER_STATUS_CLASSES[order.order_result?.order_status]
        } [&>span:nth-child(1)]:text-primary bg-transparent`,
      },
      {
        field: "Payment Mode",
        value: order.razorpay_payment_result?.payment_mode,
      },
      {
        field: "Order Receipt",
        value: order.order_result?.order_receipt?.split("_")?.[2], //LINK - To Remove "order_receipt" text
      },
      { field: "Total Price", value: toINRCurrency(order.order_result?.price) },
      {
        field: "Discount",
        value:
          order.order_result?.discount > 0
            ? `${order.order_result?.discount?.toFixed(2)}%`
            : null,
      },
      {
        field: "Del. Charges",
        value:
          order.order_result?.charges > 0
            ? toINRCurrency(order.order_result?.charges)
            : null,
      },
    ],
    [order]
  );

  const isAccountPage = paths.includes("account");
  const isTrackPage = paths.includes("track");

  const handleCancelOrder = async () => {
    await cancelOrder(order._id, {
      onSuccess: () => toastSuccessMessage("Order cancelled successfully"),
      onError: (error) => toastErrorMessage(error),
    });
  };

  return (
    <section
      className={`w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90 pb-2 ${className}`}
    >
      <div
        className={`py-2 px-4 border-b border-b-primary-30 mb-2 flex gap-3 sm:gap-4 items-center justify-between ${
          !isTrackPage ? "flex-col base:flex-row" : ""
        }`}
      >
        <h3 className="w-fit text-lg font-bold bg-clip-text text-transparent bg-accent-duo">
          Order Summary
        </h3>
        <div className="flex gap-3 md:gap-4">
          {["CONFIRMED", "DELIVERED"].includes(
            order.order_result.order_status
          ) && (
            <Button
              content={`${
                order.order_result.order_status === "CONFIRMED"
                  ? "Cancel"
                  : order.order_result.order_status === "DELIVERED"
                  ? "Return"
                  : ""
              }`}
              pattern="secondary"
              rightIcon={
                <DeleteIcon
                  className="w-4 h-4 stroke-secondary-inverted"
                  strokeWidth="2.5"
                />
              }
              className="min-w-[86px] max-w-fit !rounded-lg !px-x !py-2"
              buttonProps={{
                onClick: handleCancelOrder,
                disabled: isCancelPending,
              }}
            />
          )}
          {!isTrackPage && (
            <Link
              to={`/${isAccountPage ? "account" : "orders"}/track/${order._id}`}
            >
              <Button
                content="Track"
                rightIcon={
                  <TrackIcon
                    className="w-4 h-4 stroke-white"
                    strokeWidth="2.5"
                  />
                }
                pattern="primary"
                className="min-w-[86px] max-w-fit !rounded-lg !px-x !py-2"
              />
            </Link>
          )}
        </div>
      </div>
      <div className="px-4 grid sm:grid-cols-2 gap-0.5 gap-x-3">
        {orderSummaryFields.map((f, i) => (
          <OrderKeyValue key={i} {...f} />
        ))}
      </div>
    </section>
  );
};

export default OrderSummary;
