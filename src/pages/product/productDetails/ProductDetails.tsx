import { useEffect, useMemo, useState } from "react";
import {
  useGetAllProductsInfinite,
  useGetProductById,
} from "../../../api/product/product.service";
import useQueryParams from "../../../hooks/useQueryParams";
import { FetchedProductType, TCarouselOption } from "../../../types";
import MediaCarousel from "../../../components/carousels/MediaCarousel";
import MediaCarouselWithParentMedia from "../../../components/carousels/MediaCarouselWithParentMedia";
import RatingStars from "../../../components/navbar/components/rating/RatingStars";
import { getCurrentViewers, toINRCurrency } from "../../../utils";
import { UpiIcon } from "../../../icons";
import Button from "../../../components/button/Button";
import { CATEGORY_VIDEOS } from "../../../constants";
import TextDisplay from "../../../components/TextDisplay";
import { TUseGetAllProductInfinite } from "../../../api/types";
import { useInView } from "react-intersection-observer";
import ProductCard from "../searchProducts/ProductCard";
import useHorizontalScrollable from "../../../hooks/useHorizontalScrollable";
import { LeftGradient, RightGradient } from "../../../components/Gradients";
import CustomerReviews from "./CustomerReviews";
import ProductDescriptionAndInfo from "./children/ProductDescriptionAndInfo";
import ProductVariants from "./children/ProductVariants";
import Modal from "../../../components/modal";

