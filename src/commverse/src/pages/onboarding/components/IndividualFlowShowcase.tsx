import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';

import Chip from '../../../components/Chip';
import type { OnboardingHeaderTab } from './MemoryHeader';

type UploadSlot = 'person' | 'garment';

type UploadPreviewState = Partial<Record<UploadSlot, string>>;

type IndividualFlowShowcaseProps = {
  activeTab: OnboardingHeaderTab;
};

const panelCopy: Record<
  OnboardingHeaderTab,
  {
    eyebrow: string;
    title: string;
    body: string;
    chips: string[];
    inputHint: string;
  }
> = {
  'beauty-try-on': {
    eyebrow: 'Beauty Try-On',
    title: 'Try beauty products before you buy.',
    body:
      'Pick a category, paste a product link, and we will guide you into an AR-ready beauty preview flow.',
    chips: ['Lipstick', 'Eyeliner', 'Foundation', 'Blush'],
    inputHint: 'Paste a beauty product link to continue...',
  },
  'cloth-try-on': {
    eyebrow: 'Cloth Try-On',
    title: 'Generate an outfit try-on with your own images.',
    body:
      'Upload your photo and a clothing reference. This gives the flow a dedicated upload state that matches the Figma direction.',
    chips: ['Top', 'Dress', 'Jacket', 'Full Outfit'],
    inputHint: 'Upload your photo and garment image to continue...',
  },
  'product-ad': {
    eyebrow: 'Product Ad',
    title: 'Turn a product into launch-ready ad creative.',
    body:
      'Paste a product page URL and we will generate a branded marketing visual using your saved brand DNA.',
    chips: [],
    inputHint: 'Paste a product page URL to generate your branded ad...',
  },
  'brand-memory': {
    eyebrow: 'Brand Memory',
    title: '',
    body: '',
    chips: [],
    inputHint: '',
  },
  'immersive-product-page': {
    eyebrow: 'Immersive Product Page',
    title: '',
    body: '',
    chips: [],
    inputHint: '',
  },
};

const UploadCard = ({
  label,
  hint,
  previewUrl,
  onSelect,
}: {
  label: string;
  hint: string;
  previewUrl?: string;
  onSelect: (file: File) => void;
}) => {
  return (
    <label className="border-neutral-gray-300 hover:border-neutral-gray-500 flex h-[176px] flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-[20px] border bg-white px-5 text-center transition-colors">
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={label}
          className="h-[120px] w-full rounded-[16px] object-cover"
        />
      ) : (
        <div className="bg-neutral-gray-150 flex size-12 items-center justify-center rounded-full">
          <Icon
            icon="solar:gallery-add-linear"
            className="size-6 text-neutral-gray-700"
          />
        </div>
      )}

      <div className="space-y-1">
        <p className="text-sm font-semibold text-neutral-gray-900">{label}</p>
        <p className="text-neutral-gray-600 text-xs">{hint}</p>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onSelect(file);
        }}
      />
    </label>
  );
};

const IndividualFlowShowcase = ({
  activeTab,
}: IndividualFlowShowcaseProps) => {
  const [selectedChipByTab, setSelectedChipByTab] = useState<
    Partial<Record<OnboardingHeaderTab, string>>
  >({});
  const [previewUrls, setPreviewUrls] = useState<UploadPreviewState>({});

  const content = panelCopy[activeTab];
  const selectedChip = selectedChipByTab[activeTab] ?? content.chips[0] ?? null;

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const canRenderUploads = activeTab === 'cloth-try-on';

  const renderStatus = useMemo(() => {
    if (activeTab === 'cloth-try-on') return 'Analyzing the images...';
    if (activeTab === 'product-ad') return 'Waiting for your product URL...';
    return 'Waiting for your product link...';
  }, [activeTab]);

  const setPreview = (slot: UploadSlot, file: File) => {
    setPreviewUrls((prev) => {
      if (prev[slot]) URL.revokeObjectURL(prev[slot]!);
      return {
        ...prev,
        [slot]: URL.createObjectURL(file),
      };
    });
  };

  if (
    activeTab !== 'beauty-try-on' &&
    activeTab !== 'cloth-try-on' &&
    activeTab !== 'product-ad'
  ) {
    return null;
  }

  return (
    <div className="mb-8 space-y-5">
      <div className="flex max-w-[620px] items-start gap-2">
        <div className="mt-2 rounded-full bg-brand p-1.5">
          <Icon icon="lucide:sparkles" className="size-3 text-white" />
        </div>
        <div className="space-y-2">
          <p className="text-brand text-[11px] font-semibold tracking-[0.08em] uppercase">
            {content.eyebrow}
          </p>
          <p className="text-neutral-gray-900 text-sm font-medium">
            {content.title}
          </p>
          <p className="text-neutral-gray-900 max-w-[560px] text-sm whitespace-pre-wrap">
            {content.body}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pl-7">
        {content.chips.map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() =>
              setSelectedChipByTab((prev) => ({
                ...prev,
                [activeTab]: chip,
              }))
            }
            className="cursor-pointer"
          >
            <Chip
              text={chip}
              variant={selectedChip === chip ? 'primary' : 'secondary'}
              className="rounded-lg! px-4! py-2! text-[12px]! font-semibold!"
            />
          </button>
        ))}
      </div>

      {canRenderUploads && (
        <div className="pl-7">
          <div className="bg-neutral-gray-150 rounded-[24px] p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-neutral-gray-900 text-sm font-semibold">
                  {activeTab === 'cloth-try-on'
                    ? 'Upload Inputs'
                    : 'Creative Inputs'}
                </p>
                <p className="text-neutral-gray-600 text-xs">
                  {content.inputHint}
                </p>
              </div>
              {selectedChip ? (
                <span className="bg-neutral-gray-300 rounded-lg px-3 py-1 text-xs font-medium text-neutral-gray-900">
                  {selectedChip}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 md:flex-row">
              <UploadCard
                label="Your photo"
                hint="Front-facing portrait"
                previewUrl={previewUrls.person}
                onSelect={(file) => setPreview('person', file)}
              />
              <UploadCard
                label="Clothing image"
                hint="Garment or catalog shot"
                previewUrl={previewUrls.garment}
                onSelect={(file) => setPreview('garment', file)}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'product-ad' && (
        <div className="pl-7">
          <div className="bg-neutral-gray-150 rounded-[24px] p-5">
            <div className="space-y-2">
              <p className="text-neutral-gray-900 text-sm font-semibold">
                Supported input
              </p>
              <p className="text-neutral-gray-600 text-xs">
                Submit a product page URL. Onboarding validates the page and, if
                product images are found, generates a branded advertisement
                image automatically.
              </p>
            </div>

            <div className="mt-4 rounded-[20px] border border-neutral-gray-300 bg-white p-5">
              <div className="flex items-start gap-3">
                <div className="bg-neutral-gray-150 flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Icon
                    icon="solar:link-minimalistic-linear"
                    className="size-5 text-neutral-gray-700"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-neutral-gray-900">
                    URL-based ad generation
                  </p>
                  <p className="text-xs text-neutral-gray-600">
                    Uses the onboarding product-validation endpoint and renders
                    the returned branded ad result in the chat stream.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pl-7">
        <Icon icon="lucide:sparkles" className="size-4 text-brand" />
        <p className="text-neutral-gray-600 text-sm italic">{renderStatus}</p>
      </div>
    </div>
  );
};

export default IndividualFlowShowcase;
