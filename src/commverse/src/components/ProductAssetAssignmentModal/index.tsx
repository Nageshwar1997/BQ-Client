import { useState, useMemo, useEffect } from 'react';
import Modal from '../Modal';
import Button from '../Button';
import Input from '../Input';
import FilterDropdown from '../FilterDropdown';
import ProductListItem, { type ProductData } from '../ProductListItem';
import { Icon } from '@iconify/react';
import type { AssetLibraryItemInteractionVariant } from '../../types';
import SelectA3DModelModal, {
  type SelectModelItem,
} from '../../pages/product-inventory/components/SelectA3DModelModal';
import { ProductInventoryFormModal } from '../../pages/product-inventory/components/ProductInventoryForm';
import {
  useGetProductAssets,
  useGetProductCMS,
} from '../../services/product-service';
import { useGet3DAssets } from '../../services/assets-service';
import type { ProductCMSItem } from '../../types/api.types';
import EmptyState from '../EmptyState';
import PillLoader from '../PillLoader';
import { Link } from 'react-router';
import type { IProductResponse } from '../../types';
import { getCurrencySymbol } from '../../lib/utils';

interface FilterConfig {
  label: string;
  icon?: React.ReactNode;
  options: { id: string; value: string; label: string }[];
}

interface ProductAssetAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  products: ProductData[];
  preselectedAssetId?: string | null;
  productFilters?: FilterConfig[];
  modelInteractionVariant?: AssetLibraryItemInteractionVariant;
  modelConfirmButtonLabel?: string;
  selectionMode?: 'product-and-model' | 'product-only';
  onProductSelect?: (
    product: ProductData
  ) => void | boolean | Promise<void | boolean>;
  onModelConfirm?: (data: {
    selectedProduct: ProductData | null;
    selectedAssetId: string | null;
    interactionVariant: AssetLibraryItemInteractionVariant;
  }) => void;
  initialProduct?: ProductData | null;
  initialStep?: 'product' | 'model';
}

