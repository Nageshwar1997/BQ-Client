import { useEffect, useRef, type ChangeEvent } from 'react';

import { InfoIcon } from '../../icons';
import type { IInput } from '../../types';

export const Input = ({
  label = '',
  register,
  className = '',
  error = '',
  containerClassName = '',
  icons,
  inputProps,
  needRef = false,
}: IInput) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (inputProps?.disabled) return;
    inputProps.onChange?.(event);
    register?.onChange?.(event);
  };

  useEffect(() => {
    if (needRef) inputRef.current?.focus();
  }, [needRef]);

  return (
    <div className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        {label && (
          <label
            htmlFor={inputProps?.name ?? ''}
            className="text-primary/50 border-primary/10 bg-smoke-eerie absolute top-0 left-3 -translate-y-1/2 transform cursor-pointer rounded-sm border px-1 py-0.5 text-[10px] leading-none md:px-2 lg:text-xs"
          >
            {label}
          </label>
        )}
        <div
          className={`border-primary/10 bg-smoke-eerie flex h-full w-full items-center gap-1 overflow-hidden rounded-lg border ${className}`}
        >
          {/* Left Icon */}
          {icons?.left?.icon ? (
            <span
              onClick={icons.left.onClick}
              className="group flex h-full cursor-pointer items-center justify-center overflow-hidden p-2"
            >
              {icons.left.icon}
            </span>
          ) : icons?.left?.text ? (
            <div className="h-full overflow-hidden">
              <p className="text-primary/50 border-r-primary/10 flex h-full items-center justify-center border-r p-3 text-sm capitalize">
                {icons?.left?.text}
              </p>
            </div>
          ) : null}
          {/* Input */}
          <input
            aria-autocomplete="none"
            {...register}
            {...inputProps}
            {...(needRef && { ref: inputRef })}
            id={inputProps?.name}
            disabled={inputProps?.disabled}
            onChange={handleChange}
            onWheel={(event) => (inputProps?.type === 'number' ? event.currentTarget.blur() : null)}
            className={`text-primary placeholder:text-primary/50 autofill-effect line-clamp-1 h-full w-full flex-1 border-none bg-transparent p-3 text-sm font-normal outline-hidden placeholder:text-sm focus:border-none focus:outline-hidden disabled:cursor-not-allowed ${
              icons?.left?.icon
                ? 'pl-0'
                : icons?.right?.icon
                  ? 'pr-0'
                  : icons?.left?.text
                    ? 'pl-2'
                    : ''
            } ${inputProps?.className || ''}`}
          />
          {/* Right Icon */}
          {icons?.right && (
            <span
              onClick={icons.right.onClick}
              className="group flex h-full cursor-pointer items-center justify-center overflow-hidden p-2"
            >
              {icons.right.icon}
            </span>
          )}
        </div>
      </div>
      {error && (
        <p className="text-red-c flex w-full items-center gap-1 text-start text-[11px] leading-tight">
          <InfoIcon className="fill-red-c h-3 min-h-3 w-3 min-w-3 md:h-4 md:min-h-4 md:w-4 md:min-w-4" />
          <span className="line-clamp-2 leading-none">{error}</span>
        </p>
      )}
    </div>
  );
};
