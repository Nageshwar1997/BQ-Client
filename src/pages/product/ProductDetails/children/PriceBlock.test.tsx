// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import PriceBlock from './PriceBlock';

const render = (props: { sellingPrice: number; originalPrice: number; discount: number }) =>
  mount(<PriceBlock {...props} />).container;

describe('PriceBlock', () => {
  afterEach(() => {
    unmountAll();
  });

  it('shows the price to pay, what it was, the percent off and what is saved - for a product on sale', () => {
    const text = render({ sellingPrice: 549, originalPrice: 699, discount: 21 }).textContent;

    expect(text).toContain('₹549');
    expect(text).toContain('₹699');
    expect(text).toContain('21% off');
    expect(text).toContain('You save ₹150');
  });

  it('strikes the old price through, and says which is which to a screen reader', () => {
    const container = render({ sellingPrice: 549, originalPrice: 699, discount: 21 });
    const old = container.querySelector('.line-through');

    expect(old?.textContent).toBe('Was ₹699');
    expect(container.querySelector('.text-3xl')?.textContent).toBe('Price ₹549');
  });

  it('shows only the price when the product is not on sale', () => {
    const container = render({ sellingPrice: 549, originalPrice: 549, discount: 0 });

    expect(container.textContent).toBe('Price ₹549');
    expect(container.querySelector('.line-through')).toBeNull();
  });

  it('writes amounts the Indian way, with the decimals only when there are some', () => {
    const text = render({ sellingPrice: 1299.5, originalPrice: 125000, discount: 99 }).textContent;

    expect(text).toContain('₹1,299.50');
    expect(text).toContain('₹1,25,000');
    expect(text).toContain('You save ₹1,23,700.50');
  });
});
