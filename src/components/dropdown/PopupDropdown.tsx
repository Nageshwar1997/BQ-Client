import { useEffect, useRef, useState } from "react";
import { DropdownIcon } from "../../icons";
import { TDropdown } from "../../types";
import DropdownOptions from "./children/DropdownOptions";
import useOutsideClick from "../../hooks/useOutsideClick";
import { REVIEWS_OPTIONS } from "../../constants";

const PopupDropdown = ({
  title,
  icons,
  children,
  className = "",
  options = [],
  closeOnOutsideClick = false,
}: TDropdown) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{
    name: string;
    value: string;
  }>(REVIEWS_OPTIONS[0]);
  const [height, setHeight] = useState<number>(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const ref = useOutsideClick<HTMLDivElement>(
    () => (isOpen ? setIsOpen(false) : null),
    { enabled: closeOnOutsideClick }
  );

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, options]);
  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between gap-2 w-full px-1 pt-3 pb-5 text-left transition-colors duration-300 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          {icons?.left && (
            <span className="transition-colors flex items-center justify-center">
              {icons.left}
            </span>
          )}
          <span className="text-sm sm:text-[15px] text-primary font-medium whitespace-nowrap transition-colors flex items-center justify-center">
            {title}
          </span>
          {icons?.right && (
            <span className="transition-colors flex items-center justify-center">
              {icons.right}
            </span>
          )}
        </div>
        <DropdownIcon
          className={`w-5 h-5 transition-transform duration-300 ease-in-out stroke-primary ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <div
        style={{ height: `${height}px` }}
        className={`overflow-hidden transition-all duration-300 ease-in-out absolute top-full left-0 right-0 bg-primary-inverted z-50 ${
          isOpen ? "mt-2" : ""
        }`}
      >
        <div ref={contentRef} className="w-full h-full">
          <DropdownOptions
            onChange={(data) => {
              setSelectedOption(data);
              setIsOpen(false);
            }}
            selected={selectedOption.value}
            options={REVIEWS_OPTIONS}
            className="[&>button]:whitespace-nowrap"
          />
        </div>
      </div>
    </div>
  );
};

export default PopupDropdown;
