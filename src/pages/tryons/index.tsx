import { TRY_ON_MAP } from '@beautinique/frontend-constants';
import type { TTryOnSelection } from '@beautinique/frontend-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';

import { StaticPageHeader, StaticPageLayout } from '@/components/layout/static-page';
import TryOnModal from '@/components/layout/tryons';
import { getTryOnShades, TRYON_CATEGORY_OPTIONS } from '@/constants/tryon-constants';

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

      <div className="flex flex-col gap-10">
        {TRYON_CATEGORY_OPTIONS.map(({ category, icon, title, description }) => (
          <section key={category} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="bg-accent-duo flex size-10 shrink-0 items-center justify-center rounded-lg">
                <Icon icon={icon} className="size-5 text-white" />
              </span>
              <div>
                <p className="text-primary text-base font-semibold sm:text-lg">{title}</p>
                <p className="text-tertiary text-xs sm:text-sm">{description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {TRY_ON_MAP[category].map((subCategory) => {
                const shades = getTryOnShades(category, subCategory);
                return (
                  <button
                    key={subCategory}
                    type="button"
                    onClick={() => {
                      setSelected({ category, subCategory } as TTryOnSelection);
                      setIsOpen(true);
                    }}
                    className="border-primary/10 bg-secondary-invert hover:border-primary/30 flex cursor-pointer flex-col items-center gap-3 rounded-lg border p-4 text-center transition-colors duration-300"
                  >
                    <span className="text-primary text-sm font-medium capitalize">
                      {subCategory.toLowerCase()}
                    </span>
                    <span className="flex -space-x-1.5">
                      {shades.slice(0, 5).map((shade) => (
                        <span
                          key={shade.hexColor}
                          className="border-secondary-invert size-4 rounded-full border-2"
                          style={{ backgroundColor: shade.hexColor }}
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
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
