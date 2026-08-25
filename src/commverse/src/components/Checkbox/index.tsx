import { forwardRef } from 'react';
import { CheckMark } from '../../icons';
import type { CheckboxProps } from '../../types';

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id,
      label,
      checked = false,
      disabled = false,
      onChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const handleChange = (value: boolean) => {
      onChange?.(value);
    };

    return (
      <label
        htmlFor={id}
        className={`flex items-center gap-2 select-none ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        } ${className}`}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.checked)}
          className="sr-only"
          {...props}
        />

        <div
          className={`flex h-5 w-5 items-center justify-center rounded-md border ${
            checked
              ? 'bg-neutral-gray-700 border-neutral-gray-700'
              : 'border-neutral-gray-600 bg-transparent'
          }`}
        >
          {checked && <CheckMark className="text-white" />}
        </div>

        <span className="text-neutral-gray-900 text-sm font-medium">
          {label}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
