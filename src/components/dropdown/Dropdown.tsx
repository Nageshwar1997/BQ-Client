import { useState } from "react";
import { DropdownIcon } from "../../icons";
import { DropdownProps } from "../../types";

const Dropdown = ({
  heading,
  className = "",
  children,
}: Omit<DropdownProps, "options" | "selected" | "onChange">) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`py-4 border-b border-b-primary-50 flex flex-col transition-all duration-500 ${
        open ? "gap-4" : "gap-0"
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 justify-between"
      >
        <div className="flex items-center gap-1">
          <span className="uppercase text-sm sm:text-base text-primary font-medium whitespace-nowrap">
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
            ? "max-h-80 opacity-100 scale-y-100"
            : "max-h-0 opacity-0 scale-y-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Dropdown;
