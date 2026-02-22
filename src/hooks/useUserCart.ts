import { useEffect } from 'react';
import { store } from '../store';
import { Service } from '../api-service';
import type { ICartItem } from '../types';
import { customHooks } from '.';

export const useUserCart = () => {
  const { cart, setCart, updateCart } = store.cart();
  const requireAuth = customHooks.RequireAuth();

  const { data, isLoading, isError } = Service.Cart.GetCart();
  const { mutateAsync: updateQuantity } = Service.Cart.UpdateCartProductQuantity();
  const { mutateAsync: removeProduct } = Service.Cart.RemoveProductFromCart();
  const { mutateAsync: addToCart, isPending } = Service.Cart.AddProductToCart();

  useEffect(() => {
    if (data?.cart) setCart(data.cart);
  }, [data, setCart]);

  const handleQuantityChange = (id: string, newQty: number) => {
    updateCart.updateQuantity(id, newQty);
    updateQuantity({ cartItemId: id, quantity: String(newQty) });
  };

  const handleRemoveItem = (id: string) => {
    updateCart.removeProduct(id);
    removeProduct(id);
  };

  const handleAddToCart = (product: ICartItem['product'], shade?: ICartItem['shade']) => {
    const action = () => {
      const { cart: latestCart, updateCart, setCart } = store.cart.getState();

      updateCart.addProduct(product, shade);

      // API call
      addToCart(
        { productId: product._id, ...(shade?._id && { shadeId: shade._id }) },
        { onError: () => setCart(latestCart) }, // rollback safely
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
