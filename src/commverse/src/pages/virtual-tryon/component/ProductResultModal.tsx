import { Icon } from '@iconify/react';
import Modal from '../../../components/Modal';
import type { ButtonProps } from '../../../types';
import { useMemo, useState } from 'react';
import Button from '../../../components/Button';

const getConfig = (type: 'success' | 'warning' | 'error') => {
  switch (type) {
    case 'success':
      return {
        icon: 'solar:check-circle-bold',
        color: 'text-green-500',
        bg: 'bg-ui-success-light',
      };
    case 'warning':
      return {
        icon: 'solar:danger-circle-bold',
        color: 'text-yellow-500',
        bg: 'bg-ui-warning-light',
      };
    case 'error':
      return {
        icon: 'solar:danger-circle-bold',
        color: 'text-red-500',
        bg: 'bg-ui-error-light',
      };
  }
};

const ProductResultModal = ({
  open = true,
  onClose = () => {},
  type = 'success',
  product,
  title,
  description,
  buttons,
  showLeftSection = true,
  showCloseIcon = true,
  className = '',
}: {
  open?: boolean;
  onClose?: () => void;
  type?: 'success' | 'warning' | 'error';
  product: { title: string; description: string; price: number; image: string };
  title: string;
  description?: string;
  buttons: ButtonProps | ButtonProps[];
  showLeftSection?: boolean;
  showCloseIcon?: boolean;
  className?: string;
}) => {
  const CSS_CONFIG = getConfig(type);
  const BUTTONS = useMemo(() => {
    if (!Array.isArray(buttons)) {
      return [buttons];
    }
    return buttons;
  }, [buttons]);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  return (
    <Modal
      open={open}
      onClose={onClose}
      className={`font-metropolis [&>div]:h-full [&>div]:max-h-[65vh] ${
        showLeftSection ? '[&>div]:max-w-260' : '[&>div]:w-fit!'
      }`}
    >
      <div className="flex h-full w-full items-center justify-center">
        {showLeftSection && (
          <div className="flex h-full w-1/2 items-center justify-center bg-[url('/assets/images/auth-bg.webp')] bg-cover bg-center bg-no-repeat">
            <div className="border-neutral-gray-200 bg-neutral-gray-100 flex w-full max-w-xs flex-col items-start justify-center gap-3 rounded-3xl border shadow-[0_290px_81px_0_rgba(56,75,159,0.00),0_186px_74px_0_rgba(56,75,159,0.01),0_104px_63px_0_rgba(56,75,159,0.05),0_46px_46px_0_rgba(56,75,159,0.09),0_12px_26px_0_rgba(56,75,159,0.10)]">
              <div className="relative h-75 w-full overflow-hidden rounded-t-[23px]">
                <img
                  src={product.image}
                  alt="Image"
                  className="absolute inset-0 z-1 size-full object-cover"
                  onLoad={() => setIsImageLoaded(true)}
                />
                {!isImageLoaded && (
                  <div className="bg-neutral-gray-300 absolute inset-0 z-2 size-full animate-pulse rounded-xl" />
                )}
              </div>
              <div className="flex flex-col gap-3 p-6">
                <div className="space-y-1">
                  <h2 className="line-clamp-3 leading-4.75 font-semibold text-neutral-900">
                    {product.title}
                  </h2>
                  <p className="text-neutral-gray-600 line-clamp-4 text-[10px]/[13.5px]">
                    {product.description}
                  </p>
                </div>
                {!!product.price && (
                  <div className="space-y-1">
                    <p className="text-neutral-gray-600 text-[10px]/[13.5px] font-medium">
                      PRICE
                    </p>
                    <p className="leading[19.2px] font-semibold text-neutral-900">
                      ₹{product.price}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div
          className={`flex h-full flex-col items-center p-10 ${
            showLeftSection ? 'w-1/2' : 'w-full'
          } ${className}`}
        >
          <div className="flex w-full flex-1 items-center justify-center">
            <div className="flex w-full max-w-md flex-col items-center gap-4">
              <div className={`w-fit rounded-full p-2 ${CSS_CONFIG.bg}`}>
                <Icon
                  icon={CSS_CONFIG.icon}
                  className={`${CSS_CONFIG.color} size-20`}
                />
              </div>
              <h3 className="text-neutral-gray-900 text-center text-2xl/7 font-bold">
                {title}
              </h3>
              {description && (
                <p className="text-neutral-gray-600 text-center text-sm/[17.5px]">
                  {description}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full max-w-md items-center justify-center gap-2 [&>button]:rounded-lg!">
            {BUTTONS.map((button, index) => (
              <Button
                key={index}
                {...button}
                variant={button.variant ?? 'secondary'}
                className={`h-10! ${button.className}`}
              />
            ))}
          </div>
        </div>
        {showCloseIcon && (
          <Icon
            icon="lucide:x"
            className="absolute top-10 right-10 size-6 cursor-pointer"
            onClick={onClose}
          />
        )}
      </div>
    </Modal>
  );
};

export default ProductResultModal;
