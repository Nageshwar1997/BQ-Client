import { collections } from '../../../../constants';
import { CategoryLabel } from './grand-children';
import Feedback from './grand-children/Feedback';
import SubCategories from './grand-children/SubCategories';

const Collections = () => {
  return (
    <div className="h-full w-full space-y-4 p-4 lg:p-0">
      <div className="base:grid-cols-2 base:gap-3 grid grid-cols-1 content-center gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
        {collections.subCategories.map((category, index) => (
          <div
            key={index}
            className={`border-battleship-davys-gray max-w-75 min-w-50 space-y-4 border-b pb-4 lg:border-none lg:pb-0 ${
              category.category === 'gifting'
                ? 'md:col-span-3 md:max-w-full lg:col-span-1 lg:max-w-75'
                : ''
            }`}
          >
            <CategoryLabel {...category} />
            <SubCategories
              {...category}
              l1Cat="collections"
              className={
                category.category === 'gifting'
                  ? 'md:grid md:grid-cols-3 md:gap-4 lg:flex lg:flex-col lg:gap-2'
                  : ''
              }
            />
          </div>
        ))}
      </div>
      <Feedback forwardIndex={1} />
    </div>
  );
};

export default Collections;
