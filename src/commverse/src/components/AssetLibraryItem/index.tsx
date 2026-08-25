import React, { useState, useRef, useMemo, type MouseEvent } from 'react';
import { Icon } from '@iconify/react';
import Button from '../Button';
import Divider from '../Divider';
import { VersaAISolidLogoIcon } from '../../icons';
import useOutsideClick from '../../hooks/useOutsideClick';
import Chip from '../Chip';
import type { AssetLibraryItemProps, MenuItemProps } from '../../types';
import { MoreOptionsMenu } from '../MoreOptionsMenu';
import { useNavigate } from 'react-router';
import { downloadFile, mapExperienceTypeToVariant } from '../../lib/utils';
import ExperienceModules from '../ExperienceModules';

export const defaultImage = '/assets/images/versa-thumbnail.webp';
export const AssetLibraryItem: React.FC<AssetLibraryItemProps> = ({
  id,
  image,
  title,
  category,
  onDownload = () => {},
  onDelete = () => {},
  onEdit,
  onCreateExperience,
  isExperience = false,
  _id,
  onSelect,
  isSelected = false,
  isAIGenerated = false,
  environmentName,
  moduleCategory,
  onAddToProduct,
  onUnlinkFromProduct,
  className,
  fileType,
  fileSize,
  productNameLinkedTo,
  spriteUrl,
  thumbnailUrl,
  modelUrl,
  interactionVariant,
  linkedProductId,
  viewType = 'card',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const assetId = _id ?? id;
  const normalizedInteractionVariant = String(interactionVariant ?? '')
    .trim()
    .toLowerCase();
  const isSelectable = normalizedInteractionVariant === 'selectable';
  const isLinkable = normalizedInteractionVariant === 'linkable';
  const hasInteractionVariant = isSelectable || isLinkable;
  const hasLinkedProduct = Boolean(linkedProductId || productNameLinkedTo);

  const experienceModules = useMemo(() => {
    if (!moduleCategory?.length) return [];

    const variantCounts = new Map<string, number>();

    moduleCategory.forEach((item) => {
      const variant = mapExperienceTypeToVariant(item.variant);
      if (!variant) return;
      const prev = variantCounts.get(variant) ?? 0;
      variantCounts.set(variant, prev + (item.count ?? 0));
    });

    return Array.from(variantCounts.entries())
      .filter(([, count]) => count > 0)
      .map(([variant, count]) => ({
        variant,
        count,
      }));
  }, [moduleCategory]);

  const menuRef = useRef<HTMLDivElement>(null);
  const moreOptionRef = useRef<HTMLDivElement>(null);

  useOutsideClick({
    ref: [menuRef, moreOptionRef],
    handler: () => setIsMenuOpen(false),
    enabled: isMenuOpen,
  });

  const handleDownload = () => {
    if (!modelUrl) return;
    downloadFile({
      url: modelUrl,
      filename: title || '3d-model',
      extension: fileType?.toLowerCase(),
      onSuccess: onDownload,
    });
  };

  const handleDelete = () => {
    if (assetId && onDelete) {
      onDelete(assetId);
      setIsMenuOpen(false);
    }
  };

  const handleCreateExperience = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (assetId && onCreateExperience) onCreateExperience(assetId);
  };

  const handleAddToProduct = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (assetId && onAddToProduct) onAddToProduct(assetId);
  };

  const handleCardClick = () => {
    if (!assetId) return;
    if (isSelectable) {
      onSelect?.(assetId);
      return;
    }
    if (isLinkable) return;
    navigate(`/3d-asset-library/${assetId}`);
  };

  const handleViewProduct = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!linkedProductId) return;
    navigate(`/product-inventory/${linkedProductId}`);
  };

  const handleUnlinkProductMenu = () => {
    if (!assetId || !linkedProductId || !onUnlinkFromProduct) return;
    onUnlinkFromProduct({ assetId, productId: linkedProductId });
    setIsMenuOpen(false);
  };

  const handleEdit = () => {
    if (assetId && onEdit) onEdit(assetId);
    setIsMenuOpen(false);
  };

  const menuItems: MenuItemProps[] = [
    {
      icon: 'solar:pen-linear',
      label: 'Edit',
      onClick: handleEdit,
      menuItemClassName: 'text-neutral-gray-700!',
    },
    ...(hasLinkedProduct
      ? [
          {
            icon: 'solar:link-broken-minimalistic-linear',
            label: 'Unlink',
            onClick: handleUnlinkProductMenu,
            menuItemClassName: 'text-neutral-gray-700!',
          } satisfies MenuItemProps,
        ]
      : []),
    {
      icon: 'solar:download-minimalistic-linear',
      label: 'Download',
      onClick: () => {
        handleDownload();
      },
      menuItemClassName: 'text-neutral-gray-700!',
    },
    {
      showDividerAbove: true,
      icon: 'solar:trash-bin-2-linear',
      label: 'Delete',
      onClick: handleDelete,
      variant: 'danger',
    },
  ];

  const spriteSize = 512 / 3;
  const frames = 15;

  const previewImage = isAIGenerated
    ? image || thumbnailUrl || '/assets/images/versa-thumbnail.webp'
    : image || thumbnailUrl || '';

  return (
    <>
      {viewType === 'grid' && (
        <div
          tabIndex={0}
          className={`group font-metropolis relative h-auto w-full cursor-pointer rounded-xl border ${
            !isExperience && isSelected
              ? 'border-brand'
              : 'border-neutral-gray-200 hover:border-neutral-900'
          } ${!isExperience ? 'cursor-pointer' : ''} ${className ?? ''}`}
          onClick={handleCardClick}
        >
          <div className="flex h-full w-full flex-col">
            <div className="relative flex h-50 items-center justify-center overflow-hidden rounded-tl-xl rounded-tr-xl bg-[#EFF0F6] bg-[url('/assets/images/dotGrid.webp')] bg-cover">
              <div
                className="group-hover:animate-ghost h-full w-42 scale-145 bg-size-[13000px_200px] bg-left bg-no-repeat"
                style={
                  {
                    backgroundSize: `${spriteSize * frames}px ${spriteSize}px`,
                    backgroundImage: `url(${spriteUrl})`,
                    backgroundPositionY: '50%',
                    ['--to-x']: `${-(spriteSize * frames)}px`,
                    ['--from-x']: `-${0}px`,
                    ['--to-y']: `50%`,
                    ['--from-y']: `50%`,
                    ['--frameRate']: `steps(${frames})`,
                  } as React.CSSProperties
                }
              />
              {environmentName && (
                <Chip
                  className="absolute bottom-2.5 max-w-[90%]!"
                  variant="overlay"
                  text={environmentName}
                  leftIcon={
                    <Icon
                      icon="solar:box-minimalistic-linear"
                      className="fill-neutral-gray-100 size-3"
                    />
                  }
                  rightIcon={
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      className="fill-neutral-gray-100 size-3"
                    />
                  }
                />
              )}
              {!isExperience && isSelected && (
                <Icon
                  icon="solar:check-circle-bold"
                  className="text-brand! absolute top-2.5 right-2.5 size-5"
                />
              )}
            </div>

            {isAIGenerated && (
              <Chip
                leftIcon={
                  <VersaAISolidLogoIcon className="fill-neutral-gray-100 size-3" />
                }
                className="absolute top-2 left-2 rounded"
                variant="gradient"
              />
            )}

            {!hasInteractionVariant && (
              <div className="absolute top-2.5 right-2.5 z-10 flex items-start gap-2">
                <Icon
                  icon="solar:download-minimalistic-linear"
                  className="bg-neutral-gray-100 size-6 cursor-pointer rounded-md p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                />
                <MoreOptionsMenu
                  menuItems={
                    isExperience
                      ? menuItems.filter((item) => item.label !== 'Download')
                      : [
                          {
                            icon: 'solar:pen-linear',
                            label: 'Edit',
                            onClick: handleEdit,
                            showDividerBelow: true,
                          },
                          {
                            icon: 'solar:trash-bin-2-linear',
                            label: 'Delete',
                            onClick: handleDelete,
                            variant: 'danger',
                          },
                        ]
                  }
                  triggerIcon="solar:menu-dots-bold"
                  triggerClassName="bg-white"
                />
              </div>
            )}

            <div className="flex flex-col gap-2 p-3">
              <div className="flex w-full flex-col items-start gap-1">
                <div className="flex w-full items-center justify-between gap-1">
                  <span
                    className={`font-metropolis w-full truncate font-medium ${isExperience ? '' : 'text-xs'}`}
                  >
                    {title.includes('Generating 3D Model') === true
                      ? 'Versa AI Model'
                      : title}
                  </span>
                  <span className="bg-neutral-gray-300 rounded-sm px-1 text-[10px] font-semibold uppercase">
                    {fileType}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-neutral-gray-600 font-metropolis text-xs font-normal text-wrap">
                    {category?.name}
                  </span>
                  <span className="text-neutral-gray-600 font-metropolis text-xs font-normal text-wrap uppercase">
                    {' '}
                    •{' '}
                  </span>
                  <span className="text-neutral-gray-600 font-metropolis text-xs font-normal text-wrap uppercase">
                    {fileSize}
                  </span>
                </div>
              </div>

              {/* {experienceModules.length > 0 && ( */}
              <Divider className="border-neutral-gray-200! my-0!" />
              {/* )} */}

              <div className="flex flex-wrap items-center gap-2">
                {experienceModules.length > 0 ? (
                  <ExperienceModules modules={experienceModules} />
                ) : (
                  // <Chip variant="outline-light" text="No experiences created" />
                  <span className="bg-neutral-gray-150 w-fit rounded-lg px-2 py-1 text-[11px]">
                    No experiences created
                  </span>
                )}
              </div>

              {isExperience && (
                <>
                  <Divider className="border-neutral-gray-200! my-0!" />
                  <Button
                    variant="tertiary"
                    className="leading-trim! py-2! text-sm!"
                    content="Create Experience"
                    onClick={handleCreateExperience}
                  />
                  {!hasLinkedProduct ? (
                    <Button
                      variant="ghost"
                      content="Add to Product"
                      className="leading-trim py-2! text-sm!"
                      leftIcon={
                        <Icon icon="solar:link-minimalistic-2-linear" />
                      }
                      onClick={handleAddToProduct}
                    />
                  ) : (
                    <Button
                      variant="secondary"
                      content="View Product"
                      className="leading-trim py-2! text-sm!"
                      rightIcon={<Icon icon="solar:arrow-right-up-linear" />}
                      onClick={handleViewProduct}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewType === 'list' && (
        <div
          key={assetId}
          className={`group flex cursor-pointer items-center justify-between rounded-xl border p-2 ${
            isSelectable && isSelected
              ? 'border-brand bg-[#F5F6FA]'
              : 'border-neutral-gray-300 bg-neutral-gray-100 hover:bg-[#F5F6FA]'
          } ${className}`}
          onClick={handleCardClick}
        >
          <div className="flex items-center gap-3">
            <img
              className="border-neutral-gray-200 size-16 rounded-xl border object-cover"
              src={previewImage}
              alt={title}
            />
            <div className="flex flex-col gap-1">
              {/* <div className="flex flex-col gap-1 self-stretch"> */}
              <p className="font-metropolis text-neutral-gray-900 inline-flex items-center gap-1 text-xs leading-normal font-medium">
                {title}
                {isAIGenerated && (
                  <Chip
                    leftIcon={
                      <VersaAISolidLogoIcon className="fill-neutral-gray-100 size-3" />
                    }
                    text="Generated"
                    variant="gradient"
                  />
                )}
              </p>
              <div className="font-metropolis text-neutral-gray-600 flex items-center gap-1 text-[10px] leading-3.5">
                <span className="font-semibold">{category?.name}</span> •{' '}
                <span className="uppercase">{fileSize}</span> •{' '}
                <span className="bg-neutral-gray-300 text-neutral-gray-900 rounded-sm px-1 text-[10px] font-semibold uppercase">
                  {fileType}
                </span>
              </div>
              {environmentName && (
                <div className="bg-neutral-gray-300 text-neutral-gray-900 inline-flex w-fit items-center gap-0.5 rounded-sm px-1 py-0.5 text-[10px] leading-[1.35] font-semibold">
                  <Icon
                    icon="solar:box-minimalistic-linear"
                    className="size-3"
                  />
                  <span className="max-w-70 truncate capitalize">
                    {environmentName}
                  </span>
                  <Icon icon="solar:arrow-right-up-linear" className="size-3" />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-start justify-end gap-6 px-3 py-1">
            <div className="flex items-center gap-2">
              {experienceModules.length > 0 ? (
                <ExperienceModules
                  modules={experienceModules}
                  isSelected={isSelected}
                  showHover={!isSelectable}
                />
              ) : (
                <Chip variant="outline-light" text="No experiences created" />
              )}
            </div>
            {isExperience && (
              <>
                <Divider className="border-neutral-gray-200! h-full! w-20 rotate-90!" />
                {!hasLinkedProduct ? (
                  <Button
                    variant="ghost"
                    content="Add to Product"
                    className="leading-trim py-2! text-sm!"
                    leftIcon={<Icon icon="solar:link-minimalistic-2-linear" />}
                    onClick={handleAddToProduct}
                  />
                ) : (
                  <Button
                    variant="secondary"
                    content="View Product"
                    className="leading-trim py-2! text-sm!"
                    rightIcon={<Icon icon="solar:arrow-right-up-linear" />}
                    onClick={handleViewProduct}
                  />
                )}
                <Button
                  variant="tertiary"
                  className="leading-trim! py-2! text-sm!"
                  content="Create Experience"
                  onClick={handleCreateExperience}
                />
                <div className="relative" ref={moreOptionRef}>
                  <MoreOptionsMenu menuItems={menuItems} />
                </div>
              </>
            )}
            {isSelectable && (
              <>
                <div className="bg-neutral-gray-200 my-auto h-6 w-px" />
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] ${
                    isSelected
                      ? 'border-brand bg-brand'
                      : 'border-neutral-gray-400 group-hover:border-neutral-gray-900 bg-transparent'
                  }`}
                >
                  {isSelected && (
                    <Icon icon="mdi:check" className="size-3.5 text-white" />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AssetLibraryItem;
