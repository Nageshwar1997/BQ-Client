import { TRYON_MODEL_IMAGES } from '@/constants/tryon.constants';

import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';

// `/images/try-on/models/Central-Indian.webp` -> "Central Indian" - every button below used to
// share the exact same generic `alt="Model"`/no aria-label, so a screen reader announced every
// single one identically ("Model, button") with no way to tell them apart. The filenames
// themselves already carry a real, human-readable label (see TRYON_MODEL_IMAGES) - deriving from
// that instead of hardcoding a parallel label list means it can never drift out of sync with the
// actual asset filenames.
const getModelLabel = (url: string): string => {
  const fileName = url.split('/').at(-1) ?? url;
  return fileName.replace(/\.\w+$/, '').replaceAll('-', ' ');
};

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
    {TRYON_MODEL_IMAGES.map((url) => {
      const label = getModelLabel(url);
      const selected = mode === 'upload' && previewImageUrl === url;

      return (
        <button
          key={url}
          type="button"
          aria-label={`Try on with the ${label} model`}
          aria-pressed={selected}
          disabled={disabled}
          onClick={() => {
            onModelSelect(url);
          }}
          className={`aspect-square shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-colors duration-300 disabled:cursor-not-allowed ${
            direction === 'horizontal' ? 'size-20' : ''
          } ${selected ? 'border-primary' : 'border-primary/10 hover:border-primary/30'}`}
        >
          <img src={url} alt={label} className="size-full object-cover" />
        </button>
      );
    })}
  </ScrollableGradientContainer>
);

export default TryOnModelList;
