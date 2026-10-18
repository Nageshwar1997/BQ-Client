// @vitest-environment jsdom
import { useQueryParams } from '@beautinique/frontend-hooks';
import { act } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import ProductsToolbar from './ProductsToolbar';

const Location = () => <output data-testid="url">{useLocation().search}</output>;

// what a chip or "Clear all" does: takes the search out of the URL without touching the box
const RemoveSearch = () => {
  const { removeParams } = useQueryParams();

  return (
    <button
      type="button"
      data-testid="remove-search"
      onClick={() => {
        removeParams('search');
      }}
    />
  );
};

const render = (url = '/products', props: { activeFilters?: number } = {}) => {
  const onOpenFilters = vi.fn();
  const onSortChange = vi.fn();
  const view = mount(
    <MemoryRouter initialEntries={[url]}>
      <ProductsToolbar
        sort="newest"
        hasSearch={false}
        onSortChange={onSortChange}
        activeFilters={props.activeFilters ?? 0}
        onOpenFilters={onOpenFilters}
      />
      <Location />
      <RemoveSearch />
    </MemoryRouter>,
  );

  const input = () => {
    const field = view.container.querySelector<HTMLInputElement>('input[type="search"]');

    if (!field) throw new Error('There is no search box');

    return field;
  };

  return {
    ...view,
    onOpenFilters,
    input,
    url: () => view.container.querySelector('[data-testid="url"]')?.textContent,
    clearButton: () =>
      view.container.querySelector<HTMLButtonElement>('[aria-label="Clear search"]'),
  };
};

// React hears a change through the value setter of the element, not through `element.value = ...`
const type = (input: HTMLInputElement, value: string) => {
  const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

  act(() => {
    descriptor?.set?.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
};

const wait = async (ms: number) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

describe('ProductsToolbar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    unmountAll();
    vi.useRealTimers();
  });

  it('shows the search that is in the URL', () => {
    expect(render('/products?search=lip').input().value).toBe('lip');
  });

  it('puts what is typed in the URL a moment after the last key, not at every key', async () => {
    const { input, url } = render();

    type(input(), 'l');
    type(input(), 'li');
    type(input(), 'lip');

    expect(input().value).toBe('lip');
    expect(url()).toBe('');

    await wait(600);

    expect(url()).toBe('?search=lip');
  });

  it('puts what is typed in the URL at once when Enter is pressed', () => {
    const { input, url, container } = render();

    type(input(), 'kajal');

    act(() => {
      container
        .querySelector('form')
        ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(url()).toBe('?search=kajal');
  });

  it('empties the box AND takes the search out of the URL when the clear icon is pressed', async () => {
    const { input, url, clearButton } = render('/products?search=lip');

    expect(clearButton()).not.toBeNull();

    act(() => {
      clearButton()?.click();
    });
    await wait(600);

    expect(input().value).toBe('');
    expect(url()).toBe('');
    // and it stays out: the box does not take the old search back
    expect(input().value).toBe('');
  });

  it('leaves the other params of the URL alone when the search is cleared', async () => {
    const { url, clearButton } = render('/products?brand=A&search=lip&sort=rating&minPrice=100');

    act(() => {
      clearButton()?.click();
    });
    await wait(600);

    expect(new URLSearchParams(url()).get('search')).toBeNull();
    expect(new URLSearchParams(url()).get('brand')).toBe('A');
    expect(new URLSearchParams(url()).get('sort')).toBe('rating');
    expect(new URLSearchParams(url()).get('minPrice')).toBe('100');
  });

  it('does not send a text that was typed and then cleared before the delay was over', async () => {
    const { input, url, clearButton } = render();

    type(input(), 'lip');
    act(() => {
      clearButton()?.click();
    });
    await wait(1000);

    expect(input().value).toBe('');
    expect(url()).toBe('');
  });

  it('can search again after a clear', async () => {
    const { input, url, clearButton } = render('/products?search=lip');

    act(() => {
      clearButton()?.click();
    });
    await wait(600);
    type(input(), 'kajal');
    await wait(600);

    expect(url()).toBe('?search=kajal');
    expect(input().value).toBe('kajal');
  });

  it('has no clear icon while the box is empty', () => {
    expect(render().clearButton()).toBeNull();
  });

  it('follows the URL when the search is taken out of it from outside (a chip, Clear all, Back)', async () => {
    const { input, container } = render('/products?search=lip');

    expect(input().value).toBe('lip');

    act(() => {
      container.querySelector<HTMLButtonElement>('[data-testid="remove-search"]')?.click();
    });
    await wait(600);

    expect(input().value).toBe('');
  });

  it('names the filters button with how many are on, and opens them when it is pressed', () => {
    const closed = render('/products', { activeFilters: 0 });
    const button = closed.container.querySelector<HTMLButtonElement>('[aria-label^="Filters"]');

    expect(button?.getAttribute('aria-label')).toBe('Filters');
    unmountAll();

    const open = render('/products', { activeFilters: 3 });
    const withCount = open.container.querySelector<HTMLButtonElement>('[aria-label^="Filters"]');

    expect(withCount?.getAttribute('aria-label')).toBe('Filters, 3 in use');

    act(() => {
      withCount?.click();
    });

    expect(open.onOpenFilters).toHaveBeenCalledTimes(1);
  });
});
