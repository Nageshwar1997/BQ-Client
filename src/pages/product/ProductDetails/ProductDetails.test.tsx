// @vitest-environment jsdom
import { act } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ApiError from '@/classes/ApiError';
import { mount, unmountAll } from '@/test-utils/react';
import type { IStorefrontProductDetails, IStorefrontVariant } from '@/types/api.type';

import ProductDetails from './index';

interface IQueryState {
  data?: IStorefrontProductDetails;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

const useGetProductBySlug = vi.fn();
const carousel = vi.fn();
const tryOnModal = vi.fn();

vi.mock('@/services/product-service/product.service.query', () => ({
  useGetProductBySlug: (slug: string): unknown => useGetProductBySlug(slug),
}));

// The carousel, the try-on and the text editor have their own tests: here only what the page gives them is looked at.
vi.mock('@beautinique/frontend-components/media', () => ({
  MediaCarouselWithParentMedia: (props: unknown) => {
    carousel(props);

    return <div data-testid="carousel" />;
  },
}));

vi.mock('@/components/layout/tryons', () => ({
  default: (props: unknown) => {
    tryOnModal(props);

    return <div data-testid="try-on" />;
  },
}));

vi.mock('@beautinique/frontend-quill', () => ({
  QuillContent: ({ content }: { content: string }) => <div data-testid="quill">{content}</div>,
}));

const variant = (overrides: Partial<IStorefrontVariant> = {}): IStorefrontVariant => ({
  sku: 'LIP-RUBY',
  type: 'Color',
  label: 'Ruby Red',
  value: '#c1121f',
  originalPrice: 800,
  sellingPrice: 600,
  discount: 25,
  inStock: true,
  lowStock: false,
  images: ['https://cdn.example/ruby-1.png'],
  thumbnail: 'https://cdn.example/ruby-thumb.png',
  ...overrides,
});

const product = (
  overrides: Partial<IStorefrontProductDetails> = {},
): IStorefrontProductDetails => ({
  _id: 'p1',
  title: 'Velvet Matte Lipstick',
  slug: 'velvet-matte-lipstick',
  brand: 'Beautinique',
  shortDescription: 'Premium matte lipstick.',
  description: '<p>Smooth application.</p>',
  instructions: '<p>Apply on clean lips.</p>',
  thumbnail: 'https://cdn.example/thumb.png',
  images: ['https://cdn.example/1.png', 'https://cdn.example/2.png'],
  category: { _id: 'c1', name: 'Matte Lipstick' },
  originalPrice: 699,
  sellingPrice: 549,
  discount: 21,
  averageRating: 4.8,
  totalReviews: 145,
  soldCount: 20,
  inStock: true,
  lowStock: false,
  hasVariants: false,
  tryOn: { configured: true, enabled: true, category: 'LIP', subCategory: 'MATTE' },
  variants: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

const withVariants = (...variants: IStorefrontVariant[]) =>
  product({ hasVariants: true, variants, inStock: variants.some((item) => item.inStock) });

const state = (overrides: Partial<IQueryState> = {}): IQueryState => ({
  data: product(),
  isLoading: false,
  isError: false,
  error: null,
  ...overrides,
});

const Search = () => <output data-testid="search">{useLocation().search}</output>;

const render = (query: IQueryState, url = '/products/product/velvet-matte-lipstick') => {
  useGetProductBySlug.mockReturnValue(query);

  const view = mount(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/products/product/:slug" element={<ProductDetails />} />
      </Routes>
      <Search />
    </MemoryRouter>,
  );

  return {
    ...view,
    text: () => view.container.textContent,
    search: () => view.container.querySelector('[data-testid="search"]')?.textContent,
    button: (name: string) =>
      [...view.container.querySelectorAll('button')].find((item) => item.textContent === name),
    lastCarousel: () =>
      carousel.mock.lastCall?.[0] as { media: { url: string }[]; selected: number },
    lastTryOn: () =>
      tryOnModal.mock.lastCall?.[0] as {
        isOpen: boolean;
        tryOn?: unknown;
        shades: { name: string; hexColor: string }[];
      },
  };
};

const press = (element: Element | undefined | null) => {
  if (!element) throw new Error('There is nothing to press');

  act(() => {
    (element as HTMLElement).click();
  });
};

describe('ProductDetails', () => {
  beforeEach(() => {
    useGetProductBySlug.mockReset();
    carousel.mockReset();
    tryOnModal.mockReset();

    // jsdom has no ResizeObserver: the scrollers of the page watch their own size with one
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {
          // the size is never read in these tests
        }

        unobserve() {
          // nothing is taken off the watch
        }

        disconnect() {
          // nor is the watch ended
        }
      },
    );
  });

  afterEach(() => {
    unmountAll();
    vi.unstubAllGlobals();
  });

  it('asks for the product of the address', () => {
    render(state(), '/products/product/some-slug');

    expect(useGetProductBySlug).toHaveBeenCalledWith('some-slug');
  });

  describe('while it is not there', () => {
    it('says it is loading', () => {
      const { text } = render(state({ data: undefined, isLoading: true }));

      expect(text()).toContain('Loading Product...');
    });

    it('says the product is not available - not that it failed - when the service said 404', () => {
      const { text, container } = render(
        state({
          data: undefined,
          isError: true,
          error: new ApiError({ message: 'Product not found', statusCode: 404 }),
        }),
      );

      // an answer, not an alarm: it is not announced as an error
      expect(container.querySelector('[role="alert"]')).toBeNull();
      expect(container.querySelector('[role="status"]')).not.toBeNull();
      expect(text()).toContain('Product not found');
      expect(text()).toContain('not available');
      expect(text()).not.toContain('Failed to load product');
    });

    it('says it failed, and to try again, for any other failure', () => {
      const { text, container } = render(
        state({
          data: undefined,
          isError: true,
          error: new ApiError({ message: 'Boom', statusCode: 500 }),
        }),
      );

      // a failure is announced as one
      expect(container.querySelector('[role="alert"]')).not.toBeNull();
      expect(text()).toContain('Failed to load product');
      expect(text()).toContain('try again');
    });

    it('says it failed for a failure that had no answer (no connection)', () => {
      const { text } = render(
        state({
          data: undefined,
          isError: true,
          error: new ApiError({ message: 'Network Error' }),
        }),
      );

      expect(text()).toContain('Failed to load product');
    });

    it('says the product is not found when there is nothing and nothing failed', () => {
      expect(render(state({ data: undefined })).text()).toContain('Product not found');
    });
  });

  describe('the product', () => {
    it('shows its name, brand, short description and category', () => {
      const { container, text } = render(state());

      expect(container.querySelector('h1')?.textContent).toBe('Velvet Matte Lipstick');
      expect(text()).toContain('Beautinique');
      expect(text()).toContain('Premium matte lipstick.');
      expect(text()).toContain('Matte Lipstick');
    });

    it('shows the price, what it was, and what is saved', () => {
      const { text } = render(state());

      expect(text()).toContain('₹549');
      expect(text()).toContain('₹699');
      expect(text()).toContain('Save ₹150 (21% off)');
      expect(text()).toContain('-21%');
    });

    it('shows the rating and how many reviews it is of', () => {
      const { text } = render(state());

      expect(text()).toContain('4.8');
      expect(text()).toContain('(145 reviews)');
    });

    it('shows nothing the storefront is not told: no history of the review, no sku', () => {
      const { text } = render(state());

      expect(text()).not.toMatch(/Approved On|Blocked On|Rejection Reason/);
      expect(text()).not.toMatch(/\bSKU\b/);
    });

    it('gives the carousel the pictures of the product: the thumbnail, the images, and the video', () => {
      const { lastCarousel } = render(
        state({ data: product({ video: 'https://cdn.example/clip.mp4' }) }),
      );

      expect(lastCarousel().media.map((item) => item.url)).toEqual([
        'https://cdn.example/thumb.png',
        'https://cdn.example/1.png',
        'https://cdn.example/2.png',
        'https://cdn.example/clip.mp4',
      ]);
      expect(lastCarousel().selected).toBe(0);
    });

    it('shows the description, the instructions, the ingredients and the extra info - only those it has', () => {
      const { container } = render(state());

      expect(
        [...container.querySelectorAll('[data-testid="quill"]')].map((item) => item.textContent),
      ).toEqual(['<p>Smooth application.</p>', '<p>Apply on clean lips.</p>']);
    });
  });

  describe('the stock', () => {
    it('says "In stock" for a product that has some', () => {
      expect(render(state()).text()).toContain('In stock');
    });

    it('says "Only a few left" for one that is nearly gone', () => {
      expect(render(state({ data: product({ lowStock: true }) })).text()).toContain(
        'Only a few left',
      );
    });

    it('says "Out of stock" for one that has none', () => {
      const { text } = render(state({ data: product({ inStock: false }) }));

      expect(text()).toContain('Out of stock');
      expect(text()).not.toContain('In stock');
    });

    it('never says a number of items', () => {
      expect(render(state()).text()).not.toMatch(/\d+ in stock/);
    });
  });

  describe('a product with variants', () => {
    const lipsticks = () =>
      state({
        data: withVariants(
          variant(),
          variant({
            sku: 'LIP-NUDE',
            label: 'Nude',
            value: '#d9a384',
            sellingPrice: 500,
            originalPrice: 700,
            discount: 29,
            lowStock: true,
            images: ['https://cdn.example/nude-1.png'],
            thumbnail: undefined,
          }),
          variant({ sku: 'LIP-PLUM', label: 'Plum', inStock: false }),
          variant({ sku: 'LIP-MINI', type: 'Text', label: 'Size', value: 'Mini', images: [] }),
        ),
      });

    it('shows its variants, and says nothing about the stock until one is chosen', () => {
      const { text } = render(lipsticks());

      expect(text()).toContain('Ruby Red');
      expect(text()).toContain('Nude');
      expect(text()).toContain('Plum');
      expect(text()).not.toMatch(/In stock|Only a few left|Out of stock/);
    });

    it('shows the price of the variant that is chosen (from the address) and its own stock', () => {
      const { text } = render(lipsticks(), '/products/product/velvet-matte-lipstick?v=LIP-NUDE');

      expect(text()).toContain('Variant: Nude');
      expect(text()).toContain('₹500');
      expect(text()).toContain('₹700');
      expect(text()).toContain('Save ₹200 (29% off)');
      expect(text()).toContain('Only a few left');
    });

    it('says "Out of stock" for a variant that has none, though the product has others', () => {
      const { text } = render(lipsticks(), '/products/product/velvet-matte-lipstick?v=LIP-PLUM');

      expect(text()).toContain('Out of stock');
    });

    it('puts the variant that is pressed in the address', () => {
      const { container, search } = render(lipsticks());
      const nude = [...container.querySelectorAll('[role="button"]')].find((item) =>
        item.textContent.includes('Nude'),
      );

      press(nude);

      expect(search()).toBe('?v=LIP-NUDE');
    });

    it('moves the carousel to the picture of the variant that is chosen', () => {
      const { lastCarousel } = render(
        lipsticks(),
        '/products/product/velvet-matte-lipstick?v=LIP-NUDE',
      );
      const urls = lastCarousel().media.map((item) => item.url);

      expect(urls[lastCarousel().selected]).toBe('https://cdn.example/nude-1.png');
    });

    it('moves the carousel to the thumbnail of the variant when it has one, before its other pictures', () => {
      const { lastCarousel } = render(
        lipsticks(),
        '/products/product/velvet-matte-lipstick?v=LIP-RUBY',
      );
      const urls = lastCarousel().media.map((item) => item.url);

      expect(urls[lastCarousel().selected]).toBe('https://cdn.example/ruby-thumb.png');
    });

    it('gives the try-on the colours of the variants, as shades', () => {
      // a variant that is a text (a size), not a colour, is not a shade
      const { lastTryOn } = render(lipsticks());

      expect(lastTryOn().shades).toEqual([
        { name: 'Ruby Red', hexColor: '#c1121f' },
        { name: 'Nude', hexColor: '#d9a384' },
        { name: 'Plum', hexColor: '#c1121f' },
      ]);
    });

    it('ignores a variant in the address that the product does not have', () => {
      const { text } = render(lipsticks(), '/products/product/velvet-matte-lipstick?v=NOPE');

      expect(text()).not.toContain('Variant:');
      expect(text()).not.toMatch(/In stock|Only a few left|Out of stock/);
    });
  });

  describe('the try-on', () => {
    it('opens with its button, for a product that has it', () => {
      const { button, lastTryOn } = render(state());

      expect(lastTryOn().isOpen).toBe(false);

      press(button('Try-On'));

      expect(lastTryOn().isOpen).toBe(true);
      expect(lastTryOn().tryOn).toEqual({
        configured: true,
        enabled: true,
        category: 'LIP',
        subCategory: 'MATTE',
      });
    });

    it('has its button off, and gives the modal nothing, when the try-on is not enabled', () => {
      const { button, lastTryOn } = render(
        state({ data: product({ tryOn: { enabled: false, configured: false } }) }),
      );

      expect(button('Try-On')?.disabled).toBe(true);
      expect(lastTryOn().tryOn).toBeUndefined();
    });
  });
});
