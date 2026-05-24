import type { ICategory } from '@/types/api.type';
import About from './About';
import ForYou from './ForYou';
import { L2Category } from './grand-children';

const HoveredCategory = ({ category }: { category: ICategory }) => {
  return category._id === 'about' ? (
    <About categories={category.subcategories} />
  ) : category._id === 'for_you' ? (
    <ForYou categories={category.subcategories} />
  ) : (
    <L2Category categories={category.subcategories} />
  );
};

export default HoveredCategory;
