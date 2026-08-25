import { type FC } from 'react';
import type { ButtonVariant, ButtonProps, ButtonSize } from '../../types';

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'rounded-lg! text-sm! px-2.75 py-1.75',
  md: 'rounded-xl! text-base! px-4 py-3',
};
const baseStyles =
  'flex items-center justify-center gap-2 text-base enabled:cursor-pointer! font-metropolis! font-semibold disabled:cursor-not-allowed w-full h-auto leading-5 outline-none';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-neutral-gray-100 border border-overlay-light w-fit enabled:hover:bg-brand-hover enabled:active:bg-brand-pressed disabled:opacity-30',
  secondary:
    'bg-neutral-gray-300 text-neutral-gray-900 enabled:hover:bg-neutral-gray-400 enabled:active:bg-neutral-gray-500 disabled:bg-neutral-gray-200 disabled:!text-neutral-gray-400',
  tertiary:
    'bg-neutral-gray-900 text-neutral-gray-100 enabled:hover:bg-neutral-gray-800 enabled:active:bg-neutral-gray-700 disabled:bg-neutral-gray-600 disabled:text-neutral-gray-500',
  ghost:
    'bg-neutral-gray-100 text-neutral-gray-900 disabled:text-neutral-gray-200',
  outline:
    'text-neutral-gray-900 border-[1.5px] border-neutral-gray-900 disabled:text-neutral-gray-200 disabled:border-neutral-gray-200',
  gradient:
    'relative bg-gradient-versa text-neutral-gray-100 before:absolute before:inset-0 before:rounded-[inherit] before:p-[1.5px] before:bg-clip-padding before:border-2 before:border-overlay-light before:pointer-events-none disabled:opacity-30',
  link: 'bg-transparent text-neutral-gray-700 enabled:hover:text-neutral-gray-800 enabled:active:text-neutral-gray-900 disabled:text-neutral-gray-400 p-0! w-fit! underline h-auto! font-medium!',
};

const Button: FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  content,
  className = '',
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  isLoading = false,
  disabled = false,
  ...rest
}) => {
  const isDisabled = isLoading || disabled;

  return (
    <button
      type={type}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={isDisabled}
      onClick={!isDisabled ? onClick : undefined}
      {...rest}
    >
      {isLoading ? (
        <div className="flex w-full min-w-0 items-center justify-center gap-2">
          <div
            className="text-primary inline-block size-5 animate-spin rounded-[999px] border-3 border-current border-t-transparent"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
          <span className="min-w-0 truncate whitespace-nowrap">{content}</span>
        </div>
      ) : (
        <div className="flex w-full min-w-0 items-center justify-center gap-2">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {content && (
            <span className="min-w-0 truncate whitespace-nowrap">
              {content}
            </span>
          )}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </div>
      )}
    </button>
  );
};

export default Button;
