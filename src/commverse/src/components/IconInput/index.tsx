import { forwardRef, useState } from 'react';
import type { IconInputProps } from '../../types';
import { Icon } from '@iconify/react';

const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  (
    {
      type = 'text',
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
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const isNumber = type === 'number';
    const { leftAddon, rightAddon, ...restProps } = props;
    const hasLeftAddon = !!leftAddon;
    const hasRightAddon = !!rightAddon;

    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        {label && (
          <label className="font-metropolis text-xs font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative w-full">
          {hasLeftAddon && (
            <div className="text-neutral-gray-600 pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-[12px]">
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            placeholder={placeholder}
            className={`font-metropolis bg-neutral-gray-100 border-neutral-gray-400 placeholder:text-neutral-gray-400 text-neutral-gray-900 disabled:bg-neutral-gray-200! disabled:text-neutral-gray-500! disabled:border-neutral-gray-400! w-full rounded-lg border px-4 py-3 text-sm transition outline-none placeholder:text-xs focus:ring-1 disabled:cursor-not-allowed ${
              error
                ? 'border-ui-error focus:ring-ui-error focus:hover:border-ui-error'
                : 'focus:ring-brand focus:hover:border-brand! enabled:hover:border-neutral-gray-900'
            } ${hasLeftAddon ? 'pl-6.5' : ''} ${isPassword ? 'pr-12' : ''} ${
              isNumber
                ? '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                : ''
            } ${className}`}
            onWheel={(e) => type === 'number' && e.currentTarget.blur()}
            onChange={(e) => onChange?.(e.target.value)}
            {...restProps}
          />

          {isPassword && (
            <Icon
              icon={
                showPassword ? 'solar:eye-linear' : 'solar:eye-closed-linear'
              }
              className="text-neutral-gray-500! absolute top-1/2 right-3 z-10 size-4.5 -translate-y-1/2 outline-none hover:cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          )}

          {hasRightAddon && !isPassword && (
            <div className="text-neutral-gray-600 pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-[12px]">
              {rightAddon}
            </div>
          )}
        </div>

        {error && (
          <span className="font-metropolis text-ui-error text-xs font-normal">
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default IconInput;
