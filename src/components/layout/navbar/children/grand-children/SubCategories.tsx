import type { HIGHLIGHTED_CATEGORIES } from '../../../../../constants';
import { customHooks } from '../../../../../hooks';
import type { ICategoryL3, TClassName } from '../../../../../types';
import { isHighlightedCategory } from '../../../../../utils';

type Props = TClassName & {
  subCategories: ICategoryL3[];
  l1Cat?: keyof typeof HIGHLIGHTED_CATEGORIES;
};

const SubCategories = ({ subCategories, className = '', l1Cat }: Props) => {
  const { navigate } = customHooks.PathParams();
  return (
    <div className={`flex flex-col gap-1 md:gap-2 ${className}`}>
      {subCategories.map((subCategory, index) => {
        const isHighlighted = isHighlightedCategory(subCategory.category, l1Cat);
        const Icon = subCategory.icon;
        return (
          <div
            onClick={() => subCategory?.path && navigate(subCategory.path)}
            key={index}
            className={`hover:bg-smoke-eerie flex cursor-pointer justify-start gap-2 rounded-xl border border-transparent p-2 ${
              isHighlighted ? 'hover:border-blue-crayola-c' : 'hover:border-primary/8'
            } group`}
          >
            <div
              className={`bg-secondary-invert group-hover:bg-primary-invert flex size-10 items-center justify-center rounded-lg xl:size-12 ${
                isHighlighted
                  ? 'bg-accent-duo group-hover:shadow-primary-btn-hover [&>svg]:fill-white'
                  : 'shadow-battleship-davys-gray shadow-inner'
              }`}
            >
              <Icon className="fill-secondary" />
            </div>
            <div className="flex w-full flex-col justify-center lg:justify-start">
              <p className="text-secondary group-hover:text-primary line-clamp-1 w-full text-left text-xs tracking-wide xl:text-sm">
                {subCategory.label}
              </p>
              <p className="text-silver-jet group-hover:text-tertiary line-clamp-2 text-[8px] leading-3 wrap-break-word xl:text-[10px]">
                {subCategory.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubCategories;
