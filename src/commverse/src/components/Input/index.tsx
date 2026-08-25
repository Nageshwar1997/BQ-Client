import { forwardRef, useState } from 'react';
import { Icon } from '@iconify/react';
import type { InputProps } from '../../types';

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      label,
      placeholder,
      error,
      className = '',
      containerClassName = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const isNumber = type === 'number';

    return (
      <div className={`flex flex-col gap-1 ${containerClassName}`}>
        {label && (
          <label className="font-metropolis text-xs font-medium text-gray-700">
            {label}
          </label>
        )}

        <div className="relative flex gap-1">
          <input
            ref={ref}
            type={inputType}
            disabled={disabled}
            placeholder={placeholder}
            // autoComplete="off"
            className={`bg-neutral-gray-100 border-neutral-gray-400 font-metropolis placeholder:text-neutral-gray-400 text-neutral-gray-900 disabled:border-neutral-gray-400 disabled:bg-neutral-gray-200 disabled:text-neutral-gray-500 w-full rounded-lg border px-3 py-2 text-sm transition outline-none placeholder:text-xs focus:ring-1 disabled:cursor-not-allowed ${
              error
                ? 'border-ui-error focus:ring-ui-error focus:hover:border-ui-error'
                : 'focus:ring-brand focus:hover:border-brand! enabled:hover:border-neutral-gray-900'
            } ${isPassword ? 'pr-12' : ''} ${
              isNumber
                ? '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                : ''
            } ${className}`}
            onWheel={(e) => isNumber && e.currentTarget.blur()}
            {...props}
          />

          {isPassword && (
            <Icon
              icon={
                showPassword ? 'solar:eye-linear' : 'solar:eye-closed-linear'
              }
              className="text-neutral-gray-500! absolute top-1/2 right-3 size-4.5 -translate-y-1/2 outline-none hover:cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            />
          )}
        </div>

        {error && (
          <span className="font-metropolis text-ui-error! flex gap-1 text-xs font-normal">
            <Icon icon="solar:info-circle-outline" className="h-4 min-w-4" />
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default Input;
