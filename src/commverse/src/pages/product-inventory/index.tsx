import { Link, useNavigate } from 'react-router';
import Button from '../../components/Button';
import { Icon } from '@iconify/react';
import TopHeader from '../../components/TopHeader';
import { useEffect, useMemo, useState } from 'react';
import { Tab } from '../../components/Tab';
import { experienceOptions, viewTabs } from '../3d-asset-library';
import IconInput from '../../components/IconInput';
import FilterDropdown from '../../components/FilterDropdown';
import { useGetCategories } from '../../services/category-service';
import ProductListItem from '../../components/ProductListItem';
import ProductTable from './ProductTable';
import {
  useDeleteProductCMS,
  useGetProductCMS,
} from '../../services/product-service';
import type { ProductCMSItem } from '../../types/api.types';
import { useInView } from 'react-intersection-observer';
import EmptyState from '../../components/EmptyState';
import { ProductInventoryFormModal } from './components/ProductInventoryForm';
import { ExperienceFilterIcon } from '../../icons';
import ToastCard from '../../components/AlertCards/ToastCard';
import { handleApiError } from '../../lib/utils';
import type { ToastCardProps } from '../../types';
import ProductInventorySkeleton from '../../skeletons/ProductInventorySkeleton';

const getDeleteProductToastTitle = (message: string) => {
  return message.includes('linked to it')
    ? 'Delete Blocked'
    : 'Unable to Delete Product';
};

const ProductInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedExperienceType, setSelectedExperienceType] = useState<
    string | null
  >(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastIndex, setToastIndex] = useState(0);
  const categoriesQuery = useGetCategories();
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const deleteProductCMSMutation = useDeleteProductCMS();
  const productsQuery = useGetProductCMS({
    search: searchTerm || undefined,
    categoryId: selectedCategoryId ?? undefined,
    experienceType: selectedExperienceType ?? undefined,
    sortOrder,
  });

  const categoryFilterOptions = useMemo(() => {
    if (categoriesQuery?.data) {
      return categoriesQuery?.data?.map(
        (category: { _id: string; name: string }) => ({
          id: category._id,
          label: category.name,
        })
      );
    }
    return [];
  }, [categoriesQuery?.data]);

  const filters = [
    {
      label: 'Category',
      icon: 'solar:widget-2-linear',
      options: categoryFilterOptions,
    },
    {
      label: 'Experience',
      icon: ExperienceFilterIcon,
      options: experienceOptions,
    },
  ];

  useEffect(() => {
    if (
      inView &&
      productsQuery.hasNextPage &&
      !productsQuery.isFetchingNextPage
    ) {
      productsQuery.fetchNextPage();
    }
  }, [inView, productsQuery]);

  const products: ProductCMSItem[] = useMemo(
    () => productsQuery.data?.pages?.flatMap((page) => page?.data ?? []) ?? [],
    [productsQuery.data?.pages]
  );
  const hasProducts = products.length > 0;
  const hasSearch = searchTerm.trim().length > 0;
  const isLoadingInitial = productsQuery.isLoading && !hasProducts;
  const showEmptyInventory =
    !isLoadingInitial &&
    !productsQuery.isError &&
    !hasSearch &&
    !selectedCategoryId &&
    !selectedExperienceType &&
    !hasProducts;

  const showNoSearchResults =
    !isLoadingInitial &&
    !productsQuery.isError &&
    (hasSearch || selectedCategoryId || selectedExperienceType) &&
    !hasProducts;

  const showToast = (toastProps: NonNullable<ToastCardProps>) => {
    setToastCardProps(toastProps);
    setToastIndex((prev) => prev + 1);
  };

  const handleDeleteProduct = async (id: string) => {
    const response = await deleteProductCMSMutation
      .mutateAsync(id, {
        onSuccess: (result) => {
          if (!result?.success) {
            const description =
              result?.error?.message ||
              'Unable to delete product. Please try again.';

            showToast({
              type: 'error',
              title: getDeleteProductToastTitle(description),
              description,
            });
          }
        },
        onError: (error) => {
          const description = handleApiError({
            error: error as Error,
            fallback: 'Unable to delete product. Please try again.',
          });

          showToast({
            type: 'error',
            title: getDeleteProductToastTitle(description),
            description,
          });
        },
      })
      .catch(() => ({ success: false }));

    return response ?? { success: false };
  };

  return (
    <div>
      <TopHeader />
      {/* Header Section */}
      <div className="flex w-full items-center-safe justify-between gap-3 pt-6 pr-8 pb-3 pl-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-neutral-gray-900 font-metropolis text-[32px] leading-9.75 font-medium">
            Product Inventory
          </h1>
          <span className="text-neutral-gray-600 font-metropolis text-base font-normal">
            View, edit, and manage your product catalogue
          </span>
        </div>
        <Link to="/product-inventory/add">
          <Button
            leftIcon={
              <Icon icon="solar:box-minimalistic-linear" className="size-6" />
            }
            type="submit"
            content="Add a New Product"
          />
        </Link>
      </div>
      <div className="flex flex-col gap-5 pr-8 pl-8">
        <div className="flex items-center gap-x-4">
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
                  sortOrder === 'asc'
                    ? 'solar:list-arrow-up-minimalistic-linear'
                    : 'solar:list-arrow-down-minimalistic-linear'
                }
                className="**:stroke-1.5 text-neutral-gray-900 size-5! transition-transform duration-200 [&>g>path:last-of-type]:text-[#1C274C]"
              />
            }
            onClick={() =>
              setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
            }
            className="w-fit!"
          />
          <div>
            <Tab
              data={viewTabs}
              defaultActiveId={1}
              variant="toggle"
              onClick={(item) =>
                setViewType(item.value === 'list' ? 'list' : 'grid')
              }
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <FilterDropdown
                key={filter.label}
                options={filter.options}
                innerLabel={filter.label}
                leftIcon={
                  typeof IconComponent === 'string' ? (
                    <Icon icon={IconComponent} className="size-4" />
                  ) : (
                    <IconComponent className="size-4 text-[#18181A]" />
                  )
                }
                value={
                  filter.label === 'Category'
                    ? selectedCategoryId
                    : filter.label === 'Experience'
                      ? selectedExperienceType
                      : undefined
                }
                onChange={(value) => {
                  if (filter.label === 'Category') {
                    setSelectedCategoryId(
                      !Array.isArray(value) && value?.id ? value.id : null
                    );
                    return;
                  }

                  if (filter.label === 'Experience') {
                    setSelectedExperienceType(
                      !Array.isArray(value) && value?.id ? value.id : null
                    );
                  }
                }}
              />
            );
          })}
        </div>
        <div className="min-h-[50dvh] flex-1 overflow-y-auto pb-4">
          {isLoadingInitial && <ProductInventorySkeleton viewType={viewType} />}
          {showEmptyInventory && (
            <EmptyState
              iconSrc="/assets/icons/file-send.svg"
              iconAlt="empty-product-inventory"
              title="Your Product Inventory Is Empty"
              description="Add your first product to start building experiences."
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
          )}
          {showNoSearchResults && (
            <EmptyState
              iconSrc="/assets/icons/file-send.svg"
              iconAlt="no-search-results"
              title="No results found"
              description={
                hasSearch
                  ? `No products found for "${searchTerm}".`
                  : 'No products match the selected filters.'
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
          )}
          {!showEmptyInventory &&
            !showNoSearchResults &&
            viewType === 'grid' && (
              <ProductListItem
                onSelect={(item) => navigate(`/product-inventory/${item._id}`)}
                data={products}
                lastItemRef={ref}
                isActiveOption={true}
                onDeleteProduct={handleDeleteProduct}
              />
            )}
          {!showEmptyInventory &&
            !showNoSearchResults &&
            viewType === 'list' && (
              <ProductTable
                data={products}
                lastRowRef={ref}
                onDeleteProduct={handleDeleteProduct}
              />
            )}
          {productsQuery.isFetchingNextPage && (
            <ProductInventorySkeleton viewType={viewType} />
          )}
        </div>
      </div>

      <ProductInventoryFormModal
        open={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
      />
      {toastCardProps && <ToastCard key={toastIndex} {...toastCardProps} />}
    </div>
  );
};

export default ProductInventory;
