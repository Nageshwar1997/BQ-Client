import { useMemo } from "react";
import { useGetOrderById } from "../../../api/order/order.service";
import usePathParams from "../../../hooks/usePathParams";
import { formatDate, formatPhoneNumber, toINRCurrency } from "../../../utils";
import { IOrder } from "../../../types";
import AddressInfo from "../../address/children/AddressInfo";
import { ORDER_STATUS_CLASSES } from "../../../constants";
import Button from "../../../components/button/Button";
import ShowApiStatus from "../../../components/api-status/ShowApiStatus";
// import { format } from "date-fns";

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
                <p>
                  <span className="font-medium">Status: </span>
                  <span
                    className={`uppercase font-semibold ${
                      ORDER_STATUS_CLASSES[order.order_result?.order_status]
                    } bg-transparent`}
                  >
                    {order.order_result?.order_status}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment Mode: </span>
                  <span className="uppercase font-semibold">
                    {order.razorpay_payment_result?.payment_mode}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Order Receipt: </span>
                  <span className="uppercase font-semibold">
                    {order.order_result?.order_receipt}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Total Price: </span>
                  <span className="font-semibold">
                    {toINRCurrency(order.order_result?.price)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Discount: </span>
                  <span className="font-semibold">
                    {order.order_result?.discount?.toFixed(2)}%
                  </span>
                </p>
                <p>
                  <span className="font-medium">Delivery Charges: </span>
                  <span className="font-semibold">
                    {toINRCurrency(order.order_result?.charges)}
                  </span>
                </p>
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
                  <p>
                    <span className="font-medium">Method: </span>
                    <span className="font-semibold">
                      {order.payment_details.method}
                    </span>
                  </p>
                  {/* Wallet */}
                  {order.payment_details.wallet && (
                    <p>
                      <span className="font-medium">Wallet: </span>
                      <span className="font-semibold capitalize">
                        {order.payment_details.wallet}
                      </span>
                    </p>
                  )}
                  {/* UPI */}
                  {order.payment_details.upi?.acquirer_data && (
                    <>
                      <p>
                        <span className="font-medium">TransactionId : </span>
                        <span className="font-semibold">
                          {
                            order.payment_details.upi?.acquirer_data
                              .upi_transaction_id
                          }
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">RRN: </span>
                        <span className="font-semibold">
                          {order.payment_details.upi?.acquirer_data.rrn}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">VPA: </span>
                        <span className="font-semibold">
                          {order.payment_details.upi?.acquirer_data.vpa}
                        </span>
                      </p>
                    </>
                  )}
                  {/* Netbanking */}
                  {order.payment_details.netbanking?.acquirer_data && (
                    <p>
                      <span className="font-medium">TransactionId : </span>
                      <span className="font-semibold">
                        {
                          order.payment_details.netbanking?.acquirer_data
                            .bank_transaction_id
                        }
                      </span>
                    </p>
                  )}
                  {/* Card */}
                  {order.payment_details.card && (
                    <>
                      {order.payment_details.card?.acquirer_data && (
                        <p>
                          <span className="font-medium">Authcode: </span>
                          <span className="font-semibold">
                            {
                              order.payment_details.card?.acquirer_data
                                .auth_code
                            }
                          </span>
                        </p>
                      )}
                      {order.payment_details.card.card.name && (
                        <p>
                          <span className="font-medium">Name: </span>
                          <span className="font-semibold">
                            {order.payment_details.card.card.name}
                          </span>
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Type: </span>
                        <span className="font-semibold uppercase">
                          {order.payment_details.card.card.type}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Issuer: </span>
                        <span className="font-semibold">
                          {order.payment_details.card.card.issuer}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">ID: </span>
                        <span className="font-semibold uppercase">
                          {order.payment_details.card.card.id}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Number: </span>
                        <span className="font-semibold">
                          XXXX XXXX XXXX {order.payment_details.card.card.last4}
                        </span>
                      </p>
                      <p>
                        <span className="font-medium">Network: </span>
                        <span className="font-semibold">
                          {order.payment_details.card.card.network}
                        </span>
                      </p>
                    </>
                  )}
                  {order.payment_details.bank && (
                    <p>
                      <span className="font-medium">Bank: </span>
                      <span className="font-semibold">
                        {order.payment_details.bank}
                      </span>
                    </p>
                  )}
                  <p>
                    <span className="font-medium">Phone No.: </span>
                    <span className="font-semibold">
                      {formatPhoneNumber(order.payment_details.contact)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Email: </span>
                    <span className="font-semibold">
                      {order.payment_details.email}
                    </span>
                  </p>
                  {order.payment_details.refund_status && (
                    <p>
                      <span className="font-medium">Refund Status: </span>
                      <span className="font-semibold">
                        {order.payment_details.refund_status}
                      </span>
                    </p>
                  )}
                  {order.payment_details.tax > 0 && (
                    <p>
                      <span className="font-medium">Tax: </span>
                      <span className="font-semibold">
                        {toINRCurrency(order.payment_details.tax)}
                      </span>
                    </p>
                  )}
                  {order.payment_details.fee && (
                    <p>
                      <span className="font-medium">Platform Fee: </span>
                      <span className="font-semibold">
                        {toINRCurrency(order.payment_details.fee)}
                      </span>
                    </p>
                  )}
                </div>
              )}
              <div>
                <p>
                  <span className="font-medium">Status: </span>
                  <span className="font-semibold">
                    {order.razorpay_payment_result?.rzp_payment_status}
                  </span>
                </p>
                {order.order_result.paid_at && (
                  <>
                    <p className="">
                      <span className="font-medium">Paid On: </span>
                      <span className="font-semibold">
                        {formatDate(order.order_result.paid_at, "llll")}
                      </span>
                    </p>
                  </>
                )}
                {order.order_result.delivered_at ? (
                  <p className="">
                    <span className="font-medium">Delivered On: </span>
                    <span className="font-semibold">
                      {formatDate(order.order_result.delivered_at, "llll")}
                    </span>
                  </p>
                ) : (
                  order.order_result.paid_at && (
                    <p className="">
                      <span className="font-medium">Expected Delivery: </span>
                      <span className="font-semibold">
                        {formatDate(
                          new Date(
                            new Date(order.order_result.paid_at).getTime() +
                              7 * 24 * 60 * 60 * 1000
                          ),
                          "llll"
                        )}
                      </span>
                    </p>
                  )
                )}
                {order.order_result.cancelled_at && (
                  <p className="">
                    <span className="font-medium">Cancelled On: </span>
                    <span className="font-semibold">
                      {formatDate(order.order_result.cancelled_at, "llll")}
                    </span>
                  </p>
                )}
                {order.order_result.returned_at && (
                  <p className="">
                    <span className="font-medium">Returned On: </span>
                    <span className="font-semibold">
                      {formatDate(order.order_result.returned_at, "llll")}
                    </span>
                  </p>
                )}
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
