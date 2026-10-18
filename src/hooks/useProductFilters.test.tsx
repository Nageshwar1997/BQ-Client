// @vitest-environment jsdom
import { act } from 'react';
import { MemoryRouter, useLocation, useNavigationType } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import { useProductFilters } from './useProductFilters';

type TProductFilters = ReturnType<typeof useProductFilters>;

const setup = (initial: string) => {
  const latest: { filters?: TProductFilters; search: string; navigation: string } = {
    search: '',
    navigation: '',
  };

  const Probe = () => {
    latest.filters = useProductFilters();
    latest.search = useLocation().search;
    latest.navigation = useNavigationType();

    return null;
  };

  mount(
    <MemoryRouter initialEntries={[`/products${initial}`]}>
      <Probe />
    </MemoryRouter>,
  );

  const hook = () => {
    if (!latest.filters) throw new Error('The hook has not run');

    return latest.filters;
  };

  return { hook, search: () => latest.search, navigation: () => latest.navigation };
};

describe('useProductFilters', () => {
  afterEach(() => {
    unmountAll();
  });

  it('reads the filters from the URL, and counts the ones that are on', () => {
    const { hook } = setup('?search=lip&brand=A|B&minPrice=100&inStock=true&sort=rating');

    expect(hook().filters).toMatchObject({
      search: 'lip',
      brands: ['A', 'B'],
      minPrice: 100,
      inStock: true,
      sort: 'rating',
    });
    // the search and the order are not filters: 2 brands, a price and a switch
    expect(hook().activeCount).toBe(4);
  });

  it('puts a change of the filters in the URL and leaves the rest of it as it was', () => {
    const { hook, search } = setup('?search=lip&sort=rating');

    act(() => {
      hook().setFilters({ brands: ['Beautinique'], minDiscount: 20 });
    });

    const params = new URLSearchParams(search());

    expect(params.get('brand')).toBe('Beautinique');
    expect(params.get('minDiscount')).toBe('20');
    expect(params.get('search')).toBe('lip');
    expect(params.get('sort')).toBe('rating');
    expect(hook().filters.brands).toEqual(['Beautinique']);
    expect(hook().activeCount).toBe(2);
  });

  it('takes a filter out of the URL when it is turned off', () => {
    const { hook, search } = setup('?brand=A&inStock=true&minRating=4');

    act(() => {
      hook().setFilters({ brands: [], inStock: false, minRating: undefined });
    });

    expect(search()).toBe('');
    expect(hook().activeCount).toBe(0);
  });

  it('turns every filter off but keeps the search and the order', () => {
    const { hook, search } = setup(
      '?search=lip&sort=price-asc&brand=A&minPrice=1&maxPrice=2&minRating=3&minDiscount=10&inStock=true&tryOn=true',
    );

    act(() => {
      hook().clearFilters();
    });

    const params = new URLSearchParams(search());

    expect([...params.keys()].sort()).toEqual(['search', 'sort']);
    expect(hook().activeCount).toBe(0);
  });

  it('clears the search alone', () => {
    const { hook, search } = setup('?search=lip&brand=A');

    act(() => {
      hook().clearSearch();
    });

    expect(search()).toBe('?brand=A');
    expect(hook().filters.search).toBeUndefined();
    expect(hook().filters.sort).toBe('newest');
  });

  it('replaces the entry of the history, so Back goes to the page before the list and not through the filters', () => {
    const { hook, navigation } = setup('?brand=A');

    act(() => {
      hook().setFilters({ inStock: true });
    });
    expect(navigation()).toBe('REPLACE');

    act(() => {
      hook().clearFilters();
    });
    expect(navigation()).toBe('REPLACE');

    act(() => {
      hook().clearSearch();
    });
    expect(navigation()).toBe('REPLACE');
  });

  it('keeps the same filters while the URL does not change, so they are safe in dependencies', () => {
    const { hook } = setup('?brand=A');
    const before = hook().filters;

    act(() => {
      hook().setFilters({ brands: ['A'] });
    });

    expect(hook().filters).toBe(before);
  });
});
