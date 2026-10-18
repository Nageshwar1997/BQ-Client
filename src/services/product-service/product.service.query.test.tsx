// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ApiError from '@/classes/ApiError';
import { mount, unmountAll } from '@/test-utils/react';

import { useGetProductBySlug, useGetRelatedProducts } from './product.service.query';

const getProductBySlug = vi.fn();
const getProducts = vi.fn();

vi.mock('@/classes/apis', () => ({
  productApi: {
    getProductBySlug: (slug: string): unknown => getProductBySlug(slug),
    getProducts: (params: unknown): unknown => getProducts(params),
  },
}));

const Probe = ({ slug }: { slug: string }) => {
  const query = useGetProductBySlug(slug);

  return (
    <output
      data-status={query.status}
      data-fetch={query.fetchStatus}
      data-title={query.data?.title ?? ''}
    />
  );
};

const render = (slug: string) => {
  // a retry has no waiting here: what is checked is how many times it was asked
  const client = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 } } });
  const view = mount(
    <QueryClientProvider client={client}>
      <Probe slug={slug} />
    </QueryClientProvider>,
  );
  const state = () => view.container.querySelector('output')?.dataset ?? {};

  return { ...view, state };
};

const settled = (state: () => DOMStringMap) =>
  vi.waitFor(() => {
    expect(state().status).not.toBe('pending');
  });

describe('useGetProductBySlug', () => {
  beforeEach(() => {
    getProductBySlug.mockReset();
  });

  afterEach(() => {
    unmountAll();
  });

  it('gives the product of the page', async () => {
    getProductBySlug.mockResolvedValue({ data: { title: 'Velvet Matte Lipstick' } });

    const { state } = render('velvet-matte-lipstick');

    await settled(state);

    expect(getProductBySlug).toHaveBeenCalledWith('velvet-matte-lipstick');
    expect(state().status).toBe('success');
    expect(state().title).toBe('Velvet Matte Lipstick');
  });

  it('asks nothing while there is no slug', () => {
    const { state } = render('');

    expect(getProductBySlug).not.toHaveBeenCalled();
    expect(state().fetch).toBe('idle');
  });

  it('does not ask again for a product that is not there (404): the answer will not change', async () => {
    getProductBySlug.mockRejectedValue(
      new ApiError({ message: 'Product not found', statusCode: 404 }),
    );

    const { state } = render('gone');

    await settled(state);

    expect(state().status).toBe('error');
    expect(getProductBySlug).toHaveBeenCalledTimes(1);
  });

  it('asks again, three times, after any other failure (the service may be coming back)', async () => {
    getProductBySlug.mockRejectedValue(new ApiError({ message: 'Boom', statusCode: 500 }));

    const { state } = render('velvet-matte-lipstick');

    await settled(state);

    expect(state().status).toBe('error');
    expect(getProductBySlug).toHaveBeenCalledTimes(4);
  });

  it('asks again after a failure that had no answer (no connection)', async () => {
    getProductBySlug.mockRejectedValueOnce(new ApiError({ message: 'Network Error' }));
    getProductBySlug.mockResolvedValue({ data: { title: 'Back' } });

    const { state } = render('velvet-matte-lipstick');

    await settled(state);

    expect(state().status).toBe('success');
    expect(state().title).toBe('Back');
    expect(getProductBySlug).toHaveBeenCalledTimes(2);
  });
});

const RelatedProbe = ({ categoryId }: { categoryId?: string }) => {
  const query = useGetRelatedProducts(categoryId);

  return (
    <output
      data-status={query.status}
      data-fetch={query.fetchStatus}
      data-list={String(Array.isArray(query.data))}
      data-titles={(query.data ?? []).map((item) => item.title).join('|')}
    />
  );
};

const renderRelated = (categoryIds: (string | undefined)[]) => {
  const client = new QueryClient({ defaultOptions: { queries: { retryDelay: 0 } } });
  const view = mount(
    <QueryClientProvider client={client}>
      {categoryIds.map((categoryId, index) => (
        <RelatedProbe key={index} categoryId={categoryId} />
      ))}
    </QueryClientProvider>,
  );
  const states = () =>
    [...view.container.querySelectorAll('output')].map((output) => output.dataset);

  return { ...view, states };
};

describe('useGetRelatedProducts', () => {
  beforeEach(() => {
    getProducts.mockReset();
  });

  afterEach(() => {
    unmountAll();
  });

  it('asks for five of the best selling products of the category, one more than the page shows', async () => {
    getProducts.mockResolvedValue({
      data: { products: [{ title: 'Lip Balm' }, { title: 'Gloss' }], total: 2 },
    });

    const { states } = renderRelated(['lipstick-id']);

    await vi.waitFor(() => {
      expect(states()[0]?.status).toBe('success');
    });

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(getProducts).toHaveBeenCalledWith({
      category: 'lipstick-id',
      page: '1',
      limit: '5',
      sort: 'popular',
    });
    expect(states()[0]?.titles).toBe('Lip Balm|Gloss');
  });

  it('asks nothing while there is no category (the page is still finding it)', () => {
    const { states } = renderRelated([undefined]);

    expect(getProducts).not.toHaveBeenCalled();
    expect(states()[0]?.fetch).toBe('idle');
  });

  it('gives no products, not an error, when the answer has none', async () => {
    getProducts.mockResolvedValue({});

    const { states } = renderRelated(['lipstick-id']);

    await vi.waitFor(() => {
      expect(states()[0]?.status).toBe('success');
    });

    // an empty list, not nothing: the caller can map it without a check
    expect(states()[0]?.list).toBe('true');
    expect(states()[0]?.titles).toBe('');
  });

  it('asks once for a category however many places show it, and again for another category', async () => {
    getProducts.mockResolvedValue({ data: { products: [{ title: 'Gloss' }], total: 1 } });

    const { states } = renderRelated(['lipstick-id', 'lipstick-id', 'blush-id']);

    await vi.waitFor(() => {
      expect(states().map((state) => state.status)).toEqual(['success', 'success', 'success']);
    });

    expect(getProducts).toHaveBeenCalledTimes(2);
  });

  it('says it failed when the service did', async () => {
    getProducts.mockRejectedValue(new ApiError({ message: 'Not found', statusCode: 404 }));

    const { states } = renderRelated(['lipstick-id']);

    await vi.waitFor(() => {
      expect(states()[0]?.status).toBe('error');
    });
  });
});
