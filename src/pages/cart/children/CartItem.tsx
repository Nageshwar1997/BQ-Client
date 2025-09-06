import Button from "../../../components/button/Button";
import { MinusIcon, PlusIcon, TrashIcon } from "../../../icons";
import { TCartProduct } from "../../../types";
import { toINRCurrency } from "../../../utils";

const CartItem = ({
  item,
  onQuantityChange,
}: {
  item: TCartProduct;
  onQuantityChange: (id: string, newQty: number) => void;
}) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onQuantityChange(item._id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < 5) {
      onQuantityChange(item._id, item.quantity + 1);
    }
  };

  return (
    <div className="p-2 flex gap-4 border shadow-md shadow-primary-10 border-primary-30 rounded-xl relative">
      <div className="space-y-2.5">
        <img
          src={item?.shade?.images?.[0] || item?.product?.commonImages?.[0]}
          alt={item?.shade?.shadeName || item?.product?.title}
          className="w-24 h-24 object-cover rounded-sm shadow"
        />
        <div className="grow w-24 flex items-center justify-center gap-3">
          <button
            className="w-6 h-6 flex items-center justify-center rounded-full border border-primary-30 hover:bg-primary-30 transition"
            onClick={handleDecrease}
          >
            <MinusIcon
              className="w-4 h-4 stroke-tertiary hover:stroke-secondary"
              strokeWidth={2.5}
            />
          </button>
          <span className="text-secondary font-medium w-4 text-center">
            {item.quantity}
          </span>
          <button
            className="w-6 h-6 flex items-center justify-center rounded-full border border-primary-30 hover:bg-primary-30 transition"
            onClick={handleIncrease}
          >
            <PlusIcon
              className="w-4 h-4 stroke-tertiary hover:stroke-secondary"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>
      <div className="flex-1 grow flex flex-col justify-between">
        <div className="w-full">
          <h3 className="text-base font-medium text-primary line-clamp-1">
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
          rightIcon={<TrashIcon className="w-[14px] h-[14px] stroke-white" />}
        />
      </div>
    </div>
  );
};

export default CartItem;
