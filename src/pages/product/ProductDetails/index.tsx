import { ApiStatus, Button } from '@beautinique/frontend-components';
import {
  type IMediaLabels,
  MediaCarouselWithParentMedia,
} from '@beautinique/frontend-components/media';
import { usePathParams, useQueryParams } from '@beautinique/frontend-hooks';
import type { IShade } from '@beautinique/frontend-tryon';
import { type ReactNode, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import ApiError from '@/classes/ApiError';
import TryOnModal from '@/components/layout/tryons';
import { ROUTES } from '@/constants/routes.constants';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import ListingBreadcrumb from '@/pages/product/children/ListingBreadcrumb';
import { useGetCategoriesHierarchy } from '@/services/product-service/category.service.query';
import { useGetProductBySlug } from '@/services/product-service/product.service.query';
import { findCategoryTrailById } from '@/utils/category.util';
import { toAbsolutePath, VIDEO_PLAYER_PROPS } from '@/utils/common.util';
import {
  buildProductMedia,
  getPricing,
  getSelectedVariant,
  getStock,
  getVariantMediaIndex,
} from '@/utils/product-details.util';

import AvailabilityNote from './children/AvailabilityNote';
import PriceBlock from './children/PriceBlock';
import ProductAccordion from './children/ProductAccordion';
import ProductDetailsSkeleton from './children/ProductDetailsSkeleton';
import RatingSummary from './children/RatingSummary';
import RelatedProducts from './children/RelatedProducts';
import ShareButton from './children/ShareButton';
import VariantPicker from './children/VariantPicker';

const Page = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-350 px-3 pt-6 pb-16 sm:px-5 lg:px-8">{children}</div>
);

/**
 * The page of one product, for a customer: its pictures (and video), what it is called and costs, its rating, the
 * shades or options to choose from with the price, the pictures and the stock of the one that is chosen, a try-on
 * where the product has one, the texts about it, and more products of its category. The data is the public product of
 * the service - published products only; any other is "not available".
 *
 * The variant that is chosen is in the address (`?v=`), so a link to a shade is a link to that shade.
 */
