import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import Button from '../../../components/Button';
import Userprofile from '../../../components/Userprofile';
import { CreateFillIcon } from '../../../icons';
import type { ProductCMSItem } from '../../../types/api.types';
import {
  AssetsTabDummyData,
  modulesData,
  productExperienceModulesTabData,
} from '../../../data';
import type {
  Asset,
  Experience,
  ExperienceStatus,
  ModuleData,
} from '../../../types';
import { MoreOptionsMenu } from '../../../components/MoreOptionsMenu';
import ExperienceModules from '../../../components/ExperienceModules';
import { AssetLibraryItem } from '../../../components/AssetLibraryItem';
import CreateExperimentModal from '../../3d-asset-library/components/CreateExperimentModal';
import { Tab } from '../../../components/Tab';
import Modal from '../../../components/Modal';
import SuccessStatePanel from '../../../components/SuccessStatePanel';
import RenameModal from '../../../components/Overlay/RenameModal';
import ProductResultModal from '../../virtual-tryon/component/ProductResultModal';
import {
  useDeleteProductCMS,
  useDeleteProductCMSMediaFiles,
  useGetProductAssets,
} from '../../../services/product-service';
import { useGetExperiences } from '../../../services/experience-service';
import {
  useDelete3DAsset,
  useGet3DAssets,
} from '../../../services/assets-service';
import { useUpdateExperience } from '../../../services/experience-services';
import { useDeleteExperience } from '../../../services/experience-services';
import AssetCard from './AssetCard';
import ExperienceCard from './ExperienceCard';
import SectionWithTitle from './SectionTitle';
import SelectA3DModelModal from './SelectA3DModelModal';
import {
  getDefaultPayload,
  getProductPreviewImage,
  handleApiError,
  mapExperienceTypeToVariant,
} from '../../../lib/utils';
import Upload3DAssetForm from '../../3d-asset-library/components/Upload3DAssetForm';
import DeleteAssetModal from '../../../components/DeleteAssetModal';
import { useQueryClient } from '@tanstack/react-query';
import { get3DAssetId } from '../../../services/api';
import { useCreateExperience } from '../../../services/experience-services';
import { SUPPORTED_TRYON_CATEGORIES } from '../../../constants';
import { useGetCategories } from '../../../services/category-service';
import ToastCard from '../../../components/AlertCards/ToastCard';
import { ASSET_BASE_URL, PUBLISH_BASE_URL } from '../../../env';
import { moduleMap } from '../../../constants';
import type { TModules } from '../../../types';
import SaveWarnModal from '../../../components/Overlay/SaveWarnModal';
import {
  ProductInventoryDetailAssetsSectionSkeleton,
  ProductInventoryDetailExperienceSectionSkeleton,
  ProductSummarySkeleton,
} from '../../../skeletons/ProductInventoryDetailSkeleton';

const normalizeModulePath = (path?: string) => {
  if (!path) return '';

  const withLeadingSlash = path.startsWith('/') ? path : `/${path}`;
  const withoutDashboardPrefix = withLeadingSlash.startsWith('/dashboard/')
    ? withLeadingSlash.replace('/dashboard', '')
    : withLeadingSlash;

  if (withoutDashboardPrefix === '/ai-content') return '/versa-ai';

  return withoutDashboardPrefix;
};

const getS3KeyFromUrl = (url?: string) => {
  if (!url) return '';
  try {
    const pathname = decodeURIComponent(new URL(url).pathname);
    return pathname.replace(/^\/+/, '');
  } catch {
    return decodeURIComponent(url).replace(/^\/+/, '');
  }
};

const normalizeEntityId = (value: unknown): string => {
  if (!value) return '';

  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return String(value);

  if (typeof value === 'object') {
    const withId = value as {
      _id?: unknown;
      id?: unknown;
      assetId?: unknown;
      $oid?: unknown;
      toString?: () => string;
    };

    const nested =
      normalizeEntityId(withId._id) ||
      normalizeEntityId(withId.id) ||
      normalizeEntityId(withId.assetId) ||
      normalizeEntityId(withId.$oid);

    if (nested) return nested;

    if (typeof withId.toString === 'function') {
      const text = withId.toString();
      if (text && text !== '[object Object]') return text;
    }
  }

  return '';
};

interface AssetEditPrefillData {
  id: string;
  title: string;
  categoryId: string;
  modelUrl: string;
}

