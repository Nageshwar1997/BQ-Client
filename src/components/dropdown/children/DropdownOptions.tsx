import { CheckedIcon } from "../../../icons";
import { TDropdownOptions } from "../../../types";

const DropdownOptions = ({
  options,
  selected,
  onChange,
  className = "",
  onSelect,
}: TDropdownOptions) => {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {options.map((opt, index) => {
        const isSelected =
          selected === opt.value ||
          ((!selected || selected === "") && opt.value === "all");
        return (
          <button
            key={index}
            className={`flex items-center justify-between gap-3 px-2 py-1 text-sm text-tertiary ${
              isSelected ? "text-secondary font-medium" : "font-normal"
            }`}
            onClick={() => {
              onChange(opt);
              onSelect?.();
            }}
            disabled={opt.disabled}
          >
            {opt.name}
            {isSelected && <CheckedIcon className="stroke-primary w-5 h-5" />}
          </button>
        );
      })}
    </div>
  );
};

export default DropdownOptions;
