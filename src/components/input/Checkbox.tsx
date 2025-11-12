import { ICheckbox } from "../../types";
import { InfoIcon } from "../../icons";

const Checkbox = ({
  register,
  className = "",
  rightText,
  labelClassName = "",
  checkboxProps,
  containerClassName = "",
  error,
}: ICheckbox) => {
  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <label
          className={`w-fit relative inline-flex items-center cursor-pointer border border-primary-10 bg-smoke-eerie rounded-full ${labelClassName}`}
        >
          <input
            name="remember"
            type="checkbox"
            className="sr-only peer outline-none"
            {...register}
            {...checkboxProps}
          />
          <div
            className={`w-10 md:w-11 h-5 md:h-6 rounded-full peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-silver-jet-2 after:peer-checked:bg-white after:border after:border-primary-10 after:rounded-full after:h-3 after:w-3 after:md:h-4 after:md:w-4 after:transition-all peer-checked:bg-accent-duo ${className}`}
          />
        </label>
        {rightText && (
          <span className="text-xs sm:text-[13px] md:text-sm text-primary-50 font-medium whitespace-nowrap">
            {rightText}
          </span>
        )}
      </div>
      {!checkboxProps?.disabled && error && (
        <p className="w-full text-start flex gap-1 items-center text-[11px] leading-tight text-red-500">
          <InfoIcon className="min-w-3 min-h-3 w-3 h-3 md:min-w-4 md:min-h-4 md:w-4 md:h-4 fill-red-500" />
          <span className="leading-none line-clamp-2">{error}</span>
        </p>
      )}
    </div>
  );
};

export default Checkbox;
