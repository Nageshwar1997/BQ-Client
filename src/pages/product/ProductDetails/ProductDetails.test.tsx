// @vitest-environment jsdom
import { act } from 'react';
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ApiError from '@/classes/ApiError';
import { mount, unmountAll } from '@/test-utils/react';
import type { IStorefrontProductDetails, IStorefrontVariant } from '@/types/api.type';
import type { TCategoryNode } from '@/utils/category.util';

import ProductDetails from './index';

interface IQueryState {
  data?: IStorefrontProductDetails;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => unknown;
}

const useGetProductBySlug = vi.fn();
const useGetCategoriesHierarchy = vi.fn();
const refetch = vi.fn();
const carousel = vi.fn();
const tryOnModal = vi.fn();
const relatedProducts = vi.fn();

vi.mock('@/services/product-service/product.service.query', () => ({
  useGetProductBySlug: (slug: string): unknown => useGetProductBySlug(slug),
}));

vi.mock('@/services/product-service/category.service.query', () => ({
  useGetCategoriesHierarchy: (): unknown => useGetCategoriesHierarchy(),
}));

// The carousel, the try-on, the text, the share button and the related products have their own tests: here only what
// the page gives them is looked at.
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

vi.mock('./children/ShareButton', () => ({
  default: ({ title }: { title: string }) => (
    <button data-testid="share">{`Share ${title}`}</button>
  ),
}));

