// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';
import type { TAvailability } from '@/utils/availability.util';

import AvailabilityNote from './AvailabilityNote';

const render = (availability: TAvailability) =>
  mount(<AvailabilityNote availability={availability} />).container;

describe('AvailabilityNote', () => {
  afterEach(() => {
    unmountAll();
  });

  it.each([
    ['in-stock', 'In stock', 'bg-primary-green'],
    ['low-stock', 'Only a few left', 'bg-princeton-orange-c'],
    ['out-of-stock', 'Out of stock', 'bg-primary-red'],
  ] as const)('says %s in words, with a dot that goes with it', (availability, words, dot) => {
    const container = render(availability);

    expect(container.textContent).toBe(words);
    expect(container.querySelector('[aria-hidden="true"]')?.className).toContain(dot);
  });

  it('is read out when it changes (a shopper chooses another shade)', () => {
    expect(render('in-stock').querySelector('p')?.getAttribute('aria-live')).toBe('polite');
  });

  it('keeps the dot out of the reading: the words are the meaning', () => {
    const dot = render('out-of-stock').querySelector('[aria-hidden="true"]');

    expect(dot?.textContent).toBe('');
  });

  it('changes its words and its dot when the stock changes', () => {
    const view = mount(<AvailabilityNote availability="in-stock" />);

    view.rerender(<AvailabilityNote availability="out-of-stock" />);

    expect(view.container.textContent).toBe('Out of stock');
    expect(view.container.querySelector('[aria-hidden="true"]')?.className).toContain(
      'bg-primary-red',
    );
    expect(view.container.querySelector('[aria-hidden="true"]')?.className).not.toContain(
      'bg-primary-green',
    );
  });
});
