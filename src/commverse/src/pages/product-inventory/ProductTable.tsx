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
import ExperienceModules from '../../components/ExperienceModules';
import Chip from '../../components/Chip';
import type { ProductCMSItem } from '../../types/api.types';
import { MoreOptionsMenu } from '../../components/MoreOptionsMenu';
import { getProductPreviewImage, mapExperienceTypeToVariant } from '../../lib/utils';

function SortIcon({ dir }: { dir: 'asc' | 'desc' | false }) {
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
}

type TableRow = ProductCMSItem;

const col = createColumnHelper<TableRow>();

export default function ProductTable({
  data,
  lastRowRef,
  onDeleteProduct,
}: {
  data: ProductCMSItem[];
  lastRowRef?: (node: HTMLTableRowElement | null) => void;
  onDeleteProduct?: (id: string) => Promise<unknown> | unknown;
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const navigate = useNavigate();

  const columns = useMemo(
    () => [
      col.accessor((row) => row.productName ?? '', {
        id: 'name',
        header: 'Product Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={getProductPreviewImage(row.original)}
              alt={row.original.productName ?? 'Product'}
              className="h-8 w-8 shrink-0 rounded object-cover"
            />
            <div>
              <p>{row.original.productName}</p>
            </div>
          </div>
        ),
        size: 200,
      }),

      col.accessor((row) => row.productId ?? '', {
        id: 'id',
        header: 'Product ID',
      }),

      col.accessor(
        (row) => {
          return row.category?.name ?? 'Uncategorized';
        },
        {
          id: 'category',
          header: 'Category',
          cell: (info) => (
            <span className="text-gray-600">{info.getValue()}</span>
          ),
        }
      ),

      col.accessor(
        (row) => {
          return row.price?.amount ?? 0;
        },
        {
          id: 'price',
          header: 'Price',
          cell: ({ row }) => (
            <span>
              {row.original.price?.currency === 'INR'
                ? '₹'
                : row.original.price?.currency}
              {Number(row.original.price?.amount ?? 0).toLocaleString()}
            </span>
          ),
        }
      ),

      col.accessor((row) => row.experiences ?? [], {
        id: 'modules',
        header: 'Experiences',
        enableSorting: false,
        cell: (info) => {
          const experienceEntries = info.row.original.experiences ?? [];
          const countByVariant = new Map<string, number>();

          for (const experience of experienceEntries) {
            const variant = mapExperienceTypeToVariant(experience.type);

            if (!variant) continue;

            const previous = countByVariant.get(variant) ?? 0;
            countByVariant.set(variant, previous + (experience.count ?? 0));
          }

          const modules = Array.from(countByVariant.entries()).map(
            ([variant, count]) => ({ variant, count })
          );
          const hasExperiences = modules.length > 0;

          return (
            <div className="flex flex-wrap items-center justify-center">
              {hasExperiences ? (
                <ExperienceModules modules={modules} />
              ) : (
                <Chip variant="outline-light" text="No experiences created" />
              )}
            </div>
          );
        },
      }),

      col.display({
        id: 'navigate',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MoreOptionsMenu
              menuClassName="w-40"
              menuItems={[
                {
                  label: 'Edit',
                  onClick: () =>
                    navigate(`/product-inventory/edit/${row.original._id}`),
                  icon: 'solar:pen-new-square-linear',
                },
                {
                  label: 'Delete',
                  onClick: () => onDeleteProduct?.(row.original._id),
                  icon: 'solar:trash-bin-trash-linear',
                  variant: 'danger',
                },
              ]}
            />
          </div>
        ),
        enableSorting: false,
        size: 40,
      }),
    ],
    [navigate, onDeleteProduct]
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

  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className={`text-neutral-gray-700 font-metropolis rounded-lg px-4 py-3 text-center text-sm font-medium tracking-wider whitespace-nowrap uppercase select-none ${
                      header.column.getCanSort()
                        ? 'hover:bg-neutral-gray-200 cursor-pointer hover:font-semibold active:bg-transparent active:font-semibold'
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

          <tbody className="">
            {table.getRowModel().rows.map((row, index) => {
              const isEvenRow = index % 2 === 0;
              const isLastRow = index === table.getRowModel().rows.length - 1;
              return (
                <tr
                  key={`${row.id}-${index}`}
                  ref={isLastRow ? lastRowRef : undefined}
                  className={`transition-colors ${
                    isEvenRow ? 'bg-neutral-gray-100' : 'bg-neutral-gray-150'
                  } cursor-pointer`}
                  onClick={() => navigate(`/product-inventory/${row.original._id}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="font-metropolis px-4 py-3 text-center"
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
}
