import { useMemo, useState } from "react";
import { useGetProductById } from "../../../api/product/product.service";
import useQueryParams from "../../../hooks/useQueryParams";
import { FetchedProductType, TCarouselOption } from "../../../types";
import ReviewsSection from "./children/ReviewsSection";
import MediaCarouselWithParentMedia from "../../../components/carousels/MediaCarouselWithParentMedia";
import RatingStars from "../../../components/navbar/components/rating/RatingStars";
import { toINRCurrency } from "../../../utils";
import Button from "../../../components/button/Button";
import { CATEGORY_VIDEOS } from "../../../constants";
import SimilarProducts from "./children/SimilarProducts";
import BuyOnEMIAndCurrentViewers from "./children/BuyOnEMIAndCurrentViewers";
import ProductDescriptionAndInfo from "./children/ProductDescriptionAndInfo";
import ProductVariants from "./children/ProductVariants";

const ProductDetails = () => {
  const { params } = useQueryParams();
  const [selectedShadeIdx, setSelectedShadeIdx] = useState<null | number>(null);

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

  const currentShade = useMemo(() => {
    return product?.shades?.[selectedShadeIdx || 0];
  }, [product?.shades, selectedShadeIdx]);

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
            <h3 className="text-lg/[24px] md:text-3xl/[32px] font-medium">
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
      <SimilarProducts category={product.category} productId={product._id} />
      <ReviewsSection reviews={product.reviews} />
    </div>
  );
};

export default ProductDetails;
