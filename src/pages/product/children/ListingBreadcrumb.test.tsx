// @vitest-environment jsdom
import { act } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';
import type { TCategoryNode } from '@/utils/category.util';

import ListingBreadcrumb from './ListingBreadcrumb';

const category = (slug: string, name: string, level: 1 | 2 | 3) =>
  ({ _id: slug, name, slug, level, subcategories: [] }) as unknown as TCategoryNode;

const Where = () => <output data-testid="where">{useLocation().pathname}</output>;

const render = (trail: TCategoryNode[], currentName?: string) => {
  const view = mount(
    <MemoryRouter initialEntries={['/products/somewhere']}>
      <ListingBreadcrumb trail={trail} current={currentName} />
      <Where />
    </MemoryRouter>,
  );

  return {
    ...view,
    links: () => [...view.container.querySelectorAll('a')],
    where: () => view.container.querySelector('[data-testid="where"]')?.textContent,
    current: () => view.container.querySelector('[aria-current="page"]'),
  };
};

describe('ListingBreadcrumb', () => {
  beforeEach(() => {
    // jsdom has no ResizeObserver: the breadcrumb (a scroller with a fade) measures itself with one
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

  it('is Home / Products on the page of all products, and Products is the page itself', () => {
    const { container, links, current } = render([]);

    expect(container.querySelector('nav')?.getAttribute('aria-label')).toBe('Breadcrumb');
    expect(links().map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Home', '/'],
    ]);
    expect(current()?.textContent).toBe('Products');
  });

  it('goes down the categories, each one a link to its own page but the last', () => {
    const { links, current } = render([
      category('face', 'Face', 1),
      category('face-makeup', 'Face Makeup', 2),
      category('foundation', 'Foundation', 3),
    ]);

    expect(links().map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Home', '/'],
      ['Products', '/products'],
      ['Face', '/products/face'],
      ['Face Makeup', '/products/face/face-makeup'],
    ]);
    expect(current()?.textContent).toBe('Foundation');
  });

  it('ends with the name of the page when the page is a product: every category is then a link', () => {
    const { links, current } = render(
      [
        category('face', 'Face', 1),
        category('face-makeup', 'Face Makeup', 2),
        category('foundation', 'Foundation', 3),
      ],
      'Velvet Matte Lipstick',
    );

    expect(links().map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Home', '/'],
      ['Products', '/products'],
      ['Face', '/products/face'],
      ['Face Makeup', '/products/face/face-makeup'],
      ['Foundation', '/products/face/face-makeup/foundation'],
    ]);
    expect(current()?.textContent).toBe('Velvet Matte Lipstick');
  });

  it('can be a product that has no category in the trail yet (it is still being found)', () => {
    const { links, current } = render([], 'Velvet Matte Lipstick');

    expect(links().map((link) => link.textContent)).toEqual(['Home', 'Products']);
    expect(current()?.textContent).toBe('Velvet Matte Lipstick');
  });

  it('goes to a page with the router, without loading the app again', () => {
    const { links, where } = render([
      category('face', 'Face', 1),
      category('face-makeup', 'Face Makeup', 2),
    ]);
    const products = links().find((link) => link.textContent === 'Products');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });

    act(() => {
      products?.dispatchEvent(event);
    });

    expect(where()).toBe('/products');
    // the browser's own navigation is the one that was stopped
    expect(event.defaultPrevented).toBe(true);
  });

  it('leaves a click with a modifier to the browser (open in a new tab)', () => {
    const { links, where } = render([
      category('face', 'Face', 1),
      category('face-makeup', 'Face Makeup', 2),
    ]);
    const face = links().find((link) => link.textContent === 'Face');
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ctrlKey: true,
    });

    act(() => {
      face?.dispatchEvent(event);
    });

    expect(where()).toBe('/products/somewhere');
    expect(event.defaultPrevented).toBe(false);
  });
});
