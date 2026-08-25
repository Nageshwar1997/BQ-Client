import { Icon } from '@iconify/react';
import type { FC } from 'react';

interface TemplateCardProps {
  title: string;
  imageSrc: string;
  isSelected?: boolean;
  onClick?: () => void;
}

const TemplateCard: FC<TemplateCardProps> = ({
  title,
  imageSrc,
  isSelected = false,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`focus-visible:ring-brand relative flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border transition-colors focus-visible:ring-2 focus-visible:outline-none ${
        isSelected
          ? 'border-neutral-gray-900 bg-neutral-gray-400'
          : 'border-neutral-gray-400 bg-neutral-gray-200 hover:border-neutral-gray-500'
      }`}
    >
      <div className="bg-neutral-gray-150 relative aspect-square w-full">
        <img
          src={imageSrc}
          alt={`${title} template preview`}
          className="size-full object-cover"
        />
        {isSelected && (
          <span className="bg-neutral-gray-100 absolute top-2.25 right-2.25 flex size-6 items-center justify-center rounded-full">
            <Icon
              icon="lucide:check"
              className="text-neutral-gray-900 size-4"
            />
          </span>
        )}
      </div>
      <div className="flex w-full items-center justify-center py-2">
        <span className="text-neutral-gray-700 text-sm/tight font-medium">
          {title}
        </span>
      </div>
    </button>
  );
};

export default TemplateCard;
