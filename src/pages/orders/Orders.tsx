import { useEffect, useMemo } from "react";
import { useGetAllOrdersInfinite } from "../../api/order/order.service";
import { IOrder } from "../../types";
import { formatDate, toINRCurrency } from "../../utils";
import { ORDER_STATUS_CLASSES } from "../../constants";
import { useInView } from "react-intersection-observer";

const Orders = () => {
  const { data, fetchNextPage, hasNextPage } = useGetAllOrdersInfinite({
    limit: 10,
  });
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
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-primary">
        Orders
      </h1>

      <div className="space-y-4">
        {orders.map((order, index) => {
          const isLastItem = index === orders.length - 4;
          return (
            <div
              ref={isLastItem ? ref : null}
              key={order._id}
              className="shadow-lg shadow-primary-10 rounded-lg p-4 sm:p-6 border border-primary-30 light:border-primary-10"
            >
              {/* Order Header */}
              <div className="text-sm flex flex-col md:flex-row md:justify-between items-center mb-4 gap-3">
                <span className="font-semibold text-tertiary break-words">
                  Order ID: {order._id}
                </span>
                <span
                  className={`w-fit px-3 py-1 rounded-full font-medium text-center ${
                    ORDER_STATUS_CLASSES[order.order_result.order_status] ||
                    "bg-gray-100 text-gray-800"
                  } capitalize`}
                >
                  {order.order_result.order_status?.toLocaleLowerCase()}
                </span>
                <span className="text-tertiary">
                  {formatDate(order.createdAt, "LLLL")}
                </span>
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
                          item.shade?.images[0] || item.product.commonImages[0]
                        }
                        alt={item.shade?.shadeName || item.product.title}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg"
                      />
                      <div className="flex-1 flex flex-col justify-center">
                        <h4 className="text-secondary font-semibold text-xl hidden sm:block">
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
                    <h4 className="text-secondary font-semibold text-lg sm:hidden">
                      {item.product.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
