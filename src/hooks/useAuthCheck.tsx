import { useEffect } from "react";
import { useGetUserDetails } from "../api/user/user.service";
import { useUserStore } from "../store/user.store";
import { getUserToken } from "../utils";
import useCartStore from "../store/cart.store";
import { useUserCart } from "./useUserCart";
import useWishlistStore from "../store/wishlist.store";
import useUserWishlist from "./useUserWishlist";
import { useLogout } from "../api/auth/auth.service";

export const useAuthCheck = (readyToCall?: boolean) => {
  const { setUser } = useUserStore();
  const { logout } = useLogout();
  const { setCart } = useCartStore();
  const { cart: cartData } = useUserCart();
  const { setWishlist } = useWishlistStore();
  const { wishlist: wishlistData } = useUserWishlist();

  const { data, isLoading, isError } = useGetUserDetails(readyToCall);

  useEffect(() => {
    try {
      if (!getUserToken()) return;

      if (data?.user) {
        setUser(data.user);
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
