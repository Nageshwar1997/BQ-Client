// @vitest-environment jsdom
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';
import type { IStorefrontVariant } from '@/types/api.type';

import VariantPicker from './VariantPicker';

const variant = (overrides: Partial<IStorefrontVariant> = {}): IStorefrontVariant => ({
  sku: 'RUBY',
  type: 'Color',
  label: 'Ruby Red',
  value: '#c1121f',
  originalPrice: 800,
  sellingPrice: 600,
  discount: 25,
  inStock: true,
  lowStock: false,
  images: [],
  ...overrides,
});

const shades = [
  variant(),
  variant({ sku: 'NUDE', label: 'Nude', value: '#d9a384' }),
  variant({ sku: 'PLUM', label: 'Plum', value: '#5b2a4a', inStock: false }),
];

const sizes = [
  variant({ sku: 'S30', type: 'Text', label: 'Travel size', value: '30ml' }),
  variant({ sku: 'S100', type: 'Text', label: 'Full size', value: '100ml', inStock: false }),
];

const render = (variants: IStorefrontVariant[], selectedSku?: string) => {
  const onSelect = vi.fn();
  const view = mount(
    <VariantPicker variants={variants} selectedSku={selectedSku} onSelect={onSelect} />,
  );

  return {
    ...view,
    onSelect,
    radios: () => [...view.container.querySelectorAll<HTMLInputElement>('input[type="radio"]')],
    labels: () => [...view.container.querySelectorAll('label')],
    legend: () => view.container.querySelector('legend')?.textContent,
  };
};

const choose = (radio: HTMLInputElement | undefined) => {
  if (!radio) throw new Error('There is no such option');

  act(() => {
    radio.click();
  });
};

describe('VariantPicker', () => {
  afterEach(() => {
    unmountAll();
  });

  it('is one group of radio buttons with an option for each variant, the chosen one checked', () => {
    const { radios, container } = render(shades, 'NUDE');

    expect(container.querySelector('fieldset')).not.toBeNull();
    expect(radios().map((radio) => [radio.value, radio.checked])).toEqual([
      ['RUBY', false],
      ['NUDE', true],
      ['PLUM', false],
    ]);
    // one group: they share a name, so the arrow keys move the choice
    expect(radios()[0]?.name).not.toBe('');
    expect(new Set(radios().map((radio) => radio.name)).size).toBe(1);
  });

  it('keeps the groups of two pickers apart', () => {
    const first = render(shades, 'NUDE');
    const second = render(shades, 'RUBY');

    expect(first.radios()[0]?.name).not.toBe(second.radios()[0]?.name);
  });

  it('names the group "Shade" when the variants are all colours, with the chosen one beside it', () => {
    expect(render(shades, 'NUDE').legend()).toBe('Shade: Nude');
  });

  it('names the group "Option" when the variants are not all colours', () => {
    expect(render(sizes, 'S30').legend()).toBe('Option: Travel size');
    unmountAll();
    expect(render([...shades, ...sizes], 'RUBY').legend()).toBe('Option: Ruby Red');
  });

  it('says nothing beside the name while no variant is chosen', () => {
    expect(render(shades).legend()).toBe('Shade: ');
  });

  it('gives the one that is pressed to onSelect', () => {
    const { radios, onSelect } = render(shades, 'RUBY');

    choose(radios()[1]);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('NUDE');
  });

  it('can choose a variant that is out of stock, to see it', () => {
    const { radios, onSelect } = render(shades, 'RUBY');

    choose(radios()[2]);

    expect(onSelect).toHaveBeenCalledWith('PLUM');
  });

  it('does not call onSelect for the one that is already chosen', () => {
    const { radios, onSelect } = render(shades, 'RUBY');

    choose(radios()[0]);

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('follows the chosen sku it is given', () => {
    const view = render(shades, 'RUBY');

    view.rerender(<VariantPicker variants={shades} selectedSku="PLUM" onSelect={view.onSelect} />);

    expect(view.radios().map((radio) => radio.checked)).toEqual([false, false, true]);
    expect(view.legend()).toBe('Shade: Plum');
  });

  it('draws a colour as a swatch of that colour', () => {
    const swatch = render(shades, 'RUBY').container.querySelector<HTMLElement>('[style]');

    expect(swatch?.style.backgroundColor).toBe('rgb(193, 18, 31)');
  });

  it('writes a text variant as its value, in a box', () => {
    const { container } = render(sizes, 'S30');

    expect(container.textContent).toContain('30ml');
    expect(container.textContent).toContain('100ml');
    expect(container.querySelector('[style]')).toBeNull();
  });

  it('names each option for a screen reader, and says one that is out of stock is', () => {
    const { labels } = render(shades, 'RUBY');
    const reads = labels().map((label) => label.querySelector('.sr-only:not(input)')?.textContent);

    expect(reads).toEqual(['Ruby Red', 'Nude', 'Plum, out of stock']);
  });

  it('has a tooltip with the name, and says out of stock in it', () => {
    const { labels } = render(shades, 'RUBY');

    expect(labels().map((label) => label.getAttribute('title'))).toEqual([
      'Ruby Red',
      'Nude',
      'Plum - out of stock',
    ]);
  });

  it('draws one that is out of stock faded and struck through, and one in stock plain', () => {
    const { labels } = render(shades, 'RUBY');
    const [ruby, , plum] = labels();

    expect(plum?.querySelector('.opacity-40')).not.toBeNull();
    expect(plum?.querySelector('.-rotate-45')).not.toBeNull();
    expect(ruby?.querySelector('.opacity-40')).toBeNull();
    expect(ruby?.querySelector('.-rotate-45')).toBeNull();
  });

  it('draws a box that is out of stock faded and struck through too, and one in stock plain', () => {
    const [travel, full] = render(sizes, 'S30').labels();

    expect(full?.querySelector('.opacity-40')).not.toBeNull();
    expect(full?.querySelector('.-rotate-45')).not.toBeNull();
    expect(travel?.querySelector('.opacity-40')).toBeNull();
    expect(travel?.querySelector('.-rotate-45')).toBeNull();
  });

  it('marks the one that is chosen with a stronger border', () => {
    const { labels } = render(shades, 'NUDE');
    const [ruby, nude] = labels();

    expect(nude?.querySelector('.border-primary')).not.toBeNull();
    expect(ruby?.querySelector('.border-primary')).toBeNull();
  });

  it('keeps the strike out of the reading', () => {
    const strike = render(shades, 'RUBY').labels()[2]?.querySelector('.-rotate-45');

    expect(strike?.getAttribute('aria-hidden')).toBe('true');
  });
});
