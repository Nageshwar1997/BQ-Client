import { describe, expect, it } from 'vitest';

import type { IStorefrontProduct, IStorefrontVariant } from '@/types/api.type';

import {
  buildProductMedia,
  getPricing,
  getSelectedVariant,
  getStock,
  getVariantMediaIndex,
  pickRelatedProducts,
} from './product-details.util';

const variant = (overrides: Partial<IStorefrontVariant> = {}): IStorefrontVariant => ({
  sku: 'RUBY',
  type: 'Color',
  label: 'Ruby Red',
  value: '#c1121f',
  originalPrice: 800,
  sellingPrice: 600,
  discount: 25,
  inStock: true,
  lowStock: false,
  images: ['https://cdn/ruby-1.png'],
  thumbnail: 'https://cdn/ruby-thumb.png',
  ...overrides,
});

describe('getSelectedVariant', () => {
  const variants = [
    variant({ sku: 'GONE', inStock: false }),
    variant({ sku: 'NUDE' }),
    variant({ sku: 'PLUM' }),
  ];

  it('is the variant of the address', () => {
    expect(getSelectedVariant({ hasVariants: true, variants }, 'PLUM')?.sku).toBe('PLUM');
  });

  it('can be a variant that is out of stock, when the address says so', () => {
    expect(getSelectedVariant({ hasVariants: true, variants }, 'GONE')?.sku).toBe('GONE');
  });

  it('starts with the first variant that is in stock when the address has none', () => {
    expect(getSelectedVariant({ hasVariants: true, variants })?.sku).toBe('NUDE');
  });

  it('starts with the first variant when none is in stock', () => {
    const none = variants.map((item) => ({ ...item, inStock: false }));

    expect(getSelectedVariant({ hasVariants: true, variants: none })?.sku).toBe('GONE');
  });

  it('is the same as no address for an address with a variant the product does not have', () => {
    expect(getSelectedVariant({ hasVariants: true, variants }, 'NOPE')?.sku).toBe('NUDE');
  });

  it('is nothing for a product without variants, whatever the address says', () => {
    expect(getSelectedVariant({ hasVariants: false, variants: [] }, 'RUBY')).toBeUndefined();
    expect(getSelectedVariant({ hasVariants: false, variants }, 'NUDE')).toBeUndefined();
  });

  it('is nothing for a product that says it has variants and has none', () => {
    expect(getSelectedVariant({ hasVariants: true, variants: [] })).toBeUndefined();
  });
});

describe('getPricing', () => {
  const product = { sellingPrice: 549, originalPrice: 699, discount: 21 };

  it('is the price of the product when there is no variant', () => {
    expect(getPricing(product)).toEqual(product);
  });

  it('is the price of the variant that is chosen', () => {
    expect(getPricing(product, variant())).toEqual({
      sellingPrice: 600,
      originalPrice: 800,
      discount: 25,
    });
  });

  it("keeps a discount of 0 of the variant (not on sale) and does not fall back to the product's", () => {
    expect(getPricing(product, variant({ discount: 0, originalPrice: 600 })).discount).toBe(0);
  });
});

describe('getStock', () => {
  const product = { inStock: true, lowStock: false };

  it('is the stock of the product when there is no variant', () => {
    expect(getStock(product)).toBe('in-stock');
    expect(getStock({ inStock: false, lowStock: false })).toBe('out-of-stock');
  });

  it('is the stock of the variant that is chosen, not of the product', () => {
    expect(getStock(product, variant({ inStock: false }))).toBe('out-of-stock');
    expect(getStock(product, variant({ lowStock: true }))).toBe('low-stock');
  });
});