const ProductDetails = () => {
  const { pathParams } = usePathParams();
  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProductBySlug(pathParams.slug ?? '');
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesHierarchy();
  const { queryParams, setParams } = useQueryParams();
  const [isTryOnOpen, setIsTryOnOpen] = useState(false);

  useDocumentTitle(product ? `${product.title} | Beautinique` : undefined);

  // a product that is not published (or is not there) is a 404: not "failed to load"
  const isNotFound = error instanceof ApiError && error.statusCode === 404;

  const variant = useMemo(
    () => (product ? getSelectedVariant(product, queryParams.v) : undefined),
    [product, queryParams.v],
  );

  const media = useMemo(() => (product ? buildProductMedia(product) : []), [product]);

  // The gallery starts at the product's own picture. It moves to the pictures of a variant when the shopper chooses
  // one (the address has `?v=` of a variant the product has), not for the one the page picked as the way to start.
  const isVariantInAddress = !!product?.variants.some((item) => item.sku === queryParams.v);
  const selectedMediaIndex = isVariantInAddress ? getVariantMediaIndex(media, variant) : 0;

  const labels = useMemo<Partial<IMediaLabels>>(
    () => ({
      preview: (item, index, total) =>
        `${product?.title ?? 'Product'} - ${item.type === 'video' ? 'video' : `image ${String(index + 1)} of ${String(total)}`}`,
    }),
    [product?.title],
  );

  // The shades of the try-on are the real colours of the product, never invented.
  const shades = useMemo(
    (): IShade[] =>
      (product?.variants ?? [])
        .filter((item) => item.type === 'Color')
        .map((item) => ({ name: item.label, hexColor: item.value })),
    [product],
  );

  const trail = useMemo(
    () =>
      product && categories ? (findCategoryTrailById(categories, product.category._id) ?? []) : [],
    [product, categories],
  );

  if (isLoading) {
    return (
      <Page>
        <ProductDetailsSkeleton />
      </Page>
    );
  }

  if (!product) {
    return (
      <Page>
        <ApiStatus
          className="min-h-[60dvh]"
          status={isError && !isNotFound ? 'error' : 'empty'}
          title={isError && !isNotFound ? 'Failed to load product' : 'Product not found'}
          description={
            isError && !isNotFound
              ? 'Something went wrong! Please try again.'
              : 'This product is not available (it may have been removed).'
          }
        />
        <div className="mx-auto w-full max-w-56">
          {isError && !isNotFound ? (
            <Button
              pattern="outline"
              content="Try again"
              leftIcon={{ icon: 'solar:refresh-linear' }}
              buttonProps={{
                onClick: () => {
                  void refetch();
                },
              }}
            />
          ) : (
            <Link to={toAbsolutePath(ROUTES.PRODUCTS.BASE)} className="block">
              <Button pattern="outline" content="Browse all products" />
            </Link>
          )}
        </div>
      </Page>
    );
  }

  const { sellingPrice, originalPrice, discount } = getPricing(product, variant);
  // the try-on of a product is a category and a sub category: a product that has none cannot be tried on
  const tryOn = product.tryOn.enabled && product.tryOn.configured ? product.tryOn : undefined;

  // "More like this" comes from the category above the product's own (its sub category), which has more products in it
  const relatedCategory = trail.length > 1 ? trail.at(-2) : trail.at(-1);

  return (
    <Page>
      <ListingBreadcrumb trail={trail} current={product.title} />

      <div className="mt-5 grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] xl:gap-14">
        {/* ---- the pictures ---- */}
        <div className="relative lg:sticky lg:top-24">
          <div className="bg-secondary-invert border-primary/10 overflow-hidden rounded-3xl border p-2 sm:p-3">
            <MediaCarouselWithParentMedia
              media={media}
              needButtonControls={false}
              selected={selectedMediaIndex}
              playerProps={VIDEO_PLAYER_PROPS}
              labels={labels}
              className="bg-transparent"
            />
          </div>

          {discount > 0 && (
            <span className="bg-accent-duo absolute top-5 left-5 rounded-full px-3 py-1 text-sm font-bold text-white shadow-sm">
              {discount}% off
            </span>
          )}
        </div>

        {/* ---- what it is, what it costs, what to choose ---- */}
        <div className="flex min-w-0 flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Link
              to={`${toAbsolutePath(ROUTES.PRODUCTS.BASE)}?brand=${encodeURIComponent(product.brand)}`}
              className="text-silver-jet hover:text-blue-crayola-c focus-visible:outline-blue-crayola-c w-fit rounded-sm text-sm font-semibold tracking-widest uppercase outline-offset-2 transition-colors duration-200"
            >
              {product.brand}
            </Link>
            <h1 className="text-3xl leading-tight font-bold tracking-tight md:text-4xl">
              {product.title}
            </h1>
            <RatingSummary
              rating={product.averageRating}
              reviews={product.totalReviews}
              soldCount={product.soldCount}
            />
            <p className="text-tertiary leading-7">{product.shortDescription}</p>
          </div>

          <PriceBlock
            sellingPrice={sellingPrice}
            originalPrice={originalPrice}
            discount={discount}
          />

          {product.hasVariants && product.variants.length > 0 && (
            <VariantPicker
              variants={product.variants}
              selectedSku={variant?.sku}
              onSelect={(sku) => {
                setParams({ v: sku }, { replace: true });
              }}
            />
          )}

          <AvailabilityNote availability={getStock(product, variant)} />

          <div className="flex flex-col gap-3 sm:flex-row">
            {tryOn && (
              <Button
                pattern="primary"
                content="Try it on"
                leftIcon={{ icon: 'solar:magic-stick-3-linear', className: 'size-5' }}
                buttonProps={{
                  onClick: () => {
                    setIsTryOnOpen(true);
                  },
                }}
              />
            )}
            <ShareButton title={product.title} />
          </div>

          <ProductAccordion product={product} />
        </div>
      </div>

      {/* Not before the categories are known: it would ask for the product's own category first and then for the one
          above it - two requests, and a list that changes under the shopper. */}
      {!isCategoriesLoading && (
        <RelatedProducts
          categoryId={relatedCategory?._id ?? product.category._id}
          categoryName={relatedCategory?.name ?? product.category.name}
          excludeId={product._id}
        />
      )}

      <TryOnModal
        isOpen={isTryOnOpen}
        onClose={() => {
          setIsTryOnOpen(false);
        }}
        tryOn={tryOn}
        shades={shades}
      />
    </Page>
  );
};

export default ProductDetails;
