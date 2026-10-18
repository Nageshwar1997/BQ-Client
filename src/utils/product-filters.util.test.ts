import { describe, expect, it } from 'vitest';

import {
  countActiveFilters,
  getDefaultSort,
  parseProductFilters,
  serializeProductFilters,
  toProductsQuery,
} from './product-filters.util';

describe('parseProductFilters', () => {
  it('has no filter, and the newest first, when the URL has no params', () => {
    expect(parseProductFilters({})).toEqual({
      search: undefined,
      sort: 'newest',
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      minDiscount: undefined,
      inStock: false,
      tryOn: false,
    });
  });

  it('reads every filter', () => {
    expect(
      parseProductFilters({
        search: '  lip  ',
        sort: 'price-asc',
        brand: 'Beautinique|Maybelline',
        minPrice: '100',
        maxPrice: '900',
        minRating: '4',
        minDiscount: '20',
        inStock: 'true',
        tryOn: 'true',
      }),
    ).toEqual({
      search: 'lip',
      sort: 'price-asc',
      brands: ['Beautinique', 'Maybelline'],
      minPrice: 100,
      maxPrice: 900,
      minRating: 4,
      minDiscount: 20,
      inStock: true,
      tryOn: true,
    });
  });

  it('orders by relevance while there is a search, and by the newest when there is not', () => {
    expect(parseProductFilters({ search: 'lip' }).sort).toBe('relevance');
    expect(parseProductFilters({ search: 'lip', sort: 'rating' }).sort).toBe('rating');
    // a link that still says `relevance` after the search was cleared
    expect(parseProductFilters({ sort: 'relevance' }).sort).toBe('newest');
    expect(getDefaultSort(undefined)).toBe('newest');
    expect(getDefaultSort('lip')).toBe('relevance');
  });

  it('leaves out what is not usable instead of failing', () => {
    expect(
      parseProductFilters({
        sort: 'cheapest',
        minPrice: 'abc',
        maxPrice: '-5',
        minRating: '9',
        minDiscount: '0',
        inStock: 'maybe',
        tryOn: '1',
        brand: ' | |',
      }),
    ).toMatchObject({
      sort: 'newest',
      minPrice: undefined,
      maxPrice: undefined,
      minRating: undefined,
      minDiscount: undefined,
      inStock: false,
      tryOn: false,
      brands: [],
    });
  });

  it('takes a rating from 1 to 5 and nothing outside them', () => {
    const rating = (value: string) => parseProductFilters({ minRating: value }).minRating;

    expect([rating('1'), rating('3.5'), rating('5')]).toEqual([1, 3.5, 5]);
    expect([rating('0'), rating('-1'), rating('5.1'), rating('')]).toEqual([
      undefined,
      undefined,
      undefined,
      undefined,
    ]);
  });

  it('takes a discount from 1 to 100 and nothing outside them', () => {
    const discount = (value: string) => parseProductFilters({ minDiscount: value }).minDiscount;

    expect([discount('1'), discount('100')]).toEqual([1, 100]);
    expect([discount('0'), discount('101'), discount('-5')]).toEqual([
      undefined,
      undefined,
      undefined,
    ]);
  });

  it('puts a price range that is the wrong way round the right way round', () => {
    expect(parseProductFilters({ minPrice: '900', maxPrice: '100' })).toMatchObject({
      minPrice: 100,
      maxPrice: 900,
    });
  });

  it('counts a brand once, however often the URL names it', () => {
    expect(parseProductFilters({ brand: 'A|A|B' }).brands).toEqual(['A', 'B']);
  });
});

describe('serializeProductFilters', () => {
  it('writes only what changed, and empties what was turned off', () => {
    expect(
      serializeProductFilters({
        brands: ['A', 'B'],
        minPrice: 100,
        maxPrice: undefined,
        inStock: true,
        tryOn: false,
        minRating: undefined,
        minDiscount: 30,
        sort: 'rating',
      }),
    ).toEqual({
      brand: 'A|B',
      minPrice: '100',
      maxPrice: '',
      inStock: 'true',
      tryOn: '',
      minRating: '',
      minDiscount: '30',
      sort: 'rating',
    });

    expect(serializeProductFilters({ brands: [] })).toEqual({ brand: '' });
    expect(serializeProductFilters({})).toEqual({});
  });

  it('gives back what parseProductFilters reads', () => {
    const filters = {
      brands: ['A', 'B'],
      minPrice: 50,
      maxPrice: 700,
      minRating: 3,
      minDiscount: 10,
      inStock: true,
      tryOn: true,
      sort: 'popular' as const,
    };

    expect(parseProductFilters(serializeProductFilters(filters))).toMatchObject(filters);
  });
});

describe('countActiveFilters', () => {
  it('counts each filter that is on, a price range once, and not the search or the order', () => {
    expect(countActiveFilters(parseProductFilters({ search: 'lip', sort: 'rating' }))).toBe(0);
    expect(
      countActiveFilters(
        parseProductFilters({
          brand: 'A|B',
          minPrice: '1',
          maxPrice: '2',
          minRating: '4',
          minDiscount: '10',
          inStock: 'true',
          tryOn: 'true',
        }),
      ),
    ).toBe(7);
    expect(countActiveFilters(parseProductFilters({ maxPrice: '300' }))).toBe(1);
  });
});

describe('toProductsQuery', () => {
  it('asks for nothing but the order when there is no filter', () => {
    expect(toProductsQuery(parseProductFilters({}))).toEqual({ sort: 'newest' });
  });

  it('asks for every filter that is on, and for the category of the page', () => {
    expect(
      toProductsQuery(
        parseProductFilters({
          search: 'lip',
          brand: 'A|B',
          minPrice: '100',
          maxPrice: '900',
          minRating: '4',
          minDiscount: '20',
          inStock: 'true',
          tryOn: 'true',
        }),
        'cat1',
      ),
    ).toEqual({
      search: 'lip',
      category: 'cat1',
      brand: ['A', 'B'],
      minPrice: '100',
      maxPrice: '900',
      minRating: '4',
      minDiscount: '20',
      inStock: 'true',
      tryOn: 'true',
      sort: 'relevance',
    });
  });
});
