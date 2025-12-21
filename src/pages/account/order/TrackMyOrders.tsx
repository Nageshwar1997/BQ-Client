import { useEffect, useMemo } from "react";
import { useGetAllOrdersInfinite } from "../../../api/order/order.service";
import { IOrder } from "../../../types";
import { formatDate, toINRCurrency } from "../../../utils";
import { ORDER_STATUS_CLASSES } from "../../../constants";
import { useInView } from "react-intersection-observer";
import LoadingPage from "../../../components/loaders/LoadingPage";
import ShowError from "../../../components/errors/ShowError";
import EmptyData from "../../../components/empty-data/EmptyData";
import usePathParams from "../../../hooks/usePathParams";
import Button from "../../../components/button/Button";
import { Link } from "react-router-dom";

const TrackMyOrders = () => {
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useGetAllOrdersInfinite({ limit: 10 });
  const { pathname } = usePathParams();
  const { ref, inView } = useInView();
  const orders: IOrder[] = useMemo(
    () => data?.pages.flatMap((page) => page.orders) || [],
    [data]
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="p-4 sm:p-6">
      <h3 className="text-2xl sm:text-3xl text-primary font-bold mb-4 sm:mb-6">
        Track your orders
      </h3>
      <div className="space-y-4">
        {isLoading ? (
          <LoadingPage
            text="Loading Orders..."
            className={`${
              pathname === "/orders" ? "!static min-h-[75dvh]" : ""
            }`}
          />
        ) : isError ? (
          <ShowError
            headingText="Something went wrong!"
            descriptionText="Failed to get the orders. Please reload the page"
            className="w-full min-h-[50dvh] h-full mx-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase [&>p]:text-xs [&>p]:base:text-sm [&>p]:sm:text-base [&>p]:md:text-lg"
          />
        ) : orders?.length > 0 ? (
          orders.map((order, index) => {
            const isLastItem = index === orders.length - 4;
            return (
              <div
                ref={isLastItem ? ref : null}
                key={order._id}
                className="shadow-lg shadow-primary-8 rounded-lg p-4 sm:p-6 border border-primary-30 light:border-primary-10 flex flex-col gap-4 hover:shadow-lg hover:shadow-primary-10 hover:border-primary-50 transition-all duration-300 ease-in-out"
              >
                {/* Order Header */}
                <div className="text-sm flex flex-col md:flex-row md:justify-between items-center mb-4 gap-3">
                  <div className="flex flex-col gap-0.5">
                    <i className="font-semibold text-tertiary break-words">
                      Order ID: {order._id}
                    </i>
                    <span className="font-semibold text-tertiary break-words">
                      Ordered on: {formatDate(order.createdAt, "llll")}
                    </span>
                  </div>
                  <span
                    className={`w-fit px-3 py-1 rounded-full font-medium text-center ${
                      ORDER_STATUS_CLASSES[order.status] ||
                      "bg-gray-100 text-gray-800"
                    } capitalize`}
                  >
                    {order.status?.toLocaleLowerCase()}
                  </span>
                  <Link to={order._id}>
                    <Button
                      pattern="outline"
                      content="Track Order"
                      className="max-w-fit !py-2 !px-4 !rounded-lg border-tertiary-50"
                    />
                  </Link>
                </div>
                <div className="space-y-4">
                  {order.products.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-4 sm:gap-6 border border-primary-30 light:border-primary-10 p-3 sm:p-4 rounded-lg"
                    >
                      <div className="flex gap-4 sm:gap-6">
                        <img
                          src={
                            item.shade?.images[0] ||
                            item.product.commonImages[0]
                          }
                          alt={item.shade?.shadeName || item.product.title}
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg"
                        />
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="text-secondary font-semibold sm:text-xl">
                            {item.product.title}
                          </h4>
                          {item.shade?.shadeName && (
                            <p className="font-medium text-secondary text-sm line-clamp-1">
                              Variant: {item.shade.shadeName}
                            </p>
                          )}
                          <p className="text-tertiary flex items-center gap-2 text-sm base:text-base">
                            <span>
                              {toINRCurrency(item.product.sellingPrice)}
                            </span>
                            <span className="line-through opacity-70">
                              {toINRCurrency(item.product.originalPrice)}
                            </span>
                          </p>
                          <p className="text-primary-50 text-sm">
                            You saved{" "}
                            {toINRCurrency(
                              item.product.originalPrice -
                                item.product.sellingPrice
                            )}
                          </p>
                          <p className="text-tertiary font-medium text-sm">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-tertiary">
                  <p>
                    {order.payment.status === "PAID"
                      ? "Paid amount"
                      : order.payment.status === "UNPAID"
                      ? "Payable amount"
                      : order.payment.status === "FAILED"
                      ? "Unpaid amount"
                      : order.payment.status === "REFUNDED"
                      ? "Refunded amount"
                      : ""}
                    : {toINRCurrency(order.payment.amount)}
                  </p>
                  {order.charges && (
                    <p>Charges: {toINRCurrency(order.charges)}</p>
                  )}
                  {order.payment.paid_at && (
                    <>
                      <p>
                        Paid on: {formatDate(order.payment.paid_at, "llll")}
                      </p>
                      <p>
                        Delivery on:{" "}
                        {formatDate(
                          new Date(
                            new Date(order.payment.paid_at).getTime() +
                              7 * 24 * 60 * 60 * 1000
                          ),
                          "llll"
                        )}
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <EmptyData
            content={"No orders found"}
            className="h-[50dvh] !justify-start [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase pt-[150px] gap-5"
          />
        )}
      </div>
    </div>
  );
};

export default TrackMyOrders;
