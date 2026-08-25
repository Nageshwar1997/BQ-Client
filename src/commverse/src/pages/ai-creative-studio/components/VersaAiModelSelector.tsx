import { useEffect, useRef, useState, type JSX } from 'react';
import { createPortal } from 'react-dom';
import { useUser } from '../context/UserContext';
// import svgPaths from "../../imports/svg-mz869oba5i"
import svgPaths from '../imports/svg-mz869oba5i';
import { VersaAIGradientFillIcon } from '../../../icons';

// ─── Versa AI sparkle icon (20 px, gradient) ────────────────────────────────
function VersaIcon({ id }: { id: string }) {
  const gradId = `versa-grad-${id}`;
  return (
    <div className="relative h-[20px] w-[20.006px] shrink-0">
      <svg
        className="absolute block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20.006 20"
      >
        <path d={svgPaths.p1fa3bff2} fill={`url(#${gradId})`} />
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id={gradId}
            x1="3.12153"
            x2="24.512"
            y1="-2.98701"
            y2="6.54401"
          >
            <stop stopColor="#00E5D1" />
            <stop offset="0.350079" stopColor="#25ADF9" />
            <stop offset="1" stopColor="#2553F8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── Circular check icon (20 px) ─────────────────────────────────────────────
function CircularCheck() {
  return (
    <div className="relative size-[20px] shrink-0 overflow-clip">
      <div className="absolute inset-[8.33%]">
        <div className="absolute inset-[-3.75%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 17.9167 17.9167"
          >
            <circle
              cx="8.95833"
              cy="8.95833"
              r="8.33333"
              stroke="#18181A"
              strokeWidth="1.25"
            />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[39.58%_35.42%]">
        <div className="absolute inset-[-15%_-10.71%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 7.08333 5.41667"
          >
            <path
              d={svgPaths.p22b48b80}
              stroke="#18181A"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.25"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Chevron down icon (20 px) ────────────────────────────────────────────────
function ChevronDown({ open }: { open: boolean }) {
  return (
    <div
      className={`relative size-[20px] shrink-0 overflow-clip transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <div className="absolute inset-[37.5%_20.83%]">
        <div className="absolute inset-[-12.5%_-5.36%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 15.5 7.50001"
          >
            <path
              d={svgPaths.p3ac25180}
              stroke="#1C274C"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ─── Plan chips ───────────────────────────────────────────────────────────────

function FastChip() {
  return (
    <div className="flex shrink-0 items-center justify-center gap-[2px] rounded-[4px] bg-[#eaebf1] px-[4px] py-[2px]">
      <p className="relative shrink-0 text-[10px] leading-[1.35] font-semibold whitespace-nowrap text-[#18181a]">
        FAST
      </p>
    </div>
  );
}

function TurboChip() {
  return (
    <div className="flex shrink-0 items-center justify-center gap-[2px] rounded-[4px] bg-[#18181a] px-[4px] py-[2px]">
      <p className="relative shrink-0 text-[10px] leading-[1.35] font-semibold whitespace-nowrap text-white">
        TURBO
      </p>
    </div>
  );
}

function UltraChip() {
  return (
    <div className="relative flex shrink-0 items-center justify-center gap-[2px] overflow-hidden rounded-[4px] px-[4px] py-[2px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[4px]"
      >
        <div className="absolute inset-0 rounded-[4px] bg-[#ffa00f]" />
        <div className="absolute inset-0 rounded-[4px] bg-gradient-to-b from-[rgba(255,255,255,0.3)] to-[rgba(255,255,255,0)] mix-blend-overlay" />
      </div>
      <p className="relative shrink-0 text-[10px] leading-[1.35] font-semibold whitespace-nowrap text-[#18181a]">
        ULTRA
      </p>
    </div>
  );
}

// ─── Model definitions ────────────────────────────────────────────────────────

type ModelTier = 'fast' | 'turbo' | 'ultra';

interface ModelDef {
  tier: ModelTier;
  description: string;
  requiredPlan: ModelTier;
  Chip: () => JSX.Element;
}

const MODELS: ModelDef[] = [
  {
    tier: 'fast',
    description: 'Instant images & rapid video drafts',
    requiredPlan: 'fast',
    Chip: FastChip,
  },
  {
    tier: 'turbo',
    description: 'Polished visuals with smooth motion',
    requiredPlan: 'turbo',
    Chip: TurboChip,
  },
  {
    tier: 'ultra',
    description: 'Cinematic, photoreal output with maximum detail',
    requiredPlan: 'ultra',
    Chip: UltraChip,
  },
];

const PLAN_RANK: Record<ModelTier, number> = { fast: 0, turbo: 1, ultra: 2 };

const toModelTier = (value: unknown): ModelTier => {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();

  if (normalized === 'ultra' || normalized.includes('business')) {
    return 'ultra';
  }
  if (normalized === 'turbo' || normalized.includes('pro')) {
    return 'turbo';
  }
  if (normalized === 'fast' || normalized.includes('free')) {
    return 'fast';
  }
  return 'fast';
};

function canAccess(userPlan: unknown, required: ModelTier) {
  return PLAN_RANK[toModelTier(userPlan)] >= PLAN_RANK[toModelTier(required)];
}

// ─── Dropdown row (Figma "Default" VersaAiModels) ────────────────────────────

function ModelRow({
  model,
  isSelected,
  accessible,
  onSelect,
}: {
  model: ModelDef;
  isSelected: boolean;
  accessible: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      disabled={!accessible}
      className={`relative flex w-full shrink-0 flex-col content-stretch items-start justify-center gap-[8px] rounded-[8px] bg-white p-[8px] text-left transition-colors ${
        accessible
          ? 'cursor-pointer hover:bg-[#f7f8fa]'
          : 'cursor-not-allowed opacity-40'
      }`}
    >
      {/* Title row */}
      <div className="relative flex w-full shrink-0 content-stretch items-end justify-between">
        {/* Left: icon + label + chip */}
        <div className="relative flex min-h-px min-w-px flex-1 content-stretch items-center gap-[4px]">
          <VersaAIGradientFillIcon className="size-5!" />
          <p className="relative shrink-0 text-[14px] leading-[1.25] font-semibold whitespace-nowrap text-[#18181a] not-italic">
            Versa AI 2.0
          </p>
          <model.Chip />
        </div>
        {/* Right: circular check if selected */}
        {isSelected && <CircularCheck />}
      </div>
      {/* Description */}
      <p className="relative shrink-0 text-[10px] leading-[1.35] font-normal whitespace-nowrap text-[#797a80] not-italic">
        {model.description}
      </p>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface VersaAiModelSelectorProps {
  disabled?: boolean;
  className?: string;
}

export function VersaAiModelSelector({
  disabled = false,
  className = '',
}: VersaAiModelSelectorProps) {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ModelTier>(toModelTier(user?.plan));
  const [dropdownPos, setDropdownPos] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate and store the dropdown position from trigger rect
  const updatePos = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setDropdownPos({
      // Open upward: bottom of dropdown aligns to 6px above trigger top
      top: rect.top - 6,
      left: rect.left,
    });
  };

  // Close on outside click (pointer hits neither trigger nor dropdown)
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      )
        return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Reposition on scroll or resize while open
  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePos();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open]);

  // Clamp selected to accessible tier when user plan changes
  useEffect(() => {
    if (!canAccess(user?.plan, selected)) {
      setSelected(toModelTier(user?.plan));
    }
  }, [user?.plan, selected]);

  const toggle = () => {
    if (disabled) return;
    updatePos();
    setOpen((v) => !v);
  };

  const select = (tier: ModelTier) => {
    if (!canAccess(user?.plan, tier)) return;
    setSelected(tier);
    setOpen(false);
  };

  const selectedModel = MODELS.find((m) => m.tier === selected) ?? MODELS[0];
  const SelectedChip = selectedModel?.Chip ?? FastChip;

  return (
    <div className={`relative ${className}`}>
      {/* ── Trigger button (Figma "Button" type) ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="relative flex h-[32px] w-[220px] shrink-0 content-stretch items-center justify-between gap-[4px] rounded-[8px] bg-white px-[8px] transition-colors hover:bg-[#f0f1f7] focus-visible:ring-2 focus-visible:ring-[#002DFF]/30 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-55"
      >
        {/* Left: icon + label + chip */}
        <div className="relative flex min-h-px min-w-px flex-1 content-stretch items-center gap-[4px]">
          <VersaIcon id="trigger" />
          <p className="relative shrink-0 text-[14px] leading-[1.25] font-semibold whitespace-nowrap text-[#18181a] not-italic">
            Versa AI 2.0
          </p>
          <SelectedChip />
        </div>
        {/* Chevron */}
        <ChevronDown open={open} />
      </button>

      {/* ── Dropdown portal (renders at document.body to avoid layout shift) ── */}
      {open &&
        dropdownPos &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            aria-label="Select AI model"
            style={{
              position: 'fixed',
              // Anchor bottom of dropdown 6px above the trigger's top edge
              top: dropdownPos.top - /* dropdown height estimate */ 0,
              left: dropdownPos.left,
              // Use transform to shift up by 100% of own height
              transform: 'translateY(-100%)',
              zIndex: 9999,
            }}
            className="flex w-[270px] flex-col items-start gap-[4px] rounded-[8px] bg-white p-[4px]"
          >
            {/* Border + shadow overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[8px] border border-solid border-[#f0f1f7] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)]"
            />
            {MODELS.map((model) => {
              const accessible = canAccess(user?.plan, model.requiredPlan);
              const isSelected = selected === model.tier;
              return (
                <ModelRow
                  key={model.tier}
                  model={model}
                  isSelected={isSelected}
                  accessible={accessible}
                  onSelect={() => select(model.tier)}
                />
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}
