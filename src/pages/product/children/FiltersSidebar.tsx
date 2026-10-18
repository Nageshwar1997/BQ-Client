import { ScrollableGradientContainer } from '@beautinique/frontend-components';
import type { ReactNode } from 'react';

/**
 * The filters beside the list on a wide screen - the way the sidebar of the profile pages is made: it sticks under the
 * navbar (`top-16`), and what is in it scrolls in the box of the shared `ScrollableGradientContainer` (with its fade
 * on the edge that has more behind it).
 *
 * - The wheel over it scrolls it and not the page (`overscroll-contain`); the wheel over the list scrolls the page.
 * - It starts at the very top of the page, so while the page is at the top it is already where it will stick (not
 *   lower down, with its bottom below the screen), and its box is never taller than what is left of the screen
 *   there (the navbar is 100px at the top, 64px once it sticks, plus a gap): all of it is on the screen at any scroll
 *   of the page, and its own scroll reaches its end.
 */
const FiltersSidebar = ({ children }: { children: ReactNode }) => (
  <aside
    aria-label="Filters"
    className="sticky top-16 flex max-h-[calc(100dvh-7.25rem)] w-64 shrink-0 flex-col xl:w-72"
  >
    <ScrollableGradientContainer
      direction="vertical"
      label="Filters"
      containerClassName="min-h-0 flex-1"
      className="overscroll-contain px-4 py-6 xl:px-6"
      gradientClassNames={{ top: 'h-6!', bottom: 'h-6!' }}
    >
      {/* the container lays its children out from the start: this fills its width */}
      <div className="w-full min-w-0">{children}</div>
    </ScrollableGradientContainer>
  </aside>
);

export default FiltersSidebar;
