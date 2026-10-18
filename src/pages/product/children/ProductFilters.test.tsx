// @vitest-environment jsdom
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';
import type { IStorefrontFilters } from '@/types/api.type';
import { parseProductFilters } from '@/utils/product-filters.util';

import ProductFiltersPanel from './ProductFilters';

const facets = (brands: IStorefrontFilters['brands'] = []): IStorefrontFilters => ({
  brands,
  price: { min: 100, max: 900 },
});

const render = (params: Record<string, string> = {}, facet: IStorefrontFilters = facets()) => {
  const onChange = vi.fn();
  const view = mount(
    <ProductFiltersPanel
      filters={parseProductFilters(params)}
      facets={facet}
      onChange={onChange}
    />,
  );

  const group = (name: string) =>
    view.container.querySelector<HTMLElement>(`[role="radiogroup"][aria-label="${name}"]`);

  const radios = (name: string) => [
    ...(group(name)?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []),
  ];

  const press = (element: Element | undefined | null) => {
    if (!element) throw new Error('There is nothing to press');

    act(() => {
      (element as HTMLElement).click();
    });
  };

  // a field can have more than one label (a switch has its own and the words next to it)
  const checkbox = (label: string) =>
    [...view.container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')].find((box) =>
      [...(box.labels ?? [])]
        .map((item) => item.textContent)
        .join('')
        .startsWith(label),
    );

  return { ...view, onChange, group, radios, press, checkbox };
};

const chosen = (radios: HTMLInputElement[]) => radios.find((radio) => radio.checked)?.value;

