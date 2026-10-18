import { Icon } from '@iconify/react';
import { useId, useState } from 'react';
import { Link } from 'react-router-dom';

import type { IStorefrontProduct } from '@/types/api.type';
import { buildProductPath, formatINRCurrency } from '@/utils/common.util';

interface IProductCard {
  product: IStorefrontProduct;
  /** The card is among the first on the page: its picture is loaded at once, not when it is scrolled to. */
  priority?: boolean;
}

const Rating = ({ rating, reviews }: { rating: number; reviews: number }) =>
  reviews > 0 ? (
    <p className="flex items-center gap-1 text-xs">
      <Icon icon="solar:star-bold" className="text-primary-yellow size-3.5" aria-hidden="true" />
      <span className="font-semibold">{rating.toFixed(1)}</span>
      <span className="text-silver-jet">
        <span className="sr-only">from </span>({reviews})<span className="sr-only"> reviews</span>
      </span>
    </p>
  ) : (
    <p className="text-silver-jet text-xs">No reviews yet</p>
  );

/**
 * One product of the listing: the picture (a second one shows when it is hovered), what is special
 * about it (percent off, try-on, few left, sold out), the brand, the name, the rating, the price and
 * the colours. The whole card is one link to the product - a link on the name that stretches over the
 * card - so a screen reader meets the name once, not the whole card read out as one long link.
 */
const ProductCard = ({ product, priority = false }: IProductCard) => {
  const titleId = useId();
  // a picture that does not load (a link that is dead) is not shown as a broken one
  const [thumbnailFailed, setThumbnailFailed] = useState(false);
  const [hoverFailed, setHoverFailed] = useState(false);
  const {
    title,
    brand,
    thumbnail,
    hoverImage,
    sellingPrice,
    originalPrice,
    discount,
    inStock,
    lowStock,
    hasTryOn,
    colors,
    colorCount,
  } = product;

  return (
    <article
      aria-labelledby={titleId}
      className="group has-[a:focus-visible]:ring-blue-crayola-c relative isolate flex w-full flex-col gap-3 rounded-2xl has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-offset-4 has-[a:focus-visible]:ring-offset-transparent"
    >
      <div className="bg-secondary-invert border-primary/10 relative aspect-4/5 overflow-hidden rounded-2xl border">
        {thumbnailFailed ? (
          <div className="absolute inset-0 grid place-items-center">
            <Icon
              icon="solar:gallery-wide-linear"
              className="text-silver-jet/60 size-12"
              aria-hidden="true"
            />
          </div>
        ) : (
          <img
            src={thumbnail}
            alt=""
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            onError={() => {
              setThumbnailFailed(true);
            }}
            className={`absolute inset-0 size-full object-cover transition duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none ${
              inStock ? '' : 'opacity-60 grayscale'
            }`}
          />
        )}
        {hoverImage && !thumbnailFailed && !hoverFailed && (
          <img
            src={hoverImage}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => {
              setHoverFailed(true);
            }}
            className="absolute inset-0 size-full scale-105 object-cover opacity-0 transition duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none"
          />
        )}

        <div className="absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2 text-[10px]/3">
          {discount > 0 ? (
            <span className="bg-accent-duo rounded-full px-2.5 py-1 font-bold text-white shadow-sm">
              {discount}% off
            </span>
          ) : (
            <span />
          )}
          {hasTryOn && (
            <span className="bg-primary-invert/80 border-primary/10 flex items-center gap-1 rounded-full border px-2 py-1 font-semibold backdrop-blur-md">
              <Icon icon="solar:magic-stick-3-linear" className="size-3" aria-hidden="true" />
              Try on
            </span>
          )}
        </div>

        {(!inStock || lowStock) && (
          <p
            className={`absolute inset-x-2.5 bottom-2.5 rounded-lg px-3 py-1.5 text-center text-xs font-semibold backdrop-blur-md ${
              inStock
                ? 'bg-primary-invert/80 text-primary-red'
                : 'bg-primary-invert/90 text-primary'
            }`}
          >
            {inStock ? 'Only a few left' : 'Sold out'}
          </p>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-1">
        <p className="text-silver-jet text-xs font-semibold tracking-widest uppercase">{brand}</p>

        <h3 id={titleId} className="line-clamp-2 min-h-10 text-sm leading-5 font-semibold">
          <Link
            to={buildProductPath(product.slug)}
            className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-2xl"
          >
            {title}
          </Link>
        </h3>

        <Rating rating={product.averageRating} reviews={product.totalReviews} />

        <p className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-1">
          <span className="text-base font-bold">
            <span className="sr-only">Price </span>
            {formatINRCurrency(sellingPrice)}
          </span>
          {discount > 0 && (
            <span className="text-silver-jet text-xs line-through">
              <span className="sr-only">Was </span>
              {formatINRCurrency(originalPrice)}
            </span>
          )}
        </p>

        {colorCount > 0 && (
          <ul className="flex items-center gap-1.5" aria-label={`${String(colorCount)} colours`}>
            {colors.map((color) => (
              <li
                key={`${color.label}-${color.value}`}
                title={color.label}
                role="img"
                aria-label={color.label}
                className={`border-primary/25 size-4 rounded-full border ${
                  color.inStock ? '' : 'opacity-40'
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
            {colorCount > colors.length && (
              <li className="text-silver-jet text-xs">+{colorCount - colors.length}</li>
            )}
          </ul>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
