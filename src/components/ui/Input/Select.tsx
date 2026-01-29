import { useState, useRef, useEffect } from 'react';
import { customHooks } from '../../../hooks';
import type { ISelect } from '../../../types';
import { CheckedIcon, ChevronDownIcon } from '../../../icons';
import { InputError, InputIcon, InputLabel } from './children';

const Select = ({
  label = '',
  className = '',
  error = '',
  containerClassName = '',
  optionsClassName = '',
  icons,
  selectProps,
  options = [],
  optionsPosition = 'bottom',
}: ISelect) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = customHooks.OutsideClick<HTMLDivElement>(() => setIsOpen(false), {
    enabled: isOpen,
  });
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const selectedOptionRef = useRef<HTMLLIElement | null>(null);

  const selected = options.find((opt) => opt.value === selectProps.value);

  useEffect(() => {
    if (isOpen && selectedOptionRef.current) {
      selectedOptionRef.current.scrollIntoView({
        block: 'center',
        inline: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`flex w-full flex-col gap-1.5 ${containerClassName}`}>
      <div className="relative h-10 lg:h-12">
        <InputLabel children={label} onClick={() => setIsOpen((prev) => !prev)} className="z-2" />
        <div
          className={`border-primary/10 bg-smoke-eerie flex h-full w-full items-center gap-1 rounded-lg border ${className}`}
        >
          <InputIcon {...icons?.left} />
          {/* Hidden */}
          <select
            ref={selectRef}
            {...selectProps}
            id={selectProps.id || selectProps.name}
            className="sr-only"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div
            className={`text-primary line-clamp-1 flex h-full w-full flex-1 items-center justify-between border-none bg-transparent p-3 text-sm font-normal ${
              icons?.left?.icon ? 'pl-0' : ''
            } ${selectProps.disabled ? 'cursor-no-drop' : 'cursor-pointer'}`}
            onClick={() => !selectProps?.disabled && setIsOpen((prev) => !prev)}
          >
            <span className={`line-clamp-1 ${!selected?.value ? 'text-primary/50' : ''}`}>
              {selected?.label || selectProps?.placeholder}
            </span>
            <ChevronDownIcon
              className={`size-4 transition-transform md:size-5 lg:size-6 ${
                isOpen ? 'rotate-180' : ''
              } ${selected?.value ? 'stroke-primary' : 'stroke-primary/50'}`}
            />
            {isOpen && (
              <div
                className={`border-primary/10 bg-smoke-eerie absolute left-0 z-3 w-full overflow-hidden rounded-lg border shadow-md ${
                  optionsPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
                } ${optionsClassName}`}
              >
                <ul className="flex max-h-60 flex-col gap-0.5 overflow-auto px-1 py-2">
                  {options.map((option) => {
                    const active = selected?.value === option.value;
                    return (
                      <li
                        key={option.value}
                        ref={active ? selectedOptionRef : null}
                        className={`hover:bg-primary/10 text-tertiary flex cursor-pointer items-center justify-between gap-2 rounded-sm p-2 text-sm ${
                          active ? 'bg-primary/8' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!selectProps.disabled && selectRef.current) {
                            selectRef.current.value = active ? '' : option.value || '';
                            selectRef.current.dispatchEvent(new Event('change', { bubbles: true }));
                            setIsOpen(false);
                          }
                        }}
                      >
                        <span>{option.label}</span>
                        {active && <CheckedIcon className="stroke-primary size-4 md:size-5" />}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <InputError error={error} />
    </div>
  );
};

export default Select;
