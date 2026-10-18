// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';
import type { IStorefrontProduct } from '@/types/api.type';

import RelatedProducts from './RelatedProducts';

interface IQueryState {
  data?: IStorefrontProduct[];
  isLoading: boolean;
}

const useGetRelatedProducts = vi.fn();

vi.mock('@/services/product-service/product.service.query', () => ({
  useGetRelatedProducts: (categoryId: unknown): unknown => useGetRelatedProducts(categoryId),
}));

// The cards are tested in their own files; here they are only counted.
vi.mock('@/pages/product/children/ProductCard', () => ({
  default: ({ product }: { product: IStorefrontProduct }) => (
    <article data-testid="card">{product.title}</article>
  ),
}));

vi.mock('@/pages/product/children/ProductCardSkeleton', () => ({
  default: () => <div data-testid="skeleton" />,
}));

const product = (id: string) => ({ _id: id, title: `Product ${id}` }) as IStorefrontProduct;

const products = (...ids: string[]) => ids.map(product);

const render = (
  state: IQueryState,
  props: { categoryId?: string; categoryName?: string; excludeId?: string } = {},
) => {
  useGetRelatedProducts.mockReturnValue(state);

  const view = mount(
    <RelatedProducts
      categoryId={props.categoryId ?? 'lipstick-id'}
      categoryName={props.categoryName ?? 'Lipstick'}
      excludeId={props.excludeId ?? 'open'}
    />,
  );

  return {
    ...view,
    cards: () =>
      [...view.container.querySelectorAll('[data-testid="card"]')].map((card) => card.textContent),
    skeletons: () => view.container.querySelectorAll('[data-testid="skeleton"]').length,
    heading: () => view.container.querySelector('h2')?.textContent,
  };
};

describe('RelatedProducts', () => {
  beforeEach(() => {
    useGetRelatedProducts.mockReset();
  });

  afterEach(() => {
    unmountAll();
  });

  it('asks for the products of the category it is given', () => {
    render({ data: products('a'), isLoading: false }, { categoryId: 'blush-id' });

    expect(useGetRelatedProducts).toHaveBeenCalledWith('blush-id');
  });

  it('shows a card for each product, under a title with the name of the category', () => {
    const { cards, heading } = render({ data: products('a', 'b', 'c'), isLoading: false });

    expect(heading()).toBe('More from Lipstick');
    expect(cards()).toEqual(['Product a', 'Product b', 'Product c']);
  });

  it('is a section named by its title', () => {
    const { container } = render({ data: products('a'), isLoading: false });
    const section = container.querySelector('section');
    const title = container.querySelector('h2');

    expect(section?.getAttribute('aria-labelledby')).toBe(title?.id);
    expect(title?.id).not.toBe('');
  });

  it('leaves the product that is open out, and shows at most four', () => {
    const { cards } = render(
      { data: products('a', 'open', 'c', 'd', 'e'), isLoading: false },
      { excludeId: 'open' },
    );

    expect(cards()).toEqual(['Product a', 'Product c', 'Product d', 'Product e']);
  });

  it('shows four cards of loading while the products come, under the same title', () => {
    const { skeletons, cards, heading } = render({ isLoading: true });

    expect(skeletons()).toBe(4);
    expect(cards()).toEqual([]);
    expect(heading()).toBe('More from Lipstick');
  });

  it('shows nothing at all, not an empty title, when there are no other products', () => {
    const { container } = render({ data: [], isLoading: false });

    expect(container.innerHTML).toBe('');
  });

  it('shows nothing at all when the only product of the category is the one that is open', () => {
    const { container } = render(
      { data: products('open'), isLoading: false },
      { excludeId: 'open' },
    );

    expect(container.innerHTML).toBe('');
  });

  it('shows nothing at all when the products could not be loaded', () => {
    const { container } = render({ isLoading: false });

    expect(container.innerHTML).toBe('');
  });

  it('has a general title when it does not know the name of the category', () => {
    useGetRelatedProducts.mockReturnValue({ data: products('a'), isLoading: false });

    const { container } = mount(<RelatedProducts categoryId="x" excludeId="open" />);

    expect(container.querySelector('h2')?.textContent).toBe('You may also like');
  });
});
