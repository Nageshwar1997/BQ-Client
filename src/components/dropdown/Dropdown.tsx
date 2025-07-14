import { JSX, useState } from "react";
import { CheckedIcon, DropdownIcon } from "../../icons";
import { DEFAULT_FILTER } from "../../constants";

const Dropdown = ({
  onChange,
  selected,
  heading,
  options,
}: {
  onChange: ({ name, value }: { name: string; value: string }) => void;
  selected: string;
  heading: { title: string; icon?: JSX.Element };
  options: { name: string; value: string }[];
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div
      className={`py-4 border-b border-b-primary-50 flex flex-col transition-all duration-500 ${
        open ? "gap-4" : "gap-0"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 justify-between"
      >
        <div className="flex items-center gap-1">
          <span className="uppercase text-sm sm:text-base text-primary font-medium whitespace-nowrap">
            {heading.title}
          </span>
          {heading?.icon && heading.icon}
        </div>
        <DropdownIcon
          className={`w-6 h-6 transition-transform duration-500 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`flex flex-col gap-0.5 overflow-hidden transition-all duration-500 ease-in-out ${
          open
            ? "max-h-60 opacity-100 scale-y-100"
            : "max-h-0 opacity-0 scale-y-0"
        }`}
      >
        {options?.map((cat, index) => (
          <button
            key={index}
            onClick={() => onChange(cat)}
            className={`p-1 flex items-center w-full justify-between text-md rounded-lg font-light ${
              selected || DEFAULT_FILTER.value === cat.value
                ? "bg-off-black"
                : ""
            }`}
          >
            <p
              className={`w-full text-start ${
                selected === cat.value ||
                (DEFAULT_FILTER.value === cat.value && !selected)
                  ? "text-not-black font-medium"
                  : "text-not-black opacity-50"
              }`}
            >
              {cat.name}
            </p>
            {(selected === cat.value ||
              (DEFAULT_FILTER.value === cat.value && !selected)) && (
              <CheckedIcon className="fill-not-black w-5 h-5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
