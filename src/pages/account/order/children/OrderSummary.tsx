import { useMemo } from "react";
import Button from "../../../../components/button/Button";
import { ClassName, IOrder } from "../../../../types";
import { getOrderSummaryFields } from "../../../../utils";
import OrderKeyValue from "./OrderKeyValue";
import { DeleteIcon, TrackIcon } from "../../../../icons";
import usePathParams from "../../../../hooks/usePathParams";
import { Link } from "react-router-dom";
import useQueryParams from "../../../../hooks/useQueryParams";
import CancelOrderConfirmationModal from "../../../../components/modal/children/CancelOrderConfirmationModal";

interface Props extends ClassName {
  order: IOrder;
}

const OrderSummary = ({ order, className = "" }: Props) => {
  const { paths } = usePathParams();
  const { setParams } = useQueryParams();

  const orderSummaryFields = useMemo(
    () => getOrderSummaryFields(order),
    [order]
  );

  const isAccountPage = paths.includes("account");
  const isTrackPage = paths.includes("track");

  return (
    <>
      <CancelOrderConfirmationModal orderId={order._id} />
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
            {["CONFIRMED", "DELIVERED"].includes(order.status) && (
              <Button
                content={`${
                  order.status === "CONFIRMED"
                    ? "Cancel"
                    : order.status === "DELIVERED"
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
                className="min-w-21.5 max-w-fit rounded-lg! px-px! py-2!"
                buttonProps={{ onClick: () => setParams({ confirm: "true" }) }}
              />
            )}
            {!isTrackPage && (
              <Link
                to={`/${isAccountPage ? "account" : "orders"}/track/${
                  order._id
                }`}
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
                  className="min-w-21.5 max-w-fit rounded-lg! px-px! py-2!"
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
    </>
  );
};

export default OrderSummary;
