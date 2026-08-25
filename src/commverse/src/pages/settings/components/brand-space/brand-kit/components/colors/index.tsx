import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { useOutletContext } from 'react-router';
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';

import Divider from '../../../../../../../components/Divider';
import Button from '../../../../../../../components/Button';
import ToastCard from '../../../../../../../components/AlertCards/ToastCard';
import { colorsSchema } from '../../../../../../../schema/settings.schema';
import { useRegisterSettingsHeaderActions } from '../../../../../../../hooks/useRegisterSettingsHeaderActions';
import type {
  ColorsFormData,
  ToastCardProps,
} from '../../../../../../../types';
import type { BrandKitContext } from '../../index';

const ColorValue = ({
  control,
  name,
  defaultValue,
}: {
  control: Control<ColorsFormData>;
  name:
    | `brandColors.${number}.value`
    | `secondaryColors.${number}.value`
    | `otherColors.${number}.value`;
  defaultValue: string;
}) => {
  const value = useWatch({ control, name, defaultValue });
  return <>{value || defaultValue}</>;
};

const Colors = () => {
  const { draftKit, updateDraftKit, isUpdating, onSave, onCancel } =
    useOutletContext<BrandKitContext>();

  const {
    control,
    handleSubmit,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm<ColorsFormData>({
    resolver: zodResolver(colorsSchema),
    defaultValues: {
      brandColors: draftKit?.colors?.primary || [],
      secondaryColors: draftKit?.colors?.secondary || [],
      otherColors: draftKit?.colors?.others || [],
    },
  });

  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState<number>(0);
  const [pendingColorSection, setPendingColorSection] = useState<
    'brandColors' | 'secondaryColors' | 'otherColors'
  >('brandColors');
  const [colorPickerAnchor, setColorPickerAnchor] = useState({ x: 0, y: 0 });
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const hasAppendedFromCurrentPickRef = useRef(false);

  const [isInitialized, setIsInitialized] = useState(false);

  // Sync draftKit to form (on mount or when draftKit updates from other source)
  useEffect(() => {
    if (draftKit?.colors && !isInitialized) {
      const nextValues = {
        brandColors: draftKit.colors.primary,
        secondaryColors: draftKit.colors.secondary,
        otherColors: draftKit.colors.others,
      };
      reset(nextValues);
      setIsInitialized(true);
    }
  }, [draftKit?.colors, reset, isInitialized]);

  // Sync form to draftKit on every change
  useEffect(() => {
    if (!isInitialized || !draftKit) return;

    const subscription = watch((value) => {
      updateDraftKit({
        colors: {
          primary: (value.brandColors || []) as { value: string }[],
          secondary: (value.secondaryColors || []) as { value: string }[],
          others: (value.otherColors || []) as { value: string }[],
        },
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, updateDraftKit, draftKit, isInitialized]);

  const showToast = useCallback((toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  }, []);

  const brandArray = useFieldArray({ control, name: 'brandColors' });
  const secondaryArray = useFieldArray({ control, name: 'secondaryColors' });
  const otherArray = useFieldArray({ control, name: 'otherColors' });

  const watchedBrandColors = useWatch({
    control,
    name: 'brandColors',
  });
  const watchedSecondaryColors = useWatch({
    control,
    name: 'secondaryColors',
  });
  const watchedOtherColors = useWatch({
    control,
    name: 'otherColors',
  });

  const sections = [
    {
      title: 'Brand Colors',
      fieldArray: brandArray,
      name: 'brandColors' as const,
      colors: watchedBrandColors,
    },
    {
      title: 'Secondary Colors',
      fieldArray: secondaryArray,
      name: 'secondaryColors' as const,
      colors: watchedSecondaryColors,
    },
    {
      title: 'Other Colors',
      fieldArray: otherArray,
      name: 'otherColors' as const,
      colors: watchedOtherColors,
    },
  ];

  const onSubmit = useCallback(
    (data: ColorsFormData) => {
      const kitColors = {
        primary: data.brandColors,
        secondary: data.secondaryColors,
        others: data.otherColors,
      };

      updateDraftKit({ colors: kitColors });
      onSave({
        colors: kitColors,
        fonts: draftKit?.fonts || [],
      });

      showToast({
        type: 'success',
        title: 'Updated successfully!',
      });
    },
    [updateDraftKit, onSave, draftKit?.fonts, showToast]
  );

  const handleCustomCancel = useCallback(() => {
    onCancel();
    if (draftKit?.colors) {
      reset({
        brandColors: draftKit.colors.primary,
        secondaryColors: draftKit.colors.secondary,
        otherColors: draftKit.colors.others,
      });
    }
  }, [onCancel, draftKit?.colors, reset]);

  useRegisterSettingsHeaderActions(
    useMemo(
      () => ({
        saveBtnProps: {
          onClick: handleSubmit(onSubmit),
          isLoading: isUpdating,
          disabled: isUpdating,
        },
        cancelBtnProps: {
          onClick: handleCustomCancel,
          disabled: isUpdating,
        },
      }),
      [handleSubmit, isUpdating, handleCustomCancel, onSubmit]
    )
  );

  const openColorPicker = useCallback(
    (
      section: 'brandColors' | 'secondaryColors' | 'otherColors',
      button: HTMLButtonElement
    ) => {
      const rect = button.getBoundingClientRect();

      setPendingColorSection(section);
      setColorPickerAnchor({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      hasAppendedFromCurrentPickRef.current = false;

      window.requestAnimationFrame(() => {
        colorPickerRef.current?.click();
      });
    },
    []
  );

  return (
    <div className="flex h-full flex-col gap-3">
      {sections.map((section) => {
        const colors = section.colors;
        const areColorsAvailable = colors?.length > 0;

        return (
          <Fragment key={section.name}>
            <div
              className={`flex ${areColorsAvailable ? 'flex-col' : 'items-center justify-between'} gap-2 text-xs leading-[18px] font-medium`}
            >
              <div>{section.title}</div>
              <div className="flex items-center justify-between gap-4">
                {areColorsAvailable && (
                  <div className="flex gap-4 overflow-hidden overflow-x-scroll">
                    {section.fieldArray.fields.map((field, index) => {
                      const registerField = register(
                        `${section.name}.${index}.value`
                      );

                      return (
                        <div
                          key={field.id}
                          className="flex w-[60px] flex-col items-center gap-2"
                        >
                          <div className="border-neutral-gray-300 relative rounded-full border bg-white">
                            <div className="relative h-[52px] w-[52px] overflow-hidden rounded-full">
                              <input
                                type="color"
                                className="absolute top-1/2 left-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                {...registerField}
                                onChange={(e) => {
                                  registerField.onChange(e);
                                }}
                              />
                            </div>
                            <button
                              type="button"
                              aria-label="Remove color"
                              className="border-neutral-gray-200 text-neutral-gray-700 absolute -top-1 -right-1 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border bg-white shadow-sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                section.fieldArray.remove(index);
                              }}
                            >
                              <Icon
                                icon="lucide:x"
                                className="size-3"
                                aria-hidden
                              />
                            </button>
                          </div>
                          <div className="uppercase">
                            <ColorValue
                              control={control}
                              name={`${section.name}.${index}.value`}
                              defaultValue={field.value}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <Button
                  variant="tertiary"
                  content="Add"
                  size="sm"
                  className="h-8! w-min"
                  onClick={(e) =>
                    openColorPicker(
                      section.name,
                      e.currentTarget as HTMLButtonElement
                    )
                  }
                />
              </div>
              {errors[section.name]?.root?.message && (
                <span className="text-ui-error mt-2 flex items-center gap-1 text-xs font-normal">
                  <Icon
                    icon="solar:info-circle-outline"
                    className="h-4 min-w-4"
                  />
                  {errors[section.name]?.root?.message}
                </span>
              )}
            </div>
            <Divider className="border-t-neutral-gray-200! border-transparent!" />
          </Fragment>
        );
      })}

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}

      {createPortal(
        <input
          ref={colorPickerRef}
          type="color"
          aria-hidden
          className="pointer-events-none fixed mt-5 h-px w-px opacity-0"
          style={{
            left: `${colorPickerAnchor.x}px`,
            top: `${colorPickerAnchor.y}px`,
          }}
          defaultValue="#000000"
          onChange={(e) => {
            if (hasAppendedFromCurrentPickRef.current) return;

            const selectedColor = e.target.value;
            if (!selectedColor) return;

            const sectionNames = {
              brandColors: brandArray,
              secondaryColors: secondaryArray,
              otherColors: otherArray,
            };
            sectionNames[pendingColorSection].append({ value: selectedColor });
            hasAppendedFromCurrentPickRef.current = true;
            e.target.value = '#000000';
          }}
        />,
        document.body
      )}
    </div>
  );
};

export default Colors;
