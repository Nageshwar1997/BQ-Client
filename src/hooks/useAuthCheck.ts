import { useEffect } from 'react';
import { getUserToken } from '../utils';
import { store } from '../store';
import { service } from '../api-service';
import { customHooks } from '.';

export const useAuthCheck = (readyToCall?: boolean) => {
  const { setUser } = store.user();
  const { mutateAsync: logout } = service.auth.Logout();
  const { setCart } = store.cart();
  const { setWishlist } = store.wishlist();
  const { cart: cartData } = customHooks.UserCart();
  const { wishlist: wishlistData } = customHooks.UserWishlist();

  const { data, isLoading, isError } = service.user.GetUserDetails(readyToCall);

  useEffect(() => {
    try {
      if (!getUserToken()) return;

      if (data?.user) {
        setUser(data.user);
        if (cartData) setCart(cartData);
        if (wishlistData) setWishlist(wishlistData);
      }
    } catch (error) {
      console.error('Error in auth check:', error);
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.user, cartData, wishlistData]);

  return { isLoading, isError, user: data?.user };
};
