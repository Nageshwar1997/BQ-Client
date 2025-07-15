import { useEffect, useMemo, useRef, useState } from "react";
import Checkbox from "../../../components/input/Checkbox";
import useQueryParams from "../../../hooks/useQueryParams";
import {
  CheckedIcon,
  DoubleLayerIcon,
  PercentIcon,
  RupeesIcon,
  SingleLayerIcon,
  TripleLayerIcon,
} from "../../../icons";
import { CATEGORIES_DATA } from "../../../constants/categories";
import { DEFAULT_FILTER } from "../../../constants";
import Dropdown from "../../../components/dropdown/Dropdown";
import { TDropdownOption } from "../../../types";
import DropdownOptions from "./components/DropdownOptions";
import Input from "../../../components/input/Input";

interface FiltersProps {
  className?: string;
}
type TRange = Record<"min" | "max" | "discount", string>;

const MAX_PRICE = 1500;
const MAX_DISCOUNT = 100;
const INITIAL_RANGES: TRange = { min: "0", max: `${MAX_PRICE}`, discount: "0" };

const calcPercent = (value: number, min: number, max: number) =>
  ((value - min) / (max - min)) * 100;

function SearchFilters({ className = "" }: FiltersProps) {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const [ranges, setRanges] = useState<TRange>(INITIAL_RANGES);

  const priceTrackRef = useRef<HTMLDivElement>(null);
  const discountTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRanges((prev) => ({
      ...prev,
      min: queryParams.min ?? prev.min,
      max: queryParams.max ?? prev.max,
      discount: queryParams.discount ?? prev.discount,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PRICE track
  useEffect(() => {
    if (priceTrackRef.current) {
      const parsedMin = Number(ranges.min);
      const parsedMax = Number(ranges.max);
      if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
        const minPercent = calcPercent(parsedMin, 0, MAX_PRICE);
        const maxPercent = calcPercent(parsedMax, 0, MAX_PRICE);
        priceTrackRef.current.style.backgroundImage = `linear-gradient(
          to right,
          transparent ${minPercent}%,
          var(--primary) ${minPercent}%,
          var(--primary) ${maxPercent}%,
          transparent ${maxPercent}%
        )`;
      }
    }
  }, [ranges.min, ranges.max]);

  // DISCOUNT track (min only)
  useEffect(() => {
    if (discountTrackRef.current) {
      const parsedMin = Number(ranges.discount);
      if (!isNaN(parsedMin)) {
        const minPercent = calcPercent(parsedMin, 0, MAX_DISCOUNT);
        discountTrackRef.current.style.backgroundImage = `linear-gradient(
          to right,
          var(--primary) ${minPercent}%,
          transparent ${minPercent}%,
          transparent 100%
        )`;
      }
    }
  }, [ranges.discount]);

  // Debounce price filter
  const debouncePriceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMinPrice = useRef(ranges.min);
  const prevMaxPrice = useRef(ranges.max);
  const maxPriceRangeChangeRef = useRef(false);

  useEffect(() => {
    if (debouncePriceRef.current) clearTimeout(debouncePriceRef.current);

    const parsedMin = Number(ranges.min);
    const parsedMax = Number(ranges.max);

    if (!isNaN(parsedMax) && parsedMax !== MAX_PRICE) {
      maxPriceRangeChangeRef.current = true;
    }

    debouncePriceRef.current = setTimeout(() => {
      const hasMinChanged = prevMinPrice.current !== ranges.min;
      const hasMaxChanged = prevMaxPrice.current !== ranges.max;

      if (hasMinChanged) prevMinPrice.current = ranges.min;
      if (hasMaxChanged) prevMaxPrice.current = ranges.max;

      // Min Logic
      if (ranges.min === "" || isNaN(parsedMin) || parsedMin === 0) {
        removeParam("min");
      } else {
        setParams({ min: String(parsedMin) });
      }

      // Max Logic
      if (
        ranges.max === "" ||
        isNaN(parsedMax) ||
        (parsedMax === MAX_PRICE && !maxPriceRangeChangeRef.current)
      ) {
        removeParam("max");
      } else if (maxPriceRangeChangeRef.current) {
        setParams({ max: String(parsedMax) });
      }
    }, 600);

    return () => {
      if (debouncePriceRef.current) clearTimeout(debouncePriceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranges.min, ranges.max]);

  // Debounce minDiscount
  const debounceDiscountRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const prevMinDiscount = useRef(ranges.discount);

  useEffect(() => {
    if (debounceDiscountRef.current) clearTimeout(debounceDiscountRef.current);

    const parsedMin = Number(ranges.discount);

    debounceDiscountRef.current = setTimeout(() => {
      const hasMinChanged = prevMinDiscount.current !== ranges.discount;
      if (hasMinChanged) prevMinDiscount.current = ranges.discount;

      if (ranges.discount === "" || isNaN(parsedMin) || parsedMin === 0) {
        removeParam("discount");
      } else {
        setParams({ discount: String(parsedMin) });
      }
    }, 600);

    return () => {
      if (debounceDiscountRef.current)
        clearTimeout(debounceDiscountRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranges.discount]);

  const selectedCategories = useMemo(
    () => ({
      category_1: queryParams.category_1,
      category_2: queryParams.category_2,
      category_3: queryParams.category_3,
    }),
    [queryParams]
  );

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
    <section
      className={`h-full gap-6 bg-primary-inverted select-none ${className}`}
    >
      <div className={`w-full flex flex-col gap-1 py-2 px-6`}>
        {/* Availability Filter */}
        <Dropdown
          heading={{
            title: "Availability",
            icon: (
              <>
                (<CheckedIcon className="w-4 h-4 -m-[3px] stroke-primary" />)
              </>
            ),
          }}
        >
          <div className="w-full flex items-center gap-2">
            <Checkbox
              className="!w-10 !h-5 !bg-primary peer-checked:bg-primary after:!bg-primary-inverted after:!h-3 after:!w-3 peer-checked:after:bg-accent-duo after:border-tertiary-inverted"
              checked={queryParams.inStock === "true"}
              onChange={(e) => {
                if (e.target.checked) {
                  setParams({ inStock: "true" });
                } else {
                  removeParam("inStock");
                }
              }}
            />
            <span className="whitespace-nowrap">In stock only</span>
          </div>
        </Dropdown>
        {/* Price Filter */}
        <Dropdown
          heading={{
            title: "Price Range",
            icon: (
              <>
                (<RupeesIcon className="w-4 h-4 -m-[3px] stroke-primary" />)
              </>
            ),
          }}
        >
          <>
            <div className="flex justify-between gap-2">
              {/* Min Input */}
              <Input
                name="min-price"
                type="number"
                min={0}
                max={Number(ranges.max) - 1}
                value={ranges.min}
                containerClassName="h-9 [&>div]:h-full"
                className="[&_p]:w-10 [&_p]:text-xs !rounded border border-primary-30 [&_p]:border-r [&_p]:border-r-primary-30 [&_p]:bg-primary-10 [&_p]:text-primary"
                leftText={{ required: true, text: "Min" }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) < Number(ranges.max)) {
                    setRanges((prev) => ({ ...prev, min: value }));
                  }
                }}
              />
              <div className="w-px h-9 bg-primary-50" />
              {/* Max Input */}
              <Input
                name="max-price"
                type="number"
                min={Number(ranges.min) + 1}
                max={MAX_PRICE}
                value={ranges.max}
                containerClassName="h-9 [&>div]:h-full"
                className="[&_p]:w-10 [&_p]:text-xs !rounded border border-primary-30 [&_p]:border-r [&_p]:border-r-primary-30 [&_p]:bg-primary-10 [&_p]:text-primary"
                leftText={{ required: true, text: "Max" }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || Number(value) > Number(ranges.min)) {
                    setRanges((prev) => ({ ...prev, max: value }));
                  }
                }}
              />
            </div>
            {/* Range Slider */}
            <div className="relative w-full h-5 mt-2 select-none">
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={10}
                value={Number(ranges.min) || 0}
                onChange={(e) => {
                  const value = Math.min(
                    Number(e.target.value),
                    Number(ranges.max) - 1
                  );
                  setRanges((prev) => ({ ...prev, min: `${value}` }));
                }}
                className="range-slider-thumb absolute w-full h-full bg-transparent pointer-events-none appearance-none z-20"
              />
              <input
                type="range"
                min={0}
                max={MAX_PRICE}
                step={10}
                value={Number(ranges.max) || 0}
                onChange={(e) => {
                  const value = Math.max(
                    Number(e.target.value),
                    Number(ranges.min) + 1
                  );
                  setRanges((prev) => ({ ...prev, max: `${value}` }));
                }}
                className="range-slider-thumb absolute w-full h-full bg-transparent pointer-events-none appearance-none z-20"
              />
              <div
                ref={priceTrackRef}
                className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 bg-primary-30 rounded"
              />
            </div>
          </>
        </Dropdown>
        {/* Discount Filter */}
        <Dropdown
          heading={{
            title: "Discount Range",
            icon: (
              <>
                (<PercentIcon className="w-4 h-4 -m-[3px] stroke-primary" />)
              </>
            ),
          }}
        >
          <>
            <Input
              name="discount"
              type="number"
              min={0}
              max={100}
              value={ranges.discount}
              containerClassName="h-9 [&>div]:h-full"
              className="[&_p]:w-14 [&_p]:text-xs !rounded border border-primary-30 [&_p]:border-r [&_p]:border-r-primary-30 [&_p]:bg-primary-10 [&_p]:text-primary [&_p]:text-nowrap"
              leftText={{ required: true, text: "0 - 100" }}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || Number(value) <= 100) {
                  setRanges((prev) => ({ ...prev, discount: value }));
                } else if (Number(value) > 100) {
                  setRanges((prev) => ({ ...prev, discount: "100" }));
                }
              }}
            />
            {/* Range Slider for minDiscount only */}
            <div className="relative w-full h-5 mt-2 select-none">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Number(ranges.discount) || 0}
                onChange={(e) => {
                  const value = Math.min(Number(e.target.value), 100);
                  setRanges((prev) => ({ ...prev, discount: `${value}` }));
                }}
                className="range-slider-thumb absolute w-full h-full bg-transparent pointer-events-none appearance-none z-20"
              />
              <div
                ref={discountTrackRef}
                className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 bg-primary-30 rounded"
              />
            </div>
          </>
        </Dropdown>
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
                    <HeadingIcon className="w-4 h-4 -m-[1.5px] stroke-primary" />
                    )
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
    </section>
  );
}

export default SearchFilters;
