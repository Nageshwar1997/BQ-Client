import { useState } from "react";
import Checkbox from "../../../components/input/Checkbox";
import useQueryParams from "../../../hooks/useQueryParams";
import { DropdownIcon } from "../../../icons";

// Filters.tsx
interface FiltersProps {
  showFilter?: boolean;
  className?: string;
}

function Filters({ showFilter, className = "" }: FiltersProps) {
  const { queryParams, setParams, removeParam } = useQueryParams();
  const [showInStock, setShowInStock] = useState<boolean>(false);
  const [showPriceRange, setShowPriceRange] = useState<boolean>(false);

  return (
    <section className={`h-full flex gap-6 bg-[red] select-none ${className}`}>
      <div
        className={`flex flex-col gap-4 p-4 transform transition-all duration-500 ease-in-out
          ${showFilter ? "w-[300px]" : "md:w-0"} overflow-hidden`}
      >
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
              className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ease-in-out ${
                showPriceRange
                  ? "max-h-40 opacity-100 scale-y-100"
                  : "max-h-0 opacity-0 scale-y-0"
              }`}
            >
              <button className="flex items-center">
                <Checkbox className="[&>div]:w-10 [&>div]:h-5 [&>div]:bg-primary-inverted [&>div]:after:h-3 [&>div]:after:w-3" />
              </button>
              <span>In stock only</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Filters;
