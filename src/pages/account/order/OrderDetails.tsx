import { useMemo } from "react";
import { useGetOrderById } from "../../../api/order/order.service";
import usePathParams from "../../../hooks/usePathParams";
import { formatDate } from "../../../utils";
import { IOrder } from "../../../types";
// import { format } from "date-fns";

const OrderDetails = () => {
  const { pathParams } = usePathParams();
  const { data, isLoading, isError } = useGetOrderById(pathParams.orderId!);

  const order: IOrder = useMemo(() => data?.order || {}, [data]);

  if (isLoading)
    return <div className="p-6 text-center">Loading order details...</div>;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">Failed to load order.</div>
    );
  if (!order?._id)
    return <div className="p-6 text-center">Order not found.</div>;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <header className="border-b pb-4">
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <p className="text-gray-500">Order ID: {order._id}</p>
      </header>

      {/* Order Summary */}
      <section className="bg-white rounded-xl shadow p-4 space-y-3">
        <h2 className="text-lg font-medium">Order Summary</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className="text-green-600">
                {order.order_result?.order_status}
              </span>
            </p>
            <p>
              <span className="font-medium">Payment Mode:</span>{" "}
              {order.razorpay_payment_result?.payment_mode}
            </p>
            <p>
              <span className="font-medium">Order Receipt:</span>{" "}
              {order.order_result?.order_receipt}
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">Total Price:</span> ₹
              {order.order_result?.price}
            </p>
            <p>
              <span className="font-medium">Discount:</span>{" "}
              {order.order_result?.discount?.toFixed(2)}%
            </p>
            <p>
              <span className="font-medium">Delivery Charges:</span> ₹
              {order.order_result?.charges}
            </p>
          </div>
        </div>
        {order.order_result.paid_at && (
          <p className="text-sm text-gray-500">
            Paid on: {formatDate(order.order_result.paid_at, "llll")}
          </p>
        )}
      </section>

      {/* Products */}
      {order.products?.length > 0 && (
        <section className="bg-white rounded-xl shadow p-4 space-y-4">
          <h2 className="text-lg font-medium">Products</h2>
          <div className="space-y-4">
            {order.products.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 border rounded-lg p-3"
              >
                <img
                  src={
                    item.shade?.images?.[0] || item.product?.commonImages?.[0]
                  }
                  alt={item.shade?.shadeName || item.product?.title}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold">{item.product?.title}</h3>
                  {item.shade && (
                    <p className="text-sm text-gray-500">
                      Shade:{" "}
                      <span className="font-medium">
                        {item.shade.shadeName}
                      </span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-sm text-gray-500">
                    Price: ₹{item.product?.sellingPrice}{" "}
                    <span className="line-through text-gray-400 ml-1">
                      ₹{item.product?.originalPrice}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Addresses */}
      <section className="bg-white rounded-xl shadow p-4 space-y-6">
        {Object.keys(order?.addresses).map((addressKey, index) => {
          const address =
            order?.addresses[addressKey as keyof IOrder["addresses"]];
          if (!address) return null;
          return (
            <div key={addressKey}>
              <h4 className="capitalize">
                {addressKey === "both" ? "Shipping & Billing" : addressKey}{" "}
                Address
              </h4>
              <div className="text-sm space-y-1 mt-2">
                <p>
                  {address.firstName} {address.lastName}
                </p>
                <p>{address.address}</p>
                <p>
                  {address.landmark && `${address.landmark}, `}
                  {address.city}, {address.state} - {address.pinCode}
                </p>
                <p>{address.country}</p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {address.phoneNumber}
                </p>
                {address.gst && (
                  <p>
                    <span className="font-medium">GST:</span> {address.gst}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Payment Info */}
      {order.payment_details && (
        <section className="bg-white rounded-xl shadow p-4 space-y-2">
          <h2 className="text-lg font-medium">Payment Details</h2>
          <p>
            <span className="font-medium">Method:</span>{" "}
            {order.payment_details.method || "N/A"}
          </p>
          <p>
            <span className="font-medium">Bank:</span>{" "}
            {order.payment_details.bank}
          </p>
          <p>
            <span className="font-medium">Transaction ID:</span>{" "}
            {
              order.payment_details.netbanking?.acquirer_data
                ?.bank_transaction_id
            }
          </p>
          <p>
            <span className="font-medium">Fee:</span> ₹
            {order.payment_details.fee}
          </p>
          <p>
            <span className="font-medium">Tax:</span> ₹
            {order.payment_details.tax}
          </p>
        </section>
      )}
    </div>
  );
};

export default OrderDetails;
