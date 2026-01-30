import { collections } from '../../../../constants';
import { MessageIcon } from '../../../../icons';
import type { ICategoryL2 } from '../../../../types';
import { getTodaysFeedback } from '../../../../utils';
import { GradientText } from '../../../ui';
import { CategoryLabel } from './grand-children';
import SubCategories from './grand-children/SubCategories';

const FEEDBACK = getTodaysFeedback(1);

const Collections = () => {
  const categories: ICategoryL2[] = collections.subCategories;
  return (
    <div className="h-full w-full space-y-4 p-4 lg:p-0">
      <div className="base:grid-cols-2 base:gap-3 grid grid-cols-1 content-center gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
        {categories.map((category, index) => (
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
      <div className="border-primary/50 flex w-full flex-col gap-2 border-b pt-0 pb-4 lg:flex-row lg:items-center lg:border-t lg:border-b-transparent lg:pt-4 lg:pb-0">
        <div className="flex w-fit items-center gap-2">
          <MessageIcon className="fill-secondary size-4 2xl:size-5" />
          <p className="text-secondary text-sm font-medium text-nowrap lg:text-[11px] xl:text-sm">
            User's Feedback:
          </p>
        </div>
        {FEEDBACK.map((item) => (
          <GradientText
            key={item.text}
            text={item.text}
            type={item.accent ? 'accent' : 'silver'}
            className="text-[11px] xl:text-sm"
          />
        ))}
      </div>
    </div>
  );
};

export default Collections;
