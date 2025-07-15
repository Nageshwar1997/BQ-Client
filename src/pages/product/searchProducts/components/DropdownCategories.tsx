import { useMemo } from "react";
import useQueryParams from "../../../../hooks/useQueryParams";
import { DEFAULT_FILTER } from "../../../../constants";
import {
  DoubleLayerIcon,
  SingleLayerIcon,
  TripleLayerIcon,
} from "../../../../icons";
import { TDropdownOption } from "../../../../types";
import { CATEGORIES_DATA } from "../../../../constants/categories";
import Dropdown from "../../../../components/dropdown/Dropdown";
import DropdownOptions from "./DropdownOptions";

const DropdownCategories = ({ className = "" }: { className?: string }) => {
  const { queryParams, removeParam, setParams } = useQueryParams();

  const selectedCategories = useMemo(
    () => ({
      category_1: queryParams.category_1,
      category_2: queryParams.category_2,
      category_3: queryParams.category_3,
    }),
    [queryParams]
  );

  const { level1Options, level2Options, level3Options } = useMemo(() => {
    const level1Options = CATEGORIES_DATA || [];
    const level1Data = level1Options.find(
      (cat) => cat.category === selectedCategories.category_1
    );

    const level2Options = level1Data?.subCategories || [];

    const level2Data = level1Data?.subCategories.find(
      (cat) => cat.category === selectedCategories.category_2
    );

    const level3Options = level2Data?.subCategories || [];

    return { level1Options, level2Options, level3Options };
  }, [selectedCategories]);

  const handleFilterChange = useMemo(
    () => ({
      category_1: (val: string) => {
        if (val === queryParams.category_1 || val === DEFAULT_FILTER.value) {
          removeParam("category_1");
        } else {
          setParams({ category_1: val });
        }
        removeParam("category_2");
        removeParam("category_3");
      },
      category_2: (val: string) => {
        if (val === queryParams.category_2 || val === DEFAULT_FILTER.value) {
          removeParam("category_2");
        } else {
          setParams({ category_2: val });
        }
        removeParam("category_3");
      },
      category_3: (val: string) => {
        if (val === queryParams.category_3 || val === DEFAULT_FILTER.value) {
          removeParam("category_3");
        } else {
          setParams({ category_3: val });
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [queryParams.category_1, queryParams.category_2, queryParams.category_3]
  );

  const CATEGORY_OPTIONS = useMemo(
    () => [
      {
        onChange: (category: TDropdownOption) =>
          handleFilterChange.category_1(category.value),
        heading: {
          title: "Category One",
          icon: SingleLayerIcon,
        },
        selected: selectedCategories.category_1,
        options: level1Options.map((opt) => ({
          name: opt.name,
          value: opt.category,
        })),
      },
      {
        onChange: (category: TDropdownOption) =>
          handleFilterChange.category_2(category.value),
        heading: {
          title: "Category Two",
          icon: DoubleLayerIcon,
        },
        selected: selectedCategories.category_2,
        options: level2Options.map((opt) => ({
          name: opt.name,
          value: opt.category,
        })),
      },
      {
        onChange: (category: TDropdownOption) =>
          handleFilterChange.category_3(category.value),
        heading: {
          title: "Category Three",
          icon: TripleLayerIcon,
        },
        selected: selectedCategories.category_3,
        options: level3Options.map((opt) => ({
          name: opt.name,
          value: opt.category,
        })),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleFilterChange]
  );
  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {CATEGORY_OPTIONS.map((cat, index) => {
        const HeadingIcon = cat.heading.icon;
        return (
          <Dropdown
            key={index}
            heading={{
              title: cat.heading.title,
              icon: (
                <>
                  (
                  <HeadingIcon className="w-4 h-4 -m-[1.5px] stroke-primary" />)
                </>
              ),
            }}
          >
            <DropdownOptions
              onChange={(data) => cat.onChange(data)}
              selected={cat.selected}
              options={[DEFAULT_FILTER, ...cat.options]}
            />
          </Dropdown>
        );
      })}
    </div>
  );
};

export default DropdownCategories;
