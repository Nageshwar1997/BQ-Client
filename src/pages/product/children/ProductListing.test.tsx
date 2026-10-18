// @vitest-environment jsdom
import { act } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';
import type { IStorefrontFilters, IStorefrontProduct } from '@/types/api.type';
import type { TCategoryNode } from '@/utils/category.util';

import ProductListing from './ProductListing';

interface IQueryState {
  data?: { products: IStorefrontProduct[]; total: number; filters?: IStorefrontFilters };
  isLoading: boolean;
  isError: boolean;
  isPlaceholderData: boolean;
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  hasNextPage: boolean;
}

const fetchNextPage = vi.fn();
const refetch = vi.fn();
const useGetProducts = vi.fn();

vi.mock('@/services/product-service/product.service.query', () => ({
  useGetProducts: (query: unknown): unknown => useGetProducts(query),
}));

// The cards are tested in their own file; here they are only counted.
vi.mock('./ProductCard', () => ({
  default: ({ product }: { product: IStorefrontProduct }) => (
    <article data-testid="card">{product.title}</article>
  ),
}));

interface TObserved {
  callback: IntersectionObserverCallback;
  element: Element;
}
const observed: TObserved[] = [];

const product = (id: string): IStorefrontProduct => ({
  _id: id,
  title: `Product ${id}`,
  slug: `product-${id}`,
  brand: 'Beautinique',
  shortDescription: 'A product.',
  thumbnail: 'https://cdn.example/t.png',
  originalPrice: 200,
  sellingPrice: 150,
  discount: 25,
  averageRating: 4.5,
  totalReviews: 10,
  soldCount: 1,
  inStock: true,
  lowStock: false,
  hasTryOn: false,
  hasVariants: false,
  colors: [],
  colorCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
});

const loaded = (count: number, overrides: Partial<IQueryState> = {}): IQueryState => ({
  data: {
    products: Array.from({ length: count }, (_, index) => product(String(index + 1))),
    total: count,
    filters: { brands: [{ name: 'Beautinique', count }], price: { min: 150, max: 150 } },
  },
  isLoading: false,
  isError: false,
  isPlaceholderData: false,
  isFetchingNextPage: false,
  isFetchNextPageError: false,
  hasNextPage: false,
  ...overrides,
});

const Location = () => <output data-testid="url">{useLocation().search}</output>;

const render = (
  state: IQueryState,
  { url = '/products', category }: { url?: string; category?: TCategoryNode } = {},
) => {
  useGetProducts.mockReturnValue({ ...state, fetchNextPage, refetch });

  const view = mount(
    <MemoryRouter initialEntries={[url]}>
      <ProductListing
        title="All products"
        description="Everything we sell."
        category={category}
        categories={[]}
      />
      <Location />
    </MemoryRouter>,
  );

  return {
    ...view,
    text: () => view.container.textContent,
    cards: () => view.container.querySelectorAll('[data-testid="card"]'),
    url: () => view.container.querySelector('[data-testid="url"]')?.textContent,
    button: (name: string) =>
      [...view.container.querySelectorAll('button')].find((button) => button.textContent === name),
  };
};

const press = (element: Element | undefined) => {
  if (!element) throw new Error('There is no such button');

  act(() => {
    (element as HTMLElement).click();
  });
};

