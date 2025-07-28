import { useMemo, useState } from "react";
import { useGetProductById } from "../../../api/product/product.service";
import useQueryParams from "../../../hooks/useQueryParams";
import { FetchedProductType } from "../../../types";
import ImageCarousel from "../../../components/carousels/ImageCarousel";
import RatingStars from "../../../components/navbar/components/rating/RatingStars";
import { getCurrentViewers, toINRCurrency } from "../../../utils";
import { DropdownIcon, UpiIcon } from "../../../icons";
import Button from "../../../components/button/Button";
import { CATEGORY_VIDEOS } from "../../../constants";

const ProductDetails = () => {
  const { params } = useQueryParams();
  const [selectedShadeIdx, setSelectedShadeIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<number[]>([]);

  const productQuery = useGetProductById({
    queryParams: { productId: params.productId as string },
    data: {
      populateFields: {
        category: ["name"],
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
  const images = useMemo(() => {
    const commonImages = product?.commonImages ?? [];
    const shadeImages = product?.shades?.map((shade) => shade?.images) ?? [];
    return [...commonImages, ...shadeImages];
  }, [product?.commonImages, product?.shades]);

  const currentShade = useMemo(() => {
    return product?.shades?.[selectedShadeIdx];
  }, [product?.shades, selectedShadeIdx]);

  console.log("activeTab", activeTab);

  return (
    <div className="w-full h-auto p-8">
      <div className="w-full flex flex-col lg:flex-row items-start gap-5">
        {/* Left - Images */}
        <div className="w-full lg:w-1/2 sticky top-24">
          <div className="flex flex-col gap-4">
            {images.length > 0 && (
              <ImageCarousel
                images={images as string[]}
                className=""
                selected={product.commonImages.length + selectedShadeIdx}
              />
            )}
            <div className="w-full">
              <hr className="w-full h-px block border-none bg-gradient-line my-4" />
              {[
                "Description",
                "How To Use",
                "Ingredients",
                "Additional Details",
              ].map((item, index) => (
                <div className="w-full" key={index}>
                  <button
                    onClick={() =>
                      setActiveTab(
                        (prev) =>
                          prev.includes(index)
                            ? prev.filter((i) => i !== index) // remove if exists
                            : [...prev, index] // add if not exists
                      )
                    }
                    className="w-full flex items-center justify-between gap-5 border py-4 pr-4"
                  >
                    <span>{item}</span>
                    <DropdownIcon
                      className={activeTab.includes(index) ? "" : "rotate-180"}
                    />
                  </button>
                  <hr className="w-full h-px block border-none bg-gradient-line my-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 sticky top-24">
          <div className="flex flex-col gap-4">
            <h3 className="text-3xl/[32px] font-medium">
              {product?.title}
              {product?.shades?.length ? ` - ${currentShade?.shadeName}` : ""}
            </h3>
            <div className="flex items-center gap-2">
              <RatingStars
                className="[&>svg]:w-5 [&>svg]:h-5"
                rating={product?.reviews?.reduce(
                  (acc, review) => acc + review?.rating,
                  0
                )}
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
              <>
                <div className="text-sm text-secondary">
                  {currentShade.colorCode ? "Color: " : "Variant: "}
                  {currentShade.shadeName}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.shades.map((shade, index) => (
                    <div
                      key={shade._id}
                      className="cursor-pointer relative"
                      onClick={() => setSelectedShadeIdx(index)}
                    >
                      <div
                        className={`w-14 h-14 rounded-full overflow-hidden border p-0.5 ${
                          currentShade._id === shade._id
                            ? "border-tertiary"
                            : "border-primary-30"
                        }`}
                      >
                        {shade.colorCode ? (
                          <div
                            className="w-full h-full rounded-full"
                            style={{ backgroundColor: shade.colorCode }}
                          ></div>
                        ) : (
                          <img
                            src={shade.images[0] as string}
                            alt={shade.shadeName}
                            className="w-full h-full aspect-square object-cover object-center rounded-full"
                          />
                        )}
                        {shade.stock === 0 && (
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-tertiary -rotate-45" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
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
            <hr className="w-full h-px block border-none bg-gradient-line" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
