import { useEffect } from "react";
import {
  useAddProductToCart,
  useGetUserCart,
  useRemoveProductFromCart,
  useUpdateProductQuantityInCart,
} from "../api/cart/cart.service";
import useCartStore from "../store/cart.store";
import { TCartProduct } from "../types";
import { useUserStore } from "../store/user.store";
import useQueryParams from "./useQueryParams";
import usePathParams from "./usePathParams";

export const useUserCart = () => {
  const { cart, setCart, updateProductQuantity, removeProductFromCart } =
    useCartStore();
  const { isAuthenticated } = useUserStore();
  const { setParams } = useQueryParams();
  const { pathParams } = usePathParams();

  const { data, isLoading, isError } = useGetUserCart();
  const { mutateAsync: updateQuantity } = useUpdateProductQuantityInCart();
  const { mutateAsync: removeProduct } = useRemoveProductFromCart();
  const { mutateAsync: addToCart, isPending } = useAddProductToCart();

  useEffect(() => {
    if (data?.cart) setCart(data.cart);
  }, [data, setCart]);

  const handleQuantityChange = (id: string, newQty: number) => {
    updateProductQuantity(id, newQty); // update store immediately
    updateQuantity({ cartItemId: id, quantity: String(newQty) });
  };

  const handleRemoveItem = (id: string) => {
    removeProductFromCart(id); // update store immediately
    removeProduct({ cartItemId: id });
  };

  const handleAddToCart = (
    product: TCartProduct["product"],
    shade?: TCartProduct["shade"]
  ) => {
    if (!isAuthenticated) {
      setParams({ login: "true" });
      return;
    }

    if (!cart) return;
    const exists = cart.products.some(
      (item) => item.product._id === pathParams?.productId
    );
    if (exists) return;

    const newItem = {
      _id: Date.now().toString(), // temporary id
      cart: cart._id,
      quantity: 1,
      product,
      shade,
    };

    setCart({ ...cart, products: [...cart.products, newItem] });

    addToCart(
      {
        productId: pathParams?.productId ?? "",
        ...(shade?._id && { shadeId: shade?._id }),
      },
      {
        onError: () => setCart(cart), // reset cart on error
      }
    );
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
