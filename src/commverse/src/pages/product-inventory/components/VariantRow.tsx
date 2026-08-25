import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import {
  type Control,
  type FieldErrors,
  type UseFormGetValues,
  type UseFormRegister,
  type UseFormSetValue,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import Button from '../../../components/Button';
import Divider from '../../../components/Divider';
import type { FilterOption, SelectedOption } from '../../../types';
import FilterDropdown from '../../../components/FilterDropdown';
import type { AssetItem } from '../../../components/ImageUploader';
import Input from '../../../components/Input';
import { Tab } from '../../../components/Tab';
import { defaultEdition } from '../../../constants';
import type { ProductFormData } from '../../../types/api.types';
import EditionList from './EditionList';

interface VariantRowProps {
  variantIndex: number;
  control: Control<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  getValues: UseFormGetValues<ProductFormData>;
  register: UseFormRegister<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  onRemove: () => void;
  variantDropdownOptions: FilterOption[];
  variantTabs: { id: string; leftIcon: React.ReactNode }[];
  uploadedAssets: AssetItem[];
}

const VariantRow: React.FC<VariantRowProps> = ({
  variantIndex,
  control,
  register,
  setValue,
  onRemove,
  variantDropdownOptions,
  variantTabs,
  uploadedAssets,
  errors,
  getValues,
}) => {
  const {
    fields: editionFields,
    append: appendEdition,
    remove: removeEdition,
    move: moveEdition,
  } = useFieldArray({ control, name: `variants.${variantIndex}.editions` });

  const selectedType = useWatch({
    control,
    name: `variants.${variantIndex}.selectedType`,
  });
  const customType = useWatch({
    control,
    name: `variants.${variantIndex}.customType`,
  });
  const activeTabId = useWatch({
    control,
    name: `variants.${variantIndex}.activeTabId`,
  });
  const variantError = errors?.variants?.[variantIndex];

  const shouldShowTabs = selectedType === 'colour' || selectedType === 'other';

  const variantTypeLabel = useMemo(() => {
    if (!selectedType) return 'Edition';
    if (selectedType === 'other') {
      return customType?.trim()
        ? customType.trim().charAt(0).toUpperCase() + customType.trim().slice(1)
        : 'Custom';
    }
    return selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
  }, [selectedType, customType]);

  const handleTypeChange = (selected: SelectedOption | null) => {
    const type = selected?.id ?? '';
    setValue(`variants.${variantIndex}.selectedType`, type, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });

    if (type !== 'other')
      setValue(`variants.${variantIndex}.customType`, '', {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });

    if (type === 'colour') {
      setValue(`variants.${variantIndex}.activeTabId`, 'pipette', {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
      editionFields.forEach((_, idx) => {
        setValue(`variants.${variantIndex}.editions.${idx}.color`, '#000000', {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
      });
    } else {
      setValue(`variants.${variantIndex}.activeTabId`, 'image', {
        shouldDirty: true,
        shouldValidate: true,
        shouldTouch: true,
      });
    }
  };

  const handleTabChange = (tabId: string) => {
    if (!shouldShowTabs) return;
    setValue(`variants.${variantIndex}.activeTabId`, tabId, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xs">Variant Type {variantIndex + 1}</h2>
        <Icon
          icon="lucide:x"
          width={18}
          height={18}
          className="cursor-pointer"
          onClick={onRemove}
        />
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex w-full items-center gap-3">
          <FilterDropdown
            placeholder="Select Type"
            options={variantDropdownOptions}
            className="min-w-0 flex-1 [&>button]:w-full [&>button]:py-3"
            value={selectedType}
            onChange={(selected) =>
              handleTypeChange(selected as SelectedOption | null)
            }
            error={variantError?.selectedType?.message}
          />
          <div className="flex shrink-0 items-center gap-3">
            {shouldShowTabs && (
              <Tab
                key={`variant-${variantIndex}-${activeTabId}`}
                variant="toggle"
                defaultActiveId={activeTabId}
                data={variantTabs}
                onClick={(item) => handleTabChange(String(item.id))}
              />
            )}
            <Button
              variant="outline"
              content="Add Variant"
              size="sm"
              className="w-fit whitespace-nowrap"
              leftIcon={<Icon icon="lucide:plus" className="size-5" />}
              onClick={() =>
                appendEdition(defaultEdition(selectedType === 'colour'))
              }
            />
          </div>
        </div>
        {selectedType === 'other' && (
          <Input
            label="Custom Variant Type"
            placeholder="Enter custom variant type"
            className="w-full"
            {...register(`variants.${variantIndex}.customType`)}
            error={variantError?.customType?.message}
          />
        )}
        <EditionList
          variantIndex={variantIndex}
          variantTypeLabel={variantTypeLabel}
          activeTabId={activeTabId ?? 'image'}
          fields={editionFields}
          register={register}
          control={control}
          onRemove={removeEdition}
          onMove={moveEdition}
          uploadedAssets={uploadedAssets}
          setValue={setValue}
          errors={errors}
          getValues={getValues}
        />
      </div>
      <Divider className="border-neutral-gray-500! my-6!" />
    </div>
  );
};

export default VariantRow;
