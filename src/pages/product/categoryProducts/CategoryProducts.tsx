import { useLocation } from "react-router-dom";
import { CATEGORY_IMAGE_DATA } from "./data";
import { useGetAllProducts } from "../../../api/product/product.service";
import { useEffect, useRef } from "react";

const CategoryProducts = () => {
  const { pathname } = useLocation();
  const imgRef = useRef<Record<"img" | "category", string> | null>(null);
  const paths = pathname
    .split("/")
    .filter((path) => path !== "")
    .slice(1, 4);

  useEffect(() => {
    const levelOneCat = CATEGORY_IMAGE_DATA[paths[0]];
    const levelTwoCat = levelOneCat?.subCategories?.find(
      (c) => c?.category === paths[1]
    );
    const levelThreeCat = levelTwoCat?.subCategories?.find(
      (c) => c?.category === paths[2]
    );
    const finalCategoryImgData = levelThreeCat || levelTwoCat || levelOneCat;

    imgRef.current = finalCategoryImgData;

  }, [paths]);

  const allProducts = useGetAllProducts();

  useEffect(() => {
    allProducts.mutate({
      data: {
        requiredFields: ["title"],
      },
      params: { page: 1, limit: 10 },
      queryParams: {
        category_1: paths[0],
        category_2: paths[1],
        category_3: paths[2],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="lg:-mt-16">
      <img
        src={
          imgRef.current?.img ??
          // Change it later to the new default placeholder image
          "/images/category-images/for-you/new.webp"
        }
        alt={imgRef.current?.category}
      />
    </div>
  );
};

export default CategoryProducts;
