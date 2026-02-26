import type { ICheckbox } from '@/Types/Common.type';
import { InputError } from './Children';

export const Checkbox = ({
  register,
  className = '',
  rightText,
  labelClassName = '',
  checkboxProps,
  containerClassName = '',
  error,
}: ICheckbox) => {
  return (
    <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
      <div className="flex items-center gap-2 sm:gap-3">
        <label
          className={`border-primary/10 bg-smoke-eerie relative inline-flex w-fit cursor-pointer items-center rounded-full border ${labelClassName}`}
        >
          <input
            name="remember"
            type="checkbox"
            className="peer sr-only outline-hidden"
            {...register}
            {...checkboxProps}
            id={checkboxProps?.id || checkboxProps?.name}
          />
          <div
            className={`after:bg-silver after:border-primary/10 peer-checked:bg-accent-duo h-5 w-10 rounded-full after:absolute after:top-1 after:left-1 after:h-3 after:w-3 after:rounded-full after:border after:transition-all after:content-[''] peer-checked:after:translate-x-5 peer-checked:after:bg-white md:h-6 md:w-11 md:after:h-4 md:after:w-4 ${className}`}
          />
        </label>
        {rightText && (
          <span className="text-primary-50 text-xs font-medium whitespace-nowrap sm:text-[13px] md:text-sm">
            {rightText}
          </span>
        )}
      </div>
      <InputError error={error} />
    </div>
  );
};
