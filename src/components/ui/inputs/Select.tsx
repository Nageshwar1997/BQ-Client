import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

import { useOutsideClick } from '@/hooks/useOutsideClick';
import type { ISelect } from '@/types/input.type';

import { InputError, InputIcon, InputLabel } from './children';

const Select = ({
  label = '',
  className = '',
  error = '',
  containerClassName = '',
  optionsClassName = '',
  icons,
  selectProps,
  options,
  position = 'bottom',
}: ISelect) => {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useOutsideClick<HTMLDivElement>(
    () => {
      setIsOpen(false);
    },
    { enabled: isOpen },
  );
  const selectedOptionRef = useRef<HTMLLIElement | null>(null);

  const selected = options.find((opt) => opt.value === selectProps.value);

  const handleToggle = () => {
    if (selectProps.disabled || !options.length) return;
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && selectedOptionRef.current) {
      selectedOptionRef.current.scrollIntoView({
        block: 'end',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className={`flex max-w-full min-w-0 flex-col gap-1.5 ${containerClassName}`}
    >
      <div className="relative">
        <InputLabel onClick={handleToggle} className="z-2 cursor-pointer">
          {label}
        </InputLabel>
        <div
          className={`border-primary/10 bg-smoke-eerie flex items-center gap-3 overflow-hidden rounded-lg border px-3 ${className}`}
        >
          {/* Left Icon */}
          <InputIcon icon={icons?.left} />
          <div
            className={`text-primary flex flex-1 items-center justify-between gap-0.5 truncate border-none bg-transparent text-[13px] ${selectProps.disabled ? 'cursor-no-drop' : 'cursor-pointer'}`}
            onClick={handleToggle}
          >
            <span
              className={`flex-1 truncate py-2 xl:py-3 ${!selected?.value ? 'text-primary/30' : ''}`}
            >
              {selected?.label ?? selectProps.placeholder}
            </span>
            <Icon
              icon="solar:alt-arrow-down-linear"
              className={`size-4 transition-transform md:size-5 ${
                isOpen ? 'rotate-180' : ''
              } ${selected?.value ? 'text-primary' : 'text-primary/30'}`}
            />
            {isOpen && options.length > 0 && (
              <div
                className={`border-primary/10 bg-smoke-eerie absolute left-0 z-3 w-full overflow-hidden rounded-lg border shadow-md ${
                  position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                } ${optionsClassName}`}
              >
                <ul className="flex max-h-60 flex-col gap-0.5 overflow-auto p-1">
                  {options.map((option) => {
                    const active = selected?.value === option.value;
                    return (
                      <li
                        key={option.value}
                        ref={active ? selectedOptionRef : null}
                        className={`hover:bg-primary/5 text-tertiary flex cursor-pointer items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-[13px] ${
                          active ? 'bg-primary/8' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (option.disabled || selectProps.disabled) return;
                          selectProps.onChange(active ? '' : option.value || '');
                          setIsOpen(false);
                        }}
                      >
                        <span className="flex-1 text-left text-[13px]">{option.label}</span>
                        {active && (
                          <Icon
                            icon="solar:unread-linear"
                            className="text-primary size-4 md:size-5"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          {/* Right Icon */}
          <InputIcon icon={icons?.right} />
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default Select;
