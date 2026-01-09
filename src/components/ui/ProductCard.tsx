import { FetchedProductType } from "../../types";
import { getAvgRating, toINRCurrency } from "../../utils";
import RatingStars from "./RatingStars";
import WishlistButton from "./WishlistButton";

const ProductCard = ({
  product,
  onClick,
}: {
  product: FetchedProductType;
  onClick?: () => void;
}) => {
  return (
    <div
      className="p-4 rounded-lg shadow-xs bg-primary-inverted flex flex-col gap-4 border-rounded-corners-gradient cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden rounded-md relative group">
        <img
          src={product?.commonImages[0]}
          alt="Product"
          className="w-full h-full object-contain aspect-square hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-0 inset-x-0 p-1 flex items-center justify-between cursor-default">
          <WishlistButton product={product} />
          <span className="w-6 h-6 text-[8px] flex flex-col items-center justify-center rounded-full font-semibold dark:bg-green-700 light:bg-green-600 leading-none">
            {`-${product?.discount.toFixed(0)}%`}
          </span>
        </div>
      </div>
      <hr className="h-px block border-none bg-gradient-line" />
      <div className="flex flex-col justify-between gap-1 grow">
        <p className="text-base/normal font-semibold line-clamp-2 text-secondary">
          {product?.title}
        </p>
        <div className="text-sm font-medium line-clamp-1 text-secondary opacity-70">
          {product?.brand}
        </div>
        {product?.category?.name && (
          <div className="text-sm text-tertiary line-clamp-1">
            {product.category.name}
          </div>
        )}
        <div className="text-sm font-medium text-tertiary flex items-center gap-3">
          <span className="text-secondary">
            {toINRCurrency(product?.sellingPrice)}
          </span>
          <span className="text-tertiary line-through opacity-60">
            {toINRCurrency(product?.originalPrice)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RatingStars rating={getAvgRating(product?.reviews)} />
          <div className="flex items-center gap-0.5">
            <span className="text-base/none">(</span>
            <span className="text-base/none">{product?.reviews?.length}</span>
            <span className="text-base/none">)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
