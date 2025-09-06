import { useEffect, useMemo, useState } from "react";
import { useGetUserCart } from "../../api/cart/cart.service";
import Button from "../../components/button/Button";
import { RightArrowIcon } from "../../icons";
import CartItem from "./children/CartItem";
import { ICart, TCartProduct } from "../../types";

const Cart = () => {
  const { data, isLoading, isError } = useGetUserCart();

  const [products, setProducts] = useState<TCartProduct[]>([]);

  const cart: ICart = data?.cart || {};

  useEffect(() => {
    if (cart.products) {
      setProducts(cart.products.map((p) => ({ ...p })));
    }
  }, [cart.products]);

  // subtotal calculation
  const subtotal = useMemo(() => {
    return products.reduce(
      (acc, item) => acc + item?.product?.sellingPrice * item?.quantity,
      0
    );
  }, [products]);

  const shipping = subtotal > 1500 ? 0 : 99;
  const total = subtotal + shipping;

  // quantity change handler
  const handleQuantityChange = (id: string, newQty: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong</p>;

  return (
    <div className="min-h-[50dvh] bg-primary-inverted p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left - Cart Items */}
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-semibold text-secondary mb-6">
            Your Cart
          </h2>
          <div className="h-full space-y-6">
            {products.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onQuantityChange={handleQuantityChange}
              />
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
