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
            <div className="py-2 px-4 border-b border-b-primary-30 mb-2">
              <h3 className="w-fit text-lg font-bold bg-clip-text text-transparent bg-accent-duo">
                Order Summary
              </h3>
            </div>
            <div className="px-4 grid md:grid-cols-2 gap-3">
              <div>
                <Field
                  field="Status"
                  value={order.order_result?.order_status}
                  className={`[&>span:nth-child(2)]:${
                    ORDER_STATUS_CLASSES[order.order_result?.order_status]
                  } [&>span:nth-child(1)]:text-primary bg-transparent`}
                />
                <Field
                  field="Payment Mode"
                  value={order.razorpay_payment_result?.payment_mode}
                />
                <Field
                  field="Order Receipt"
                  value={order.order_result?.order_receipt}
                  className="[&>span:nth-child(2)]:uppercase"
                />
              </div>
              <div>
                <Field
                  field="Total Price"
                  value={toINRCurrency(order.order_result?.price)}
                />
                <Field
                  field="Discount"
                  value={`${order.order_result?.discount?.toFixed(2)}%`}
                />
                <Field
                  field="Delivery Charges"
                  value={toINRCurrency(order.order_result?.charges)}
                />
              </div>
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
            <div className="px-4 grid md:grid-cols-2 gap-3 text-sm/5">
              {/* Payment Details */}
              {order.payment_details && (
                <div>
                  {/* Method */}
                  <Field field="Method" value={order.payment_details.method} />
                  {/* Wallet */}
                  <Field field="Wallet" value={order.payment_details.wallet} />
                  {/* UPI */}
                  <Field
                    field="RRN"
                    value={order.payment_details.upi?.acquirer_data?.rrn}
                  />
                  <Field
                    field="VPA"
                    value={order.payment_details.upi?.acquirer_data?.vpa}
                  />
                  {/* Netbanking */}
                  <Field
                    field="TransactionId"
                    value={
                      order.payment_details.netbanking?.acquirer_data
                        .bank_transaction_id
                    }
                  />
                  {/* Card */}
                  <Field
                    field="Authcode"
                    value={order.payment_details.card?.acquirer_data?.auth_code}
                  />
                  <Field
                    field="Name"
                    value={order.payment_details.card?.card.name}
                  />
                  <Field
                    field="Type"
                    value={order.payment_details.card?.card.type}
                  />
                  <Field
                    field="Issuer"
                    value={order.payment_details.card?.card.issuer}
                  />
                  <Field
                    field="ID"
                    value={order.payment_details.card?.card.id}
                    className="[&>span:nth-child(2)]:uppercase"
                  />
                  <Field
                    field="Card No."
                    value={
                      order.payment_details.card?.card.last4 &&
                      `XXXX XXXX XXXX ${order.payment_details.card.card.last4}`
                    }
                  />
                  <Field
                    field="Card Co."
                    value={order.payment_details.card?.card.network}
                  />
                  <Field field="Bank" value={order.payment_details.bank} />
                  <Field
                    field="Phone No."
                    value={formatPhoneNumber(order.payment_details.contact)}
                  />
                  <Field
                    field="Email"
                    value={formatPhoneNumber(order.payment_details.email)}
                  />
                  <Field
                    field="Refund Status"
                    value={order.payment_details.refund_status}
                  />
                  <Field
                    field="Tax"
                    value={
                      order.payment_details.tax > 0
                        ? toINRCurrency(order.payment_details.tax)
                        : null
                    }
                  />
                  <Field
                    field="Platform Fee"
                    value={
                      order.payment_details.fee > 0
                        ? toINRCurrency(order.payment_details.fee)
                        : null
                    }
                  />
                </div>
              )}
              <div>
                <Field
                  field="Status"
                  value={order.razorpay_payment_result?.rzp_payment_status}
                />
                <Field
                  field="Paid On"
                  value={
                    order.order_result.paid_at &&
                    formatDate(order.order_result.paid_at, "llll")
                  }
                />
                <Field
                  field={`${
                    order.order_result.delivered_at
                      ? "Delivered On"
                      : "Exp. Delivery"
                  }`}
                  value={
                    order.order_result.delivered_at
                      ? formatDate(order.order_result.delivered_at, "llll")
                      : order.order_result.paid_at
                      ? formatDate(
                          new Date(
                            new Date(order.order_result.paid_at).getTime() +
                              7 * 24 * 60 * 60 * 1000
                          ),
                          "llll"
                        )
                      : null
                  }
                />
                <Field
                  field="Cancelled On"
                  value={
                    order.order_result.cancelled_at &&
                    formatDate(order.order_result.cancelled_at, "llll")
                  }
                />
                <Field
                  field="Returned On"
                  value={
                    order.order_result.returned_at &&
                    formatDate(order.order_result.returned_at, "llll")
                  }
                />
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
                      pattern="primary"
                      className="max-w-[200px] mt-4 !rounded-lg !px-x !py-2"
                      buttonProps={{ disabled: true }}
                    />
                  )}
              </div>
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
