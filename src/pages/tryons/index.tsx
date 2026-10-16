import { TRY_ON_MAP } from '@beautinique/frontend-constants';
import type { TTryOnSelection } from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import { StaticPageHeader, StaticPageLayout } from '@/components/layout/static-page';
import TryOnModal from '@/components/layout/tryons';
import { getTryOnShades, TRYON_CATEGORY_OPTIONS } from '@/constants/tryon-constants';

const HOW_IT_WORKS = [
  {
    icon: 'solar:palette-round-linear',
    title: 'Pick a product',
    text: 'Choose a category and finish below.',
  },
  {
    icon: 'solar:camera-linear',
    title: 'Camera ya photo',
    text: 'Go live, or upload a clear photo.',
  },
  {
    icon: 'solar:magic-stick-3-linear',
    title: 'Try & compare',
    text: 'Tap shades, tune intensity, compare.',
  },
] as const;

const getSectionId = (category: string) => `tryon-${category.toLowerCase()}`;

// Smooth-scrolls to a category section. Deliberately a button + `scrollIntoView` rather than a
// `#hash` anchor - a hash change goes through the router (and `ScrollToTop`), which can yank the
// page back to the top instead of landing on the section.
const scrollToCategory = (category: string) => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document
    .getElementById(getSectionId(category))
    ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
};

// Standalone entry point into the Try-On modal - lets a shopper browse every category/subcategory
// directly (instead of only reaching it from a product's own "Try it on" button, like
// `ProductDetails`) and jump straight in with a curated shade set for whichever one they pick.
const Tryons = () => {
  // Kept separate from `isOpen` (same split `ProductDetails` uses for its own `TryOnModal`) so the
  // modal's closing transition still has a real `tryOn`/`shades` pair to animate out, instead of
  // snapping to the empty state the instant the shopper closes it.
  const [selected, setSelected] = useState<TTryOnSelection | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <StaticPageLayout>
      <StaticPageHeader
        icon="solar:magic-stick-3-linear"
        title="Virtual Try-On"
        description="Live camera se ya ek photo upload karke, kharidne se pehle khud par dekho - har category ka apna curated shade range."
      />

      <div className="flex flex-col gap-10 sm:gap-12">
        <ol className="grid gap-3 sm:grid-cols-3">
          {HOW_IT_WORKS.map(({ icon, title, text }, index) => (
            <li
              key={title}
              className="border-primary/10 bg-secondary-invert flex items-center gap-3 rounded-2xl border p-3.5 sm:flex-col sm:gap-2.5 sm:p-5 sm:text-center"
            >
              <span className="bg-accent-duo shadow-secondary-btn relative flex size-11 shrink-0 items-center justify-center rounded-xl">
                <Icon icon={icon} className="size-5.5 text-white" />
                <span
                  aria-hidden
                  className="bg-primary-invert text-primary border-primary/10 absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full border text-[10px] font-semibold"
                >
                  {index + 1}
                </span>
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-primary text-sm font-semibold">{title}</span>
                <span className="text-tertiary text-xs">{text}</span>
              </span>
            </li>
          ))}
        </ol>

        <nav aria-label="Try-On categories" className="flex flex-wrap justify-center gap-2">
          {TRYON_CATEGORY_OPTIONS.map(({ category, icon, title }) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                scrollToCategory(category);
              }}
              className="border-primary/10 bg-secondary-invert text-secondary hover:border-blue-crayola-c/50 hover:text-primary focus-visible:outline-blue-crayola-c flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0"
            >
              <Icon icon={icon} className="text-blue-crayola-c size-4.5" />
              {title}
            </button>
          ))}
        </nav>

        {TRYON_CATEGORY_OPTIONS.map(({ category, icon, title, description }) => {
          const subCategories = TRY_ON_MAP[category];

          return (
            <section
              key={category}
              id={getSectionId(category)}
              aria-labelledby={`${getSectionId(category)}-title`}
              className="flex scroll-mt-24 flex-col gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="bg-accent-duo shadow-secondary-btn flex size-11 shrink-0 items-center justify-center rounded-2xl sm:size-12">
                  <Icon icon={icon} className="size-5.5 text-white sm:size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2
                    id={`${getSectionId(category)}-title`}
                    className="text-primary text-lg font-semibold sm:text-xl"
                  >
                    {title}
                  </h2>
                  <p className="text-tertiary text-xs sm:text-sm">{description}</p>
                </div>
                <span className="bg-primary/5 text-secondary shrink-0 rounded-full px-3 py-1 text-xs font-medium">
                  {`${String(subCategories.length)} styles`}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {subCategories.map((subCategory) => {
                  const shades = getTryOnShades(category, subCategory);
                  const name = subCategory.replaceAll('_', ' ').toLowerCase();
                  const previewShades = shades.slice(0, 5);
                  const previewColors = previewShades.map(({ hexColor }) => hexColor);

                  return (
                    <button
                      key={subCategory}
                      type="button"
                      aria-label={`Try on ${name}`}
                      onClick={() => {
                        setSelected({ category, subCategory } as TTryOnSelection);
                        setIsOpen(true);
                      }}
                      className="group border-primary/10 bg-secondary-invert hover:border-blue-crayola-c/50 focus-visible:outline-blue-crayola-c relative flex cursor-pointer flex-col items-center gap-3 overflow-hidden rounded-2xl border px-3 pt-5 pb-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 active:translate-y-0 sm:px-4"
                    >
                      {/* Shade strip along the top edge - a quick preview of the palette. */}
                      {previewShades.length > 0 && (
                        <span
                          aria-hidden
                          className="absolute inset-x-0 top-0 h-1.5"
                          style={{
                            background:
                              previewColors.length > 1
                                ? `linear-gradient(to right, ${previewColors.join(', ')})`
                                : previewColors[0],
                          }}
                        />
                      )}
                      <span className="text-primary text-sm font-semibold capitalize sm:text-base">
                        {name}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="flex -space-x-1.5">
                          {previewShades.map((shade) => (
                            <span
                              key={shade.hexColor}
                              aria-hidden
                              className="border-secondary-invert size-5 rounded-full border-2 shadow-sm transition-transform duration-300 group-hover:scale-110"
                              style={{ backgroundColor: shade.hexColor }}
                            />
                          ))}
                        </span>
                        {shades.length > previewShades.length && (
                          <span className="text-tertiary text-xs">{`+${String(shades.length - previewShades.length)}`}</span>
                        )}
                      </span>
                      <span className="text-blue-crayola-c flex items-center gap-1 text-xs font-medium sm:opacity-0 sm:transition-opacity sm:duration-300 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                        Try now
                        <Icon
                          icon="solar:arrow-right-linear"
                          className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}

        <p className="text-primary/50 flex items-center justify-center gap-1.5 text-center text-xs">
          <Icon icon="solar:shield-check-linear" className="size-4 shrink-0" />
          Runs in your browser - your photo and camera frames aren&apos;t uploaded or stored.
        </p>
      </div>

      <TryOnModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        tryOn={selected ?? undefined}
        shades={selected ? getTryOnShades(selected.category, selected.subCategory) : []}
      />
    </StaticPageLayout>
  );
};

export default Tryons;
