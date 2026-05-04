import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { CAREERS, COMPANY, PRESS, TESTIMONIALS, TRUST_CENTER } from '@/constants/navbar.constants';
import { Link } from 'react-router-dom';
import { TestimonialCarousel } from '../../carousels/TestimonialCarousel';
import { CategoryLabel, SubCategories } from './grand-children';

const About = () => {
  const categories = [
    [COMPANY, PRESS],
    [CAREERS, TRUST_CENTER],
  ];
  return (
    <div className="base:grid-cols-2 base:gap-3 grid grid-cols-1 content-start justify-start gap-2 p-4 md:grid-cols-3 md:gap-4 lg:gap-5 lg:p-0">
      {categories.map((item, i) => (
        <div key={i} className="flex w-fit flex-col gap-2">
          {item.map((subCat, index) => (
            <div
              key={i + index}
              className={`border-battleship-davys-gray max-w-75 min-w-50 space-y-4 border-b pb-4 lg:pb-0 ${
                ['press', 'trust_center_and_legal'].includes(subCat.category)
                  ? 'lg:border-none'
                  : 'lg:pb-2'
              }`}
            >
              <CategoryLabel {...subCat} />
              <SubCategories l1Cat="about" {...subCat} />
            </div>
          ))}
        </div>
      ))}
      <div className="base:grid-cols-2 base:col-span-2 grid w-full gap-2 md:col-span-1 md:grid-cols-1">
        <div className="border-battleship-davys-gray max-w-75 min-w-50 space-y-4 border-b pb-4 lg:pb-2">
          <CategoryLabel label="Peoples Love BQ" className="cursor-default" />
          <TestimonialCarousel data={TESTIMONIALS} />
        </div>
        <div className="border-battleship-davys-gray max-w-75 min-w-50 space-y-4 border-b pb-4 lg:border-none lg:pb-2">
          <CategoryLabel label="Partner with us" className="cursor-default" />
          <div className="space-y-4 px-3">
            <GradientText
              text="Together, we're Unstoppable!"
              type="accent"
              className="block text-sm leading-5 font-medium italic"
            />
            <Link to="/partner-with-us" className="block w-fit">
              <Button
                content="Team Up"
                pattern="outline"
                className="rounded-full! py-1! text-sm! leading-3"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
