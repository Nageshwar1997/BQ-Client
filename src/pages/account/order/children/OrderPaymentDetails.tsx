import { ClassName, IOrder } from "../../../../types";
import {
  formatDate,
  formatPhoneNumber,
  toINRCurrency,
} from "../../../../utils";
import OrderKeyValue from "./OrderKeyValue";

interface Props extends ClassName {
  order: IOrder;
}

const OrderPaymentDetails = ({ order, className = "" }: Props) => {
  const payment = order?.payment_details;
  const result = order?.order_result;
  const razorpay = order?.razorpay_payment_result;

  const paymentFields = [
    { field: "Method", value: payment?.method },
    { field: "Wallet", value: payment?.wallet },
    { field: "RRN", value: payment?.upi?.acquirer_data?.rrn },
    { field: "VPA", value: payment?.upi?.acquirer_data?.vpa },
    {
      field: "TransactionId",
      value: payment?.netbanking?.acquirer_data?.bank_transaction_id,
    },
    {
      field: "Authcode",
      value: payment?.card?.acquirer_data?.auth_code,
    },
    { field: "Name", value: payment?.card?.card?.name },
    { field: "Type", value: payment?.card?.card?.type },
    { field: "Issuer", value: payment?.card?.card?.issuer },
    {
      field: "ID",
      value: payment?.card?.card?.id,
      className: "[&>span:nth-child(2)]:uppercase",
    },
    {
      field: "Card No.",
      value: payment?.card?.card?.last4
        ? `XXXX XXXX XXXX ${payment?.card.card.last4}`
        : null,
    },
    { field: "Card Co.", value: payment?.card?.card?.network },
    { field: "Bank", value: payment?.bank },
    {
      field: "Phone No.",
      value: payment?.contact && formatPhoneNumber(payment?.contact),
    },
    { field: "Email", value: payment?.email },
    { field: "Refund Status", value: payment?.refund_status },
    {
      field: "Tax",
      value:
        payment?.tax && payment?.tax > 0 ? toINRCurrency(payment?.tax) : null,
    },
    {
      field: "Platform Fee",
      value:
        payment?.fee && payment?.fee > 0 ? toINRCurrency(payment?.fee) : null,
    },
    {
      field: "Status",
      value:
        razorpay?.rzp_payment_status === "CANCELLED"
          ? "PAYMENT CANCELLED"
          : razorpay?.rzp_payment_status,
    },
    { field: "Paid On", value: formatDate(result?.paid_at, "lll") },
    {
      field: result?.delivered_at ? "Delivered On" : "Exp. Delivery",
      value: result?.paid_at
        ? formatDate(
            result?.delivered_at ||
              new Date(
                new Date(result.paid_at).getTime() + 7 * 24 * 60 * 60 * 1000
              ),
            "lll"
          )
        : null,
    },
    { field: "Cancelled On", value: formatDate(result?.cancelled_at, "lll") },
    { field: "Returned On", value: formatDate(result?.returned_at, "lll") },
  ];

  return (
    <section
      className={`w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90 pb-2 ${className}`}
    >
      <div className="py-2 px-4 border-b border-b-primary-30 mb-2">
        <h3 className="w-fit text-lg font-bold bg-clip-text text-transparent bg-accent-duo">
          Payment Details
        </h3>
      </div>
      <div className="px-4 grid sm:grid-cols-2 gap-1 gap-x-3 text-sm/5">
        {paymentFields.map((f) => (
          <OrderKeyValue key={f.field} {...f} />
        ))}
      </div>
    </section>
  );
};

export default OrderPaymentDetails;
