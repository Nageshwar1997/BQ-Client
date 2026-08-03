import { Link } from 'react-router-dom';

import Button from '@/components/ui/Button';
import GradientText from '@/components/ui/GradientText';
import { ROUTES } from '@/constants/routes.constants';
import type { TCategoryHierarchyNode, TLevel2 } from '@/types/api.type';

import { TestimonialCarousel } from '../../carousels/TestimonialCarousel';
import { CategoryLabel, CategorySection, L2Category } from './grand-children';

const About = ({
  categories,
  l1Slug,
}: {
  categories: TCategoryHierarchyNode<TLevel2>[];
  l1Slug?: string;
}) => {
  return (
    <L2Category categories={categories} l1Slug={l1Slug}>
      <div className="break-inside-auto space-y-3 px-2 md:space-y-4 lg:space-y-5">
        <CategorySection className="space-y-1 md:space-y-2 md:pb-2">
          <CategoryLabel name="Partner with us" path={ROUTES.COMPANY.PARTNER_WITH_US} />
          <GradientText
            text="Together, we're Unstoppable!"
            type="accent"
            className="block text-sm leading-5 font-medium italic"
          />
          <Link to={`/${ROUTES.QUICK_LINKS.BECOME_SELLER}`} className="block w-fit">
            <Button
              content="Become a seller"
              pattern="outline"
              className="rounded-full! py-1.5! text-sm! leading-3"
            />
          </Link>
        </CategorySection>
        <CategorySection className="space-y-1 md:space-y-2 md:pb-2">
          <CategoryLabel name="Peoples Love BQ" />
          <TestimonialCarousel />
        </CategorySection>
      </div>
    </L2Category>
  );
};

export default About;
