import { forwardRef } from 'react';
import type { InputProps } from '../../../types';

export const ColorInput = forwardRef<
  HTMLInputElement,
  Omit<InputProps, 'type'>
>(
  (
    {
      label,
      placeholder,
      error,
      className = '',
      containerClassName = '',
      disabled,
      onChange,
      ...props
    },
    ref
  ) => {
    const value = props.value;

    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        {label && (
          <label className="font-metropolis text-xs font-normal text-gray-700">
            {label}
          </label>
        )}

        <div
          className={`font-metropolis border-neutral-gray-400 hover:border-neutral-gray-900 relative flex w-full items-center gap-1 rounded-lg border bg-white px-2 py-2 transition ${className}`}
        >
          <div
            className="border-neutral-gray-400 h-5 w-5 rounded-md border"
            style={{ backgroundColor: `${value || '#000000'}` }}
          />
          <span
            className={`text-xs font-normal ${value ? 'text-neutral-gray-900 uppercase' : 'text-neutral-gray-400'}`}
          >
            {value || placeholder}
          </span>
          <input
            ref={ref}
            type="color"
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={(e) =>
              onChange &&
              onChange(
                e.target.value as unknown as React.ChangeEvent<HTMLInputElement>
              )
            }
            {...props}
          />
        </div>

        {error && (
          <span className="font-metropolis text-xs font-normal text-red-500">
            {error}
          </span>
        )}
      </div>
    );
  }
);

ColorInput.displayName = 'ColorInput';

export default ColorInput;
