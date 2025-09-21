import { Fragment, useMemo, useState } from "react";
import { useGetProductById } from "../../../api/product/product.service";
import useQueryParams from "../../../hooks/useQueryParams";
import { FetchedProductType, TMediaOption } from "../../../types";
import ReviewsSection from "./children/ReviewsSection";
import MediaCarouselWithParentMedia from "../../../components/carousels/MediaCarouselWithParentMedia";
import RatingStars from "../../../components/ui/RatingStars";
import { getAvgRating, toINRCurrency } from "../../../utils";
import Button from "../../../components/button/Button";
import { CATEGORY_VIDEOS } from "../../../constants";
import SimilarProducts from "./children/SimilarProducts";
import BuyOnEMIAndCurrentViewers from "./children/BuyOnEMIAndCurrentViewers";
import ProductDescriptionAndInfo from "./children/ProductDescriptionAndInfo";
import ProductVariants from "./children/ProductVariants";
import ProductDetailsSkeleton from "../../../components/skeletons/children/ProductDetailsSkeleton";
import ShowError from "../../../components/errors/ShowError";
import EmptyData from "../../../components/empty-data/EmptyData";
import RatingBars from "./children/RatingBars";
import ReviewsMedia from "./children/ReviewsMedia";
import {
  useAddProductToCart,
  useGetUserCart,
} from "../../../api/cart/cart.service";
import { useUserStore } from "../../../store/user.store";
import usePathParams from "../../../hooks/usePathParams";

