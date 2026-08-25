import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type SubmitHandler,
  type Resolver,
} from 'react-hook-form';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useBlocker, useNavigate, useParams } from 'react-router';
import { Icon } from '@iconify/react';
import Button from '../../../components/Button';
import FilterDropdown from '../../../components/FilterDropdown';
import Input from '../../../components/Input';
import TextArea from '../../../components/TextArea';
import TopHeader from '../../../components/TopHeader';
import IconInput from '../../../components/IconInput';
import Divider from '../../../components/Divider';
import {
  AssetUploader,
  type AssetItem,
} from '../../../components/ImageUploader';
import Modal from '../../../components/Modal';
import { slugify } from '../../../lib/utils';
import { useGetCategories } from '../../../services/category-service';
import {
  useCreateProductCMS,
  useGetProductCMSById,
  useUpdateProductCMS,
} from '../../../services/product-service';
import { VARIANT_DROPDOWN_OPTIONS, defaultVariant } from '../../../constants';
import { productInventorySchema } from '../../../schema/product-inventory.schema';
import type {
  ProductFormData,
  CategoryOption,
  Category,
  ProductCMSItem,
} from '../../../types/api.types';
import VariantRow from './VariantRow';
import ToastCard from '../../../components/AlertCards/ToastCard';
import ProductResultModal from '../../virtual-tryon/component/ProductResultModal';
import SaveWarnModal from '../../../components/Overlay/SaveWarnModal';
import type { IProductResponse, SelectedOption } from '../../../types';

const variantTabs = [
  { id: 'image', leftIcon: <Icon icon="solar:gallery-minimalistic-linear" /> },
  { id: 'pipette', leftIcon: <Icon icon="solar:pipette-linear" /> },
];

const requiredFieldsSchema = productInventorySchema.pick({
  productName: true,
  productId: true,
  categoryId: true,
  price: true,
  productSlug: true,
  media: true,
});

type ProductMediaSnapshot = {
  images: string[];
  videos: string[];
  models3d: string[];
};

const emptyMediaSnapshot: ProductMediaSnapshot = {
  images: [],
  videos: [],
  models3d: [],
};

const getFilenameFromUrl = (url: string, fallback: string) => {
  try {
    const pathname = new URL(url).pathname;
    const name = pathname.split('/').pop();
    return name || fallback;
  } catch {
    return fallback;
  }
};

const getS3KeyFromUrl = (url?: string) => {
  if (!url) return '';
  try {
    const pathname = decodeURIComponent(new URL(url).pathname);
    const normalized = pathname.replace(/^\/+/, '');
    return normalized;
  } catch {
    return decodeURIComponent(url).replace(/^\/+/, '');
  }
};

const normalizeMediaKey = (keyOrUrl?: string, fallbackUrl?: string) => {
  if (!keyOrUrl && !fallbackUrl) return '';
  const raw = (keyOrUrl ?? '').trim();

  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return getS3KeyFromUrl(raw);
  }

  if (raw) {
    return decodeURIComponent(raw).replace(/^\/+/, '');
  }

  return getS3KeyFromUrl(fallbackUrl);
};

const parseSizeToBytes = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)?$/i);
  if (!match) return undefined;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount) || amount < 0) return undefined;
  const unit = (match[2] ?? 'B').toUpperCase();
  const multipliers: Record<string, number> = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };
  return Math.round(amount * (multipliers[unit] ?? 1));
};

const parseContentRangeTotal = (
  contentRange: string | null
): number | undefined => {
  if (!contentRange) return undefined;
  const match = contentRange.match(/\/(\d+)$/);
  if (!match) return undefined;
  const size = Number(match[1]);
  return Number.isFinite(size) ? size : undefined;
};

const fetchAssetSizeFromUrl = async (
  url?: string
): Promise<number | undefined> => {
  if (!url) return undefined;
  try {
    const headResponse = await fetch(url, { method: 'HEAD' });
    const contentLength = headResponse.headers.get('content-length');
    if (contentLength) {
      const size = Number(contentLength);
      if (Number.isFinite(size) && size >= 0) return size;
    }
  } catch {
    // Fallback to ranged request below.
  }

  try {
    const rangeResponse = await fetch(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-0' },
    });
    const contentRange = rangeResponse.headers.get('content-range');
    const total = parseContentRangeTotal(contentRange);
    if (typeof total === 'number' && total >= 0) return total;
  } catch {
    return undefined;
  }

  return undefined;
};

