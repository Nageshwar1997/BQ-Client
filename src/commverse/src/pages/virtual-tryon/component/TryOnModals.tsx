import { useState } from 'react';
import Modal from '../../../components/Modal';
import SelectedProductViewModal from './SelectedProductViewModal';
import { Icon } from '@iconify/react';
import CheckConnectivity from '../../../components/CheckConnectivity';
import useQueryParams from '../../../hooks/useQueryParams';
import ProductListItem from '../../../components/ProductListItem';
import Button from '../../../components/Button';
import IconInput from '../../../components/IconInput';
import type { IProductResponse } from '../../../types';
import { useInView } from 'react-intersection-observer';
import { useGetCosmeticCategory } from '../../../hooks/useGetCosmeticCategory';
import { useGetProductCMS } from '../../../services/product-service';
import { useEffect } from 'react';
import { ProductInventoryFormModal } from '../../product-inventory/components/ProductInventoryForm';

interface ProductSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

const ProductSelectionModal = ({
  open,
  onClose,
}: ProductSelectionModalProps) => {
  const { queryParams, updateParams } = useQueryParams();
  const { ref, inView } = useInView();
  const params = useGetCosmeticCategory();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetProductCMS({
      ...(queryParams.product === 'select' && {
        enabled: 'true',
      }),
      categoryId: params.categoryId,
      subcategory: params.subCategory,
      search: queryParams.search,
      sortOrder: (queryParams.sort as 'asc' | 'desc') ?? 'asc',
    });

  const products: IProductResponse[] =
    data?.pages?.flatMap((page) => (page?.data as IProductResponse[]) ?? []) ??
    [];

  const handleClose = () => {
    onClose();
    updateParams({ remove: ['sort', 'search', 'product', 'id'] });
  };

  const onSelect = (product: IProductResponse) => {
    updateParams({
      set: { id: product._id, product: 'view' },
      remove: ['search', 'sort'],
    });
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      className="[&>div]:h-[70vh] [&>div]:min-w-260 [&>div]:overflow-hidden"
    >
      <div className="flex h-full w-full flex-col gap-5 px-10 pt-10">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl/7 font-bold">Select a Product</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                content="Cancel"
                size="sm"
                className="h-10! px-4"
                onClick={handleClose}
              />
              <Button
                variant="tertiary"
                leftIcon={
                  <Icon icon="solar:add-circle-linear" className="size-5" />
                }
                content="Add a New Product"
                size="sm"
                onClick={() => updateParams({ set: { product: 'add-new' } })}
                className="h-10! px-4"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <IconInput
              placeholder="Search products"
              containerClassName="w-full"
              className="pl-9!"
              onChange={(value) =>
                updateParams({ set: { search: encodeURIComponent(value) } })
              }
              type="text"
              leftAddon={
                <Icon
                  icon="solar:magnifer-linear"
                  className="text-neutral-gray-500 size-5"
                />
              }
            />
            <Button
              variant="secondary"
              leftIcon={
                <Icon
                  icon={
                    queryParams.sort === 'desc'
                      ? 'solar:list-arrow-down-minimalistic-linear'
                      : 'solar:list-arrow-up-minimalistic-linear'
                  }
                  className="**:stroke-1.5 text-neutral-gray-900 size-5! [&>g>path:last-of-type]:text-[#1C274C]"
                />
              }
              onClick={() => {
                if (queryParams.sort) {
                  updateParams({ remove: ['sort'] });
                } else {
                  updateParams({ set: { sort: 'desc' } });
                }
              }}
              size="sm"
              className="size-10!"
            />
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto pb-4">
          <ProductListItem
            data={products}
            onSelect={onSelect}
            lastItemRef={ref}
          />
        </div>
      </div>
    </Modal>
  );
};

