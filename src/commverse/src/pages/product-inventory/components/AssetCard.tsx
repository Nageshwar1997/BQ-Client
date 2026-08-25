import { useRef, useState, type MouseEvent } from 'react';
import Chip from '../../../components/Chip';
import type { Asset } from '../../../types';
import { MoreOptionsMenu } from '../../../components/MoreOptionsMenu';
import { Icon } from '@iconify/react';
import { VersaAIGradientFillIcon } from '../../../icons';
import { useNavigate } from 'react-router';
import { ASSET_BASE_URL } from '../../../env';

const VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'];

const getFileExtension = (value?: string) => {
  if (!value) return '';
  const cleanValue = value.split('?')[0].split('#')[0];
  const parts = cleanValue.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

const buildAssetUrlFromKey = (key?: string) => {
  if (!key) return '';
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  return `${ASSET_BASE_URL}/${key.replace(/^\/+/, '')}`;
};

const getKeyFromAssetUrl = (url?: string) => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    return decodeURIComponent(parsed.pathname.replace(/^\/+/, ''));
  } catch {
    return '';
  }
};

const formatUpdatedAt = (value: string | number | Date) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'DD Mmm, --:--';

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

const AssetCard = ({
  item,
  onDelete,
}: {
  item: Asset;
  onDelete?: (item: Asset) => void;
}) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const formatExt = getFileExtension(item.format);
  const imageExt = getFileExtension(item.image);
  const isVideo =
    VIDEO_EXTENSIONS.includes(formatExt) || VIDEO_EXTENSIONS.includes(imageExt);
  const formattedUpdatedAt = formatUpdatedAt(item.lastUpdated);

  const handleGenerate3DModel = () => {
    if (isVideo) return;

    const keyFromImageUrl = getKeyFromAssetUrl(item.image);
    const stableImageUrl =
      buildAssetUrlFromKey(item.imageKey) ||
      buildAssetUrlFromKey(keyFromImageUrl) ||
      item.image ||
      '';

    if (!stableImageUrl) {
      navigate('/versa-ai');
      return;
    }

    navigate('/versa-ai', {
      state: {
        prefillImageUrl: stableImageUrl,
        prefillImageFallbackUrl: item.image || stableImageUrl,
        prefillImageName: item.title,
      },
    });
  };

  const handlePlayClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    videoRef.current?.play();
  };

  return (
    <div className="border-neutral-gray-200 bg-neutral-gray-100 font-metropolis relative flex max-h-[350px] max-w-[250px] flex-col rounded-xl border">
      <div>
        {isVideo ? (
          <div className="relative">
            <video
              ref={videoRef}
              src={item.image}
              className="h-37.5 w-full rounded-t-xl object-cover"
              // controls
              muted
              playsInline
              preload="metadata"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
            />
            {!isVideoPlaying && (
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center"
                onClick={handlePlayClick}
                aria-label="Play video"
              >
                <Icon
                  icon="solar:play-circle-bold"
                  className="size-13.5 cursor-pointer text-white"
                />
              </button>
            )}
          </div>
        ) : (
          <img
            src={item?.image}
            alt={item.title}
            className="h-37.5 w-full rounded-t-xl object-cover"
          />
        )}
        <div className="bg-neutral-gray-100 absolute top-2 right-2 cursor-pointer rounded-lg p-px">
          <MoreOptionsMenu
            menuItems={[
              ...(!isVideo
                ? [
                    {
                      label: 'Generate 3D Model',
                      icon: <VersaAIGradientFillIcon className="size-4" />,
                      variant: 'default' as const,
                      onClick: handleGenerate3DModel,
                    },
                  ]
                : []),
              {
                label: 'Delete',
                icon: 'solar:trash-bin-2-linear',
                variant: 'danger',
                onClick: () => onDelete?.(item),
              },
            ]}
            triggerClassName="size-7 p-2"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2.5 p-3">
        <div className="flex items-center justify-between gap-1">
          <div className="text-neutral-gray-600 min-w-14.25 truncate text-[10px]/[13px]">
            {formattedUpdatedAt}
          </div>
          <div className="flex items-center gap-1"></div>
        </div>
        {item.assetType === 'generatedImages' ? (
          <div>
            {item.section ? (
              <div className="flex items-center gap-2">
                <Chip
                  variant="gradient"
                  color="module-social"
                  text="AI Content"
                  leftIcon={<Icon icon="solar:magic-stick-3-linear" />}
                />
              </div>
            ) : (
              <div className="bg-neutral-gray-100 text-neutral-gray-600 max-w-[130px] rounded-[4px] border border-gray-300 px-1 py-[2px] text-[10px]/[13px] font-semibold">
                No experience created
              </div>
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default AssetCard;
