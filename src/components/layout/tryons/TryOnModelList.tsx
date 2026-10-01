import type { TTryOnCategory } from '@beautinique/frontend-types';

import {
  TRYON_MODE_MAP,
  TRYON_MODEL_IMAGES_FACE,
  TRYON_MODEL_IMAGES_HAIR,
  TRYON_MODEL_IMAGES_HAND,
} from '@/constants/tryon-constants';
import type { TTryOnMode } from '@/types/tryon-types';

import ScrollableGradientContainer from '../containers/ScrollableGradientContainer';

// `/images/tryon/models/(face/hand/hair)/Central-Indian.webp` -> "Central Indian" - every button below used to
// share the exact same generic `alt="Model"`/no aria-label, so a screen reader announced every
// single one identically ("Model, button") with no way to tell them apart. The filenames
// themselves already carry a real, human-readable label (see the `TRYON_MODEL_IMAGES_*` sets) -
// deriving from that instead of hardcoding a parallel label list means it can never drift out of
// sync with the actual asset filenames.
const getModelLabel = (url: string): string => {
  const fileName = url.split('/').at(-1) ?? url;
  return fileName.replace(/\.\w+$/, '').replaceAll('-', ' ');
};

// LIP/FACE/EYE all track the same face mesh, so they share the face photo set - HAIR and NAIL get
// their own dedicated sets instead (a face photo has no hand in it for NAIL to detect, and isn't
// framed to show full hair length the way HAIR's own set is - see TRYON_MODEL_IMAGES_HAIR/
// TRYON_MODEL_IMAGES_HAND's own comment in constants/tryon-constants/index.ts). Written as a real
// `switch` (not a lookup object) so a 6th category added to `TTryOnCategory` without a case here
// is a TS error at the `never` default, not a silent fallback to the wrong photo set.
const getModelImages = (category: TTryOnCategory): string[] => {
  switch (category) {
    case 'HAIR':
      return TRYON_MODEL_IMAGES_HAIR;
    case 'NAIL':
      return TRYON_MODEL_IMAGES_HAND;
    case 'LIP':
    case 'FACE':
    case 'EYE':
      return TRYON_MODEL_IMAGES_FACE;
    default: {
      const exhaustiveCheck: never = category;
      throw new Error(`Unhandled TTryOnCategory: ${String(exhaustiveCheck)}`);
    }
  }
};

interface ITryOnModelListProps {
  // Vertical for the desktop sidebar (TryOnSidebar.tsx); horizontal for the mobile "Models"
  // bottom sheet (TryOnBottomSheet.tsx via TryOnModal) - same list, same styling either way.
  direction: 'horizontal' | 'vertical';
  category: TTryOnCategory;
  mode: TTryOnMode;
  previewImageUrl: string | null;
  onModelSelect: (url: string) => void;
  disabled?: boolean;
  className?: string;
}

const TryOnModelList = ({
  direction,
  category,
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
    {getModelImages(category).map((url) => {
      const label = getModelLabel(url);
      const selected = mode === TRYON_MODE_MAP.UPLOAD && previewImageUrl === url;

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
          className={`aspect-square shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 transition-colors duration-300 focus-visible:-outline-offset-1 disabled:cursor-not-allowed ${
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
