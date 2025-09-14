import Button from "../../../components/button/Button";
import usePathParams from "../../../hooks/usePathParams";
import { MinusIcon, PlusIcon, TrashIcon } from "../../../icons";
import { TCartProduct } from "../../../types";
import { toINRCurrency } from "../../../utils";

const CartItem = ({
  item,
  onQuantityChange,
  onRemoveItem,
}: {
  item: TCartProduct;
  onQuantityChange: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
}) => {
  const { navigate } = usePathParams();
  const stock =
    (item.shade && item.shade?.stock) || item.product?.totalStock || 0;
  const isOutOfStock = stock <= 0;
  const allowDec = item.quantity > 1;
  const allowInc = item.quantity < 5 && stock > item.quantity;

  return (
    <div className="p-2 flex gap-4 border shadow-md shadow-primary-10 border-primary-30 rounded-xl relative opacity-90">
      <div className="space-y-2.5">
        <div
          className="w-24 h-24 relative overflow-hidden rounded-sm shadow cursor-pointer"
          onClick={() => navigate(`/product/${item?.product?._id}`)}
        >
          {(stock < 5 || isOutOfStock) && (
            <p
              className={`absolute bottom-0 right-0 text-[8px] text-primary-inverted px-1 font-medium rounded-sm ${
                isOutOfStock ? "bg-red-600" : "bg-primary-50"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : `Only ${stock} left`}
            </p>
          )}
          <img
            src={item?.shade?.images?.[0] || item?.product?.commonImages?.[0]}
            alt={item?.shade?.shadeName || item?.product?.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 ease-in-out"
          />
        </div>
        <div className="grow w-24 flex items-center justify-center gap-3">
          <Button
            pattern="secondary"
            className="!rounded-full !p-0 !w-6 h-6 !shadow-none disabled:!opacity-50"
            disable={!allowDec || isOutOfStock}
            onClick={() => onQuantityChange(item._id, item.quantity - 1)}
            content={
              <MinusIcon
                className="w-4 h-4 stroke-primary-inverted"
                strokeWidth={2.5}
              />
            }
          />
          <span className="text-secondary font-medium w-4 text-center">
            {item.quantity}
          </span>
          <Button
            pattern="secondary"
            className="!w-6 h-6 !rounded-full !p-0 !shadow-none disabled:!opacity-50"
            disable={!allowInc || isOutOfStock}
            onClick={() => onQuantityChange(item._id, item.quantity + 1)}
            content={
              <PlusIcon
                className="w-4 h-4 stroke-primary-inverted"
                strokeWidth={2.5}
              />
            }
          />
        </div>
      </div>
      <div className="flex-1 grow flex flex-col justify-between">
        <div>
          <h3
            className="text-base font-medium text-primary opacity-90 hover:opacity-100 line-clamp-1 cursor-pointer"
            onClick={() => navigate(`/product/${item?.product?._id}`)}
          >
            {item?.product?.title}
          </h3>
          {item?.shade && (
            <p className="text-[13px] text-tertiary">
              {item?.shade?.shadeName}
            </p>
          )}
          <p className="text-[13px] text-tertiary">{item?.product?.brand}</p>
          <p className="text-sm font-medium text-primary">
            Price: {toINRCurrency(item?.product?.sellingPrice)}
          </p>
          <p className="text-sm font-semibold text-primary">
            Total: {toINRCurrency(item?.product?.sellingPrice * item.quantity)}
          </p>
        </div>

        <Button
          content="Remove"
          pattern="primary"
          className="!w-fit !rounded !px-3 !py-1 mt-1 !text-sm gap-2"
          rightIcon={
            <TrashIcon
              className="w-[14px] h-[14px] stroke-white"
              strokeWidth={2.5}
            />
          }
          onClick={() => onRemoveItem(item._id)}
        />
      </div>
    </div>
  );
};

export default CartItem;
