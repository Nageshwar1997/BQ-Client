import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { StoreFormType } from '..';
import Button from '../../../components/Button';
import { PlusIcon } from 'lucide-react';
import { Icon } from '@iconify/react';
import ProductAssetAssignmentModal from '../../../components/ProductAssetAssignmentModal';
import { ProductInventoryFormModal } from '../../product-inventory/components/ProductInventoryForm';
import type { ToastCardProps } from '../../../types';

interface StepTwoHeaderProps {
  showToast: (props: ToastCardProps) => void;
}

const StepTwoHeader = ({ showToast }: StepTwoHeaderProps) => {
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] =
    useState<boolean>(false);

  const { control } = useFormContext<StoreFormType>();

  const { append } = useFieldArray({
    control,
    name: 'storeProducts',
  });

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="secondary"
        content="Add a New Product"
        leftIcon={<PlusIcon />}
        onClick={() => setIsAddProductModalOpen(true)}
      />
      <Button
        size="sm"
        variant="tertiary"
        content="Import from Inventory"
        leftIcon={<Icon icon="solar:box-minimalistic-linear" />}
        onClick={() => setIsProductModalOpen(true)}
      />

      {/* Modals */}
      <ProductAssetAssignmentModal
        open={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        products={[]}
        selectionMode="product-only"
        onProductSelect={(data) => {
          append({
            _id: data.id,
            productName: data.name,
            source: 'inventory',
            price: {
              amount: data.price,
              currency: data.currency ?? 'INR',
            },
            media: {
              model: {
                thumbnailUrl: data.models3d?.[0]?.thumbnailUrl ?? '',
                spriteUrl: data.models3d?.[0]?.spriteUrl ?? '',
              },
              thumbnail: {
                url: data.image,
              },
            },
          });

          showToast({
            type: 'success',
            title: 'Product Added Successfully!',
            description: `Added "${data.name}" from the inventory to your catalogue`,
          });
          setIsProductModalOpen(false);
        }}
      />

      <ProductInventoryFormModal
        open={isAddProductModalOpen}
        isVirtualStore={true}
        onClose={() => setIsAddProductModalOpen(false)}
        onDone={(data) => {
          if (data && '_id' in data) {
            append({
              _id: data._id as string,
              productName: (data.productName as string) ?? '',
              source: 'inventory',
              price: {
                amount: Number(data.price?.amount ?? 0),
                currency: (data.price?.currency as string) ?? 'INR',
              },
              media: {
                model: {
                  thumbnailUrl:
                    (data.media?.models3d?.[0]?.thumbnailUrl as string) ?? '',
                },
                thumbnail: {
                  url: (data.media?.images?.[0]?.url as string) ?? '',
                },
              },
            });
          }

          showToast({
            type: 'success',
            title: 'Product Added Successfully!',
            description: 'Added product to your inventory and catalogue',
          });
          setIsAddProductModalOpen(false);
        }}
        closeOnOutsideClick={false}
      />
    </div>
  );
};

export default StepTwoHeader;
