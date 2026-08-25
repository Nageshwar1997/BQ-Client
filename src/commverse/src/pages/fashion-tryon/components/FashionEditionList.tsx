import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import useOutsideClick from '../../../hooks/useOutsideClick';
import type {
  FashionEditionListProps,
  TFashionTryOnForm,
} from '../../../types';
import Input from '../../../components/Input';
import { getResolvedImageUrl } from '../../virtual-tryon/utils';

const FashionEditionList: React.FC<FashionEditionListProps> = ({
  productIndex,
  id,
  onRemove,
  variantTypeLabel,
  isSelected = false,
  onPreviewSelect,
  onViewSelect,
  draggingIdx,
  overIdx,
  rowProps,
  gripProps,
}) => {
  const { control, formState, setValue } = useFormContext<TFashionTryOnForm>();

  const productEdition =
    useWatch({ control, name: `products.${productIndex}` as const }) || {};
  const visibleIds = useWatch({ control, name: 'visibleIds' }) ?? [];

  const [openPopoverIdx, setOpenPopoverIdx] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const copyResetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  //   const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const isDragging = draggingIdx === productIndex;
  const isOver = overIdx === productIndex && draggingIdx !== productIndex;
  const isDragDisabled = openPopoverIdx !== null;
  useOutsideClick({
    ref: popoverRef,
    enabled: openPopoverIdx !== null,
    handler: () => setOpenPopoverIdx(null),
  });

  useEffect(() => {
    return () => {
      if (copyResetTimeoutRef.current) {
        clearTimeout(copyResetTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyProductUrl = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    e.stopPropagation();

    const trimmedUrl = productEdition.url?.trim();
    if (!isVisible || !trimmedUrl) return;

    await navigator.clipboard.writeText(trimmedUrl);
    setIsCopied(true);

    if (copyResetTimeoutRef.current) {
      clearTimeout(copyResetTimeoutRef.current);
    }

    copyResetTimeoutRef.current = setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  };

  const productErrors = formState.errors.products?.[productIndex];
  const isVisible = visibleIds.includes(id);

  return (
    <div className="flex flex-col gap-2">
      <div
        draggable={!isDragDisabled}
        onClick={() => onPreviewSelect?.(productIndex)}
        className={`${isSelected ? 'bg-neutral-gray-300 border-neutral-gray-700' : 'border-transparent'} flex gap-1 rounded-lg border p-2 transition-all duration-150 ${
          isDragDisabled
            ? 'cursor-default'
            : isDragging
              ? 'cursor-grabbing opacity-90'
              : 'cursor-grab'
        } ${isOver ? 'ring-1 ring-black ring-offset-2' : ''}`}
        {...(isDragDisabled ? {} : rowProps)}
        {...(isDragDisabled
          ? {}
          : {
              onDragStart: gripProps?.onDragStart,
              onDragEnd: gripProps?.onDragEnd,
            })}
      >
        <Icon
          icon="lucide:grip-vertical"
          width={16}
          height={16}
          className="min-w-4"
        />
        <div className="flex min-w-0 grow flex-col items-center justify-between gap-2 overflow-visible">
          <div className="flex w-full items-center gap-2">
            <h2 className="text-neutral-gray-800 grow text-left text-xs font-medium">
              {variantTypeLabel} {productIndex + 1}
            </h2>
            <Icon
              data-stop-preview
              icon={isVisible ? 'solar:eye-linear' : 'solar:eye-closed-linear'}
              width={16}
              height={16}
              className="text-neutral-gray-900 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onViewSelect?.(id);
              }}
            />
            <Icon
              data-stop-preview
              icon="lucide:x"
              width={18}
              height={18}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(productIndex);
              }}
            />
          </div>
          <div
            className={`flex w-full flex-col gap-2 ${isVisible ? '' : 'cursor-not-allowed opacity-30'}`}
          >
            <div className="flex w-full gap-2">
              <img
                className="border-neutral-gray-900 h-10 w-10 rounded-lg border object-cover"
                src={
                  typeof productEdition.image === 'string'
                    ? getResolvedImageUrl(productEdition.image)
                    : undefined
                }
                alt={`Product ${productIndex + 1}`}
              />
              <Input
                placeholder="Product Name"
                containerClassName="grow h-full [&>div]:h-full"
                className="h-full text-xs!"
                value={productEdition.name ?? ''}
                onChange={(e) =>
                  setValue(`products.${productIndex}.name`, e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                error={productErrors?.name?.message}
                disabled={!isVisible}
              />
            </div>
            <div className="bg-neutral-gray-400 border-neutral-gray-900 flex h-10 w-full items-center rounded-lg border px-4 py-2.5">
              <div className="grow overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap">
                {productEdition.fileName}
              </div>
            </div>
            {productErrors?.fileName?.message && (
              <span className="font-metropolis text-ui-error w-full text-xs">
                {productErrors.fileName.message}
              </span>
            )}
            <div className="w-full">
              <div className="relative">
                <Input
                  placeholder="Add product URL"
                  containerClassName="grow h-full [&>div]:h-full"
                  className="h-full pr-11 text-xs! focus:border-brand! focus:ring-0"
                  value={productEdition.url ?? ''}
                  onChange={(e) =>
                    setValue(`products.${productIndex}.url`, e.target.value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  disabled={!isVisible}
                />
                {!productErrors?.url?.message && productEdition.url?.trim() && (
                  <span
                    className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1"
                    title={isCopied ? 'Copied' : 'Copy URL'}
                  >
                    <Icon
                      data-stop-preview
                    icon={
                      isCopied
                        ? 'solar:check-circle-linear'
                        : 'solar:copy-linear'
                    }
                    width={18}
                    height={18}
                    className={`min-w-[18px] ${isCopied ? 'text-ui-success' : 'text-neutral-gray-500'} ${isVisible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    onClick={handleCopyProductUrl}
                  />
                </span>
              )}
              </div>
              {productErrors?.url?.message && (
                <span className="font-metropolis text-ui-error mt-1 block text-xs">
                  {productErrors.url.message}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionEditionList;
