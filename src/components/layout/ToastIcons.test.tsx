// @vitest-environment jsdom
import { Toaster, type TToastItem } from '@beautinique/frontend-components';
import { _api } from '@iconify/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

// Iconify gets an icon's SVG from its API the first time the icon is shown. With no internet that
// never works, so a toast that is shown for the first time while offline (the "You're offline" one,
// or the error of a request that just failed) would have an empty space where its icon belongs.
// The toast system is the package's, which bundles its icons; these tests check, on the package as
// this app installs it, that every toast still has its own icon with the API taken away. The icons
// have to arrive through the package's `Toaster` alone: this file does not register any.
const apiRequests: string[] = [];
let realFetch: ReturnType<typeof _api.getFetch>;

type TSingleToastType = Exclude<TToastItem['type'], 'uploads'>;

const toastOfType = (type: TSingleToastType): TToastItem => {
  switch (type) {
    case 'progress':
      return { id: 'toast', type, title: 'Uploading', progress: 40 };
    case 'custom':
      return { id: 'toast', type, children: 'Custom' };
    case 'loading':
      return { id: 'toast', type, title: 'Working' };
    default:
      return { id: 'toast', type, title: 'Title', description: 'Description' };
  }
};

/** What the toast draws as its icon: the first thing in its row (the close "x" comes last). */
const mainIcon = (container: HTMLElement) =>
  container.querySelector('.bg-secondary-invert')?.firstElementChild ?? null;

// A piece of each icon's drawing that no other toast icon has.
const DRAWINGS = {
  warning: 'M5.31171',
  error: 'M5.31171',
  success: 'M8.5 12.5',
  default: 'M12 17.75',
  custom: 'M12 17.75',
  loading: 'M17 3.34',
} as const;

describe('toast icons without a network', () => {
  beforeEach(() => {
    realFetch = _api.getFetch();
    apiRequests.length = 0;
    _api.setFetch((url) => {
      apiRequests.push(typeof url === 'string' ? url : url instanceof URL ? url.href : url.url);

      return Promise.reject(new TypeError('Failed to fetch'));
    });
  });

  afterEach(() => {
    unmountAll();
    if (realFetch) _api.setFetch(realFetch);
    document.body.replaceChildren();
  });

  it.each(Object.keys(DRAWINGS) as (keyof typeof DRAWINGS)[])(
    'a %s toast shows its own icon',
    (type) => {
      const view = mount(<Toaster {...toastOfType(type)} />);

      const icon = mainIcon(view.container);
      expect(icon?.tagName.toLowerCase()).toBe('svg'); // not the empty placeholder of a missing icon
      expect(icon?.innerHTML).toContain(DRAWINGS[type]);
      view.unmount();
    },
  );

  it('does not ask the icon API for any of them', () => {
    for (const type of Object.keys(DRAWINGS) as (keyof typeof DRAWINGS)[]) {
      mount(<Toaster {...toastOfType(type)} />).unmount();
    }

    expect(apiRequests).toEqual([]);
  });
});
