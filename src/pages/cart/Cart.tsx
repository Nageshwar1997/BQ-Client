import { useMemo } from "react";
import { useGetUserCart } from "../../api/cart/cart.service";
import Button from "../../components/button/Button";
import { MinusIcon, PlusIcon, RightArrowIcon, TrashIcon } from "../../icons";
import { FetchedProductType } from "../../types";
import { toINRCurrency } from "../../utils";

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: "SUGAR POP Cool Essence Roll on Deodorant",
      shade: "50ml",
      price: 599,
      qty: 1,
      image:
        "https://www.sugarcosmetics.com/cdn/shop/files/SUGAR-POP-Cool-Essence-Roll-on-Deodorant-50ml.jpg?v=1754482944&width=360",
    },
    {
      id: 2,
      name: "Matte Foundation",
      shade: "Warm Beige",
      price: 899,
      qty: 5,
      image:
        "https://www.sugarcosmetics.com/cdn/shop/files/Kohl-Of-Honour-Intense-Kajal-3_d0e96d7c.jpg?v=1750675085&width=360",
    },
  ];

  const { data, isLoading, isError } = useGetUserCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shipping = subtotal > 1500 ? 0 : 99;
  const total = subtotal + shipping;

  const cart = useMemo(() => data?.cart || {}, [data?.cart]);

  console.log("cart", cart);

  const products = useMemo(() => cart?.products || [], [cart?.products]);
  console.log("products", products);
  return (
    <div className="min-h-[50dvh] bg-primary-inverted p-4 lg:p-8">
      {isLoading ? <></> : isError ? <></> : null}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left - Cart Items */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold text-secondary mb-6">
            Your Cart
          </h2>
          <div className="h-full space-y-6">
            {products.map((item) => (
              <div
                key={item?._id}
                className="p-2 flex items-center gap-4 border shadow-md shadow-primary-10 border-primary-30 rounded-xl relative"
              >
                <div className="space-y-2.5">
                  <img
                    src={
                      item?.shade?.images?.[0] ||
                      item?.product?.commonImages?.[0]
                    }
                    alt={item?.shade?.shadeName || item?.product?.title}
                    className="w-24 h-24 object-cover rounded-sm shadow"
                  />
                  <div className="grow w-24 flex items-center justify-center gap-3">
                    <button className="w-6 h-6 flex items-center justify-center rounded-full border border-primary-30 hover:bg-primary-30 transition">
                      <MinusIcon
                        className="w-4 h-4 stroke-tertiary hover:stroke-secondary"
                        strokeWidth={2.5}
                      />
                    </button>
                    <span className="text-secondary font-medium">
                      {item.quantity}
                    </span>
                    <button className="w-6 h-6 flex items-center justify-center rounded-full border border-primary-30 hover:bg-primary-30 transition">
                      <PlusIcon
                        className="w-4 h-4 stroke-tertiary hover:stroke-secondary"
                        strokeWidth={2.5}
                      />
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-primary line-clamp-1">
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
                  <p className="text-sm font-medium text-primary">
                    Price: {toINRCurrency(item?.product?.sellingPrice)}
                  </p>
                  <p className="text-sm font-semibold text-primary">
                    Total:{" "}
                    {toINRCurrency(item?.product?.sellingPrice * item.quantity)}
                  </p>

                  <Button
                    content="Remove"
                    pattern="primary"
                    className="!w-fit !rounded !px-3 !py-1 mt-1 !text-sm gap-2"
                    rightIcon={
                      <TrashIcon className="w-[14px] h-[14px] stroke-white" />
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className="p-6 h-fit lg:sticky top-16">
          <h2 className="text-2xl font-semibold text-secondary mb-6">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-tertiary">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-tertiary">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="border-t pt-4 flex justify-between text-lg font-semibold text-primary">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
          <Button
            pattern="primary"
            content="Proceed to Checkout"
            className="!rounded-lg mt-4 !p-3 gap-2"
            rightIcon={<RightArrowIcon className="stroke-white" />}
          />
          <p className="mt-3 text-sm text-silver-jet text-center">
            Secure checkout • 100% satisfaction guaranteed
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
