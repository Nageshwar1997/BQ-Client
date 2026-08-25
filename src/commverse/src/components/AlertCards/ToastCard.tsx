import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import type { ButtonProps } from '../../types';
import Button from '../Button';
import { useModelStore } from '../../lib/store';
import { Icon } from '@iconify/react';

type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'default'
  | 'custom'
  | 'loading';

export interface IToastCard {
  type: ToastType;
  className?: string;
  buttonProps?: ButtonProps;
  icon?: ReactNode;
  title?: string | ReactNode;
  description?: string;
  isClosable?: boolean;
  autoClose?: boolean;
  children?: ReactNode;
}

const cardConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        icon: (
          <Icon
            icon="solar:check-circle-linear"
            className="text-ui-success size-6"
          />
        ),
        containerClass: 'border-ui-success-light ',
        titleClass: 'text-ui-success',
      };
    case 'error':
      return {
        icon: (
          <Icon
            icon="solar:danger-triangle-linear"
            className="text-ui-error size-6"
          />
        ),
        containerClass: 'border-ui-error-light',
        titleClass: 'text-ui-error',
      };
    case 'warning':
      return {
        icon: (
          <Icon
            icon="solar:danger-triangle-linear"
            className="text-ui-warning size-6"
          />
        ),
        containerClass: 'border-ui-warning-light',
        titleClass: 'text-ui-warning',
      };
    case 'default':
      return {
        icon: (
          <Icon
            icon="solar:info-circle-outline"
            className="text-neutral-gray-900 size-6"
          />
        ),
        containerClass: 'border-neutral-gray-400',
        titleClass: 'text-neutral-gray-900',
      };
    case 'loading':
      return {
        icon: (
          <Icon
            icon="quill:loading-spin"
            className="text-neutral-gray-900 size-6 animate-spin"
          />
        ),
        containerClass: 'border-neutral-gray-400',
        titleClass: 'text-neutral-gray-900',
      };
    default:
      return null;
  }
};

const ToastCard = ({
  className = '',
  type,
  title,
  description,
  icon,
  buttonProps,
  isClosable = true,
  autoClose = true,
  children,
}: IToastCard) => {
  const { status } = useModelStore();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(true);
  const resolvedAutoClose = type === 'loading' ? false : autoClose;
  const resolvedIsClosable = type === 'loading' ? false : isClosable;

  const config = cardConfig(type);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setMounted(false);
      // if (status === 'invalid') {
      //   reset();
      // }
    }, 300); // match animation duration
  };

  useEffect(() => {
    if (status === 'invalid') {
      setVisible(true);
      setMounted(true);
    }
  }, [status]);

  useEffect(() => {
    // trigger slide in
    const enterTimer = setTimeout(() => setVisible(true), 50);

    if (!resolvedAutoClose) return () => clearTimeout(enterTimer);

    // auto close
    const closeTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimer);
    };
  }, [mounted, resolvedAutoClose]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed right-8 bottom-8 z-999999999999 transition-all duration-300 ease-in-out ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} shadow-toast-card bg-neutral-gray-100 flex w-[532px] min-w-sm items-center gap-2 rounded-xl border p-3 ${config?.containerClass ?? ''} ${className} `}
    >
      {icon ? icon : config?.icon}

      <div className="flex flex-1 items-center justify-between gap-2">
        <div className="flex flex-col">
          {title && (
            <p className={`text-sm font-semibold ${config?.titleClass ?? ''}`}>
              {title}
            </p>
          )}
          {description && (
            <p className="text-neutral-gray-600 text-xs">{description}</p>
          )}

          {children}
        </div>

        {buttonProps && (
          <Button
            variant="secondary"
            size="sm"
            {...buttonProps}
            className={`h-8! w-fit! py-3! leading-[17.5px] ${buttonProps?.className ?? ''}`}
          />
        )}
      </div>

      {resolvedIsClosable && (
        <Icon
          icon="lucide:x"
          className="text-neutral-gray-900 size-5 cursor-pointer"
          onClick={handleClose}
        />
      )}
    </div>
  );
};

export default ToastCard;
