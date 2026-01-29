import { useMemo } from 'react';
import { customHooks } from '../../../hooks';
import { DEFAULT_FILTER, NAVBAR_CATEGORIES_DATA } from '../../../constants';
import type { TDropdownOption } from '../../../types';
import { Dropdown, DropdownOptions } from '../dropdown';
import { DoubleLayerIcon, SingleLayerIcon, TripleLayerIcon } from '../../../icons';

export const CategoriesFilter = ({ className = '' }: { className?: string }) => {
  const { queryParams, removeParam, setParams } = customHooks.QueryParams();

  const selectedCategories = useMemo(
    () => ({
      category_1: queryParams.category_1,
      category_2: queryParams.category_2,
      category_3: queryParams.category_3,
    }),
    [queryParams],
  );

  const { level1Options, level2Options, level3Options } = useMemo(() => {
    const level1Options = NAVBAR_CATEGORIES_DATA || [];
    const level1Data = level1Options.find((cat) => cat.category === selectedCategories.category_1);

    const level2Options = level1Data?.subCategories || [];

    const level2Data = level1Data?.subCategories.find(
      (cat) => cat.category === selectedCategories.category_2,
    );

    const level3Options = level2Data?.subCategories || [];

    return { level1Options, level2Options, level3Options };
  }, [selectedCategories]);

  const handleFilterChange = useMemo(
    () => ({
      category_1: (val: string) => {
        if (val === queryParams.category_1 || val === DEFAULT_FILTER.value) {
          removeParam('category_1');
        } else {
          setParams({ category_1: val });
        }
        removeParam('category_2');
        removeParam('category_3');
      },
      category_2: (val: string) => {
        if (val === queryParams.category_2 || val === DEFAULT_FILTER.value) {
          removeParam('category_2');
        } else {
          setParams({ category_2: val });
        }
        removeParam('category_3');
      },
      category_3: (val: string) => {
        if (val === queryParams.category_3 || val === DEFAULT_FILTER.value) {
          removeParam('category_3');
        } else {
          setParams({ category_3: val });
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryParams.category_1, queryParams.category_2, queryParams.category_3],
  );

  const CATEGORY_OPTIONS = useMemo(
    () => [
      {
        onChange: (category: TDropdownOption) => handleFilterChange.category_1(category.value),
        title: 'Category One',
        rightIcon: SingleLayerIcon,
        selected: selectedCategories.category_1,
        options: level1Options.map((opt) => ({ label: opt.label, value: opt.category })),
      },
      {
        onChange: (category: TDropdownOption) => handleFilterChange.category_2(category.value),
        title: 'Category Two',
        rightIcon: DoubleLayerIcon,
        selected: selectedCategories.category_2,
        options: level2Options.map((opt) => ({ label: opt.label, value: opt.category })),
      },
      {
        onChange: (category: TDropdownOption) => handleFilterChange.category_3(category.value),
        title: 'Category Three',
        rightIcon: TripleLayerIcon,
        selected: selectedCategories.category_3,
        options: level3Options.map((opt) => ({ label: opt.label, value: opt.category })),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleFilterChange],
  );
  return (
    <div className={`flex w-full flex-col gap-2 ${className}`}>
      {CATEGORY_OPTIONS.map((cat, index) => {
        const HeadingIcon = cat.rightIcon;
        const options = [DEFAULT_FILTER, ...cat.options];
        return (
          <Dropdown
            key={index}
            title={cat.title}
            icons={{
              right: (
                <div className="flex items-center">
                  (<HeadingIcon className="stroke-primary h-4 w-4" />)
                </div>
              ),
            }}
            className="border-b-primary/50 border-b [&>button]:px-0 [&>button]:py-3"
          >
            <DropdownOptions
              onChange={(data) => cat.onChange(data)}
              selected={cat.selected}
              options={options}
              className="-mt-2 px-1! [&>button]:whitespace-nowrap"
            />
          </Dropdown>
        );
      })}
    </div>
  );
};
