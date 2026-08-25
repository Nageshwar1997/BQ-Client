import React, { useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import useOutsideClick from '../../hooks/useOutsideClick';
import type { MoreOptionsMenuProps } from '../../types';
import Divider from '../Divider';

export const MoreOptionsMenu: React.FC<MoreOptionsMenuProps> = ({
  menuItems,
  triggerClassName = '',
  menuClassName = '',
  triggerIcon = 'solar:menu-dots-bold',
  triggerContent,
  rotateTriggerOnOpen = false,
  position = 'bottom-right',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: [menuRef, triggerRef],
    handler: () => setIsMenuOpen(false),
    enabled: isMenuOpen,
  });

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const positionClasses = {
    'top-right': 'bottom-8 right-0',
    'bottom-right': 'top-8 right-0',
    'top-left': 'bottom-8 left-0',
    'bottom-left': 'top-8 left-0',
  };
  const defaultTriggerIcon = 'solar:menu-dots-bold';
  const triggerRotationClass =
    triggerIcon === defaultTriggerIcon ? 'rotate-90' : '';
  const triggerOpenRotationClass =
    rotateTriggerOnOpen && isMenuOpen ? 'rotate-180' : '';
  const resolvedTriggerContent =
    typeof triggerContent === 'function'
      ? triggerContent({ isMenuOpen })
      : triggerContent;

  return (
    <div className="relative cursor-pointer" ref={triggerRef}>
      {triggerContent ? (
        <div
          className={triggerClassName}
          onClick={handleMenuToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }
          }}
          aria-haspopup="true"
          aria-expanded={isMenuOpen}
        >
          {resolvedTriggerContent}
        </div>
      ) : (
        <Icon
          icon={triggerIcon}
          className={`size-6 cursor-pointer rounded-md p-1 transition-transform ${triggerRotationClass} ${triggerOpenRotationClass} ${triggerClassName}`}
          onClick={handleMenuToggle}
        />
      )}

      {isMenuOpen && (
        <div
          ref={menuRef}
          className={`bg-neutral-gray-100 border-neutral-gray-200 shadow-toast-card absolute z-50 flex min-w-26 flex-col gap-1 rounded-md border p-1 ${positionClasses[position]} ${menuClassName}`}
          role="menu"
          aria-orientation="vertical"
        >
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.showDividerAbove && (
                <Divider
                  className={`border-neutral-gray-200! my-0! ${item.dividerClassName ?? ''}`}
                />
              )}
              <span
                className={`font-metropolis flex w-full items-center rounded-lg p-2 text-xs font-medium whitespace-nowrap ${
                  item.disabled
                    ? 'cursor-not-allowed! opacity-50'
                    : 'hover:bg-neutral-gray-150 cursor-pointer!'
                } ${
                  item.variant === 'danger'
                    ? 'text-ui-error'
                    : 'text-neutral-gray-900'
                } ${item.menuItemClassName}`}
                role="menuitem"
                aria-disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.disabled) return;
                  item.onClick?.();
                  setIsMenuOpen(false);
                }}
              >
                {typeof item.icon === 'string' ? (
                  <Icon icon={item.icon} className="mr-2 h-4 w-4 shrink-0" />
                ) : item.icon ? (
                  <span className="mr-2 flex h-4 w-4 shrink-0 items-center justify-center">
                    {item.icon}
                  </span>
                ) : null}
                {item.label}
              </span>
              {item.showDividerBelow && (
                <Divider
                  className={`border-neutral-gray-200! my-0! ${item.dividerClassName ?? ''}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
