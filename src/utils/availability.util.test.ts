import { describe, expect, it } from 'vitest';

import { AVAILABILITY_LABELS, getAvailability } from './availability.util';

describe('getAvailability', () => {
  it('is "in stock" for something that has some and is not nearly gone', () => {
    expect(getAvailability({ inStock: true, lowStock: false })).toBe('in-stock');
  });

  it('is "low stock" for something that has some, but only a few', () => {
    expect(getAvailability({ inStock: true, lowStock: true })).toBe('low-stock');
  });

  it('is "out of stock" when there is none', () => {
    expect(getAvailability({ inStock: false, lowStock: false })).toBe('out-of-stock');
  });

  it('is "out of stock" even if the service says "low" about something that has none', () => {
    expect(getAvailability({ inStock: false, lowStock: true })).toBe('out-of-stock');
  });
});

describe('AVAILABILITY_LABELS', () => {
  it('says each of them in words, and never a number', () => {
    expect(AVAILABILITY_LABELS).toEqual({
      'in-stock': 'In stock',
      'low-stock': 'Only a few left',
      'out-of-stock': 'Out of stock',
    });
  });
});
