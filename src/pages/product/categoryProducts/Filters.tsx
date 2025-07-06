import { useEffect, useRef, useState } from "react";
import Checkbox from "../../../components/input/Checkbox";
import useQueryParams from "../../../hooks/useQueryParams";
import { DropdownIcon } from "../../../icons";

interface FiltersProps {
  showFilter?: boolean;
  className?: string;
}

const MAX_PRICE = 1500;
const MAX_DISCOUNT = 100;

function Filters({ showFilter, className = "" }: FiltersProps) {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [showPriceRange, setShowPriceRange] = useState<boolean>(false);
  const [showDiscountRange, setShowDiscountRange] = useState<boolean>(false);

  const [minPrice, setMinPrice] = useState("0");
  const [maxPrice, setMaxPrice] = useState(String(MAX_PRICE));
  const [minDiscount, setMinDiscount] = useState("0");
  const [maxDiscount, setMaxDiscount] = useState(String(MAX_DISCOUNT));
  const trackRef = useRef<HTMLDivElement>(null);
  const trackRef2 = useRef<HTMLDivElement>(null);

  const calcPercent = (value: number, min: number, max: number) =>
    ((value - min) / (max - min)) * 100;

  useEffect(() => {
    const updateTrackBackground = () => {
      if (trackRef.current) {
        const parsedMin = Number(minPrice);
        const parsedMax = Number(maxPrice);
        if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
          const minPercent = calcPercent(parsedMin, 0, MAX_PRICE);
          const maxPercent = calcPercent(parsedMax, 0, MAX_PRICE);
          trackRef.current.style.backgroundImage = `linear-gradient(
            to right,
            transparent ${minPercent}%,
            var(--primary) ${minPercent}%,
            var(--primary) ${maxPercent}%,
            transparent ${maxPercent}%
          )`;
        }
      }
    };
    updateTrackBackground();
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const updateTrackBackground = () => {
      if (trackRef2.current) {
        const parsedMin = Number(minDiscount);
        const parsedMax = Number(maxDiscount);
        if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
          const minPercent = calcPercent(parsedMin, 0, MAX_DISCOUNT);
          const maxPercent = calcPercent(parsedMax, 0, MAX_DISCOUNT);
          trackRef2.current.style.backgroundImage = `linear-gradient(
            to right,
            transparent ${minPercent}%,
            var(--primary) ${minPercent}%,
            var(--primary) ${maxPercent}%,
            transparent ${maxPercent}%
          )`;
        }
      }
    };
    updateTrackBackground();
  }, [minDiscount, maxDiscount]);

  const debouncePriceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMinPrice = useRef(minPrice);
  const prevMaxPrice = useRef(maxPrice);
  const maxPriceRangeChangeRef = useRef(false); // track if user interacted with max

  useEffect(() => {
    if (debouncePriceRef.current) clearTimeout(debouncePriceRef.current);

    const parsedMin = Number(minPrice);
    const parsedMax = Number(maxPrice);

    if (!isNaN(parsedMax) && parsedMax !== MAX_PRICE) {
      maxPriceRangeChangeRef.current = true;
    }

    debouncePriceRef.current = setTimeout(() => {
      const hasMinChanged = prevMinPrice.current !== minPrice;
      const hasMaxChanged = prevMaxPrice.current !== maxPrice;

      if (hasMinChanged) prevMinPrice.current = minPrice;
      if (hasMaxChanged) prevMaxPrice.current = maxPrice;

      // Min Logic
      if (minPrice === "" || isNaN(parsedMin) || parsedMin === 0) {
        removeParam("pMin");
      } else {
        setParams({ pMin: String(parsedMin) });
      }

      // Max Logic
      if (
        maxPrice === "" ||
        isNaN(parsedMax) ||
        (parsedMax === MAX_PRICE && !maxPriceRangeChangeRef.current)
      ) {
        removeParam("pMax");
      } else if (maxPriceRangeChangeRef.current) {
        setParams({ pMax: String(parsedMax) });
      }
    }, 600);

    return () => {
      if (debouncePriceRef.current) clearTimeout(debouncePriceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice]);

  const debounceDiscountRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const prevMinDiscount = useRef(minDiscount);
  const prevMaxDiscount = useRef(maxDiscount);
  const maxDiscountRangeChangeRef = useRef(false);

  useEffect(() => {
    if (debounceDiscountRef.current) clearTimeout(debounceDiscountRef.current);

    const parsedMin = Number(minDiscount);
    const parsedMax = Number(maxDiscount);

    if (!isNaN(parsedMax) && parsedMax !== 100) {
      maxDiscountRangeChangeRef.current = true;
    }

    debounceDiscountRef.current = setTimeout(() => {
      const hasMinChanged = prevMinDiscount.current !== minDiscount;
      const hasMaxChanged = prevMaxDiscount.current !== maxDiscount;

      if (hasMinChanged) prevMinDiscount.current = minDiscount;
      if (hasMaxChanged) prevMaxDiscount.current = maxDiscount;

      // Min Logic
      if (minDiscount === "" || isNaN(parsedMin) || parsedMin === 0) {
        removeParam("dMin");
      } else {
        setParams({ dMin: String(parsedMin) });
      }

      // Max Logic
      if (
        maxDiscount === "" ||
        isNaN(parsedMax) ||
        (parsedMax === 100 && !maxDiscountRangeChangeRef.current)
      ) {
        removeParam("dMax");
      } else if (maxDiscountRangeChangeRef.current) {
        setParams({ dMax: String(parsedMax) });
      }
    }, 600);

    return () => {
      if (debounceDiscountRef.current)
        clearTimeout(debounceDiscountRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDiscount, maxDiscount]);

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
                    max={Number(maxPrice) - 1}
                    value={minPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || Number(value) < Number(maxPrice)) {
                        setMinPrice(value);
                      }
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
                    min={Number(minPrice) + 1}
                    max={MAX_PRICE}
                    value={maxPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || Number(value) > Number(minPrice)) {
                        setMaxPrice(value);
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
                    value={Number(minPrice) || 0}
                    onChange={(e) =>
                      setMinPrice(
                        String(
                          Math.min(Number(e.target.value), Number(maxPrice) - 1)
                        )
                      )
                    }
                    className="range-slider-thumb absolute w-full h-full bg-transparent pointer-events-none appearance-none z-20"
                  />
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRICE}
                    step={10}
                    value={Number(maxPrice) || 0}
                    onChange={(e) =>
                      setMaxPrice(
                        String(
                          Math.max(Number(e.target.value), Number(minPrice) + 1)
                        )
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
        {/* Discount Filter */}
        <div className="flex flex-col">
          <div
            className={`py-4 border-b border-b-primary-50 flex flex-col transition-all duration-500 ${
              showDiscountRange ? "gap-4" : "gap-0"
            }`}
          >
            <button
              onClick={() => setShowDiscountRange(!showDiscountRange)}
              className="flex items-center gap-2 justify-between"
            >
              <span className="uppercase text-sm sm:text-base text-primary font-medium">
                DISCOUNT
              </span>
              <DropdownIcon
                className={`w-6 h-6 transition-transform duration-500 ${
                  showDiscountRange ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`flex flex-col gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
                showDiscountRange
                  ? "max-h-60 opacity-100 scale-y-100"
                  : "max-h-0 opacity-0 scale-y-0"
              }`}
            >
              {/* Min & Max Discount Inputs */}
              <div className="flex justify-between gap-3">
                <div className="w-full flex items-center border border-primary-50 rounded overflow-hidden">
                  <label
                    htmlFor="min-discount"
                    className="text-sm text-primary px-2 py-2 border-r border-r-primary-50 bg-primary-30 h-full"
                  >
                    Min
                  </label>
                  <input
                    id="min-discount"
                    type="number"
                    min={0}
                    max={Number(maxDiscount) - 1}
                    value={minDiscount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || Number(value) < Number(maxDiscount)) {
                        setMinDiscount(value);
                      }
                    }}
                    className="w-full px-2 py-1 text-sm text-primary bg-primary-10 h-full border-none outline-none number-input-mouse-control-none"
                  />
                </div>
                <div className="w-px h-9 bg-primary-50"></div>
                <div className="w-full flex items-center border border-primary-50 rounded overflow-hidden">
                  <label
                    htmlFor="max-discount"
                    className="text-sm text-primary px-2 py-2 border-r border-r-primary-50 bg-primary-30 h-full"
                  >
                    Max
                  </label>
                  <input
                    id="max-discount"
                    type="number"
                    min={Number(minDiscount) + 1}
                    max={100}
                    value={maxDiscount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || Number(value) > Number(minDiscount)) {
                        setMaxDiscount(value);
                      }
                    }}
                    className="w-full px-2 py-1 text-sm text-primary bg-primary-10 h-full border-none outline-none number-input-mouse-control-none"
                  />
                </div>
              </div>

              {/* Discount Range Slider */}
              <div className="relative w-full select-none">
                <div className="relative h-10">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={Number(minDiscount) || 0}
                    onChange={(e) =>
                      setMinDiscount(
                        String(
                          Math.min(
                            Number(e.target.value),
                            Number(maxDiscount) - 1
                          )
                        )
                      )
                    }
                    className="range-slider-thumb absolute w-full h-full bg-transparent pointer-events-none appearance-none z-20"
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={Number(maxDiscount) || 0}
                    onChange={(e) =>
                      setMaxDiscount(
                        String(
                          Math.max(
                            Number(e.target.value),
                            Number(minDiscount) + 1
                          )
                        )
                      )
                    }
                    className="range-slider-thumb absolute w-full h-full bg-transparent pointer-events-none appearance-none z-20"
                  />
                  <div
                    ref={trackRef2}
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