const ProductAssetAssignmentModal = ({
  open,
  onClose,
  products,
  preselectedAssetId,
  productFilters = [],
  modelInteractionVariant = 'linkable',
  modelConfirmButtonLabel = 'Add',
  selectionMode = 'product-and-model',
  onProductSelect,
  onModelConfirm,
  initialProduct = null,
  initialStep = 'product',
}: ProductAssetAssignmentModalProps) => {
  const [modalStep, setModalStep] = useState<'product' | 'model' | 'preview'>(
    'product'
  );
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(
    initialProduct
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setModalStep(initialStep);
      setSelectedProduct(initialProduct);
    }
  }, [open, initialProduct, initialStep]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isSelectingProduct, setIsSelectingProduct] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeFilters, setActiveFilters] = useState<
    Record<string, string | null>
  >({});

  const selectedProductId = selectedProduct?.id?.trim() ?? '';
  const productsQuery = useGetProductCMS({
    search: searchTerm || undefined,
    sortOrder,
  });
  const productAssetsQuery = useGetProductAssets(selectedProductId, {
    enabled: Boolean(selectedProductId) && modalStep === 'model',
  });
  const get3DAssetsQuery = useGet3DAssets({
    productId: selectedProductId,
    enabled: Boolean(selectedProductId) && modalStep === 'model',
  });

  useEffect(() => {
    if (!open) return;
    if (preselectedAssetId) setSelectedAssetId(preselectedAssetId);
  }, [open, preselectedAssetId]);

  const handleClose = () => {
    if (isSelectingProduct) return;
    onClose();
    setIsAddProductModalOpen(false);
    setModalStep('product');
    setSelectedProduct(null);
    setSelectedAssetId(null);
    setSearchTerm('');
    setActiveFilters({});
  };
  const cmsProducts = useMemo<ProductCMSItem[]>(
    () =>
      productsQuery.data?.pages?.flatMap(
        (page) => (page?.data as ProductCMSItem[] | undefined) ?? []
      ) ?? [],
    [productsQuery.data?.pages]
  );

  const cmsMappedProducts = useMemo<ProductData[]>(
    () =>
      cmsProducts.map((product) => ({
        id: product._id,
        image: product.media?.images?.[0]?.url ?? '',
        name: product.productName ?? '',
        category: product.category?.name ?? '',
        price: Number(product.price?.amount ?? 0),
        originalPrice: Number(product.price?.amount ?? 0),
        discountPercent: 0,
        currency:
          product.price?.currency === 'INR'
            ? '₹'
            : (product.price?.currency ?? '₹'),
        description: product.description ?? '',
        models3d:
          product.media?.models3d?.map((model) => ({
            assetId:
              typeof model.assetId === 'string'
                ? model.assetId
                : (model.assetId?._id ??
                  model.assetId?.id ??
                  model.assetId?.assetId ??
                  ''),
            title: model.title ?? '',
            modelUrl: model.modelUrl ?? '',
            spriteUrl: model.spriteUrl ?? '',
            thumbnailUrl: model.thumbnailUrl ?? '',
            fileSize: (model.fileSize ?? model.size)?.toString() ?? '',
          })) ?? [],
      })),
    [cmsProducts]
  );

  const sourceProducts = cmsMappedProducts.length
    ? cmsMappedProducts
    : products;
  const hasProducts = sourceProducts.length > 0;
  const hasSearch = searchTerm.trim().length > 0;
  const hasFilters = Object.values(activeFilters).some(Boolean);
  const isLoadingInitial = productsQuery.isLoading && !hasProducts;

  const filteredProducts = useMemo(() => {
    let next = sourceProducts;

    if (hasSearch) {
      const keyword = searchTerm.toLowerCase();
      next = next.filter((product) =>
        product.name?.toLowerCase().includes(keyword)
      );
    }

    if (hasFilters) {
      next = next.filter((product) =>
        Object.entries(activeFilters).every(([filterLabel, filterValue]) => {
          if (!filterValue) return true;
          if (filterLabel === 'Experiences') {
            return (
              product.modules?.some(
                (module) => module.variant === filterValue
              ) ?? false
            );
          }
          if (filterLabel === 'Assets') {
            if (filterValue === 'generated' || filterValue === 'uploaded') {
              return true;
            }
            return (
              product.modules?.some(
                (module) => module.variant === filterValue
              ) ?? false
            );
          }
          return true;
        })
      );
    }

    return next;
  }, [sourceProducts, hasSearch, searchTerm, hasFilters, activeFilters]);
  const hasFilteredProducts = filteredProducts.length > 0;
  const showEmptyInventory =
    !isLoadingInitial &&
    !productsQuery.isError &&
    !hasSearch &&
    !hasFilters &&
    !hasProducts;
  const showNoSearchResults =
    !isLoadingInitial &&
    !productsQuery.isError &&
    (hasSearch || hasFilters) &&
    !hasFilteredProducts;

  const modelItems = useMemo<SelectModelItem[]>(() => {
    const productAssets = productAssetsQuery.data?.data;
    const linkedProductModels = Array.isArray(productAssets?.models3d)
      ? productAssets.models3d
      : [];
    const linkedAssets = Array.isArray(get3DAssetsQuery.data?.data)
      ? get3DAssetsQuery.data.data
      : [];

    if (linkedProductModels.length > 0) {
      return linkedProductModels.map((linkedAsset: any, index: number) => {
        const linkedAssetId = String(
          linkedAsset?.assetId?._id ??
            linkedAsset?.assetId?.id ??
            linkedAsset?.assetId ??
            linkedAsset?._id ??
            index
        );
        const fullAsset = linkedAssets.find(
          (asset) => String(asset?._id ?? asset?.id ?? '') === linkedAssetId
        );

        return {
          _id: linkedAssetId,
          image: String(
            fullAsset?.thumbnailUrl ??
              fullAsset?.spriteUrl ??
              linkedAsset?.thumbnailUrl ??
              linkedAsset?.spriteUrl ??
              ''
          ),
          title: String(
            fullAsset?.title ?? linkedAsset?.title ?? 'Untitled Model'
          ),
          category: fullAsset?.category ??
            linkedAsset?.category ?? {
              name: selectedProduct?.category ?? 'Uncategorized',
              _id: '',
            },
          modelUrl: String(fullAsset?.modelUrl ?? linkedAsset?.modelUrl ?? ''),
          spriteUrl: String(
            fullAsset?.spriteUrl ??
              linkedAsset?.spriteUrl ??
              linkedAsset?.thumbnailUrl ??
              ''
          ),
          fileType: String(
            fullAsset?.fileType ?? linkedAsset?.fileType ?? 'glb'
          ),
          fileSize: String(
            fullAsset?.fileSize ??
              linkedAsset?.fileSize ??
              linkedAsset?.size ??
              '--'
          ),
          isAIGenerated: Boolean(
            fullAsset?.isAIGenerated ?? linkedAsset?.isAIGenerated
          ),
          productNameLinkedTo:
            linkedAsset?.productNameLinkedTo ??
            fullAsset?.productNameLinkedTo ??
            selectedProduct?.name ??
            null,
          linkedProductId:
            fullAsset?.linkedProductId ??
            selectedProductId ??
            linkedAsset?.productId ??
            null,
          linkedProductIds: Array.isArray(fullAsset?.linkedProductIds)
            ? fullAsset.linkedProductIds
            : Array.isArray(fullAsset?.productIds)
              ? fullAsset.productIds
              : undefined,
        };
      });
    }

    return linkedAssets.map((asset, index) => {
      const assetId = String(asset?._id ?? asset?.id ?? index);
      return {
        _id: assetId,
        image: asset?.thumbnailUrl ?? asset?.image ?? '',
        title: asset?.title ?? 'Untitled Model',
        category: asset?.category ?? {
          name: selectedProduct?.category ?? 'Uncategorized',
          _id: '',
        },
        modelUrl: asset?.modelUrl ?? '',
        spriteUrl: asset?.spriteUrl ?? '',
        fileType: asset?.fileType ?? '3D',
        fileSize: asset?.fileSize ?? '--',
        isAIGenerated: Boolean(asset?.isAIGenerated),
        productNameLinkedTo: asset?.productNameLinkedTo ?? null,
        linkedProductId:
          asset?.linkedProductId ?? asset?.productId ?? asset?.product?._id,
        linkedProductIds: Array.isArray(asset?.linkedProductIds)
          ? asset.linkedProductIds
          : Array.isArray(asset?.productIds)
            ? asset.productIds
            : undefined,
      };
    });
  }, [
    get3DAssetsQuery.data?.data,
    productAssetsQuery.data,
    selectedProduct?.category,
    selectedProduct?.name,
    selectedProductId,
  ]);
  const isLoadingModelItems =
    modalStep === 'model' &&
    Boolean(selectedProductId) &&
    productAssetsQuery.isFetching &&
    modelItems.length === 0;

  const previewProduct = useMemo<IProductResponse | null>(() => {
    if (!selectedProduct) return null;

    return {
      _id: selectedProduct.id,
      productName: selectedProduct.name || 'Untitled Product',
      productId: selectedProduct.id,
      slug: '',
      description: selectedProduct.description ?? '',
      productLink: '',
      subcategory: '',
      media: {
        images: selectedProduct.image
          ? [
              {
                key: '',
                filename: '',
                mimetype: 'image/png',
                size: 0,
                uploadedAt: '',
                url: selectedProduct.image,
              },
            ]
          : [],
        videos: [],
        models3d: [],
      },
      variants: [],
      price: {
        amount: selectedProduct.price ?? 0,
        currency: selectedProduct.currency ?? 'INR',
      },
      isActive: true,
      createdBy: null,
      isDeleted: false,
      deletedAt: null,
      experiences: [],
      createdAt: '',
      updatedAt: '',
      category: { id: '', name: selectedProduct.category || 'Category' },
    };
  }, [selectedProduct]);

  const handleConfirmProductSelection = async () => {
    if (!selectedProduct || !onProductSelect) return;

    try {
      setIsSelectingProduct(true);
      const shouldClose = await onProductSelect(selectedProduct);
      if (shouldClose === false) return;
      handleClose();
    } finally {
      setIsSelectingProduct(false);
    }
  };
  return (
    <>
      <Modal
        open={open && modalStep === 'product' && !isAddProductModalOpen}
        onClose={handleClose}
        className="[&>div]:h-[70vh] [&>div]:min-w-260 [&>div]:overflow-hidden"
      >
        <div className="flex h-full w-full flex-col gap-5 px-10 pt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Select a Product</h2>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                content="Cancel"
                onClick={handleClose}
              />
              <Button
                variant="tertiary"
                leftIcon={<Icon icon="solar:add-circle-linear" />}
                content="Add a New Product"
                onClick={() => setIsAddProductModalOpen(true)}
              />
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search products"
              containerClassName="w-full"
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
            />
            <Button
              variant="secondary"
              onClick={() =>
                setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
              }
              leftIcon={
                <Icon
                  icon={
                    sortOrder === 'asc'
                      ? 'solar:list-arrow-up-minimalistic-linear'
                      : 'solar:list-arrow-down-minimalistic-linear'
                  }
                  className={`size-5! text-[#1C274C] transition-transform duration-200`}
                />
              }
              className="w-fit!"
            />
          </div>

          {/* Filters */}
          {productFilters.length > 0 && (
            <div className="flex items-center gap-3">
              {productFilters.map((filter) => (
                <FilterDropdown
                  key={filter.label}
                  innerLabel={filter.label}
                  leftIcon={filter.icon}
                  options={filter.options}
                  value={activeFilters[filter.label]}
                  onChange={(value) => {
                    setActiveFilters((prev) => ({
                      ...prev,
                      [filter.label]:
                        (value as { value: string } | null)?.value ?? null,
                    }));
                  }}
                />
              ))}
            </div>
          )}

          <div className="min-h-0 flex-1 overflow-y-auto pb-4">
            {isLoadingInitial && (
              <div className="flex min-h-[40vh] w-full items-center justify-center">
                <PillLoader description="" />
              </div>
            )}

            {!isLoadingInitial && productsQuery.isError && (
              <EmptyState
                iconSrc="/assets/icons/file-send.svg"
                iconAlt="product-load-error"
                title="Unable to load products"
                description="Please try again."
                actions={
                  <Button
                    variant="tertiary"
                    content="Retry"
                    onClick={() => productsQuery.refetch()}
                  />
                }
              />
            )}

            {showEmptyInventory && (
              <EmptyState
                iconSrc="/assets/icons/file-send.svg"
                iconAlt="empty-product-inventory"
                title="Your Product Inventory Is Empty"
                description="Add your first product to start linking assets."
              />
            )}

            {showNoSearchResults && (
              <>
                <EmptyState
                  iconSrc="/assets/icons/file-send.svg"
                  iconAlt="no-search-results"
                  title="No results found"
                  description={
                    hasSearch
                      ? `No products found for "${searchTerm}".`
                      : 'No products found for selected filters.'
                  }
                  actions={
                    <Link to="/product-inventory/add">
                      <Button
                        variant="tertiary"
                        leftIcon={
                          <Icon
                            icon="solar:box-minimalistic-linear"
                            className="size-5"
                          />
                        }
                        content="Create Product"
                      />
                    </Link>
                  }
                />
              </>
            )}

            {!isLoadingInitial &&
              !productsQuery.isError &&
              !showEmptyInventory &&
              !showNoSearchResults && (
                <ProductListItem
                  data={filteredProducts}
                  selectedId={selectedProduct?.id ?? null}
                  onSelect={(product) => {
                    if (selectionMode === 'product-only') {
                      setSelectedProduct(product);
                      setModalStep('preview');
                      return;
                    }

                    setSelectedProduct(product);
                    setModalStep('model');
                  }}
                />
              )}
          </div>
        </div>
      </Modal>

      {selectionMode === 'product-and-model' && (
        <SelectA3DModelModal
          open={open && modalStep === 'model' && !isAddProductModalOpen}
          models={modelItems}
          isLoading={isLoadingModelItems}
          selectedModelId={selectedAssetId}
          interactionVariant={modelInteractionVariant}
          confirmButtonLabel={modelConfirmButtonLabel}
          selectedProduct={selectedProduct}
          onSelectModel={setSelectedAssetId}
          onClearSelectedProduct={() => {
            setModalStep('product');
            setSelectedProduct(null);
            setSelectedAssetId(null);
          }}
          onBack={() => {
            setModalStep('product');
            setSelectedProduct(null);
            setSelectedAssetId(null);
          }}
          onClose={handleClose}
          onConfirm={() => {
            onModelConfirm?.({
              selectedProduct,
              selectedAssetId,
              interactionVariant: modelInteractionVariant,
            });
          }}
        />
      )}

      {selectionMode === 'product-only' && previewProduct && (
        <Modal
          open={open && modalStep === 'preview' && !isAddProductModalOpen}
          onClose={handleClose}
          className="font-metropolis w-full [&>div]:max-w-260"
        >
          <div className="bg-auth-img flex h-137.5 w-full flex-col items-center justify-center gap-5 p-10">
            <div className="border-neutral-gray-200 bg-neutral-gray-100 grid h-auto min-h-73.25 w-fit max-w-3xl min-w-183.25 grid-cols-2 overflow-hidden rounded-3xl border shadow-[0_290px_81px_0_rgba(56,75,159,0.00),0_186px_74px_0_rgba(56,75,159,0.01),0_104px_63px_0_rgba(56,75,159,0.05),0_46px_46px_0_rgba(56,75,159,0.09),0_12px_26px_0_rgba(56,75,159,0.10)]">
              <img
                src={
                  previewProduct.media.images[0]?.url || selectedProduct?.image
                }
                alt="Product Image"
                className="h-full w-fit min-w-91.5 object-cover"
              />
              <div className="min-w-0 flex-1 p-6">
                <div className="flex flex-col gap-5">
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="text-neutral-gray-900 line-clamp-4 text-base/[19px] font-semibold">
                      {previewProduct.productName}
                    </div>
                    <div className="text-neutral-gray-600 line-clamp-6 text-[10px]/[13px]">
                      {previewProduct.description}
                    </div>
                    <div className="text-neutral-gray-600 mt-3 text-[10px]/[13px] font-medium">
                      PRICE
                    </div>
                    <div className="text-neutral-gray-900 mt-1 flex gap-px text-base/[19px] font-semibold">
                      <span>
                        {getCurrencySymbol(previewProduct.price?.currency)}
                      </span>
                      <span>{previewProduct.price?.amount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                content="Back"
                variant="tertiary"
                size="sm"
                onClick={() => setModalStep('product')}
                leftIcon={
                  <Icon icon="solar:arrow-left-linear" className="size-5" />
                }
                disabled={isSelectingProduct}
              />
              <Button
                content="Select Product"
                size="sm"
                isLoading={isSelectingProduct}
                onClick={() => handleConfirmProductSelection()}
                disabled={isSelectingProduct}
              />
            </div>
          </div>
        </Modal>
      )}

      <ProductInventoryFormModal
        open={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
        closeOnOutsideClick={false}
      />
    </>
  );
};

export default ProductAssetAssignmentModal;
