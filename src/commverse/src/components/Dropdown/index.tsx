import { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import useOutsideClick from '../../hooks/useOutsideClick';
import type { ReactNode } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface DropdownProps {
  value?: string;
  onChange?: (value: string) => void;
  options?: DropdownOption[];
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  valueContent?: ReactNode;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}

const Dropdown = ({
  value,
  onChange,
  options = [],
  leftIcon,
  rightIcon,
  valueContent,
  placeholder,
  className = '',
  buttonClassName = '',
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsOpen(false),
    enabled: isOpen,
  });

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-150 ${buttonClassName}`}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}

        <div className="flex-1 truncate text-left">
          {valueContent
            ? valueContent
            : selectedOption?.label || placeholder || 'Select an option'}
        </div>

        {rightIcon ? (
          <span
            className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            {rightIcon}
          </span>
        ) : (
          <Icon
            icon="solar:alt-arrow-down-linear"
            className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {isOpen && (
        <div className="border-neutral-gray-200 animate-in fade-in slide-in-from-top-1 absolute left-0 z-50 mt-1.5 w-full overflow-hidden rounded-lg border bg-white shadow-lg duration-200">
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto p-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange?.(opt.value);
                  setIsOpen(false);
                }}
                className={`hover:bg-neutral-gray-100 flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-all duration-150 ${
                  opt.value === value
                    ? 'bg-neutral-gray-50 text-neutral-gray-900'
                    : 'text-neutral-gray-800'
                }`}
              >
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <span className="flex-1 text-left">{opt.label}</span>
                {opt.rightIcon && (
                  <span className="ml-auto shrink-0">{opt.rightIcon}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
