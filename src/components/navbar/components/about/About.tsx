import { Link } from "react-router-dom";
import Button from "../../../button/Button";
import CategoryLabel from "../CategoryLabel";
import SubCategories from "../SubCategories";
import { careers, company, press, testimonials, trust_center } from "./data";
import TestimonialCarousel from "./TestimonialCarousel";

const categories = [
  [company, press],
  [careers, trust_center],
];

const About = () => {
  return (
    <div className="p-4 lg:p-0 grid grid-cols-1 base:grid-cols-2 md:grid-cols-3 gap-2 base:gap-3 md:gap-4 lg:gap-5 justify-start content-start">
      {categories.map((item, i) => (
        <div key={i} className={`flex flex-col gap-2 w-fit`}>
          {item.map((category, index) => {
            const { subCategories, label } = category;
            return (
              <div
                key={i + index}
                className={`space-y-4 min-w-50 max-w-75 pb-4 lg:pb-0 border-b border-primary-battleship-davys-gray ${
                  ["press", "trust_center_and_legal"].includes(
                    category.category
                  )
                    ? "lg:border-none"
                    : "lg:pb-2"
                }`}
              >
                <CategoryLabel text={label} path={category.path} />
                <SubCategories subCategories={subCategories} />
              </div>
            );
          })}
        </div>
      ))}
      <div className="grid base:grid-cols-2 md:grid-cols-1 gap-2 base:col-span-2 md:col-span-1 w-full">
        <div className="space-y-4 min-w-50 max-w-75 pb-4 lg:pb-2 border-b border-primary-battleship-davys-gray">
          <CategoryLabel text="Peoples Love BQ" className="cursor-default" />
          <TestimonialCarousel testimonials={testimonials} />
        </div>
        <div className="space-y-4 min-w-50 max-w-75 pb-4 lg:pb-2 border-b border-primary-battleship-davys-gray lg:border-none">
          <CategoryLabel text={"Partner with us"} className="cursor-default" />
          <div className="px-3 space-y-4">
            <span className="block bg-accent-duo bg-clip-text text-transparent italic text-sm font-medium leading-5">
              Together, we're Unstoppable!
            </span>
            <Link to="/partner-with-us" className="block w-fit">
              <Button
                content="Team Up"
                pattern="outline"
                className="py-1! rounded-full! leading-3 text-sm!"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
