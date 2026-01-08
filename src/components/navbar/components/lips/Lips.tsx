import { LevelTwoCategoryType } from "../../types";
import { lips } from "../../data";
import CategoryLabel from "../CategoryLabel";
import SubCategories from "../SubCategories";

const Lips = () => {
  const categories: LevelTwoCategoryType[] = lips.subCategories;

  return (
    <div className="p-4 lg:p-0 w-full h-full grid grid-cols-1 base:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 base:gap-3 md:gap-4 lg:gap-5 content-center">
      {categories.map((category, index) => {
        const { subCategories, label } = category;
        return (
          <div
            key={index}
            className={`space-y-4 min-w-50 max-w-75 pb-4 lg:pb-0 border-b border-primary-battleship-davys-gray ${
              [
                "finish_types",
                "lipstick_forms",
                "long_lasting_lipsticks",
                "lip_care",
              ].includes(category.category)
                ? category.category === "lip_care"
                  ? "lg:border-transfer lg:pb-0 xl:pb-2 xl:border-primary-battleship-davys-gray"
                  : "lg:pb-2"
                : "lg:border-none"
            }`}
          >
            <CategoryLabel text={label} path={category.path} />
            <SubCategories subCategories={subCategories} />
          </div>
        );
      })}
      <div className="hidden lg:flex w-full max-h-46 xl:max-h-62.5 col-span-2 shadow-lg shadow-secondary-inverted items-center gap-5">
        <img
          src="/images/navbar/Lipstick1.jpg"
          alt="Lipstick1"
          className="max-w-[calc(50%-10px)] h-full object-fill object-center opacity-95 hover:opacity-100 cursor-pointer rounded-lg"
          loading="lazy"
        />
        <img
          src="/images/navbar/Lipstick2.jpg"
          alt="Lipstick2"
          className="max-w-[calc(50%-10px)] h-full object-fill object-center opacity-95 hover:opacity-100 cursor-pointer rounded-lg"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Lips;
