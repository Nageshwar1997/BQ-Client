import usePathParams from "../../../../hooks/usePathParams";
import { ClassName, IOrder } from "../../../../types";
import { toINRCurrency } from "../../../../utils";

interface Props extends ClassName {
  products: IOrder["products"];
}

const OrderProducts = ({ products = [], className = "" }: Props) => {
  const { paths } = usePathParams();
  const isAccountPage = paths?.includes("account");
  if (!products?.length) return null;
  return (
    <section
      className={`w-full flex flex-col border shadow-md border-primary-30 rounded-xl opacity-90 ${className}`}
    >
      <div className="py-2 px-4 border-b border-b-primary-30 mb-2">
        <h3 className="w-fit text-lg font-bold bg-clip-text text-transparent bg-accent-duo">
          Products
        </h3>
      </div>
      <div className="space-y-4 py-2 px-4">
        {products?.map((item, index) => (
          <div
            key={index}
            className={`p-2 flex ${
              isAccountPage ? "flex-col base:flex-row" : ""
            } gap-4 border shadow-md border-primary-30 rounded-lg opacity-90 items-stretch`}
          >
            <div
              className={`w-24 rounded-xs shadow overflow-hidden ${
                isAccountPage ? "w-32 base:w-24 mx-auto" : ""
              }`}
            >
              <img
                src={
                  item?.shade?.images?.[0] || item?.product?.commonImages?.[0]
                }
                alt={item?.shade?.shadeName || item?.product?.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
              />
            </div>
            <div className="flex-1 grow flex flex-col justify-between">
              <h3 className="text-sm sm:text-base font-medium text-primary opacity-90 hover:opacity-100 line-clamp-1">
                {item?.product?.title}
              </h3>
              {item?.shade && (
                <p className="text-[13px] text-tertiary">
                  {item?.shade?.shadeName}
                </p>
              )}
              <p className="text-[13px] text-tertiary">
                {item?.product?.brand}
              </p>
              <p className="text-[13px] text-secondary">
                Qty.: {item.quantity}
              </p>
              <p className="text-sm font-medium text-primary">
                Price: {toINRCurrency(item?.product?.sellingPrice)}
              </p>
              <p className="text-sm font-semibold text-primary">
                Total:{" "}
                {toINRCurrency(item?.product?.sellingPrice * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OrderProducts;
