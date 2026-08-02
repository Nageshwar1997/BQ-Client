import type { TCategoryHierarchy } from '@/types/api.type';

import About from './About';
import ForYou from './ForYou';
import { L2Category } from './grand-children';

const HoveredCategory = ({ category }: { category: TCategoryHierarchy }) => {
  return category._id === 'about' ? (
    <About categories={category.subcategories} l1Slug={category.slug} />
  ) : category._id === 'for_you' ? (
    <ForYou categories={category.subcategories} l1Slug={category.slug} />
  ) : (
    <L2Category categories={category.subcategories} l1Slug={category.slug} />
  );
};

export default HoveredCategory;
