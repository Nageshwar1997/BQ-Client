import { useEffect, useMemo, useRef, useState } from 'react';
import { AssetLibraryItem } from '../../components/AssetLibraryItem';
import { assetModuleData } from '../../data';
import Button from '../../components/Button';
import { ExperienceFilterIcon, VersaAISolidLogoIcon } from '../../icons';
import { Link, useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import { Tab } from '../../components/Tab';
import { useInView } from 'react-intersection-observer';
import FilterDropdown from '../../components/FilterDropdown';
import ProductAssetAssignmentModal from '../../components/ProductAssetAssignmentModal';
import {
  useDelete3DAsset,
  useGet3DAssets,
} from '../../services/assets-service';
import { useGetCategories } from '../../services/category-service';
import { useModelStore } from '../../lib/store';
import ToastCard from '../../components/AlertCards/ToastCard';
import TopHeader from '../../components/TopHeader';
import Upload3DAssetForm from './components/Upload3DAssetForm';
import PillLoader from '../../components/PillLoader';
import CreateExperimentModal from './components/CreateExperimentModal';
import IconInput from '../../components/IconInput';
import type {
  AssetLibraryItemProps,
  ModuleData,
  SelectedOption,
} from '../../types';
import DeleteAssetModal from '../../components/DeleteAssetModal';
import ProductResultModal from '../virtual-tryon/component/ProductResultModal';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateExperience } from '../../services/experience-services';
import { get3DAssetId } from '../../services/api';
import EmptyState from '../../components/EmptyState';
import { Controller, useForm } from 'react-hook-form';
import {
  useLink3DAssetToProduct,
  useUnlink3DAssetFromProduct,
} from '../../services/product-service';
import type { ProductData } from '../../components/ProductListItem';
import { getDefaultPayload, mapExperienceTypeToVariant } from '../../lib/utils';

interface AssetEditPrefillData {
  id: string;
  title: string;
  categoryId: string;
  modelUrl: string;
}

export const viewTabs = [
  {
    id: 1,
    leftIcon: <Icon icon="solar:widget-linear" className="size-5" />,
    value: 'grid',
  },
  {
    id: 2,
    leftIcon: <Icon icon="solar:list-linear" className="size-5" />,
    value: 'list',
  },
];

export const experienceOptions = [
  { id: '3d-visualizer', value: '3d-visualizer', label: '3D Visualizer' },
  { id: 'ar-studio', value: 'ar-studio', label: 'AR Experience' },
  { id: 'virtual-try-on', value: 'virtual-try-on', label: 'Virtual Try-On' },
  { id: 'immersive-store', value: 'immersive-store', label: 'Virtual Store' },
  { id: 'configurator', value: 'configurator', label: 'Configurator' },
  { id: 'video-ads', value: 'video-ads', label: 'Video Ad' },
];

export const assetOption = [
  { id: 'all', value: 'all', label: 'All Assets' },
  { id: 'generated', value: 'generated', label: 'Generated' },
  { id: 'uploaded', value: 'uploaded', label: 'Uploaded' },
];

interface AssetLibraryFiltersFormValues {
  categoryId: string;
  experienceType: string;
  assetType: string;
  fileType: string;
}

