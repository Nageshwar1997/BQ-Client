import { Checkbox, type IRadioOption, Radio } from '@beautinique/frontend-components';
import { Icon } from '@iconify/react';
import { type ReactNode, useState } from 'react';

import {
  BRANDS_SHOWN_FOLDED,
  DISCOUNT_FILTER_OPTIONS,
  RATING_FILTER_OPTIONS,
} from '@/constants/product-listing.constants';
import type { IStorefrontFilters } from '@/types/api.type';
import type { IProductFilters } from '@/utils/product-filters.util';

import FilterSection from './FilterSection';
import PriceRangeFilter from './PriceRangeFilter';

interface IProductFiltersPanel {
  filters: IProductFilters;
  /** What the matching products offer (brands with their counts, the price range). */
  facets?: IStorefrontFilters;
  onChange: (change: Partial<Omit<IProductFilters, 'search'>>) => void;
  /** Goes above the filters (the categories). */
  header?: ReactNode;
}

const ROW =
  'flex cursor-pointer items-center gap-2.5 rounded-md py-1 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-crayola-c';

const CONTROL = 'accent-blue-crayola-c size-4 shrink-0 cursor-pointer';

const CheckRow = ({
  label,
  checked,
  count,
  onChange,
}: {
  label: ReactNode;
  checked: boolean;
  count?: number;
  onChange: (checked: boolean) => void;
}) => (
  <label className={ROW}>
    <input
      type="checkbox"
      checked={checked}
      className={CONTROL}
      onChange={(event) => {
        onChange(event.target.checked);
      }}
    />
    <span className="flex-1 truncate">{label}</span>
    {count !== undefined && <span className="text-silver-jet text-xs">{count}</span>}
  </label>
);

/** "No filter" in the bars below (a `Radio` has to have a chosen value, and a filter that is off is one of its options). */
const ANY = 'any';

const RATING_OPTIONS: IRadioOption[] = [
  { label: 'Any', value: ANY },
  ...RATING_FILTER_OPTIONS.map((rating) => ({
    value: String(rating),
    label: (
      <span className="inline-flex items-center justify-center gap-0.5">
        <Icon icon="solar:star-bold" className="text-primary-yellow size-3.5" aria-hidden="true" />
        {rating}+<span className="sr-only"> stars and up</span>
      </span>
    ),
  })),
];

const DISCOUNT_OPTIONS: IRadioOption[] = [
  { label: 'Any', value: ANY },
  ...DISCOUNT_FILTER_OPTIONS.map((discount) => ({
    value: String(discount),
    label: (
      <>
        {discount}%+<span className="sr-only"> off and above</span>
      </>
    ),
  })),
];

/**
 * The filters of the product listing: brand, price, rating, discount and availability. They are
 * controlled by the URL (`useProductFilters`), so this holds no state of what is chosen - only whether the
 * list of brands is folded.
 */
const ProductFiltersPanel = ({ filters, facets, onChange, header }: IProductFiltersPanel) => {
  const [showAllBrands, setShowAllBrands] = useState(false);

  // a chosen brand stays in the list (and can be unchosen) even when the other filters leave it with no product
  const brands = [
    ...(facets?.brands ?? []),
    ...filters.brands
      .filter((brand) => !facets?.brands.some((facet) => facet.name === brand))
      .map((name) => ({ name, count: 0 })),
  ];
  const shownBrands = showAllBrands ? brands : brands.slice(0, BRANDS_SHOWN_FOLDED);

  const toggleBrand = (name: string, on: boolean) => {
    onChange({
      brands: on ? [...filters.brands, name] : filters.brands.filter((brand) => brand !== name),
    });
  };

  return (
    <div>
      {header && <div className="border-primary/10 mb-4 border-b pb-4">{header}</div>}

      {brands.length > 0 && (
        <FilterSection title="Brand">
          <fieldset>
            <legend className="sr-only">Brand</legend>
            <ul>
              {shownBrands.map((brand) => (
                <li key={brand.name}>
                  <CheckRow
                    label={brand.name}
                    count={brand.count}
                    checked={filters.brands.includes(brand.name)}
                    onChange={(on) => {
                      toggleBrand(brand.name, on);
                    }}
                  />
                </li>
              ))}
            </ul>
            {brands.length > BRANDS_SHOWN_FOLDED && (
              <button
                type="button"
                aria-expanded={showAllBrands}
                className="text-blue-crayola-c focus-visible:outline-blue-crayola-c mt-1 cursor-pointer rounded-md text-xs font-semibold outline-offset-2 hover:underline"
                onClick={() => {
                  setShowAllBrands((previous) => !previous);
                }}
              >
                {showAllBrands
                  ? 'Show less'
                  : `Show ${String(brands.length - BRANDS_SHOWN_FOLDED)} more`}
              </button>
            )}
          </fieldset>
        </FilterSection>
      )}

      <FilterSection title="Price">
        <PriceRangeFilter
          bounds={facets?.price ?? null}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onChange={onChange}
        />
      </FilterSection>

      <FilterSection title="Rating">
        <Radio
          label="Minimum rating"
          options={RATING_OPTIONS}
          value={filters.minRating === undefined ? ANY : String(filters.minRating)}
          onChange={(value) => {
            onChange({ minRating: value === ANY ? undefined : Number(value) });
          }}
        />
      </FilterSection>

      <FilterSection title="Discount">
        <Radio
          label="Minimum discount"
          options={DISCOUNT_OPTIONS}
          value={filters.minDiscount === undefined ? ANY : String(filters.minDiscount)}
          onChange={(value) => {
            onChange({ minDiscount: value === ANY ? undefined : Number(value) });
          }}
        />
      </FilterSection>

      <FilterSection title="Availability">
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Availability</legend>
          <Checkbox
            content="In stock only"
            checkboxProps={{
              checked: filters.inStock,
              onChange: (event) => {
                onChange({ inStock: event.target.checked });
              },
            }}
          />
          <Checkbox
            content="Try on available"
            checkboxProps={{
              checked: filters.tryOn,
              onChange: (event) => {
                onChange({ tryOn: event.target.checked });
              },
            }}
          />
        </fieldset>
      </FilterSection>
    </div>
  );
};

export default ProductFiltersPanel;
