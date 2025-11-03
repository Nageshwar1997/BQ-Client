import { useEffect } from "react";
import {
  useAddProductToCart,
  useGetUserCart,
  useRemoveProductFromCart,
  useUpdateProductQuantityInCart,
} from "../api/cart/cart.service";
import useCartStore from "../store/cart.store";
import { TCartProduct } from "../types";
import useRequireAuth from "./useRequireAuth";

export const useUserCart = () => {
  const { cart, setCart, updateProductQuantity, removeProductFromCart } =
    useCartStore();
  const requireAuth = useRequireAuth();

  const { data, isLoading, isError } = useGetUserCart();
  const { mutateAsync: updateQuantity } = useUpdateProductQuantityInCart();
  const { mutateAsync: removeProduct } = useRemoveProductFromCart();
  const { mutateAsync: addToCart, isPending } = useAddProductToCart();

  useEffect(() => {
    if (data?.cart) setCart(data.cart);
  }, [data, setCart]);

  const handleQuantityChange = (id: string, newQty: number) => {
    updateProductQuantity(id, newQty);
    updateQuantity({ cartItemId: id, quantity: String(newQty) });
  };

  const handleRemoveItem = (id: string) => {
    removeProductFromCart(id);
    removeProduct({ cartItemId: id });
  };

  const handleAddToCart = (
    product: TCartProduct["product"],
    shade?: TCartProduct["shade"]
  ) => {
    const action = () => {
      const {
        cart: latestCart,
        addProductToCart,
        setCart,
      } = useCartStore.getState();

      addProductToCart(product, shade);

      // API call
      addToCart(
        {
          productId: product._id,
          ...(shade?._id && { shadeId: shade._id }),
        },
        {
          onError: () => setCart(latestCart), // rollback safely
        }
      );
    };

    if (!requireAuth(action)) return; // store action if not logged in
    action(); // run immediately if logged in
  };

  return {
    cart,
    products: cart?.products || [],
    loading: isLoading,
    error: isError,
    handleQuantityChange,
    handleRemoveItem,
    handleAddToCart,
    adding: isPending,
  };
};
