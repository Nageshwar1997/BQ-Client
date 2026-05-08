import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { ABOUT, TESTIMONIALS } from '@/constants/navbar.constants';
import { Link } from 'react-router-dom';
import { TestimonialCarousel } from '../../carousels/TestimonialCarousel';
import { CategoryLabel, SubCategories } from './grand-children';

const About = () => {
  return (
    <div className="base:columns-2 base:gap-3 columns-1 gap-2 p-4 md:columns-3 md:gap-5 lg:p-0">
      {ABOUT.subCategories.map((category, index) => (
        <div
          key={index}
          className="border-b-battleship-davys-gray base:mb-3 mb-2 break-inside-auto border-b pb-1 md:mb-3 md:pb-2"
        >
          <CategoryLabel {...category} className="px-2" />
          <SubCategories {...category} />
        </div>
      ))}
      <div className="base:mb-3 mb-2 break-inside-auto px-2 md:mb-4">
        <div className="border-battleship-davys-gray space-y-2 border-b pb-2 md:space-y-4 md:pb-4">
          <CategoryLabel label="Peoples Love BQ" className="cursor-default" />
          <TestimonialCarousel data={TESTIMONIALS} />
        </div>
        <div className="border-battleship-davys-gray mt-4 space-y-2 border-b pb-2 md:space-y-4 md:pb-4">
          <CategoryLabel label="Partner with us" className="cursor-default" />
          <div className="space-y-2 md:space-y-4">
            <GradientText
              text="Together, we're Unstoppable!"
              type="accent"
              className="block text-sm leading-5 font-medium italic"
            />
            <Link to="/partner-with-us" className="block w-fit">
              <Button
                content="Become a seller"
                pattern="outline"
                className="rounded-full! py-1.5! text-sm! leading-3"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
