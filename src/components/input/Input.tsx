import { ChangeEvent, useEffect, useRef } from "react";
import { InfoIcon } from "../../icons";
import { IInput } from "../../types";

const Input = ({
  label = "",
  register,
  className = "",
  error = "",
  containerClassName = "",
  icons,
  inputProps,
  needRef = false,
}: IInput) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    inputProps?.onChange?.(event);
    register?.onChange?.(event);
  };

  useEffect(() => {
    if (needRef) {
      inputRef.current?.focus();
    }
  }, [needRef]);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        {label && (
          <label
            htmlFor={inputProps.name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 bg-smoke-eerie rounded cursor-pointer`}
          >
            {label}
          </label>
        )}
        <div
          className={`w-full h-full flex items-center gap-1 border border-primary-10 bg-smoke-eerie rounded-lg overflow-hidden ${className}`}
        >
          {/* Left Icon */}
          {icons?.left?.icon && !icons.right?.icon ? (
            <span
              onClick={icons.left.onClick}
              className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden"
            >
              {icons.left.icon}
            </span>
          ) : !icons?.left?.icon && icons?.left?.text ? (
            <div className="h-full overflow-hidden">
              <p className="h-full flex items-center justify-center text-sm text-primary-50 border-r border-r-primary-10 p-3 capitalize">
                {icons?.left?.text}
              </p>
            </div>
          ) : null}
          {/* Input */}
          <input
            aria-autocomplete="none"
            {...register}
            {...inputProps}
            ref={needRef ? inputRef : null}
            id={inputProps.name}
            disabled={inputProps?.readOnly}
            onChange={handleChange}
            onWheel={(event) =>
              inputProps?.type === "number" ? event.currentTarget.blur() : null
            }
            className={`flex-1 w-full h-full outline-none border-none focus:outline-none focus:border-none bg-transparent font-normal text-sm p-3 text-primary placeholder:text-primary-50 placeholder:text-sm autofill-effect line-clamp-1 ${
              icons?.left?.icon && !icons?.right?.icon
                ? "pl-0"
                : !icons?.left?.icon && icons?.right?.icon
                ? "pr-0"
                : icons?.left?.text
                ? "pl-2"
                : ""
            } ${
              inputProps?.type === "number"
                ? "number-input-mouse-control-none"
                : ""
            }`}
          />
          {/* Right Icon */}
          {!icons?.left && icons?.right && (
            <span
              onClick={icons.right.onClick}
              className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden"
            >
              {icons.right.icon}
            </span>
          )}
        </div>
      </div>

      {!inputProps?.readOnly && error && (
        <p
          className={`w-full text-start flex gap-1 items-center text-[11px] leading-tight text-red-500`}
        >
          <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
          <span className="leading-none">{error}</span>
        </p>
      )}
    </div>
  );
};

export default Input;
