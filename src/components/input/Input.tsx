import { ChangeEvent } from "react";
import { CheckedCircleIcon, InfoIcon } from "../../icons";
import { InputProps } from "../../types";

const Input = ({
  value,
  name = "",
  label = "",
  register,
  leftIcon,
  rightIcon,
  onChange,
  onKeyDown,
  leftIconClick,
  rightIconClick,
  type = "text",
  className = "",
  errorText = "",
  readOnly = false,
  successText = "",
  placeholder = "",
  autoComplete = "off",
  containerClassName = "",
  leftText = { required: false, text: "" },
}: InputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    register?.onChange?.(event);
  };

  const isError = errorText && !successText;
  const isSuccess = successText && !errorText;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        {label && (
          <label
            htmlFor={name}
            className={`text-[10px] lg:text-xs text-primary-50 absolute top-0 left-3 transform -translate-y-1/2 border border-primary-10 leading-none px-1 md:px-2 py-0.5 bg-smoke-eerie rounded cursor-pointer`}
          >
            {label}
          </label>
        )}
        <div
          className={`w-full h-full flex items-center gap-1 border border-primary-10 bg-smoke-eerie rounded-lg overflow-hidden ${className}`}
        >
          {/* Left Icon */}
          {leftIcon && !rightIcon ? (
            <span
              onClick={leftIconClick && leftIconClick}
              className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden"
            >
              {leftIcon}
            </span>
          ) : !leftIcon && leftText.required ? (
            <div className="h-full overflow-hidden">
              <p className="h-full flex items-center justify-center text-sm text-primary-50 border-r border-r-primary-10 p-3">
                {leftText.text}
              </p>
            </div>
          ) : null}
          {/* Input */}
          <input
            aria-autocomplete="none"
            id={name}
            type={type}
            name={name}
            value={value}
            {...register}
            readOnly={readOnly}
            disabled={readOnly}
            onKeyDown={onKeyDown}
            onChange={handleChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            onWheel={(event) => type === "number" && event.currentTarget.blur()}
            className={`w-full h-full outline-none border-none focus:outline-none focus:border-none bg-transparent font-normal text-sm p-3 text-primary placeholder:text-primary-50 placeholder:text-sm autofill-effect line-clamp-1 ${
              leftIcon && !rightIcon
                ? "pl-0"
                : !leftIcon && rightIcon
                ? "pr-0"
                : leftText.required
                ? "pl-2"
                : ""
            } ${type === "number" ? "number-input-mouse-control-none" : ""}`}
          />
          {/* Right Icon */}
          {!leftIcon && rightIcon && (
            <span
              onClick={rightIconClick && rightIconClick}
              className="h-full flex justify-center items-center cursor-pointer p-2 overflow-hidden"
            >
              {rightIcon}
            </span>
          )}
        </div>
      </div>

      {!readOnly && (isError || isSuccess) && (
        <p
          className={`w-full text-start flex gap-1 items-center text-[11px] leading-tight mt-2 text-red-500`}
        >
          {isError ? (
            <InfoIcon className="w-3 h-3 md:w-4 md:h-4 fill-red-500" />
          ) : (
            <CheckedCircleIcon className="w-3 h-3 md:w-4 md:h-4 fill-green-500" />
          )}
          <span className="leading-none">
            {isError ? errorText : successText}
          </span>
        </p>
      )}
    </div>
  );
};

export default Input;