const ProductDetailContent = ({
  selectedProduct,
  isProductSummaryLoading = false,
}: {
  selectedProduct: ProductCMSItem;
  isProductSummaryLoading?: boolean;
}) => {
  const [type, setType] = useState('experience');
  const [section, setSection] = useState('all');
  const [columns, setColumns] = useState(1);
  const [expColumns, setExpColumns] = useState(1);
  const assetGridRef = useRef<HTMLDivElement | null>(null);
  const experienceGridRef = useRef<HTMLDivElement | null>(null);
  const [isSelectModelModalOpen, setIsSelectModelModalOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<ModuleData | null>(null);
  const [isCreateExperienceModalOpen, setIsCreateExperienceModalOpen] =
    useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isDeleteAssetBlockedOpen, setIsDeleteAssetBlockedOpen] =
    useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedMediaAsset, setSelectedMediaAsset] = useState<Asset | null>(
    null
  );
  const [isDeleteAssetModalOpen, setIsDeleteAssetModalOpen] = useState(false);
  const [isUploadAssetModalOpen, setIsUploadAssetModalOpen] = useState(false);
  const [editPrefillData, setEditPrefillData] =
    useState<AssetEditPrefillData | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    description?: string;
  }>({
    open: false,
    type: 'success',
    title: '',
  });
  const [experienceModalState, setExperienceModalState] = useState<
    'delete' | 'rename' | 'none'
  >('none');
  const [selectedExperienceId, setSelectedExperienceId] = useState<
    string | null
  >(null);
  const [selectedExperienceTitle, setSelectedExperienceTitle] = useState('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const showToast = (
    type: 'success' | 'error',
    title: string,
    description?: string
  ) => {
    setToast({ open: true, type, title, description });
    setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 5000);
  };
  const navigate = useNavigate();
  const categoriesQuery = useGetCategories();
  const queryClient = useQueryClient();
  const deleteProductCMSMutation = useDeleteProductCMS();
  const deleteProductCMSMediaFilesMutation = useDeleteProductCMSMediaFiles();
  const delete3DAssetQuery = useDelete3DAsset();
  const updateExperienceMutation = useUpdateExperience();
  const deleteExperienceMutation = useDeleteExperience();
  const selectedProductId = selectedProduct?._id ?? '';
  const selectedProductCategoryName = selectedProduct?.category?.name ?? '';
  const selectedProductCard = {
    id: selectedProductId,
    image: getProductPreviewImage(selectedProduct),
    name: selectedProduct?.productName ?? '',
    description: selectedProduct?.description ?? '',
    category: selectedProduct?.category?.name ?? '',
    price: Number(selectedProduct?.price?.amount ?? 0),
    currency:
      selectedProduct?.price?.currency === 'INR'
        ? '₹'
        : selectedProduct?.price?.currency,
    modules:
      selectedProduct?.experiences?.map((experience) => ({
        variant: mapExperienceTypeToVariant(experience.type),
        count: experience.count ?? 0,
      })) ?? [],
  };

  const allModuleTab = productExperienceModulesTabData.find(
    (item) => item.id === 'all'
  );
  const experienceModuleTabs = productExperienceModulesTabData.filter(
    (item) => item.id !== 'all'
  );

  const getExperiencesQuery = useGetExperiences({
    limit: 10,
    productId: selectedProduct?._id,
    type: type === 'experience' && section !== 'all' ? section : undefined,
  });

  const allExperiencesData: Experience[] = getExperiencesQuery.data?.data ?? [];

  const filteredExperiences =
    section === 'all'
      ? allExperiencesData
      : allExperiencesData.filter((item) => item.type === section);

  const experiencesByStatus = filteredExperiences.reduce(
    (acc, item) => {
      // Normalize status to uppercase to handle both 'published'/'PUBLISHED' and 'draft'/'DRAFT'
      const status = (
        typeof item.status === 'string'
          ? item.status.toUpperCase()
          : item.status
      ) as ExperienceStatus;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(item);
      return acc;
    },
    {} as Record<ExperienceStatus, Experience[]>
  );
  const publishedExperiences = experiencesByStatus.PUBLISHED || [];
  const draftExperiences = experiencesByStatus.DRAFT || [];
  const isExperiencesLoading =
    getExperiencesQuery.isLoading && allExperiencesData.length === 0;

  const isPiblishedExpRowFull = publishedExperiences.length >= expColumns;
  const isDraftExpRowFull = draftExperiences.length >= expColumns;

  const productAssetsQuery = useGetProductAssets(selectedProduct?._id, {
    section: type === 'assets' ? section : 'all',
    enabled: true,
  });

  const get3DAssetsQuery = useGet3DAssets({
    productId: selectedProductId,
    assetType:
      type === 'assets' && (section === 'generated' || section === 'uploaded')
        ? (section as any)
        : 'all',
    enabled: true,
  }); // Retrieve library assets based on type

  const productAssets = (productAssetsQuery.data as any)?.data;

  const uploadedAssets: Asset[] = [
    ...(productAssets?.images?.map((img: any, index: number) => ({
      id: img.key ?? `img-${index}`,
      productId: selectedProductId,
      title: img.filename ?? `Image ${index + 1}`,
      lastUpdated: img.uploadedAt ?? '',
      filesize: String(img.size ?? ''),
      category: selectedProductCategoryName,
      productName: selectedProduct?.productName ?? '',
      image: img.url ?? '',
      imageKey: img.key ?? '',
      format: 'image',
      icons: [],
      assetType: 'uploadedImages' as const,
    })) ?? []),
    ...(productAssets?.videos?.map((vid: any, index: number) => ({
      id: vid.key ?? `vid-${index}`,
      productId: selectedProductId,
      title: vid.filename ?? `Video ${index + 1}`,
      lastUpdated: vid.uploadedAt ?? '',
      filesize: String(vid.size ?? ''),
      category: selectedProductCategoryName,
      productName: selectedProduct?.productName ?? '',
      image: vid.url ?? '',
      imageKey: vid.key ?? '',
      format: 'video',
      icons: [],
      assetType: 'uploadedImages' as const,
    })) ?? []),
  ];

  const allLibraryAssets = (get3DAssetsQuery.data as any)?.data ?? [];
  const selectedProductIdNormalized = normalizeEntityId(selectedProductId);

  const filteredLibraryAssets = allLibraryAssets.filter((asset: any) => {
    if (!selectedProductIdNormalized) return false;

    const linkedIds = [
      asset?.linkedProductId,
      asset?.productId,
      asset?.product?._id,
      asset?.product?.id,
      ...(Array.isArray(asset?.linkedProductIds) ? asset.linkedProductIds : []),
      ...(Array.isArray(asset?.productIds) ? asset.productIds : []),
    ]
      .map((value) => normalizeEntityId(value))
      .filter(Boolean);

    return linkedIds.length === 0
      ? true
      : linkedIds.includes(selectedProductIdNormalized);
  });

  const generatedAssets: Asset[] = filteredLibraryAssets
    .filter((asset: any) => asset.isAIGenerated)
    .map((asset: any, index: number) => ({
      id:
        normalizeEntityId(asset?._id) ||
        normalizeEntityId(asset?.id) ||
        `generated-${index}`,
      productId: selectedProductId,
      title: asset.title || `Generated ${index + 1}`,
      lastUpdated: asset.updatedAt ?? '',
      filesize: asset.fileSize || '',
      category: asset.category?.name || '',
      productName: selectedProduct?.productName ?? '',
      image: asset.thumbnailUrl || '/assets/images/profile.png',
      imageKey: asset.thumbnailKey || asset.key || '',
      format: '3d',
      icons: [],
      assetType: 'generatedImages' as const,
    }));

  const productAssets3DModels =
    productAssets?.models3d?.map((linkedAsset: any, index: number) => {
      const linkedAssetId =
        normalizeEntityId(linkedAsset?.assetId) ||
        normalizeEntityId(linkedAsset?.id) ||
        normalizeEntityId(linkedAsset?._id) ||
        `linked-model-${index}`;

      const fullAsset = allLibraryAssets.find((asset: any) => {
        const assetId =
          normalizeEntityId(asset?._id) || normalizeEntityId(asset?.id);
        return Boolean(assetId) && assetId === linkedAssetId;
      });

      return {
        _id:
          normalizeEntityId(fullAsset?._id) ||
          normalizeEntityId(fullAsset?.id) ||
          linkedAssetId,
        assetId:
          normalizeEntityId(fullAsset?._id) ||
          normalizeEntityId(fullAsset?.id) ||
          linkedAssetId,
        image:
          fullAsset?.thumbnailUrl ||
          fullAsset?.spriteUrl ||
          linkedAsset.thumbnailUrl ||
          '',
        spriteUrl:
          fullAsset?.spriteUrl ||
          linkedAsset.spriteUrl ||
          linkedAsset.thumbnailUrl ||
          linkedAsset.image ||
          '',
        modelUrl: fullAsset?.modelUrl || linkedAsset.modelUrl || '',
        fileType: fullAsset?.fileType || linkedAsset.fileType || '',
        productNameLinkedTo:
          fullAsset?.productNameLinkedTo ||
          linkedAsset.productNameLinkedTo ||
          selectedProduct?.productName,
        fileSize: fullAsset?.fileSize || linkedAsset.fileSize || '',
        title: fullAsset?.title || linkedAsset.title || '',
        isAIGenerated: Boolean(
          fullAsset?.isAIGenerated || linkedAsset?.isAIGenerated
        ),
        category: fullAsset?.category || linkedAsset.category,
        linkedProductId: selectedProductIdNormalized || selectedProductId,
        linkedProductIds: [
          ...(Array.isArray(fullAsset?.linkedProductIds)
            ? fullAsset.linkedProductIds
            : []),
          ...(Array.isArray(fullAsset?.productIds) ? fullAsset.productIds : []),
        ],
      };
    }) ?? [];

  const library3DModels =
    filteredLibraryAssets
      .filter((asset: any) => !asset.isAIGenerated)
      .map((asset: any, index: number) => ({
        _id:
          normalizeEntityId(asset?._id) ||
          normalizeEntityId(asset?.id) ||
          `library-model-${index}`,
        assetId:
          normalizeEntityId(asset?._id) ||
          normalizeEntityId(asset?.id) ||
          `library-model-${index}`,
        image:
          asset.thumbnailUrl || asset.spriteUrl || '/assets/images/profile.png',
        spriteUrl: asset.spriteUrl || asset.thumbnailUrl || asset.image || '',
        modelUrl: asset.modelUrl || '',
        fileType: asset.fileType || 'GLB',
        productNameLinkedTo:
          asset.productNameLinkedTo || selectedProduct?.productName,
        fileSize: asset.fileSize || '',
        title: asset.title || '',
        isAIGenerated: Boolean(asset.isAIGenerated),
        category: asset.category || {
          name: 'Uncategorized',
          _id: 'uncategorized',
        },
        linkedProductId:
          normalizeEntityId(asset.linkedProductId) ||
          normalizeEntityId(asset.productId) ||
          normalizeEntityId(asset?.product?._id) ||
          selectedProductIdNormalized ||
          selectedProductId,
        linkedProductIds: [
          ...(Array.isArray(asset?.linkedProductIds)
            ? asset.linkedProductIds
            : []),
          ...(Array.isArray(asset?.productIds) ? asset.productIds : []),
        ],
      })) ?? [];

  const product3DModelItems = [
    ...productAssets3DModels,
    ...library3DModels,
  ].reduce((acc: any[], current: any) => {
    if (!acc.find((item) => item._id === current._id)) {
      acc.push(current);
    }
    return acc;
  }, []);

  const visibleUploadedAssets = uploadedAssets.filter((asset) => {
    if (section === 'all' || section === 'uploaded') return true;
    if (section === 'images') return asset.format === 'image';
    if (section === 'videos') return asset.format === 'video';
    return false;
  });

  const visibleGeneratedAssets =
    section === 'all' || section === 'generated' || section === '3dModels'
      ? generatedAssets
      : [];

  const visible3DModels =
    section === 'all' || section === '3dModels' || section === 'uploaded'
      ? product3DModelItems
      : [];
  const isAssetsLoading =
    (productAssetsQuery.isLoading || get3DAssetsQuery.isLoading) &&
    visibleUploadedAssets.length === 0 &&
    visibleGeneratedAssets.length === 0 &&
    visible3DModels.length === 0;
  const selectedDeleteAsset = product3DModelItems.find(
    (asset: any) =>
      String(asset?.assetId ?? asset?._id ?? '') ===
      String(selectedAssetId ?? '')
  );

  const hasFullRow = visible3DModels.length >= columns;

  useEffect(() => {
    if (
      type !== 'experience' ||
      (publishedExperiences.length === 0 && draftExperiences.length === 0)
    ) {
      setExpColumns(1);
      return;
    }

    const calculateExpColumns = () => {
      const container = experienceGridRef.current;
      if (!container) return;

      const minColumnWidth = 220;
      const gap = 12;
      const cols = Math.floor(
        (container.clientWidth + gap) / (minColumnWidth + gap)
      );
      setExpColumns(cols || 1);
    };

    calculateExpColumns();

    const resizeObserver = new ResizeObserver(calculateExpColumns);
    if (experienceGridRef.current) {
      resizeObserver.observe(experienceGridRef.current);
    }

    window.addEventListener('resize', calculateExpColumns);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', calculateExpColumns);
    };
  }, [type, section, draftExperiences.length, publishedExperiences.length]);

  useEffect(() => {
    if (type !== 'assets' || visible3DModels.length === 0) {
      setColumns(1);
      return;
    }

    const calculateColumns = () => {
      const container = assetGridRef.current;
      if (!container) return;

      const minColumnWidth = 220;
      const gap = 12;
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
  }, [type, section, visible3DModels.length]);

  const resolvedTryOnSubCategory = useMemo(() => {
    const findSupportedCategory = (value?: string | null) => {
      if (!value) return '';
      return (
        SUPPORTED_TRYON_CATEGORIES.find(
          (category) => category.toLowerCase() === value.trim().toLowerCase()
        ) ?? ''
      );
    };

    const directMatch =
      findSupportedCategory(selectedProduct?.subcategory) ||
      findSupportedCategory(selectedProduct?.category?.name);

    if (directMatch) return directMatch;

    const selectedCategoryId =
      selectedProduct?.category?.id ??
      (selectedProduct?.category as any)?._id ??
      '';
    const selectedSubCategoryKey = selectedProduct?.subcategory ?? '';

    if (!selectedSubCategoryKey || !categoriesQuery.data?.length) return '';

    const categoryFromProduct = categoriesQuery.data.find(
      (category: any) => String(category?._id) === String(selectedCategoryId)
    );

    const categoryBySubcategory = categoriesQuery.data.find((category: any) =>
      (category?.subcategories ?? []).some(
        (subCategory: any) =>
          String(subCategory?._id ?? '').toLowerCase() ===
            String(selectedSubCategoryKey).toLowerCase() ||
          String(subCategory?.name ?? '').toLowerCase() ===
            String(selectedSubCategoryKey).toLowerCase()
      )
    );

    const resolvedCategory = categoryFromProduct ?? categoryBySubcategory;

    const resolvedSubCategoryName = resolvedCategory?.subcategories?.find(
      (subCategory: any) =>
        String(subCategory?._id ?? '').toLowerCase() ===
          String(selectedSubCategoryKey).toLowerCase() ||
        String(subCategory?.name ?? '').toLowerCase() ===
          String(selectedSubCategoryKey).toLowerCase()
    )?.name;

    return findSupportedCategory(resolvedSubCategoryName);
  }, [
    categoriesQuery.data,
    selectedProduct?.category,
    selectedProduct?.subcategory,
  ]);

  const handleEdit = () => {
    if (!selectedProductId) return;
    navigate(`/product-inventory/edit/${selectedProductId}`);
  };
  const handleDelete = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    const productId = selectedProduct?._id;
    if (!productId) return;

    const imageKeys: string[] = Array.from(
      new Set<string>(
        (productAssets?.images ?? [])
          .map((item: any): string => getS3KeyFromUrl(item?.url))
          .filter((key: string) => Boolean(key))
      )
    );

    const videoKeys: string[] = Array.from(
      new Set<string>(
        (productAssets?.videos ?? [])
          .map((item: any): string => getS3KeyFromUrl(item?.url))
          .filter((key: string) => Boolean(key))
      )
    );

    try {
      if (imageKeys.length > 0 || videoKeys.length > 0) {
        const deletePayloads = [
          ...imageKeys.map((imageKey) => ({
            imageKeys: [imageKey],
            videoKeys: [],
          })),
          ...videoKeys.map((videoKey) => ({
            imageKeys: [],
            videoKeys: [videoKey],
          })),
        ];

        for (const payload of deletePayloads) {
          const deletingKey = payload.imageKeys[0] || payload.videoKeys[0];
          console.log('Deleting media key:', deletingKey);
          const deleteMediaResponse =
            await deleteProductCMSMediaFilesMutation.mutateAsync({
              id: productId,
              bodyData: payload,
            });
          if (deleteMediaResponse?.success === false) return;
        }
      }

      const response = await deleteProductCMSMutation.mutateAsync(productId);
      if (response?.success === false) return;

      setIsDeleteConfirmOpen(false);
      setIsDeleteSuccessOpen(true);
    } catch (error) {
      console.error('Failed to delete product media or product:', error);
    }
  };

  const handleOpenCreateExperienceModal = () => {
    setSelectedModule(null);
    setSelectedModelId(null);
    setIsCreateExperienceModalOpen(true);
  };

  const createExperienceQuery = useCreateExperience();

  const handleCreateExperience = async ({
    selectedModule,
    assetId,
  }: {
    selectedModule: ModuleData;
    assetId?: string | null;
  }) => {
    if (!assetId || !selectedModule.path) return;

    const modulePath = normalizeModulePath(selectedModule.path);

    if (!modulePath) return;

    try {
      const assetResponse = await get3DAssetId(assetId);
      const modelUrl = assetResponse?.data?.modelUrl;

      if (!modelUrl) return;

      const productId =
        selectedProductId ||
        String(assetResponse?.data?.linkedProductId ?? '').trim() ||
        (Array.isArray(assetResponse?.data?.linkedProductIds) &&
        assetResponse.data.linkedProductIds.length > 0
          ? String(assetResponse.data.linkedProductIds[0]).trim()
          : '');

      console.log('selected Moduleee: ', selectedModule);
      // return;

      const payload = getDefaultPayload(
        modelUrl,
        productId,
        assetId,
        modulePath === '/3d-visualizer' ? '3d_visualizer' : 'ar_experience'
      );

      console.log('The payloaddd: ', payload);

      if (!payload) return;

      const response = await createExperienceQuery.mutateAsync(payload);
      const experienceId = response?.data?._id;

      if (!experienceId) return;

      navigate(`${modulePath}/${experienceId}`, { replace: true });
    } catch (error) {
      showToast(
        'error',
        'Failed to Create Experience',
        handleApiError({
          error: error as Error,
          fallback: 'There was an error creating the experience.',
        })
      );
      console.error('Failed to create experience:', error);
    }
  };

  const handleConfirmSelectedModel = () => {
    if (!selectedModelId || !selectedModule?.path) return;
    handleCreateExperience({
      selectedModule,
      assetId: selectedModelId,
    });
    setIsSelectModelModalOpen(false);
    setSelectedModelId(null);
    setSelectedModule(null);
  };

  const handleCloseCreateExperienceModal = () => {
    setIsCreateExperienceModalOpen(false);
  };

  const handleCloseSelectModelModal = () => {
    setIsSelectModelModalOpen(false);
    setSelectedModelId(null);
    setSelectedModule(null);
  };

  const handleSelectModuleForExperience = ({
    selectedModule,
  }: {
    selectedModule: ModuleData;
    assetId?: string | null;
  }) => {
    const modulePath = normalizeModulePath(selectedModule.path);

    if (
      modulePath !== '/3d-visualizer' &&
      modulePath !== '/ar-experience' &&
      modulePath
    ) {
      setIsCreateExperienceModalOpen(false);
      setSelectedModule(null);
      setSelectedModelId(null);

      if (modulePath === '/virtual-try-on') {
        const params = new URLSearchParams();

        if (selectedProductId) {
          params.set('id', selectedProductId);
        }

        const productCategoryId =
          selectedProduct?.category?.id ??
          (selectedProduct?.category as any)?._id;
        const subCategoryName = resolvedTryOnSubCategory;

        const search = params.toString();
        navigate({
          pathname:
            productCategoryId && subCategoryName
              ? `/virtual-try-on/${productCategoryId}/${encodeURIComponent(subCategoryName)}`
              : '/virtual-try-on/fashion',
          search: search ? `?${search}` : '',
        });
        return;
      }

      navigate(modulePath);
      return;
    }

    setSelectedModule(selectedModule);
    setSelectedModelId(null);
    setIsSelectModelModalOpen(true);
  };

  const handleBackToCreateExperienceModal = () => {
    setIsSelectModelModalOpen(false);
    setSelectedModelId(null);
    setIsCreateExperienceModalOpen(true);
  };

  const handleOpenEditAssetModal = (assetId: string) => {
    const asset = product3DModelItems.find(
      (item: any) => String(item?._id ?? '') === String(assetId)
    );
    if (!asset) return;
    const resolvedAssetId = String(asset?.assetId ?? asset?._id ?? '');
    if (!resolvedAssetId) return;

    setEditPrefillData({
      id: resolvedAssetId,
      title: String(asset?.title ?? ''),
      categoryId: String(asset?.category?._id ?? ''),
      modelUrl: String(asset?.modelUrl ?? ''),
    });
    setIsUploadAssetModalOpen(true);
  };

  const handleCloseUploadAssetModal = () => {
    setIsUploadAssetModalOpen(false);
    setEditPrefillData(null);
  };

  const handleOpenDeleteAssetModal = (assetId: string) => {
    const asset = product3DModelItems.find(
      (item: any) => String(item?._id ?? '') === String(assetId)
    );
    const resolvedAssetId = String(asset?.assetId ?? asset?._id ?? assetId);
    setSelectedAssetId(resolvedAssetId);
    setIsDeleteAssetModalOpen(true);
  };

  const handleCloseDeleteAssetModal = () => {
    setIsDeleteAssetModalOpen(false);
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
          await queryClient.invalidateQueries({
            queryKey: ['get-product-assets', selectedProduct?._id],
            exact: false,
            refetchType: 'active',
          });
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error ?? '');
      const normalizedMessage = errorMessage.replaceAll('"', '').trim();

      if (
        normalizedMessage ===
        'Cannot delete 3D model. Model is linked to a product.'
      ) {
        setIsDeleteAssetModalOpen(false);
        setSelectedAssetId(null);
        setIsDeleteAssetBlockedOpen(true);
      }
    }
  };

  const handleDeleteMediaAsset = async (asset: Asset): Promise<boolean> => {
    if (!selectedProductId) {
      showToast('error', 'Delete failed', 'Could not resolve product');
      return false;
    }

    const keyFromUrl = getS3KeyFromUrl(asset.image);
    const keyFromImageKey = String(asset.imageKey ?? '').trim();
    const keyFromId = String(asset.id ?? '').trim();
    const idLooksLikeS3Key = keyFromId.includes('/');

    const resolvedKey =
      keyFromUrl || keyFromImageKey || (idLooksLikeS3Key ? keyFromId : '');

    if (!resolvedKey) {
      showToast('error', 'Delete failed', 'Unable to resolve media key');
      return false;
    }

    const isVideoAsset = asset.format === 'video';

    try {
      const response = await deleteProductCMSMediaFilesMutation.mutateAsync({
        id: selectedProductId,
        bodyData: {
          imageKeys: isVideoAsset ? [] : [resolvedKey],
          videoKeys: isVideoAsset ? [resolvedKey] : [],
        },
      });

      if (response?.success === false) {
        showToast('error', 'Delete failed', 'Could not delete selected media');
        return false;
      }

      await queryClient.invalidateQueries({
        queryKey: ['get-product-assets', selectedProduct?._id],
        exact: false,
        refetchType: 'active',
      });

      showToast('success', 'Deleted', `${asset.title} deleted successfully`);
      return true;
    } catch (error) {
      console.error('Failed to delete media asset:', error);
      showToast('error', 'Delete failed', 'Could not delete selected media');
      return false;
    }
  };

  const handleOpenDeleteMediaModal = (asset: Asset) => {
    setSelectedMediaAsset(asset);
  };

  const handleCloseDeleteMediaModal = () => {
    if (deleteProductCMSMediaFilesMutation.isPending) return;
    setSelectedMediaAsset(null);
  };

  // Experience handlers
  const handleExperiencePublish = (experience: any) => {
    const routePath =
      moduleMap[
        (experience.type?.replace('-', '_') as TModules) || 'ar_experience'
      ] || 'experience-editor';
    navigate(`/${routePath}/${experience._id}/settings`);
  };

  const handleExperienceUnpublish = (experience: any) => {
    const routePath =
      moduleMap[
        (experience.type?.replace('-', '_') as TModules) || 'ar_experience'
      ] || 'experience-editor';
    navigate(`/${routePath}/${experience._id}/settings`);
  };

  const handleExperienceDelete = (id: string) => {
    setSelectedExperienceId(id);
    setExperienceModalState('delete');
  };

  const confirmExperienceDelete = () => {
    if (!selectedExperienceId) return;
    deleteExperienceMutation.mutate(selectedExperienceId, {
      onSuccess: () => {
        getExperiencesQuery.refetch();
        showToast(
          'success',
          'Experience Deleted',
          'The experience has been removed successfully.'
        );
        setExperienceModalState('none');
        setSelectedExperienceId(null);
      },
      onError: () => {
        showToast(
          'error',
          'Delete Failed',
          'There was an error deleting the experience. Please try again.'
        );
      },
    });
  };

  const handleExperienceRename = (id: string, currentTitle: string) => {
    setSelectedExperienceId(id);
    setSelectedExperienceTitle(currentTitle);
    setExperienceModalState('rename');
  };

  const confirmExperienceRename = (newTitle: string) => {
    if (!selectedExperienceId) return;
    updateExperienceMutation.mutate(
      {
        id: selectedExperienceId,
        data: { title: newTitle },
      },
      {
        onSuccess: () => {
          getExperiencesQuery.refetch();
          showToast(
            'success',
            'Experience Renamed',
            `Renamed to "${newTitle}"`
          );
          setExperienceModalState('none');
          setSelectedExperienceId(null);
        },
        onError: () => {
          showToast(
            'error',
            'Rename Failed',
            'There was an error renaming the experience. Please try again.'
          );
        },
      }
    );
  };

  const handleExperiencePreview = (experience: any) => {
    const previewLink = `https://${experience.siteInfo?.subdomain}.${PUBLISH_BASE_URL}/${experience.siteInfo?.slug}/${experience.type?.replace('_', '-')}`;
    window.open(previewLink, '_blank');
  };

  const handleExperienceCopyLink = (experience: any) => {
    const previewLink = `https://${experience.siteInfo?.subdomain}.${PUBLISH_BASE_URL}/${experience.siteInfo?.slug}/${experience.type?.replace('_', '-')}`;
    navigator.clipboard.writeText(previewLink);
    showToast('success', 'Link Copied');
  };

  const handleExperienceEdit = (experience: any) => {
    let routePath =
      moduleMap[
        (experience.type?.replace('-', '_') as TModules) || 'ar_experience'
      ] || 'experience-editor';
    if (routePath.includes('try-on')) {
      routePath = 'virtual-try-on';
    }
    console.log(
      'Editing experience:',
      experience._id,
      'with route path:',
      routePath
    );
    navigate(`/${routePath}/${experience._id}`);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSection('all');
  }, [type]);

  // Import RenameModal if not already imported
  // Import ToastCard if not already imported

  return (
    <div className="bg-neutral-gray-100 flex h-full w-full flex-col overflow-hidden">
      {/* Header */}
      <header className="border-neutral-gray-300 flex justify-between border-b py-7 pr-12 pl-8">
        <Link
          to="/product-inventory"
          className="text-neutral-gray-900 font-metropolis flex items-center gap-3 text-lg font-semibold"
        >
          <Icon icon="solar:arrow-left-linear" className="size-6" />
          <h2 className="text-neutral-gray-900 text-2xl font-bold">
            Product Detail
          </h2>
        </Link>
        <Userprofile variant="avatar" />
      </header>

      {/* Product Info Section */}
      {isProductSummaryLoading ? (
        <ProductSummarySkeleton />
      ) : (
        <div className="flex justify-between gap-6 py-5.75 pr-12 pl-8">
          <div className="flex gap-4">
            <div className="relative">
              <img
                src={selectedProductCard.image}
                alt="product"
                className="border-neutral-gray-300 h-30 w-31.5 rounded-xl border bg-[lightgray] object-cover"
                onLoad={() => setIsImageLoaded(true)}
              />
              {!isImageLoaded && (
                <div className="border-neutral-gray-300 bg-neutral-gray-300 absolute inset-0 h-30 w-31.5 animate-pulse rounded-xl border" />
              )}
            </div>

            <div className="flex flex-col gap-1.5 py-2">
              <span className="text-neutral-gray-900 font-metropolis text-base/[19px] font-semibold">
                {selectedProductCard.name}
              </span>
              <p className="text-neutral-gray-600 font-metropolis line-clamp-2 text-xs/[18px] font-normal">
                {selectedProductCard.description}
              </p>
              <div className="text-neutral-gray-900 text-base/[24px] font-medium">
                {selectedProductCard.currency ?? '₹'}{' '}
                {selectedProductCard.price}
              </div>
              <ExperienceModules modules={selectedProductCard.modules} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              content="Create Experience"
              leftIcon={<CreateFillIcon className="size-4 fill-white" />}
              className="h-fit!"
              onClick={handleOpenCreateExperienceModal}
            />
            <MoreOptionsMenu
              triggerClassName="size-10.5 p-[10px] bg-neutral-gray-300"
              menuClassName="mt-4"
              menuItems={[
                {
                  icon: 'solar:pen-new-square-linear',
                  label: 'Edit',
                  onClick: handleEdit,
                  variant: 'default',
                },
                {
                  icon: 'solar:trash-bin-2-linear',
                  label: 'Delete',
                  onClick: handleDelete,
                  variant: 'danger',
                  showDividerAbove: true,
                },
              ]}
            />
          </div>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-5 overflow-hidden pr-12 pb-0 pl-8">
        <Tab
          variant="pill"
          data={[
            {
              id: 'experience',
              title: 'Experiences',
              count: allExperiencesData.length,
            },
            {
              id: 'assets',
              title: 'Assets',
              count:
                uploadedAssets.length +
                generatedAssets.length +
                product3DModelItems.length,
            },
          ]}
          defaultActiveId={'experience'}
          onClick={(item) => {
            setType(item.id as string);
            setSection('all');
          }}
        />

        <div className="min-h-0 flex-1" key={type}>
          {type === 'experience' ? (
            isExperiencesLoading ? (
              <ProductInventoryDetailExperienceSectionSkeleton />
            ) : (
              <div className="flex h-full min-h-0 flex-col gap-5">
                <div className="w-full overflow-x-auto pb-1">
                  <div className="flex max-w-1 items-center gap-2 pr-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSection('all')}
                      className={`font-metropolis shrink-0 rounded-xl border px-5 py-4 text-sm leading-none font-semibold ${
                        section === 'all'
                          ? 'bg-neutral-gray-900 border-neutral-gray-900 text-neutral-gray-100'
                          : 'bg-neutral-gray-100 border-neutral-gray-300 text-neutral-gray-900'
                      }`}
                    >
                      {allModuleTab?.title ?? 'All'}
                    </button>

                    <div className="shrink-0 [&>div]:inline-flex [&>div]:justify-start [&>div]:gap-2">
                      <Tab
                        variant="gradient"
                        data={experienceModuleTabs}
                        defaultActiveId={section === 'all' ? '' : section}
                        className="shrink-0 font-medium! whitespace-nowrap"
                        onClick={(item) => setSection(item.id as string)}
                      />
                    </div>
                  </div>
                </div>

                {/* Experience Sections */}
                <div
                  ref={experienceGridRef}
                  className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1"
                >
                  <SectionWithTitle
                    title="Published Experiences"
                    hasItems={publishedExperiences.length > 0}
                  >
                    <div
                      // id="draft-grid"
                      className={`exp-grid grid gap-3 ${
                        isPiblishedExpRowFull
                          ? '[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]'
                          : '[grid-template-columns:repeat(auto-fit,minmax(220px,230px))]'
                      }`}
                    >
                      {publishedExperiences.map((item: any, index: number) => {
                        return (
                          <ExperienceCard
                            key={`${item.id}-published-${index}`}
                            status={'published'}
                            imageUrl={
                              item.assets?.[0]?.spriteKey
                                ? new URL(
                                    item.assets[0].spriteKey,
                                    ASSET_BASE_URL
                                  ).toString()
                                : ''
                            }
                            title={item.title}
                            updatedAt={
                              item.lastUpdated ||
                              item.updatedAt ||
                              item.createdAt
                            }
                            experienceType={item.type}
                            onPublish={() => handleExperiencePublish(item)}
                            onUnpublish={() => handleExperienceUnpublish(item)}
                            onDelete={() => handleExperienceDelete(item._id)}
                            onRename={() =>
                              handleExperienceRename(item._id, item.title)
                            }
                            onPreview={() => handleExperiencePreview(item)}
                            onCopyLink={() => handleExperienceCopyLink(item)}
                            onEdit={() => handleExperienceEdit(item)}
                          />
                        );
                      })}
                    </div>
                  </SectionWithTitle>

                  <SectionWithTitle
                    title="Drafts"
                    hasItems={draftExperiences.length > 0}
                  >
                    <div
                      className={`exp-grid grid gap-3 ${
                        isDraftExpRowFull
                          ? '[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]'
                          : '[grid-template-columns:repeat(auto-fit,minmax(220px,230px))]'
                      }`}
                    >
                      {draftExperiences.map((item: any, index: number) => {
                        return (
                          <ExperienceCard
                            key={`${item.id}-draft-${index}`}
                            status={
                              item.status === 'PUBLISHED'
                                ? 'published'
                                : 'draft'
                            }
                            imageUrl={
                              item.assets?.[0]?.spriteKey
                                ? new URL(
                                    item.assets[0].spriteKey,
                                    ASSET_BASE_URL
                                  ).toString()
                                : ''
                            }
                            title={item.title}
                            updatedAt={
                              item.lastUpdated ||
                              item.updatedAt ||
                              item.createdAt
                            }
                            experienceType={item.type}
                            onPublish={() => handleExperiencePublish(item)}
                            onUnpublish={() => handleExperienceUnpublish(item)}
                            onDelete={() => handleExperienceDelete(item._id)}
                            onRename={() =>
                              handleExperienceRename(item._id, item.title)
                            }
                            onPreview={() => handleExperiencePreview(item)}
                            onCopyLink={() => handleExperienceCopyLink(item)}
                            onEdit={() => handleExperienceEdit(item)}
                          />
                        );
                      })}
                    </div>
                  </SectionWithTitle>

                  {!getExperiencesQuery.isFetching &&
                    allExperiencesData.length === 0 && (
                      <div className="text-neutral-gray-600 rounded-xl border border-dashed p-10 text-center text-sm">
                        No experience found
                      </div>
                    )}
                </div>
              </div>
            )
          ) : /* Assets Tab Content */ isAssetsLoading ? (
            <ProductInventoryDetailAssetsSectionSkeleton />
          ) : (
            <div className="flex h-full min-h-0 flex-col gap-5">
              <div className="inline-flex min-w-max">
                <Tab
                  variant="static"
                  data={AssetsTabDummyData}
                  defaultActiveId="all"
                  onClick={(item) => setSection(item.id as string)}
                  className="w-fit! justify-start font-semibold!"
                />
              </div>
              <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1">
                <SectionWithTitle
                  title="Product Images & Videos"
                  hasItems={visibleUploadedAssets.length > 0}
                >
                  <div className="grid w-full grid-cols-4 gap-3">
                    {visibleUploadedAssets.map((item, index) => (
                      <AssetCard
                        key={`${item.id}-uploaded-${index}`}
                        item={item}
                        onDelete={handleOpenDeleteMediaModal}
                      />
                    ))}
                  </div>
                </SectionWithTitle>
                <SectionWithTitle
                  title="Generated Images & Videos"
                  hasItems={visibleGeneratedAssets.length > 0}
                >
                  <div className="grid w-full grid-cols-4 gap-3">
                    {visibleGeneratedAssets.map((item, index) => (
                      <AssetCard
                        key={`${item.id}-generated-${index}`}
                        item={item}
                        onDelete={handleOpenDeleteMediaModal}
                      />
                    ))}
                  </div>
                </SectionWithTitle>
                <SectionWithTitle
                  title="3D Models"
                  hasItems={visible3DModels.length > 0}
                >
                  {/* <div className="grid w-full grid-cols-4 gap-3 pb-4"> */}
                  <div
                    ref={assetGridRef}
                    className={`grid gap-3 pb-4 ${hasFullRow ? 'grid [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]' : 'grid [grid-template-columns:repeat(auto-fit,minmax(220px,230px))]'}`}
                    id="asset-grid"
                  >
                    {visible3DModels.map((item: any, index: number) => (
                      <AssetLibraryItem
                        key={`${item._id}-3d-item-${index}`}
                        image={item.image}
                        spriteUrl={item.spriteUrl}
                        modelUrl={item.modelUrl}
                        fileType={item.fileType}
                        productNameLinkedTo={item.productNameLinkedTo}
                        fileSize={item.fileSize}
                        title={item.title}
                        category={item.category}
                        isAIGenerated={item.isAIGenerated}
                        _id={item._id}
                        onEdit={handleOpenEditAssetModal}
                        onDelete={handleOpenDeleteAssetModal}
                        viewType="grid"
                      />
                    ))}
                  </div>
                </SectionWithTitle>

                {!productAssetsQuery.isFetching &&
                  !get3DAssetsQuery.isFetching &&
                  visibleUploadedAssets.length === 0 &&
                  visibleGeneratedAssets.length === 0 &&
                  visible3DModels.length === 0 && (
                    <div className="text-neutral-gray-600 rounded-xl border border-dashed p-10 text-center text-sm">
                      No assets found
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      <SelectA3DModelModal
        open={isSelectModelModalOpen}
        models={product3DModelItems}
        selectedModelId={selectedModelId}
        selectedProduct={selectedProductCard}
        onSelectModel={setSelectedModelId}
        onBack={handleBackToCreateExperienceModal}
        onClose={handleCloseSelectModelModal}
        onConfirm={handleConfirmSelectedModel}
        interactionVariant="selectable"
      />

      <Upload3DAssetForm
        open={isUploadAssetModalOpen}
        onClose={handleCloseUploadAssetModal}
        editPrefillData={editPrefillData}
      />

      <DeleteAssetModal
        open={isDeleteAssetModalOpen}
        onClose={handleCloseDeleteAssetModal}
        title={selectedDeleteAsset?.title ?? ''}
        image={
          selectedDeleteAsset?.spriteUrl || selectedDeleteAsset?.image || ''
        }
        onConfirm={handleDeleteAssetConfirm}
        isLoading={delete3DAssetQuery.isPending}
        confirmTitle="Are you sure you want to delete this 3D model from your product?"
        successTitle="3D model deleted successfully"
      />

      {isDeleteAssetBlockedOpen && (
        <ProductResultModal
          open={isDeleteAssetBlockedOpen}
          onClose={() => setIsDeleteAssetBlockedOpen(false)}
          type="error"
          title="Cannot delete 3D Model."
          description="3D model is linked to the product in your inventory.."
          product={{
            title: selectedProductCard.name,
            description: selectedProductCard.description,
            price: selectedProductCard.price,
            image: selectedProductCard.image,
          }}
          buttons={{
            content: 'Close',
            variant: 'secondary',
            onClick: () => setIsDeleteAssetBlockedOpen(false),
            className: 'w-fit!',
          }}
        />
      )}

      <CreateExperimentModal
        open={isCreateExperienceModalOpen}
        onClose={handleCloseCreateExperienceModal}
        previewAlt={selectedProductCard.name}
        rightSection={{
          title: 'What would you like to create?',
          ctaLabel: 'Create Experience',
          modules:
            modulesData?.filter(
              (module) =>
                module.title !== 'Configurator' && module.title !== 'AI Content'
            ) ?? [],
        }}
        onCreate={handleSelectModuleForExperience}
        rightClassName="[&>div]:grid-cols-2!"
      />

      {isDeleteConfirmOpen && (
        <SaveWarnModal
          open={isDeleteConfirmOpen}
          showLeftSection={false}
          onClose={() => {
            if (
              deleteProductCMSMutation.isPending ||
              deleteProductCMSMediaFilesMutation.isPending
            )
              return;
            setIsDeleteConfirmOpen(false);
          }}
          title="Delete this product?"
          subtitle="All linked product images and videos will be permanently deleted."
          continueLabel="Cancel"
          saveExitLabel="Keep Product"
          discardLabel={
            deleteProductCMSMutation.isPending ||
            deleteProductCMSMediaFilesMutation.isPending
              ? 'Deleting...'
              : 'Delete Product'
          }
          footerText=""
          onContinueEditing={() => setIsDeleteConfirmOpen(false)}
          onSaveExit={() => setIsDeleteConfirmOpen(false)}
          onDiscardChanges={handleConfirmDelete}
          disableActions={
            deleteProductCMSMutation.isPending ||
            deleteProductCMSMediaFilesMutation.isPending
          }
          disableClose={
            deleteProductCMSMutation.isPending ||
            deleteProductCMSMediaFilesMutation.isPending
          }
          className="[&>div]:w-96!"
        />
      )}

      {selectedMediaAsset && (
        <SaveWarnModal
          open={Boolean(selectedMediaAsset)}
          showLeftSection={false}
          showContinueButton={false}
          onClose={handleCloseDeleteMediaModal}
          title={`Delete "${selectedMediaAsset.title}"?`}
          subtitle="This image/video will be permanently deleted."
          saveExitLabel="Cancel"
          discardLabel={
            deleteProductCMSMediaFilesMutation.isPending
              ? 'Deleting...'
              : 'Delete'
          }
          discardButtonClassName="text-ui-error border-ui-error"
          footerText=""
          onContinueEditing={handleCloseDeleteMediaModal}
          onSaveExit={handleCloseDeleteMediaModal}
          onDiscardChanges={async () => {
            if (!selectedMediaAsset) return;
            const deleted = await handleDeleteMediaAsset(selectedMediaAsset);
            if (deleted) {
              setSelectedMediaAsset(null);
            }
          }}
          disableActions={deleteProductCMSMediaFilesMutation.isPending}
          disableClose={deleteProductCMSMediaFilesMutation.isPending}
          className="[&>div]:w-96!"
        />
      )}

      <Modal
        open={isDeleteSuccessOpen}
        onClose={() => setIsDeleteSuccessOpen(false)}
        className="[&>div]:h-[60vh] [&>div]:max-w-130!"
      >
        <SuccessStatePanel
          title="Product deleted successfully"
          buttonLabel="Back to inventory"
          onButtonClick={() => navigate('/product-inventory')}
        />
      </Modal>

      {experienceModalState === 'delete' && (
        <ProductResultModal
          open={experienceModalState === 'delete'}
          onClose={() => {
            setExperienceModalState('none');
            setSelectedExperienceId(null);
          }}
          type="warning"
          title="Are you sure you want to delete this Experience?"
          description="Deleting the experience will stop any published experiences from working"
          showLeftSection={false}
          product={{
            title: selectedProductCard.name,
            description: selectedProductCard.description,
            price: selectedProductCard.price,
            image: selectedProductCard.image,
          }}
          buttons={[
            {
              content: 'Cancel',
              variant: 'secondary',
              onClick: () => {
                setExperienceModalState('none');
                setSelectedExperienceId(null);
              },
            },
            {
              content: 'Delete',
              variant: 'outline',
              className: 'w-full text-ui-error border-ui-error',
              onClick: confirmExperienceDelete,
            },
          ]}
        />
      )}

      {experienceModalState === 'rename' && (
        <RenameModal
          open={true}
          initialValue={selectedExperienceTitle}
          onClose={() => {
            setExperienceModalState('none');
            setSelectedExperienceId(null);
          }}
          onConfirm={(newTitle) => {
            confirmExperienceRename(newTitle);
          }}
        />
      )}

      {toast.open && (
        <ToastCard
          key={Date.now()}
          type={toast.type}
          title={toast.title}
          description={toast.description}
          autoClose={true}
        />
      )}
    </div>
  );
};

export default ProductDetailContent;
