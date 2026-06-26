import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { TESTIMONIALS } from '@/constants/navbar.constants';
import type { TCategoryHierarchyNode, TLevel2 } from '@/types/api.type';
import { Link } from 'react-router-dom';
import { TestimonialCarousel } from '../../carousels/TestimonialCarousel';
import { CategoryLabel, L2Category } from './grand-children';

const About = ({ categories }: { categories: TCategoryHierarchyNode<TLevel2>[] }) => {
  return (
    <L2Category categories={categories}>
      <div className="break-inside-auto space-y-3 px-2 md:space-y-4 lg:space-y-5">
        <div className="border-b-battleship-davys-gray space-y-1 border-b pb-1 md:space-y-2 md:pb-2">
          <CategoryLabel name="Partner with us" />
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
          <CategoryLabel name="Peoples Love BQ" />
          <TestimonialCarousel data={TESTIMONIALS} />
        </div>
      </div>
    </L2Category>
  );
};

export default About;
