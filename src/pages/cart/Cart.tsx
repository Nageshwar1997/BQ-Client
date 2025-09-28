import { useEffect, useMemo, useState } from "react";
import {
  useGetUserCart,
  useRemoveProductFromCart,
  useUpdateProductQuantityInCart,
} from "../../api/cart/cart.service";
import Button from "../../components/button/Button";
import { RightArrowIcon } from "../../icons";
import CartItem from "./children/CartItem";
import { ICart, TCartProduct } from "../../types";
import ShowError from "../../components/errors/ShowError";
import CartSkeleton from "../../components/skeletons/children/CartSkeleton";
import EmptyData from "../../components/empty-data/EmptyData";
import usePathParams from "../../hooks/usePathParams";

const Cart = () => {
  const { data, isLoading, isError, refetch } = useGetUserCart();
  const { navigate } = usePathParams();

  const { mutateAsync: updateQuantity } = useUpdateProductQuantityInCart();
  const { mutateAsync: removeProduct } = useRemoveProductFromCart();

  const [products, setProducts] = useState<TCartProduct[]>([]);

  const cart: ICart = data?.cart || {};

  useEffect(() => {
    if (cart.products) {
      setProducts(cart.products);
    }
  }, [cart.products]);

  // subtotal calculation
  const subtotal = useMemo(() => {
    return products.reduce(
      (acc, item) => acc + item?.product?.sellingPrice * item?.quantity,
      0
    );
  }, [products]);

  const shipping = subtotal > 499 ? 0 : 40;
  const total = subtotal + shipping;

  const isAnyProductOutOfStock = useMemo(() => {
    return products.some(
      (item) =>
        ((item.shade && item.shade?.stock) || item.product?.totalStock || 0) <=
        0
    );
  }, [products]);

  const handleQuantityChange = (id: string, newQty: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: newQty } : item
      )
    );
    updateQuantity(
      { cartItemId: id, quantity: String(newQty) },
      { onError: () => setProducts(cart.products) }
    );
  };

  const handleRemoveItemFromCart = (id: string) => {
    removeProduct(
      { cartItemId: id },
      {
        onSuccess: () => {
          setProducts((prev) => prev.filter((item) => item._id !== id));
          refetch();
        },
        onError: () => setProducts(cart.products),
      }
    );
  };

  return (
    <div className="bg-primary-inverted p-4 lg:p-8">
      {isLoading ? (
        <CartSkeleton />
      ) : isError ? (
        <ShowError
          headingText="Something went wrong!"
          descriptionText="Failed to get the product. Please reload the page"
          className="w-full h-full mx-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase [&>p]:text-xs [&>p]:base:text-sm [&>p]:sm:text-base [&>p]:md:text-lg"
        />
      ) : Object.keys(cart).length > 0 && cart?.products?.length > 0 ? (
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
                  onRemoveItem={handleRemoveItemFromCart}
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
              <div className="border-t border-t-primary-30 pt-4 flex justify-between text-lg font-semibold text-primary">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <Button
              pattern="primary"
              content="Proceed to Checkout"
              className="!rounded-lg mt-4 !p-3 gap-2"
              rightIcon={<RightArrowIcon className="stroke-white" />}
              disable={isAnyProductOutOfStock}
              onClick={() => navigate("/address")}
            />
            <p className="mt-3 text-sm text-silver-jet text-center">
              Secure checkout • 100% satisfaction guaranteed
            </p>
          </div>
        </div>
      ) : (
        <EmptyData
          content={"Your cart is empty!"}
          className="w-full [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase gap-5"
        />
      )}
    </div>
  );
};

export default Cart;
