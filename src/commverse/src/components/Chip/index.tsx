import type { ReactNode } from 'react';
import type { ChipPosition, ChipVariant } from '../../types';
import { colorMap } from '../../lib/utils';
const baseStyles =
  'flex items-center gap-1 px-1 py-0.75 text-[10px] font-semibold rounded cursor-pointer font-metropolis! disabled:cursor-not-allowed overflow-hidden leading-none';

const variantStyles: Record<ChipVariant, string> = {
  primary:
    'bg-brand text-neutral-gray-100 border border-overlay-light enabled:hover:bg-brand-hover enabled:active:bg-brand-pressed disabled:opacity-30',
  secondary:
    'bg-neutral-gray-300 text-neutral-gray-900 enabled:hover:bg-neutral-gray-400 enabled:active:bg-neutral-gray-500 disabled:bg-neutral-gray-200 disabled:!text-neutral-gray-400',
  tertiary:
    'bg-neutral-gray-900 text-neutral-gray-100 enabled:hover:bg-neutral-gray-800 enabled:active:bg-neutral-gray-700 disabled:bg-neutral-gray-600 disabled:text-neutral-gray-500',
  ghost:
    'bg-neutral-gray-100 text-neutral-gray-900 disabled:text-neutral-gray-200',
  outline:
    'bg-neutral-gray-100 text-neutral-gray-900 border border-neutral-gray-900 disabled:text-neutral-gray-200 disabled:border-neutral-gray-200',
  'outline-light':
    'bg-neutral-gray-100 text-neutral-gray-600 border border-neutral-gray-300 disabled:text-neutral-gray-200 disabled:border-neutral-gray-200',
  gradient: 'bg-gradient-versa text-neutral-gray-100  disabled:opacity-30',
  overlay: 'bg-neutral-gray-900/50 text-neutral-gray-100 disabled:opacity-30',
};

const positionClasses: Record<ChipPosition, string> = {
  top: 'absolute bottom-full left-1/2 -translate-x-1/2 mb-2',
  right: 'absolute left-full top-1/2 -translate-y-1/2 ml-2',
  bottom: 'absolute top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'absolute right-full top-1/2 -translate-y-1/2 mr-2',
};

const getVariantClasses = (variant: ChipVariant, color?: string) => {
  if (variant !== 'gradient') return variantStyles[variant];
  const theme = color ? colorMap?.[color] : null;
  if (!theme) return variantStyles.gradient;
  return `bg-gradient-to-bl ${theme.from} to-neutral-gray-100 border ${theme.border} ${theme.text}`;
};

const Chip = ({
  text,
  className,
  position,
  leftIcon,
  rightIcon,
  variant = 'primary',
  color,
}: {
  text?: string;
  className?: string;
  position?: ChipPosition;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: ChipVariant;
  color?: string;
}) => {
  return (
    <span
      className={`${baseStyles} ${getVariantClasses(variant, color)} ${
        position ? positionClasses[position] : ''
      } ${className ?? ''}`}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}

      {text && <span className="truncate whitespace-nowrap">{text}</span>}

      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </span>
  );
};

export default Chip;
