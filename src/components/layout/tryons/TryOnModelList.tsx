import { TRYON_MODEL_IMAGES } from '@/constants/tryon.constants';

import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';

interface ITryOnModelListProps {
  // Vertical for the desktop sidebar (TryOnSidebar.tsx); horizontal for the mobile "Models"
  // bottom sheet (TryOnBottomSheet.tsx via TryOnModal) - same list, same styling either way.
  direction: 'horizontal' | 'vertical';
  mode: 'live' | 'upload';
  previewImageUrl: string | null;
  onModelSelect: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

const TryOnModelList = ({
  direction,
  mode,
  previewImageUrl,
  onModelSelect,
  disabled = false,
  className = '',
}: ITryOnModelListProps) => (
  <ScrollableGradientContainer
    direction={direction}
    className={`${direction === 'vertical' ? '[&>div]:justify-start' : ''} ${disabled ? 'opacity-50' : ''} ${className}`}
  >
    {TRYON_MODEL_IMAGES.map((url) => (
      <button
        key={url}
        type="button"
        disabled={disabled}
        onClick={() => {
          onModelSelect(url);
        }}
        className={`aspect-square shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-colors duration-300 disabled:cursor-not-allowed ${
          direction === 'horizontal' ? 'size-20' : ''
        } ${
          mode === 'upload' && previewImageUrl === url
            ? 'border-primary'
            : 'border-primary/10 hover:border-primary/30'
        }`}
      >
        <img src={url} alt="Model" className="size-full object-cover" />
      </button>
    ))}
  </ScrollableGradientContainer>
);

export default TryOnModelList;
