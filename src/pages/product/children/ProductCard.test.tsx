// @vitest-environment jsdom
import { act } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';
import type { IStorefrontProduct } from '@/types/api.type';

import ProductCard from './ProductCard';

const product = (overrides: Partial<IStorefrontProduct> = {}): IStorefrontProduct => ({
  _id: 'p1',
  title: 'Velvet Matte Lipstick',
  slug: 'velvet-matte-lipstick',
  brand: 'Beautinique',
  shortDescription: 'A long wearing matte lipstick.',
  thumbnail: 'https://cdn.example/thumb.png',
  hoverImage: 'https://cdn.example/hover.png',
  originalPrice: 699,
  sellingPrice: 549,
  discount: 21,
  averageRating: 4.8,
  totalReviews: 140,
  soldCount: 12,
  inStock: true,
  lowStock: false,
  hasTryOn: true,
  hasVariants: true,
  colors: [
    { label: 'Ruby', value: '#c1121f', inStock: true },
    { label: 'Nude', value: '#d9a384', inStock: false },
  ],
  colorCount: 2,
  createdAt: '2026-07-24T19:17:38.990Z',
  ...overrides,
});

const render = (item: IStorefrontProduct, priority = false) =>
  mount(
    <MemoryRouter>
      <ProductCard product={item} priority={priority} />
    </MemoryRouter>,
  ).container;

const text = (container: HTMLElement) => container.textContent;

describe('ProductCard', () => {
  afterEach(() => {
    unmountAll();
  });

  it('is one link to the product, on its name', () => {
    const container = render(product());
    const links = container.querySelectorAll('a');

    expect(links).toHaveLength(1);
    expect(links[0]?.getAttribute('href')).toBe('/products/product/velvet-matte-lipstick');
    expect(links[0]?.textContent).toBe('Velvet Matte Lipstick');
    // the name is the name of the card
    const article = container.querySelector('article');
    const titleId = article?.getAttribute('aria-labelledby') ?? '';

    expect(container.querySelector(`[id="${titleId}"]`)?.textContent).toBe('Velvet Matte Lipstick');
  });

  it('shows the brand, the rating with its reviews, and the price with what it was', () => {
    const content = text(render(product()));

    expect(content).toContain('Beautinique');
    expect(content).toContain('4.8');
    expect(content).toContain('(140)');
    expect(content).toContain('₹549');
    expect(content).toContain('₹699');
    expect(content).toContain('21% off');
  });

  it('shows no percent and no old price when the product is not on sale', () => {
    const content = text(render(product({ discount: 0, originalPrice: 549 })));

    expect(content).toContain('₹549');
    expect(content).not.toContain('% off');
    expect(content).not.toContain('Was');
  });

  it('says there are no reviews yet, and does not show a rating of 0', () => {
    const content = text(render(product({ totalReviews: 0, averageRating: 0 })));

    expect(content).toContain('No reviews yet');
    expect(content).not.toContain('0.0');
  });

  it('shows the try-on badge only for a product that has it', () => {
    expect(text(render(product({ hasTryOn: true })))).toContain('Try on');
    unmountAll();
    expect(text(render(product({ hasTryOn: false })))).not.toContain('Try on');
  });

  it('says "Sold out" and greys the picture out when nothing is left', () => {
    const container = render(product({ inStock: false }));

    expect(text(container)).toContain('Sold out');
    expect(text(container)).not.toContain('Only a few left');
    expect(container.querySelector('img')?.className).toContain('grayscale');
  });

  it('says "Only a few left" for a product that is nearly gone, and nothing for one that is not', () => {
    expect(text(render(product({ lowStock: true })))).toContain('Only a few left');
    unmountAll();

    const plain = render(product());

    expect(text(plain)).not.toContain('Only a few left');
    expect(text(plain)).not.toContain('Sold out');
  });

  it('shows the colours, names each one, and counts the ones that do not fit', () => {
    const container = render(product({ colorCount: 9 }));
    const swatches = container.querySelectorAll('[role="img"]');

    expect(swatches).toHaveLength(2);
    expect([...swatches].map((swatch) => swatch.getAttribute('aria-label'))).toEqual([
      'Ruby',
      'Nude',
    ]);
    expect((swatches[0] as HTMLElement).style.backgroundColor).not.toBe('');
    expect(text(container)).toContain('+7');
    expect(container.querySelector('ul')?.getAttribute('aria-label')).toBe('9 colours');
  });

  it('does not count the colours that are all shown', () => {
    const container = render(product({ colorCount: 2 }));

    expect(container.querySelectorAll('[role="img"]')).toHaveLength(2);
    expect(text(container)).not.toContain('+');
  });

  it('shows no colours for a product that has none', () => {
    const container = render(product({ colors: [], colorCount: 0, hasVariants: false }));

    expect(container.querySelector('ul')).toBeNull();
  });

  it('shows a second picture for the hover, and loads the first at once only when it is among the first', () => {
    const container = render(product(), true);
    const [first, second] = container.querySelectorAll('img');

    expect(first?.getAttribute('src')).toBe('https://cdn.example/thumb.png');
    expect(first?.getAttribute('loading')).toBe('eager');
    expect(second?.getAttribute('src')).toBe('https://cdn.example/hover.png');
    expect(second?.getAttribute('loading')).toBe('lazy');
    unmountAll();

    expect(render(product()).querySelector('img')?.getAttribute('loading')).toBe('lazy');
  });

  it('has no second picture when the product has one only', () => {
    expect(render(product({ hoverImage: undefined })).querySelectorAll('img')).toHaveLength(1);
  });

  it('puts a place holder where a picture does not load, instead of a broken one', () => {
    const container = render(product());

    act(() => {
      container.querySelector('img')?.dispatchEvent(new Event('error'));
    });

    expect(container.querySelectorAll('img')).toHaveLength(0);
    // the place holder is the icon of a picture, drawn where the picture was
    expect(container.querySelector('.place-items-center > *')).not.toBeNull();
  });
});
