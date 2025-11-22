import { useMemo } from "react";
import ProductCard from "../../components/ui/ProductCard";
import usePathParams from "../../hooks/usePathParams";
import useWishlistStore from "../../store/wishlist.store";

const Wishlist = () => {
  const { wishlist } = useWishlistStore();
  const { navigate } = usePathParams();

  const products = useMemo(() => wishlist?.products || [], [wishlist]);

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto space-y-16">
      <header
        className={`text-center space-y-4 ${
          !products.length
            ? "min-h-[80dvh] flex flex-col items-center justify-center"
            : ""
        }`}
      >
        <h1 className="text-2xl base:text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text bg-silver-duo text-transparent">
          Your Wishlist {products.length === 0 ? "is empty" : ""}
        </h1>
        <p className="text-base sm:text-lg text-tertiary max-w-2xl mx-auto">
          {!products.length
            ? "Add your favorite products to keep track of them!"
            : "Keep track of your favorite products and get notified when they are back in stock."}
        </p>
      </header>
      {products.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(270px,max-content))] gap-6 justify-center p-4">
          {wishlist?.products?.map((product) => {
            return (
              <div key={product._id} className="h-full max-w-xs">
                <ProductCard
                  product={product}
                  onClick={() => navigate(`/product/${product._id}`)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
