import { useState } from 'react';

import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/inputs/Input';
import { QUERY_PARAMS_KEY_MAP } from '@/constants/common.constants';
import useDebounce from '@/hooks/useDebounce';
import useIsSmallScreen from '@/hooks/useIsSmallScreen';
import useQueryParams from '@/hooks/useQueryParams';
import type { TCategory } from '@/types/api.type';
import type { IClassName } from '@/types/component.type';

const q_cat_keys = QUERY_PARAMS_KEY_MAP.category;

const QUERY_CLEAR_MAP = {
  [q_cat_keys.level.l1.search]: [q_cat_keys.level.l2.search, q_cat_keys.level.l3.search],
  [q_cat_keys.level.l2.search]: [q_cat_keys.level.l3.search],
  [q_cat_keys.level.l3.search]: [],
};

const CategorySearchInput = ({ level }: Pick<TCategory, 'level'>) => {
  const { queryParams, setParams } = useQueryParams();
  const isSmallScreen = useIsSmallScreen(1024);

  const queryKey =
    `search_${String(level)}` as (typeof q_cat_keys.level)[keyof typeof q_cat_keys.level]['search'];
  const [searchQuery, setSearchQuery] = useState(queryParams[queryKey] ?? '');
  const [prevQueryValue, setPrevQueryValue] = useState(queryParams[queryKey]);

  const handleSearch = useDebounce({
    callback: (value: string) => {
      const trimmedValue = value.trim();
      const keysToClear = QUERY_CLEAR_MAP[queryKey];

      setParams((prevParams) => {
        const keysToRemove = new Set<string>([queryKey, ...keysToClear]);

        const updatedParams = Object.fromEntries(
          Object.entries(prevParams).filter(([key]) => !keysToRemove.has(key)),
        );

        // new value set
        if (trimmedValue) updatedParams[queryKey] = trimmedValue;

        return updatedParams;
      });
    },
    delay: 600,
  });

  const handleChange = (value: string) => {
    const trimmedValue = value.trimStart();
    // instant ui update
    setSearchQuery(trimmedValue);
    // debounced search action
    handleSearch(trimmedValue);
  };

  if (queryParams[queryKey] !== prevQueryValue) {
    setPrevQueryValue(queryParams[queryKey]);

    if (!queryParams[queryKey] && searchQuery) {
      setSearchQuery('');
    }
  }

  return (
    <Input
      needRef={!isSmallScreen}
      inputProps={{
        name: queryKey,
        placeholder: `Search level ${String(level)} categories here...`,
        value: searchQuery,
        onChange: ({ target: { value } }) => {
          handleChange(value);
        },
      }}
      containerClassName="max-w-sm"
      className="bg-silver/10!"
      icons={{
        right: { icon: 'solar:magnifer-linear', className: 'text-primary/50 size-4 md:size-5' },
      }}
    />
  );
};

const CategoryTableTopInfo = ({
  name,
  badgeText,
  level,
  className = '',
}: IClassName & Pick<TCategory, 'level' | 'name'> & { badgeText: string }) => {
  return (
    <div className={`space-y-3 p-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {name && (
          <div className="text-left">
            <p className="text-primary text-sm font-semibold">{name}</p>
            <p className="text-primary/50 text-xs">Level {level} categories</p>
          </div>
        )}
        <Badge content={badgeText} />
      </div>
      <CategorySearchInput level={level} />
    </div>
  );
};

export default CategoryTableTopInfo;
