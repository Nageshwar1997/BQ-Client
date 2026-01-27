import { useEffect } from 'react';
import { getUserToken } from '../utils';
import { store } from '../store';
import { service } from '../api-service';
// import useCartStore from '../store/cart.store';
// import { useUserCart } from './useUserCart';
// import useWishlistStore from '../store/wishlist.store';
// import useUserWishlist from './useUserWishlist';

export const useAuthCheck = (readyToCall?: boolean) => {
  const { setUser } = store.user();
  const { mutateAsync: logout } = service.auth.Logout();
  // const { setCart } = useCartStore();
  // const { cart: cartData } = useUserCart();
  // const { setWishlist } = useWishlistStore();
  // const { wishlist: wishlistData } = useUserWishlist();

  const { data, isLoading, isError } = service.user.GetUserDetails(readyToCall);

  useEffect(() => {
    try {
      if (!getUserToken()) return;

      if (data?.user) {
        setUser(data.user);
        // if (cartData) setCart(cartData);
        // if (wishlistData) setWishlist(wishlistData);
      }
    } catch (error) {
      console.error('Error in auth check:', error);
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data?.user,
    // cartData, wishlistData
  ]);

  return { isLoading, isError, user: data?.user };
};
