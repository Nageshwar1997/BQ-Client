import { Fragment, useEffect, useRef, useState } from "react";
import useQueryParams from "../../hooks/useQueryParams";
import Dropdown from "../dropdown/Dropdown";
import { CheckedIcon, PercentIcon, RupeesIcon } from "../../icons";
import Checkbox from "../input/Checkbox";
import Input from "../input/Input";
import Range from "../input/Range";
import CategoriesFilter from "./children/CategoriesFilter";

interface FiltersProps {
  className?: string;
  needCategoriesFilters?: boolean;
}
type TPriceRangeKeys = "min" | "max";
type TRange = Record<TPriceRangeKeys | "discount", string>;

const MAX_PRICE = 1500;
const INITIAL_RANGES: TRange = { min: "0", max: `${MAX_PRICE}`, discount: "0" };

function Filters({
  className = "",
  needCategoriesFilters = false,
}: FiltersProps) {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const [ranges, setRanges] = useState<TRange>(INITIAL_RANGES);

  useEffect(() => {
    setRanges((prev) => ({
      min: queryParams.min ?? prev.min,
      max: queryParams.max ?? prev.max,
      discount: queryParams.discount ?? prev.discount,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return (
    <section className={`h-full bg-primary-inverted select-none ${className}`}>
      <div className={`w-full flex flex-col gap-4 px-2 py-4`}>
        {/* Categories Filter */}
        {needCategoriesFilters && <CategoriesFilter />}
        {/* Availability Filter */}
        <Dropdown
          title="Availability"
          icons={{
            right: (
              <div className="flex items-center">
                (<CheckedIcon className="w-4 h-4 stroke-primary" />)
              </div>
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
          title="Price Range"
          icons={{
            right: (
              <div className="flex items-center">
                (<RupeesIcon className="w-4 h-4 stroke-primary" />)
              </div>
            ),
          }}
        >
          <>
            <div className="h-9 flex justify-between gap-2">
              {(["min", "max"] as TPriceRangeKeys[]).map((key, index) => {
                const isMin = key === "min";
                const minRange = Number(ranges.min);
                const maxRange = Number(ranges.max);
                return (
                  <Fragment key={index}>
                    <Input
                      name={key}
                      type="number"
                      min={isMin ? 0 : minRange + 1}
                      max={isMin ? maxRange - 1 : MAX_PRICE}
                      value={ranges[key]}
                      containerClassName="h-full [&>div]:h-full"
                      className="[&_p]:w-10 [&_p]:text-xs !rounded border border-primary-30 [&_p]:border-r [&_p]:border-r-primary-30 [&_p]:bg-primary-10 [&_p]:text-primary"
                      leftText={key}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") return;
                        const numVal = Number(value);
                        if (
                          (isMin && numVal < maxRange) ||
                          (!isMin && numVal > minRange)
                        ) {
                          setRanges((prev) => ({ ...prev, [key]: value }));
                        }
                      }}
                    />
                    {key === "min" && (
                      <div className="w-px h-full bg-primary-50" />
                    )}
                  </Fragment>
                );
              })}
            </div>
            {/* Dual Range Slider */}
            <Range
              mode="dual"
              className="mt-2"
              min={0}
              max={MAX_PRICE}
              step={10}
              value={{
                dual: {
                  min: Number(ranges.min) || 0,
                  max: Number(ranges.max) || MAX_PRICE,
                },
              }}
              onChange={{
                dual: ({ min, max }) => {
                  const minValue = Math.min(min, Number(ranges.max) - 1);
                  const maxValue = Math.max(max, Number(ranges.min) + 1);
                  setRanges({
                    ...ranges,
                    min: `${minValue}`,
                    max: `${maxValue}`,
                  });
                },
              }}
            />
          </>
        </Dropdown>
        {/* Discount Filter */}
        <Dropdown
          title="Discount Range"
          icons={{
            right: (
              <div className="flex items-center">
                (<PercentIcon className="w-4 h-4 stroke-primary" />)
              </div>
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
              leftText="0 - 100"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || Number(value) <= 100) {
                  setRanges((prev) => ({ ...prev, discount: value }));
                } else if (Number(value) > 100) {
                  setRanges((prev) => ({ ...prev, discount: "100" }));
                }
              }}
            />
            {/* Single Range Slider for minDiscount only */}
            <Range
              mode="single"
              className="mt-2"
              min={0}
              max={100}
              step={5}
              value={{ single: Number(ranges.discount || 0) }}
              onChange={{
                single: (v) => {
                  const value = Math.min(Number(v), 100);
                  setRanges({ ...ranges, discount: `${value}` });
                },
              }}
            />
          </>
        </Dropdown>
      </div>
    </section>
  );
}

export default Filters;
