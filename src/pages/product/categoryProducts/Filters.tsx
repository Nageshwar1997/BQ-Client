import { useEffect, useRef, useState } from "react";
import Checkbox from "../../../components/input/Checkbox";
import useQueryParams from "../../../hooks/useQueryParams";
import {
  CheckedIcon,
  DropdownIcon,
  PercentIcon,
  RupeesIcon,
} from "../../../icons";

interface FiltersProps {
  className?: string;
}
type TFilter = Record<"inStock" | "priceRange" | "discountRange", boolean>;
type TRange = Record<"min" | "max" | "discount", string>;

const MAX_PRICE = 1500;
const MAX_DISCOUNT = 100;
const INITIAL_FILTERS: TFilter = {
  inStock: false,
  priceRange: false,
  discountRange: false,
};
const INITIAL_RANGES: TRange = { min: "0", max: `${MAX_PRICE}`, discount: "0" };

const calcPercent = (value: number, min: number, max: number) =>
  ((value - min) / (max - min)) * 100;

function Filters({ className = "" }: FiltersProps) {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const [openedFilters, setOpenedFilters] = useState<TFilter>(INITIAL_FILTERS);
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

  return (
    <section
      className={`h-full gap-6 bg-primary-inverted select-none ${className}`}
    >
      <div className={`w-full flex flex-col gap-4 py-4 px-6`}>
        {/* Availability Filter */}
        <div
          className={`py-4 border-b border-b-primary-50 flex flex-col transition-all duration-500 ${
            openedFilters.inStock ? "gap-4" : "gap-0"
          }`}
        >
          <button
            onClick={() => {
              setOpenedFilters((prev) => ({ ...prev, inStock: !prev.inStock }));
            }}
            className="flex items-center gap-2 justify-between"
          >
            <div className="flex items-center gap-1">
              <span className="uppercase text-sm sm:text-base text-primary font-medium whitespace-nowrap">
                AVAILABILITY
              </span>
              (
              <CheckedIcon className="w-4 h-4 [&>path]:stroke-[2.15] -m-[4px]" />
              )
            </div>
            <DropdownIcon
              className={`w-6 h-6 transition-transform duration-500 ${
                openedFilters.inStock ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          <div
            className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
              openedFilters.inStock
                ? "max-h-20 opacity-100 scale-y-100"
                : "max-h-0 opacity-0 scale-y-0"
            }`}
          >
            <button
              onClick={() => {
                if (queryParams.inStock === "true") {
                  removeParam("inStock");
                } else {
                  setParams({ inStock: "true" });
                }
              }}
              className="flex items-center"
            >
              <Checkbox className="!w-10 !h-5 !bg-primary peer-checked:bg-primary after:!bg-primary-inverted after:!h-3 after:!w-3 peer-checked:after:bg-accent-duo after:border-tertiary-inverted" />
            </button>
            <span className="whitespace-nowrap">In stock only</span>
          </div>
        </div>
        {/* Price Filter */}
        <div
          className={`py-4 border-b border-b-primary-50 flex flex-col transition-all duration-500 ${
            openedFilters.priceRange ? "gap-4" : "gap-0"
          }`}
        >
          <button
            onClick={() =>
              setOpenedFilters((prev) => ({
                ...prev,
                priceRange: !prev.priceRange,
              }))
            }
            className="flex items-center gap-2 justify-between"
          >
            <div className="flex items-center gap-1">
              <span className="uppercase text-sm sm:text-base text-primary font-medium">
                PRICE
              </span>
              (
              <RupeesIcon className="w-4 h-4 [&>path]:stroke-[2.15] -m-[4px]" />
              )
            </div>
            <DropdownIcon
              className={`w-6 h-6 transition-transform duration-500 ${
                openedFilters.priceRange ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          <div
            className={`flex flex-col gap-1 overflow-hidden transition-all duration-500 ease-in-out ${
              openedFilters.priceRange
                ? "max-h-60 opacity-100 scale-y-100"
                : "max-h-0 opacity-0 scale-y-0"
            }`}
          >
            <div className="flex justify-between gap-2">
              {/* Min Input */}
              <div className="w-full flex items-center border border-primary-50 rounded overflow-hidden">
                <label
                  htmlFor="min-price"
                  className="text-xs text-primary px-2 py-2 border-r border-r-primary-50 bg-primary-30 h-full text-center flex items-center justify-center"
                >
                  Min
                </label>
                <input
                  id="min-price"
                  type="number"
                  min={0}
                  max={Number(ranges.max) - 1}
                  value={ranges.min}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) < Number(ranges.max)) {
                      setRanges((prev) => ({ ...prev, min: value }));
                    }
                  }}
                  className="w-full px-2 py-1 text-sm text-primary bg-primary-10 h-full border border-none outline-none number-input-mouse-control-none"
                />
              </div>
              <div className="w-px h-9 bg-primary-50" />
              {/* Max Input */}
              <div className="w-full flex items-center border border-primary-50 rounded overflow-hidden">
                <label
                  htmlFor="max-price"
                  className="text-xs text-primary px-2 py-2 border-r border-r-primary-50 bg-primary-30 h-full text-center flex items-center justify-center"
                >
                  Max:
                </label>
                <input
                  id="max-price"
                  type="number"
                  min={Number(ranges.min) + 1}
                  max={MAX_PRICE}
                  value={ranges.max}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) > Number(ranges.min)) {
                      setRanges((prev) => ({ ...prev, max: value }));
                    }
                  }}
                  className="w-full px-2 py-1 text-sm text-primary bg-primary-10 h-full border border-none outline-none number-input-mouse-control-none"
                />
              </div>
            </div>
            {/* Range Slider */}
            <div className="relative w-full select-none">
              <div className="relative h-10">
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
            </div>
          </div>
        </div>
        {/* Discount Filter */}
        <div
          className={`py-4 border-b border-b-primary-50 flex flex-col transition-all duration-500 ${
            openedFilters.discountRange ? "gap-4" : "gap-0"
          }`}
        >
          <button
            onClick={() =>
              setOpenedFilters((prev) => ({
                ...prev,
                discountRange: !prev.discountRange,
              }))
            }
            className="flex items-center gap-2 justify-between"
          >
            <div className="flex items-center gap-1">
              <span className="uppercase text-sm sm:text-base text-primary font-medium">
                DISCOUNT
              </span>
              (
              <PercentIcon className="w-4 h-4 [&>path]:stroke-[2.15] -m-[3.5px]" />
              )
            </div>
            <DropdownIcon
              className={`w-6 h-6 transition-transform duration-500 ${
                openedFilters.discountRange ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          <div
            className={`flex flex-col gap-1 overflow-hidden transition-all duration-500 ease-in-out ${
              openedFilters.discountRange
                ? "max-h-60 opacity-100 scale-y-100"
                : "max-h-0 opacity-0 scale-y-0"
            }`}
          >
            {/* Discount Input */}
            <div className="flex justify-between gap-2">
              <div className="w-full flex items-center border border-primary-50 rounded overflow-hidden">
                <label
                  htmlFor="min-discount"
                  className="text-xs text-primary px-2 py-2 border-r border-r-primary-50 bg-primary-30 h-full text-center flex items-center justify-center"
                >
                  0 - 100
                </label>
                <input
                  id="min-discount"
                  type="number"
                  min={0}
                  max={100}
                  value={ranges.discount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || Number(value) <= 100) {
                      setRanges((prev) => ({ ...prev, discount: value }));
                    } else if (Number(value) > 100) {
                      setRanges((prev) => ({ ...prev, discount: "100" }));
                    }
                  }}
                  className="flex-1 px-2 py-1 text-sm text-primary bg-primary-10 h-full border-none outline-none number-input-mouse-control-none"
                />
              </div>
            </div>

            {/* Range Slider for minDiscount only */}
            <div className="relative w-full h-10 select-none">
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filters;
