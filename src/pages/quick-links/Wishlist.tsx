import useWishlistStore from "../../store/wishlist.strore";

const Wishlist = () => {
  const { wishlist } = useWishlistStore();

  console.log("wishlist", wishlist);
  return <div>Wishlist</div>;
};

export default Wishlist;
