// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import FiltersSidebar from './FiltersSidebar';

const render = () =>
  mount(
    <FiltersSidebar>
      <p data-testid="filters">the filters</p>
    </FiltersSidebar>,
  ).container;

describe('FiltersSidebar', () => {
  beforeEach(() => {
    // jsdom has no ResizeObserver: the box that scrolls watches its own size with one
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {
          // the size is never read in these tests
        }

        unobserve() {
          // nothing is taken off the watch
        }

        disconnect() {
          // nor is the watch ended
        }
      },
    );
  });

  afterEach(() => {
    unmountAll();
    vi.unstubAllGlobals();
  });

  it('is a sidebar named "Filters" that draws what it is given, as wide as itself', () => {
    const container = render();
    const aside = container.querySelector('aside');
    const filters = container.querySelector('[data-testid="filters"]');

    expect(aside?.getAttribute('aria-label')).toBe('Filters');
    expect(filters?.textContent).toBe('the filters');
    // the scroller lays its children out from the start: without a full-width box they would be as wide as their text
    expect(filters?.parentElement?.className).toContain('w-full');
  });

  it('sticks under the navbar, like the sidebar of the profile pages', () => {
    const aside = render().querySelector('aside');

    expect(aside?.className).toContain('sticky');
    expect(aside?.className).toContain('top-16');
  });

  it('is never taller than what is left of the screen below the top of the page', () => {
    const aside = render().querySelector('aside');

    // 100dvh less the navbar at the top of the page (100px) and a gap: all of it is on the screen at any scroll
    expect(aside?.className).toContain('max-h-[calc(100dvh-7.25rem)]');
    // the box that scrolls is what is left in it (`min-h-0` lets a flex child be smaller than its content)
    expect(aside?.className).toContain('flex-col');
    expect(aside?.querySelector('[class*="min-h-0"]')).not.toBeNull();
  });

  it('scrolls inside itself, and the wheel over it does not scroll the page', () => {
    const scroller = render().querySelector('aside [class*="overflow-y-auto"]');

    expect(scroller).not.toBeNull();
    expect(scroller?.className).toContain('overscroll-contain');
  });
});
