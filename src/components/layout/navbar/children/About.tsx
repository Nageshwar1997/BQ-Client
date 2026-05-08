import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { ABOUT, TESTIMONIALS } from '@/constants/navbar.constants';
import { Link } from 'react-router-dom';
import { TestimonialCarousel } from '../../carousels/TestimonialCarousel';
import { CategoryLabel, SubCategories } from './grand-children';

const About = () => {
  return (
    <div className="base:columns-2 columns-1 gap-3 md:columns-3 md:gap-4 lg:columns-4 lg:gap-5">
      {ABOUT.subCategories.map((category, index) => (
        <div
          key={index}
          className="border-b-battleship-davys-gray mb-3 break-inside-auto border-b pb-1 md:mb-4 md:pb-2 lg:mb-5"
        >
          <CategoryLabel {...category} className="px-2" />
          <SubCategories {...category} />
        </div>
      ))}
      <div className="break-inside-auto space-y-3 px-2 md:space-y-4 lg:space-y-5">
        <div className="border-b-battleship-davys-gray space-y-1 border-b pb-1 md:space-y-2 md:pb-2">
          <CategoryLabel label="Partner with us" className="cursor-default" />
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
        <div className="border-b-battleship-davys-gray space-y-1 border-b pb-1 md:space-y-2 md:pb-2">
          <CategoryLabel label="Peoples Love BQ" className="cursor-default" />
          <TestimonialCarousel data={TESTIMONIALS} />
        </div>
      </div>
    </div>
  );
};

export default About;
