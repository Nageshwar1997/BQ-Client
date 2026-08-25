import { Icon } from '@iconify/react';
import Button from '../../../components/Button';
import Modal from '../../../components/Modal';
import { AssetLibraryItem } from '../../../components/AssetLibraryItem';
import ExperienceModules from '../../../components/ExperienceModules';
import PillLoader from '../../../components/PillLoader';
import type { AssetLibraryItemInteractionVariant } from '../../../types';

export interface SelectModelItem {
  _id: string;
  image: string;
  modelUrl: string;
  fileType: string;
  isAIGenerated?: boolean;
  productNameLinkedTo: string | null;
  linkedProductId?: string | null;
  linkedProductIds?: string[];
  fileSize: string;
  title: string;
  spriteUrl?: string | null;
  category: { name: string; _id: string } | null;
}

interface SelectA3DModelModalProps {
  open: boolean;
  models: SelectModelItem[];
  selectedModelId: string | null;
  onSelectModel: (id: string) => void;
  title?: string;
  onBack: () => void;
  onClose: () => void;
  onConfirm: () => void;
  interactionVariant?: AssetLibraryItemInteractionVariant;
  confirmDisabled?: boolean;
  confirmButtonLabel?: string;
  isLoading?: boolean;
  selectedProduct?: {
    id: string;
    image: string;
    name: string;
    category: string;
    price: number;
    currency?: string;
    modules?: Array<{ variant: string; count: number }>;
  } | null;
  onClearSelectedProduct?: () => void;
}

const SelectA3DModelModal = ({
  open,
  models,
  selectedModelId,
  onSelectModel,
  title = 'Select a 3D Model',
  onBack,
  onClose,
  onConfirm,
  interactionVariant = 'linkable',
  confirmDisabled,
  confirmButtonLabel = 'Add',
  isLoading = false,
  selectedProduct,
  onClearSelectedProduct,
}: SelectA3DModelModalProps) => {
  const normalizedInteractionVariant = String(
    interactionVariant ?? 'selectable'
  )
    .trim()
    .toLowerCase();
  const isSelectableInteraction = normalizedInteractionVariant === 'selectable';
  const isLinkableInteraction = normalizedInteractionVariant === 'linkable';
  const isSelectedModelVisible = models.some((model) => model._id === selectedModelId);
  const defaultConfirmDisabled =
    isSelectableInteraction && (!selectedModelId || !isSelectedModelVisible);
  const isConfirmDisabled =
    isLinkableInteraction ? false : (confirmDisabled ?? defaultConfirmDisabled);

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="[&>div]:h-[70vh] [&>div]:min-w-260 [&>div]:overflow-hidden"
    >
      <div className="flex h-full w-full flex-col gap-5 px-10 pt-10">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon
                icon="solar:arrow-left-linear"
                className="size-8 cursor-pointer"
                onClick={onBack}
              />
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" content="Cancel" onClick={onClose} />
            <Button
              content={confirmButtonLabel}
              onClick={onConfirm}
              disabled={isConfirmDisabled}
            />
          </div>
        </div>

        {selectedProduct && (
          <div className="bg-neutral-gray-200 flex items-center justify-between gap-4 rounded-xl p-2">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <img
                className="size-12 rounded-xl object-cover"
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />
              <div className="min-w-0">
                <p className="text-neutral-gray-900 truncate text-xs leading-4.5 font-medium">
                  {selectedProduct.name}
                </p>
                <div className="text-neutral-gray-600 flex items-center gap-1 text-[10px] leading-3.5">
                  <span className="font-semibold">
                    {selectedProduct.category}
                  </span>
                  <span>•</span>
                  <span>
                    {selectedProduct.currency ?? '₹'}
                    {selectedProduct.price}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-6">
              <ExperienceModules
                modules={selectedProduct.modules ?? []}
                isSelected
              />
              {onClearSelectedProduct && (
                <Icon
                  icon="solar:close-circle-linear"
                  className="text-neutral-gray-900 size-6 cursor-pointer"
                  onClick={onClearSelectedProduct}
                />
              )}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <PillLoader description="Loading linked 3D models..." />
          </div>
        ) : models.length > 0 ? (
          <div className="flex flex-col gap-4 overflow-y-auto">
            <p className="text-xl font-semibold">Existing models</p>

            <div className="grid grid-cols-4 gap-3 pb-4">
              {models.map((item, index) => (
                <AssetLibraryItem
                  key={`${item._id}-select-model-${index}`}
                  spriteUrl={item.spriteUrl ?? ''}
                  modelUrl={item.modelUrl}
                  fileType={item.fileType}
                  productNameLinkedTo={item.productNameLinkedTo}
                  fileSize={item.fileSize}
                  title={item.title}
                  category={item.category}
                  isAIGenerated={item.isAIGenerated}
                  _id={item._id}
                  interactionVariant={
                    isSelectableInteraction ? 'selectable' : interactionVariant
                  }
                  isSelected={selectedModelId === item._id}
                  onSelect={(id) => onSelectModel(id)}
                  viewType="grid"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-neutral-gray-600 rounded-xl border border-dashed p-6 text-center text-sm">
            {selectedProduct
              ? 'No linked 3D models found for this product.'
              : 'No 3D models available.'}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SelectA3DModelModal;
