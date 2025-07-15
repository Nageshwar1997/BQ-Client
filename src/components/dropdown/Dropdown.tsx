import { useState } from "react";
import { DropdownIcon } from "../../icons";
import { TDropdown } from "../../types";

const Dropdown = ({
  heading,
  children,
  className = { open: "", closed: "", common: "" },
  containerClassName = { open: "", closed: "", common: "" },
}: TDropdown) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`py-4 border-b border-b-primary-50 flex flex-col transition-all duration-500 ${
        open
          ? `gap-4 ${containerClassName.open}`
          : `gap-0 ${containerClassName.closed}`
      } ${containerClassName.common}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 justify-between"
      >
        <div className="flex items-center gap-1">
          <span className="text-sm sm:text-base text-primary font-medium whitespace-nowrap">
            {heading.title}
          </span>
          {heading.icon && heading.icon}
        </div>
        <DropdownIcon
          className={`w-5 h-5 transition-transform duration-500 stroke-primary ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <div
        className={`flex flex-col gap-0.5 transition-all duration-500 ease-in-out ${
          open
            ? `max-h-80 opacity-100 scale-y-100 ${className.open}`
            : `max-h-0 opacity-0 scale-y-0 ${className.closed}`
        } ${className.common}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
