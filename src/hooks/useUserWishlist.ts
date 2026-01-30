import { useEffect } from 'react';
import { store } from '../store';
import { service } from '../api-service';
import type { IWishlist } from '../types';
import { customHooks } from '.';

export const useUserWishlist = () => {
  const { wishlist, setWishlist, updateWishlist } = store.wishlist();
  const requireAuth = customHooks.RequireAuth();

  const { data, isLoading, isError } = service.user.GetWishlist();
  const { mutateAsync: addToWishlist, isPending } = service.user.AddProductToWishlist();
  const { mutateAsync: removeFromWishlist } = service.user.RemoveProductFromWishlist();

  // ✅ Sync server wishlist with store
  useEffect(() => {
    if (data?.wishlist) setWishlist(data.wishlist);
  }, [data, setWishlist]);

  // ✅ Add to wishlist with optimistic update
  const handleAddToWishlist = (product: IWishlist['products'][number]) => {
    const action = () => {
      const latestWishlist = store.wishlist.getState().wishlist;

      // local optimistic update
      updateWishlist.addProduct(product);

      // server API call
      addToWishlist(product._id, {
        onError: () => setWishlist(latestWishlist), // rollback on failure
      });
    };

    if (!requireAuth(action)) return;
    action();
  };

  // ✅ Remove item
  const handleRemoveFromWishlist = (productId: string) => {
    updateWishlist.removeProduct(productId);
    removeFromWishlist(productId);
  };

  // ✅ Check existence
  const isInWishlist = (productId: string) =>
    wishlist?.products?.some((product) => product._id === productId) || false;

  return {
    wishlist,
    products: wishlist?.products || [],
    loading: isLoading,
    error: isError,
    adding: isPending,
    handleAddToWishlist,
    handleRemoveFromWishlist,
    isInWishlist,
  };
};
