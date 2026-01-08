import { eyes } from "../../data";
import { LevelTwoCategoryType } from "../../types";
import CategoryLabel from "../CategoryLabel";
import SubCategories from "../SubCategories";

const Eyes = () => {
  const categories: LevelTwoCategoryType[] = eyes.subCategories;
  return (
    <div className="p-4 lg:p-0 grid base:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 base:gap-3 md:gap-4 lg:gap-5 justify-start w-full">
      {categories.map((category, index) => {
        const { subCategories, label } = category;
        return (
          <div
            key={index}
            className={`space-y-4 min-w-50 max-w-75 pb-4 lg:pb-0 border-b border-primary-battleship-davys-gray ${
              ![
                "kohl_and_kajal",
                "mascaras",
                "eyeliners",
                "eyeshadow",
              ].includes(category.category)
                ? "lg:border-none"
                : "lg:pb-2"
            }`}
          >
            <CategoryLabel text={label} path={category.path} />
            <SubCategories subCategories={subCategories} />
          </div>
        );
      })}
      <div className="hidden lg:flex w-full max-h-46 xl:max-h-62.5 col-span-2 shadow-lg shadow-secondary-inverted items-center gap-5">
        <img
          src="/images/navbar/Mascara.jpg"
          alt="Mascara"
          className="max-w-[calc(50%-10px)] h-full object-fill object-center opacity-95 hover:opacity-100 cursor-pointer rounded-lg"
          loading="lazy"
        />
        <img
          src="/images/navbar/Mascara.jpg"
          alt="Mascara"
          className="max-w-[calc(50%-10px)] h-full object-fill object-center opacity-95 hover:opacity-100 cursor-pointer rounded-lg"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Eyes;
