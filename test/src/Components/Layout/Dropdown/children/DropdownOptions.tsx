import { ChevronDownIcon } from '@/Icons';
import type { IDropdownOptions } from '@/Types';

export const DropdownOptions = ({
  options,
  selected,
  onChange,
  className = '',
  onSelect,
}: IDropdownOptions) => {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {options.map((opt, index) => {
        const isSelected =
          selected === opt.value || ((!selected || selected === '') && opt.value === 'all');
        return (
          <button
            key={index}
            className={`text-tertiary flex items-center justify-between gap-3 px-2 py-1 text-sm ${
              isSelected ? 'text-secondary font-medium' : 'font-normal'
            }`}
            onClick={() => {
              onChange(opt);
              onSelect?.();
            }}
            disabled={opt.disabled}
          >
            {opt.label}
            {isSelected && <ChevronDownIcon className="stroke-primary size-5" />}
          </button>
        );
      })}
    </div>
  );
};
