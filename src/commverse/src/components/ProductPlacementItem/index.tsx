import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import FilterDropdown from '../FilterDropdown';
import type { SelectedOption } from '../../types';

export type ProductPlacementOption = {
  id: string;
  text: string;
  image: string;
};

type ProductPlacementClickPayload = {
  slotNumber: number;
  item: ProductPlacementOption | null;
};

const ProductPlacementItem = ({
  onReset,
  onClick,
  data = [],
  value = [],
  title = 'Product Placement',
  placeholderPrefix = 'Select Product',
  className = '',
}: {
  onReset?: () => void;
  onClick?: (payload: ProductPlacementClickPayload) => void;
  data?: ProductPlacementOption[];
  value?: (ProductPlacementOption | null)[];
  title?: string;
  placeholderPrefix?: string;
  className?: string;
}) => {
  const dropdownOptions = useMemo(
    () =>
      data.map((item) => ({
        id: item.id,
        value: item.id,
        label: item.text,
        icon: (
          <img
            src={item.image}
            alt={item.text}
            className="size-4 rounded object-cover"
          />
        ),
      })),
    [data]
  );

  const selectedIds = new Set(
    value.map((item) => item?.id).filter((id): id is string => Boolean(id))
  );

  const handleSelect = (
    slotIndex: number,
    selected: SelectedOption | SelectedOption[] | null
  ) => {
    if (Array.isArray(selected)) return;

    const selectedId = selected?.id ?? null;
    const selectedItem = selectedId
      ? (data.find((item) => item.id === selectedId) ?? null)
      : null;

    onClick?.({
      slotNumber: slotIndex + 1,
      item: selectedItem,
    });
  };

  return (
    <div
      className={`font-metropolis text-neutral-gray-900 flex w-[268px] flex-col gap-3 px-2 ${className}`}
    >
      <div className="flex gap-2 py-1">
        <div className="grow text-[13px] leading-4 font-semibold">{title}</div>
        <Icon
          icon="solar:restart-linear"
          className="text-neutral-gray-800 size-4 cursor-pointer"
          onClick={onReset}
        />
      </div>
      {Array.from({ length: data.length }).map((_, index) => {
        const itemIndex = index + 1;
        const selectedId = value[index]?.id || null;
        const selectedItem =
          data.find((item) => item.id === selectedId) ?? null;
        const slotOptions = dropdownOptions.filter(
          (option) => option.id === selectedId || !selectedIds.has(option.id)
        );

        return (
          <div key={index} className="flex gap-2">
            {selectedItem?.image ? (
              <img
                src={selectedItem.image}
                alt={selectedItem.text}
                className="border-neutral-gray-400 bg-neutral-gray-150 h-10 w-10 min-w-10 rounded-lg border object-cover"
              />
            ) : (
              <div className="border-neutral-gray-400 bg-neutral-gray-150 h-10 w-10 min-w-10 rounded-lg border" />
            )}
            <FilterDropdown
              value={selectedId}
              onChange={(selected) => handleSelect(index, selected)}
              options={slotOptions}
              placeholder={`${placeholderPrefix} ${itemIndex}`}
              menuClassName="max-w-full"
              className="w-full min-w-0 [&>button]:h-10 [&>button]:w-full [&>button]:min-w-0 [&>button]:px-3 [&>button]:text-xs [&>button>span.rounded-full]:hidden"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProductPlacementItem;
