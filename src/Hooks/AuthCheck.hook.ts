import { useEffect } from 'react';
import { Hook } from '.';
import { Store } from '@/Stores';
import { Service } from '@/Api-Service';
import { getUserToken } from '@/Utils';

export const useAuthCheck = (readyToCall?: boolean) => {
  const { setUser } = Store.User();
  const { mutateAsync: logout } = Service.Auth.Logout();
  const { setCart } = Store.Cart();
  const { setWishlist } = Store.Wishlist();
  const { cart: cartData } = Hook.Cart();
  const { wishlist: wishlistData } = Hook.Wishlist();

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