const normalizeAssetId = (value: unknown): string => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    const withId = value as {
      _id?: unknown;
      id?: unknown;
      assetId?: unknown;
      $oid?: unknown;
      toString?: () => string;
    };
    if (typeof withId._id === 'string') return withId._id;
    if (typeof withId.id === 'string') return withId.id;
    if (typeof withId.assetId === 'string') return withId.assetId;
    if (typeof withId.$oid === 'string') return withId.$oid;
    const nested =
      normalizeAssetId(withId._id) ||
      normalizeAssetId(withId.id) ||
      normalizeAssetId(withId.assetId);
    if (nested) return nested;
    if (typeof withId.toString === 'function') {
      const text = withId.toString();
      if (text && text !== '[object Object]') return text;
    }
  }
  return '';
};

type ProductInventoryFormContentProps = {
  onCancel: () => void;
  onDone?: (data: IProductResponse) => void;
  isModal?: boolean;
  isTryOn?: boolean;
  isVirtualStore?: boolean;
};

const ProductInventoryFormContent = ({
  onCancel,
  onDone,
  isModal = false,
  isTryOn = false,
  isVirtualStore = false,
}: ProductInventoryFormContentProps) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createSuccessProduct, setCreateSuccessProduct] = useState<{
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
  } | null>(null);
  const [updateSuccessProduct, setUpdateSuccessProduct] = useState<{
    id: string;
    title: string;
    description: string;
    price: number;
    image: string;
  } | null>(null);
  const [showSaveWarnModal, setShowSaveWarnModal] = useState(false);
  const [isCancelRequested, setIsCancelRequested] = useState(false);
  const shouldBypassBlockerRef = useRef(false);
  const initialMediaSnapshotRef =
    useRef<ProductMediaSnapshot>(emptyMediaSnapshot);
  const didPrefillRef = useRef(false);
  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productInventorySchema) as Resolver<ProductFormData>,
    mode: 'onChange',
    defaultValues: {
      productName: '',
      productId: '',
      categoryId: null,
      price: '',
      productDescription: '',
      productLink: '',
      media: { images: [], videos: [], models: [] },
      variants: [],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray<ProductFormData, 'variants'>({ control, name: 'variants' });
  const categoriesQuery = useGetCategories();
  const createProductCMSMutation = useCreateProductCMS();
  const updateProductCMSMutation = useUpdateProductCMS(id);
  const productByIdQuery = useGetProductCMSById(id);

  const isLoadingCategories = categoriesQuery.isLoading;

  const categoryFilterOptions: CategoryOption[] = useMemo(() => {
    if (!categoriesQuery.data) return [];
    return categoriesQuery.data.map((c: Category) => ({
      id: c._id,
      label: c.name,
    }));
  }, [categoriesQuery.data]);

  const selectedCategoryId = useWatch({ control, name: 'categoryId' });

  const subCategoryFilterOptions: CategoryOption[] = useMemo(() => {
    if (!selectedCategoryId || !categoriesQuery.data) return [];

    const selectedCategory = categoriesQuery.data.find(
      (category: Category) => category._id === selectedCategoryId
    );
    if (!selectedCategory?.subcategories?.length) return [];

    return selectedCategory.subcategories.map(
      (subCategory: { _id?: string; name: string }) => ({
        id: subCategory._id ?? subCategory.name,
        value: subCategory._id ?? subCategory.name,
        label: subCategory.name,
      })
    );
  }, [categoriesQuery.data, selectedCategoryId]);

  const selectedSubCategoryId = useWatch({ control, name: 'subCategoryId' });
  const resolvedSelectedSubCategoryOption = useMemo(() => {
    if (!selectedSubCategoryId) return null;

    return (
      subCategoryFilterOptions.find(
        (option) =>
          option.id === selectedSubCategoryId ||
          option.value === selectedSubCategoryId ||
          option.label === selectedSubCategoryId
      ) ?? null
    );
  }, [selectedSubCategoryId, subCategoryFilterOptions]);

  useEffect(() => {
    if (!selectedSubCategoryId) return;
    const hasMatch = subCategoryFilterOptions.some(
      (option) =>
        option.id === selectedSubCategoryId ||
        option.value === selectedSubCategoryId ||
        option.label === selectedSubCategoryId
    );
    if (!hasMatch) {
      setValue('subCategoryId', null, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [selectedSubCategoryId, setValue, subCategoryFilterOptions]);

  useEffect(() => {
    if (!isEditMode || didPrefillRef.current) return;

    const product = productByIdQuery.data?.data as ProductCMSItem | undefined;
    if (!product) return;

    didPrefillRef.current = true;

    const images =
      product.media?.images?.map((item, index) => {
        const url = item.url ?? '';
        const key = normalizeMediaKey(item.key, url);
        return {
          file: new File([], item.filename ?? `image-${index + 1}.jpg`),
          url,
          name:
            item.filename ?? getFilenameFromUrl(url, `image-${index + 1}.jpg`),
          type: 'image' as const,
          key,
          sizeBytes: parseSizeToBytes(item.size),
        };
      }) ?? [];

    const videos =
      product.media?.videos?.map((item, index) => {
        const url = item.url ?? '';
        const key = normalizeMediaKey(item.key, url);
        return {
          file: new File([], item.filename ?? `video-${index + 1}.mp4`),
          url,
          name:
            item.filename ?? getFilenameFromUrl(url, `video-${index + 1}.mp4`),
          type: 'video' as const,
          key,
          sizeBytes: parseSizeToBytes(item.size),
        };
      }) ?? [];

    const models =
      product.media?.models3d?.map((item, index) => {
        return {
          file: new File([], `${item.title ?? `model-${index + 1}`}.glb`),
          url: item.modelUrl ?? '',
          name: item.title ?? `model-${index + 1}`,
          type: 'model' as const,
          thumbnailUrl: item.thumbnailUrl,
          assetId: normalizeAssetId(item.assetId),
          sizeBytes:
            parseSizeToBytes(item.size) ?? parseSizeToBytes(item.fileSize),
        };
      }) ?? [];

    initialMediaSnapshotRef.current = {
      images: images
        .map((item) => normalizeMediaKey(item.key, item.url))
        .filter((key): key is string => Boolean(key)),
      videos: videos
        .map((item) => normalizeMediaKey(item.key, item.url))
        .filter((key): key is string => Boolean(key)),
      models3d: models
        .map((item) => item.assetId)
        .filter((ref): ref is string => Boolean(ref)),
    };

    const variants =
      product.variants?.map((variant) => {
        const usePipette = variant.editions?.every(
          (ed) => ed.type === 'pipette'
        );
        const editions =
          variant.editions?.map((edition) => {
            if (edition.type === 'pipette') {
              return {
                name: edition.name ?? '',
                imageUrl: '',
                color: edition.hexColor ?? '#000000',
              };
            }

            const mediaIndex = edition.mediaIndex ?? -1;
            return {
              name: edition.name ?? '',
              imageUrl: images[mediaIndex]?.url ?? '',
              color: '#000000',
            };
          }) ?? [];

        return {
          selectedType: variant.type ?? 'other',
          activeTabId: usePipette ? 'pipette' : 'image',
          editions: editions.length
            ? editions
            : [{ name: '', imageUrl: '', color: '#000000' }],
          customType:
            variant.type === 'other' ? (variant.name ?? '') : undefined,
        };
      }) ?? [];

    reset({
      productName: product.productName ?? '',
      productId: product.productId ?? '',
      productSlug: product.slug ?? '',
      productDescription: product.description ?? '',
      productLink: product.productLink ?? '',
      categoryId: product.category?.id ?? null,
      subCategoryId: product.subcategory ?? null,
      price: String(product.price?.amount ?? ''),
      media: { images, videos, models },
      variants,
    });

    const hasMissingModelSizes = models.some(
      (item) => !item.sizeBytes && Boolean(item.url)
    );
    if (!hasMissingModelSizes) return;

    void (async () => {
      const resolvedModels = await Promise.all(
        models.map(async (item) => {
          if (item.sizeBytes || !item.url) return item;
          const sizeBytes = await fetchAssetSizeFromUrl(item.url);
          if (!sizeBytes) return item;
          return { ...item, sizeBytes };
        })
      );

      const hasResolvedAny = resolvedModels.some(
        (item, index) => item.sizeBytes !== models[index]?.sizeBytes
      );
      if (!hasResolvedAny) return;

      setValue('media.models', resolvedModels, {
        shouldDirty: false,
        shouldValidate: false,
      });
    })();
  }, [isEditMode, productByIdQuery.data?.data, reset, setValue]);

  const media = useWatch({ control, name: 'media' });
  const formValues = useWatch({ control });
  const hasFormErrors = Object.keys(errors).length > 0;
  const uploadedAssets = useMemo(
    () => [
      ...(media?.images ?? []),
      ...(media?.videos ?? []),
      ...(media?.models ?? []),
    ],
    [media]
  ) as AssetItem[];
  const isRequiredFieldsValid = useMemo(
    () =>
      requiredFieldsSchema.safeParse({
        productName: formValues?.productName ?? '',
        productId: formValues?.productId ?? '',
        categoryId: formValues?.categoryId ?? null,
        price: formValues?.price ?? '',
        productSlug: formValues?.productSlug ?? '',
        media: formValues?.media ?? { images: [], videos: [], models: [] },
      }).success,
    [formValues]
  );

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      if (isEditMode && !isDirty) return;
      setSubmitError(null);
      const formData = new FormData();

      const imageUrlToIndex = new Map<string, number>();
      data.media.images.forEach((image, index) => {
        imageUrlToIndex.set(image.url, index);
        if (image.file.size > 0) {
          formData.append('images', image.file);
        }
      });
      data.media.videos.forEach((video) => {
        if (video.file.size > 0) {
          formData.append('videos', video.file);
        }
      });

      const newModelsToUpload = data.media.models.filter(
        (model) => !normalizeAssetId(model.assetId) && model.file.size > 0
      );

      for (const model of newModelsToUpload) {
        const spriteFile = model.spriteFile;
        const thumbnailFile = model.thumbnailFile;
        if (!spriteFile || !thumbnailFile) {
          continue;
        }
        formData.append('models', model.file);
        formData.append('sprites', spriteFile);
        formData.append('thumbnails', thumbnailFile);
      }

      const payload = {
        productName: data.productName,
        productId: data.productId,
        slug: data.productSlug,
        description: data.productDescription || undefined,
        productLink: data.productLink.trim()
          ? data.productLink.trim()
          : isEditMode
            ? null
            : undefined,
        categoryId: data.categoryId as string,
        subcategory: data.subCategoryId || 'Others',
        price: {
          amount: Number(data.price),
          currency: 'INR',
        },
        variants: data.variants.map((variant) => ({
          type: variant.selectedType,
          ...(variant.selectedType === 'other' && variant.customType?.trim()
            ? { name: variant.customType.trim() }
            : {}),
          editions: variant.editions
            .map((edition) => {
              if (variant.activeTabId === 'pipette') {
                return {
                  type: 'pipette',
                  name: edition.name,
                  hexColor: edition.color,
                };
              }

              const mediaIndex = imageUrlToIndex.get(edition.imageUrl);
              if (mediaIndex === undefined) {
                return null;
              }

              return {
                type: 'image',
                name: edition.name,
                mediaIndex,
              };
            })
            .filter(Boolean),
        })),
      } as Record<string, unknown>;

      if (isEditMode) {
        const currentImageKeys = Array.from(
          new Set(
            data.media.images
              .filter((item) => item.file.size === 0)
              .map((item) => normalizeMediaKey(item.key, item.url))
              .filter((key): key is string => Boolean(key))
          )
        );
        const currentVideoKeys = Array.from(
          new Set(
            data.media.videos
              .filter((item) => item.file.size === 0)
              .map((item) => normalizeMediaKey(item.key, item.url))
              .filter((key): key is string => Boolean(key))
          )
        );
        const currentModelRefs = Array.from(
          new Set(
            data.media.models
              .map((item) => normalizeAssetId(item.assetId))
              .filter((ref): ref is string => Boolean(ref))
          )
        );

        const initialImageKeys = Array.from(
          new Set(initialMediaSnapshotRef.current.images)
        );
        const initialVideoKeys = Array.from(
          new Set(initialMediaSnapshotRef.current.videos)
        );
        const initialModelRefs = Array.from(
          new Set(initialMediaSnapshotRef.current.models3d)
        );

        const currentImageSet = new Set(currentImageKeys);
        const currentVideoSet = new Set(currentVideoKeys);
        const currentModelSet = new Set(currentModelRefs);

        const removedImages = initialImageKeys.filter(
          (key) => !currentImageSet.has(key)
        );
        const removedVideos = initialVideoKeys.filter(
          (key) => !currentVideoSet.has(key)
        );
        let removedModels = initialModelRefs.filter(
          (ref) => !currentModelSet.has(ref)
        );

        // Safety guard: never delete all existing models while at least one model
        // card still exists in the form state.
        if (
          data.media.models.length > 0 &&
          initialModelRefs.length > 0 &&
          removedModels.length === initialModelRefs.length
        ) {
          removedModels = [];
        }

        if (
          removedImages.length > 0 ||
          removedVideos.length > 0 ||
          removedModels.length > 0
        ) {
          payload.removeMedia = {
            ...(removedImages.length ? { images: removedImages } : {}),
            ...(removedVideos.length ? { videos: removedVideos } : {}),
            ...(removedModels.length ? { models3d: removedModels } : {}),
          };
        }
      }

      formData.append('productDetails', JSON.stringify(payload));

      const response = isEditMode
        ? await updateProductCMSMutation.mutateAsync(formData)
        : await createProductCMSMutation.mutateAsync(formData);
      if (!response?.success) return;

      if (!isEditMode) {
        const created = response.data as ProductCMSItem | undefined;
        if (isVirtualStore && created) {
          onDone?.(created as unknown as IProductResponse);
          return;
        }
        const successPreviewImage =
          created?.media?.images?.[0]?.url ??
          created?.media?.models3d?.[0]?.thumbnailUrl ??
          created?.media?.models3d?.[0]?.spriteUrl ??
          data.media.images?.[0]?.url ??
          data.media.models?.[0]?.thumbnailUrl;

        setCreateSuccessProduct({
          id: created?._id ?? '',
          title: created?.productName ?? data.productName,
          description: created?.description ?? data.productDescription ?? '',
          price: Number(created?.price?.amount ?? data.price ?? 0),
          image: successPreviewImage,
        });
        return;
      }

      const updated = response.data as ProductCMSItem | undefined;
      const updatedProductId = updated?._id ?? id ?? null;
      const updatedPreviewImage =
        updated?.media?.images?.[0]?.url ??
        updated?.media?.models3d?.[0]?.thumbnailUrl ??
        updated?.media?.models3d?.[0]?.spriteUrl ??
        data.media.images?.[0]?.url ??
        data.media.models?.[0]?.thumbnailUrl;

      reset(data);
      setShowSaveWarnModal(false);
      setIsCancelRequested(false);
      shouldBypassBlockerRef.current = false;
      if (blocker.state === 'blocked') {
        blocker.reset();
      }

      onDone?.(response.data);
      setUpdateSuccessProduct({
        id: updatedProductId ?? '',
        title: updated?.productName ?? data.productName,
        description: updated?.description ?? data.productDescription ?? '',
        price: Number(updated?.price?.amount ?? data.price ?? 0),
        image: updatedPreviewImage,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Product save failed';
      setSubmitError(message);
    }
  };

  const isSaving =
    createProductCMSMutation.isPending || updateProductCMSMutation.isPending;
  const isLoadingEditPrefill = isEditMode && productByIdQuery.isLoading;
  const blocker = useBlocker(
    !isEditMode || isTryOn
      ? false
      : ({ currentLocation, nextLocation }) =>
          isDirty &&
          !shouldBypassBlockerRef.current &&
          !isSaving &&
          `${currentLocation.pathname}${currentLocation.search}` !==
            `${nextLocation.pathname}${nextLocation.search}`
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    setShowSaveWarnModal(true);
  }, [blocker]);

  useEffect(() => {
    if (!isEditMode || isTryOn || !isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
    };
  }, [isDirty, isEditMode, isTryOn]);

  const handleContinueEditing = () => {
    setIsCancelRequested(false);
    setShowSaveWarnModal(false);
    if (blocker.state === 'blocked') blocker.reset();
  };

  const handleDiscardChanges = () => {
    if (isCancelRequested) {
      setIsCancelRequested(false);
      setShowSaveWarnModal(false);
      shouldBypassBlockerRef.current = true;
      reset(getValues());
      onCancel();
      setTimeout(() => {
        shouldBypassBlockerRef.current = false;
      }, 0);
      return;
    }

    setShowSaveWarnModal(false);
    if (blocker.state === 'blocked') blocker.proceed();
  };

  const handleSaveAndExit = () => {
    handleSubmit(onSubmit)();
  };

  const handleCancelClick = () => {
    if (isEditMode && isDirty && !isSaving) {
      setIsCancelRequested(true);
      setShowSaveWarnModal(true);
      return;
    }
    onCancel();
  };

  const handleCreateSuccessClose = () => {
    const createdProductId = createSuccessProduct?.id;
    setCreateSuccessProduct(null);
    if (isTryOn) {
      if (createdProductId) {
        onDone?.({ _id: createdProductId } as IProductResponse);
        return;
      }
      onCancel();
      return;
    }
    navigate('/product-inventory');
  };

  const handleUpdateSuccessBackToInventory = () => {
    setUpdateSuccessProduct(null);
    if (isTryOn) {
      onCancel();
      return;
    }
    navigate('/product-inventory');
  };

  const handleUpdateSuccessViewProduct = () => {
    if (isTryOn) {
      setUpdateSuccessProduct(null);
      onCancel();
      return;
    }

    const targetId = updateSuccessProduct?.id || id;
    setUpdateSuccessProduct(null);
    if (targetId) {
      navigate(`/product-inventory/${targetId}`);
      return;
    }
    navigate('/product-inventory');
  };

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col ${
        isModal
          ? 'gap-5 px-8 pt-8 pb-6'
          : 'items-start gap-6 pt-6 pr-12 pb-6 pl-8'
      }`}
    >
      <div className="flex w-full shrink-0 items-center-safe justify-between gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            {isModal && (
              <Icon
                icon="solar:arrow-left-linear"
                className="size-6 shrink-0 cursor-pointer"
                onClick={handleCancelClick}
              />
            )}
            <h1
              className={`text-neutral-gray-900 font-metropolis ${isModal ? 'text-2xl font-semibold' : 'text-[32px] leading-9.75 font-medium'} `}
            >
              {isEditMode ? 'Edit Product' : 'Add a New Product'}
            </h1>
          </div>

          {!isModal && (
            <span className="text-neutral-gray-600 font-metropolis text-base font-normal">
              {isEditMode
                ? 'Edit product details and media to get started'
                : 'Add product details and media to get started'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            content="Cancel"
            variant="secondary"
            className="leading-5!"
            onClick={handleCancelClick}
          />
          <Button
            type="submit"
            content={isSaving ? 'Saving...' : 'Done'}
            onClick={handleSubmit(onSubmit)}
            disabled={
              !isRequiredFieldsValid ||
              hasFormErrors ||
              isSaving ||
              isLoadingEditPrefill ||
              (isEditMode && !isDirty)
            }
            isLoading={isSaving}
          />
        </div>
      </div>

      <div
        className={`flex min-h-0 w-full flex-1 gap-6 ${
          isModal ? 'flex-col lg:flex-row' : ''
        }`}
      >
        <form
          className={`overflow-y-auto ${
            isModal ? 'flex-1 pr-2 pb-10' : 'flex-1 pr-4 pb-16 pl-2'
          }`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4 p-2">
            <Input
              placeholder="Enter product name"
              label="Product Name"
              className="w-full"
              {...register('productName', {
                onChange: (e) =>
                  setValue('productSlug', slugify(e.target.value)),
              })}
              error={errors.productName?.message}
            />
            <Input
              placeholder="e.g. wireless-headphones"
              label="Slug"
              readOnly
              disabled
              className="w-full"
              {...register('productSlug')}
              error={errors.productSlug?.message}
            />
            <TextArea
              placeholder="Enter product description"
              label="Product Description (Optional)"
              className="w-full"
              rows={10}
              {...register('productDescription')}
            />
            <Input
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              label="Product Link (Optional)"
              className="w-full"
              {...register('productLink')}
              error={errors.productLink?.message}
            />

            <div className="flex w-full items-center gap-3">
              <div className="min-w-0 flex-1">
                <Input
                  placeholder="Enter product ID"
                  label="Product ID"
                  className="w-full"
                  {...register('productId')}
                  error={errors.productId?.message}
                />
              </div>

              <div className="min-w-0 flex-1">
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <IconInput
                      placeholder=""
                      label="Price"
                      className="w-full px-3! py-2!"
                      containerClassName=" [&>div>input]:pl-8!"
                      leftAddon={
                        <Icon
                          icon="lucide:indian-rupee"
                          className="text-neutral-gray-500 mr-10 size-4!"
                        />
                      }
                      {...field}
                      error={errors.price?.message}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex w-full gap-3">
              <div className="min-w-0 flex-1">
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <FilterDropdown
                      options={categoryFilterOptions}
                      outerLabel="Category"
                      value={field.value}
                      placeholder={
                        isLoadingCategories ? 'Loading...' : 'Select Category'
                      }
                      className="w-full [&>button]:w-full! [&>button]:px-3.5! [&>button]:py-2.5! [&>button>span:first-child]:font-thin!"
                      onChange={(selected) => {
                        field.onChange(
                          (selected as SelectedOption)?.id ?? null
                        );
                        setValue('subCategoryId', null, {
                          shouldValidate: true,
                        });
                      }}
                      error={errors.categoryId?.message}
                    />
                  )}
                />
              </div>
              <div className="min-w-0 flex-1">
                <Controller
                  name="subCategoryId"
                  control={control}
                  render={({ field }) => (
                    <FilterDropdown
                      options={subCategoryFilterOptions}
                      outerLabel="Sub-Category"
                      value={
                        resolvedSelectedSubCategoryOption?.id ?? field.value
                      }
                      placeholder={
                        !selectedCategoryId
                          ? 'Select Category First'
                          : subCategoryFilterOptions.length
                            ? 'Select Sub-Category'
                            : 'No Sub-Categories'
                      }
                      className="w-full [&>button]:w-full! [&>button]:px-3.5! [&>button]:py-2.5! [&>button>span:first-child]:font-thin!"
                      onChange={(selected) =>
                        field.onChange((selected as SelectedOption)?.id ?? null)
                      }
                      error={errors.subCategoryId?.message}
                    />
                  )}
                />
              </div>
            </div>
            <Divider className="border-neutral-gray-500! my-4!" />

            <div>
              {variantFields.map((field, idx) => (
                <VariantRow
                  key={field.id}
                  variantIndex={idx}
                  control={control}
                  register={register}
                  setValue={setValue}
                  onRemove={() => removeVariant(idx)}
                  variantDropdownOptions={VARIANT_DROPDOWN_OPTIONS}
                  variantTabs={variantTabs}
                  uploadedAssets={uploadedAssets}
                  errors={errors}
                  getValues={getValues}
                />
              ))}
              <Button
                variant="tertiary"
                content="Add Variant Type"
                className="w-fit!"
                leftIcon={<Icon icon="lucide:plus" width={20} height={20} />}
                onClick={() => appendVariant(defaultVariant())}
              />
            </div>
          </div>
        </form>

        <div
          className={`z-10 w-1/2 shrink-0 ${
            isModal ? 'h-[60dvh] pr-2 pb-10' : 'sticky top-6 h-[60dvh]'
          }`}
        >
          <Controller
            name="media"
            control={control}
            render={({ field }) => (
              <AssetUploader
                media={field.value}
                onMediaChange={field.onChange}
                error={errors.media?.message}
              />
            )}
          />
        </div>
      </div>
      {(createProductCMSMutation.isError ||
        updateProductCMSMutation.isError ||
        productByIdQuery.isError ||
        submitError) && (
        <ToastCard
          type="error"
          title={isEditMode ? 'Product Update Failed' : 'Product Added Failed'}
          description={
            submitError ??
            createProductCMSMutation.error?.message ??
            updateProductCMSMutation.error?.message ??
            productByIdQuery.error?.message ??
            'Unable to save product'
          }
          autoClose
          isClosable
        />
      )}
      {createSuccessProduct && (
        <ProductResultModal
          open={Boolean(createSuccessProduct)}
          onClose={handleCreateSuccessClose}
          type="success"
          title="Product added to inventory"
          product={createSuccessProduct}
          showCloseIcon={false}
          buttons={{
            content: isTryOn ? 'Continue' : 'Back to Inventory',
            variant: 'secondary',
            className: 'min-w-48',
            onClick: handleCreateSuccessClose,
          }}
        />
      )}
      {isEditMode && updateSuccessProduct && (
        <ProductResultModal
          open={Boolean(updateSuccessProduct)}
          onClose={handleUpdateSuccessBackToInventory}
          type="success"
          title="Changes updated successfully!"
          product={updateSuccessProduct}
          showLeftSection={false}
          showCloseIcon={false}
          buttons={[
            {
              content: 'Back to Inventory',
              variant: 'secondary',
              // className: 'min-w-48',
              onClick: handleUpdateSuccessBackToInventory,
            },
            {
              content: 'View Product Detail',
              variant: 'tertiary',
              // className: 'min-w-48',
              onClick: handleUpdateSuccessViewProduct,
            },
          ]}
        />
      )}
      {isEditMode && showSaveWarnModal && (
        <SaveWarnModal
          open={showSaveWarnModal}
          showLeftSection={false}
          onClose={handleContinueEditing}
          title="Unsaved Changes"
          subtitle="Would you like to save your progress or discard these changes?"
          continueLabel="Continue Editing"
          footerText=""
          saveExitLabel="Save & Exit"
          discardLabel="Discard Changes"
          onContinueEditing={handleContinueEditing}
          onSaveExit={handleSaveAndExit}
          onDiscardChanges={handleDiscardChanges}
          disableActions={isSaving}
          disableClose={isSaving}
          className="[&>div]:w-96!"
        />
      )}
    </div>
  );
};

type ProductInventoryFormModalProps = {
  open: boolean;
  onClose: () => void;
  onDone?: (data: IProductResponse) => void;
  closeOnOutsideClick?: boolean;
  isTryOn?: boolean;
  isVirtualStore?: boolean;
};

export const ProductInventoryFormModal = ({
  open,
  onClose,
  onDone,
  closeOnOutsideClick = true,
  isTryOn = false,
  isVirtualStore = false,
}: ProductInventoryFormModalProps) => {
  const handleDone = (data: IProductResponse) => {
    onDone?.(data);

    // In TryOn flow, onDone updates query params (id/product) and closes modal
    // by changing `product` state; avoid firing onClose immediately to prevent
    // overriding params in a second update call.
    if (isTryOn) return;

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnOutsideClick={closeOnOutsideClick}
      className="z-50! w-full! [&>div]:h-[80vh] [&>div]:max-w-260"
    >
      <ProductInventoryFormContent
        isModal
        onCancel={onClose}
        onDone={handleDone}
        isTryOn={isTryOn}
        isVirtualStore={isVirtualStore}
      />
    </Modal>
  );
};

const ProductInventoryForm = ({
  className,
  onCancel,
  onDone,
}: {
  className?: string;
  onCancel?: () => void;
  onDone?: (data: IProductResponse) => void;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex size-full grow flex-col overflow-hidden ${className}`}
    >
      <TopHeader />
      <ProductInventoryFormContent
        onCancel={onCancel ?? (() => navigate('/product-inventory'))}
        onDone={onDone}
      />
    </div>
  );
};

export default ProductInventoryForm;