const CheckListComponent: React.FC<{ text: string[] }> = ({ text }) => {
  return (
    <div className="text-neutral-gray-900 flex items-center gap-2 text-[14px] font-medium">
      <Icon icon="solar:check-circle-linear" width={24} height={24} />
      <div>
        {text.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
};

const CardComponent: React.FC<{
  cardData: { title: string; subtitle: string };
  description: string;
}> = ({ cardData, description }) => {
  return (
    <div className="flex flex-col gap-4 text-[12px]">
      <div className="bg-neutral-gray-100 border-neutral-gray-200 flex w-full flex-col rounded-2xl border p-3">
        <span className="text-[32px] font-medium">{cardData.title}</span>
        <span className="text-neutral-gray-600">{cardData.subtitle}</span>
      </div>
      <div className="font-medium">{description}</div>
    </div>
  );
};

export const TryOnSaveWarnModal: React.FC<{
  onClose?: () => void;
  onSaveAndExit?: () => void;
  onDiscardChanges?: () => void;
  open?: boolean;
}> = ({ onClose, onSaveAndExit, onDiscardChanges, open: openProp = false }) => {
  const [isOpen, setIsOpen] = useState(openProp);

  useEffect(() => {
    setIsOpen(openProp);
  }, [openProp]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      className="overflow-y-hidden [&>div]:max-w-5xl"
    >
      <div className="flex h-full">
        <div className="bg-auth-img flex h-full flex-col justify-between bg-top-right bg-no-repeat p-10">
          <div className="flex h-[480px]! flex-col justify-between">
            <span className="text-[24px] font-bold">
              You’re One Step Away From Making Your Product Immersive.
            </span>
            <div className="flex flex-col gap-3">
              <CheckListComponent
                text={[
                  'Works across PDPs, ads & immersive experiences',
                  'One XR asset. Multiple conversion touchpoints.',
                ]}
              />
              <CheckListComponent
                text={[
                  'Ready for every device',
                  'Mobile, desktop, AR & web — zero extra effort.',
                ]}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <CardComponent
                cardData={{
                  title: '40%',
                  subtitle: 'higher engagement',
                }}
                description="Shoppers interact longer with immersive products"
              />
              <CardComponent
                cardData={{
                  title: '25%',
                  subtitle: 'fewer returns',
                }}
                description="Better product understanding before purchase"
              />
              <CardComponent
                cardData={{
                  title: '2X',
                  subtitle: 'purchase confidence',
                }}
                description="Interactive experiences drive deeper exploration"
              />
            </div>
          </div>
        </div>
        <div className="relative h-full w-2xl p-10">
          <div className="h-[480px]">
            <div className="mb-8 flex h-[65%] w-full flex-col items-center justify-center">
              <div
                className="absolute top-0 right-0 cursor-pointer p-10"
                onClick={handleClose}
              >
                <Icon
                  icon="lucide:x"
                  className="text-neutral-gray-900 size-6"
                />
              </div>
              <Icon
                icon="solar:danger-circle-bold"
                width={96}
                height={96}
                className="text-ui-warning mb-4"
              />
              <span className="mb-2 text-center text-[24px] font-bold">
                You're Almost There
              </span>
              <span className="text-neutral-gray-600 text-center text-[14px] font-normal">
                Would you like to save your progress or discard these changes?
              </span>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Button content="Continue Editing" onClick={handleClose} />
              <div className="inline-flex w-full items-center gap-4">
                <Button
                  variant="secondary"
                  className="flex-1"
                  content="Save & Exit"
                  onClick={onSaveAndExit}
                />
                <Button
                  variant="outline"
                  className="flex-1 border!"
                  content="Discard Changes"
                  onClick={onDiscardChanges}
                />
              </div>
              <span className="text-neutral-gray-600 text-[10px]">
                Nothing goes live until you publish.
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const TryOnModals = ({
  product,
  onSelectProduct,
}: {
  product: IProductResponse;
  onSelectProduct: () => void;
}) => {
  const { queryParams, updateParams } = useQueryParams();

  return (
    <>
      <ProductSelectionModal
        open={queryParams.product === 'select'}
        onClose={() => updateParams({ remove: ['product'] })}
      />
      <SelectedProductViewModal
        modalProps={{
          open: queryParams.product === 'view',
          onClose: () => updateParams({ remove: ['product', 'id'] }),
        }}
        product={product}
        onBack={() => updateParams({ set: { product: 'select' } })}
        onSelectProduct={() => {
          if (product?._id) {
            updateParams({ set: { id: product._id } });
          }
          onSelectProduct();
        }}
      />
      <ProductInventoryFormModal
        open={queryParams.product === 'add-new'}
        onClose={() => updateParams({ remove: ['product'] })}
        onDone={(product) => {
          updateParams({ set: { id: product._id, product: 'preview' } });
          onSelectProduct();
        }}
        isTryOn={true}
      />
      <CheckConnectivity />
    </>
  );
};

export default TryOnModals;
