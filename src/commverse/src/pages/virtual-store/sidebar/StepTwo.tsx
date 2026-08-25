import { Icon } from '@iconify/react';
import Button from '../../../components/Button';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import FilterDropdown from '../../../components/FilterDropdown';
import {
  type CurrencyCode,
  type SelectedOption,
  type ToastCardProps,
} from '../../../types';
import { currencyData } from '../../../data';
import { CURRENCY_SYMBOL } from '../../../constants';
import Divider from '../../../components/Divider';
import FileUploadButton from '../../../components/FileUploadButton';
import type { StoreFormType } from '..';
import Input from '../../../components/Input';
import { Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import DeleteAssetModal from '../../../components/DeleteAssetModal';
import ToastCard from '../../../components/AlertCards/ToastCard';
import { downloadFile } from '../../../lib/utils';

type RemoveModalProps = {
  title: string;
  confirmTitle: string;
  onConfirm: () => void;
};

type ParsedSpreadsheetRow = {
  modelThumbnailUrl: string;
  productThumbnailUrl: string;
  productName: string;
  price: number;
};

const SPREADSHEET_TEMPLATE_HEADERS = [
  { title: '3D Model Thumbnail', key: 'model-thumbnail' },
  { title: 'Product Thumbnail', key: 'product-thumbnail' },
  { title: 'Product Name', key: 'product-name' },
  { title: 'Price', key: 'price' },
] as const;

const getCsvEscapedValue = (value: string) => {
  const escaped = value.replace(/"/g, '""');
  return `"${escaped}"`;
};

const parseCsvLine = (line: string) => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const nextChar = line[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const parsePriceValue = (value: string): number => {
  const numericValue = value.replace(/[^\d.-]/g, '');
  const parsed = Number(numericValue);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeHeader = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, '-');

const parseSpreadsheetCsv = (csvContent: string): ParsedSpreadsheetRow[] => {
  const lines = csvContent
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) return [];

  const headers = parseCsvLine(lines[0]).map(normalizeHeader);
  const modelThumbnailIndex = headers.findIndex(
    (header) => header === 'model-thumbnail' || header === '3d-model-thumbnail'
  );
  const productThumbnailIndex = headers.findIndex(
    (header) => header === 'product-thumbnail' || header === 'thumbnail'
  );
  const productNameIndex = headers.findIndex(
    (header) => header === 'product-name'
  );
  const priceIndex = headers.findIndex((header) => header === 'price');

  if (
    modelThumbnailIndex === -1 ||
    productThumbnailIndex === -1 ||
    productNameIndex === -1 ||
    priceIndex === -1
  ) {
    throw new Error('Spreadsheet template columns are missing.');
  }

  return lines.slice(1).reduce<ParsedSpreadsheetRow[]>((rows, line) => {
    const values = parseCsvLine(line);
    const productName = values[productNameIndex]?.trim() ?? '';

    if (!productName) return rows;

    rows.push({
      modelThumbnailUrl: values[modelThumbnailIndex]?.trim() ?? '',
      productThumbnailUrl: values[productThumbnailIndex]?.trim() ?? '',
      productName,
      price: parsePriceValue(values[priceIndex] ?? ''),
    });

    return rows;
  }, []);
};

const StepTwo = () => {
  const [removeModalState, setRemoveModalState] =
    useState<RemoveModalProps | null>(null);
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastIndex, setToastIndex] = useState<number>(0);

  const {
    control,
    resetField,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<StoreFormType>();

  const spreadsheet = useWatch({
    control,
    name: 'spreadsheet',
  });
  const storeProducts = useWatch({
    control,
    name: 'storeProducts',
  });
  const shopifyDomain = useWatch({
    control,
    name: 'shopifyDomain',
  });
  const apiKey = useWatch({
    control,
    name: 'apiKey',
  });

  const disableSync =
    (!!shopifyDomain && !apiKey) || (!shopifyDomain && !!apiKey);

  const showToast = (toastProps: ToastCardProps) => {
    setToastCardProps(toastProps);
    setToastIndex((prev) => prev + 1);
  };

  const handleDownloadSpreadsheetTemplate = () => {
    const headerRow = SPREADSHEET_TEMPLATE_HEADERS.map((header) =>
      getCsvEscapedValue(header.title)
    ).join(',');
    const csvContent = `${headerRow}\n`;
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const blobUrl = URL.createObjectURL(blob);

    downloadFile({
      url: blobUrl,
      filename: 'import-products-template',
      extension: 'csv',
      onSuccess: () => URL.revokeObjectURL(blobUrl),
      onError: () => URL.revokeObjectURL(blobUrl),
    });
  };

  return (
    <Fragment>
      <p className="text-xs/normal">Controls to tweak your experience</p>
      <div className="flex flex-col gap-3 px-2">
        <div className="flex items-center justify-between gap-2 py-1">
          <label className="h-4 grow text-[13px]/[16.25px] font-semibold">
            Currency Type
          </label>
          <Icon
            icon="solar:restart-linear"
            className="text-neutral-gray-800 size-4 cursor-pointer"
            onClick={() => resetField('currency')}
          />
        </div>
        <Controller
          name="currency"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FilterDropdown
              placeholder="Select currency type"
              options={currencyData.map((item) => ({
                ...item,
                label: `${item.id} (${CURRENCY_SYMBOL[item.id as CurrencyCode]})`,
              }))}
              value={value}
              onChange={(val) => onChange((val as SelectedOption)?.value)}
              error={errors.currency?.message as string}
              className={`[&>button]:h-10 [&>button]:min-w-full [&>button>span:nth-child(2)]:hidden! [&>button>svg]:size-4 ${value ? '[&>button>span:nth-child(1)]:text-neutral-gray-900!' : '[&>button>span:nth-child(1)]:text-neutral-gray-500!'}`}
            />
          )}
        />
        <Divider className="my-[7px]!" />
        <div className="flex h-6 items-center text-[13px]/[16.25px] font-semibold">
          Import from Spreadsheet
        </div>
        <Button
          size="sm"
          variant="link"
          content="Download Template"
          className="text-xs!"
          onClick={handleDownloadSpreadsheetTemplate}
        />
        <FileUploadButton
          className="h-[41px] py-2.5!"
          isUploaded={Boolean(spreadsheet?.url && spreadsheet?.name)}
          uploadedLabel={spreadsheet?.name ?? null}
          allowedFileTypes={['.csv', '.xlsx', '.xls']}
          onFileUpload={async (url, fileName) => {
            showToast({
              type: 'loading',
              title: 'Importing Products...',
              description:
                'Importing products from spreadsheet can take a few minutes',
            });

            try {
              const response = await fetch(url);
              const csvContent = await response.text();
              const parsedRows = parseSpreadsheetCsv(csvContent);

              if (!parsedRows.length) {
                throw new Error('No valid rows found in spreadsheet.');
              }

              const importedProducts = parsedRows.map((item, index) => ({
                _id: `spreadsheet-${Date.now()}-${index}`,
                productName: item.productName,
                source: 'spreadsheet',
                price: { amount: item.price, currency: 'INR' },
                media: {
                  model: {
                    thumbnailUrl: item.modelThumbnailUrl,
                  },
                  thumbnail: {
                    url: item.productThumbnailUrl,
                  },
                },
              }));

              setValue(
                'storeProducts',
                [...(storeProducts ?? []), ...importedProducts],
                { shouldDirty: true }
              );
              setValue(
                'spreadsheet',
                {
                  url,
                  name: fileName,
                },
                { shouldDirty: true }
              );

              showToast({
                type: 'success',
                title: 'Products Added Successfully!',
                description: 'Products imported from spreadsheet successfully',
              });
            } catch {
              showToast({
                type: 'error',
                title: 'Failed to import products',
                description:
                  'Please upload a valid CSV using the provided template.',
              });
            }
          }}
          onClose={() =>
            setRemoveModalState({
              title:
                'All the products added from spreadsheet will be removed from the catalogue',
              confirmTitle: 'Remove Spreadsheet?',
              onConfirm: async () => {
                setValue('spreadsheet', null, { shouldDirty: true });
                setValue(
                  'storeProducts',
                  (storeProducts ?? []).filter(
                    (product) => product.source !== 'spreadsheet'
                  ),
                  { shouldDirty: true }
                );
                showToast({
                  type: 'default',
                  title: 'Spreadsheet removed successfully!',
                  description:
                    'Products added from spreadsheet are removed from the catalogue',
                });
              },
            })
          }
          buttonLabel="Upload"
        />
        <Divider className="my-[7px]!" />
        <div className="flex h-6 items-center justify-between gap-2 py-1">
          <label className="h-4 grow text-[13px]/[16.25px] font-semibold">
            Import from Shopify
          </label>
          <Button
            size="sm"
            variant="link"
            content="Sync"
            disabled={disableSync}
            className="text-xs!"
            onClick={() => {
              const isBothEmpty = !shopifyDomain && !apiKey;

              if (isBothEmpty) {
                setRemoveModalState({
                  title:
                    'All the products added from Shopify will be removed from the catalogue',
                  confirmTitle: 'Remove Shopify?',
                  onConfirm: async () => {
                    showToast({
                      type: 'default',
                      title: 'Shopify removed successfully!',
                      description:
                        'Products added from Shopify are removed from the catalogue',
                    });
                  },
                });
              } else {
                showToast({
                  type: 'loading',
                  title: 'Importing Products...',
                  description:
                    'Importing products from shopify can take a few minutes',
                });
                setTimeout(() => {
                  const isSuccess = true;
                  if (isSuccess) {
                    showToast({
                      type: 'success',
                      title: 'Products Added Successfully!',
                      description:
                        'Products imported from your Shopify successfully',
                    });
                  } else {
                    showToast({
                      type: 'error',
                      title: 'Failed to import products',
                      description:
                        'Failed to import products from Shopify, please try again',
                    });
                  }
                }, 3000);
              }
            }}
          />
        </div>
        <Input
          type="text"
          placeholder="Enter the shop sub-domain"
          label="Store Sub-Domain"
          containerClassName="gap-2!"
          {...register('shopifyDomain')}
        />
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <label className="h-4 grow text-[13px]/[16.25px] font-semibold">
              API Key
            </label>
            <Icon
              icon="solar:info-circle-outline"
              className="text-neutral-gray-800 size-4 cursor-pointer"
            />
          </div>
          <Input
            type="text"
            placeholder="Enter your API key here"
            containerClassName="gap-2!"
            {...register('apiKey')}
          />
        </div>
      </div>

      <DeleteAssetModal
        open={removeModalState !== null}
        onClose={() => setRemoveModalState(null)}
        title={removeModalState?.title}
        confirmTitle={removeModalState?.confirmTitle}
        confirmButtonLabel="Remove"
        onConfirm={async () => {
          removeModalState?.onConfirm();
          setRemoveModalState(null);
        }}
        showSuccessStep={false}
        className="[&>div]:max-w-[440px]! [&>div>div]:min-h-[75vh]! [&>div>div>div:first-child]:hidden"
      />

      {toastCardProps && <ToastCard key={toastIndex} {...toastCardProps} />}
    </Fragment>
  );
};

export default StepTwo;
