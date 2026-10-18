// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import { useDocumentTitle } from './useDocumentTitle';

const Page = ({ title }: { title?: string }) => {
  useDocumentTitle(title);

  return null;
};

describe('useDocumentTitle', () => {
  beforeEach(() => {
    document.title = 'Beautinique';
  });

  afterEach(() => {
    unmountAll();
  });

  it('puts the title on the tab while the page is shown', () => {
    mount(<Page title="Velvet Matte Lipstick | Beautinique" />);

    expect(document.title).toBe('Velvet Matte Lipstick | Beautinique');
  });

  it('gives the old title back when the page goes', () => {
    const { unmount } = mount(<Page title="Velvet Matte Lipstick | Beautinique" />);

    unmount();

    expect(document.title).toBe('Beautinique');
  });

  it('leaves the title alone while there is none (the page is still loading)', () => {
    mount(<Page />);

    expect(document.title).toBe('Beautinique');
  });

  it('follows the title when it changes, and still gives back the first old one', () => {
    const view = mount(<Page title="First | Beautinique" />);

    view.rerender(<Page title="Second | Beautinique" />);
    expect(document.title).toBe('Second | Beautinique');

    view.unmount();
    expect(document.title).toBe('Beautinique');
  });

  it('gives the old title back when the title goes away again', () => {
    const view = mount(<Page title="First | Beautinique" />);

    view.rerender(<Page />);

    expect(document.title).toBe('Beautinique');
  });

  it('works in strict mode, which runs the effect twice', () => {
    const { unmount } = mount(<Page title="Velvet | Beautinique" />, { strict: true });

    expect(document.title).toBe('Velvet | Beautinique');

    unmount();

    expect(document.title).toBe('Beautinique');
  });
});
