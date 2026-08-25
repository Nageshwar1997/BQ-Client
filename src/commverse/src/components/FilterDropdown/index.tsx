import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import useOutsideClick from '../../hooks/useOutsideClick';
import type {
  FilterDropdownProps,
  FilterOption,
  SelectedOption,
} from '../../types';

const FilterDropdown = ({
  outerLabel = '',
  placeholder = '',
  leftIcon = null,
  rightIcon = null,
  options = [],
  multiple = false,
  value: controlledValue,
  onChange,
  className = '',
  innerLabel = '',
  error,
  menuPosition = 'bottom',
  menuAlign = 'start',
  menuClassName = '',
  menuWidth,
  menuOffset = 2,
  fitMenuToContent = false,
  footerActionLabel,
  footerActionIcon,
  onFooterAction,
  footerAction,
}: FilterDropdownProps) => {
  const isControlled = controlledValue !== undefined;

  const getInitialValue = (): string | string[] | null => {
    if (isControlled) return controlledValue ?? null;
    const defaults = options.filter((o) => o.default).map((o) => o.id);
    if (multiple) return defaults;
    return defaults[0] ?? null;
  };

  const [internalValue, setInternalValue] = useState<string | string[] | null>(
    getInitialValue
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const value = isControlled ? (controlledValue ?? null) : internalValue;

  useOutsideClick({
    ref: dropdownRef,
    handler: () => setIsMenuOpen(false),
    enabled: isMenuOpen,
  });

  const isSelected = (opt: FilterOption): boolean => {
    if (multiple) {
      return Array.isArray(value) && value.includes(opt?.id);
    }
    return value === opt.id;
  };

  const updateValue = (nextIds: string | string[] | null) => {
    if (!isControlled) setInternalValue(nextIds);
  };

  const mapIdsToOptions = (
    ids: string | string[] | null
  ): SelectedOption | SelectedOption[] | null => {
    if (!ids) return multiple ? [] : null;

    if (Array.isArray(ids)) {
      return options
        .filter((o) => ids.includes(o.id))
        .map((o) => ({
          id: o.id,
          value: o.value,
          label: o.label,
        }));
    }

    const found = options.find((o) => o.id === ids);
    return found
      ? { id: found.id, value: found.value, label: found.label }
      : null;
  };

  const handleSelect = (opt: FilterOption) => {
    if (multiple) {
      const currentIds = Array.isArray(value) ? value : [];

      const updatedIds = isSelected(opt)
        ? currentIds.filter((id) => id !== opt.id)
        : [...currentIds, opt.id];

      updateValue(updatedIds);
      onChange?.(mapIdsToOptions(updatedIds) as SelectedOption[]);
    } else {
      updateValue(opt.id);
      onChange?.(opt);
      setIsMenuOpen(false);
    }
  };

  const clearAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const cleared = multiple ? [] : null;

    updateValue(cleared);
    onChange?.(multiple ? [] : null);
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!isMenuOpen && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setIsMenuOpen(true);
      return;
    }

    if (!isMenuOpen) return;

    if (e.key === 'Escape') setIsMenuOpen(false);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
    }

    if (e.key === 'Enter' && activeIndex >= 0) {
      handleSelect(options[activeIndex]);
    }
  };

  const getDisplayText = (): string => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      if (value.length === 1) {
        return options.find((o) => o.id === value[0])?.label ?? placeholder;
      }
      return `${value.length} selected`;
    }

    if (!multiple && typeof value === 'string') {
      return options.find((o) => o.id === value)?.label ?? placeholder;
    }

    return innerLabel || placeholder;
  };

  const hasSelection = multiple
    ? Array.isArray(value) && value.length > 0
    : value !== null;

  // const selectedCount = Array.isArray(value) ? value.length : 0;

  const getPositionClasses = () => {
    switch (menuPosition) {
      case 'top':
        return menuAlign === 'end'
          ? 'bottom-full right-0'
          : menuAlign === 'center'
            ? 'bottom-full left-1/2 -translate-x-1/2'
            : 'bottom-full left-0';

      case 'bottom':
        return menuAlign === 'end'
          ? 'top-full right-0'
          : menuAlign === 'center'
            ? 'top-full left-1/2 -translate-x-1/2'
            : 'top-full left-0';

      case 'left':
        return menuAlign === 'end'
          ? 'right-full bottom-0'
          : menuAlign === 'center'
            ? 'right-full top-1/2 -translate-y-1/2'
            : 'right-full top-0';

      case 'right':
        return menuAlign === 'end'
          ? 'left-full bottom-0'
          : menuAlign === 'center'
            ? 'left-full top-1/2 -translate-y-1/2'
            : 'left-full top-0';

      default:
        return 'top-full left-0';
    }
  };

  const getOffsetStyles = () => {
    const offsetPx = menuOffset * 4;

    switch (menuPosition) {
      case 'top':
        return { marginBottom: `${offsetPx}px` };
      case 'bottom':
        return { marginTop: `${offsetPx}px` };
      case 'left':
        return { marginRight: `${offsetPx}px` };
      case 'right':
        return { marginLeft: `${offsetPx}px` };
      default:
        return { marginTop: `${offsetPx}px` };
    }
  };

  const resolvedFooterAction =
    footerAction ??
    (footerActionLabel ? (
      <button
        type="button"
        disabled={!onFooterAction}
        onClick={() => onFooterAction?.()}
        className={`font-metropolis flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-neutral-gray-900 transition-colors ${
          onFooterAction
            ? 'cursor-pointer hover:bg-gray-50'
            : 'cursor-not-allowed opacity-60'
        }`}
      >
        {footerActionIcon && (
          <span className="shrink-0 text-neutral-gray-900">
            {footerActionIcon}
          </span>
        )}
        <span className="truncate">{footerActionLabel}</span>
      </button>
    ) : null);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {!innerLabel && outerLabel && (
        <h3 className="font-metropolis mb-1 text-xs font-medium text-gray-700">
          {outerLabel}
        </h3>
      )}

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((p) => !p)}
        onKeyDown={handleKeyDown}
        data-state={isMenuOpen ? 'open' : 'closed'}
        className={`group border ${
          error
            ? 'border-ui-error! focus-visible:ring-ui-error'
            : 'border-neutral-gray-400 hover:border-neutral-gray-600 focus-visible:ring-neutral-gray-600'
        } data-[state=open]:bg-neutral-gray-300 data-[state=open]:border-neutral-gray-900 hover:bg-neutral-gray-200 font-metropolis flex w-full min-w-44 cursor-pointer items-center gap-1.5 truncate rounded-lg bg-white px-3.5 py-2 text-xs font-medium transition-all duration-150 focus-visible:ring-2 active:bg-gray-200`}
      >
        {leftIcon && (
          <span className="text-neutral-gray-800 flex items-center">
            {leftIcon}
          </span>
        )}

        <span
          className={`font-metropolis flex-1 truncate text-left font-normal ${
            hasSelection ? 'text-neutral-gray-800' : 'text-neutral-gray-600'
          }`}
        >
          {getDisplayText()}
        </span>

        {hasSelection && (
          <span
            onClick={clearAll}
            className="flex items-center rounded-full p-0.5 text-gray-400 transition-all duration-150 hover:bg-gray-200 hover:text-gray-800"
          >
            <Icon icon="lucide:x" className="size-3" />
          </span>
        )}

        {rightIcon ? (
          <span
            className={`ml-auto flex items-center text-gray-500 transition-transform duration-200 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          >
            {rightIcon}
          </span>
        ) : (
          <Icon
            icon="solar:alt-arrow-down-linear"
            className={`transition-transform duration-200 ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {error && (
        <span className="font-metropolis text-ui-error text-xs font-normal">
          {error}
        </span>
      )}

      {isMenuOpen && (
        <div
          role="listbox"
          className={`border-neutral-gray-200 absolute z-50 overflow-hidden rounded-lg border bg-white shadow-lg ${getPositionClasses()} ${menuClassName}`}
          style={{
            width: menuWidth ?? (fitMenuToContent ? 'max-content' : undefined),
            minWidth: menuWidth ? undefined : '100%',
            ...getOffsetStyles(),
          }}
        >
          <div className="flex max-h-64 flex-col gap-1 overflow-y-auto p-2">
            {options.map((opt, index) => {
              const selected = isSelected(opt);

              return (
                <button
                  key={opt.id}
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`font-metropolis flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-all duration-150 ${
                    selected
                      ? multiple
                        ? 'text-neutral-gray-900 bg-transparent font-semibold'
                        : 'text-neutral-gray-900 bg-gray-100'
                      : 'text-neutral-gray-800'
                  } ${
                    activeIndex === index && !(multiple && selected)
                      ? 'bg-gray-50'
                      : ''
                  }`}
                >
                  {opt.icon && (
                    <span className="text-gray-400">{opt.icon}</span>
                  )}
                  <span className="flex-1 truncate text-left">
                    {opt.label}
                  </span>
                  {multiple && selected && (
                    <Icon
                      icon="lucide:check"
                      className="text-neutral-gray-900 size-4 shrink-0"
                    />
                  )}
                  {opt.rightIcon && (
                    <span className="ml-auto text-gray-400">
                      {opt.rightIcon}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* 
          {multiple && selectedCount > 0 && (
            <div className="flex items-center justify-between border border-gray-100 px-3 py-2">
              <span className="text-xs text-gray-400">
                {selectedCount} selected
              </span>
              <button
                onClick={() => clearAll()}
                className="text-xs font-semibold text-gray-500 transition-colors hover:text-gray-900"
              >
                Clear all
              </button>
            </div>
          )} */}
          {resolvedFooterAction && (
            <div className="border-neutral-gray-200 border-t p-2">
              {resolvedFooterAction}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
