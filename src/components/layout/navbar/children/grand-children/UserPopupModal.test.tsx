// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import UserPopupModal from './UserPopupModal';

// The popover sits under the navbar's user icon, inside a `relative` wrapper whose outside-click
// handler closes it. It was once drawn with a dialog component that puts itself in `document.body`:
// there it lost its place under the icon, and the wrapper took a press on its buttons for a press
// outside, so it closed before "Login" could be clicked. These tests keep it a plain popover.

const Search = () => <output data-testid="search">{useLocation().search}</output>;

const renderPopover = (isOpen: boolean, onClose = vi.fn()) => {
  const view = mount(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter>
        <div className="relative" data-testid="wrapper">
          <UserPopupModal isOpen={isOpen} onClose={onClose} />
        </div>
        <Search />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  const wrapper = view.container.querySelector<HTMLElement>('[data-testid="wrapper"]');

  if (!wrapper) throw new Error('The wrapper of the popover is not on the page');

  return { ...view, wrapper, onClose };
};

const popoverIn = (wrapper: HTMLElement) =>
  wrapper.querySelector<HTMLElement>('[role="group"][aria-label="Account menu"]');

const buttonNamed = (wrapper: HTMLElement, name: string) =>
  [...wrapper.querySelectorAll('button')].find((button) => button.textContent.trim() === name);

describe('UserPopupModal', () => {
  afterEach(() => {
    unmountAll();
  });

  it('shows nothing while it is closed', () => {
    const { wrapper } = renderPopover(false);

    expect(wrapper.children).toHaveLength(0);
  });

  it('is drawn inside the wrapper of the icon, not in the body, and is not a dialog', () => {
    const { wrapper } = renderPopover(true);

    expect(popoverIn(wrapper)).not.toBeNull();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    // a dialog would lock the scrolling of the page
    expect(document.body.style.overflow).not.toBe('hidden');
  });

  it('is placed under the icon (absolute inside the wrapper), not over the whole page', () => {
    const { wrapper } = renderPopover(true);
    const classes = popoverIn(wrapper)?.className.split(/\s+/) ?? [];

    expect(classes).toEqual(expect.arrayContaining(['absolute', 'top-11', 'left-1/2']));
    expect(classes).not.toContain('fixed');
  });

  it('closes with Escape, and only while it is open', () => {
    const open = renderPopover(true);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(open.onClose).toHaveBeenCalledTimes(1);

    unmountAll();
    const closed = renderPopover(false);

    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(closed.onClose).not.toHaveBeenCalled();
  });

  it('stops listening for Escape once it is gone', () => {
    const { onClose, unmount } = renderPopover(true);

    unmount();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('asks for the login (the login flag in the address) and closes itself when "Login" is pressed', () => {
    const { wrapper, onClose } = renderPopover(true);
    const login = buttonNamed(wrapper, 'Login');

    expect(login).toBeDefined();

    act(() => {
      login?.click();
    });

    expect(document.querySelector('[data-testid="search"]')?.textContent).toContain('login=true');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
