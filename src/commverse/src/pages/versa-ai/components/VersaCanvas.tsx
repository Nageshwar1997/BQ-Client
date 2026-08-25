import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';
import Header from '../../../components/Header';
import {
  Countdown,
  StarsAnimation,
  StarsWithoutAnimation,
} from '../../../components/StarsAnimation';
import type { IResult } from '../../../types';
import { VersaAiModelViewer } from '../ModelViewer';

interface VersaCanvasProps {
  resultFiles: IResult[];
  glbUrl?: string;
  isGenerating: boolean;
  isRegenerating: boolean;
  generationStartedAt: number | null;
  selectedResultIdx: number;
  onResultSelect: (idx: number) => void;
  onModelLoaded: () => void;
  onClose: () => void;
  showExportOptions: boolean;
  onToggleExportOptions: () => void;
  exportOptionsContent: ReactNode;
}

export function VersaCanvas({
  resultFiles,
  glbUrl,
  isGenerating,
  // isRegenerating,
  generationStartedAt,
  selectedResultIdx,
  onResultSelect,
  onModelLoaded,
  onClose,
  showExportOptions,
  onToggleExportOptions,
  exportOptionsContent,
}: VersaCanvasProps) {
  const hasResults = resultFiles.length > 0;
  const isExportDisabled = !hasResults || isGenerating;

  return (
    <div className="flex flex-1 flex-col">
      <Header
        section="versa-ai"
        buttons={{
          save: {
            variant: 'secondary',
            content: 'Close',
            onClick: onClose,
          },
          publish: {
            content: 'Export',
            leftIcon: (
              <Icon
                icon="solar:download-minimalistic-linear"
                className="**:stroke-1.5 **:stroke-round size-5"
              />
            ),
            onClick: !isExportDisabled ? onToggleExportOptions : undefined,
            className: showExportOptions
              ? 'bg-brand-pressed! pointer-events-none'
              : '',
            disabled: isExportDisabled,
            modalContent:
              showExportOptions && !isExportDisabled
                ? exportOptionsContent
                : undefined,
          },
        }}
      />
      <div className="relative flex h-full w-full flex-col gap-5 pt-6 pr-12 pb-8 pl-8">
        <img
          src="/assets/icons/ctruh-gradient-light-two.svg"
          alt="gradient"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="flex w-full grow items-center justify-center">
          {hasResults && glbUrl ? (
            <div className="relative h-full w-full">
              {isGenerating && (
                <div className="font-metropolis absolute inset-0 z-40 flex h-full w-full flex-col items-center justify-center gap-6 rounded-3xl bg-white">
                  <StarsAnimation />
                  <div className="mt-14 flex flex-col items-center gap-6">
                    <Countdown
                      startPermission={isGenerating}
                      startedAt={generationStartedAt}
                    />
                    {/* <div className="text-neutral-gray-600 text-sm/4">
                      {isRegenerating
                        ? 'Regenerating your 3D model, please wait...'
                        : 'Generating your 3D model, please wait...'}
                    </div> */}
                  </div>
                </div>
              )}
              <div
                className={
                  isGenerating
                    ? 'pointer-events-none invisible h-full w-full'
                    : 'visible h-full w-full'
                }
              >
                <VersaAiModelViewer
                  url={glbUrl}
                  versions={resultFiles.map((f) => f.thumbnail)}
                  selectedIdx={selectedResultIdx}
                  onModelLoaded={onModelLoaded}
                  onOptionClick={onResultSelect}
                />
              </div>
            </div>
          ) : isGenerating ? (
            <div className="font-metropolis flex h-full w-full flex-col items-center justify-center gap-6">
              <StarsAnimation />
              <div className="mt-14 flex flex-col items-center gap-6">
                <Countdown
                  startPermission={isGenerating}
                  startedAt={generationStartedAt}
                />
                {/* <div className="text-neutral-gray-600 text-sm/4">
                  {isRegenerating
                    ? 'Regenerating your 3D model, please wait...'
                    : 'Generating your 3D model, please wait...'}
                </div> */}
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-6 text-center">
              <StarsWithoutAnimation />
              <div className="font-metropolis mt-4 flex flex-col gap-2 text-sm/4">
                <p className="text-neutral-gray-900 text-base/5 font-semibold">
                  What would you like to create today?
                </p>
                <p className="text-neutral-gray-600 text-sm/4">
                  Generate high-quality 3d models from images in seconds
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
