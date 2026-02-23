import { useEffect } from 'react';
import { Hook } from '.';
import { Store } from '@/Stores';
import { Service } from '@/Api-Service';
import type { IWishlist } from '@/Types';

export const useWishlist = () => {
  const { wishlist, setWishlist, updateWishlist } = Store.Wishlist();
  const requireAuth = Hook.RequireAuth();

  const { data, isLoading, isError } = Service.User.GetWishlist();
  const { mutateAsync: addToWishlist, isPending } = Service.User.AddProductToWishlist();
  const { mutateAsync: removeFromWishlist } = Service.User.RemoveProductFromWishlist();

  // ✅ Sync server wishlist with store
  useEffect(() => {
    if (data?.wishlist) setWishlist(data.wishlist);
  }, [data, setWishlist]);

  // ✅ Add to wishlist with optimistic update
  const handleAddToWishlist = (product: IWishlist['products'][number]) => {
    const action = () => {
      const latestWishlist = Store.Wishlist.getState().wishlist;

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