describe('ProductListing', () => {
  beforeEach(() => {
    fetchNextPage.mockReset();
    refetch.mockReset();
    useGetProducts.mockReset();
    observed.length = 0;

    // jsdom has no ResizeObserver either: the breadcrumb (a scroller with a fade) measures itself with one
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

    // jsdom has no IntersectionObserver: the cards that are watched are kept, to say they came into view
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        private readonly callback: IntersectionObserverCallback;

        constructor(callback: IntersectionObserverCallback) {
          this.callback = callback;
        }

        observe(element: Element) {
          observed.push({ callback: this.callback, element });
        }

        unobserve() {
          // nothing is taken off the watch in these tests
        }

        disconnect() {
          // nor is the watch ended
        }

        takeRecords() {
          return [];
        }
      },
    );
  });

  afterEach(() => {
    unmountAll();
    vi.unstubAllGlobals();
  });

  it('shows the title, the description and how many products there are', () => {
    const { container, text } = render(loaded(3));

    expect(container.querySelector('h1')?.textContent).toBe('All products');
    expect(text()).toContain('Everything we sell.');
    expect(text()).toContain('3 products');
  });

  it('says "1 product", not "1 products"', () => {
    expect(render(loaded(1)).text()).toContain('1 product');
    expect(render(loaded(1)).text()).not.toContain('1 products');
  });

  it('puts one card in a row under 350px, and two from 350px, for the products and for the loading cards', () => {
    const products = render(loaded(3)).container.querySelector('section ul');

    expect(products?.className).toContain('grid-cols-1');
    expect(products?.className).toContain('min-[350px]:grid-cols-2');
    // and does not start with two (that is what is too narrow on a small phone)
    expect(products?.className).not.toMatch(/(^|s)grid-cols-2(s|$)/);
    unmountAll();

    const loading = render({
      ...loaded(0),
      data: undefined,
      isLoading: true,
    }).container.querySelector('section > div');

    expect(loading?.className).toContain('grid-cols-1');
    expect(loading?.className).toContain('min-[350px]:grid-cols-2');
  });

  it('draws a card for each product', () => {
    expect(render(loaded(5)).cards()).toHaveLength(5);
  });

  it('shows loading cards, and no empty message, while the first page is on its way', () => {
    const { container, text, cards } = render({
      ...loaded(0),
      data: undefined,
      isLoading: true,
    });

    // a page of loading cards
    expect(
      container.querySelectorAll('[aria-hidden="true"].flex-col').length,
    ).toBeGreaterThanOrEqual(12);
    expect(cards()).toHaveLength(0);
    expect(text()).toContain('Loading products');
    expect(text()).not.toContain('No products');
    expect(container.querySelector('section')?.getAttribute('aria-busy')).toBe('true');
  });

  it('keeps the old list, a little faded, while the new one for another filter is on its way', () => {
    const { container, cards } = render(loaded(4, { isPlaceholderData: true }));

    expect(cards()).toHaveLength(4);
    expect(container.querySelector('section ul')?.className).toContain('opacity-50');
    expect(container.querySelector('section')?.getAttribute('aria-busy')).toBe('true');
  });

  it('says it could not load, and tries again when asked', () => {
    const { text, button } = render({ ...loaded(0), data: undefined, isError: true });

    expect(text()).toContain('We could not load the products');

    press(button('Try again'));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it('keeps showing the products it has when a later request fails', () => {
    const { text, cards } = render(loaded(3, { isError: true }));

    expect(cards()).toHaveLength(3);
    expect(text()).not.toContain('We could not load');
  });

  it('says there are no products yet when there is nothing and nothing is filtered', () => {
    const { text, button } = render(loaded(0));

    expect(text()).toContain('No products here yet');
    expect(button('Clear all filters')).toBeUndefined();
  });

  it('says no product matches when the list is empty because of filters, and clears them', () => {
    const { text, button, url } = render(loaded(0), {
      url: '/products?brand=Beautinique&search=lip&sort=rating',
    });

    expect(text()).toContain('No products match your filters');

    press(button('Clear all filters'));

    // the filters and the search are gone, the order stays
    expect(url()).toBe('?sort=rating');
  });

  it('asks for the products of the filters in the URL and of the category of the page', () => {
    render(loaded(2), {
      url: '/products/eyes?brand=A|B&minPrice=100&inStock=true&sort=rating&search=kajal',
      category: { _id: 'cat-eyes', name: 'Eyes', slug: 'eyes', level: 1, subcategories: [] },
    });

    expect(useGetProducts).toHaveBeenLastCalledWith({
      search: 'kajal',
      category: 'cat-eyes',
      brand: ['A', 'B'],
      minPrice: '100',
      inStock: 'true',
      sort: 'rating',
    });
  });

  it('shows how many of the products are on the screen, and a button for the next page', () => {
    const page = loaded(3);
    const { text, button } = render({
      ...page,
      data: { products: page.data?.products ?? [], total: 30 },
      hasNextPage: true,
    });

    expect(text()).toContain('Showing 3 of 30');

    press(button('Load more'));

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('has no "Load more" when this is the last page, nor while a page is coming', () => {
    expect(render(loaded(3)).button('Load more')).toBeUndefined();
    unmountAll();
    expect(
      render(loaded(3, { hasNextPage: true, isFetchingNextPage: true })).button('Load more'),
    ).toBeUndefined();
  });

  it('offers "Try again" when the next page failed, and does not ask for it again by itself', () => {
    const { button } = render(loaded(3, { hasNextPage: true, isFetchNextPageError: true }));

    expect(button('Try again')).toBeDefined();
    expect(button('Load more')).toBeUndefined();

    act(() => {
      for (const { callback, element } of observed) {
        callback(
          [
            {
              isIntersecting: true,
              intersectionRatio: 1,
              target: element,
            } as IntersectionObserverEntry,
          ],
          {} as IntersectionObserver,
        );
      }
    });

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('asks for the next page by itself when the card near the end comes into view', () => {
    render(loaded(8, { hasNextPage: true }));

    // the card 4 from the end is the one that is watched
    expect(observed).toHaveLength(1);
    expect(observed[0]?.element.textContent).toBe('Product 5');

    act(() => {
      observed[0]?.callback(
        [
          {
            isIntersecting: true,
            intersectionRatio: 1,
            target: observed[0].element,
          } as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it('does not ask for a next page that is not there, nor while one is coming', () => {
    const trigger = () => {
      act(() => {
        for (const { callback, element } of observed) {
          callback(
            [
              {
                isIntersecting: true,
                intersectionRatio: 1,
                target: element,
              } as IntersectionObserverEntry,
            ],
            {} as IntersectionObserver,
          );
        }
      });
    };

    render(loaded(8));
    trigger();
    unmountAll();
    observed.length = 0;
    render(loaded(8, { hasNextPage: true, isFetchingNextPage: true }));
    trigger();

    expect(fetchNextPage).not.toHaveBeenCalled();
  });

  it('shows a row of loading cards under the list while the next page is coming', () => {
    const { container } = render(loaded(4, { hasNextPage: true, isFetchingNextPage: true }));

    expect(container.querySelectorAll('section ul > li')).toHaveLength(4 + 4);
  });

  it('has the filters beside the list on a wide screen, and no sheet', () => {
    const { container } = render(loaded(2));

    expect(container.querySelector('aside[aria-label="Filters"]')).not.toBeNull();
    expect(container.textContent).not.toContain('Show 2 products');
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  describe('on a narrow screen', () => {
    beforeEach(() => {
      vi.stubGlobal(
        'matchMedia',
        (query: string) =>
          ({
            matches: true,
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
          }) as unknown as MediaQueryList,
      );
    });

    const openSheet = (view: ReturnType<typeof render>) => {
      press(
        [...view.container.querySelectorAll('button')].find((button) =>
          button.textContent.startsWith('Filters'),
        ),
      );

      const dialog = document.querySelector<HTMLElement>('[role="dialog"]');

      if (!dialog) throw new Error('The sheet did not open');

      return dialog;
    };

    it('has no sidebar, and opens the filters in a sheet from the "Filters" button', () => {
      const view = render(loaded(2));

      expect(view.container.querySelector('aside[aria-label="Filters"]')).toBeNull();
      expect(document.querySelector('[role="dialog"]')).toBeNull();

      const dialog = openSheet(view);

      expect(dialog.textContent).toContain('Brand');
      expect(dialog.textContent).toContain('Show 2 products');
    });

    it('keeps the buttons of the sheet over the filters that scroll under them', () => {
      const dialog = openSheet(render(loaded(2)));
      const buttons = [...dialog.querySelectorAll('button')].find((button) =>
        button.textContent.startsWith('Show'),
      );
      const bar = buttons?.parentElement;

      // the bar sticks to the bottom and is above anything with a z-index inside the filters (the slider, the radios)
      expect(bar?.className).toContain('sticky');
      expect(bar?.className).toContain('z-40');
      // and what is inside the filters stays inside them
      const filters = bar?.previousElementSibling;

      expect(filters?.className).toContain('isolate');
      expect(filters?.textContent).toContain('Brand');
    });

    it('closes the sheet with its "Show N products" button, and with Escape', () => {
      const view = render(loaded(2));

      openSheet(view);
      press(
        [...document.querySelectorAll('button')].find((button) =>
          button.textContent.startsWith('Show'),
        ),
      );
      expect(document.querySelector('[role="dialog"]')).toBeNull();

      openSheet(view);
      act(() => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      });
      expect(document.querySelector('[role="dialog"]')).toBeNull();
    });
  });
});
