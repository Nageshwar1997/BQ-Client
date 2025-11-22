import { useMemo } from "react";
import { useGetOrderById } from "../../../api/order/order.service";
import usePathParams from "../../../hooks/usePathParams";
import { IOrder } from "../../../types";
import ShowApiStatus from "../../../components/api-status/ShowApiStatus";
import OrderSummary from "./children/OrderSummary";
import OrderProducts from "./children/OrderProducts";
import OrderAddresses from "./children/OrderAddresses";
import OrderPaymentDetails from "./children/OrderPaymentDetails";

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
            <p className="text-tertiary text-sm md:text-base line-clamp-1 break-all">Order ID: {order._id}</p>
          </header>
          <OrderSummary order={order} />
          <OrderProducts products={order.products} />
          <OrderAddresses addresses={order.addresses} />
          <OrderPaymentDetails order={order} />
        </div>
      ) : (
        <ShowApiStatus
          headingText={
            isError ? "Something went wrong!" : "Order details not found!"
          }
          descriptionText={isError ? "Please try again or refresh page" : ""}
          loadingText="Please Wait..."
          className={`min-h-[50dvh] ${isLoading ? "[&>div]:!fixed" : "px-0"}`}
          type={isLoading ? "loading" : isError ? "error" : "empty"}
        />
      )}
    </div>
  );
};

export default OrderDetails;
