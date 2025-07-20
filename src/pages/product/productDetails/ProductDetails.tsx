import { useMemo } from "react";
import { useGetProductById } from "../../../api/product/product.service";
import useQueryParams from "../../../hooks/useQueryParams";
import { FetchedProductType } from "../../../types";
import ImageCarousel from "../../../components/carousels/ImageCarousel";

const ProductDetails = () => {
  const { params } = useQueryParams();
  const productQuery = useGetProductById({
    queryParams: { productId: params.productId as string },
    data: {
      populateFields: {
        category: ["name"],
        reviews: ["rating"],
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

  return (
    <div className="w-full h-auto p-5">
      <div className="w-full lg:w-1/2">
        {images.length && (
          <ImageCarousel images={images as string[]} className="" />
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
