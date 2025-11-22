import { MouseEvent } from "react";
import useUserWishlist from "../../hooks/useUserWishlist";
import { HeartIcon } from "../../icons";
import { IconProps, IWishlist } from "../../types";

const WishlistButton = ({
  product,
  ...iconProps
}: {
  product: IWishlist["products"][number];
} & IconProps) => {
  const { handleAddToWishlist, handleRemoveFromWishlist, isInWishlist } =
    useUserWishlist();

  const inWishlist = isInWishlist(product._id);

  const handleWishlistClick = (e: MouseEvent<SVGSVGElement>) => {
    e.stopPropagation();
    if (iconProps?.onClick) {
      iconProps?.onClick(e);
    } else if (inWishlist) {
      handleRemoveFromWishlist(product._id);
    } else {
      handleAddToWishlist(product);
    }
  };
  return (
    <HeartIcon
      {...iconProps}
      className={`stroke-red-600 cursor-pointer ${
        inWishlist ? "fill-red-600" : "fill-none"
      } ${iconProps?.className ?? ""}`}
      onClick={handleWishlistClick}
      preserveAlpha={true} //NOTE - To show shadow
    />
  );
};

export default WishlistButton;
