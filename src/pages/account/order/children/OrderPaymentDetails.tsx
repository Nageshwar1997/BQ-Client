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
  const payment = order?.payment;
  const transaction = order?.transaction;

  const paymentFields = [
    { field: "Method", value: payment?.method },
    { field: "Wallet", value: transaction?.wallet },
    { field: "RRN", value: transaction?.upi_rrn },
    { field: "VPA", value: transaction?.upi_vpa },
    { field: "Flow", value: transaction?.upi_flow },
    {
      field: "TransactionId",
      value:
        transaction?.upi_transaction_id ||
        transaction?.netbanking_bank_transaction_id,
      className: "[&>span:nth-child(2)]:wrap-break-word",
    },
    {
      field: "Authcode",
      value: transaction?.card_auth_code,
    },
    { field: "Name", value: transaction?.card_name },
    { field: "Type", value: transaction?.card_type },
    { field: "Issuer", value: transaction?.card_issuer },
    {
      field: "ID",
      value: transaction?.card_id,
      className: "[&>span:nth-child(2)]:uppercase",
    },
    {
      field: "Card No.",
      value: transaction?.card_last4
        ? `XXXX XXXX XXXX ${transaction?.card_last4}`
        : null,
    },
    { field: "Card Co.", value: transaction?.card_network },
    { field: "Bank", value: transaction?.netbanking_bank },
    {
      field: "Phone No.",
      value: payment?.contact && formatPhoneNumber(payment.contact),
    },
    { field: "Email", value: payment?.email },
    { field: "Refund Status", value: order.refund_status },
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
      value: payment?.status === "FAILED" ? "PAYMENT FAILED" : payment.status,
    },
    { field: "Paid On", value: formatDate(payment?.paid_at, "lll") },
    {
      field: order?.delivered_at ? "Delivered On" : "Exp. Delivery",
      value:
        payment?.paid_at && !order.cancelled_at
          ? formatDate(
              order?.delivered_at ||
                new Date(
                  new Date(payment.paid_at).getTime() + 7 * 24 * 60 * 60 * 1000
                ),
              "lll"
            )
          : null,
    },
    { field: "Cancelled On", value: formatDate(order?.cancelled_at, "lll") },
    { field: "Returned On", value: formatDate(order?.returned_at, "lll") },
    {
      field: "Reason",
      value: order?.reason,
      className: "[&>span:nth-child(2)]:text-rose-c",
    },
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