describe('ProductFiltersPanel', () => {
  afterEach(() => {
    unmountAll();
  });

  describe('rating', () => {
    it('is a radio group of "Any" and the ratings, with "Any" chosen when no rating is filtered', () => {
      const { radios, group } = render();

      expect(group('Minimum rating')).not.toBeNull();
      expect(radios('Minimum rating').map((radio) => radio.value)).toEqual(['any', '4', '3', '2']);
      expect(chosen(radios('Minimum rating'))).toBe('any');
    });

    it('chooses the rating of the URL', () => {
      expect(chosen(render({ minRating: '3' }).radios('Minimum rating'))).toBe('3');
    });

    it('chooses none when the URL has a rating that is not one of the options', () => {
      expect(chosen(render({ minRating: '3.5' }).radios('Minimum rating'))).toBeUndefined();
    });

    it('filters by the rating that is pressed', () => {
      const { radios, press, onChange } = render();

      press(radios('Minimum rating').find((radio) => radio.value === '4'));

      expect(onChange).toHaveBeenCalledWith({ minRating: 4 });
    });

    it('takes the rating filter away when "Any" is pressed', () => {
      const { radios, press, onChange } = render({ minRating: '4' });

      press(radios('Minimum rating').find((radio) => radio.value === 'any'));

      expect(onChange).toHaveBeenCalledWith({ minRating: undefined });
    });

    it('says what each option means to a screen reader, not only "4+"', () => {
      const { group } = render();

      expect(group('Minimum rating')?.textContent).toContain('4+ stars and up');
    });
  });

  describe('discount', () => {
    it('is a radio group of "Any" and the discounts, with "Any" chosen when none is filtered', () => {
      const { radios } = render();

      expect(radios('Minimum discount').map((radio) => radio.value)).toEqual([
        'any',
        '10',
        '20',
        '30',
        '50',
      ]);
      expect(chosen(radios('Minimum discount'))).toBe('any');
    });

    it('chooses the discount of the URL, and none for one that is not an option', () => {
      expect(chosen(render({ minDiscount: '30' }).radios('Minimum discount'))).toBe('30');
      unmountAll();
      expect(chosen(render({ minDiscount: '1' }).radios('Minimum discount'))).toBeUndefined();
    });

    it('filters by the discount that is pressed, and takes it away with "Any"', () => {
      const { radios, press, onChange } = render({ minDiscount: '10' });

      press(radios('Minimum discount').find((radio) => radio.value === '50'));
      expect(onChange).toHaveBeenLastCalledWith({ minDiscount: 50 });

      press(radios('Minimum discount').find((radio) => radio.value === 'any'));
      expect(onChange).toHaveBeenLastCalledWith({ minDiscount: undefined });
    });

    it('does not mix the two groups up: pressing a rating does not change the discount', () => {
      const { radios, press, onChange } = render({ minDiscount: '20' });

      press(radios('Minimum rating').find((radio) => radio.value === '3'));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({ minRating: 3 });
      expect(chosen(radios('Minimum discount'))).toBe('20');
    });
  });

  describe('brand', () => {
    const brands = [
      { name: 'Beautinique', count: 7 },
      { name: 'Test', count: 1 },
    ];

    it('lists the brands of the facets with how many products each has', () => {
      const { container } = render({}, facets(brands));

      expect(container.textContent).toContain('Beautinique');
      expect(container.textContent).toContain('7');
    });

    it('adds a brand to the filter, and takes it out again', () => {
      const first = render({}, facets(brands));

      first.press(first.checkbox('Test'));
      expect(first.onChange).toHaveBeenCalledWith({ brands: ['Test'] });
      unmountAll();

      const second = render({ brand: 'Test|Beautinique' }, facets(brands));

      second.press(second.checkbox('Test'));
      expect(second.onChange).toHaveBeenCalledWith({ brands: ['Beautinique'] });
    });

    it('keeps a chosen brand in the list, with no products, when the facets no longer have it', () => {
      const { checkbox } = render({ brand: 'Gone' }, facets(brands));
      const gone = checkbox('Gone');

      expect(gone?.checked).toBe(true);
      expect(gone?.labels?.[0]?.textContent).toContain('0');
    });

    it('has no brand section when there are no brands', () => {
      expect(render({}, facets([])).container.textContent).not.toContain('Brand');
    });

    it('folds a long list behind "Show N more", and opens and closes it', () => {
      const many = Array.from({ length: 9 }, (_, index) => ({
        name: `Brand ${String(index + 1)}`,
        count: 1,
      }));
      const { container, press } = render({}, facets(many));
      const brandBoxes = () =>
        [...container.querySelectorAll('input[type="checkbox"]')].filter((box) =>
          (box as HTMLInputElement).labels?.[0]?.textContent.startsWith('Brand '),
        );
      const toggle = () =>
        [...container.querySelectorAll('button')].find((button) =>
          button.textContent.startsWith('Show'),
        );

      expect(brandBoxes()).toHaveLength(6);
      expect(toggle()?.textContent).toBe('Show 3 more');

      press(toggle());
      expect(brandBoxes()).toHaveLength(9);
      expect(toggle()?.textContent).toBe('Show less');
      expect(toggle()?.getAttribute('aria-expanded')).toBe('true');

      press(toggle());
      expect(brandBoxes()).toHaveLength(6);
    });
  });

  describe('availability', () => {
    it('are a group named "Availability", for assistive technology', () => {
      const { container } = render();
      const group = [...container.querySelectorAll('fieldset')].find(
        (item) => item.querySelector('legend')?.textContent === 'Availability',
      );

      expect(group?.querySelectorAll('input[role="switch"]')).toHaveLength(2);
    });

    it('switches "In stock only" off again when it is on', () => {
      const { checkbox, press, onChange } = render({ inStock: 'true' });

      expect(checkbox('In stock only')?.checked).toBe(true);

      press(checkbox('In stock only'));

      expect(onChange).toHaveBeenCalledWith({ inStock: false });
    });

    it('draws them as switches, each named by its words, and pressing the words switches it', () => {
      const { container, checkbox, press, onChange } = render();
      const switches = [...container.querySelectorAll('input[role="switch"]')];

      expect(switches).toHaveLength(2);

      const words = container.querySelector<HTMLLabelElement>(
        `label[for="${checkbox('Try on available')?.id ?? ''}"]`,
      );

      expect(words?.textContent).toBe('Try on available');

      press(words);

      expect(onChange).toHaveBeenCalledWith({ tryOn: true });
    });

    it('switches "In stock only" and "Try on available" on and off', () => {
      const { checkbox, press, onChange } = render({ tryOn: 'true' });

      expect(checkbox('In stock only')?.checked).toBe(false);
      expect(checkbox('Try on available')?.checked).toBe(true);

      press(checkbox('In stock only'));
      expect(onChange).toHaveBeenLastCalledWith({ inStock: true });

      press(checkbox('Try on available'));
      expect(onChange).toHaveBeenLastCalledWith({ tryOn: false });
    });
  });

  it('draws what it is given above the filters', () => {
    const { container } = mount(
      <ProductFiltersPanel
        filters={parseProductFilters({})}
        facets={facets()}
        onChange={vi.fn()}
        header={<nav aria-label="Categories">tree</nav>}
      />,
    );

    expect(container.firstElementChild?.firstElementChild?.textContent).toBe('tree');
  });
});
