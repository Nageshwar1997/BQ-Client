import { useEffect } from 'react';
import { Hook } from '.';
import { CartStore, UserStore, WishlistStore } from '@/Stores';
import { Service } from '@/Api-Service';
import { getUserToken } from '@/Utils/Storage.util';
import type { IUser } from '@/Types/Api.type';

export const useAuthCheck = (readyToCall?: boolean) => {
  const { setUser } = UserStore();
  const { mutateAsync: logout } = Service.Auth.Logout();
  const { setCart } = CartStore();
  const { setWishlist } = WishlistStore();
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

  return { isLoading, isError, user: data?.user as IUser };
};
