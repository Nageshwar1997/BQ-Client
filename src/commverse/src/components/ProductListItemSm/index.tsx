import { Icon } from '@iconify/react';
import type { ProductCMSItem } from '../../types/api.types';
import { getProductPreviewImage, mapExperienceTypeToVariant } from '../../lib/utils';

export const sectionData = [
  {
    title: '3D Visualizer',
    icon: 'lucide:rotate-3d',
    className: 'text-module-3d-viz',
    bgClassName: 'bg-module-3d-viz',
    variant: '3d-visualizer' as const,
  },
  {
    title: 'AR Experience',
    icon: 'solar:object-scan-linear',
    className: 'text-module-ar',
    bgClassName: 'bg-module-ar',
    variant: 'ar-experience' as const,
  },
  {
    title: 'Configurator',
    icon: 'solar:tuning-square-2-linear',
    className: 'text-module-configurator',
    bgClassName: 'bg-module-configurator',
    variant: 'configurator' as const,
  },
  {
    title: 'Virtual Try-On',
    icon: 'solar:face-scan-square-linear',
    className: 'text-module-tryon',
    bgClassName: 'bg-module-tryon',
    variant: 'virtual-try-on' as const,
  },
  {
    title: 'Video',
    icon: 'solar:video-library-linear',
    className: 'text-module-video',
    bgClassName: 'bg-module-video',
    variant: 'video' as const,
  },
  {
    title: 'Social Creative',
    icon: 'solar:wallpaper-linear',
    className: 'text-module-social',
    bgClassName: 'bg-module-social',
    variant: 'social' as const,
  },
  {
    title: 'Video Ad',
    icon: 'solar:video-library-linear',
    className: 'text-module-video',
    bgClassName: 'bg-module-video',
    variant: 'video-ad',
  },
  {
    title: 'Virtual Store',
    icon: 'solar:shop-linear',
    className: 'text-module-storefront',
    bgClassName: 'bg-module-storefront',
    variant: 'storefront',
  },
];
const ProductListItemSm = ({
  product,
  isSelected = false,
  onClick,
}: {
  product: ProductCMSItem;
  isSelected?: boolean;
  onClick?: () => void;
}) => {
  const image = getProductPreviewImage(product);
  const name = product.productName ?? 'Untitled';
  const category = product.category?.name ?? 'Uncategorized';
  const price = product.price?.amount ?? 0;
  const currency =
    product.price?.currency === 'INR' ? '₹' : product.price?.currency;

  const moduleVariants = (product.experiences ?? []).map((exp) =>
    mapExperienceTypeToVariant(exp.type)
  );

  const activeModules = sectionData.filter((s) =>
    moduleVariants.some((variant) => variant === s.variant)
  );
  return (
    <div
      className={`group flex cursor-pointer items-center justify-between gap-4 rounded-xl p-2 ${
        isSelected
          ? 'bg-neutral-gray-100'
          : 'hover:bg-neutral-gray-150 bg-transparent'
      }`}
      onClick={onClick}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="flex items-center gap-2">
        <img
          className="size-16 rounded-xl object-cover"
          src={image}
          alt={name}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div>
            <p className="font-metropolis text-neutral-gray-900 line-clamp-2 text-xs/[18px] font-medium">
              {name}
            </p>

            <div className="font-metropolis text-neutral-gray-600 flex items-center gap-1 text-[10px]/[13px] font-semibold">
              {category}

              <span>•</span>
              <span className="font-normal">
                {currency}
                {price}
              </span>
            </div>
          </div>
          <div className="flex items-start justify-start gap-0.5">
            {activeModules.map((item) => (
              <div
                key={item.variant}
                className="bg-neutral-gray-100 active:border-neutral-gray-200 relative rounded-md active:border"
              >
                <Icon
                  icon={item.icon}
                  className={`flex size-6 items-center justify-center rounded-[6px] p-1 ${item.className}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListItemSm;
