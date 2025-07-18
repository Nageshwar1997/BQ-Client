import { useEffect, useRef, useState } from "react";
import { DropdownIcon } from "../../icons";
import { TDropdown } from "../../types";

const Dropdown = ({
  title,
  icons,
  children,
  className = "",
  options = [],
}: TDropdown) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen, options]);
  return (
    <div className={`px-4 ${className}`}>
      <div className="border-b border-b-primary-50">
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
            <span className="text-sm sm:text-[15px] text-primary font-medium whitespace-nowrap">
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
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "mb-2" : ""
          }`}
        >
          <div ref={contentRef} className="w-full h-fit">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