const ProductDetails = () => {
  const { setParams } = useQueryParams();
  const { pathParams, navigate } = usePathParams();
  const [selectedShadeIdx, setSelectedShadeIdx] = useState<null | number>(null);
  const { isAuthenticated } = useUserStore();
  const { mutateAsync, isPending } = useAddProductToCart();
  const getUserCartQuery = useGetUserCart();

  const { data, isLoading, isError } = useGetProductById({
    queryParams: { productId: pathParams.productId ?? "" },
    data: {
      populateFields: {
        category: ["name", "category", "parentCategory"],
        reviews: ["rating", "images", "videos"],
        shades: ["images", "colorCode", "stock", "shadeName"],
      },
    },
  });

  const product: FetchedProductType = data?.product || {};
  const images: TMediaOption[] = useMemo(() => {
    const commonImages = product?.commonImages ?? [];
    const shadeImages =
      product?.shades?.flatMap((shade) => shade?.images ?? []) ?? [];
    const allImages = [...commonImages, ...shadeImages];
    return allImages.map((url) => ({ url, type: "image" }));
  }, [product?.commonImages, product?.shades]);

  const currentShade = useMemo(() => {
    return product?.shades?.[selectedShadeIdx || 0];
  }, [product?.shades, selectedShadeIdx]);

  const cartProducts = useMemo(() => {
    return getUserCartQuery.data?.cart?.products ?? [];
  }, [getUserCartQuery.data?.cart?.products]);

  const isCartFull = cartProducts?.length >= 10;

  const isOutOfStock = useMemo(() => {
    return (
      ((product?.shades?.length > 0 && currentShade.stock === 0) ||
        (product?.shades?.length === 0 && product.totalStock === 0)) ??
      false
    );
  }, [currentShade?.stock, product?.shades?.length, product?.totalStock]);

  const isProductExistInCart = useMemo(() => {
    return (
      cartProducts.some(
        (item: { product: { _id: string } }) =>
          item?.product?._id === pathParams?.productId
      ) ?? false
    );
  }, [cartProducts, pathParams?.productId]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setParams({ login: "true" });
      return;
    }
    mutateAsync(
      {
        productId: pathParams?.productId ?? "",
        shadeId: currentShade?._id,
      },
      { onSuccess: getUserCartQuery.refetch }
    );
  };

  return (
    <div className="w-full h-auto flex flex-col gap-8 p-8">
      <div className="w-full flex flex-col lg:flex-row items-start gap-5">
        {isLoading ? (
          <ProductDetailsSkeleton />
        ) : isError ? (
          <ShowError
            headingText="Something went wrong!"
            descriptionText="Failed to get the product. Please reload the page"
            className="w-full h-[50dvh] mx-auto mb-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase [&>p]:text-xs [&>p]:base:text-sm [&>p]:sm:text-base [&>p]:md:text-lg"
          />
        ) : Object.keys(product)?.length === 0 ? (
          <EmptyData
            content={"No product found"}
            className="w-full h-[50dvh] mx-auto [&>h3]:text-base [&>h3]:base:text-base [&>h3]:sm:text-xl [&>h3]:md:text-2xl [&>h3]:lg:text-3xl [&>h3]:xl:text-4xl [&>h3]:uppercase gap-5"
          />
        ) : (
          <Fragment>
            <div className="w-full lg:w-1/2 lg:sticky top-24">
              <div className="flex flex-col gap-4">
                <MediaCarouselWithParentMedia
                  data={images}
                  needButtonControls={false}
                  selected={
                    selectedShadeIdx !== null
                      ? product.commonImages.length + selectedShadeIdx
                      : undefined
                  }
                />
                <div className="w-full hidden lg:block">
                  <hr className="w-full h-px block border-none bg-gradient-line mb-4" />
                  <ProductDescriptionAndInfo product={product} />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 lg:sticky top-24">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg/[24px] md:text-3xl/[32px] font-medium">
                  {product?.title}
                  {product?.shades?.length
                    ? ` - ${currentShade?.shadeName}`
                    : ""}
                </h3>
                <div className="flex items-center gap-2">
                  <RatingStars
                    className="[&>svg]:w-5 [&>svg]:h-5"
                    rating={getAvgRating(product.reviews)}
                  />
                  <div className="flex items-center gap-0.5">
                    <span className="text-base/none">(</span>
                    <span className="text-base/none">
                      {product?.reviews?.length}
                    </span>
                    <span className="text-base/none">)</span>
                  </div>
                </div>
                <div className="font-medium text-lg/normal text-secondary flex items-center gap-5">
                  <p>{toINRCurrency(product.sellingPrice)}</p>
                  <p className="line-through opacity-60">
                    {toINRCurrency(product.originalPrice)}
                  </p>
                  <p className="text-green-600">
                    {product.discount?.toFixed(0)}% off
                  </p>
                </div>
                <BuyOnEMIAndCurrentViewers price={product.sellingPrice} />
                {product.shades?.length > 0 && (
                  <ProductVariants
                    currentShade={currentShade}
                    shades={product.shades}
                    onChange={(idx) => setSelectedShadeIdx(idx)}
                  />
                )}
                <div className="flex items-center gap-4 py-4">
                  <Button
                    className="[&>span]:line-clamp-1"
                    content={
                      getUserCartQuery?.isRefetching
                        ? "Checking..."
                        : isPending
                        ? "Adding..."
                        : isOutOfStock
                        ? "Out of stock"
                        : isCartFull
                        ? "Cart is full"
                        : isProductExistInCart
                        ? "Already in Cart"
                        : "Add to Cart"
                    }
                    pattern="primary"
                    onClick={handleAddToCart}
                    disable={
                      isPending ||
                      getUserCartQuery?.isRefetching ||
                      isOutOfStock ||
                      isCartFull ||
                      isProductExistInCart
                    }
                  />
                  <Button
                    content="Go to Cart"
                    pattern="secondary"
                    onClick={() => navigate("/cart")}
                  />
                </div>
                <hr className="w-full h-px block border-none bg-gradient-line" />
                <div className="flex flex-shrink-0 gap-4 overflow-x-scroll">
                  {CATEGORY_VIDEOS.map((video, index) => (
                    <div
                      key={index}
                      className="flex-1 shrink rounded-lg overflow-hidden w-full h-full"
                    >
                      <video
                        src={video.src}
                        controls
                        playsInline
                        autoPlay
                        muted
                        loop
                        className="w-full h-full aspect-[9/16] object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-full lg:hidden">
                <hr className="w-full h-px block border-none bg-gradient-line my-4 lg:mb-4" />
                <ProductDescriptionAndInfo product={product} className="" />
              </div>
            </div>
          </Fragment>
        )}
      </div>
      <SimilarProducts category={product.category} />
      <RatingBars reviews={product?.reviews} />
      <ReviewsMedia
        reviews={product?.reviews}
        isError={isError}
        isLoading={isLoading}
      />
      <ReviewsSection />
    </div>
  );
};

export default ProductDetails;
