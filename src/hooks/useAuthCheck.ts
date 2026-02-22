import { useEffect } from 'react';
import { getUserToken } from '../utils';
import { Store } from '../store';
import { Service } from '../api-service';
import { Hook } from '.';

export const useAuthCheck = (readyToCall?: boolean) => {
  const { setUser } = Store.User();
  const { mutateAsync: logout } = Service.Auth.Logout();
  const { setCart } = Store.Cart();
  const { setWishlist } = store.Wishlist();
  const { cart: cartData } = Hook.UserCart();
  const { wishlist: wishlistData } = Hook.UserWishlist();

  const { data, isLoading, isError } = Service.User.GetUserDetails(readyToCall);

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
