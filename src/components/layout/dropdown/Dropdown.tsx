import { cloneElement, isValidElement, useEffect, useRef, useState, type FC } from 'react';
import { useOutsideClick } from '../../../hooks';
import type { TDropdown } from '../../../types';
import { ChevronDownIcon } from '../../../icons';

export const Dropdown: FC<TDropdown> = ({
  title,
  icons,
  children,
  className = '',
  closeOnOptionClick = false,
  closeOnOutsideClick = false,
  isAbsolute = false,
  showShadow = false,
  isRounded = false,
  options = [],
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ref = useOutsideClick<HTMLDivElement>(() => (isOpen ? setIsOpen(false) : null), {
    enabled: closeOnOutsideClick,
  });

  useEffect(() => {
    if (!containerRef.current) return;
    if (isOpen) {
      containerRef.current.style.maxHeight = `${containerRef.current.scrollHeight}px`;
      containerRef.current.style.opacity = '1';
    } else {
      containerRef.current.style.maxHeight = '0px';
      containerRef.current.style.opacity = '0';
    }
  }, [isOpen, options]);
  return (
    <div
      className={`flex w-full cursor-pointer flex-col items-start ${
        isAbsolute ? 'relative' : 'static'
      } ${className}`}
      ref={ref}
    >
      <button
        className="bg-primary-invert group flex w-full items-center justify-between gap-2 p-3 text-left transition-colors duration-300"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <div className="[&>span]:text-primary flex items-center gap-2 [&>span]:flex [&>span]:items-center [&>span]:justify-center [&>span]:text-sm [&>span]:transition-all [&>span]:duration-300 sm:[&>span]:text-base">
          {icons?.left && <span>{icons.left}</span>}
          <span className="font-medium whitespace-nowrap">{title}</span>
          {icons?.right && <span>{icons.right}</span>}
        </div>
        <ChevronDownIcon
          className={`stroke-primary h-5 w-5 transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      <div
        ref={containerRef}
        className={`bg-primary-invert max-h-0 w-full overflow-hidden opacity-0 transition-all duration-500 ease-in-out *:px-3 *:py-2 ${
          isAbsolute ? 'absolute inset-x-0 top-full z-10 mt-2' : ''
        } ${
          showShadow
            ? 'shadow-[rgba(var(--primary-rgb),0.08)_0px_4px_16px,rgba(var(--primary-rgb),0.1)_0px_8px_32px]'
            : ''
        } ${isRounded ? 'rounded-lg' : ''}`}
      >
        {isValidElement(children)
          ? cloneElement(children, {
              onSelect: () => {
                if (closeOnOptionClick) setIsOpen(false);
              },
            })
          : children}
      </div>
    </div>
  );
};
