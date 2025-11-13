import { useEffect } from "react";
import { useGetUserDetails } from "../api/user/user.service";
import { useUserStore } from "../store/user.store";
import { getUserToken } from "../utils";
import useCartStore from "../store/cart.store";
import { useUserCart } from "./useUserCart";
import useWishlistStore from "../store/wishlist.store";
import useUserWishlist from "./useUserWishlist";

export const useAuthCheck = () => {
  const { setUser, user, logout } = useUserStore();
  const { setCart } = useCartStore();
  const { cart: cartData } = useUserCart();
  const { setWishlist } = useWishlistStore();
  const { wishlist: wishlistData } = useUserWishlist();

  const { data, isLoading, isError } = useGetUserDetails();

  useEffect(() => {
    try {
      if (!getUserToken()) return;

      if (data?.user) {
        if (!user) setUser(data.user);
        if (cartData) setCart(cartData);
        if (wishlistData) setWishlist(wishlistData);
      }
    } catch (error) {
      console.error("Error in auth check:", error);
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.user, cartData, wishlistData]);

  return { isLoading, isError, user: data?.user };
};
