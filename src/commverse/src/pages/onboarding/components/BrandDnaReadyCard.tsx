import { useMemo, type ReactNode } from 'react';

import { Icon } from '@iconify/react';

import type { OnboardingBrandKitData } from '../../../types/onboarding';
import { getRawImageUrl } from '../../../utils/utils';
import Button from '../../../components/Button';

type BrandDnaReadyCardProps = {
  onSave?: () => void;
  isSaving?: boolean;
  compact?: boolean;
  data?: OnboardingBrandKitData;
  rawData?: Record<string, unknown>;
  headerActions?: ReactNode;
  className?: string;
  hidePanelLabels?: boolean;
  layoutOnly?: boolean;
};

const Panel = ({
  className = '',
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => (
  <div
    className={`border-neutral-gray-300 overflow-hidden rounded-2xl border bg-[#fdfdff] ${className}`}
  >
    {children}
  </div>
);

const toRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const toString = (value: unknown, fallback = ''): string =>
  typeof value === 'string' ? value : fallback;

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];

const mapRawBrandDataToCardData = (
  rawData: Record<string, unknown> | undefined,
  fallback: OnboardingBrandKitData | undefined
): OnboardingBrandKitData => {
  const defaultData: OnboardingBrandKitData = fallback || {
    colors: { primary: [], secondary: [], others: [] },
    fonts: [],
    assets: { characters: [], poses: [], backgrounds: [] },
    vibe: {
      archetype: '',
      description: '',
      preferredTerms: [],
      forbiddenTerms: [],
      voice: {
        confident: 'moderate',
        energetic: 'moderate',
        professional: 'moderate',
        trust: 'moderate',
        friendly: 'moderate',
        authority: 'moderate',
      },
      writingStyle: null,
    },
  };

  if (!rawData) return defaultData;

  const typography = toRecord(rawData.typography);
  const primaryColors = toStringArray(rawData.primaryColors);
  const secondaryColors = toStringArray(rawData.secondaryColors);
  const vibeKeywords = toStringArray(rawData.vibeKeywords);
  const brandName = toString(rawData.brandName);
  const logoText = toString(rawData.logoText);
  const vibe = toString(rawData.vibe);
  const description = toString(typography.description);
  const heading = toString(typography.heading);
  const body = toString(typography.body);

  return {
    ...defaultData,
    colors: {
      primary: primaryColors.length
        ? primaryColors
        : defaultData.colors.primary,
      secondary: secondaryColors.length
        ? secondaryColors
        : defaultData.colors.secondary,
      others: defaultData.colors.others,
    },
    fonts:
      heading || body ? [heading, body].filter(Boolean) : defaultData.fonts,
    vibe: {
      ...defaultData.vibe,
      archetype: brandName || logoText || defaultData.vibe.archetype,
      description: vibe || description || defaultData.vibe.description,
      preferredTerms: vibeKeywords.length
        ? vibeKeywords
        : defaultData.vibe.preferredTerms,
    },
    profilePhoto: (rawData.profilePhoto as string) || defaultData.profilePhoto,
  };
};

const BrandDnaReadyCard = ({
  onSave,
  isSaving = false,
  compact = false,
  data,
  rawData,
  headerActions,
  className = '',
  hidePanelLabels = false,
  layoutOnly = false,
}: BrandDnaReadyCardProps) => {
  const resolvedData = useMemo(
    () => mapRawBrandDataToCardData(rawData, data),
    [rawData, data]
  );

  const {
    profilePhoto,
    title,
    primaryColors,
    secondaryColors,
    otherColors,
    visiblePalette,
  } = useMemo(() => {
    const rawDataRecord = toRecord(rawData);
    const rawDataProfile = toRecord(rawDataRecord.profile);
    const rawDataNestedProfile = toRecord(toRecord(rawDataRecord.data).profile);

    const photo =
      toString(resolvedData.profilePhoto).trim() ||
      toString(rawDataRecord.profilePhoto).trim() ||
      toString(rawDataProfile.profilePhoto).trim() ||
      toString(rawDataNestedProfile.profilePhoto).trim();

    const text = toString(rawData?.logoText).trim();
    const color = toString(rawData?.logoColor).trim();
    const currentTitle = resolvedData.vibe.archetype || 'Brand DNA';

    const palette = [
      ...resolvedData.colors.primary,
      ...resolvedData.colors.secondary,
      ...resolvedData.colors.others,
    ];

    return {
      profilePhoto: getRawImageUrl(photo),
      logoText: text,
      logoColor: color,
      title: currentTitle,
      badgeLetter: currentTitle.charAt(0).toUpperCase(),
      primaryColors: resolvedData.colors.primary.slice(0, compact ? 4 : 6),
      secondaryColors: resolvedData.colors.secondary.slice(0, compact ? 2 : 3),
      otherColors: resolvedData.colors.others.slice(0, compact ? 2 : 3),
      visiblePalette: palette.slice(0, compact ? 8 : 12),
    };
  }, [rawData, resolvedData, compact]);

  // if (import.meta.env.DEV && rawData) {
  //   console.log('[onboarding] BrandDnaReadyCard rawData', rawData);
  // }

  return (
    <div
      className={`border-neutral-gray-300 font-metropolis w-full rounded-3xl border bg-white p-6 ${className}`}
    >
      {!compact && (
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Icon
              icon="lucide:brain"
              className="text-neutral-gray-900 size-7"
            />
            <h3 className="text-neutral-gray-900 text-2xl leading-tight font-semibold">
              Your Brand DNA is Ready!
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {headerActions}
            <Button
              variant="primary"
              content="Save"
              onClick={onSave}
              isLoading={isSaving}
              disabled={isSaving}
              className="w-fit!"
            />
          </div>
        </div>
      )}

      {layoutOnly ? (
        <div className="grid h-[420px] grid-cols-[1.15fr_1fr_1fr_1.15fr] grid-rows-[1fr_0.92fr_0.64fr] gap-4">
          <Panel className="col-start-1 row-start-1" />
          <Panel className="col-start-1 row-span-2 row-start-2" />

          <Panel className="col-start-2 row-start-1" />
          <Panel className="col-start-3 row-start-1" />

          <Panel className="bg-neutral-gray-150/30 col-span-2 col-start-2 row-start-2 flex items-center justify-center p-4">
            <div className="text-neutral-gray-900 flex h-full w-full items-center justify-center">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={`${title} logo`}
                  className="h-20 w-auto object-contain"
                />
              ) : (
                <span className="text-neutral-gray-900 text-[48px] leading-none font-semibold tracking-[0.16em]">
                  {title}
                </span>
              )}
            </div>
          </Panel>

          <Panel className="col-start-2 row-start-3" />
          <Panel className="col-start-3 row-start-3" />

          <Panel className="col-start-4 row-span-3 row-start-1" />
        </div>
      ) : (
        <div
          className={`grid ${
            compact ? 'h-[320px]' : 'h-[420px]'
          } grid-cols-[1.15fr_1fr_1fr_1.15fr] grid-rows-[1fr_0.9fr_1fr] gap-3`}
        >
          <Panel className="col-start-1 row-span-3 p-4">
            {!hidePanelLabels && (
              <div className="text-neutral-gray-600 mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase">
                Primary Colors
              </div>
            )}
            <div
              className={`${
                hidePanelLabels ? 'mt-0' : 'mt-3'
              } flex flex-wrap gap-2`}
            >
              {primaryColors.map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="size-8 rounded-full border border-black/5 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </Panel>

          <Panel className="col-start-2 row-start-1 p-4">
            {!hidePanelLabels && (
              <div className="text-neutral-gray-600 text-[11px] font-semibold tracking-[0.18em] uppercase">
                Secondary
              </div>
            )}
            <div
              className={`${
                hidePanelLabels ? 'mt-0' : 'mt-3'
              } flex flex-wrap gap-2`}
            >
              {secondaryColors.map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="size-7 rounded-full border border-black/5 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </Panel>

          <Panel className="col-start-3 row-start-1 p-4">
            {!hidePanelLabels && (
              <div className="text-neutral-gray-600 text-[11px] font-semibold tracking-[0.18em] uppercase">
                Other
              </div>
            )}
            <div
              className={`${
                hidePanelLabels ? 'mt-0' : 'mt-3'
              } flex flex-wrap gap-2`}
            >
              {otherColors.map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="size-7 rounded-full border border-black/5 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </Panel>

          <Panel className="bg-neutral-gray-150/30 col-span-2 col-start-2 row-start-2 flex items-center justify-center p-4">
            <div className="text-neutral-gray-900 flex items-center gap-4">
              <img
                src={profilePhoto}
                alt={`${title} logo`}
                className="size-full object-cover"
              />
            </div>
          </Panel>

          <Panel className="col-span-2 col-start-2 row-start-3 p-4">
            {!hidePanelLabels && (
              <div className="text-neutral-gray-600 text-[11px] font-semibold tracking-[0.18em] uppercase">
                Full Palette
              </div>
            )}
            <div
              className={`${
                hidePanelLabels ? 'mt-0' : 'mt-3'
              } flex flex-wrap gap-2`}
            >
              {visiblePalette.map((color, index) => (
                <span
                  key={`${color}-${index}`}
                  className="size-6 rounded-full border border-black/5"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </Panel>

          <Panel className="col-start-4 row-span-3 p-4">
            {!hidePanelLabels && (
              <div className="text-neutral-gray-600 mb-4 text-[11px] font-semibold tracking-[0.18em] uppercase">
                Brand Vibe
              </div>
            )}
            <div className="text-neutral-gray-700 text-[13px] leading-relaxed">
              <p
                className={
                  hidePanelLabels ? 'line-clamp-14' : 'line-clamp-12'
                }
              >
                {resolvedData.vibe.description ||
                  'Your brand DNA captures the unique essence of your identity, from visual style to core messaging.'}
              </p>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
};

export default BrandDnaReadyCard;
