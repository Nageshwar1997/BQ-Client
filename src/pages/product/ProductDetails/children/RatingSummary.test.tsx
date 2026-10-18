// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import RatingSummary from './RatingSummary';

const render = (props: { rating: number; reviews: number; soldCount?: number }) =>
  mount(<RatingSummary {...props} />).container;

// how far each of the five stars is filled
const fills = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>('[role="img"] .overflow-hidden')].map(
    (star) => star.style.width,
  );

const label = (container: HTMLElement) =>
  container.querySelector('[role="img"]')?.getAttribute('aria-label');

describe('RatingSummary', () => {
  afterEach(() => {
    unmountAll();
  });

  it('fills each of the five stars as far as the rating goes', () => {
    expect(fills(render({ rating: 4.8, reviews: 145 }))).toEqual([
      '100%',
      '100%',
      '100%',
      '100%',
      '80%',
    ]);
    unmountAll();
    expect(fills(render({ rating: 2.5, reviews: 10 }))).toEqual([
      '100%',
      '100%',
      '50%',
      '0%',
      '0%',
    ]);
    unmountAll();
    expect(fills(render({ rating: 5, reviews: 10 }))).toEqual([
      '100%',
      '100%',
      '100%',
      '100%',
      '100%',
    ]);
  });

  it('fills in whole percents, whatever floating point makes of the rating', () => {
    // (3.3 - 3) * 100 is 29.999999999999982 and (4.1 - 4) * 100 is 9.999999999999964
    expect(fills(render({ rating: 3.3, reviews: 4 }))).toEqual([
      '100%',
      '100%',
      '100%',
      '30%',
      '0%',
    ]);
    unmountAll();
    expect(fills(render({ rating: 4.1, reviews: 4 }))[4]).toBe('10%');
  });

  it('never fills a star more than full or less than empty', () => {
    expect(fills(render({ rating: 7, reviews: 1 }))).toEqual([
      '100%',
      '100%',
      '100%',
      '100%',
      '100%',
    ]);
    unmountAll();
    expect(fills(render({ rating: -2, reviews: 1 }))).toEqual(['0%', '0%', '0%', '0%', '0%']);
  });

  it('says the rating and how many reviews it is of, to everyone including a screen reader', () => {
    const container = render({ rating: 4.8, reviews: 145 });

    expect(container.textContent).toContain('4.8');
    expect(container.textContent).toContain('(145 reviews)');
    expect(label(container)).toBe('Rated 4.8 out of 5 from 145 reviews');
  });

  it('says "review", not "reviews", for one', () => {
    const container = render({ rating: 5, reviews: 1 });

    expect(container.textContent).toContain('(1 review)');
    expect(label(container)).toBe('Rated 5.0 out of 5 from 1 review');
  });

  it('writes a rating with one decimal, so 5 is "5.0"', () => {
    expect(render({ rating: 5, reviews: 3 }).textContent).toContain('5.0');
  });

  it('says a product nobody reviewed has no reviews, with empty stars, and not "0.0"', () => {
    const container = render({ rating: 0, reviews: 0 });

    expect(container.textContent).toContain('No reviews yet');
    expect(container.textContent).not.toContain('0.0');
    expect(label(container)).toBe('Not rated yet');
    expect(fills(container)).toEqual(['0%', '0%', '0%', '0%', '0%']);
  });

  it('shows empty stars for a product with no reviews even when its rating is not 0', () => {
    expect(fills(render({ rating: 4.5, reviews: 0 }))).toEqual(['0%', '0%', '0%', '0%', '0%']);
  });

  it('says how many were sold, only when some were, set apart the Indian way', () => {
    expect(render({ rating: 4, reviews: 2, soldCount: 12345 }).textContent).toContain(
      '12,345 sold',
    );
    unmountAll();
    expect(render({ rating: 4, reviews: 2, soldCount: 123456 }).textContent).toContain(
      '1,23,456 sold',
    );
    unmountAll();
    expect(render({ rating: 4, reviews: 2, soldCount: 0 }).textContent).not.toContain('sold');
    unmountAll();
    expect(render({ rating: 4, reviews: 2 }).textContent).not.toContain('sold');
  });

  it('sets the thousands of reviews apart too', () => {
    expect(render({ rating: 4, reviews: 123456 }).textContent).toContain('(1,23,456 reviews)');
  });

  it('says the sold count of a product nobody reviewed', () => {
    expect(render({ rating: 0, reviews: 0, soldCount: 40 }).textContent).toContain('40 sold');
  });
});
