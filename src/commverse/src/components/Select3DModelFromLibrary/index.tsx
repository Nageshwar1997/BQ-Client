import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import Modal from '../Modal';
import Button from '../Button';
import IconInput from '../IconInput';
import { Tab } from '../Tab';
import { AssetLibraryItem } from '../AssetLibraryItem';
import PillLoader from '../PillLoader';
import { useGet3DAssets } from '../../services/assets-service';
import type { AssetLibraryItemProps } from '../../types';
import { mapExperienceTypeToVariant } from '../../lib/utils';

interface Select3DModelFromLibraryProps {
  open: boolean;
  selectedModelId: string | null;
  onSelectModel: (id: string | null) => void;
  selectedModelIds?: string[];
  onSelectModels?: (ids: string[]) => void;
  multiselect?: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

const viewTabs = [
  {
    id: 1,
    value: 'grid',
    leftIcon: <Icon icon="solar:widget-linear" className="size-5" />,
  },
  {
    id: 2,
    value: 'list',
    leftIcon: <Icon icon="solar:list-linear" className="size-5" />,
  },
];

const Select3DModelFromLibrary = ({
  open,
  selectedModelId,
  onSelectModel,
  selectedModelIds = [],
  onSelectModels,
  multiselect = false,
  onClose,
  onConfirm,
}: Select3DModelFromLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [assetFilter, setAssetFilter] = useState<string | null>(null);
  const get3DAssetsQuery = useGet3DAssets({ searchTerm });

  const selectedIds = multiselect
    ? selectedModelIds
    : selectedModelId
      ? [selectedModelId]
      : [];

  const assets = useMemo<AssetLibraryItemProps[]>(() => {
    const rawAssets = (get3DAssetsQuery?.data?.data ?? []) as Record<
      string,
      unknown
    >[];

    return rawAssets.map((asset, index) => {
      const modelId = String(asset?._id ?? asset?.id ?? index);
      const productNameLinkedTo = asset?.productNameLinkedTo;
      const rawCategory = asset?.category as
        | { name?: string; _id?: string }
        | string
        | null
        | undefined;
      const normalizedCategory =
        typeof rawCategory === 'string'
          ? { name: rawCategory, _id: '' }
          : rawCategory && typeof rawCategory === 'object'
            ? {
                name: String(rawCategory.name ?? 'Uncategorized'),
                _id: String(rawCategory._id ?? ''),
              }
            : null;

      const backendModuleCategory = (
        Array.isArray(asset?.moduleCategory)
          ? asset.moduleCategory
          : []
      ) as NonNullable<AssetLibraryItemProps['moduleCategory']>;
      const experienceModules = Array.isArray(asset?.experiences)
        ? (asset.experiences
            .map((experience: { type?: string; count?: number }) => ({
              title: '',
              variant: mapExperienceTypeToVariant(experience.type),
              count: experience.count ?? 0,
            }))
            .filter((module) => Boolean(module.variant)) as AssetLibraryItemProps['moduleCategory'])
        : [];

      return {
        _id: modelId,
        id: modelId,
        image: String(
          asset?.thumbnailUrl ?? asset?.image ?? '/assets/images/thumbnail.webp'
        ),
        modelUrl: String(asset?.modelUrl ?? ''),
        fileType: String(asset?.fileType ?? 'glb'),
        productNameLinkedTo:
          productNameLinkedTo === null
            ? null
            : String(productNameLinkedTo ?? ''),
        fileSize: String(asset?.fileSize ?? '--'),
        title: String(asset?.title ?? 'Untitled model'),
        category: normalizedCategory,
        isAIGenerated: Boolean(asset?.isAIGenerated),
        environmentName: asset?.environmentName
          ? String(asset.environmentName)
          : undefined,
        moduleCategory:
          backendModuleCategory.length > 0
            ? backendModuleCategory
            : experienceModules,
        spriteUrl: String(asset?.spriteUrl ?? ''),
        thumbnailUrl: String(
          asset?.thumbnailUrl ?? asset?.image ?? '/assets/images/thumbnail.webp'
        ),
      };
    });
  }, [get3DAssetsQuery?.data?.data]);

  const isLoadingInitial =
    get3DAssetsQuery.isFetching && !get3DAssetsQuery.data;
  const isError = get3DAssetsQuery.isError;
  const hasAssets = assets.length > 0;
  const showEmptyLibrary =
    !isLoadingInitial && !isError && !searchTerm && !hasAssets;
  const showNoSearchResults =
    !isLoadingInitial && !isError && searchTerm && !hasAssets;

  const filteredModels = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return assets.filter((model) => {
      const title = model.title.toLowerCase();
      const category = model.category?.name?.toLowerCase() ?? '';
      const fileType = model.fileType.toLowerCase();
      const matchesSearch =
        !query || title.includes(query) || category.includes(query);
      const matchesCategory =
        !categoryFilter ||
        category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesAssetType =
        !assetFilter || fileType === assetFilter.toLowerCase();
      return matchesSearch && matchesCategory && matchesAssetType;
    });
  }, [assetFilter, assets, categoryFilter, searchTerm]);

  const clearSelectedModels = () => {
    onSelectModel(null);
    onSelectModels?.([]);
  };

  const handleCloseWithReset = () => {
    setSearchTerm('');
    setCategoryFilter(null);
    setAssetFilter(null);
    setViewType('list');
    clearSelectedModels();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseWithReset}
      className="[&>div]:h-[70vh] [&>div]:w-260 [&>div]:max-w-260 [&>div]:overflow-hidden [&>div]:rounded-4xl"
    >
      <div className="flex h-full min-h-0 w-full flex-col gap-4 p-8 pb-0!">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Select a 3D Model from Library
          </h2>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              content="Cancel"
              onClick={handleCloseWithReset}
            />
            <Button
              content="Continue"
              onClick={onConfirm}
              disabled={
                selectedIds.length === 0 ||
                !selectedIds.some((id) =>
                  filteredModels.some((model) => (model._id ?? model.id) === id)
                )
              }
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <IconInput
            placeholder="Search products"
            containerClassName="w-full [&>div>input]:pl-10 [&>div>input]:py-2.5!"
            onChange={setSearchTerm}
            leftAddon={
              <Icon icon="solar:magnifer-linear" className="size-5!" />
            }
          />
          <Button
            variant="secondary"
            leftIcon={
              <Icon
                icon="solar:list-arrow-up-minimalistic-linear"
                className="size-5! text-[#1C274C]"
              />
            }
            className="size-10! w-10! p-0!"
          />
          <div className="w-fit">
            <Tab
              data={viewTabs}
              variant="toggle"
              defaultActiveId={viewType === 'grid' ? 1 : 2}
              className="px-3! py-2!"
              onClick={(item) =>
                setViewType((item.value as 'grid' | 'list') ?? 'grid')
              }
            />
          </div>
        </div>

        {/* <div className="flex items-center gap-3">
          <FilterDropdown
            innerLabel="Category"
            leftIcon={<Icon icon="solar:widget-2-linear" />}
            options={categoryOptions}
            value={categoryFilter}
            onChange={(value) =>
              setCategoryFilter(
                (value as { value: string } | null)?.value ?? null
              )
            }
          />
          <FilterDropdown
            innerLabel="Assets"
            leftIcon={<Icon icon="solar:box-minimalistic-linear" />}
            options={assetOptions}
            value={assetFilter}
            onChange={(value) =>
              setAssetFilter((value as { value: string } | null)?.value ?? null)
            }
          />
        </div> */}

        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          {isLoadingInitial && (
            <div className="flex w-full items-center justify-center py-12">
              <PillLoader description="Loading assets..." />
            </div>
          )}

          {isError && (
            <div className="text-neutral-gray-600 rounded-xl border border-dashed p-6 text-center text-sm">
              Something went wrong!
            </div>
          )}

          {showEmptyLibrary && (
            <div className="text-neutral-gray-600 rounded-xl border border-dashed p-6 text-center text-sm">
              Your 3D Library Is Empty
            </div>
          )}

          {showNoSearchResults && (
            <div className="text-neutral-gray-600 rounded-xl border border-dashed p-6 text-center text-sm">
              No results found
            </div>
          )}

          {!isLoadingInitial && !isError && hasAssets && (
            <div
              className={
                viewType === 'grid'
                  ? 'grid grid-cols-4 gap-3'
                  : 'flex flex-col gap-2'
              }
            >
              {filteredModels.length === 0 ? (
                <div className="text-neutral-gray-600 col-span-full rounded-xl border border-dashed p-6 text-center text-sm">
                  No models match selected filters.
                </div>
              ) : (
                filteredModels.map((model) => {
                  const modelId = model._id ?? model.id ?? '';
                  const isSelected = selectedIds.includes(modelId);
                  return (
                    <AssetLibraryItem
                      key={modelId}
                      {...model}
                      _id={modelId}
                      interactionVariant="selectable"
                      isSelected={isSelected}
                      onSelect={(id) => {
                        if (!multiselect) {
                          onSelectModel(id);
                          return;
                        }

                        const nextIds = isSelected
                          ? selectedIds.filter(
                              (selectedId) => selectedId !== id
                            )
                          : [...selectedIds, id];
                        onSelectModels?.(nextIds);
                      }}
                      viewType={viewType}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default Select3DModelFromLibrary;
