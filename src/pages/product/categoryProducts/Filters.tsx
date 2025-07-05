import { useEffect, useRef, useState } from "react";
import Checkbox from "../../../components/input/Checkbox";
import useQueryParams from "../../../hooks/useQueryParams";
import { DropdownIcon } from "../../../icons";

interface FiltersProps {
  showFilter?: boolean;
  className?: string;
}

const MAX_PRICE = 1500;

function Filters({ showFilter, className = "" }: FiltersProps) {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [showPriceRange, setShowPriceRange] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const trackRef = useRef<HTMLDivElement>(null);

  const calcPercent = (value: number, min: number, max: number) =>
    ((value - min) / (max - min)) * 100;

  useEffect(() => {
    const updateTrackBackground = () => {
      if (trackRef.current) {
        const minPercent = calcPercent(minPrice, 0, MAX_PRICE);
        const maxPercent = calcPercent(maxPrice, 0, MAX_PRICE);
        trackRef.current.style.backgroundImage = `linear-gradient(
          to right,
          transparent ${minPercent}%,
          var(--primary) ${minPercent}%,
          var(--primary) ${maxPercent}%,
          transparent ${maxPercent}%
        )`;
      }
    };
    updateTrackBackground();
  }, [minPrice, maxPrice]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMin = useRef(minPrice);
  const prevMax = useRef(maxPrice);
  const maxChangeRef = useRef(false); // track if user interacted with max

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // If user ever changes max from default, mark it
    if (maxPrice !== MAX_PRICE) {
      maxChangeRef.current = true;
    }

    debounceRef.current = setTimeout(() => {
      const hasMinChanged = prevMin.current !== minPrice;
      const hasMaxChanged = prevMax.current !== maxPrice;

      // Update refs after change
      if (hasMinChanged) prevMin.current = minPrice;
      if (hasMaxChanged) prevMax.current = maxPrice;

      // Min Logic
      if (minPrice === 0) {
        removeParam("min");
      } else {
        setParams({ min: String(minPrice) });
      }

      // Max Logic
      if (maxPrice === MAX_PRICE && !maxChangeRef.current) {
        removeParam("max");
      } else if (maxChangeRef.current) {
        setParams({ max: String(maxPrice) });
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  return (
    <section
      className={`h-full flex gap-6 bg-primary-inverted select-none ${className}`}
    >
      <div
        className={`flex flex-col gap-4 p-4 transform transition-all duration-500 ease-in-out ${
          showFilter ? "w-[300px]" : "md:w-0"
        } overflow-hidden`}
      >
        {/* Availability Filter */}
        <div className="flex flex-col">
          <div
            className={`py-4 border-b border-b-primary-50 flex flex-col transition-all duration-500 ${
              showInStock ? "gap-4" : "gap-0"
            }`}
          >
            <button
              onClick={() => setShowInStock(!showInStock)}
              className="flex items-center gap-2 justify-between"
            >
              <span className="uppercase text-sm text-nowrap sm:text-base text-primary font-medium">
                AVAILABILITY
              </span>
              <DropdownIcon
                className={`w-6 h-6 transition-transform duration-500 ${
                  showInStock ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
                showInStock
                  ? "max-h-20 opacity-100 scale-y-100"
                  : "max-h-0 opacity-0 scale-y-0"
              }`}
            >
              <button
                onClick={() => {
                  if (queryParams.availability === "true") {
                    removeParam("availability");
                  } else {
                    setParams({ availability: "true" });
                  }
                }}
                className="flex items-center"
              >
                <Checkbox className="!w-10 !h-5 !bg-primary peer-checked:bg-primary after:!bg-primary-inverted after:!h-3 after:!w-3 peer-checked:after:bg-accent-duo after:border-tertiary-inverted" />
              </button>
              <span>In stock only</span>
            </div>
          </div>
        </div>

        {/* Price Filter */}
        <div className="flex flex-col">
          <div
            className={`py-4 border-b border-b-primary-50 flex flex-col transition-all duration-500 ${
              showPriceRange ? "gap-4" : "gap-0"
            }`}
          >
            <button
              onClick={() => setShowPriceRange(!showPriceRange)}
              className="flex items-center gap-2 justify-between"
            >
              <span className="uppercase text-sm text-nowrap sm:text-base text-primary font-medium">
                PRICE
              </span>
              <DropdownIcon
                className={`w-6 h-6 transition-transform duration-500 ${
                  showPriceRange ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            <div
              className={`flex flex-col gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
                showPriceRange
                  ? "max-h-60 opacity-100 scale-y-100"
                  : "max-h-0 opacity-0 scale-y-0"
              }`}
            >
              {/* Min Input */}
              <div className="flex justify-between gap-3">
                <div className="w-full flex items-center border border-primary-50 rounded overflow-hidden">
                  <label
                    htmlFor="min-price"
                    className="text-sm text-primary px-2 py-2 border-r border-r-primary-50 bg-primary-30 h-full"
                  >
                    Min
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    min={0}
                    max={maxPrice - 1}
                    value={minPrice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value < maxPrice) setMinPrice(value);
                    }}
                    className="w-full px-2 py-1 text-sm text-primary bg-primary-10 h-full border border-none outline-none number-input-mouse-control-none"
                  />
                </div>
                <div className="w-px h-9 bg-primary-50"></div>
                {/* Max Input */}
                <div className="w-full flex items-center border border-primary-50 rounded overflow-hidden">
                  <label
                    htmlFor="max-price"
                    className="text-sm text-primary px-2 py-2 border-r border-r-primary-50 bg-primary-30 h-full"
                  >
                    Max:
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    min={minPrice + 1}
                    max={MAX_PRICE}
                    value={maxPrice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value > minPrice) setMaxPrice(value);
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
                    value={minPrice}
                    onChange={(e) =>
                      setMinPrice(
                        Math.min(Number(e.target.value), maxPrice - 1)
                      )
                    }
                    className="range-slider-thumb absolute w-full h-full bg-transparent pointer-events-none appearance-none z-20"
                  />
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRICE}
                    step={10}
                    value={maxPrice}
                    onChange={(e) =>
                      setMaxPrice(
                        Math.max(Number(e.target.value), minPrice + 1)
                      )
                    }
                    className="range-slider-thumb absolute w-full h-full bg-transparent pointer-events-none appearance-none z-20"
                  />
                  <div
                    ref={trackRef}
                    className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 bg-primary-30 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filters;
