import { ApiStatus, Button } from '@beautinique/frontend-components';
import { usePathParams } from '@beautinique/frontend-hooks';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { ROUTES } from '@/constants/routes.constants';
import { useGetCategoriesHierarchy } from '@/services/product-service/category.service.query';
import { findCategoryBySlugs } from '@/utils/category.util';
import { toAbsolutePath } from '@/utils/common.util';

import ProductCardSkeleton from './children/ProductCardSkeleton';
import ProductListing from './children/ProductListing';

/**
 * The page of a category: `/products/face`, `/products/face/face-makeup`, `/products/face/face-makeup/foundation`.
 * The slugs of the address are followed down the tree of categories to find which one it is; the listing
 * is then the one of all products, narrowed to that category (and the ones under it).
 */
const CategoryProducts = () => {
  const { pathParams } = usePathParams();
  const { data: categories, isLoading, isError, refetch } = useGetCategoriesHierarchy();

  const resolved = useMemo(
    () =>
      categories
        ? findCategoryBySlugs(categories, [
            pathParams.l1_slug,
            pathParams.l2_slug,
            pathParams.l3_slug,
          ])
        : undefined,
    [categories, pathParams.l1_slug, pathParams.l2_slug, pathParams.l3_slug],
  );

  if (isLoading) {
    return (
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-2 gap-4 px-3 pt-24 sm:px-5 md:grid-cols-4 lg:px-8">
        {Array.from({ length: 8 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError && !categories) {
    return (
      <div className="mx-auto max-w-sm pt-10">
        <ApiStatus
          status="error"
          title="We could not load the categories"
          description="Something went wrong on our side. Please try again."
        />
        <Button
          pattern="outline"
          content="Try again"
          buttonProps={{
            onClick: () => {
              void refetch();
            },
          }}
        />
      </div>
    );
  }

  if (!resolved || !categories) {
    return (
      <div className="mx-auto max-w-sm pt-10">
        <ApiStatus
          status="empty"
          title="We could not find that category"
          description="It may have been renamed or removed."
        />
        <Link to={toAbsolutePath(ROUTES.PRODUCTS.BASE)} className="block">
          <Button pattern="outline" content="Browse all products" />
        </Link>
      </div>
    );
  }

  const { category, trail } = resolved;
  const description = 'description' in category ? category.description : undefined;

  return (
    <ProductListing
      key={category._id}
      title={category.name}
      description={description}
      category={category}
      trail={trail}
      categories={categories}
    />
  );
};

export default CategoryProducts;
