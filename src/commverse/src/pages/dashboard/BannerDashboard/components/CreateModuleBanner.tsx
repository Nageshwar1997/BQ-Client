import { Icon, type IconifyIcon } from '@iconify/react';
import type { ReactNode } from 'react';
import Button from '../../../../components/Button';

export interface CreateModuleBannerProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonIcon: IconifyIcon | string;
  heroIcon: IconifyIcon | string;
  // heroAssetUrl?: string;
  accentColor?: string;
  fillBackground: string;
  strokeBackground: string;
  buttonBgColor: string;
  onButtonClick?: () => void;
  className?: string;
  nodeId?: string;
  buttonNodeId?: string;
  heroNodeId?: string;
  buttonLeftIcon?: ReactNode;
}

const CreateModuleBanner = ({
  title,
  subtitle,
  buttonText,
  buttonIcon,
  heroIcon,
  // heroAssetUrl,
  accentColor,
  fillBackground,
  strokeBackground,
  buttonBgColor,
  onButtonClick,
  className = '',
  nodeId,
  buttonNodeId,
  heroNodeId,
  buttonLeftIcon,
}: CreateModuleBannerProps) => {
  const strokeStyle = {
    background: strokeBackground,
  };

  const fillStyle = {
    background: fillBackground,
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px z-0 rounded-[21px]"
        style={strokeStyle}
      />

      <div
        className="relative z-10 flex h-50 w-full items-center gap-2.5 overflow-hidden rounded-[20px] p-8"
        style={fillStyle}
        data-node-id={nodeId}
      >
        <div className="relative z-10 flex h-full min-h-px flex-1 flex-col justify-between">
          <div className="flex flex-col items-start gap-1">
            <h1 className="font-metropolis text-neutral-gray-800 text-[36px] leading-[120%] font-bold whitespace-nowrap">
              {title}
            </h1>
            <p className="font-metropolis text-neutral-gray-700 text-[16px] leading-[120%] font-medium">
              {subtitle}
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            className="border-overlay-light inline-flex! h-10 w-fit! items-center! justify-center! gap-1.5! rounded-lg! border-2 px-4 py-2.5! enabled:hover:opacity-95 enabled:active:opacity-90 [&>div]:gap-1.5 [&>div>span]:text-[14px] [&>div>span]:leading-[125%] [&>div>span]:font-semibold"
            style={{ backgroundColor: buttonBgColor }}
            leftIcon={
              buttonLeftIcon ?? (
                <Icon icon={buttonIcon} className="size-5 text-white" />
              )
            }
            content={buttonText}
            onClick={onButtonClick}
            data-node-id={buttonNodeId}
          />
        </div>

        <div
          className="pointer-events-none relative z-0 size-90 shrink-0 overflow-hidden"
          data-node-id={heroNodeId}
        >
          <Icon
            icon={heroIcon}
            className="absolute inset-0 size-full"
            style={{ color: accentColor ?? '#1D5FFF', opacity: 0.35 }}
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
};

export default CreateModuleBanner;