describe('buildProductMedia', () => {
  const product = {
    thumbnail: 'https://cdn/thumb.png',
    images: ['https://cdn/1.png', 'https://cdn/2.png'],
    video: undefined as string | undefined,
    variants: [] as IStorefrontVariant[],
  };

  it('is the thumbnail, then the images, of a product', () => {
    expect(buildProductMedia(product)).toEqual([
      { type: 'image', url: 'https://cdn/thumb.png' },
      { type: 'image', url: 'https://cdn/1.png' },
      { type: 'image', url: 'https://cdn/2.png' },
    ]);
  });

  it('shows an address once, though the thumbnail is also among the images', () => {
    const media = buildProductMedia({
      ...product,
      images: ['https://cdn/thumb.png', 'https://cdn/1.png'],
    });

    expect(media.map((item) => item.url)).toEqual(['https://cdn/thumb.png', 'https://cdn/1.png']);
  });

  it('adds the pictures of each variant (its thumbnail first) after the ones of the product', () => {
    const media = buildProductMedia({
      ...product,
      variants: [
        variant({ images: ['https://cdn/ruby-1.png', 'https://cdn/ruby-2.png'] }),
        variant({ sku: 'NUDE', thumbnail: undefined, images: ['https://cdn/nude-1.png'] }),
      ],
    });

    expect(media.map((item) => item.url)).toEqual([
      'https://cdn/thumb.png',
      'https://cdn/1.png',
      'https://cdn/2.png',
      'https://cdn/ruby-thumb.png',
      'https://cdn/ruby-1.png',
      'https://cdn/ruby-2.png',
      'https://cdn/nude-1.png',
    ]);
  });

  it('puts the video last, as a video', () => {
    const media = buildProductMedia({ ...product, video: 'https://cdn/clip.mp4' });

    expect(media.at(-1)).toEqual({ type: 'video', url: 'https://cdn/clip.mp4' });
  });

  it('leaves out a picture that has no address', () => {
    const media = buildProductMedia({ ...product, thumbnail: '', images: [] });

    expect(media).toEqual([]);
  });
});

describe('getVariantMediaIndex', () => {
  const media = [
    { type: 'image' as const, url: 'https://cdn/thumb.png' },
    { type: 'image' as const, url: 'https://cdn/ruby-thumb.png' },
    { type: 'image' as const, url: 'https://cdn/nude-1.png' },
    { type: 'video' as const, url: 'https://cdn/clip.mp4' },
  ];

  it('is where the thumbnail of the variant is', () => {
    expect(getVariantMediaIndex(media, variant())).toBe(1);
  });

  it('is where the first picture of the variant is when it has no thumbnail', () => {
    expect(
      getVariantMediaIndex(
        media,
        variant({ thumbnail: undefined, images: ['https://cdn/nude-1.png'] }),
      ),
    ).toBe(2);
  });

  it('is the start when there is no variant, or it has no picture, or its picture is not in the gallery', () => {
    expect(getVariantMediaIndex(media)).toBe(0);
    expect(getVariantMediaIndex(media, variant({ thumbnail: undefined, images: [] }))).toBe(0);
    expect(getVariantMediaIndex(media, variant({ thumbnail: 'https://cdn/other.png' }))).toBe(0);
  });

  it('does not take a video for a picture', () => {
    expect(getVariantMediaIndex(media, variant({ thumbnail: 'https://cdn/clip.mp4' }))).toBe(0);
  });
});

describe('pickRelatedProducts', () => {
  const card = (id: string) => ({ _id: id }) as IStorefrontProduct;
  const products = ['a', 'b', 'c', 'd', 'e'].map(card);

  it('leaves out the product that is open', () => {
    expect(pickRelatedProducts(products, 'b').map((item) => item._id)).toEqual([
      'a',
      'c',
      'd',
      'e',
    ]);
  });

  it('shows at most four, the first ones', () => {
    expect(pickRelatedProducts(products, 'zzz').map((item) => item._id)).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });

  it('shows as many as there are when there are fewer', () => {
    expect(pickRelatedProducts([card('a'), card('b')], 'a').map((item) => item._id)).toEqual(['b']);
    expect(pickRelatedProducts([], 'a')).toEqual([]);
  });

  it('can be asked for another number', () => {
    expect(pickRelatedProducts(products, 'zzz', 2)).toHaveLength(2);
  });
});
