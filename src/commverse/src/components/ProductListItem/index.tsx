import { Icon } from '@iconify/react';
import { experienceSectionData } from '../../data';
import ExperienceModules from '../ExperienceModules';
import type { ExperienceSectionProps, IProductResponse } from '../../types';
import type { ProductCMSItem } from '../../types/api.types';
import Chip from '../Chip';
import { MoreOptionsMenu } from '../MoreOptionsMenu';
import Divider from '../Divider';
import { useState } from 'react';
import ProductResultModal from '../../pages/virtual-tryon/component/ProductResultModal';
import Modal from '../Modal';
import SuccessStatePanel from '../SuccessStatePanel';
import { useNavigate } from 'react-router';
import {
  getProductPreviewImage,
  mapExperienceTypeToVariant,
} from '../../lib/utils';

type SectionVariant = (typeof experienceSectionData)[number]['variant'];

interface ModuleCount {
  variant: SectionVariant;
  count: number;
}

export interface ProductData {
  id: string;
  image: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  modules?: ModuleCount[];
  currency?: string;
  description?: string;
  models3d?: Array<{
    assetId: string;
    title: string;
    modelUrl: string;
    spriteUrl: string;
    thumbnailUrl: string;
    fileSize?: string;
  }>;
}

type ProductListItemData = ProductData | ProductCMSItem | IProductResponse;

const isCMSProduct = (
  item: ProductListItemData
): item is ProductCMSItem | IProductResponse => {
  return '_id' in item;
};

interface ProductListItemProps<T extends ProductListItemData> {
  data: T[];
  selectedId?: string | null;
  onSelect?: (item: T, index: number) => void;
  className?: string;
  onClear?: () => void;
  lastItemRef?: (node: HTMLDivElement | null) => void;
  isActiveOption?: boolean;
  onDeleteProduct?: (id: string) => Promise<unknown> | unknown;
}

const ProductListItem = <T extends ProductListItemData>({
  data,
  selectedId,
  onSelect,
  className,
  onClear,
  lastItemRef,
  isActiveOption = false,
  onDeleteProduct,
}: ProductListItemProps<T>) => {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    image: string;
    title: string;
    description: string;
    price: number;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id || !onDeleteProduct) {
      setDeleteTarget(null);
      return;
    }

    try {
      setIsDeleting(true);
      const response = await onDeleteProduct(deleteTarget.id);
      const didSucceed =
        typeof response === 'object' &&
        response !== null &&
        'success' in response &&
        (response as { success?: boolean }).success === true;

      if (!didSucceed) return;
      setDeleteTarget(null);
      setIsDeleteSuccessOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {data.map((product, index) => {
          const id = isCMSProduct(product) ? product._id : product.id;
          const name = isCMSProduct(product)
            ? product.productName
            : product.name;
          const image = isCMSProduct(product)
            ? getProductPreviewImage(product)
            : product.image;
          const category = isCMSProduct(product)
            ? (product.category?.name ?? 'Uncategorized')
            : product.category;
          const price = isCMSProduct(product)
            ? (product.price?.amount ?? 0)
            : product.originalPrice;
          const currency = isCMSProduct(product)
            ? product.price?.currency === 'INR'
              ? '₹'
              : product.price?.currency
            : (product.currency ?? '₹');
          const modules: ExperienceSectionProps['modules'] = isCMSProduct(
            product
          )
            ? (product.experiences?.map((experience) => ({
                variant: mapExperienceTypeToVariant(experience.type),
                count: experience.count ?? 0,
              })) ?? [])
            : (product.modules ?? []);
          const hasExperiences = modules.some(
            (module) => (module.count ?? 0) > 0
          );
          const isSelected = selectedId === id;
          const isLastItem = index === data.length - 1;

          return (
            <div
              key={`${id}-${index}`}
              ref={isLastItem ? lastItemRef : undefined}
              className={`border-neutral-gray-200 hover:bg-neutral-gray-150 group flex cursor-pointer items-center justify-between gap-10 rounded-xl border p-2 ${
                isSelected ? 'bg-neutral-gray-150' : 'bg-neutral-gray-100'
              } ${className}`}
              onClick={() => onSelect?.(product, index)}
            >
              <div className="flex min-w-0 flex-1 items-center-safe gap-3">
                <div className="relative">
                  <img
                    className="size-12 rounded-xl object-cover"
                    src={image}
                    alt={name}
                    onLoad={() => setIsImageLoaded(true)}
                  />
                  {!isImageLoaded && (
                    <div className="bg-neutral-gray-300 absolute inset-0 size-12 animate-pulse rounded-xl" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-metropolis text-neutral-gray-900 truncate text-xs leading-4.5 font-medium">
                    {name}
                  </p>
                  <div className="font-metropolis text-neutral-gray-600 flex items-center gap-1 text-[10px] leading-3.5">
                    <span className="font-semibold">{category}</span> •{' '}
                    <span>
                      {currency}
                      {price}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-6">
                {hasExperiences ? (
                  <ExperienceModules
                    modules={modules}
                    isSelected={isSelected}
                    showHover
                  />
                ) : (
                  <Chip variant="outline-light" text="No experiences created" />
                )}
                <Divider className="border-neutral-gray-200! h-full! w-6 rotate-90!" />
                {isSelected ? (
                  <Icon
                    icon="solar:close-circle-linear"
                    className="text-neutral-gray-900 size-6"
                    onClick={onClear}
                  />
                ) : (
                  !isActiveOption && (
                    <Icon
                      icon="solar:alt-arrow-right-linear"
                      className="text-neutral-gray-400 group-hover:text-neutral-gray-900 size-6"
                    />
                  )
                )}
                {isActiveOption && (
                  <MoreOptionsMenu
                    menuClassName="w-40"
                    menuItems={[
                      {
                        label: 'Edit',
                        onClick: () =>
                          navigate(`/product-inventory/edit/${id}`),
                        icon: 'solar:pen-new-square-linear',
                      },
                      {
                        label: 'Delete',
                        onClick: () =>
                          setDeleteTarget({
                            id,
                            image,
                            title: name ?? 'Untitled Product',
                            description: isCMSProduct(product)
                              ? (product.description ?? '')
                              : (product.description ?? ''),
                            price,
                          }),
                        icon: 'solar:trash-bin-2-linear',
                        variant: 'danger',
                        showDividerAbove: true,
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {deleteTarget && (
        <ProductResultModal
          open={Boolean(deleteTarget)}
          onClose={closeDeleteModal}
          type="warning"
          title="Are you sure you want to delete this product from the inventory?"
          description="Deleting the product might delete some 3D models and experiences"
          product={{
            title: deleteTarget.title,
            description: deleteTarget.description,
            price: deleteTarget.price,
            image: deleteTarget.image,
          }}
          buttons={[
            {
              content: 'Cancel',
              variant: 'secondary',
              onClick: closeDeleteModal,
              disabled: isDeleting,
            },
            {
              content: isDeleting ? 'Deleting...' : 'Delete',
              onClick: handleConfirmDelete,
              disabled: isDeleting,
              variant: 'outline',
              className: 'w-full text-ui-error border-ui-error',
            },
          ]}
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
          onButtonClick={() => setIsDeleteSuccessOpen(false)}
        />
      </Modal>
    </>
  );
};

export default ProductListItem;
