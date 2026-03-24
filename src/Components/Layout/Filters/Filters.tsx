import { Fragment, useEffect, useRef, useState } from 'react';
import { Hook } from '@/Hooks';
import { CheckedIcon, PercentIcon, RupeesIcon } from '@/Icons';
import { CategoriesFilter } from './CategoriesFilter';
import { Dropdown } from '../Dropdown';
import { Checkbox, Input, Range } from '@/Components/Ui/Input';

interface FiltersProps {
  className?: string;
  needCategoriesFilters?: boolean;
}
type TPriceRangeKeys = 'min' | 'max';
type TRange = Record<TPriceRangeKeys | 'discount', string>;

const MAX_PRICE = 1500;
const INITIAL_RANGES: TRange = { min: '0', max: `${MAX_PRICE}`, discount: '0' };

export const Filters = ({ className = '', needCategoriesFilters = false }: FiltersProps) => {
  const { queryParams, setParams, removeParams } = Hook.QueryParams();
  const [ranges, setRanges] = useState<TRange>(INITIAL_RANGES);

  useEffect(() => {
    setRanges((prev) => ({
      min: queryParams.min ?? prev.min,
      max: queryParams.max ?? prev.max,
      discount: queryParams.discount ?? prev.discount,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce price filter
  const debouncePriceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMinPrice = useRef(ranges.min);
  const prevMaxPrice = useRef(ranges.max);
  const maxPriceRangeChangeRef = useRef(false);

  useEffect(() => {
    if (debouncePriceRef.current) clearTimeout(debouncePriceRef.current);

    const parsedMin = Number(ranges.min);
    const parsedMax = Number(ranges.max);

    if (!isNaN(parsedMax) && parsedMax !== MAX_PRICE) {
      maxPriceRangeChangeRef.current = true;
    }

    debouncePriceRef.current = setTimeout(() => {
      const hasMinChanged = prevMinPrice.current !== ranges.min;
      const hasMaxChanged = prevMaxPrice.current !== ranges.max;

      if (hasMinChanged) prevMinPrice.current = ranges.min;
      if (hasMaxChanged) prevMaxPrice.current = ranges.max;

      // Min Logic
      if (ranges.min === '' || isNaN(parsedMin) || parsedMin === 0) {
        removeParams('min');
      } else {
        setParams({ min: String(parsedMin) });
      }

      // Max Logic
      if (
        ranges.max === '' ||
        isNaN(parsedMax) ||
        (parsedMax === MAX_PRICE && !maxPriceRangeChangeRef.current)
      ) {
        removeParams('max');
      } else if (maxPriceRangeChangeRef.current) {
        setParams({ max: String(parsedMax) });
      }
    }, 600);

    return () => {
      if (debouncePriceRef.current) clearTimeout(debouncePriceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranges.min, ranges.max]);

  // Debounce minDiscount
  const debounceDiscountRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevMinDiscount = useRef(ranges.discount);

  useEffect(() => {
    if (debounceDiscountRef.current) clearTimeout(debounceDiscountRef.current);

    const parsedMin = Number(ranges.discount);

    debounceDiscountRef.current = setTimeout(() => {
      const hasMinChanged = prevMinDiscount.current !== ranges.discount;
      if (hasMinChanged) prevMinDiscount.current = ranges.discount;

      if (ranges.discount === '' || isNaN(parsedMin) || parsedMin === 0) {
        removeParams('discount');
      } else {
        setParams({ discount: String(parsedMin) });
      }
    }, 600);

    return () => {
      if (debounceDiscountRef.current) clearTimeout(debounceDiscountRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ranges.discount]);

  return (
    <section className={`bg-primary-invert h-full select-none ${className}`}>
      <div className={`flex w-full flex-col gap-2 px-5 py-4`}>
        {/* Categories Filter */}
        {needCategoriesFilters && <CategoriesFilter />}
        {/* Availability Filter */}
        <Dropdown
          title="Availability"
          icons={{
            right: (
              <div className="flex items-center">
                (<CheckedIcon className="stroke-primary h-4 w-4" />)
              </div>
            ),
          }}
          className="border-b-primary/50 border-b [&>button]:px-0 [&>button]:py-3"
        >
          <Checkbox
            containerClassName="-mt-2 px-1!"
            labelClassName="bg-primary!"
            className="h-5! w-10! after:h-3! after:w-3!"
            checkboxProps={{
              name: 'inStock',
              checked: queryParams.inStock === 'true',
              onChange: (e) => {
                if (e.target.checked) {
                  setParams({ inStock: 'true' });
                } else {
                  removeParams('inStock');
                }
              },
            }}
            rightText="In stock only"
          />
        </Dropdown>
        {/* Price Filter */}
        <Dropdown
          title="Price Range"
          icons={{
            right: (
              <div className="flex items-center">
                (<RupeesIcon className="stroke-primary size-4" />)
              </div>
            ),
          }}
          className="border-b-primary/50 border-b [&>button]:px-0 [&>button]:py-3"
        >
          <div className="-mt-2 flex flex-col gap-2 px-1!">
            <div className="flex h-9 justify-between gap-2">
              {(['min', 'max'] as TPriceRangeKeys[]).map((key, index) => {
                const isMin = key === 'min';
                const minRange = Number(ranges.min);
                const maxRange = Number(ranges.max);
                return (
                  <Fragment key={index}>
                    <Input
                      containerClassName="h-full [&>div]:h-full"
                      className="border-primary/30 [&_p]:border-r-primary/30 [&_p]:bg-primary/10 [&_p]:text-primary rounded-sm! border [&_p]:w-10 [&_p]:border-r [&_p]:text-xs"
                      icons={{ left: { text: key } }}
                      inputProps={{
                        name: key,
                        type: 'number',
                        min: isMin ? 0 : minRange + 1, // Ensure min value is not less than minRange
                        max: isMin ? maxRange - 1 : MAX_PRICE, // Ensure max value is not greater than maxRange
                        value: ranges[key],
                        onChange: (e) => {
                          const value = e.target.value;
                          if (value === '') return;
                          const numVal = Number(value);
                          if ((isMin && numVal < maxRange) || (!isMin && numVal > minRange)) {
                            setRanges((prev) => ({ ...prev, [key]: value }));
                          }
                        },
                      }}
                    />
                    {key === 'min' && <div className="bg-primary/50 h-full w-px" />}
                  </Fragment>
                );
              })}
            </div>
            {/* Dual Range Slider */}
            <Range
              mode="dual"
              min={0}
              max={MAX_PRICE}
              step={10}
              value={{
                dual: { min: Number(ranges.min) || 0, max: Number(ranges.max) || MAX_PRICE },
              }}
              onChange={{
                dual: ({ min, max }) => {
                  const minValue = Math.min(min, Number(ranges.max) - 1);
                  const maxValue = Math.max(max, Number(ranges.min) + 1);
                  setRanges({ ...ranges, min: `${minValue}`, max: `${maxValue}` });
                },
              }}
            />
          </div>
        </Dropdown>
        {/* Discount Filter */}
        <Dropdown
          title="Discount Range"
          icons={{
            right: (
              <div className="flex items-center">
                (<PercentIcon className="stroke-primary size-4" />)
              </div>
            ),
          }}
          className="border-b-primary/50 border-b [&>button]:px-0 [&>button]:py-3"
        >
          <div className="-mt-2 flex flex-col gap-2 px-1!">
            <Input
              containerClassName="h-9 [&>div]:h-full"
              className="border-primary/30 [&_p]:border-r-primary/30 [&_p]:bg-primary/10 [&_p]:text-primary rounded-sm! border [&_p]:w-14 [&_p]:border-r [&_p]:text-xs [&_p]:text-nowrap"
              icons={{ left: { text: '0 - 100' } }}
              inputProps={{
                name: 'discount',
                type: 'number',
                min: 0,
                max: 100,
                value: ranges.discount,
                onChange: (e) => {
                  const value = e.target.value;
                  if (value === '' || Number(value) <= 100) {
                    setRanges((prev) => ({ ...prev, discount: value }));
                  } else if (Number(value) > 100) {
                    setRanges((prev) => ({ ...prev, discount: '100' }));
                  }
                },
              }}
            />
            {/* Single Range Slider for minDiscount only */}
            <Range
              mode="single"
              className="mt-2"
              min={0}
              max={100}
              step={5}
              value={{ single: Number(ranges.discount || 0) }}
              onChange={{
                single: (v) => {
                  const value = Math.min(Number(v), 100);
                  setRanges({ ...ranges, discount: `${value}` });
                },
              }}
            />
          </div>
        </Dropdown>
      </div>
    </section>
  );
};
