import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import Chip from '../../../components/Chip';
import { MoreOptionsMenu } from '../../../components/MoreOptionsMenu';
import EmptyState from '../../../components/EmptyState';
import Checkbox from '../../../components/Checkbox';

interface StoreCMSItem {
  _id: string;

  // media
  media?: {
    model?: {
      assetId?:
        | string
        | { _id?: string; id?: string; assetId?: string; $oid?: string };
      title?: string;
      modelUrl?: string;
      spriteUrl?: string;
      thumbnailUrl?: string;
      size?: number | string;
      fileSize?: number | string;
    };

    thumbnail?: {
      key?: string;
      filename?: string;
      url?: string;
      size?: number | string;
    };
  };

  productName?: string;
  source?: 'shopify' | 'inventory' | 'spreadsheet' | string;
  price?: {
    amount?: number;
    currency?: string;
  };

  createdAt?: string;
  updatedAt?: string;
}

type TableRow = StoreCMSItem;

const col = createColumnHelper<TableRow>();
const NA_LABEL = 'N/A';

const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
};

const SortIcon = ({ dir }: { dir: 'asc' | 'desc' | false }) => {
  return (
    <span className="text-neutral-gray-700 ml-1 inline-flex flex-col leading-none">
      {dir === 'asc' && (
        <Icon icon="solar:arrow-up-linear" className="size-4" />
      )}
      {dir === false && <Icon icon="lucide:minus" className="size-4" />}
      {dir === 'desc' && (
        <Icon icon="solar:arrow-down-linear" className="size-4" />
      )}
    </span>
  );
};

const getStorePreviewImage = (
  type: 'model' | 'thumbnail',
  media?: {
    model?: {
      thumbnailUrl?: string;
      spriteUrl?: string;
    };
    thumbnail?: {
      url?: string;
    };
  },
  fallback = ''
): string => {
  if (!media) return fallback;

  if (type === 'model') {
    return media.model?.thumbnailUrl || media.model?.spriteUrl || fallback;
  }

  if (type === 'thumbnail') {
    return media.thumbnail?.url || fallback;
  }

  return fallback;
};

