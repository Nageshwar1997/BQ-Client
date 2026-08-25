import { Icon } from '@iconify/react';
import Chip from '../../../components/Chip';
import { MoreOptionsMenu } from '../../../components/MoreOptionsMenu';

type ExperienceCardStatus = 'published' | 'draft';

type ExperienceCardProps = {
  status: ExperienceCardStatus;
  imageUrl: string;
  title: string;
  updatedAt: string | number | Date;
  experienceType?: string;
  variant?: 'default' | 'compact';
  onEdit?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  onCopyLink?: () => void;
  onCopyEmbedCode?: () => void;
  onPublish?: () => void;
  onUnpublish?: () => void;
  onRename?: () => void;
};

const formatUpdatedAt = (value: string | number | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'DD Mmm';

  const parts = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
  }).formatToParts(date);

  const day = parts.find((part) => part.type === 'day')?.value ?? 'DD';
  const month = parts.find((part) => part.type === 'month')?.value ?? 'Mmm';

  return `${day} ${month}`;
};

const STATUS_CONFIG: Record<
  ExperienceCardStatus,
  { label: string; className: string }
> = {
  published: {
    label: 'Published',
    className: 'bg-blue-600 text-white',
  },
  draft: {
    label: 'Drafts',
    className: 'bg-gray-500 text-white',
  },
};

const spriteSize = 512 / 3;
const frames = 15;

const getExperienceChipConfig = (experienceType?: string) => {
  switch (experienceType) {
    case '3d_visualizer':
    case '3d-visualizer':
      return {
        text: '3D Visualizer',
        icon: 'lucide:rotate-3d',
        color: 'module-3d-viz',
      };
    case 'ar_experience':
    case 'ar-experience':
      return {
        text: 'AR Experience',
        icon: 'solar:augmented-reality-linear',
        color: 'module-ar',
      };
    case '3d_configurator':
    case '3d-configurator':
    case 'configurator':
      return {
        text: 'Configurator',
        icon: 'solar:settings-linear',
        color: 'module-configurator',
      };
    case 'fashion_tryon':
    case 'beauty_tryon':
    case 'virtual-try-on':
      return {
        text: 'Virtual Try-On',
        icon: 'solar:users-group-rounded-linear',
        color: 'module-tryon',
      };
    case 'immersive_store':
    case 'immersive-store':
    case 'storefront':
      return {
        text: 'Storefront',
        icon: 'solar:shop-linear',
        color: 'module-storefront',
      };
    case 'video_ads':
    case 'video-ads':
      return {
        text: 'Video Ads',
        icon: 'solar:video-frame-linear',
        color: 'module-video',
      };
    default:
      return {
        text: '3D Visualizer',
        icon: 'lucide:rotate-3d',
        color: 'module-3d-viz',
      };
  }
};

