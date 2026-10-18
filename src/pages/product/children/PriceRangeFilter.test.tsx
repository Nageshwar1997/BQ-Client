// @vitest-environment jsdom
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import PriceRangeFilter from './PriceRangeFilter';

interface IProps {
  bounds: { min: number; max: number } | null;
  minPrice?: number;
  maxPrice?: number;
}

const render = (props: IProps) => {
  const onChange = vi.fn();
  const element = (next: IProps) => <PriceRangeFilter {...next} onChange={onChange} />;
  const view = mount(element(props));

  const [minSlider, maxSlider] = [
    ...view.container.querySelectorAll<HTMLInputElement>('input[type="range"]'),
  ];
  const [minField, maxField] = [
    ...view.container.querySelectorAll<HTMLInputElement>('input[type="number"]'),
  ];

  return {
    ...view,
    onChange,
    minSlider,
    maxSlider,
    minField,
    maxField,
    update: (next: IProps) => {
      view.rerender(element(next));
    },
  };
};

// React hears a change through the value setter of the element, not through `element.value = ...`
const setValue = (input: HTMLInputElement | undefined, value: number) => {
  if (!input) throw new Error('There is no such field');

  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

  act(() => {
    descriptor?.set?.call(input, String(value));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

const fire = (input: HTMLInputElement | undefined, type: string) => {
  if (!input) throw new Error('There is no such field');

  act(() => {
    input.dispatchEvent(
      type === 'focusout'
        ? new FocusEvent(type, { bubbles: true })
        : new Event(type, { bubbles: true }),
    );
  });
};

const pressEnter = (input: HTMLInputElement | undefined) => {
  act(() => {
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  });
};

describe('PriceRangeFilter', () => {
  afterEach(() => {
    unmountAll();
  });

  it('shows the whole range of the prices when no price is chosen', () => {
    const { minSlider, maxSlider, minField, maxField } = render({ bounds: { min: 121, max: 699 } });

    expect([minSlider?.min, minSlider?.max, maxSlider?.min, maxSlider?.max]).toEqual([
      '121',
      '699',
      '121',
      '699',
    ]);
    expect([minField?.value, maxField?.value]).toEqual(['121', '699']);
    expect([minSlider?.value, maxSlider?.value]).toEqual(['121', '699']);
  });

  it('rounds the cheapest down and the dearest up, so that every product is inside the range', () => {
    const { minSlider, maxSlider } = render({ bounds: { min: 120.5, max: 698.2 } });

    expect([minSlider?.min, maxSlider?.max]).toEqual(['120', '699']);
  });

  it('shows the range that is chosen', () => {
    const { minField, maxField } = render({
      bounds: { min: 100, max: 900 },
      minPrice: 300,
      maxPrice: 600,
    });

    expect([minField?.value, maxField?.value]).toEqual(['300', '600']);
  });

  it('names the two thumbs, and says their value as an amount', () => {
    const { minSlider, maxSlider } = render({ bounds: { min: 100, max: 900 }, minPrice: 300 });

    expect(minSlider?.getAttribute('aria-label')).toBe('Minimum price');
    expect(maxSlider?.getAttribute('aria-label')).toBe('Maximum price');
    expect(minSlider?.getAttribute('aria-valuetext')).toBe('₹300');
    expect(maxSlider?.getAttribute('aria-valuetext')).toBe('₹900');
  });

  it('sends the lowest price typed in, when Enter is pressed - and only then', () => {
    const { minField, onChange } = render({ bounds: { min: 100, max: 900 } });

    setValue(minField, 400);
    expect(onChange).not.toHaveBeenCalled();

    pressEnter(minField);

    expect(onChange).toHaveBeenCalledWith({ minPrice: 400, maxPrice: undefined });
  });

  it('sends the highest price typed in, when the field is left', () => {
    const { maxField, onChange } = render({ bounds: { min: 100, max: 900 } });

    setValue(maxField, 500);
    fire(maxField, 'focusout');

    expect(onChange).toHaveBeenCalledWith({ minPrice: undefined, maxPrice: 500 });
  });

  it('sends a thumb that is let go, not every step of its drag', () => {
    const { minSlider, onChange } = render({ bounds: { min: 100, max: 900 } });

    setValue(minSlider, 200);
    setValue(minSlider, 300);
    setValue(minSlider, 350);
    expect(onChange).not.toHaveBeenCalled();

    fire(minSlider, 'pointerup');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ minPrice: 350, maxPrice: undefined });
  });

  it('sends a thumb that was moved with the keyboard when the key is let go', () => {
    const { minSlider, maxSlider, onChange } = render({ bounds: { min: 100, max: 900 } });

    setValue(maxSlider, 899);
    fire(maxSlider, 'keyup');
    expect(onChange).toHaveBeenLastCalledWith({ minPrice: undefined, maxPrice: 899 });

    setValue(minSlider, 101);
    fire(minSlider, 'keyup');
    expect(onChange).toHaveBeenLastCalledWith({ minPrice: 101, maxPrice: 899 });
  });

  it('sends the thumb that is left, with the focus gone, even when it was not let go with the pointer', () => {
    const { maxSlider, onChange } = render({ bounds: { min: 100, max: 900 } });

    setValue(maxSlider, 700);
    fire(maxSlider, 'focusout');

    expect(onChange).toHaveBeenCalledWith({ minPrice: undefined, maxPrice: 700 });
  });

  it('takes the price filter away when the range is all of the prices again', () => {
    const { minField, onChange } = render({ bounds: { min: 100, max: 900 }, minPrice: 400 });

    setValue(minField, 100);
    pressEnter(minField);

    expect(onChange).toHaveBeenCalledWith({ minPrice: undefined, maxPrice: undefined });
  });

  it('keeps a typed price inside the prices there are', () => {
    const { minField, maxField, onChange } = render({ bounds: { min: 100, max: 900 } });

    setValue(maxField, 99_999);
    pressEnter(maxField);
    expect(onChange).toHaveBeenLastCalledWith({ minPrice: undefined, maxPrice: undefined });

    setValue(minField, 5);
    pressEnter(minField);
    expect(onChange).toHaveBeenLastCalledWith({ minPrice: undefined, maxPrice: undefined });
    // and the fields say what was sent, not what was typed
    expect([minField?.value, maxField?.value]).toEqual(['100', '900']);
  });

  it('does not let the lowest price pass the highest, nor the highest go under the lowest', () => {
    const { minField, maxField, onChange } = render({
      bounds: { min: 100, max: 900 },
      minPrice: 300,
      maxPrice: 500,
    });

    setValue(minField, 800);
    expect(minField?.value).toBe('500');
    pressEnter(minField);
    expect(onChange).toHaveBeenLastCalledWith({ minPrice: 500, maxPrice: 500 });

    setValue(maxField, 200);
    expect(maxField?.value).toBe('500');
  });

  it('follows the URL when it changes from outside (Clear all, another filter, Back)', () => {
    const { minField, maxField, update } = render({
      bounds: { min: 100, max: 900 },
      minPrice: 300,
      maxPrice: 600,
    });

    update({ bounds: { min: 100, max: 900 } });

    expect([minField?.value, maxField?.value]).toEqual(['100', '900']);

    update({ bounds: { min: 100, max: 900 }, minPrice: 250 });

    expect([minField?.value, maxField?.value]).toEqual(['250', '900']);
  });

  it('says so when there are no prices to choose from, and when they are all the same', () => {
    expect(render({ bounds: null }).container.textContent).toContain('No prices to choose from');
    unmountAll();

    const same = render({ bounds: { min: 121, max: 121 } });

    expect(same.container.textContent).toContain('Every product here costs ₹121');
    expect(same.container.querySelector('input')).toBeNull();
  });
});
