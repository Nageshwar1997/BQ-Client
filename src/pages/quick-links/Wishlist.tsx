import useWishlistStore from "../../store/wishlist.store";

const Wishlist = () => {
  const { wishlist } = useWishlistStore();

  console.log("wishlist", wishlist);
  return <div>Wishlist</div>;
};

export default Wishlist;
