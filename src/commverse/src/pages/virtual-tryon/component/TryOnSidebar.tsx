import { Icon, type IconProps } from '@iconify/react';
import { memo, type ReactNode } from 'react';
import Button from '../../../components/Button';
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import ColorInput from '../../../components/Input/ColorInput';
import { Link } from 'react-router';
import Divider from '../../../components/Divider';
import FilterDropdown from '../../../components/FilterDropdown';
import Input from '../../../components/Input';
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
  type Control,
} from 'react-hook-form';
import type {
  FilterOption,
  SelectedOption,
  TTryOn,
  TTryOnForm,
} from '../../../types';
import { useGetCosmeticCategory } from '../../../hooks/useGetCosmeticCategory';
import { getDefaultValues } from '../utils';
import Checkbox from '../../../components/Checkbox';
import useQueryParams from '../../../hooks/useQueryParams';

const ColorVariant = ({
  title,
  iconProps,
  control,
  index,
  error,
}: {
  title?: string;
  index: number;
  control: Control<TTryOnForm>;
  iconProps?: Partial<IconProps>;
  error?: string;
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <Section
        title={title}
        iconProps={iconProps}
        titleClassName="font-medium! text-xs!"
        className="gap-2!"
      >
        <div className="flex w-full gap-2">
          {/* NAME */}
          <Controller
            name={`variants.${index}.name`}
            control={control}
            render={({ field, formState }) => {
              const error = formState.errors?.variants?.[index]?.name;
              return (
                <Input
                  type="text"
                  placeholder="Variant Name"
                  {...field}
                  className="h-full! px-3! py-2! text-xs"
                  containerClassName="w-full [&>div]:h-10!"
                  error={error?.message}
                />
              );
            }}
          />
          {/* COLOR */}
          <Controller
            name={`variants.${index}.hexColor`}
            control={control}
            render={({ field, formState }) => {
              const error = formState.errors?.variants?.[index]?.hexColor;
              return (
                <ColorInput
                  {...field}
                  className="h-10! px-3! py-2! text-xs"
                  placeholder="#000000"
                  containerClassName="w-full"
                  error={error?.message}
                />
              );
            }}
          />
        </div>
      </Section>

      {error && (
        <span className="text-ui-error text-xs font-normal">{error}</span>
      )}
    </div>
  );
};

const Heading = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => (
  <h6
    className={`text-neutral-gray-900 text-[13px] font-semibold ${className}`}
  >
    {title}
  </h6>
);

const Section = memo(
  ({
    title,
    children,
    iconProps,
    titleClassName,
    className = '',
  }: {
    title?: string;
    children?: ReactNode;
    titleClassName?: string;
    iconProps?: Partial<IconProps>;
    className?: string;
  }) => (
    <div className={`font-metropolis flex flex-col gap-3 ${className}`}>
      <div className="flex w-full items-center justify-between">
        {title && <Heading title={title} className={titleClassName} />}
        {iconProps && (
          <Icon
            {...iconProps}
            icon={iconProps.icon || 'solar:restart-linear'}
            className={`text-neutral-gray-800 size-4 cursor-pointer ${iconProps.className}`}
          />
        )}
      </div>
      {children ? children : null}
    </div>
  )
);

const Pattern = ({
  onToggle,
  pattern,
  checked,
}: {
  onToggle: (pattern: NonNullable<TTryOnForm['patterns']>[number]) => void;
  pattern: NonNullable<TTryOnForm['patterns']>[number];
  checked: boolean;
}) => {
  return (
    <div className="flex w-full gap-2">
      {/* NAME */}
      <Checkbox
        checked={checked}
        onChange={() => onToggle(pattern)}
        className={`${checked ? '[&>div]:bg-neutral-gray-900' : '[&>div]:border-neutral-gray-700'}`}
      />
      <div className="border-neutral-gray-400 bg-neutral-gray-100 size-10 shrink-0 overflow-hidden rounded-lg border">
        <img
          src={pattern.icon}
          alt={pattern.label}
          className="size-full object-cover"
        />
      </div>
      <Input
        className="disabled:bg-neutral-gray-100! disabled:text-neutral-gray-900! placeholder:text-neutral-gray-900! h-10! px-3! py-2! text-xs disabled:cursor-default!"
        placeholder={pattern.label}
        containerClassName="w-full"
        disabled
      />
    </div>
  );
};

