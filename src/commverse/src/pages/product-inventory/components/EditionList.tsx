import { Icon } from '@iconify/react';
import { useState, useRef } from 'react';
import { useWatch, Controller } from 'react-hook-form';
import type { AssetItem } from '../../../components/ImageUploader';
import Input from '../../../components/Input';
import ColorInput from '../../../components/Input/ColorInput';
import { useDragReorder } from '../../../hooks/useDragReorder';
import useOutsideClick from '../../../hooks/useOutsideClick';
import { AddIcon } from '../../../icons';
import type { EditionListProps } from '../../../types';
import type { Edition } from '../../../types/api.types';

const EditionList: React.FC<EditionListProps> = ({
  variantIndex,
  activeTabId,
  fields,
  register,
  control,
  onRemove,
  onMove,
  uploadedAssets,
  setValue,
  variantTypeLabel,
  errors,
  getValues,
}) => {
  const variantEditions =
    useWatch({ control, name: `variants.${variantIndex}.editions` as const }) ||
    [];

  const { getRowProps, getGripProps, draggingIdx, overIdx } =
    useDragReorder(onMove);

  const [openPopoverIdx, setOpenPopoverIdx] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  useOutsideClick({
    ref: popoverRef,
    enabled: openPopoverIdx !== null,
    handler: () => setOpenPopoverIdx(null),
  });

  const getUsedImageUrls = (currentEditionIdx: number): string[] =>
    variantEditions
      .filter((_, idx) => idx !== currentEditionIdx)
      .map((ed: Edition) => ed?.imageUrl)
      .filter((url): url is string => !!url && typeof url === 'string');

  const handlePopoverUpload = (
    editionIdx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(editionIdx);
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setValue(
      `variants.${variantIndex}.editions.${editionIdx}.imageUrl`,
      objectUrl,
      { shouldValidate: true, shouldDirty: true, shouldTouch: true }
    );

    const newAsset: AssetItem = {
      file,
      url: objectUrl,
      name: file.name,
      type: 'image',
    };
    const currentMedia = getValues('media');
    setValue(
      'media',
      {
        images: [...currentMedia.images, newAsset],
        videos: currentMedia.videos,
        models: currentMedia.models,
      },
      { shouldValidate: true, shouldDirty: true, shouldTouch: true }
    );

    e.target.value = '';
    setOpenPopoverIdx(null);
  };

  return (
    <div className="flex flex-col gap-2">
      {fields.map((edition, editionIdx) => {
        const isDragging = draggingIdx === editionIdx;
        const isOver = overIdx === editionIdx && draggingIdx !== editionIdx;
        const usedImageUrls = getUsedImageUrls(editionIdx);
        const isDragDisabled = openPopoverIdx !== null;
        const inputId = `variant-${variantIndex}-edition-${editionIdx}-upload`;
        const editionErrors =
          errors?.variants?.[variantIndex]?.editions?.[editionIdx];

        return (
          <div
            key={edition.id}
            draggable={!isDragDisabled}
            className={`flex flex-col gap-4 rounded-lg bg-white pt-2 pr-2 pl-1 transition-all duration-150 ${
              isDragDisabled
                ? 'cursor-default'
                : isDragging
                  ? 'cursor-grabbing opacity-90'
                  : 'cursor-grab'
            } ${isOver ? 'ring-1 ring-black ring-offset-2' : ''}`}
            {...(isDragDisabled ? {} : getRowProps(editionIdx))}
            {...(isDragDisabled
              ? {}
              : {
                  onDragStart: getGripProps(editionIdx).onDragStart,
                  onDragEnd: getGripProps(editionIdx).onDragEnd,
                })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:grip-vertical" width={16} height={16} />
                <h2 className="text-xs font-medium text-[#1A1A1A]">
                  {variantTypeLabel} {editionIdx + 1}
                </h2>
              </div>
              {fields.length > 1 && (
                <Icon
                  icon="lucide:x"
                  width={18}
                  height={18}
                  className="cursor-pointer"
                  onClick={() => onRemove(editionIdx)}
                />
              )}
            </div>

            {activeTabId === 'image' ? (
              <div className="flex flex-col gap-4 pl-6">
                <Controller
                  name={
                    `variants.${variantIndex}.editions.${editionIdx}.imageUrl` as const
                  }
                  control={control}
                  render={({ field }) => {
                    const imageUrl = field.value;
                    const imageAssets =
                      uploadedAssets?.filter((a) => a.type === 'image') ?? [];

                    return (
                      <div className="flex gap-2">
                        <div className="flex flex-col gap-1">
                          <input
                            id={inputId}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={(el) => {
                              fileInputRefs.current[editionIdx] = el;
                            }}
                            onChange={(e) => handlePopoverUpload(editionIdx, e)}
                          />
                          <div className="relative">
                            <div
                              className="bg-neutral-gray-300 border-neutral-gray-400 flex size-11 cursor-pointer items-center justify-center overflow-hidden rounded-lg border-[1.5px]"
                              onClick={() => {
                                if (isDragDisabled) return;
                                if (imageAssets.length > 0) {
                                  setOpenPopoverIdx((prev) =>
                                    prev === editionIdx ? null : editionIdx
                                  );
                                  return;
                                }
                                if (uploadedAssets?.length <= 0)
                                  fileInputRefs.current[editionIdx]?.click();
                              }}
                            >
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt="edition-preview"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <AddIcon className="stroke-neutral-gray-600 size-6" />
                              )}
                            </div>

                            {imageAssets.length > 0 &&
                              openPopoverIdx === editionIdx && (
                                <div
                                  ref={popoverRef}
                                  className="absolute bottom-14 left-0 z-50 flex w-102 flex-col flex-wrap gap-3 rounded-xl border bg-white p-3 shadow-xl"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-metropolis text-neutral-gray-800 text-xs font-medium">
                                      Select Variant Image
                                    </span>
                                    <Icon
                                      icon="lucide:x"
                                      className="hover:text-neutral-gray-600 size-4 cursor-pointer"
                                      onClick={() => setOpenPopoverIdx(null)}
                                    />
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {imageAssets.map((asset, idx) => {
                                      const isUsed = usedImageUrls.includes(
                                        asset.url
                                      );
                                      const isSelected = asset.url === imageUrl;
                                      return (
                                        <button
                                          key={idx}
                                          type="button"
                                          disabled={isUsed}
                                          className={`relative size-14 overflow-hidden rounded-xl transition-all ${
                                            isUsed
                                              ? 'cursor-not-allowed opacity-30'
                                              : 'cursor-pointer hover:scale-105 active:scale-95'
                                          } ${isSelected && !isUsed ? 'ring-neutral-gray-900 ring-1' : 'ring-neutral-gray-300 ring-1'}`}
                                          onClick={() => {
                                            if (isUsed) return;
                                            setValue(
                                              `variants.${variantIndex}.editions.${editionIdx}.imageUrl`,
                                              asset.url,
                                              {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                                shouldTouch: true,
                                              }
                                            );
                                            setOpenPopoverIdx(null);
                                          }}
                                        >
                                          <img
                                            src={asset.url}
                                            alt={asset.name}
                                            className="pointer-events-none h-full w-full object-cover"
                                          />
                                        </button>
                                      );
                                    })}
                                    <button
                                      type="button"
                                      className="ring-neutral-gray-300 hover:ring-neutral-gray-500 inline-flex size-14 cursor-pointer items-center justify-center rounded-xl ring transition-colors"
                                      onClick={() => {
                                        fileInputRefs.current[
                                          editionIdx
                                        ]?.click();
                                      }}
                                    >
                                      <AddIcon className="stroke-neutral-gray-600 size-6" />
                                    </button>
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>

                        <Input
                          placeholder={` Enter ${variantTypeLabel.toLocaleLowerCase()} `}
                          containerClassName="flex-1"
                          className="h-full py-3.5!"
                          {...register(
                            `variants.${variantIndex}.editions.${editionIdx}.name` as const
                          )}
                          error={editionErrors?.name?.message}
                        />
                      </div>
                    );
                  }}
                />
                {editionErrors?.imageUrl?.message && (
                  <span className="font-metropolis text-ui-error text-xs font-normal">
                    {editionErrors.imageUrl.message}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex gap-4 pl-6">
                <Input
                  placeholder={` Enter ${variantTypeLabel.toLocaleLowerCase()} `}
                  containerClassName="flex-1"
                  className="h-full py-3.5!"
                  {...register(
                    `variants.${variantIndex}.editions.${editionIdx}.name` as const
                  )}
                  error={editionErrors?.name?.message}
                />
                <Controller
                  name={
                    `variants.${variantIndex}.editions.${editionIdx}.color` as const
                  }
                  control={control}
                  render={({ field }) => {
                    return (
                      <ColorInput
                        {...field}
                        placeholder="#000000"
                        className="h-full px-3! py-3! text-xs"
                        containerClassName="flex-1"
                        error={editionErrors?.color?.message}
                      />
                    );
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EditionList;
