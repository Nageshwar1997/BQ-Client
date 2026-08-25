import { Icon } from '@iconify/react';
import {
  useRef,
  type ChangeEvent,
  type DragEvent,
  type RefObject,
} from 'react';
import { Controller, type Control } from 'react-hook-form';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import DividerText from '../../../components/DividerText';
import PillLoader from '../../../components/PillLoader';
import TextArea from '../../../components/TextArea';
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import { Tab } from '../../../components/Tab';
import { IMAGE_FILE_TYPES } from '../../../constants';
import { modelTypeData } from '../../../data';
import { getTabsData } from '../../../lib/utils';
import type {
  FormValues,
  ImageItem,
  InputTo3DMode,
  ModeValue,
  TabData,
} from '../../../types';
import { AddIcon, VersaAISolidLogoIcon } from '../../../icons';
import { PromptSuggestion } from './PromptSuggestion';

interface VersaSidebarProps {
  onNavigateDashboard: () => void;
  onReset: () => void;
  inputTo3DTabs: TabData[];
  inputTo3DMode: InputTo3DMode;
  onInputModeChange: (mode: InputTo3DMode) => void;
  isDragging: boolean;
  hasImages: boolean;
  images: ImageItem[];
  activeIdx: number;
  isSingleMode: boolean;
  maxImages: number;
  acceptedTypes: string[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  thumbInputRefs: RefObject<(HTMLInputElement | null)[]>;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onBrowse: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (idx: number) => void;
  onThumbAdd: (idx: number) => void;
  onThumbDrop: (idx: number, files: FileList) => void;
  onThumbFile: (event: ChangeEvent<HTMLInputElement>, idx: number) => void;
  control: Control<FormValues>;
  promptLength: number;
  selectedSuggestionIdx: number;
  activePromptSuggestions: readonly string[];
  multiviewSuggestionImages: readonly (readonly string[])[];
  onPromptChange: (value: string) => void;
  onSelectSuggestion: (idx: number, prompt: string) => void;
  isPromptInputDisabled: boolean;
  isVersaImageGenerating: boolean;
  hasGeneratedVersaImage: boolean;
  isGenerateImageButtonDisabled: boolean;
  isGenerating: boolean;
  onGenerateImage: () => void;
  modelType: ModeValue;
  meshOptimization: boolean;
  onModelTypeChange: (id: TabData['id']) => void;
  hasGeneratedResult: boolean;
  isInitialGenerating: boolean;
  isRegenerating: boolean;
  onGenerateModel: () => void;
}

export function VersaSidebar({
  onNavigateDashboard,
  onReset,
  inputTo3DTabs,
  inputTo3DMode,
  onInputModeChange,
  isDragging,
  hasImages,
  images,
  activeIdx,
  isSingleMode,
  maxImages,
  acceptedTypes,
  fileInputRef,
  thumbInputRefs,
  onDrop,
  onDragOver,
  onDragLeave,
  onBrowse,
  onFileChange,
  onRemoveImage,
  onThumbAdd,
  onThumbDrop,
  onThumbFile,
  control,
  promptLength,
  selectedSuggestionIdx,
  activePromptSuggestions,
  multiviewSuggestionImages,
  onPromptChange,
  onSelectSuggestion,
  isPromptInputDisabled,
  isVersaImageGenerating,
  hasGeneratedVersaImage,
  isGenerateImageButtonDisabled,
  isGenerating,
  onGenerateImage,
  modelType,
  meshOptimization,
  onModelTypeChange,
  hasGeneratedResult,
  isInitialGenerating,
  isRegenerating,
  onGenerateModel,
}: VersaSidebarProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const promptTextAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const showSinglePreviewLoader = isSingleMode && isVersaImageGenerating;

  const smoothScrollPromptIntoView = () => {
    if (!isSingleMode) return;

    const target = promptTextAreaRef.current;
    if (!target) return;

    const scrollContainer = target.closest(
      '[data-versa-scroll-container="true"]'
    );
    if (!(scrollContainer instanceof HTMLElement)) return;

    const topSpacing = 28;
    const containerRect = scrollContainer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const nextScrollTop =
      scrollContainer.scrollTop +
      (targetRect.top - containerRect.top) -
      topSpacing;

    scrollContainer.scrollTo({
      top: Math.max(0, nextScrollTop),
      behavior: 'smooth',
    });
  };

  const forceScrollToTop = () => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;
    scrollContainer.scrollTop = 0;
    scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleGenerateImageClick = () => {
    forceScrollToTop();
    requestAnimationFrame(() => {
      forceScrollToTop();
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
    window.setTimeout(() => {
      forceScrollToTop();
      window.scrollTo({ top: 0, behavior: 'auto' });
    }, 120);

    onGenerateImage();
  };

  return (
    <div className="bg-neutral-gray-200 font-metropolis flex h-screen w-full max-w-75 flex-col overflow-hidden py-5.5">
      <div className="shrink-0 px-4 py-3.5">
        <img
          src="/assets/icons/Commverse Logo - Final.svg"
          alt="logo"
          className="h-auto w-full max-w-47.5 cursor-pointer object-cover"
          onClick={onNavigateDashboard}
        />
      </div>
      <div className="shrink-0 px-4 pt-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-neutral-gray-900 text-base font-semibold">
              Image-to-3D
            </span>
            <Button
              variant="link"
              content="Reset"
              className="text-xs!"
              onClick={onReset}
            />
          </div>

          <span className="font-metropolis text-neutral-gray-900 text-xs font-normal">
            Controls to tweak your experience
          </span>

          <Tab
            data={inputTo3DTabs}
            variant="pill"
            defaultActiveId={inputTo3DMode}
            className="p-2! text-xs!"
            onClick={(value) => onInputModeChange(value.id as InputTo3DMode)}
          />
        </div>
      </div>
      <div
        className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-4 pt-4"
        data-versa-scroll-container="true"
        ref={scrollContainerRef}
      >
        <div className="flex flex-col gap-4 pb-4">
          <div className="flex flex-col gap-3">
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onClick={
                !hasImages && !showSinglePreviewLoader ? onBrowse : undefined
              }
              className={`h-60 w-full rounded-3xl border-2 ${
                isDragging
                  ? 'border-brand/90 bg-brand/10 cursor-default border-dashed'
                  : hasImages || showSinglePreviewLoader
                    ? 'border-neutral-gray-300 bg-neutral-gray-150 cursor-default border-solid'
                    : 'cursor-pointer border-dashed border-gray-400 bg-gray-50'
              } relative overflow-hidden transition-all duration-200 ease-in-out`}
            >
              {showSinglePreviewLoader ? (
                <div className="flex h-full items-center justify-center p-4">
                  <PillLoader
                    description=""
                    className="w-full max-w-56 gap-0"
                    barClassName="w-3/4!"
                  />
                </div>
              ) : hasImages ? (
                <>
                  <img
                    src={images[activeIdx]?.url}
                    alt={images[activeIdx]?.name}
                    className="size-full object-contain p-2"
                  />
                  <button
                    type="button"
                    aria-label="Remove image"
                    className={`absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      isGenerating
                        ? 'cursor-not-allowed bg-black/30'
                        : 'cursor-pointer bg-black/50 hover:bg-black/60'
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      if (isGenerating) return;
                      e.preventDefault();
                      e.stopPropagation();
                      onRemoveImage(activeIdx);
                    }}
                    disabled={isGenerating}
                  >
                    <AddIcon className="size-4 rotate-45 stroke-white" />
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                  <Icon
                    icon="solar:upload-minimalistic-linear"
                    className="text-neutral-gray-900 size-7.5"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-neutral-gray-900 font-metropolis text-sm font-semibold">
                      {isSingleMode
                        ? 'Drop your product photo here'
                        : 'Drop your product photos here'}
                    </span>
                    <span className="text-neutral-gray-700 font-metropolis text-xs font-normal">
                      JPG/PNG/WebP up to 5MB each
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    content="Browse Files"
                    className="w-fit! leading-none!"
                    size="sm"
                  />
                  <span className="text-neutral-gray-700 font-metropolis text-xs font-normal">
                    {isSingleMode
                      ? 'Upload one clear image for best results'
                      : `Upload up to ${maxImages} angles for best results`}
                  </span>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              multiple={!isSingleMode}
              onChange={onFileChange}
              className="hidden"
            />

            {!isSingleMode && (
              <div className="flex justify-center gap-2">
                {Array.from({ length: maxImages }).map((_, idx) => {
                  const img = images[idx];
                  const isActive = hasImages && idx === activeIdx;
                  return (
                    <div key={idx}>
                      <div
                        onClick={() => onThumbAdd(idx)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onThumbDrop(idx, e.dataTransfer.files);
                        }}
                        className={`bg-neutral-gray-300 relative flex items-center justify-center overflow-hidden rounded-lg ${
                          isActive
                            ? 'border-neutral-gray-900 border-[1.5px]'
                            : 'border-neutral-gray-400 border-[1.5px]'
                        } size-11 cursor-pointer`}
                      >
                        {img ? (
                          <img
                            src={img.url}
                            alt={img.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <AddIcon className="stroke-neutral-gray-600 size-6" />
                        )}
                      </div>
                      <input
                        ref={(el) => {
                          thumbInputRefs.current[idx] = el;
                        }}
                        type="file"
                        accept={IMAGE_FILE_TYPES.join(',')}
                        onChange={(e) => onThumbFile(e, idx)}
                        className="hidden"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {isSingleMode && (
            <>
              <DividerText
                text="or"
                className="w-full"
                lineClassName="bg-neutral-gray-500"
                textClassName="text-neutral-gray-700"
              />
              <div className="w-full">
                <Controller
                  name="promptText"
                  control={control}
                  render={({ field }) => (
                    <TextArea
                      ref={promptTextAreaRef}
                      label="Describe what you want to create"
                      value={field.value}
                      disabled={isPromptInputDisabled}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                        onPromptChange(event.target.value);
                      }}
                      onFocus={() => {
                        window.setTimeout(() => {
                          smoothScrollPromptIntoView();
                          window.setTimeout(() => {
                            smoothScrollPromptIntoView();
                          }, 220);
                        }, 80);
                      }}
                      rows={6}
                      placeholder="Generate a wooden stool with tribal design"
                      className="text-neutral-gray-900 placeholder:text-neutral-gray-600 border-neutral-gray-400 min-h-24 w-full resize-none rounded-xl border bg-white px-3 py-2 text-xs outline-none"
                    />
                  )}
                />
                <span className="font-metropolis text-neutral-gray-600 ml-auto block w-fit text-right text-xs">
                  ({promptLength}/200)
                </span>
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            {activePromptSuggestions.map((prompt, idx) => (
              <PromptSuggestion
                key={prompt}
                prompt={prompt}
                previewImages={
                  isSingleMode ? undefined : multiviewSuggestionImages[idx]
                }
                isSelected={selectedSuggestionIdx === idx}
                onClick={() => {
                  onSelectSuggestion(idx, prompt);
                  window.requestAnimationFrame(() => {
                    smoothScrollPromptIntoView();
                    window.setTimeout(() => {
                      smoothScrollPromptIntoView();
                    }, 220);
                  });
                }}
                disabled={isPromptInputDisabled}
              />
            ))}
          </div>
          {isSingleMode && (
            <div className="flex flex-col gap-1">
              <Button
                variant={
                  isVersaImageGenerating
                    ? 'tertiary'
                    : hasGeneratedVersaImage
                      ? 'outline'
                      : 'tertiary'
                }
                content={
                  isVersaImageGenerating
                    ? hasGeneratedVersaImage
                      ? 'Regenerating image...'
                      : 'Generating image...'
                    : hasGeneratedVersaImage
                      ? 'Retry'
                      : 'Generate Image'
                }
                onClick={handleGenerateImageClick}
                disabled={isGenerateImageButtonDisabled || isGenerating}
                isLoading={isVersaImageGenerating}
                className={
                  hasGeneratedVersaImage
                    ? 'disabled:text-neutral-gray-500! disabled:border-neutral-gray-500!'
                    : ''
                }
              />
            </div>
          )}

          <Divider />

          <div className="flex flex-col gap-3">
            <span className="text-neutral-gray-900 text-[13px] font-semibold">
              Model Type
            </span>
            <Controller
              name="modelType"
              control={control}
              render={({ field }) => (
                <Tab
                  data={modelTypeData}
                  variant="pill"
                  defaultActiveId={field.value}
                  className="p-2! text-xs!"
                  onClick={(value) => {
                    field.onChange(value.id);
                    onModelTypeChange(value.id);
                  }}
                />
              )}
            />
          </div>

          <Divider />
          <div className="flex flex-col gap-2">
            <span className="text-neutral-gray-900 text-xs leading-3.75! font-medium">
              Texture Size
            </span>
            <Controller
              name="textureSize"
              control={control}
              render={({ field }) => (
                <Tab
                  data={getTabsData(modelType).textures}
                  variant="toggle"
                  defaultActiveId={field.value}
                  className="px-3! py-2! text-xs! leading-3.75!"
                  onClick={(value) => field.onChange(value.id)}
                />
              )}
            />
          </div>
          <div className="flex flex-col items-start gap-3">
            <div className="flex w-full items-center justify-between gap-1">
              <span className="text-neutral-gray-900 text-[13px] font-semibold">
                Mesh Optimization
              </span>
              <Controller
                name="meshOptimization"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    isOn={field.value}
                    onToggle={(value) => field.onChange(value)}
                  />
                )}
              />
            </div>
          </div>
          {meshOptimization && (
            <div className="flex flex-col gap-2">
              <span className="text-neutral-gray-900 text-xs leading-3.75! font-medium">
                Tri-Targets
              </span>
              <Controller
                name="triTargets"
                control={control}
                render={({ field }) => (
                  <Tab
                    data={getTabsData(modelType).triTargets}
                    variant="toggle"
                    defaultActiveId={field.value}
                    className="px-3! py-2! text-xs! leading-3.75!"
                    onClick={(value) => field.onChange(value.id)}
                  />
                )}
              />
              <span className="text-neutral-gray-600 text-xs leading-3.75 font-normal">
                Mesh reduction may reduce mesh quality and create holes or other
                artifacts.
              </span>
            </div>
          )}

          <Divider />
        </div>
      </div>
      <div className="shrink-0 px-4 pt-4 text-xs">
        <Button
          variant={
            isGenerating
              ? 'primary'
              : hasGeneratedResult
                ? 'tertiary'
                : 'primary'
          }
          content={
            isInitialGenerating
              ? 'Generating...'
              : isRegenerating
                ? 'Regenerating...'
                : hasGeneratedResult
                  ? 'Retry'
                  : 'Generate'
          }
          leftIcon={<VersaAISolidLogoIcon className="fill-white" />}
          onClick={onGenerateModel}
          isLoading={isGenerating}
          disabled={!hasImages}
        />
        <span className="text-neutral-gray-900 font-metropolis flex items-center justify-center gap-1 pt-4 text-xs font-semibold">
          <img
            src={'/assets/icons/credits.svg'}
            className="h-4 w-4"
            alt="Credits"
          />
          50 credits
        </span>
      </div>
    </div>
  );
}
