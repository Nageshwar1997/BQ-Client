import { Input } from '@beautinique/frontend-components';
import { useState } from 'react';

import { formatINRCurrency } from '@/utils/common.util';

interface IPriceRange {
  minPrice?: number;
  maxPrice?: number;
}

interface IPriceRangeFilter extends IPriceRange {
  /** What the products that match the other filters cost (the cheapest and the dearest). */
  bounds: { min: number; max: number } | null;
  onChange: (range: IPriceRange) => void;
}

// Two range inputs lie over each other on one track: the track and the inputs themselves let the pointer through,
// only the thumbs are hit. The thumbs are 20px (a finger can take them) with the focus ring of the app.
const THUMB =
  'pointer-events-none absolute inset-0 m-0 size-full appearance-none bg-transparent outline-none ' +
  '[&::-webkit-slider-runnable-track]:bg-transparent [&::-moz-range-track]:bg-transparent ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-crayola-c [&::-webkit-slider-thumb]:bg-primary-invert [&::-webkit-slider-thumb]:shadow-md ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:cursor-grab [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-blue-crayola-c [&::-moz-range-thumb]:bg-primary-invert ' +
  'focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-blue-crayola-c/50 focus-visible:[&::-moz-range-thumb]:ring-2';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * A price range: two thumbs on one track and two number fields. What is chosen is sent when the thumb is let
 * go or the field is left (not on every step of a drag, which would ask the service for a list per pixel).
 * A range that is all of the prices is no filter at all.
 */
const PriceRangeFilter = ({ bounds, minPrice, maxPrice, onChange }: IPriceRangeFilter) => {
  const floor = bounds ? Math.floor(bounds.min) : 0;
  const ceiling = bounds ? Math.ceil(bounds.max) : 0;

  const fromProps = {
    low: clamp(minPrice ?? floor, floor, ceiling),
    high: clamp(maxPrice ?? ceiling, floor, ceiling),
  };

  const [draft, setDraft] = useState(fromProps);
  const propsKey = `${String(fromProps.low)}:${String(fromProps.high)}:${String(floor)}:${String(ceiling)}`;
  const [seenKey, setSeenKey] = useState(propsKey);

  // The URL (or what the products cost) changed from outside - Clear all, another filter, Back: show it.
  if (propsKey !== seenKey) {
    setSeenKey(propsKey);
    setDraft(fromProps);
  }

  if (!bounds) {
    return <p className="text-silver-jet text-xs">No prices to choose from.</p>;
  }

  if (floor === ceiling) {
    return (
      <p className="text-silver-jet text-xs">
        Every product here costs {formatINRCurrency(floor)}.
      </p>
    );
  }

  const span = ceiling - floor;
  const left = ((draft.low - floor) / span) * 100;
  const right = ((draft.high - floor) / span) * 100;

  const commit = (next: { low: number; high: number }) => {
    const low = clamp(Math.min(next.low, next.high), floor, ceiling);
    const high = clamp(Math.max(next.low, next.high), floor, ceiling);

    setDraft({ low, high });
    onChange({
      minPrice: low > floor ? low : undefined,
      maxPrice: high < ceiling ? high : undefined,
    });
  };

  const moveLow = (value: number) => {
    setDraft((previous) => ({ ...previous, low: Math.min(value, previous.high) }));
  };

  const moveHigh = (value: number) => {
    setDraft((previous) => ({ ...previous, high: Math.max(value, previous.low) }));
  };

  return (
    <div role="group" aria-label="Price range" className="flex flex-col gap-4">
      <div className="relative mx-2.5 h-5">
        <div className="bg-primary/15 absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full" />
        <div
          className="bg-accent-duo absolute top-1/2 h-1 -translate-y-1/2 rounded-full"
          style={{ left: `${String(left)}%`, right: `${String(100 - right)}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          aria-valuetext={formatINRCurrency(draft.low)}
          min={floor}
          max={ceiling}
          step={1}
          value={draft.low}
          // the lower thumb has to stay reachable when both are at the top
          className={`${THUMB} ${draft.low > ceiling - span / 10 ? 'z-30' : 'z-20'}`}
          onChange={(event) => {
            moveLow(Number(event.target.value));
          }}
          onPointerUp={() => {
            commit(draft);
          }}
          onKeyUp={() => {
            commit(draft);
          }}
          onBlur={() => {
            commit(draft);
          }}
        />
        <input
          type="range"
          aria-label="Maximum price"
          aria-valuetext={formatINRCurrency(draft.high)}
          min={floor}
          max={ceiling}
          step={1}
          value={draft.high}
          className={`${THUMB} z-20`}
          onChange={(event) => {
            moveHigh(Number(event.target.value));
          }}
          onPointerUp={() => {
            commit(draft);
          }}
          onKeyUp={() => {
            commit(draft);
          }}
          onBlur={() => {
            commit(draft);
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <Input
          label="Min (₹)"
          containerClassName="flex-1"
          inputProps={{
            type: 'number',
            inputMode: 'numeric',
            min: floor,
            max: ceiling,
            value: draft.low,
            onChange: (event) => {
              if (event.target.value !== '') moveLow(Number(event.target.value));
            },
            onBlur: () => {
              commit(draft);
            },
            onKeyDown: (event) => {
              if (event.key === 'Enter') commit(draft);
            },
          }}
        />
        <span aria-hidden="true" className="text-silver-jet">
          –
        </span>
        <Input
          label="Max (₹)"
          containerClassName="flex-1"
          inputProps={{
            type: 'number',
            inputMode: 'numeric',
            min: floor,
            max: ceiling,
            value: draft.high,
            onChange: (event) => {
              if (event.target.value !== '') moveHigh(Number(event.target.value));
            },
            onBlur: () => {
              commit(draft);
            },
            onKeyDown: (event) => {
              if (event.key === 'Enter') commit(draft);
            },
          }}
        />
      </div>
    </div>
  );
};

export default PriceRangeFilter;
