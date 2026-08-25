import { Icon } from '@iconify/react';
import Modal from '../../../components/Modal';
import CheckConnectivity from '../../../components/CheckConnectivity';
import ProductListItem from '../../../components/ProductListItem';
import Button from '../../../components/Button';
import IconInput from '../../../components/IconInput';
import useQueryParams from '../../../hooks/useQueryParams';
import { useInView } from 'react-intersection-observer';
import { useGetProductCMS } from '../../../services/product-service';
import type {
  IProductResponse,
  SelectedOption,
  TCategory,
} from '../../../types';
import FilterDropdown from '../../../components/FilterDropdown';
import { useEffect } from 'react';
import { useGetCategories } from '../../../services/category-service';
import { ProductInventoryFormModal } from '../../product-inventory/components/ProductInventoryForm';
import SelectedProductViewModal from '../../virtual-tryon/component/SelectedProductViewModal';

interface ProductSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

const FashionProductSelectionModal = ({
  open,
  onClose,
}: ProductSelectionModalProps) => {
  const { queryParams, updateParams } = useQueryParams();
  const { ref, inView } = useInView();

  const categoriesQuery = useGetCategories({ search: 'Clothes' });
  const category =
    categoriesQuery?.data?.find((item: TCategory) => item.name === 'Clothes') ??
    {};

  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetProductCMS({
      ...(queryParams.product === 'select' && {
        enabled: 'true',
      }),
      categoryId: category._id,
      subcategory: queryParams.category,
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

        <div className="flex gap-2">
          <FilterDropdown
            innerLabel="Category"
            leftIcon={<Icon icon="solar:widget-2-linear" />}
            options={category.subcategories?.map((category: TCategory) => ({
              id: category._id,
              value: category.name,
              label: category.name,
            }))}
            onChange={(value) => {
              if (value) {
                updateParams({
                  set: { category: (value as SelectedOption)?.value },
                });
              } else {
                updateParams({ remove: ['category'] });
              }
            }}
          />
          <FilterDropdown
            innerLabel="Assets"
            leftIcon={<Icon icon="solar:box-minimalistic-linear" />}
            options={[
              { id: 'asset1', value: 'asset1', label: 'Asset 1' },
              { id: 'asset2', value: 'asset2', label: 'Asset 2' },
            ]}
            onChange={(value) => {
              if (value) {
                updateParams({
                  set: { assets: (value as SelectedOption)?.value },
                });
              } else {
                updateParams({ remove: ['assets'] });
              }
            }}
          />
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

const FashionTryOnModals = ({
  product,
  // onSelectProduct,
}: {
  product: IProductResponse;
  // onSelectProduct: () => void;
}) => {
  const { queryParams, updateParams } = useQueryParams();

  return (
    <>
      <FashionProductSelectionModal
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
            updateParams({ set: { id: product._id, product: 'preview' } });
          }
        }}
      />
      <ProductInventoryFormModal
        open={queryParams.product === 'add-new'}
        onClose={() =>
          updateParams({
            remove: ['product'],
          })
        }
        onDone={(product) => {
          updateParams({
            set: {
              ...(product._id && { id: product._id }),
              product: 'preview',
            },
          });
          // onSelectProduct();
        }}
        isTryOn={true}
        closeOnOutsideClick={false}
      />
      <CheckConnectivity />
    </>
  );
};

export default FashionTryOnModals;
