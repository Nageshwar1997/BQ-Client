import { useState, useRef, useEffect } from "react";
import { CheckedIcon, DropdownIcon, InfoIcon } from "../../icons";
import { ISelect } from "../../types";
import useOutsideClick from "../../hooks/useOutsideClick";

const Select = ({
  label = "",
  className = "",
  error = "",
  containerClassName = "",
  optionsClassName = "",
  icons,
  selectProps,
  options = [],
  optionsPosition = "bottom",
}: ISelect) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useOutsideClick<HTMLDivElement>(() => setIsOpen(false), {
    enabled: isOpen,
  });
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const selectedOptionRef = useRef<HTMLLIElement | null>(null);

  const selected = options.find((opt) => opt.value === selectProps.value);

  useEffect(() => {
    if (isOpen && selectedOptionRef.current) {
      selectedOptionRef.current.scrollIntoView({
        block: "start",
        inline: "nearest",
        behavior: "smooth",
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`w-full flex flex-col gap-1.5 ${containerClassName}`}
    >
      <div className="relative h-10 lg:h-12">
        {label && (
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 bg-smoke-eerie rounded cursor-pointer z-[2]"
          >
            {label}
          </button>
        )}
        <div
          className={`w-full h-full flex items-center gap-1 border border-primary-10 bg-smoke-eerie rounded-lg ${className}`}
        >
          {/* Left Icon */}
          {icons?.left?.icon ? (
            <span
              onClick={icons.left.onClick}
              className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden"
            >
              {icons.left.icon}
            </span>
          ) : icons?.left?.text ? (
            <div className="h-full overflow-hidden">
              <p className="h-full flex items-center justify-center text-sm text-primary-50 border-r border-r-primary-10 p-3 capitalize">
                {icons?.left?.text}
              </p>
            </div>
          ) : null}
          {/* Hidden */}
          <select ref={selectRef} {...selectProps} className="sr-only">
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
          <div
            className={`flex-1 flex items-center justify-between w-full h-full border-none bg-transparent font-normal text-sm p-3 text-primary line-clamp-1 ${
              icons?.left?.icon
                ? "pl-0"
                : !icons?.left?.icon
                ? "pr-2"
                : icons?.left?.text
                ? "pl-2"
                : ""
            } ${selectProps.disabled ? "cursor-no-drop" : "cursor-pointer"}`}
            onClick={() => !selectProps?.disabled && setIsOpen((prev) => !prev)}
          >
            <span
              className={`line-clamp-1 ${
                selected?.value ? "" : "text-primary-50"
              }`}
            >
              {selected?.name || selectProps?.placeholder}
            </span>
            <DropdownIcon
              className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 transition-transform ${
                isOpen ? "rotate-180" : ""
              } ${selected?.value ? "stroke-primary" : "stroke-primary-50"}`}
            />
            {isOpen && (
              <div
                className={`absolute left-0 w-full z-[3] rounded-lg border border-primary-10 bg-smoke-eerie shadow-md overflow-hidden py-2 ${
                  optionsPosition === "top"
                    ? "bottom-full mb-2"
                    : "top-full mt-2"
                } ${optionsClassName}`}
              >
                <ul className="max-h-60 overflow-auto px-1 space-y-0.5">
                  {options.map((option) => {
                    const active = selected?.value === option.value;
                    return (
                      <li
                        key={option.value}
                        ref={active ? selectedOptionRef : null}
                        className={`flex justify-between items-center gap-2 p-2 hover:bg-primary-10 text-tertiary cursor-grab text-sm rounded-[4px] ${
                          active ? "bg-primary-8" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!selectProps.disabled && selectRef.current) {
                            selectRef.current.value = active
                              ? ""
                              : option.value || "";
                            selectRef.current.dispatchEvent(
                              new Event("change", { bubbles: true })
                            );
                            setIsOpen(false);
                          }
                        }}
                      >
                        <span>{option.name}</span>
                        {active && (
                          <CheckedIcon className="w-4 h-4 md:w-5 md:h-5 stroke-primary" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {!selectProps?.disabled && error && (
        <p className="w-full text-start flex gap-1 items-center text-[11px] leading-tight text-red-500">
          <InfoIcon className="min-w-3 min-h-3 w-3 h-3 md:min-w-4 md:min-h-4 md:w-4 md:h-4 fill-red-500" />
          <span className="leading-none line-clamp-2">{error}</span>
        </p>
      )}
    </div>
  );
};

export default Select;