const ProductDetails = () => {
  const { params } = useQueryParams();
  const { ref, inView } = useInView();
  const [selectedShadeIdx, setSelectedShadeIdx] = useState<null | number>(null);
  const [showReviewMedia, setShowReviewMedia] = useState(false);
  const [showGradient, containerRef] = useHorizontalScrollable();
  const [currentIndex, setCurrentIndex] = useState<null | number>(0);

  const productQuery = useGetProductById({
    queryParams: { productId: params.productId ?? "" },
    data: {
      populateFields: {
        category: ["name", "category", "parentCategory"],
        reviews: [
          "rating",
          "comment",
          "images",
          "videos",
          "user",
          "title",
          "createdAt",
        ],
        shades: ["images", "colorCode", "stock", "shadeName"],
      },
    },
  });

  const product: FetchedProductType = productQuery.data?.product || {};
  const images: TCarouselOption[] = useMemo(() => {
    const commonImages = product?.commonImages ?? [];
    const shadeImages =
      product?.shades?.flatMap((shade) => shade?.images ?? []) ?? [];
    const allImages = [...commonImages, ...shadeImages];
    return allImages.map((url) => ({ url, type: "image" }));
  }, [product?.commonImages, product?.shades]);

  // const reviewImages = useMemo(() => {
  //   return product?.reviews?.flatMap((review) => review?.images) ?? [];
  // }, [product?.reviews]);

  const reviewMedia: TCarouselOption[] = useMemo(() => {
    return (
      product?.reviews?.flatMap((review) => {
        const images =
          review?.images?.map((url) => ({ url, type: "image" as const })) ?? [];
        const videos =
          review?.videos?.map((url) => ({ url, type: "video" as const })) ?? [];

        return [...images, ...videos];
      }) ?? []
    );
  }, [product?.reviews]);

  // const reviewVideos = useMemo(() => {
  //   return product?.reviews?.flatMap((review) => review?.videos) ?? [];
  // }, [product?.reviews]);

  const memoizedQueryParams: TUseGetAllProductInfinite = useMemo(
    () => ({
      data: {
        requiredFields: [
          "title",
          "brand",
          "commonImages",
          "discount",
          "sellingPrice",
          "originalPrice",
        ],
        populateFields: { category: ["name"], reviews: ["rating"] },
      },
      pageParams: { page: 1, limit: 5 },
      queryParams: {
        category_3: product.category?.category,
        category_2: product.category?.parentCategory.category,
        category_1: product.category?.parentCategory.parentCategory.category,
      },
      enabled: !!product?.category,
    }),
    [product?.category]
  );

  const {
    data: productsData,
    fetchNextPage,
    hasNextPage,
    // isFetchingNextPage,
    // isLoading: isLoadingProducts,
    // isError: isErrorProducts,
  } = useGetAllProductsInfinite(memoizedQueryParams);
  const products: FetchedProductType[] =
    productsData?.pages?.flatMap((page) => page.products) || [];

  const currentShade = useMemo(() => {
    return product?.shades?.[selectedShadeIdx || 0];
  }, [product?.shades, selectedShadeIdx]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="w-full h-auto flex flex-col gap-8 p-8">
      <div className="w-full flex flex-col lg:flex-row items-start gap-5">
        <div className="w-full lg:w-1/2 lg:sticky top-24">
          <div className="flex flex-col gap-4">
            {images.length > 0 && (
              <MediaCarouselWithParentMedia
                data={images}
                needButtonControls={false}
                selected={
                  selectedShadeIdx !== null
                    ? product.commonImages.length + selectedShadeIdx
                    : undefined
                }
              />
            )}
            <div className="w-full hidden lg:block">
              <hr className="w-full h-px block border-none bg-gradient-line mb-4" />
              <ProductDescriptionAndInfo product={product} />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 lg:sticky top-24">
          <div className="flex flex-col gap-4">
            <h3 className="text-3xl/[32px] font-medium">
              {product?.title}
              {product?.shades?.length ? ` - ${currentShade?.shadeName}` : ""}
            </h3>
            <div className="flex items-center gap-2">
              <RatingStars
                className="[&>svg]:w-5 [&>svg]:h-5"
                rating={
                  product?.reviews && product.reviews.length > 0
                    ? product.reviews.reduce(
                        (acc, review) => acc + (review?.rating || 0),
                        0
                      ) / product.reviews.length
                    : 0
                }
              />
              <div className="flex items-center gap-0.5">
                <span className="text-base/none">(</span>
                <span className="text-base/none">
                  {product?.reviews?.length}
                </span>
                <span className="text-base/none">)</span>
              </div>
            </div>
            <div className="font-medium text-xl/normal text-secondary flex items-center gap-5">
              <p>{toINRCurrency(product.sellingPrice)}</p>
              <p className="line-through opacity-60">
                {toINRCurrency(product.originalPrice)}
              </p>
              <p className="text-green-600">
                {product.discount?.toFixed(0)}% off
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p>Tax included</p>
              <div className="relative border border-primary-50 rounded">
                <div className="absolute -top-2.5 left-3 bg-primary text-primary-inverted px-2 py-px text-[10px] rounded">
                  Flat ₹100 cashback
                </div>
                <div className="flex justify-between items-center relative text-sm">
                  <div className="flex items-center gap-2 font-medium leading-none mt-px -mb-1 px-4 py-2">
                    <p>
                      Pay{" "}
                      <span className="text-green-600 font-semibold">
                        {
                          toINRCurrency(product.sellingPrice * 0.1).split(
                            "."
                          )[0]
                        }{" "}
                        now,
                      </span>{" "}
                      rest via BQ pay later
                    </p>
                    <div className="bg-primary-50 w-px h-3"></div>
                    <p className="">0% EMI on</p>
                    <UpiIcon width={45} height={16} />
                  </div>
                  <p className="h-full absolute right-0 top-0 bg-red-600 rounded-r-[3px] text-sm/none flex items-center px-3 font-medium text-white">
                    {/* Buy on EMI */}
                    Coming Soon
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 border border-primary-50 p-2 rounded">
              <div className="w-3 h-3 rounded-full bg-gradient-to-t from-green-500/50 to-green-500/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full animate-blink bg-green-600"></div>
              </div>
              <div>
                {getCurrentViewers()} People are viewing this product right now.
              </div>
            </div>
            {product.shades?.length > 0 && (
              <ProductVariants
                currentShade={currentShade}
                shades={product.shades}
                onChange={(idx) => setSelectedShadeIdx(idx)}
              />
            )}
            <div className="flex items-center gap-4 py-4">
              <Button content="Add to Cart" pattern="primary" />
              <Button content="Go to Cart" pattern="secondary" />
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
      </div>
      <div className="w-full py-8 border-y border-y-primary-50">
        <TextDisplay
          content={[{ isHighlighted: true, text: "Similar Products" }]}
          className="text-xl md:text-3xl lg:text-4xl"
        />
        <hr className="max-w-xl mx-auto h-px block border-none bg-gradient-line my-4" />
        <div className="relative">
          {showGradient.left && (
            <LeftGradient className="h-full !w-5 !sm:w-20" />
          )}
          <div
            className={`flex gap-4 overflow-x-auto scroll-smooth px-4 ${
              !showGradient.left && !showGradient.right
                ? "justify-center"
                : "justify-start"
            }`}
            ref={containerRef}
          >
            {products
              .filter((p) => p?._id !== product?._id)
              .map((product, index) => (
                <div
                  key={index}
                  className="shrink-0 w-[260px]"
                  ref={index === products.length - 2 ? ref : null}
                >
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
          {showGradient.right && (
            <RightGradient className="h-full !w-5 !sm:w-20" />
          )}
        </div>
      </div>
      <div className="w-full pb-8 border-b border-b-primary-50 space-y-4">
        <TextDisplay
          content={[{ isHighlighted: true, text: "Customer Reviews" }]}
          className="text-xl md:text-3xl lg:text-4xl"
        />
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-8">
          <div className="w-full">
            <CustomerReviews reviews={product?.reviews?.map((r) => r.rating)} />
          </div>
          <div className="w-full flex flex-col gap-4 items-center justify-center">
            <Button
              pattern="secondary"
              content="Write a Review"
              className="max-w-44 py-2! lg:py-3 !rounded-md"
            />
            <div className="flex flex-col gap-0.5 items-center justify-center text-secondary">
              <div className="flex items-center gap-2 text-sm">
                <RatingStars
                  rating={
                    product?.reviews && product.reviews.length > 0
                      ? product.reviews.reduce(
                          (acc, review) => acc + (review?.rating || 0),
                          0
                        ) / product.reviews.length
                      : 0
                  }
                />
                <span>
                  {product?.reviews && product.reviews.length > 0
                    ? product.reviews.reduce(
                        (acc, review) => acc + (review?.rating || 0),
                        0
                      ) / product.reviews.length
                    : (0).toFixed(1)}{" "}
                  out of 5
                </span>
              </div>
              <p>Based on {product?.reviews?.length} reviews</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full pb-8 border-b border-b-primary-50 space-y-4">
        <p className="text-center text-lg/normal font-medium">
          Customer review's photos & videos
        </p>
        <MediaCarousel
          data={reviewMedia}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onImageClick={() => {
            setShowReviewMedia(true);
          }}
        />
      </div>
      {showReviewMedia && (
        <Modal
          children={
            <MediaCarouselWithParentMedia
              className=""
              data={reviewMedia}
              needButtonControls={true}
              selected={currentIndex}
              videoProps={{ autoPlay: true, muted: true, loop: true }}
            />
          }
          className="max-w-xl"
          isOpen={showReviewMedia}
          onClose={() => {
            setShowReviewMedia(false);
            setCurrentIndex(null);
          }}
        />
      )}
    </div>
  );
};

export default ProductDetails;
