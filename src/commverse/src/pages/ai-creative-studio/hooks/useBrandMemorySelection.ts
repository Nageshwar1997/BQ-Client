import { useEffect, useMemo, useState } from 'react';

import type { SelectedOption } from '../../../types';
import { useGetBrand } from '../../../services/auth-service';

export function useBrandMemorySelection() {
  const getBrandQuery = useGetBrand();
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const brandOptions = useMemo<SelectedOption[]>(() => {
    const brand = getBrandQuery.data?.data;
    const brandId =
      typeof brand?._id === 'string'
        ? brand._id
        : typeof brand?.id === 'string'
          ? brand.id
          : '';
    const brandName =
      typeof brand?.profile?.name === 'string' && brand.profile.name.trim()
        ? brand.profile.name.trim()
        : 'My Brand';

    return brandId
      ? [
          {
            id: brandId,
            value: brandId,
            label: brandName,
          },
        ]
      : [];
  }, [getBrandQuery.data]);

  useEffect(() => {
    if (brandOptions.length === 0) {
      setSelectedBrandId(null);
      return;
    }

    setSelectedBrandId((prev) =>
      prev && brandOptions.some((option) => option.id === prev)
        ? prev
        : (brandOptions[0]?.id ?? null)
    );
  }, [brandOptions]);

  return {
    brandOptions,
    selectedBrandId,
    setSelectedBrandId,
    isBrandMemoryLoading: getBrandQuery.isLoading,
  };
}
