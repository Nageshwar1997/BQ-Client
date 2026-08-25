import { Icon } from '@iconify/react';
import Button from '../../../components/Button';
import ProductListItemSm from '../../../components/ProductListItemSm';
import IconInput from '../../../components/IconInput';
import FilterDropdown from '../../../components/FilterDropdown';
import Chip from '../../../components/Chip';
import { useGetCategories } from '../../../services/category-service';
import type {
  CategoryOption,
  Category,
  ProductCMSItem,
} from '../../../types/api.types';
import { experienceOptions } from '../../3d-asset-library';
import { useEffect, useMemo, useState } from 'react';
import Divider from '../../../components/Divider';
import { useGetProductCMS } from '../../../services/product-service';
import { useInView } from 'react-intersection-observer';
import PillLoader from '../../../components/PillLoader';
import { useLocation, useNavigate } from 'react-router';
import { ExperienceFilterIcon } from '../../../icons';
import {
  ProductDetailSidebarDataSkeleton,
  ProductDetailSidebarFiltersSkeleton,
} from '../../../skeletons/ProductInventoryDetailSkeleton';

type SidebarProduct = ProductCMSItem;

const ProductDetailSidebar = ({
  setSelectedProduct,
  selectedProduct,
}: {
  setSelectedProduct: (product: SidebarProduct) => void;
  selectedProduct?: SidebarProduct;
}) => {
  const getItemId = (item: any): string | undefined => item?._id ?? item?.id;
  const [productSideBarFilterOptions, setProductSideBarFilterOptions] =
    useState({
      category: null as string | null,
      experience: null as string | null,
    });

  const [input, setInput] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { ref, inView } = useInView();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCategoryId = productSideBarFilterOptions.category;
  const selectedExperienceType = productSideBarFilterOptions.experience;

  const hasInput = input.trim().length > 0;
  const categoriesQuery = useGetCategories();
  const productsQuery = useGetProductCMS({
    search: hasInput ? input : undefined,
    categoryId: selectedCategoryId ?? undefined,
    experienceType: selectedExperienceType ?? undefined,
    sortOrder,
  });

  useEffect(() => {
    if (
      inView &&
      productsQuery.hasNextPage &&
      !productsQuery.isFetchingNextPage
    ) {
      productsQuery.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inView,
    productsQuery.hasNextPage,
    productsQuery.isFetchingNextPage,
    productsQuery.fetchNextPage,
  ]);

  const categoryFilterOptions: CategoryOption[] = useMemo(() => {
    if (!categoriesQuery.data) return [];
    return categoriesQuery.data.map((c: Category) => ({
      id: c._id,
      label: c.name,
    }));
  }, [categoriesQuery.data]);

  const getLabelById = (id: string, options: CategoryOption[]) => {
    return options.find((o) => o.id === id)?.label || id;
  };

  const getExperienceLabelById = (id: string) => {
    const found = experienceOptions.find((o) => o.id === id);
    return found ? found.label : id;
  };

  const removeCategory = () => {
    setProductSideBarFilterOptions((prev) => ({
      ...prev,
      category: null,
    }));
  };

  const removeExperience = () => {
    setProductSideBarFilterOptions((prev) => ({
      ...prev,
      experience: null,
    }));
  };

  const productsFromApi: SidebarProduct[] = useMemo(
    () => productsQuery.data?.pages?.flatMap((page) => page?.data ?? []) ?? [],
    [productsQuery.data?.pages]
  );

  const filteredProducts = useMemo(() => {
    let filtered = productsFromApi;
    const category = productSideBarFilterOptions.category;
    if (category) {
      filtered = filtered.filter(
        (product) => product.category?.id === category
      );
    }

    const experience = productSideBarFilterOptions.experience;
    if (experience) {
      filtered = filtered.filter((product) =>
        (product.experiences ?? []).some((exp) => exp.type === experience)
      );
    }

    return filtered;
  }, [
    productsFromApi,
    productSideBarFilterOptions.category,
    productSideBarFilterOptions.experience,
  ]);

  const hasSelectedFilters =
    !!productSideBarFilterOptions.category ||
    !!productSideBarFilterOptions.experience;
  const isSidebarDataLoading =
    productsQuery.isLoading && filteredProducts.length === 0;

  return (
    <div className="bg-neutral-gray-200 flex h-full w-92.5 flex-col gap-4 overflow-hidden px-4 pt-9 pb-6">
      {/* Header Section */}
      <img
        src="/assets/icons/Commverse Logo - Final.svg"
        alt=""
        className="mb-4 h-auto w-full max-w-47.5"
      />

      <div className="text-neutral-gray-900 text-base/[19px] font-semibold">
        Product Inventory
      </div>
      <div className="text-neutral-gray-900 font-metropolis text-xs/[18px]">
        All the product from the CMS/Inventory
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex w-full shrink-0 justify-between gap-2">
          <div className="min-w-0 flex-1">
            <IconInput
              type="text"
              placeholder="Search products"
              leftAddon={
                <Icon icon="solar:magnifer-linear" className="size-5" />
              }
              className="w-full pl-9!"
              onChange={(value) => setInput(value)}
              value={input}
            />
          </div>
          <Button
            content={''}
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
            variant="secondary"
            className="bg-neutral-gray-400! size-10! shrink-0"
            onClick={() =>
              setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
            }
          />
        </div>

        {/* Filters Section */}
        <div
          className={`flex shrink-0 flex-col ${hasSelectedFilters ? 'gap-y-2' : ''} gap-x-2`}
        >
          {categoriesQuery.isLoading ? (
            <ProductDetailSidebarFiltersSkeleton />
          ) : (
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <FilterDropdown
                  innerLabel={'Categories'}
                  leftIcon={
                    <Icon icon="solar:widget-2-linear" className="size-4" />
                  }
                  options={categoryFilterOptions}
                  onChange={(value) => {
                    setProductSideBarFilterOptions((prev) => ({
                      ...prev,
                      category:
                        !Array.isArray(value) && value?.id ? value.id : null,
                    }));
                  }}
                  value={productSideBarFilterOptions.category}
                  className="[&>button]:text-neutral-gray-700 [&>button]:w-full! [&>button]:min-w-0! [&>button]:px-2! [&>div>div]:w-50!"
                />
              </div>
              <div className="min-w-0 flex-1">
                <FilterDropdown
                  innerLabel={'Experiences'}
                  leftIcon={
                    <ExperienceFilterIcon className="size-4 text-[#18181A]" />
                  }
                  options={experienceOptions}
                  onChange={(value) => {
                    setProductSideBarFilterOptions((prev) => ({
                      ...prev,
                      experience:
                        !Array.isArray(value) && value?.id ? value.id : null,
                    }));
                  }}
                  menuAlign="end"
                  value={productSideBarFilterOptions.experience}
                  className="[&>button]:text-neutral-gray-700 [&>button]:w-full! [&>button]:min-w-0! [&>button]:px-2! [&>div>div]:w-[180px]!"
                />
              </div>
            </div>
          )}

          <div className={`flex flex-wrap gap-2 overflow-hidden`}>
            {productSideBarFilterOptions.category && (
              <Chip
                key={`cat-${productSideBarFilterOptions.category}`}
                text={getLabelById(
                  productSideBarFilterOptions.category,
                  categoryFilterOptions
                )}
                variant="outline"
                className="max-w-full bg-transparent!"
                rightIcon={
                  <Icon
                    icon="lucide:x"
                    className="size-2.5"
                    onClick={removeCategory}
                  />
                }
              />
            )}

            {productSideBarFilterOptions.experience && (
              <Chip
                key={`exp-${productSideBarFilterOptions.experience}`}
                text={getExperienceLabelById(
                  productSideBarFilterOptions.experience
                )}
                variant="outline"
                className="max-w-full bg-transparent!"
                rightIcon={
                  <Icon
                    icon="lucide:x"
                    className="size-2.5 font-medium!"
                    onClick={removeExperience}
                  />
                }
              />
            )}
          </div>
        </div>
      </div>
      <Divider />
      {/* Product List Section */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Results Header */}
        {hasInput && (
          <div className="mb-2 flex shrink-0 justify-between gap-3">
            <div className="text-neutral-gray-900 font-metropolis truncate text-sm/[17px] font-bold">
              Showing results for {`"${input}"`}
            </div>
            <div className="text-neutral-gray-600 shrink-0 text-xs/[18px]">
              {filteredProducts?.length} results
            </div>
          </div>
        )}

        {/* Product List or Empty State */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto px-1">
          {isSidebarDataLoading ? (
            <ProductDetailSidebarDataSkeleton />
          ) : hasInput && filteredProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="flex h-[400px] w-full flex-col items-center justify-center gap-8">
                <div className="relative flex h-[110px]">
                  <img
                    src="/assets/images/product-detail/file-upload.webp"
                    alt="No results"
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-1 text-center">
                  <div className="text-neutral-gray-700 font-metropolis text-sm/[17px] font-semibold">
                    No results found
                  </div>
                  <div className="text-neutral-gray-600 font-metropolis text-xs/[18px]">
                    However, you can create a product now
                  </div>
                </div>
                <Button
                  content="Create Product"
                  leftIcon={
                    <Icon
                      icon="solar:box-minimalistic-linear"
                      className="size-5"
                    />
                  }
                  variant="tertiary"
                  className="mx-auto! w-39! gap-1! rounded-lg! px-2! py-3! text-sm!"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 pb-1">
              {filteredProducts.map((item, index) => (
                <div
                  key={getItemId(item) ?? item.productName}
                  className="flex min-w-0 flex-col"
                  ref={index === filteredProducts.length - 1 ? ref : undefined}
                >
                  <ProductListItemSm
                    product={item}
                    onClick={() => {
                      const clickedId = getItemId(item);
                      const currentId = getItemId(selectedProduct);
                      const targetPath = clickedId
                        ? `/product-inventory/${clickedId}`
                        : '';

                      // Prevent duplicate navigation on rapid double-clicks.
                      if (
                        clickedId &&
                        currentId === clickedId &&
                        location.pathname === targetPath
                      ) {
                        return;
                      }

                      setSelectedProduct(item);
                      if (item?._id) {
                        navigate(`/product-inventory/${item._id}`);
                      }
                    }}
                    isSelected={getItemId(selectedProduct) === getItemId(item)}
                  />
                </div>
              ))}
              {productsQuery.isFetchingNextPage && (
                <div className="flex w-full items-center justify-center py-2">
                  <PillLoader description="" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSidebar;
