import { Icon } from '@iconify/react';

interface PromptSuggestionProps {
  prompt: string;
  isSelected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  previewImages?: readonly string[];
}

const PREVIEW_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Crect width='28' height='28' rx='4' fill='%23D9D9D9'/%3E%3C/svg%3E";

export function PromptSuggestion({
  prompt,
  isSelected = false,
  onClick,
  disabled = false,
  className = '',
  previewImages,
}: PromptSuggestionProps) {
  const showPreview = Array.isArray(previewImages);
  const previewSlots = showPreview
    ? Array.from({ length: 3 }, (_, index) => ({
        src: previewImages[index] || PREVIEW_PLACEHOLDER,
        left: index * 12,
      }))
    : [];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`bg-neutral-gray-200 flex min-h-10 w-full items-start gap-1 rounded-lg border px-3 py-2 text-left transition-colors ${
        isSelected
          ? 'border-neutral-gray-900'
          : 'border-neutral-gray-400 enabled:hover:border-neutral-gray-500'
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} ${className}`}
    >
      {showPreview && (
        <div className="relative h-7 w-13 shrink-0">
          {previewSlots.map(({ src, left }, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${src}-${index}`}
              aria-hidden="true"
              className="border-neutral-gray-300 absolute top-0 size-7 rounded border object-cover shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
              style={{ left: `${left}px` }}
              onError={(event) => {
                const target = event.currentTarget;
                if (target.src === PREVIEW_PLACEHOLDER) return;
                target.src = PREVIEW_PLACEHOLDER;
              }}
            />
          ))}
        </div>
      )}

      <p className="text-neutral-gray-900 line-clamp-2 flex-1 text-[10px] leading-[1.35] font-normal first-letter:capitalize">
        {prompt}
      </p>

      <Icon
        icon="solar:arrow-right-up-linear"
        className={`size-5 shrink-0 ${
          isSelected ? 'text-neutral-gray-900' : 'text-neutral-gray-500'
        }`}
      />
    </button>
  );
}
