import { Icon } from '@iconify/react';
import IconInput from '../../../components/IconInput';
import { Tab } from '../../../components/Tab';
import useQueryParams from '../../../hooks/useQueryParams';
import StoreTable from '../components/StoreTable';
import { useMemo, useCallback } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import type { StoreFormType } from '..';

const StepTwoMain = () => {
  const { updateParams, queryParams } = useQueryParams();
  const { control } = useFormContext<StoreFormType>();

  const { fields, remove } = useFieldArray({
    control,
    name: 'storeProducts',
  });

  const rawWatchedFields = useWatch({
    control,
    name: 'storeProducts',
  });

  const watchedFields = useMemo(
    () => rawWatchedFields || [],
    [rawWatchedFields]
  );

  const counts = useMemo(() => {
    return {
      all: watchedFields.length,
      inventory: watchedFields.filter((f) => f.source === 'inventory').length,
      spreadsheet: watchedFields.filter((f) => f.source === 'spreadsheet')
        .length,
      shopify: watchedFields.filter((f) => f.source === 'shopify').length,
    };
  }, [watchedFields]);

  const filteredStoreData = useMemo(() => {
    let data = watchedFields;

    if (queryParams.source && queryParams.source !== 'all') {
      data = data.filter((item) => item.source === queryParams.source);
    }

    if (queryParams.q) {
      const search = queryParams.q.toLowerCase();
      data = data.filter((item) =>
        item.productName.toLowerCase().includes(search)
      );
    }

    return data;
  }, [watchedFields, queryParams.source, queryParams.q]);

  const handleDeleteProduct = useCallback(
    (id: string) => {
      const index = fields.findIndex((item) => item._id === id);
      if (index !== -1) {
        remove(index);
      }
    },
    [fields, remove]
  );

  const tabsData = useMemo(
    () => [
      {
        id: 'all',
        title: `All${counts.all ? ` (${counts.all})` : ''}`,
        value: 'all',
      },
      {
        id: 'inventory',
        title: `Inventory${counts.inventory ? ` (${counts.inventory})` : ''}`,
        value: 'inventory',
      },
      {
        id: 'spreadsheet',
        title: `Spreadsheet${counts.spreadsheet ? ` (${counts.spreadsheet})` : ''}`,
        value: 'spreadsheet',
      },
      {
        id: 'shopify',
        title: `Shopify${counts.shopify ? ` (${counts.shopify})` : ''}`,
        value: 'shopify',
      },
    ],
    [counts]
  );

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="flex h-10 w-full justify-between">
        <Tab
          defaultActiveId={queryParams.source || 'all'}
          data={tabsData}
          variant="static"
          className="mr-2 font-normal!"
          onClick={(item) => {
            if (item.value === 'all') {
              updateParams({ remove: ['source'] });
            } else {
              updateParams({ set: { source: item.value } });
            }
          }}
        />
        <IconInput
          placeholder="Search products"
          containerClassName="[&>div>input]:pl-10 [&>div>input]:py-2.5!"
          defaultValue={queryParams.q}
          leftAddon={<Icon icon="solar:magnifer-linear" className="size-5!" />}
          onChange={(value) => {
            if (value === '') {
              updateParams({ remove: ['q'] });
            } else {
              updateParams({ set: { q: value } });
            }
          }}
        />
      </div>

      <StoreTable
        data={filteredStoreData}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
};

export default StepTwoMain;
