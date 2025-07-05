import { useEffect, useRef, useState } from "react";
import Checkbox from "../../../components/input/Checkbox";
import useQueryParams from "../../../hooks/useQueryParams";
import { DropdownIcon } from "../../../icons";

interface FiltersProps {
  showFilter?: boolean;
  className?: string;
}

function Filters({ showFilter, className = "" }: FiltersProps) {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [showPriceRange, setShowPriceRange] = useState<boolean>(true);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1499);
  const trackRef = useRef<HTMLDivElement>(null);

  const calcPercent = (value: number, min: number, max: number) =>
    ((value - min) / (max - min)) * 100;

  useEffect(() => {
    const updateTrackBackground = () => {
      if (trackRef.current) {
        const minPercent = calcPercent(minPrice, 0, 1499);
        const maxPercent = calcPercent(maxPrice, 0, 1499);
        trackRef.current.style.backgroundImage = `linear-gradient(
          to right,
          transparent ${minPercent}%,
          #D000FF ${minPercent}%,
          #D000FF ${maxPercent}%,
          transparent ${maxPercent}%
        )`;
      }
    };
    updateTrackBackground();
  }, [minPrice, maxPrice]);

  return (
    <section className={`h-full flex gap-6 bg-[red] select-none ${className}`}>
      <div
        className={`flex flex-col gap-4 p-4 transform transition-all duration-500 ease-in-out ${
          showFilter ? "w-[300px]" : "md:w-0"
        } overflow-hidden`}
      >
        {/* Availability Filter */}
        <div className="flex flex-col">
          <div
            className={`py-4 border-b border-b-primary flex flex-col transition-all duration-500 ${
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
                <Checkbox className="[&>div]:w-10 [&>div]:h-5 [&>div]:bg-primary-inverted [&>div]:after:h-3 [&>div]:after:w-3" />
              </button>
              <span>In stock only</span>
            </div>
          </div>
        </div>

        {/* Price Filter */}
        <div className="flex flex-col">
          <div
            className={`py-4 border-b border-b-primary flex flex-col transition-all duration-500 ${
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
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="min-price"
                  className="text-sm w-16 text-primary"
                >
                  Min:
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
                  className="w-full px-2 py-1 border rounded text-sm text-black number-input-mouse-control-none"
                />
              </div>

              {/* Max Input */}
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="max-price"
                  className="text-sm w-16 text-primary"
                >
                  Max:
                </label>
                <input
                  id="max-price"
                  type="number"
                  min={minPrice + 1}
                  max={1499}
                  value={maxPrice}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > minPrice) setMaxPrice(value);
                  }}
                  className="w-full px-2 py-1 border rounded text-sm text-black number-input-mouse-control-none"
                />
              </div>

              {/* Range Slider */}
              <div className="relative w-full select-none">
                <div className="relative h-10">
                  <input
                    type="range"
                    min={0}
                    max={1499}
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
                    max={1499}
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
                    className="absolute top-1/2 h-1 w-full -translate-y-1/2 bg-gray-300 rounded z-10"
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
