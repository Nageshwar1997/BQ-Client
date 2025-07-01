import { useLocation } from "react-router-dom";
import { CATEGORY_IMAGE_DATA } from "./data";

const CategoryProducts = () => {
  const { pathname } = useLocation();

  console.log("pathname", pathname);
  const paths = pathname
    .split("/")
    .filter((path) => path !== "")
    .slice(1, 4);


  const levelOneCat = CATEGORY_IMAGE_DATA[paths[0]];
  const levelTwoCat = levelOneCat?.subCategories?.find(
    (c) => c?.category === paths[1]
  );
  const levelThreeCat = levelTwoCat?.subCategories?.find(
    (c) => c?.category === paths[2]
  );
  const finalCategoryImgData = levelThreeCat || levelTwoCat || levelOneCat;

  return (
    <div className="lg:-mt-16">
      {finalCategoryImgData.img && (
        <img
          src={finalCategoryImgData.img}
          alt={finalCategoryImgData.category}
        />
      )}
    </div>
  );
};

export default CategoryProducts;
