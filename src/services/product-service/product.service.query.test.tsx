// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ApiError from '@/classes/ApiError';
import { mount, unmountAll } from '@/test-utils/react';

import { useGetProductBySlug } from './product.service.query';

const getProductBySlug = vi.fn();

vi.mock('@/classes/apis', () => ({
  productApi: {
    getProductBySlug: (slug: string): unknown => getProductBySlug(slug),
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
