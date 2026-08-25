import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';

import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import Modal from '../../../../components/Modal';
import type { OnboardingBrandKitData } from '../../../../types/onboarding';
import BrandDnaReadyCard from '../BrandDnaReadyCard';
import LoadingOverlay from '../LoadingOverlay';
import {
  LogoColorsPanel,
  type BrandColorCollectionData,
} from './LogoColorsPanel';
import { TypographyPanel } from './TypographyPanel';
import { VibePanel, type BrandVibeApiData } from './VibePanel';
import type { TabType } from './types';

const TABS: Array<{ id: TabType; label: string }> = [
  { id: 'colors', label: 'Logo & Colours' },
  { id: 'typography', label: 'Typography' },
  { id: 'vibe', label: 'Vibe' },
];

interface BrandOnboardingKitProps {
  data: OnboardingBrandKitData;
  rawData?: Record<string, unknown>;
  embedded?: boolean;
  onChange: (next: OnboardingBrandKitData) => void;
  onProceed?: (data: OnboardingBrandKitData) => void;
  onReturn?: () => void;
  isProceeding?: boolean;
}

const BrandOnboardingKit = ({
  data,
  rawData,
  // embedded = false,
  onChange,
  onProceed,
  onReturn,
  isProceeding = false,
}: BrandOnboardingKitProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('colors');
  const [isReady, setIsReady] = useState(false);
  const [showReadyPreview, setShowReadyPreview] = useState(false);

  const resolvedBrandName = useMemo(() => {
    const nestedBrand =
      rawData?.brand &&
      typeof rawData.brand === 'object' &&
      !Array.isArray(rawData.brand)
        ? (rawData.brand as Record<string, unknown>)
        : null;
    const rawBrandName =
      typeof rawData?.brandName === 'string' ? rawData.brandName.trim() : '';
    const rawLogoText =
      typeof rawData?.logoText === 'string' ? rawData.logoText.trim() : '';
    const nestedBrandName =
      nestedBrand && typeof nestedBrand.name === 'string'
        ? nestedBrand.name.trim()
        : '';

    return (
      rawBrandName ||
      rawLogoText ||
      nestedBrandName ||
      data.vibe.archetype ||
      ''
    );
  }, [data.vibe.archetype, rawData]);

  const [draftBrandName, setDraftBrandName] = useState(resolvedBrandName);
  const [prevResolvedBrandName, setPrevResolvedBrandName] =
    useState(resolvedBrandName);
  const [prevShowReadyPreview, setPrevShowReadyPreview] =
    useState(showReadyPreview);

  if (
    resolvedBrandName !== prevResolvedBrandName ||
    showReadyPreview !== prevShowReadyPreview
  ) {
    setPrevResolvedBrandName(resolvedBrandName);
    setPrevShowReadyPreview(showReadyPreview);
    if (!showReadyPreview) {
      setDraftBrandName(resolvedBrandName);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const colorData = useMemo<BrandColorCollectionData>(() => {
    const primaryColors =
      (rawData?.primaryColors as string[]) ?? data.colors.primary;
    const secondaryColors =
      (rawData?.secondaryColors as string[]) ?? data.colors.secondary;
    const otherColors = data.colors.others ?? [];
    const logos = data.logos?.length
      ? data.logos
      : ((rawData?.logoCandidates as string[]) ?? []);
    const profilePhoto = data.profilePhoto ?? (rawData?.profilePhoto as string);

    return {
      primaryColors,
      secondaryColors,
      otherColors,
      logos,
      profilePhoto,
    };
  }, [
    data.colors.primary,
    data.colors.secondary,
    data.colors.others,
    data.logos,
    data.profilePhoto,
    rawData,
  ]);

  const vibeData = useMemo<BrandVibeApiData>(() => {
    const rawVibe = (rawData?.vibe as Record<string, unknown>) || {};

    return {
      description:
        (typeof rawVibe.description === 'string' && rawVibe.description) ||
        data.vibe.description ||
        '',
      // Single source of truth is data.vibe.archetype so clearing the field is not revived by raw keywords.
      keywords: data.vibe.archetype ? [data.vibe.archetype] : [],
      voice:
        (rawVibe.voice as BrandVibeApiData['voice']) || data.vibe.voice || {},
    };
  }, [data.vibe, rawData]);

  const activeTabIndex = TABS.findIndex((tab) => tab.id === activeTab);
  const previewBrandName = draftBrandName.trim() || resolvedBrandName;

  const previewData = useMemo<OnboardingBrandKitData>(
    () => ({
      ...data,
      vibe: {
        ...data.vibe,
        archetype: previewBrandName || data.vibe.archetype,
      },
    }),
    [data, previewBrandName]
  );

  const previewRawData = useMemo<Record<string, unknown>>(
    () => ({
      ...(rawData ?? {}),
      ...(previewBrandName
        ? {
            brandName: previewBrandName,
            logoText: previewBrandName,
          }
        : {}),
    }),
    [previewBrandName, rawData]
  );

  const handleNext = () => {
    if (activeTabIndex < TABS.length - 1) {
      setActiveTab(TABS[activeTabIndex + 1].id);
      return;
    }

    setShowReadyPreview(true);
  };

  const handleBack = () => {
    if (showReadyPreview) {
      setShowReadyPreview(false);
      return;
    }

    if (activeTabIndex > 0) {
      setActiveTab(TABS[activeTabIndex - 1].id);
      return;
    }

    onReturn?.();
  };

  const handleSave = () => {
    onProceed?.({
      ...previewData,
      profilePhoto: colorData.profilePhoto ?? previewData.profilePhoto ?? null,
      logos: colorData.logos,
      vibe: {
        ...previewData.vibe,
        archetype: previewBrandName || previewData.vibe.archetype,
      },
    });
  };

  if (!isReady) {
    return (
      <LoadingOverlay
        title="Building your Brand DNA"
        subtitles={['Fetching your brand logo...']}
      />
    );
  }

  return (
    <Modal
      open={true}
      onClose={() => {}}
      className={`[&>div]:relative ${showReadyPreview ? '[&>div]:h-fit' : '[&>div]:h-[72dvh]'} [&>div]:max-w-6xl [&>div]:overflow-hidden [&>div]:p-10`}
    >
      <div className="font-metropolis text-neutral-gray-900 flex h-full min-h-0 flex-col gap-5">
        {showReadyPreview ? (
          <div className="flex h-full min-h-0 items-center justify-center">
            <BrandDnaReadyCard
              data={previewData}
              rawData={previewRawData}
              onSave={handleSave}
              isSaving={isProceeding}
              layoutOnly
              headerActions={
                <Input
                  type="text"
                  value={draftBrandName}
                  onChange={(event) => setDraftBrandName(event.target.value)}
                  placeholder="Enter brand name"
                  containerClassName="w-[220px]"
                  className="border-neutral-gray-300 h-10 bg-white text-sm!"
                />
              }
              className="border-none! p-0!"
            />
          </div>
        ) : (
          <>
            <div className="bg-neutral-gray-100 sticky top-0 z-10 flex shrink-0 flex-col gap-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon icon="lucide:brain" className="size-9" />
                  <div className="text-[26px] font-bold">Brand DNA</div>
                </div>

                <div className="flex items-center gap-2">
                  {activeTabIndex > 0 && (
                    <Button
                      variant="secondary"
                      size="sm"
                      content="Back"
                      onClick={handleBack}
                      className="h-9.5! px-4! py-3! text-sm/none!"
                    />
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    content="Next"
                    onClick={handleNext}
                    disabled={isProceeding}
                    className="h-9.5! px-4! py-3! text-sm/none!"
                  />
                </div>
              </div>

              <div className="grid min-h-12 grid-cols-3 rounded-xl bg-[#f2f4f7] p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]">
                {TABS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex h-full cursor-pointer items-center justify-center text-[14px] ${
                      activeTab === item.id
                        ? 'rounded-[10px] bg-white font-semibold text-[#18181a] shadow-sm'
                        : 'font-medium text-[#7d8493] hover:text-[#18181a]'
                    } transition-all duration-200`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex h-0 min-h-0 grow flex-col overflow-y-auto">
              <div className="mx-auto w-full max-w-4xl grow">
                {activeTab === 'colors' && (
                  <LogoColorsPanel
                    data={colorData}
                    onChange={(next) => onChange({ ...data, colors: next })}
                    onLogosChange={(nextLogos, primaryLogo) =>
                      onChange({
                        ...data,
                        logos: nextLogos,
                        ...(primaryLogo !== undefined && {
                          profilePhoto: primaryLogo,
                        }),
                      })
                    }
                  />
                )}

                {activeTab === 'typography' && (
                  <TypographyPanel
                    data={data.fonts}
                    onChange={(next) => onChange({ ...data, fonts: next })}
                  />
                )}

                {activeTab === 'vibe' && (
                  <VibePanel
                    data={vibeData}
                    onChange={(next) =>
                      onChange({
                        ...data,
                        vibe: {
                          ...data.vibe,
                          description:
                            next.description ?? data.vibe.description,
                          preferredTerms:
                            next.keywords ?? data.vibe.preferredTerms,
                          archetype: next.keywords?.[0] ?? '',
                          voice: {
                            confident:
                              next.voice?.confident ??
                              data.vibe.voice.confident,
                            energetic:
                              next.voice?.energetic ??
                              data.vibe.voice.energetic,
                            professional:
                              next.voice?.professional ??
                              data.vibe.voice.professional,
                            trust: next.voice?.trust ?? data.vibe.voice.trust,
                            friendly:
                              next.voice?.friendly ?? data.vibe.voice.friendly,
                            authority:
                              next.voice?.authority ??
                              data.vibe.voice.authority,
                          },
                        },
                      })
                    }
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default BrandOnboardingKit;
