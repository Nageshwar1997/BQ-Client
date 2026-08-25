import { useEffect, useState } from 'react';
import { colorMap } from '../../lib/utils';
import type { TabProps, TabData } from '../../types';
// import { CrownIcon } from '../../icons';

const BASE =
  'flex items-center justify-center cursor-pointer rounded-xl enabled:border text-sm font-metropolis font-semibold px-4 py-3 leading-none';

function getStaticClasses(isSelected: boolean) {
  if (isSelected) {
    return 'bg-neutral-gray-300 border-neutral-gray-600 text-neutral-gray-900';
  }
  return 'bg-neutral-gray-100 enabled:border-neutral-gray-300 text-neutral-gray-600 enabled:hover:border-neutral-gray-600 hover:bg-neutral-gray-100 hover:text-neutral-gray-900';
}

function getGradientClasses(isSelected: boolean, color?: string) {
  if (isSelected && color === 'black') {
    return 'bg-neutral-gray-900 border-neutral-gray-900 text-neutral-gray-100';
  }

  const theme = color ? colorMap?.[color] : null;
  if (!theme) return getStaticClasses(isSelected);

  if (isSelected) {
    return `bg-gradient-to-bl ${theme.from} to-neutral-100 ${theme.border} ${theme.text}`;
  }
  return `bg-neutral-gray-100 border-neutral-gray-300 text-neutral-gray-900`;
}

function getToggleClasses(isSelected: boolean) {
  if (isSelected) {
    return 'bg-neutral-gray-900 fill-white! text-white font-semibold! w-full! h-full ';
  }
  return 'text-neutral-gray-900 font-medium w-full!';
}

function getPillClasses(isSelected: boolean) {
  if (isSelected) {
    return 'bg-white text-neutral-gray-900 rounded-lg m-1 font-semibold! text-neutral-gray-900 w-full! ';
  }
  return 'text-neutral-gray-900 m-1 font-medium w-full!';
}

function getIconClasses(variant: string, isSelected: boolean) {
  if (variant === 'toggle' && isSelected) {
    return '[&_svg>path]:stroke-white [&_svg]:text-white shrink-0';
  }
  if (variant === 'pill' && isSelected) {
    return '[&_svg>path]:stroke-neutral-gray-700 [&_svg]:text-neutral-gray-700 shrink-0';
  }
  return '';
}

export const Tab: React.FC<TabProps> = ({
  data,
  variant = 'static',
  defaultActiveId,
  className = '',
  selectedClassName = '',
  onClick,
}) => {
  const [activeId, setActiveId] = useState<TabData['id'] | null>(
    defaultActiveId || null
  );

  useEffect(() => {
    if (defaultActiveId === undefined) return;
    setActiveId(defaultActiveId);
  }, [defaultActiveId]);

  useEffect(() => {
    if (defaultActiveId) {
      setActiveId(defaultActiveId);
    }
  }, [defaultActiveId]);
  const handleClick = (item: TabData) => {
    setActiveId(item.id);
    onClick?.(item);
  };

  const isToggleOrPill = variant === 'toggle' || variant === 'pill';

  const containerClasses = isToggleOrPill
    ? variant === 'toggle'
      ? 'flex items-center justify-between gap-1 bg-neutral-gray-200 border-[1.5px] border-neutral-gray-400 rounded-lg overflow-hidden w-full'
      : 'flex items-center justify-between gap-1 bg-neutral-gray-300  border border-neutral-gray-400 rounded-lg w-full'
    : '';

  const tabBaseClasses = isToggleOrPill
    ? 'inline-flex items-center justify-center  cursor-pointer text-[16px] font-metropolis font-medium px-5 py-3 leading-none'
    : BASE;

  return (
    <div
      className={
        isToggleOrPill
          ? containerClasses
          : 'flex items-center justify-center gap-2'
      }
    >
      {data.map((item) => {
        const isSelected = activeId === item.id;

        const variantClasses =
          variant === 'toggle'
            ? getToggleClasses(isSelected)
            : variant === 'pill'
              ? getPillClasses(isSelected)
              : variant === 'gradient'
                ? getGradientClasses(isSelected, item.color)
                : getStaticClasses(isSelected);

        const classes = [
          tabBaseClasses,
          variantClasses,
          className,
          isSelected ? selectedClassName : '',
        ]
          .filter(Boolean)
          .join(' ');

        const contentCount = [
          item.leftIcon,
          item.title,
          item.count !== undefined,
          item.rightIcon,
          item.subscriptionType,
        ].filter(Boolean).length;
        const gapClass = contentCount > 1 ? 'gap-1' : '';

        const iconClasses = getIconClasses(variant, isSelected);

        return (
          <button
            key={item.id}
            tabIndex={0}
            className={`flex items-center ${item.disabled ? 'cursor-not-allowed! opacity-20' : 'cursor-pointer'} ${gapClass} ${classes}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!item.disabled) {
                handleClick(item);
              }
            }}
          >
            {item.leftIcon && (
              <span className={iconClasses}>{item.leftIcon}</span>
            )}

            {item.title && <span>{item.title}</span>}

            {item.count !== undefined && (
              <span className="bg-neutral-gray-900 text-neutral-gray-100 font-metropolis leading-trim rounded-full px-2 py-1 text-xs">
                {item.count}
              </span>
            )}

            {/* TODO: we will add it later */}
            {/* {(item.subscriptionType === 'premium' ||
              item.subscriptionType === 'enterprise') && <CrownIcon />} */}

            {item.rightIcon && (
              <span className={iconClasses}>{item.rightIcon}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};
