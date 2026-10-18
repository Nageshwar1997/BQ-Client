// @vitest-environment jsdom
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import ShareButton from './ShareButton';

const success = vi.fn();
const error = vi.fn();

vi.mock('@/utils/toaster', () => ({
  toaster: {
    success: (options: unknown): unknown => success(options),
    error: (options: unknown): unknown => error(options),
  },
}));

const share = vi.fn();
const writeText = vi.fn();

const setNavigator = ({ canShare }: { canShare: boolean }) => {
  vi.stubGlobal('navigator', {
    ...(canShare ? { share } : {}),
    clipboard: { writeText },
  });
};

const render = () => {
  const view = mount(<ShareButton title="Velvet Matte Lipstick" />);
  const button = view.container.querySelector('button');

  if (!button) throw new Error('There is no button');

  // the click starts an async share: let it finish (the promises settle in a few turns)
  const press = async () => {
    await act(async () => {
      button.click();
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  return { ...view, button, press };
};

describe('ShareButton', () => {
  beforeEach(() => {
    success.mockReset();
    error.mockReset();
    share.mockReset().mockResolvedValue(undefined);
    writeText.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    unmountAll();
    vi.unstubAllGlobals();
  });

  it('is a button that says what it does', () => {
    setNavigator({ canShare: true });

    const { button } = render();

    expect(button.textContent).toBe('Share');
    expect(button.getAttribute('type')).not.toBe('submit');
  });

  it('opens the share sheet with the name of the product and this address, when the device has one', async () => {
    setNavigator({ canShare: true });

    const { press } = render();

    await press();

    expect(share).toHaveBeenCalledTimes(1);
    expect(share).toHaveBeenCalledWith({
      title: 'Velvet Matte Lipstick',
      url: window.location.href,
    });
    // the sheet is the answer: nothing is copied or said
    expect(writeText).not.toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it('copies the address and says so when there is no share sheet', async () => {
    setNavigator({ canShare: false });

    const { press } = render();

    await press();

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(window.location.href);
    expect(success).toHaveBeenCalledTimes(1);
    expect(success).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Link copied' }) as unknown,
    );
    expect(error).not.toHaveBeenCalled();
  });

  it('says nothing when the person closes the share sheet without sharing', async () => {
    setNavigator({ canShare: true });
    share.mockRejectedValue(new DOMException('Share canceled', 'AbortError'));

    const { press } = render();

    await press();

    expect(error).not.toHaveBeenCalled();
    expect(success).not.toHaveBeenCalled();
    expect(writeText).not.toHaveBeenCalled();
  });

  it('says it could not share when the share sheet fails for another reason', async () => {
    setNavigator({ canShare: true });
    share.mockRejectedValue(new DOMException('Not allowed', 'NotAllowedError'));

    const { press } = render();

    await press();

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Could not share' }) as unknown,
    );
    expect(success).not.toHaveBeenCalled();
  });

  it('says it could not share when the address cannot be copied (a page that is not secure)', async () => {
    setNavigator({ canShare: false });
    writeText.mockRejectedValue(new DOMException('Denied', 'NotAllowedError'));

    const { press } = render();

    await press();

    expect(error).toHaveBeenCalledTimes(1);
    expect(success).not.toHaveBeenCalled();
  });

  it('says it could not share when there is no clipboard at all', async () => {
    vi.stubGlobal('navigator', {});

    const { press } = render();

    await press();

    expect(error).toHaveBeenCalledTimes(1);
    expect(success).not.toHaveBeenCalled();
  });

  it('shares the address that is open when it is pressed, not the one it was shown at', async () => {
    setNavigator({ canShare: true });

    const { press } = render();

    window.history.pushState({}, '', '/products/velvet-matte-lipstick?v=NUDE');
    await press();

    expect(share).toHaveBeenCalledWith({
      title: 'Velvet Matte Lipstick',
      url: expect.stringContaining('?v=NUDE') as unknown,
    });

    window.history.pushState({}, '', '/');
  });
});
