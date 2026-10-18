// @vitest-environment jsdom
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';
import { parseProductFilters } from '@/utils/product-filters.util';

import ActiveFilters from './ActiveFilters';

const render = (params: Record<string, string>) => {
  const handlers = { onChange: vi.fn(), onClearSearch: vi.fn(), onClearAll: vi.fn() };
  const { container } = mount(
    <ActiveFilters filters={parseProductFilters(params)} {...handlers} />,
  );

  const chip = (label: string) =>
    [...container.querySelectorAll('button')].find(
      (button) => button.getAttribute('aria-label') === `Remove filter: ${label}`,
    );

  const press = (element: Element | undefined) => {
    if (!element) throw new Error('There is no such button');

    act(() => {
      (element as HTMLElement).click();
    });
  };

  return { container, chip, press, ...handlers };
};

describe('ActiveFilters', () => {
  afterEach(() => {
    unmountAll();
  });

  it('draws nothing when no filter is on', () => {
    expect(render({}).container.innerHTML).toBe('');
    // the order is not a filter
    unmountAll();
    expect(render({ sort: 'rating' }).container.innerHTML).toBe('');
  });

  it('has a chip for each filter, named for what it takes away', () => {
    const { container } = render({
      search: 'lip',
      brand: 'Beautinique|Maybelline',
      minPrice: '100',
      maxPrice: '900',
      minRating: '4',
      minDiscount: '20',
      inStock: 'true',
      tryOn: 'true',
    });

    expect(
      [...container.querySelectorAll('button')].map((button) => button.getAttribute('aria-label')),
    ).toEqual([
      'Remove filter: Search: lip',
      'Remove filter: Beautinique',
      'Remove filter: Maybelline',
      'Remove filter: ₹100 – ₹900',
      'Remove filter: 4★ & up',
      'Remove filter: 20% off & above',
      'Remove filter: In stock',
      'Remove filter: Try on available',
      null, // "Clear all"
    ]);
  });

  it('says a price range that has only one end in words', () => {
    expect(render({ minPrice: '300' }).chip('From ₹300')).toBeDefined();
    unmountAll();
    expect(render({ maxPrice: '300' }).chip('Up to ₹300')).toBeDefined();
  });

  it('takes one brand out and leaves the others when its chip is pressed', () => {
    const { chip, press, onChange } = render({ brand: 'A|B|C' });

    press(chip('B'));

    expect(onChange).toHaveBeenCalledWith({ brands: ['A', 'C'] });
  });

  it('takes the price range, the rating, the discount and the switches out one by one', () => {
    const { chip, press, onChange } = render({
      minPrice: '1',
      maxPrice: '2',
      minRating: '4',
      minDiscount: '10',
      inStock: 'true',
      tryOn: 'true',
    });

    press(chip('₹1 – ₹2'));
    expect(onChange).toHaveBeenLastCalledWith({ minPrice: undefined, maxPrice: undefined });
    press(chip('4★ & up'));
    expect(onChange).toHaveBeenLastCalledWith({ minRating: undefined });
    press(chip('10% off & above'));
    expect(onChange).toHaveBeenLastCalledWith({ minDiscount: undefined });
    press(chip('In stock'));
    expect(onChange).toHaveBeenLastCalledWith({ inStock: false });
    press(chip('Try on available'));
    expect(onChange).toHaveBeenLastCalledWith({ tryOn: false });
  });

  it('clears the search through its own handler, not as a filter', () => {
    const { chip, press, onChange, onClearSearch } = render({ search: 'lip' });

    press(chip('Search: lip'));

    expect(onClearSearch).toHaveBeenCalledTimes(1);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('offers "Clear all" only when there is more than one chip', () => {
    const one = render({ brand: 'A' });

    expect(one.container.textContent).not.toContain('Clear all');
    unmountAll();

    const two = render({ brand: 'A', inStock: 'true' });
    const clearAll = [...two.container.querySelectorAll('button')].find(
      (button) => button.textContent === 'Clear all',
    );

    two.press(clearAll);

    expect(two.onClearAll).toHaveBeenCalledTimes(1);
  });
});
