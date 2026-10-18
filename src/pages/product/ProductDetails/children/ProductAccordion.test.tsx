// @vitest-environment jsdom
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mount, unmountAll } from '@/test-utils/react';

import ProductAccordion from './ProductAccordion';

// The text (Quill) is tested in its own package; here it is only a marker of what it was given.
vi.mock('@beautinique/frontend-quill', () => ({
  QuillContent: ({ content }: { content: string }) => <div data-testid="text">{content}</div>,
}));

const texts = {
  description: 'About the lipstick',
  instructions: 'Apply to lips',
  ingredients: 'Wax, oil',
  additional: 'Made in India',
};

const render = (product: Partial<typeof texts> = texts) => {
  const view = mount(
    <ProductAccordion
      product={{
        description: '',
        instructions: undefined,
        ingredients: undefined,
        additional: undefined,
        ...product,
      }}
    />,
  );
  const buttons = () => [...view.container.querySelectorAll('button')];

  return {
    ...view,
    buttons,
    titles: () => buttons().map((button) => button.textContent),
    expanded: () => buttons().map((button) => button.getAttribute('aria-expanded')),
    texts: () =>
      [...view.container.querySelectorAll('[data-testid="text"]')].map((item) => item.textContent),
  };
};

describe('ProductAccordion', () => {
  afterEach(() => {
    unmountAll();
  });

  it('has a section for each text of the product, in this order', () => {
    const { titles, texts: shown } = render();

    expect(titles()).toEqual(['Description', 'How to use', 'Ingredients', 'More information']);
    expect(shown()).toEqual(['About the lipstick', 'Apply to lips', 'Wax, oil', 'Made in India']);
  });

  it('opens the first section and leaves the others closed', () => {
    expect(render().expanded()).toEqual(['true', 'false', 'false', 'false']);
  });

  it('has no section for a text the product has not got, and the first one that is left is open', () => {
    const { titles, expanded } = render({
      instructions: 'Apply to lips',
      additional: 'Made in India',
    });

    expect(titles()).toEqual(['How to use', 'More information']);
    expect(expanded()).toEqual(['true', 'false']);
  });

  it('has no section for a text that is empty', () => {
    const { titles } = render({ description: '', ingredients: 'Wax, oil' });

    expect(titles()).toEqual(['Ingredients']);
  });

  it('shows nothing at all for a product with no text', () => {
    const { container } = render({});

    expect(container.innerHTML).toBe('');
  });

  it('opens a closed section when it is pressed, and closes it when it is pressed again', () => {
    const { buttons, expanded } = render();

    act(() => {
      buttons()[2]?.click();
    });
    expect(expanded()).toEqual(['true', 'false', 'true', 'false']);

    act(() => {
      buttons()[2]?.click();
    });
    expect(expanded()).toEqual(['true', 'false', 'false', 'false']);
  });

  it('keeps a closed section out of reach of the keyboard', () => {
    const view = render();
    const panels = [...view.container.querySelectorAll('[id$="-panel"]')];

    expect(panels.map((panel) => panel.hasAttribute('inert'))).toEqual([false, true, true, true]);
  });
});
