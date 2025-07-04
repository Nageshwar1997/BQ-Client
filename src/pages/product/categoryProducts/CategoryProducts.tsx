import { useLocation } from "react-router-dom";
import { CATEGORY_IMAGE_DATA } from "./data";
import { useGetAllProducts } from "../../../api/product/product.service";
import { useEffect, useState, useMemo } from "react";

const CategoryProducts = () => {
  const { pathname } = useLocation();
  const [categoryImage, setCategoryImage] = useState<{
    img: string;
    category: string;
  } | null>(null);

  const paths = useMemo(
    () =>
      pathname
        .split("/")
        .filter((path) => path !== "")
        .slice(1, 4),
    [pathname]
  );

  useEffect(() => {
    const levelOneCat = CATEGORY_IMAGE_DATA[paths[0]];
    const levelTwoCat = levelOneCat?.subCategories?.find(
      (c) => c?.category === paths[1]
    );
    const levelThreeCat = levelTwoCat?.subCategories?.find(
      (c) => c?.category === paths[2]
    );
    const finalCategoryImgData = levelThreeCat || levelTwoCat || levelOneCat;

    setCategoryImage(finalCategoryImgData || null);
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
          categoryImage?.img ||
          "https://res.cloudinary.com/drbhw0nwt/image/upload/f_auto,q_auto/v1751652153/Beautinique/Category_Images/7-4-2025_1751652153544_Sugar-Elite.webp"
        }
        alt={categoryImage?.category || "Category"}
      />
    </div>
  );
};

export default CategoryProducts;
