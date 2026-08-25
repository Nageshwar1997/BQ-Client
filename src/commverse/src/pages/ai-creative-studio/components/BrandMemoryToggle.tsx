import type { SelectedOption } from '../../../types';
import FilterDropdown from '../../../components/FilterDropdown';
import { Icon } from '@iconify/react';
import { ToggleSwitch } from '../../../components/ToggleSwitch';

// ─── Dropdown trigger className (Figma-matched) ───────────────────────────────

const ddCls =
  'w-full [&>button]:w-full [&>button]:min-w-0 [&>button]:bg-white [&>button]:rounded-[8px] [&>button]:border-0 [&>button]:p-2 [&>button]:text-[12px] [&>button]:leading-[15px] [&>button]:font-medium [&>button]:gap-2 [&>button]:h-auto [&>button]:hover:bg-white [&>button]:focus-visible:ring-0';

// ─── Props ────────────────────────────────────────────────────────────────────

type BrandMemoryToggleProps = {
  disabled?: boolean;
  isOn: boolean;
  options: SelectedOption[];
  selectedBrandId: string | null;
  onToggle: (isOn: boolean) => void;
  onBrandSelect: (brandId: string | null) => void;
  /** Optional callback fired when "Create New" footer action is tapped. */
  // onCreateNew?: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function BrandMemoryToggle({
  disabled = false,
  isOn,
  options,
  selectedBrandId,
  onToggle,
  onBrandSelect,
  // onCreateNew,
}: BrandMemoryToggleProps) {
  const handleToggle = (next: boolean) => {
    if (disabled) return;
    onToggle(next);
  };

  const selectedOption =
    options.find((option) => option.id === selectedBrandId) ?? options[0];

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-2">
      {/* ── Header row: label + toggle ── */}
      <div className="flex w-full shrink-0 items-center gap-2">
        <p className="shrink-0 text-[13px] leading-tight font-semibold whitespace-nowrap text-[#18181a]">
          Use Brand Memory
        </p>

        {/* Figma toggle — flipped vertically to match Figma design */}
        <div
          className={`flex shrink-0 items-center justify-center ${
            disabled ? 'pointer-events-none opacity-50' : ''
          }`}
        >
          <ToggleSwitch isOn={isOn} onToggle={handleToggle} />
        </div>
      </div>

      {/* ── Brand dropdown — disabled when toggle is off or card is disabled ── */}
      <div className="flex shrink-0 items-start">
        <div className="w-[176px] max-w-full">
          {isOn && options.length > 0 && (
            <FilterDropdown
              className={ddCls}
              innerLabel={selectedOption?.label ?? 'Select Brand'}
              leftIcon={<Icon icon="lucide:brain" className="size-4" />}
              options={options}
              value={selectedOption?.id ?? null}
              menuWidth="176px"
              // TODO: Re-enable "Create New" once the brand-memory creation flow
              // is implemented for AI Creative Studio.
              // fitMenuToContent
              // footerActionLabel="Create New"
              // footerActionIcon={<Icon icon="lucide:plus" className="size-4" />}
              // onFooterAction={onCreateNew}
              // is implemented for AI Creative Studio using FilterDropdown's
              // built-in footer action props.
              onChange={(selected) => {
                const option = selected as SelectedOption | null;
                onBrandSelect(option?.id ?? null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