const AssetLibrary = () => {
  const navigate = useNavigate();
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [columns, setColumns] = useState(1);
  const assetGridRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editPrefillData, setEditPrefillData] =
    useState<AssetEditPrefillData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteBlockedModalOpen, setIsDeleteBlockedModalOpen] = useState({
    open: false,
    error: '',
  });
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const [pendingUnlink, setPendingUnlink] = useState<{
    assetId: string;
    productId: string;
  } | null>(null);
  const [linkSuccessProduct, setLinkSuccessProduct] =
    useState<ProductData | null>(null);
  const [isCreateExperienceModalOpen, setIsCreateExperienceModalOpen] =
    useState(false);
  const [createExperienceAssetId, setCreateExperienceAssetId] = useState<
    string | null
  >(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSortOrder, setSelectedSortOrder] = useState<'asc' | 'desc'>(
    'desc'
  );
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const filtersForm = useForm<AssetLibraryFiltersFormValues>({
    defaultValues: {
      categoryId: '',
      experienceType: '',
      assetType: '',
      fileType: '',
    },
  });
  const selectedCategoryId = filtersForm.watch('categoryId');
  const selectedExperienceType = filtersForm.watch('experienceType');
  const selectedAssetType = filtersForm.watch('assetType');
  const selectedFileType = filtersForm.watch('fileType');

  const categoriesQuery = useGetCategories();
  const get3DAssetsQuery = useGet3DAssets({
    searchTerm,
    categoryId: selectedCategoryId || undefined,
    sortOrder: selectedSortOrder,
    experienceType: selectedExperienceType || undefined,
    assetType: selectedAssetType || undefined,
    fileType: selectedFileType || undefined,
  });
  const delete3DAssetQuery = useDelete3DAsset();
  const createExperienceQuery = useCreateExperience();
  const link3DAssetToProductQuery = useLink3DAssetToProduct();
  const unlink3DAssetFromProductQuery = useUnlink3DAssetFromProduct();
  const queryClient = useQueryClient();
  const { status, validationError } = useModelStore();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && get3DAssetsQuery?.hasNextPage) {
      get3DAssetsQuery?.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, get3DAssetsQuery?.hasNextPage, get3DAssetsQuery?.fetchNextPage]);

  const categoryFilterOptions = useMemo(() => {
    if (categoriesQuery.data) {
      return categoriesQuery.data.map(
        (category: { _id: string; name: string }) => ({
          id: category._id,
          value: category._id,
          label: category.name,
        })
      );
    }
    return [];
  }, [categoriesQuery.data]);

  const filters = [
    {
      key: 'categoryId' as const,
      label: 'Category',
      icon: 'solar:widget-2-linear',
      options: categoryFilterOptions,
    },
    {
      key: 'experienceType' as const,
      label: 'Experiences',
      icon: ExperienceFilterIcon,
      options: experienceOptions,
    },
    {
      key: 'assetType' as const,
      label: 'Assets',
      icon: 'solar:box-minimalistic-linear',
      options: assetOption,
    },
    {
      key: 'fileType' as const,
      label: 'Formats',
      icon: 'solar:file-linear',
      options: [
        // { id: 'all', value: 'all', label: 'All' },
        { id: 'glb', value: 'glb', label: 'GLB' },
      ],
    },
  ];

  const handleCardDelete = (id: string) => {
    setSelectedAssetId(id);
    setIsDeleteModalOpen(true);
  };

  const handleOpenAddToModal = (assetId?: string) => {
    if (assetId) setSelectedAssetId(assetId);
    setIsModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAssetId(null);
  };

  const handleDeleteAssetConfirm = async () => {
    const currentDeleteId = selectedAssetId;
    if (!currentDeleteId) return;

    try {
      await delete3DAssetQuery.mutateAsync(currentDeleteId, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ['get-3d-assets'],
            exact: false,
            refetchType: 'active',
          });
          await queryClient.refetchQueries({
            queryKey: ['get-3d-assets'],
            exact: false,
            type: 'active',
          });
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error ?? '');
      const normalizedMessage = errorMessage.replaceAll('"', '').trim();
      if (normalizedMessage.toLowerCase().includes('linked to')) {
        setIsDeleteModalOpen(false);
        setIsDeleteBlockedModalOpen({
          open: true,
          error: normalizedMessage,
        });
      } else {
        setIsDeleteModalOpen(false);
        setIsDeleteBlockedModalOpen({
          open: true,
          error: 'Something went wrong',
        });
      }
    }
  };

  const handleCardSelect = (id: string) => {
    setSelectedAssetId(id);
  };

  const handleCloseModal = (preserveSelection = false) => {
    setIsModalOpen(false);
    if (!preserveSelection) {
      setSelectedAssetId(null);
    }
  };

  const handleLinkAssetToProduct = async ({
    selectedProduct,
    selectedAssetId: selectedModelAssetId,
  }: {
    selectedProduct: ProductData | null;
    selectedAssetId: string | null;
  }) => {
    const productId = selectedProduct?.id;
    const assetId = selectedModelAssetId ?? selectedAssetId;
    if (!productId || !assetId) return;

    await link3DAssetToProductQuery.mutateAsync(
      { productId, assetId },
      {
        onSuccess: async (data) => {
          if (data.success) {
            if (selectedProduct) {
              setLinkSuccessProduct(selectedProduct);
            }
            await queryClient.invalidateQueries({
              queryKey: ['get-3d-assets'],
              exact: false,
              refetchType: 'active',
            });
            await queryClient.refetchQueries({
              queryKey: ['get-3d-assets'],
              exact: false,
              type: 'active',
            });
          }
        },
        onError: async (error) => {
          console.log('Link3DAssetToProduct ~ error:', error);
        },
      }
    );
    handleCloseModal(true);
  };

  const handleOpenCreateExperience = (assetId: string) => {
    setCreateExperienceAssetId(assetId);
    setIsCreateExperienceModalOpen(true);
  };

  const handleOpenUnlinkModal = ({
    assetId,
    productId,
  }: {
    assetId: string;
    productId: string;
  }) => {
    if (!assetId || !productId) return;
    setPendingUnlink({ assetId, productId });
    setIsUnlinkModalOpen(true);
  };

  const handleCloseUnlinkModal = () => {
    setIsUnlinkModalOpen(false);
    setPendingUnlink(null);
  };

  const handleUnlinkAssetFromProduct = async () => {
    if (!pendingUnlink?.assetId || !pendingUnlink?.productId) return;

    await unlink3DAssetFromProductQuery.mutateAsync(
      { productId: pendingUnlink.productId, assetId: pendingUnlink.assetId },
      {
        onSuccess: async (data) => {
          if (data.success) {
            await queryClient.invalidateQueries({
              queryKey: ['get-3d-assets'],
              exact: false,
              refetchType: 'active',
            });
            await queryClient.refetchQueries({
              queryKey: ['get-3d-assets'],
              exact: false,
              type: 'active',
            });
          }
        },
        onError: async (error) => {
          console.log('Unlink3DAssetFromProduct ~ error:', error);
        },
      }
    );
  };

  const handleOpenEditModal = (assetId: string) => {
    const asset = assets.find(
      (a) => String(a?._id ?? a?.id) === String(assetId)
    );
    if (!asset) return;

    const categoryId = asset?.category?._id ?? '';

    setEditPrefillData({
      id: String(asset?._id ?? asset?.id),
      title: String(asset?.title ?? ''),
      categoryId,
      modelUrl: String(asset?.modelUrl ?? ''),
    });
    setIsUploadModalOpen(true);
  };

  const handleCloseCreateExperience = () => {
    setIsCreateExperienceModalOpen(false);
    setCreateExperienceAssetId(null);
  };

  const handleCreateExperience = async ({
    selectedModule,
    assetId,
  }: {
    selectedModule: ModuleData;
    assetId?: string | null;
  }) => {
    if (!assetId || !selectedModule.path) return;

    if (
      selectedModule.path !== '/3d-visualizer' &&
      selectedModule.path !== '/ar-experience'
    ) {
      navigate(`${selectedModule.path}/${assetId}`);
      return;
    }

    try {
      const assetResponse = await get3DAssetId(assetId);
      const modelUrl = assetResponse?.data?.modelUrl;

      if (!modelUrl) return;

      const productId = assetResponse?.data?.linkedProductId;

      const payload = getDefaultPayload(
        modelUrl,
        productId,
        assetId,
        selectedModule.path === '/3d-visualizer'
          ? '3d_visualizer'
          : 'ar_experience'
      );

      if (!payload) return;

      const response = await createExperienceQuery.mutateAsync(payload);
      const experienceId = response?.data?._id;

      if (!experienceId) return;

      navigate(`${selectedModule.path}/${experienceId}`);
    } catch (error) {
      console.error('Failed to create experience:', error);
    }
  };

  const assets = useMemo<AssetLibraryItemProps[]>(() => {
    const source = (get3DAssetsQuery?.data?.data ?? []) as Array<
      Record<string, unknown>
    >;

    return source.map((asset, index) => {
      const modelId = String(asset?._id ?? asset?.id ?? index);
      const rawCategory = asset?.category as
        | { id?: string; _id?: string; name?: string }
        | string
        | null
        | undefined;
      const normalizedCategory =
        typeof rawCategory === 'string'
          ? { name: rawCategory, _id: '' }
          : rawCategory && typeof rawCategory === 'object'
            ? {
                name: String(rawCategory.name ?? 'Uncategorized'),
                _id: String(rawCategory._id ?? rawCategory.id ?? ''),
              }
            : null;

      const backendModuleCategory = (
        Array.isArray(asset?.moduleCategory) ? asset.moduleCategory : []
      ) as NonNullable<AssetLibraryItemProps['moduleCategory']>;
      const experienceModules = Array.isArray(asset?.experiences)
        ? (asset.experiences
            .map((experience: { type?: string; count?: number }) => ({
              title: '',
              variant: mapExperienceTypeToVariant(experience.type),
              count: experience.count ?? 0,
            }))
            .filter((module) => Boolean(module.variant)) as NonNullable<
            AssetLibraryItemProps['moduleCategory']
          >)
        : [];

      return {
        _id: modelId,
        id: modelId,
        image: String(
          asset?.thumbnailUrl ?? asset?.image ?? '/assets/images/thumbnail.webp'
        ),
        modelUrl: String(asset?.modelUrl ?? ''),
        linkedProductId: asset?.linkedProductId
          ? String(asset.linkedProductId)
          : undefined,
        fileType: String(asset?.fileType ?? 'glb'),
        productNameLinkedTo:
          asset?.productNameLinkedTo === null
            ? null
            : String(asset?.productNameLinkedTo ?? ''),
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
  const selectedDeleteAsset = assets.find(
    (asset) => asset._id === selectedAssetId || asset.id === selectedAssetId
  );
  const selectedUnlinkAsset = assets.find(
    (asset) =>
      asset._id === pendingUnlink?.assetId ||
      asset.id === pendingUnlink?.assetId
  );

  const hasFullRow = assets.length >= columns;

  useEffect(() => {
    if (viewType !== 'grid' || assets.length === 0) {
      setColumns(1);
      return;
    }

    const calculateColumns = () => {
      const container = assetGridRef.current;
      if (!container) return;

      const minColumnWidth = 240;
      const gap = 10;
      const cols = Math.floor(
        (container.clientWidth + gap) / (minColumnWidth + gap)
      );
      setColumns(cols || 1);
    };

    calculateColumns();

    const resizeObserver = new ResizeObserver(calculateColumns);
    if (assetGridRef.current) {
      resizeObserver.observe(assetGridRef.current);
    }

    window.addEventListener('resize', calculateColumns);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateColumns);
    };
  }, [assets.length, viewType]);

  const createExperienceAsset = assets.find(
    (a) => a._id === createExperienceAssetId
  );

  const isLoadingInitial =
    get3DAssetsQuery.isFetching && !get3DAssetsQuery.data;
  const isError = get3DAssetsQuery.isError;
  const hasAssets = assets.length > 0;
  const showEmptyLibrary =
    !isLoadingInitial && !isError && !searchTerm && !hasAssets;
  const showNoSearchResults =
    !isLoadingInitial && !isError && searchTerm && !hasAssets;

  const handleCloseLinkSuccessModal = () => {
    setLinkSuccessProduct(null);
  };

  const handleGoToProductDetail = () => {
    if (!linkSuccessProduct?.id) return;
    navigate(`/product-inventory/${linkSuccessProduct.id}`);
    setLinkSuccessProduct(null);
  };

  return (
    <div>
      <TopHeader />
      <div className="flex items-center justify-between gap-3 pt-6 pr-8 pb-3 pl-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-neutral-gray-900 font-metropolis text-[32px] leading-9.75 font-medium">
            3D Asset Library
          </h1>
          <span className="text-neutral-gray-600 font-metropolis text-base font-normal">
            Browse, preview, and manage your 3D assets
          </span>
        </div>
        <div className="flex gap-2">
          <Link to="/versa-ai">
            <Button
              variant="gradient"
              leftIcon={<VersaAISolidLogoIcon className="fill-white" />}
              content="Generate"
              className="h-12! w-fit! py-4!"
            />
          </Link>
          <Button
            variant="tertiary"
            content="Upload"
            leftIcon={<Icon icon="solar:upload-minimalistic-linear" />}
            className="h-12! w-fit!"
            onClick={() => setIsUploadModalOpen(true)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5 pr-8 pl-8">
        <>
          <div className="flex items-center gap-4">
            <IconInput
              placeholder="Search products"
              containerClassName="w-full [&>div>input]:pl-10"
              type="text"
              onChange={(value) => setSearchTerm(value)}
              leftAddon={
                <Icon icon="solar:magnifer-linear" className="size-5!" />
              }
            />
            <Button
              variant="secondary"
              leftIcon={
                <Icon
                  icon={
                    selectedSortOrder === 'asc'
                      ? 'solar:list-arrow-up-minimalistic-linear'
                      : 'solar:list-arrow-down-minimalistic-linear'
                  }
                  className="**:stroke-1.5 text-neutral-gray-900 size-5! transition-transform duration-200 [&>g>path:last-of-type]:text-[#1C274C]"
                />
              }
              onClick={() =>
                setSelectedSortOrder((prev) =>
                  prev === 'desc' ? 'asc' : 'desc'
                )
              }
              className="w-fit!"
            />

            <div>
              <Tab
                data={viewTabs}
                defaultActiveId={1}
                variant="toggle"
                onClick={(item) =>
                  setViewType((item.value as 'grid' | 'list') ?? 'grid')
                }
              />
            </div>
          </div>

          {get3DAssetsQuery?.data && searchTerm && (
            <div className="flex items-center justify-between gap-2">
              <span className="font-metropolis text-[20px] leading-6 font-bold">
                Showing results for "{searchTerm}"
              </span>
              <span className="text-neutral-gray-600 font-metropolis font-me text-base font-normal">
                {get3DAssetsQuery?.data?.totalResults} results
              </span>
            </div>
          )}

          <div className="flex items-center gap-3">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <Controller
                  key={filter.label}
                  name={filter.key}
                  control={filtersForm.control}
                  render={({ field }) => (
                    <FilterDropdown
                      options={filter.options}
                      innerLabel={filter.label}
                      value={field.value || null}
                      onChange={(selected) =>
                        field.onChange(
                          (
                            (selected as SelectedOption | null)?.id ?? ''
                          ).toString()
                        )
                      }
                      leftIcon={
                        typeof IconComponent === 'string' ? (
                          <Icon icon={IconComponent} className="size-4" />
                        ) : (
                          <IconComponent className="size-4" />
                        )
                      }
                    />
                  )}
                />
              );
            })}
          </div>
        </>
        {isLoadingInitial && (
          <div className="flex w-full items-center justify-center py-12">
            <PillLoader description="Loading assets..." />
          </div>
        )}

        {isError && <ToastCard type="error" title="Something went wrong!" />}
        {createExperienceQuery.isError && (
          <ToastCard
            type="error"
            title={'Experience creation failed'}
            description={
              createExperienceQuery.isError
                ? createExperienceQuery.error?.message
                : 'Something went wrong!'
            }
          />
        )}

        {showEmptyLibrary && (
          <EmptyState
            iconSrc="/assets/icons/file-send.svg"
            iconAlt="empty-library"
            title="Your 3D Library Is Empty"
            description={
              <>
                Upload a GLB file or generate a new 3D model <br /> to start
                creating immersive experiences
              </>
            }
            actions={
              <>
                <Link to="/versa-ai">
                  <Button
                    variant="gradient"
                    leftIcon={<VersaAISolidLogoIcon className="fill-white" />}
                    content="Generate 3D Model"
                    size="sm"
                  />
                </Link>
                <Button
                  variant="tertiary"
                  leftIcon={<Icon icon="solar:upload-minimalistic-linear" />}
                  content="Upload 3D Model"
                  size="sm"
                  onClick={() => setIsUploadModalOpen(true)}
                />
              </>
            }
          />
        )}

        {showNoSearchResults && (
          <EmptyState
            iconSrc="/assets/icons/file-send.svg"
            iconAlt="no-results"
            title="No results found"
            description="However, you can generate the same using Versa AI"
            actions={
              <Link to="/versa-ai">
                <Button
                  variant="gradient"
                  leftIcon={<VersaAISolidLogoIcon className="fill-white" />}
                  content={`Generate "${searchTerm}"`}
                  className="w-fit! py-4!"
                />
              </Link>
            }
          />
        )}

        {!isLoadingInitial && !isError && hasAssets && (
          <>
            <div
              ref={assetGridRef}
              id="asset-grid"
              className={`${
                viewType === 'grid'
                  ? !hasFullRow
                    ? 'grid [grid-template-columns:repeat(auto-fit,minmax(240px,250px))]'
                    : 'grid [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]'
                  : 'grid grid-cols-1'
              } gap-2.5`}
            >
              {assets.map((product, index) => {
                const isLastItem = index >= assets.length - 1;
                return (
                  <div
                    key={product._id}
                    ref={isLastItem ? ref : null}
                    className="w-full"
                  >
                    <AssetLibraryItem
                      key={product.id}
                      {...product}
                      isExperience={true}
                      onSelect={handleCardSelect}
                      onDelete={handleCardDelete}
                      onEdit={handleOpenEditModal}
                      onAddToProduct={handleOpenAddToModal}
                      onUnlinkFromProduct={handleOpenUnlinkModal}
                      onCreateExperience={handleOpenCreateExperience}
                      isSelected={selectedAssetId === product.id}
                      viewType={viewType}
                    />
                  </div>
                );
              })}
            </div>

            {get3DAssetsQuery.isFetching && hasAssets && (
              <div className="flex w-full items-center justify-center py-6">
                <PillLoader description="" />
              </div>
            )}
          </>
        )}
      </div>

      <ProductAssetAssignmentModal
        onModelConfirm={({ selectedProduct, selectedAssetId }) =>
          handleLinkAssetToProduct({ selectedProduct, selectedAssetId })
        }
        open={isModalOpen}
        onClose={handleCloseModal}
        products={[]}
        preselectedAssetId={selectedAssetId}
        modelInteractionVariant="linkable"
        productFilters={[
          {
            label: 'Experiences',
            icon: <ExperienceFilterIcon className="size-4 text-[#18181A]" />,
            options: experienceOptions,
          },
          {
            label: 'Assets',
            icon: <Icon icon="solar:box-minimalistic-linear" />,
            options: assetOption,
          },
        ]}
      />
      <CreateExperimentModal
        open={isCreateExperienceModalOpen}
        onClose={handleCloseCreateExperience}
        assetId={createExperienceAssetId}
        previewAlt={createExperienceAsset?.title}
        rightSection={{
          title: 'What would you like to create?',
          ctaLabel: 'Create Experience',
          modules: assetModuleData,
        }}
        onCreate={handleCreateExperience}
        // title={createExperienceAsset?.title}
        image={createExperienceAsset?.spriteUrl}
      />

      {isDeleteModalOpen && (
        <DeleteAssetModal
          open={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          title={selectedDeleteAsset?.title ?? ''}
          image={selectedDeleteAsset?.spriteUrl}
          onConfirm={handleDeleteAssetConfirm}
          isLoading={delete3DAssetQuery.isPending}
          confirmTitle="Are you sure you want to delete this 3D model from your library?"
          successTitle="3D model deleted successfully"
        />
      )}
      {isUnlinkModalOpen && (
        <DeleteAssetModal
          open={isUnlinkModalOpen}
          onClose={handleCloseUnlinkModal}
          title={selectedUnlinkAsset?.title ?? ''}
          image={selectedUnlinkAsset?.spriteUrl}
          onConfirm={handleUnlinkAssetFromProduct}
          isLoading={unlink3DAssetFromProductQuery.isPending}
          confirmTitle="Are you sure you want to unlink this 3D model from the product?"
          confirmButtonLabel="Unlink"
          confirmButtonLoadingLabel="Unlinking..."
          successTitle="3D model unlinked successfully"
        />
      )}

      {isDeleteBlockedModalOpen.open && (
        <ProductResultModal
          open={isDeleteBlockedModalOpen.open}
          onClose={() =>
            setIsDeleteBlockedModalOpen({ open: false, error: '' })
          }
          type="error"
          title="Cannot delete 3D Model."
          description={isDeleteBlockedModalOpen.error}
          product={{
            title: selectedDeleteAsset?.title ?? '3D Model',
            description: 'Model is linked to a product/experience',
            price: 0,
            image: selectedDeleteAsset?.thumbnailUrl ?? '',
          }}
          buttons={{
            content: 'Close',
            variant: 'secondary',
            onClick: () =>
              setIsDeleteBlockedModalOpen({ open: false, error: '' }),
            className: 'w-fit!',
          }}
        />
      )}

      {linkSuccessProduct && (
        <ProductResultModal
          open={Boolean(linkSuccessProduct)}
          onClose={handleCloseLinkSuccessModal}
          type="success"
          title="Successfully added to Product"
          description="3D Model is linked to the Product in your inventory."
          product={{
            title: linkSuccessProduct.name,
            description: linkSuccessProduct.description ?? '',
            price: linkSuccessProduct.price,
            image: linkSuccessProduct.image,
          }}
          className="[&>div:nth-child(2)]:max-w-[50%]"
          buttons={[
            {
              content: 'Continue',
              variant: 'secondary',
              onClick: handleCloseLinkSuccessModal,
              className: 'w-fit!',
            },
            {
              content: 'Go to Product Detail',
              variant: 'tertiary',
              className: 'w-full',
              rightIcon: (
                <Icon
                  icon="solar:round-arrow-right-linear"
                  className="size-5"
                />
              ),
              onClick: handleGoToProductDetail,
            },
          ]}
        />
      )}

      {isUploadModalOpen && (
        <Upload3DAssetForm
          open={isUploadModalOpen}
          editPrefillData={editPrefillData}
          onClose={() => {
            setIsUploadModalOpen(false);
            setEditPrefillData(null);
          }}
        />
      )}

      {status === 'invalid' && (
        <ToastCard
          type="error"
          title={validationError?.title}
          description={validationError?.description}
        />
      )}
    </div>
  );
};

export default AssetLibrary;
