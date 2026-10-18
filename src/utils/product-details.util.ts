import type { TMediaOption } from '@beautinique/frontend-components/media';

import type {
  IStorefrontProduct,
  IStorefrontProductDetails,
  IStorefrontVariant,
} from '@/types/api.type';
import { getAvailability, type TAvailability } from '@/utils/availability.util';

/**
 * The variant the page shows: the one in the address (`?v=`), else the first one that is in stock, else the first one.
 * A shopper who has chosen nothing still sees a price, a picture and a stock - the product's way of starting - and an
 * address with a variant that does not exist is the same as one without. `undefined` for a product without variants.
 */
export const getSelectedVariant = (
  product: Pick<IStorefrontProductDetails, 'hasVariants' | 'variants'>,
  sku?: string,
): IStorefrontVariant | undefined => {
  if (!product.hasVariants || product.variants.length === 0) return undefined;

  return (
    product.variants.find((variant) => variant.sku === sku) ??
    product.variants.find((variant) => variant.inStock) ??
    product.variants[0]
  );
};

/** What the page shows for the choice: the price of the variant that is chosen, else of the product. */
export const getPricing = (
  product: Pick<IStorefrontProductDetails, 'sellingPrice' | 'originalPrice' | 'discount'>,
  variant?: Pick<IStorefrontVariant, 'sellingPrice' | 'originalPrice' | 'discount'>,
) => ({
  sellingPrice: variant?.sellingPrice ?? product.sellingPrice,
  originalPrice: variant?.originalPrice ?? product.originalPrice,
  discount: variant?.discount ?? product.discount,
});

/** The stock the page says: of the variant that is chosen, else of the product. */
export const getStock = (
  product: Pick<IStorefrontProductDetails, 'inStock' | 'lowStock'>,
  variant?: Pick<IStorefrontVariant, 'inStock' | 'lowStock'>,
): TAvailability => getAvailability(variant ?? product);

/**
 * The pictures and the video of a product, for its gallery, each address once: the product's own pictures first, then
 * those of each variant (its thumbnail, then its other pictures), then the video.
 */
export const buildProductMedia = (
  product: Pick<IStorefrontProductDetails, 'thumbnail' | 'images' | 'video' | 'variants'>,
): TMediaOption[] => {
  const images = [
    product.thumbnail,
    ...product.images,
    ...product.variants.flatMap((variant) => [variant.thumbnail, ...variant.images]),
  ].filter((url): url is string => !!url);

  const media: TMediaOption[] = [...new Set(images)].map((url) => ({ type: 'image', url }));

  if (product.video) media.push({ type: 'video', url: product.video });

  return media;
};

/**
 * Where the pictures of a variant begin in the gallery (its thumbnail, else its first picture): the gallery moves
 * there when the variant is chosen. 0 - the start - when the variant has no picture or there is no variant.
 */
export const getVariantMediaIndex = (
  media: readonly TMediaOption[],
  variant?: Pick<IStorefrontVariant, 'thumbnail' | 'images'>,
) => {
  const url = variant?.thumbnail ?? variant?.images[0];

  if (!url) return 0;

  const index = media.findIndex((item) => item.type === 'image' && item.url === url);

  return index >= 0 ? index : 0;
};

/** The products of a list that are worth showing as "more like this": not the one that is open, and at most `max`. */
export const pickRelatedProducts = (
  products: readonly IStorefrontProduct[],
  excludeId: string,
  max = 4,
) => products.filter((product) => product._id !== excludeId).slice(0, max);
