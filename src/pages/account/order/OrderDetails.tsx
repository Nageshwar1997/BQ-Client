import { useMemo } from "react";
import { useGetOrderById } from "../../../api/order/order.service";
import usePathParams from "../../../hooks/usePathParams";
import { formatDate, formatPhoneNumber, toINRCurrency } from "../../../utils";
import { ClassName, IOrder } from "../../../types";
import AddressInfo from "../../address/children/AddressInfo";
import { ORDER_STATUS_CLASSES } from "../../../constants";
import Button from "../../../components/button/Button";
import ShowApiStatus from "../../../components/api-status/ShowApiStatus";

const Field = ({
  field,
  value,
  className = "",
}: { field: string; value?: string | null } & ClassName) => {
  if (!value) return;
  return (
    <p className={className}>
      <span className="font-medium">{field}: </span>
      <span className="font-semibold">{value}</span>
    </p>
  );
};

const OrderDetails = () => {
  const { pathParams } = usePathParams();
  const { data, isLoading, isError } = useGetOrderById(pathParams.orderId!);

  const order: IOrder = useMemo(() => data?.order || {}, [data]);

  const orderSummaryFields = [
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
      field: "Delivery Charges",
      value:
        order.order_result?.charges > 0
          ? toINRCurrency(order.order_result?.charges)
          : null,
    },
  ];

  const paymentFields = [
    { field: "Method", value: order.payment_details?.method },
    { field: "Wallet", value: order.payment_details?.wallet },
    { field: "RRN", value: order.payment_details?.upi?.acquirer_data?.rrn },
    { field: "VPA", value: order.payment_details?.upi?.acquirer_data?.vpa },
    {
      field: "TransactionId",
      value:
        order.payment_details?.netbanking?.acquirer_data?.bank_transaction_id,
    },
    {
      field: "Authcode",
      value: order.payment_details?.card?.acquirer_data?.auth_code,
    },
    { field: "Name", value: order.payment_details?.card?.card?.name },
    { field: "Type", value: order.payment_details?.card?.card.type },
    { field: "Issuer", value: order.payment_details?.card?.card.issuer },
    {
      field: "ID",
      value: order.payment_details?.card?.card.id,
      className: "[&>span:nth-child(2)]:uppercase",
    },
    {
      field: "Card No.",
      value: order.payment_details?.card?.card.last4
        ? `XXXX XXXX XXXX ${order.payment_details.card.card.last4}`
        : null,
    },
    { field: "Card Co.", value: order.payment_details?.card?.card.network },
    { field: "Bank", value: order.payment_details?.bank },
    {
      field: "Phone No.",
      value:
        order.payment_details?.contact &&
        formatPhoneNumber(order.payment_details?.contact),
    },
    { field: "Email", value: order.payment_details?.email },
    { field: "Refund Status", value: order.payment_details?.refund_status },
    {
      field: "Tax",
      value:
        order.payment_details?.tax && order.payment_details?.tax > 0
          ? toINRCurrency(order.payment_details.tax)
          : null,
    },
    {
      field: "Platform Fee",
      value:
        order.payment_details?.fee && order.payment_details?.fee > 0
          ? toINRCurrency(order.payment_details.fee)
          : null,
    },
    {
      field: "Status",
      value: order.razorpay_payment_result?.rzp_payment_status,
    },
    {
      field: "Paid On",
      value: formatDate(order.order_result?.paid_at, "lll"),
    },
    {
      field: order.order_result?.delivered_at
        ? "Delivered On"
        : "Exp. Delivery",
      value: order.order_result?.paid_at
        ? formatDate(
            order.order_result?.delivered_at ||
              new Date(
                new Date(order.order_result.paid_at).getTime() +
                  7 * 24 * 60 * 60 * 1000
              ),
            "lll"
          )
        : null,
    },
    {
      field: "Cancelled On",
      value: formatDate(order.order_result?.cancelled_at, "lll"),
    },
    {
      field: "Returned On",
      value: formatDate(order.order_result?.returned_at, "lll"),
    },
  ];

  return (
    <div className="p-6">
      {order._id ? (
        <div className="space-y-8">
          <header className="border-b pb-4">
            <h3 className="w-fit text-2xl font-bold bg-clip-text text-transparent bg-silver-duo">
              Order Details
            </h3>
            <p className="text-tertiary">Order ID: {order._id}</p>
          </header>
          <section className="w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90 pb-2">
            <div className="py-2 px-4 border-b border-b-primary-30 mb-2 flex items-center justify-between">
              <h3 className="w-fit text-lg font-bold bg-clip-text text-transparent bg-accent-duo">
                Order Summary
              </h3>
              {order.razorpay_payment_result.rzp_payment_status === "PAID" &&
                ["CONFIRMED", "DELIVERED"].includes(
                  order.order_result.order_status
                ) && (
                  <Button
                    content={`${
                      order.order_result.order_status === "CONFIRMED"
                        ? "Cancel"
                        : order.order_result.order_status === "DELIVERED"
                        ? "Return"
                        : ""
                    } Order`}
                    pattern="tertiary"
                    className="max-w-fit !rounded-lg !px-x !py-2"
                    buttonProps={{ disabled: true }}
                  />
                )}
            </div>
            <div className="px-4 grid sm:grid-cols-2 gap-0.5 gap-x-3">
              {orderSummaryFields.map((f) => (
                <Field key={f.field} {...f} />
              ))}
            </div>
          </section>
          {order.products?.length > 0 && (
            <section className="w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90">
              <div className="py-2 px-4 border-b border-b-primary-30 mb-2">
                <h3 className="w-fit text-lg font-bold bg-clip-text text-transparent bg-accent-duo">
                  Products
                </h3>
              </div>
              <div className="space-y-4 py-2 px-4">
                {order?.products.map((item) => (
                  <div
                    key={item._id}
                    className="p-2 flex gap-4 border shadow-md border-primary-30 rounded-lg opacity-90 items-stretch"
                  >
                    <div className="w-24 rounded-sm shadow overflow-hidden">
                      <img
                        src={
                          item?.shade?.images?.[0] ||
                          item?.product?.commonImages?.[0]
                        }
                        alt={item?.shade?.shadeName || item?.product?.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
                      />
                    </div>
                    <div className="flex-1 grow flex flex-col justify-between">
                      <h3 className="text-base font-medium text-primary opacity-90 hover:opacity-100 line-clamp-1">
                        {item?.product?.title}
                      </h3>
                      {item?.shade && (
                        <p className="text-[13px] text-tertiary">
                          Shade: {item?.shade?.shadeName}
                        </p>
                      )}
                      <p className="text-[13px] text-tertiary">
                        {item?.product?.brand}
                      </p>
                      <p className="text-[13px] text-secondary">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        Price: {toINRCurrency(item?.product?.sellingPrice)}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        Total:{" "}
                        {toINRCurrency(
                          item?.product?.sellingPrice * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section className="w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90">
            {Object.keys(order?.addresses).map((addressKey, index) => {
              const address =
                order?.addresses[addressKey as keyof IOrder["addresses"]];
              if (!address) return null;
              return (
                <div key={addressKey} className="">
                  <div
                    className={`py-2 px-4 ${
                      index === 0
                        ? "border-b border-b-primary-30"
                        : "border-y border-y-primary-30"
                    }`}
                  >
                    <h3
                      className={`w-fit text-lg font-bold capitalize bg-clip-text text-transparent bg-accent-duo`}
                    >
                      {addressKey === "both"
                        ? "Shipping & Billing"
                        : addressKey}{" "}
                      Address
                    </h3>
                  </div>
                  <AddressInfo
                    address={address}
                    className="py-2 px-4 [&>h3]:text-base space-y-1"
                  />
                </div>
              );
            })}
          </section>
          <section className="w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90 pb-2">
            <div className="py-2 px-4 border-b border-b-primary-30 mb-2">
              <h3 className="w-fit text-lg font-bold bg-clip-text text-transparent bg-accent-duo">
                Payment Details
              </h3>
            </div>
            <div className="px-4 grid sm:grid-cols-2 gap-1 gap-x-3 text-sm/5">
              {paymentFields.map((f) => (
                <Field key={f.field} {...f} />
              ))}
            </div>
          </section>
        </div>
      ) : (
        <ShowApiStatus
          headingText={
            isError ? "Something went wrong!" : "Order details not found!"
          }
          descriptionText={isError ? "Please try again or refresh page" : ""}
          loadingText="Please Wait..."
          className={`min-h-[50dvh] ${isLoading ? "px-0" : ""}`}
          type={isLoading ? "loading" : isError ? "error" : "empty"}
        />
      )}
    </div>
  );
};

export default OrderDetails;
