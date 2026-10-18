import { useId } from 'react';

import ProductCard from '@/pages/product/children/ProductCard';
import ProductCardSkeleton from '@/pages/product/children/ProductCardSkeleton';
import { useGetRelatedProducts } from '@/services/product-service/product.service.query';
import { pickRelatedProducts } from '@/utils/product-details.util';

interface IRelatedProducts {
  /** The category to take the products from. */
  categoryId?: string;
  /** Its name, for the title ("More from Lipstick"). */
  categoryName?: string;
  /** The product that is open: it is not "more like this" itself. */
  excludeId: string;
}

const GRID = 'grid grid-cols-1 gap-x-3 gap-y-8 min-[350px]:grid-cols-2 sm:gap-x-4 md:grid-cols-4';

/**
 * A row of other products of the category under a product, the best selling first. It shows cards of loading while they
 * come, and nothing at all (not an empty title) when there are none, or when they could not be loaded: a page of a
 * product is not worse for lacking them.
 */
const RelatedProducts = ({ categoryId, categoryName, excludeId }: IRelatedProducts) => {
  const headingId = useId();
  const { data, isLoading } = useGetRelatedProducts(categoryId);
  const products = pickRelatedProducts(data ?? [], excludeId);

  if (!isLoading && products.length === 0) return null;

  return (
    <section aria-labelledby={headingId} className="mt-16">
      <h2 id={headingId} className="mb-6 text-xl font-bold tracking-tight sm:text-2xl">
        {categoryName ? `More from ${categoryName}` : 'You may also like'}
      </h2>

      <ul className={GRID}>
        {isLoading
          ? Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <ProductCardSkeleton />
              </li>
            ))
          : products.map((product) => (
              <li key={product._id} className="flex">
                <ProductCard product={product} />
              </li>
            ))}
      </ul>
    </section>
  );
};

export default RelatedProducts;