interface TryOnSidebarProps {
  subCategoryOverride?: TTryOn;
}

const TryOnSidebar = ({ subCategoryOverride }: TryOnSidebarProps) => {
  const { subCategory: routeSubCategory } = useGetCosmeticCategory();
  const subCategory = subCategoryOverride ?? routeSubCategory;
  const isEyelinerOrKajal = ['Eyeliner', 'Kajal'].includes(subCategory);
  const { queryParams } = useQueryParams();

  const { control, reset, resetField, formState } =
    useFormContext<TTryOnForm>();

  const {
    fields: variants,
    append: appendVariant,
    remove: removeVariant,
    replace: replaceVariant,
  } = useFieldArray({ control, name: 'variants' });
  const {
    append: appendPattern,
    remove: removePattern,
    replace: replacePatterns,
  } = useFieldArray({
    control,
    name: 'patterns',
  });

  const handleResetAll = () => {
    reset();
  };
  const defaultData = getDefaultValues(subCategory);

  const watchVariants = useWatch({ control, name: 'variants' });

  const disableAddVariant = watchVariants?.some(
    (variant) => !variant.name?.trim() || !variant.hexColor?.trim()
  );

  const handleResetVariants = () => {
    replaceVariant(defaultData.variants);
  };
  const handleResetFinishType = () =>
    resetField('type', { defaultValue: defaultData.type });
  const handleResetPatterns = () => {
    const defaultPattern: NonNullable<TTryOnForm['patterns']>[number] =
      defaultData.menuData?.[0] as NonNullable<TTryOnForm['patterns']>[number];
    replacePatterns(defaultPattern ? [defaultPattern] : []);
  };

  const selectedPatterns = useWatch({
    control,
    name: 'patterns',
  });

  const togglePattern = (
    pattern: NonNullable<TTryOnForm['patterns']>[number]
  ) => {
    if (!pattern) return;
    const existingIndex = selectedPatterns?.findIndex(
      (p) => p.value === pattern.value
    );

    if (existingIndex !== -1) {
      if (selectedPatterns?.length === 1) return;
      removePattern(existingIndex);
    } else {
      appendPattern(pattern);
    }
  };

  return (
    <div className="font-metropolis text-neutral-gray-900 bg-neutral-gray-200 flex h-full w-75 flex-col gap-5 overflow-x-hidden pt-9 pb-5.5">
      <Link to="/dashboard" className="px-4">
        <img
          src="/assets/icons/Commverse Logo - Final.svg"
          alt="comm-logo"
          className="w-full max-w-47.5"
        />
      </Link>
      <div className="font-metropolis flex grow flex-col gap-4 overflow-y-scroll scroll-smooth px-4 pt-3">
        <div className="text-neutral-gray-900 flex items-center justify-between gap-4">
          <span className="text-base/[19px] font-semibold">
            Experience Setup
          </span>
          <Button
            variant="link"
            content="Reset All"
            className="text-xs!"
            onClick={handleResetAll}
          />
        </div>
        <p className="text-xs">Controls to tweak your experience</p>

        <div
          className={`flex flex-col gap-3 ${
            !queryParams.id &&
            (!queryParams.product ||
              ['select', 'add-new'].includes(queryParams.product))
              ? 'pointer-events-none opacity-50'
              : ''
          }`}
        >
          <Section
            title={isEyelinerOrKajal ? 'Base Colour' : 'Colour Variants'}
            iconProps={{ onClick: handleResetVariants }}
          />
          {variants.map((variant, i) => (
            <ColorVariant
              key={variant.id}
              title={!isEyelinerOrKajal ? `Variant ${i + 1}` : undefined}
              index={i}
              control={control}
              iconProps={
                variants.length > 1
                  ? { onClick: () => removeVariant(i), icon: 'lucide:x' }
                  : undefined
              }
              error={formState?.errors?.variants?.message}
            />
          ))}
          {watchVariants.length < 15 && !isEyelinerOrKajal && (
            <Button
              variant="outline"
              content="Add Variant"
              onClick={() => appendVariant({ name: '', hexColor: '' })}
              className="border-neutral-gray-400! hover:border-neutral-gray-500! bg-neutral-gray-300 text-neutral-gray-800! max-h-10! min-h-10! w-full! text-sm! font-medium! underline"
              leftIcon={<Icon icon="lucide:plus" className="size-5" />}
              disabled={disableAddVariant}
            />
          )}
          <Divider />
          {(['Lipstick', 'Eyeliner', 'Kajal'] as TTryOn[]).includes(
            subCategory
          ) &&
            defaultData?.menuData?.length > 0 && (
              <>
                <div className="flex flex-col gap-2">
                  <Heading title="Product Details" className="h-6" />
                  <Section
                    title={
                      subCategory === 'Lipstick'
                        ? 'Finish Type'
                        : `${subCategory} Types`
                    }
                    iconProps={{
                      onClick:
                        subCategory === 'Lipstick'
                          ? handleResetFinishType
                          : handleResetPatterns,
                    }}
                    titleClassName="font-medium! text-xs! leading-3.75 capitalize"
                    className="gap-2!"
                  >
                    {subCategory === 'Lipstick' ? (
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <FilterDropdown
                            className="[&>button>svg]:text-neutral-gray-500 h-10 **:capitalize [&>button]:h-full [&>button]:min-w-full [&>button>span:nth-child(2)]:hidden! [&>button>svg]:size-5"
                            options={defaultData.menuData as FilterOption[]}
                            value={field.value}
                            onChange={(val) =>
                              field.onChange((val as SelectedOption)?.value)
                            }
                          />
                        )}
                      />
                    ) : (
                      defaultData.menuData?.map((pattern, index) => (
                        <Pattern
                          onToggle={togglePattern}
                          key={index}
                          pattern={
                            pattern as NonNullable<
                              TTryOnForm['patterns']
                            >[number]
                          }
                          checked={
                            selectedPatterns?.some(
                              (p) => p.value === pattern.value
                            ) ?? false
                          }
                        />
                      ))
                    )}
                  </Section>
                </div>
                <Divider />
              </>
            )}
          <div className="flex flex-col items-start gap-3">
            <div className="flex w-full items-center justify-between gap-1">
              <span className="text-neutral-gray-900 text-[13px] font-semibold">
                Downloadable
              </span>
              <Controller
                name="downloadable"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch isOn={field.value} onToggle={field.onChange} />
                )}
              />
            </div>
            <span className="text-neutral-gray-600 text-xs leading-3.75 font-normal">
              Allows your customers to download a sylized social image
            </span>
          </div>
          <Divider />
          <div className="flex flex-col items-start gap-3">
            <div className="flex w-full items-center justify-between gap-1">
              <span className="text-neutral-gray-900 text-[13px] font-semibold">
                Compare (Before vs After)
              </span>
              <Controller
                name="compare"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch isOn={field.value} onToggle={field.onChange} />
                )}
              />
            </div>
            <span className="text-neutral-gray-600 text-xs leading-3.75 font-normal">
              Allows your customers compare before & after applying lipstick
            </span>
          </div>
          <Divider />
          <div className="flex flex-col items-start gap-3">
            <div className="flex w-full items-center justify-between gap-1">
              <span className="text-neutral-gray-900 text-[13px] font-semibold">
                Custom Photo Upload
              </span>
              <Controller
                name="photoUpload"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch isOn={field.value} onToggle={field.onChange} />
                )}
              />
            </div>
            <span className="text-neutral-gray-600 text-xs leading-3.75 font-normal">
              Allow your users upload a photo for try-on along with live camera
              input
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOnSidebar;