const StoreTable = ({
  data,
  lastRowRef,
  onDeleteProduct,
}: {
  data: StoreCMSItem[];
  lastRowRef?: (node: HTMLTableRowElement | null) => void;
  onDeleteProduct?: (id: string) => Promise<unknown> | unknown;
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const allRowsSelected =
    data.length > 0 && data.every((row) => rowSelection[row._id]);

  const someRowsSelected =
    data.some((row) => rowSelection[row._id]) && !allRowsSelected;

  const columns = useMemo(
    () => [
      // checkbox
      col.display({
        id: 'select',
        header: () => {
          return (
            <div
              className="flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                id="select-all"
                checked={allRowsSelected}
                onChange={(checked) => {
                  const newSelection: Record<string, boolean> = {};

                  if (checked) {
                    data.forEach((row) => {
                      newSelection[row._id] = true;
                    });
                  }

                  setRowSelection(newSelection);
                }}
                ref={(el) => {
                  if (el) el.indeterminate = someRowsSelected;
                }}
                className="justify-center [&_div]:size-4!"
              />
            </div>
          );
        },

        cell: ({ row }) => {
          return (
            <div
              className="flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                id={`select-${row.original._id}`}
                checked={!!rowSelection[row.original._id]}
                onChange={(checked) => {
                  setRowSelection((prev) => {
                    const updated = { ...prev };

                    if (checked) {
                      updated[row.original._id] = true;
                    } else {
                      delete updated[row.original._id];
                    }

                    return updated;
                  });
                }}
                className="justify-center [&_div]:size-4!"
              />
            </div>
          );
        },

        enableSorting: false,
        size: 40,
      }),

      // 3d model
      col.display({
        id: 'model',
        header: '3D Model',
        cell: ({ row }) => {
          const modelImage = getStorePreviewImage('model', row.original.media);

          if (isEmptyValue(modelImage)) {
            return <span className="text-neutral-gray-700">{NA_LABEL}</span>;
          }

          return (
            <img
              src={modelImage}
              alt="model"
              className="mx-auto h-16 w-16 rounded object-cover"
            />
          );
        },
      }),

      // thumbnail
      col.display({
        id: 'thumbnail',
        header: 'Thumbnail',
        cell: ({ row }) => {
          const thumbnailImage = getStorePreviewImage(
            'thumbnail',
            row.original.media
          );

          if (isEmptyValue(thumbnailImage)) {
            return <span className="text-neutral-gray-700">{NA_LABEL}</span>;
          }

          return (
            <img
              src={thumbnailImage}
              alt="thumbnail"
              className="mx-auto h-16 w-16 rounded object-cover"
            />
          );
        },
      }),

      // product name
      col.accessor((row) => row.productName ?? '', {
        id: 'name',
        header: 'Product Name',
        cell: ({ row }) => {
          const productName = row.original.productName;

          return (
            <p className="text-neutral-gray-800">
              {isEmptyValue(productName) ? NA_LABEL : productName}
            </p>
          );
        },
      }),

      // source
      col.display({
        id: 'source',
        header: 'Source',
        cell: ({ row }) => {
          const source = row.original?.source;

          if (typeof source !== 'string' || source.trim() === '') {
            return <span className="text-neutral-gray-700">{NA_LABEL}</span>;
          }

          return (
            <div className="flex justify-center">
              <Chip text={source} variant="outline" className="capitalize" />
            </div>
          );
        },
      }),

      // price
      col.accessor((row) => row.price?.amount ?? 0, {
        id: 'price',
        header: 'Price',
        cell: ({ row }) => {
          const amount = row.original.price?.amount;

          if (isEmptyValue(amount)) {
            return <span>{NA_LABEL}</span>;
          }

          return <span>₹{Number(amount).toLocaleString()}</span>;
        },
      }),

      // actions
      col.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <MoreOptionsMenu
            menuClassName="w-40"
            triggerClassName="mx-auto"
            menuItems={[
              {
                label: 'Delete',
                onClick: () => onDeleteProduct?.(row.original._id),
                icon: 'solar:trash-bin-trash-linear',
                variant: 'danger',
              },
            ]}
          />
        ),
        enableSorting: false,
        size: 60,
      }),
    ],
    [
      navigate,
      onDeleteProduct,
      rowSelection,
      data,
      allRowsSelected,
      someRowsSelected,
    ]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row, index) => row._id ?? `${row.productName}-${index}`,
  });

  if (!data.length) {
    return (
      <EmptyState
        className="[&_h2]:text-neutral-gray-900 [&_span]:text-neutral-gray-900 mx-auto h-full [&_span]:text-sm [&_span]:font-medium"
        title="Add products from inventory,"
        description="bulk import from spreadsheet or sync from Shopify"
      />
    );
  }

  return (
    <div className="h-full overflow-hidden">
      <div className="h-full overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={`text-neutral-gray-700 font-metropolis px-4 py-2 text-center text-sm font-medium tracking-wider whitespace-nowrap uppercase select-none ${
                      header.column.getCanSort()
                        ? 'hover:bg-neutral-gray-200 cursor-pointer hover:font-semibold'
                        : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      {header.column.getCanSort() && (
                        <SortIcon dir={header.column.getIsSorted()} />
                      )}
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, index) => {
              const isEvenRow = index % 2 === 0;
              const isLastRow = index === table.getRowModel().rows.length - 1;

              return (
                <tr
                  key={`${row.id}-${index}`}
                  ref={isLastRow ? lastRowRef : undefined}
                  className={`hover:bg-neutral-gray-200 transition-colors ${
                    isEvenRow ? 'bg-neutral-gray-100' : 'bg-neutral-gray-150'
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="font-metropolis px-4 py-2 text-center align-middle"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StoreTable;
