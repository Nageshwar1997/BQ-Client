// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import ProductDetailsSkeleton from './ProductDetailsSkeleton';

describe('ProductDetailsSkeleton', () => {
  afterEach(() => {
    unmountAll();
  });

  it('tells a screen reader the product is coming, once, as a busy status', () => {
    const { container } = mount(<ProductDetailsSkeleton />);
    const status = container.querySelector('[role="status"]');

    expect(status?.getAttribute('aria-busy')).toBe('true');
    expect(status?.textContent).toBe('Loading product');
  });

  it('keeps the grey shapes out of the reading', () => {
    const { container } = mount(<ProductDetailsSkeleton />);
    // the two columns; the shapes in them are inside, so they are out of the reading with them
    const shapes = [...container.querySelectorAll('[role="status"] > [aria-hidden="true"]')];

    expect(shapes).toHaveLength(2);
    expect(shapes.every((shape) => shape.textContent === '')).toBe(true);
  });
});