vi.mock('./children/RelatedProducts', () => ({
  default: (props: unknown) => {
    relatedProducts(props);

    return <section data-testid="related" />;
  },
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
  category: { _id: 'c3', name: 'Matte Lipstick' },
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

const node = (
  _id: string,
  name: string,
  slug: string,
  level: 1 | 2 | 3,
  subcategories: TCategoryNode[] = [],
) => ({ _id, name, slug, level, subcategories }) as unknown as TCategoryNode;

// Lips > Lip Colour > Matte Lipstick (the category of the product), and a branch the product is not in
const categories = [
  node('c1', 'Lips', 'lips', 1, [
    node('c2', 'Lip Colour', 'lip-colour', 2, [node('c3', 'Matte Lipstick', 'matte-lipstick', 3)]),
  ]),
  node('x1', 'Eyes', 'eyes', 1),
];

const state = (overrides: Partial<IQueryState> = {}): IQueryState => ({
  data: product(),
  isLoading: false,
  isError: false,
  error: null,
  refetch,
  ...overrides,
});

const Search = () => <output data-testid="search">{useLocation().search}</output>;
const Back = () => {
  const navigate = useNavigate();

  return (
    <button
      data-testid="back"
      onClick={() => {
        void navigate(-1);
      }}
    />
  );
};

const render = (query: IQueryState, url = '/products/product/velvet-matte-lipstick') => {
  useGetProductBySlug.mockReturnValue(query);

  const view = mount(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/products/product/:slug" element={<ProductDetails />} />
      </Routes>
      <Search />
      <Back />
    </MemoryRouter>,
  );

  return {
    ...view,
    text: () => view.container.textContent,
    search: () => view.container.querySelector('[data-testid="search"]')?.textContent,
    button: (name: string) =>
      [...view.container.querySelectorAll('button')].find((item) => item.textContent === name),
    option: (label: string) =>
      [...view.container.querySelectorAll<HTMLInputElement>('input[type="radio"]')].find((item) =>
        item.closest('label')?.getAttribute('title')?.startsWith(label),
      ),
    legend: () => view.container.querySelector('legend')?.textContent,
    lastCarousel: () =>
      carousel.mock.lastCall?.[0] as {
        media: { type: string; url: string }[];
        selected: number;
        labels: { preview: (item: { type: string }, index: number, total: number) => string };
      },
    lastTryOn: () =>
      tryOnModal.mock.lastCall?.[0] as {
        isOpen: boolean;
        tryOn?: unknown;
        shades: { name: string; hexColor: string }[];
      },
    lastRelated: () =>
      relatedProducts.mock.lastCall?.[0] as {
        categoryId: string;
        categoryName: string;
        excludeId: string;
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
    useGetCategoriesHierarchy.mockReset().mockReturnValue({ data: categories });
    refetch.mockReset();
    carousel.mockReset();
    tryOnModal.mockReset();
    relatedProducts.mockReset();
    document.title = 'Beautinique';

    // jsdom has no ResizeObserver: the breadcrumb watches its own size with one
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
    it('shows the shape of the page, as a busy status, while it loads', () => {
      const { container, text } = render(state({ data: undefined, isLoading: true }));

      expect(container.querySelector('[role="status"][aria-busy="true"]')).not.toBeNull();
      expect(text()).toContain('Loading product');
      expect(container.querySelector('h1')).toBeNull();
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
      expect(text()).not.toContain('Try again');
    });

    it('sends a shopper of a product that is not there to all the products', () => {
      const { container } = render(
        state({
          data: undefined,
          isError: true,
          error: new ApiError({ message: 'Product not found', statusCode: 404 }),
        }),
      );
      const link = container.querySelector('a');

      expect(link?.textContent).toBe('Browse all products');
      expect(link?.getAttribute('href')).toBe('/products');
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
      expect(container.querySelector('a')).toBeNull();
    });

    it('asks again when "Try again" is pressed', () => {
      const { button } = render(
        state({
          data: undefined,
          isError: true,
          error: new ApiError({ message: 'Boom', statusCode: 500 }),
        }),
      );

      press(button('Try again'));

      expect(refetch).toHaveBeenCalledTimes(1);
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

    it('says it failed for an error that is not from the service', () => {
      const { text } = render(
        state({ data: undefined, isError: true, error: new Error('Something broke') }),
      );

      expect(text()).toContain('Failed to load product');
    });

    it('says the product is not found when there is nothing and nothing failed', () => {
      expect(render(state({ data: undefined })).text()).toContain('Product not found');
    });
  });

  describe('the product', () => {
    it('shows its name, as the heading of the page, and its short description', () => {
      const { container, text } = render(state());

      expect(container.querySelector('h1')?.textContent).toBe('Velvet Matte Lipstick');
      expect(text()).toContain('Premium matte lipstick.');
    });

    it('links its brand to the products of that brand', () => {
      const { container } = render(state());
      const brand = [...container.querySelectorAll('a')].find(
        (link) => link.textContent === 'Beautinique',
      );

      expect(brand?.getAttribute('href')).toBe('/products?brand=Beautinique');
    });

    it('writes the brand in the link so a name with a space or an ampersand survives', () => {
      const { container } = render(state({ data: product({ brand: 'Maybelline & Co' }) }));
      const brand = [...container.querySelectorAll('a')].find((link) =>
        link.textContent.includes('Maybelline'),
      );

      expect(brand?.getAttribute('href')).toBe('/products?brand=Maybelline%20%26%20Co');
    });

    it('shows the price, what it was, the percent off and what is saved', () => {
      const { text } = render(state());

      expect(text()).toContain('₹549');
      expect(text()).toContain('₹699');
      expect(text()).toContain('21% off');
      expect(text()).toContain('You save ₹150');
    });

    it('puts the percent off on the pictures too, for a product on sale', () => {
      const { container } = render(state());

      expect(container.querySelector('.bg-accent-duo')?.textContent).toBe('21% off');
    });

    it('shows no percent off and no savings for a product that is not on sale', () => {
      const { container, text } = render(
        state({ data: product({ originalPrice: 549, sellingPrice: 549, discount: 0 }) }),
      );

      expect(container.querySelector('.bg-accent-duo')).toBeNull();
      expect(text()).not.toContain('% off');
      expect(text()).not.toContain('You save');
    });

    it('shows the rating, how many reviews it is of, and how many were sold', () => {
      const { text, container } = render(state());

      expect(text()).toContain('4.8');
      expect(text()).toContain('(145 reviews)');
      expect(text()).toContain('20 sold');
      expect(
        container.querySelector('[role="img"][aria-label^="Rated"]')?.getAttribute('aria-label'),
      ).toBe('Rated 4.8 out of 5 from 145 reviews');
    });

    it('says a product nobody reviewed has no reviews', () => {
      const { text } = render(
        state({ data: product({ averageRating: 0, totalReviews: 0, soldCount: 0 }) }),
      );

      expect(text()).toContain('No reviews yet');
      expect(text()).not.toContain('sold');
    });

    it('shows nothing that is for the people who run the shop: no history of the review, no sku, no slug', () => {
      const { text } = render(state());

      expect(text()).not.toMatch(/Approved On|Blocked On|Rejection Reason|Add Review/);
      expect(text()).not.toMatch(/\bSKU\b/);
      expect(text()).not.toContain('velvet-matte-lipstick');
      expect(text()).not.toMatch(/Configure|Disable|Enable|History/);
    });

    it('shows no way to buy: there is no bag yet', () => {
      expect(render(state()).text()).not.toMatch(/Add to (bag|cart)|Buy now|Wishlist/i);
    });

    it('has a share button for the product', () => {
      expect(render(state()).button('Share Velvet Matte Lipstick')).toBeDefined();
    });

    it('names the tab after the product while it is open, and gives the old name back after', () => {
      const { unmount } = render(state());

      expect(document.title).toBe('Velvet Matte Lipstick | Beautinique');

      unmount();

      expect(document.title).toBe('Beautinique');
    });

    it('leaves the name of the tab alone while the product is not there', () => {
      render(state({ data: undefined, isLoading: true }));

      expect(document.title).toBe('Beautinique');
    });

    it('shows the description and the instructions - only the texts it has', () => {
      const { container, text } = render(state());

      expect(
        [...container.querySelectorAll('[data-testid="quill"]')].map((item) => item.textContent),
      ).toEqual(['<p>Smooth application.</p>', '<p>Apply on clean lips.</p>']);
      expect(text()).toContain('Description');
      expect(text()).toContain('How to use');
      expect(text()).not.toContain('Ingredients');
    });
  });

  describe('the pictures', () => {
    it('give the carousel the pictures of the product: the thumbnail, the images, and the video', () => {
      const { lastCarousel } = render(
        state({ data: product({ video: 'https://cdn.example/clip.mp4' }) }),
      );

      expect(lastCarousel().media.map((item) => item.url)).toEqual([
        'https://cdn.example/thumb.png',
        'https://cdn.example/1.png',
        'https://cdn.example/2.png',
        'https://cdn.example/clip.mp4',
      ]);
      expect(lastCarousel().media.at(-1)?.type).toBe('video');
      expect(lastCarousel().selected).toBe(0);
    });

    it('name each picture after the product, for a screen reader', () => {
      const { lastCarousel } = render(state());
      const { preview } = lastCarousel().labels;

      expect(preview({ type: 'image' }, 0, 3)).toBe('Velvet Matte Lipstick - image 1 of 3');
      expect(preview({ type: 'image' }, 2, 3)).toBe('Velvet Matte Lipstick - image 3 of 3');
      expect(preview({ type: 'video' }, 3, 4)).toBe('Velvet Matte Lipstick - video');
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
      expect(render(state()).text()).not.toMatch(/\d+ (items |units )?(in stock|left)/);
    });
  });

  describe('the breadcrumb', () => {
    it('goes down the categories of the product, each a link, and ends with the product', () => {
      const { container } = render(state());
      const nav = container.querySelector('nav[aria-label="Breadcrumb"]');

      expect(
        [...(nav?.querySelectorAll('a') ?? [])].map((link) => link.getAttribute('href')),
      ).toEqual([
        '/',
        '/products',
        '/products/lips',
        '/products/lips/lip-colour',
        '/products/lips/lip-colour/matte-lipstick',
      ]);
      expect(nav?.querySelector('[aria-current="page"]')?.textContent).toBe(
        'Velvet Matte Lipstick',
      );
    });

    it('is only Home / Products / the product while the categories are not there yet', () => {
      useGetCategoriesHierarchy.mockReturnValue({ data: undefined });

      const { container } = render(state());
      const nav = container.querySelector('nav[aria-label="Breadcrumb"]');

      expect([...(nav?.querySelectorAll('a') ?? [])].map((link) => link.textContent)).toEqual([
        'Home',
        'Products',
      ]);
      expect(nav?.querySelector('[aria-current="page"]')?.textContent).toBe(
        'Velvet Matte Lipstick',
      );
    });

    it('is the same when the product is in a category the tree does not know', () => {
      const { container } = render(
        state({ data: product({ category: { _id: 'zzz', name: 'Gone' } }) }),
      );
      const nav = container.querySelector('nav[aria-label="Breadcrumb"]');

      expect([...(nav?.querySelectorAll('a') ?? [])].map((link) => link.textContent)).toEqual([
        'Home',
        'Products',
      ]);
    });
  });

  describe('more products', () => {
    it('come from the category above the one of the product, with the product left out', () => {
      const { lastRelated } = render(state());

      expect(lastRelated()).toEqual({
        categoryId: 'c2',
        categoryName: 'Lip Colour',
        excludeId: 'p1',
      });
    });

    it('come from the main category when the product is in it', () => {
      const { lastRelated } = render(
        state({ data: product({ category: { _id: 'c1', name: 'Lips' } }) }),
      );

      expect(lastRelated().categoryId).toBe('c1');
      expect(lastRelated().categoryName).toBe('Lips');
    });

    it('are not asked for while the categories are loading (one request, for the right category, after)', () => {
      useGetCategoriesHierarchy.mockReturnValue({ data: undefined, isLoading: true });

      const { container } = render(state());

      expect(relatedProducts).not.toHaveBeenCalled();
      expect(container.querySelector('[data-testid="related"]')).toBeNull();
    });

    it('come from the category the product says when the tree is not there', () => {
      useGetCategoriesHierarchy.mockReturnValue({ data: undefined });

      const { lastRelated } = render(state());

      expect(lastRelated()).toEqual({
        categoryId: 'c3',
        categoryName: 'Matte Lipstick',
        excludeId: 'p1',
      });
    });
  });

  describe('a product with variants', () => {
    const lipsticks = () =>
      state({
        data: withVariants(
          variant({ sku: 'LIP-GONE', label: 'Sold Out Pink', inStock: false }),
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
        ),
      });

    it('shows a choice of its variants, as one group of radio buttons', () => {
      const { container, legend } = render(lipsticks());

      expect(container.querySelectorAll('input[type="radio"]')).toHaveLength(4);
      expect(legend()).toContain('Shade:');
    });

    it('starts with the first variant that is in stock, and shows its price and stock', () => {
      const { legend, option, text } = render(lipsticks());

      expect(legend()).toBe('Shade: Ruby Red');
      expect(option('Ruby Red')?.checked).toBe(true);
      expect(text()).toContain('₹600');
      expect(text()).toContain('₹800');
      expect(text()).toContain('You save ₹200');
      expect(text()).toContain('25% off');
      expect(text()).toContain('In stock');
    });

    it('does not put the variant it started with in the address', () => {
      expect(render(lipsticks()).search()).toBe('');
    });

    it('starts the pictures at the first one of the product, not at those of the variant it started with', () => {
      const { lastCarousel } = render(lipsticks());

      expect(lastCarousel().selected).toBe(0);
    });

    it('shows the price and the stock of the variant that is chosen (from the address)', () => {
      const { text, legend, option } = render(
        lipsticks(),
        '/products/product/velvet-matte-lipstick?v=LIP-NUDE',
      );

      expect(legend()).toBe('Shade: Nude');
      expect(option('Nude')?.checked).toBe(true);
      expect(text()).toContain('₹500');
      expect(text()).toContain('₹700');
      expect(text()).toContain('You save ₹200');
      expect(text()).toContain('29% off');
      expect(text()).toContain('Only a few left');
    });

    it('puts the percent of the variant on the pictures', () => {
      const { container } = render(
        lipsticks(),
        '/products/product/velvet-matte-lipstick?v=LIP-NUDE',
      );

      expect(container.querySelector('.bg-accent-duo')?.textContent).toBe('29% off');
    });

    it('says "Out of stock" for a variant that has none, though the product has others', () => {
      const { text } = render(lipsticks(), '/products/product/velvet-matte-lipstick?v=LIP-PLUM');

      expect(text()).toContain('Out of stock');
    });

    it('puts the variant that is pressed in the address', () => {
      const { option, search } = render(lipsticks());

      press(option('Nude'));

      expect(search()).toBe('?v=LIP-NUDE');
    });

    it('shows the variant that was pressed', () => {
      const { option, text, legend } = render(lipsticks());

      press(option('Nude'));

      expect(legend()).toBe('Shade: Nude');
      expect(text()).toContain('₹500');
      expect(text()).toContain('Only a few left');
    });

    it('replaces the address instead of adding one, so Back leaves the product and not the last shade', () => {
      const { option, search, container } = render(lipsticks());

      press(option('Nude'));
      press(option('Plum'));
      press(container.querySelector('[data-testid="back"]'));

      // there was no earlier address of the page to go back to: Back stays where it is (in a browser it leaves)
      expect(search()).toBe('?v=LIP-PLUM');
    });

    it('moves the pictures to those of the variant that is chosen', () => {
      const { lastCarousel } = render(
        lipsticks(),
        '/products/product/velvet-matte-lipstick?v=LIP-NUDE',
      );
      const urls = lastCarousel().media.map((item) => item.url);

      expect(urls[lastCarousel().selected]).toBe('https://cdn.example/nude-1.png');
    });

    it('moves the pictures to the thumbnail of the variant when it has one', () => {
      const { lastCarousel } = render(
        lipsticks(),
        '/products/product/velvet-matte-lipstick?v=LIP-RUBY',
      );
      const urls = lastCarousel().media.map((item) => item.url);

      expect(urls[lastCarousel().selected]).toBe('https://cdn.example/ruby-thumb.png');
    });

    it('moves the pictures when a variant is pressed', () => {
      const { option, lastCarousel } = render(lipsticks());

      press(option('Nude'));

      const urls = lastCarousel().media.map((item) => item.url);

      expect(urls[lastCarousel().selected]).toBe('https://cdn.example/nude-1.png');
    });

    it('ignores a variant in the address that the product does not have', () => {
      const { legend, lastCarousel, text } = render(
        lipsticks(),
        '/products/product/velvet-matte-lipstick?v=NOPE',
      );

      expect(legend()).toBe('Shade: Ruby Red');
      expect(text()).toContain('₹600');
      expect(lastCarousel().selected).toBe(0);
    });

    it('gives the try-on the colours of the variants, as shades', () => {
      const { lastTryOn } = render(
        state({
          data: withVariants(
            variant(),
            variant({ sku: 'LIP-MINI', type: 'Text', label: 'Size', value: 'Mini' }),
            variant({ sku: 'LIP-NUDE', label: 'Nude', value: '#d9a384' }),
          ),
        }),
      );

      // a variant that is a text (a size), not a colour, is not a shade
      expect(lastTryOn().shades).toEqual([
        { name: 'Ruby Red', hexColor: '#c1121f' },
        { name: 'Nude', hexColor: '#d9a384' },
      ]);
    });

    it('calls the group "Option" when the variants are not all colours', () => {
      const { legend } = render(
        state({
          data: withVariants(
            variant(),
            variant({ sku: 'LIP-MINI', type: 'Text', label: 'Size', value: 'Mini' }),
          ),
        }),
      );

      expect(legend()).toBe('Option: Ruby Red');
    });
  });

  describe('a product without variants', () => {
    it('has no choice to make, and shows the price and the stock of the product', () => {
      const { container, text, lastTryOn } = render(state());

      expect(container.querySelector('fieldset')).toBeNull();
      expect(text()).toContain('₹549');
      expect(text()).toContain('In stock');
      expect(lastTryOn().shades).toEqual([]);
    });

    it('has no choice either when it says it has variants and has none', () => {
      const { container } = render(state({ data: product({ hasVariants: true, variants: [] }) }));

      expect(container.querySelector('fieldset')).toBeNull();
    });

    it('has no choice either when it says it has none but sends some (the flag is the product, not the list)', () => {
      const { container, text } = render(
        state({ data: product({ hasVariants: false, variants: [variant()] }) }),
      );

      expect(container.querySelector('fieldset')).toBeNull();
      // and shows the price of the product, as it does for a choice that is not made
      expect(text()).toContain('₹549');
    });

    it('does not put anything in the address for a variant that is asked for', () => {
      const { text, lastCarousel } = render(
        state(),
        '/products/product/velvet-matte-lipstick?v=LIP-NUDE',
      );

      expect(text()).toContain('₹549');
      expect(lastCarousel().selected).toBe(0);
    });
  });

  describe('the try-on', () => {
    it('opens with its button, for a product that has it', () => {
      const { button, lastTryOn } = render(state());

      expect(lastTryOn().isOpen).toBe(false);

      press(button('Try it on'));

      expect(lastTryOn().isOpen).toBe(true);
      expect(lastTryOn().tryOn).toEqual({
        configured: true,
        enabled: true,
        category: 'LIP',
        subCategory: 'MATTE',
      });
    });

    it('has no button, and gives the modal nothing, when the try-on is not enabled', () => {
      const { button, lastTryOn } = render(
        state({ data: product({ tryOn: { enabled: false, configured: false } }) }),
      );

      expect(button('Try it on')).toBeUndefined();
      expect(lastTryOn().tryOn).toBeUndefined();
    });

    it('has no button when it is enabled but not set up (it has no category yet)', () => {
      const { button, lastTryOn } = render(
        state({ data: product({ tryOn: { enabled: true, configured: false } }) }),
      );

      expect(button('Try it on')).toBeUndefined();
      expect(lastTryOn().tryOn).toBeUndefined();
    });

    it('has no button when it is set up but turned off', () => {
      const { button } = render(
        state({
          data: product({
            tryOn: { enabled: false, configured: true, category: 'LIP', subCategory: 'MATTE' },
          }),
        }),
      );

      expect(button('Try it on')).toBeUndefined();
    });

    it('closes again when the modal says so', () => {
      const { button, lastTryOn } = render(state());

      press(button('Try it on'));
      expect(lastTryOn().isOpen).toBe(true);

      act(() => {
        (lastTryOn() as unknown as { onClose: () => void }).onClose();
      });

      expect(lastTryOn().isOpen).toBe(false);
    });
  });
});