const ExperienceCard = ({
  status,
  imageUrl,
  title,
  updatedAt,
  experienceType,
  // variant,
  onEdit,
  onDelete,
  onPreview,
  onCopyLink,
  // onCopyEmbedCode,
  // onPublish,
  onRename,
  onUnpublish,
}: ExperienceCardProps) => {
  const statusConfig = STATUS_CONFIG[status];
  // const isCompact = variant === 'compact';
  const isCompact = true;
  const formattedUpdatedAt = formatUpdatedAt(updatedAt);
  const experienceChip = getExperienceChipConfig(experienceType);

  return (
    <div
      className={
        isCompact
          ? 'group border-neutral-gray-200 bg-neutral-gray-100 relative rounded-[12px] border'
          : 'group relative rounded-2xl bg-white shadow-md transition-transform duration-200 ease-in-out hover:shadow-lg'
      }
    >
      <div
        className={
          isCompact
            ? "relative flex h-50 items-center justify-center overflow-hidden rounded-t-[11px] bg-[#EFF0F6] bg-[url('/assets/images/dotGrid.webp')] bg-cover"
            : 'relative flex h-50 items-center justify-center overflow-hidden rounded-t-2xl bg-[#f0f0f0]'
        }
      >
        <div className="absolute top-[9px] left-[9px] flex items-center gap-1">
          <Chip
            text={statusConfig.label}
            leftIcon={
              status === 'published' ? (
                <Icon icon="lucide:rocket" className="h-3 w-3" />
              ) : (
                <Icon icon="solar:document-add-linear" className="h-3 w-3" />
              )
            }
            className={`px-1 py-0.5 text-[10px] leading-[13.5px] font-semibold ${statusConfig.className}`}
          />
        </div>

        {imageUrl || !experienceType?.includes('tryon') ? (
          <div
            className="group-hover:animate-ghost h-full w-42 scale-145 bg-size-[13000px_200px] bg-left bg-no-repeat"
            style={
              {
                backgroundSize: `${spriteSize * frames}px ${spriteSize}px`,
                backgroundImage: `url(${imageUrl})`,
                backgroundPositionY: '50%',
                ['--to-x']: `${-(spriteSize * frames)}px`,
                ['--from-x']: `-${0}px`,
                ['--to-y']: `50%`,
                ['--from-y']: `50%`,
                ['--frameRate']: `steps(${frames})`,
              } as React.CSSProperties
            }
          />
        ) : (
          <img
            src="/assets/images/tryons-exp.webp"
            alt={title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="absolute top-2.5 right-2.5">
        <MoreOptionsMenu
          menuClassName="w-40"
          menuItems={
            status === 'published'
              ? [
                  {
                    label: 'Preview',
                    onClick: onPreview,
                    icon: 'solar:arrow-right-up-linear',
                  },
                  {
                    label: 'Copy Link',
                    onClick: onCopyLink,
                    icon: 'solar:copy-linear',
                  },
                  {
                    label: 'Edit',
                    onClick: onEdit,
                    icon: 'solar:pen-new-square-linear',
                  },
                  {
                    label: 'Rename',
                    onClick: onRename,
                    icon: 'solar:pen-linear',
                  },
                  {
                    label: 'Unpublish',
                    onClick: onUnpublish,
                    icon: 'solar:eye-closed-linear',
                    variant: 'danger',
                    showDividerAbove: true,
                  },
                  {
                    label: 'Delete',
                    onClick: onDelete,
                    icon: 'solar:trash-bin-2-linear',
                    variant: 'danger',
                  },
                ]
              : [
                  // {
                  //   label: 'Publish',
                  //   onClick: onPublish,
                  //   icon: 'lucide:rocket',
                  //   menuItemClassName: 'text-brand!',
                  // },
                  {
                    label: 'Edit',
                    onClick: onEdit,
                    icon: 'solar:pen-new-square-linear',
                  },
                  {
                    label: 'Rename',
                    onClick: onRename,
                    icon: 'solar:pen-linear',
                  },
                  {
                    label: 'Delete',
                    onClick: onDelete,
                    icon: 'solar:trash-bin-2-linear',
                    variant: 'danger',
                    showDividerAbove: true,
                  },
                ]
          }
        />
      </div>

      <div className={isCompact ? 'px-3 py-3' : 'space-y-2.5 px-4 pt-3.5 pb-4'}>
        <div>
          <h3
            className={
              isCompact
                ? 'font-metropolis text-neutral-gray-900 truncate text-[14px] leading-[125%] font-semibold'
                : 'truncate text-base leading-snug font-semibold text-gray-900'
            }
          >
            {title}
          </h3>
          <p
            className={
              isCompact
                ? 'font-metropolis text-neutral-gray-600 mt-0.5 text-[10px] leading-[135%] font-normal'
                : 'mt-0.5 text-xs text-gray-400'
            }
          >
            Last updated on {formattedUpdatedAt}
          </p>
        </div>
        <Chip
          variant="gradient"
          leftIcon={<Icon icon={experienceChip.icon} className="h-3 w-3" />}
          className="[&>span:nth-child(2)]:text-neutral-gray-900 w-fit!"
          color={experienceChip.color}
          text={experienceChip.text}
        />
      </div>
    </div>
  );
};

export default ExperienceCard;
