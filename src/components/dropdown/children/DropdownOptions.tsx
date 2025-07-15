import { CheckedIcon } from "../../../icons";
import { TDropdownOptions } from "../../../types";

const DropdownOptions = ({
  options,
  selected,
  onChange,
  className = "",
}: TDropdownOptions) => {
  return (
    <div className={`${className}`}>
      {options.map((opt) => {
        const isSelected =
          selected === opt.value ||
          ((!selected || selected === "") && opt.value === "all");
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt)}
            className={`p-1 flex items-center w-full justify-between rounded-md`}
          >
            <p
              className={`w-full text-start text-primary ${
                isSelected ? "font-medium" : "text-primary-50"
              }`}
            >
              {opt.name}
            </p>
            {isSelected && <CheckedIcon className="stroke-primary w-5 h-5" />}
          </button>
        );
      })}
    </div>
  );
};

export default DropdownOptions;
