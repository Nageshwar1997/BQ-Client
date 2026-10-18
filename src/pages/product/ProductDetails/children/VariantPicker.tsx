import { useId } from 'react';

import type { IStorefrontVariant } from '@/types/api.type';

interface IVariantPicker {
  variants: IStorefrontVariant[];
  /** The `sku` of the variant that is chosen. */
  selectedSku?: string;
  onSelect: (sku: string) => void;
}

/**
 * The variants of a product to choose from: round swatches for colours, boxes for the others. It is one group of radio
 * buttons - the arrow keys move the choice, Tab leaves the group - named by what the variants are ("Shade" when they
 * are all colours, "Option" otherwise) with the one that is chosen beside it. A variant that is out of stock can still
 * be chosen (to see it, and its stock said), but is drawn struck through and says so.
 */
const VariantPicker = ({ variants, selectedSku, onSelect }: IVariantPicker) => {
  const name = useId();
  const group = variants.every((variant) => variant.type === 'Color') ? 'Shade' : 'Option';
  const selected = variants.find((variant) => variant.sku === selectedSku);

  return (
    <fieldset>
      <legend className="mb-3 text-sm">
        <span className="text-silver-jet">{group}: </span>
        <span className="font-semibold">{selected?.label}</span>
      </legend>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = variant.sku === selectedSku;
          const ring = isSelected ? 'border-primary' : 'border-primary/20 hover:border-primary/50';

          return (
            <label
              key={variant.sku}
              title={variant.inStock ? variant.label : `${variant.label} - out of stock`}
              className="has-[:focus-visible]:outline-blue-crayola-c relative cursor-pointer rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
            >
              <input
                type="radio"
                name={name}
                value={variant.sku}
                checked={isSelected}
                className="sr-only"
                onChange={() => {
                  onSelect(variant.sku);
                }}
              />

              {variant.type === 'Color' ? (
                <span
                  className={`flex size-11 items-center justify-center rounded-full border-2 transition-colors duration-200 ${ring} ${
                    variant.inStock ? '' : 'opacity-40'
                  }`}
                >
                  <span
                    className="border-primary/10 size-8 rounded-full border"
                    style={{ backgroundColor: variant.value }}
                  />
                </span>
              ) : (
                <span
                  className={`flex min-h-11 min-w-11 items-center justify-center rounded-xl border-2 px-3 text-sm font-medium transition-colors duration-200 ${ring} ${
                    variant.inStock ? '' : 'opacity-40'
                  }`}
                >
                  {variant.value}
                </span>
              )}

              {!variant.inStock && (
                <span
                  aria-hidden="true"
                  className="bg-primary/70 pointer-events-none absolute inset-x-1 top-1/2 h-px -rotate-45"
                />
              )}

              <span className="sr-only">
                {variant.label}
                {variant.inStock ? '' : ', out of stock'}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
};

export default VariantPicker;
