import { Icon } from '@iconify/react';

import { formatINRCurrency } from '@/utils/common.util';
import type { IProductFilters } from '@/utils/product-filters.util';

interface IActiveFilters {
  filters: IProductFilters;
  onChange: (change: Partial<Omit<IProductFilters, 'search'>>) => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

interface IChip {
  key: string;
  label: string;
  remove: () => void;
}

const describePrice = ({ minPrice, maxPrice }: Pick<IProductFilters, 'minPrice' | 'maxPrice'>) => {
  if (minPrice !== undefined && maxPrice !== undefined) {
    return `${formatINRCurrency(minPrice)} – ${formatINRCurrency(maxPrice)}`;
  }

  return minPrice === undefined
    ? `Up to ${formatINRCurrency(maxPrice ?? 0)}`
    : `From ${formatINRCurrency(minPrice)}`;
};

/** What is filtered, as chips that each take their filter away, and "Clear all" when there is more than one. */
const ActiveFilters = ({ filters, onChange, onClearSearch, onClearAll }: IActiveFilters) => {
  const chips: IChip[] = [];

  if (filters.search) {
    chips.push({ key: 'search', label: `Search: ${filters.search}`, remove: onClearSearch });
  }

  for (const brand of filters.brands) {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      remove: () => {
        onChange({ brands: filters.brands.filter((item) => item !== brand) });
      },
    });
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    chips.push({
      key: 'price',
      label: describePrice(filters),
      remove: () => {
        onChange({ minPrice: undefined, maxPrice: undefined });
      },
    });
  }

  if (filters.minRating !== undefined) {
    chips.push({
      key: 'rating',
      label: `${String(filters.minRating)}★ & up`,
      remove: () => {
        onChange({ minRating: undefined });
      },
    });
  }

  if (filters.minDiscount !== undefined) {
    chips.push({
      key: 'discount',
      label: `${String(filters.minDiscount)}% off & above`,
      remove: () => {
        onChange({ minDiscount: undefined });
      },
    });
  }

  if (filters.inStock) {
    chips.push({
      key: 'in-stock',
      label: 'In stock',
      remove: () => {
        onChange({ inStock: false });
      },
    });
  }

  if (filters.tryOn) {
    chips.push({
      key: 'try-on',
      label: 'Try on available',
      remove: () => {
        onChange({ tryOn: false });
      },
    });
  }

  if (chips.length === 0) return null;

  return (
    <ul aria-label="Filters in use" className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            aria-label={`Remove filter: ${chip.label}`}
            className="bg-primary/5 border-primary/10 hover:border-primary/30 focus-visible:outline-blue-crayola-c flex cursor-pointer items-center gap-1.5 rounded-full border py-1 pr-2 pl-3 text-xs font-medium outline-offset-2 transition-colors duration-200"
            onClick={chip.remove}
          >
            {chip.label}
            <Icon icon="lucide:x" className="size-3.5" aria-hidden="true" />
          </button>
        </li>
      ))}
      {chips.length > 1 && (
        <li>
          <button
            type="button"
            className="text-blue-crayola-c focus-visible:outline-blue-crayola-c cursor-pointer rounded-md px-1 text-xs font-semibold outline-offset-2 hover:underline"
            onClick={onClearAll}
          >
            Clear all
          </button>
        </li>
      )}
    </ul>
  );
};

export default ActiveFilters;
