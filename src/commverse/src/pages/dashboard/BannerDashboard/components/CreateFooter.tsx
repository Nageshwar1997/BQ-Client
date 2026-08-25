import { Icon } from '@iconify/react';
import Button from '../../../../components/Button';

type CreateFooterProps = {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonIcon: string;
  buttonBgColor: string;
  onButtonClick: () => void;
};

const CreateFooter = ({
  title,
  subtitle,
  buttonText,
  buttonIcon,
  buttonBgColor,
  onButtonClick,
}: CreateFooterProps) => {
  return (
    <section
      className="mt-6 flex w-full flex-col items-center gap-6 bg-white px-16 py-16 text-center"
      data-name="Create Footer"
      data-node-id="4858:363073"
    >
      <div className="flex w-full flex-col items-center gap-1">
        <h2 className="font-metropolis text-neutral-gray-800 text-[36px] leading-[120%] font-bold">
          {title}
        </h2>
        <p className="font-metropolis text-neutral-gray-700 text-[16px] leading-[120%] font-medium">
          {subtitle}
        </p>
      </div>

      <Button
        variant="primary"
        size="sm"
        className="border-overlay-light inline-flex! h-10 w-fit! items-center! justify-center! gap-[6px]! rounded-[8px]! border-2 px-4 py-[10px]! enabled:hover:opacity-95 enabled:active:opacity-90 [&>div]:gap-[6px] [&>div>span]:text-[14px] [&>div>span]:leading-[125%] [&>div>span]:font-semibold"
        style={{ backgroundColor: buttonBgColor }}
        leftIcon={<Icon icon={buttonIcon} className="size-5 text-white" />}
        content={buttonText}
        onClick={onButtonClick}
      />
    </section>
  );
};

export default CreateFooter;
