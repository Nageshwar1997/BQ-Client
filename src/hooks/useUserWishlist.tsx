import { useEffect } from "react";
import useRequireAuth from "./useRequireAuth";
import { IWishlist } from "../types";
import {
  useAddProductToWishlist,
  useGetUserWishlist,
  useRemoveProductFromWishlist,
} from "../api/user/user.service";
import useWishlistStore from "../store/wishlist.strore";

export const useUserWishlist = () => {
  const { wishlist, setWishlist, addWishlistProduct, removeWishlistProduct } =
    useWishlistStore();
  const requireAuth = useRequireAuth();

  const { data, isLoading, isError } = useGetUserWishlist();
  const { mutateAsync: addToWishlist, isPending } = useAddProductToWishlist();
  const { mutateAsync: removeFromWishlist } = useRemoveProductFromWishlist();

  // ✅ Sync server wishlist with store
  useEffect(() => {
    if (data?.wishlist) setWishlist(data.wishlist);
  }, [data, setWishlist]);

  // ✅ Add to wishlist with optimistic update
  const handleAddToWishlist = (product: IWishlist["products"][number]) => {
    const action = () => {
      const latestWishlist = useWishlistStore.getState().wishlist;

      // local optimistic update
      addWishlistProduct(product);

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
    removeWishlistProduct(productId);
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

export default useUserWishlist;
