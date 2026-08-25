import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useFieldArray, useForm } from 'react-hook-form';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';

import Button from '../../../../components/Button';
import Divider from '../../../../components/Divider';
import ToastCard from '../../../../components/AlertCards/ToastCard';
import { colorsSchema } from '../../../../schema/settings.schema';
import type { ColorsFormData, ToastCardProps } from '../../../../types';
import type { OnboardingBrandKitData } from '../../../../types/onboarding';
import { getRawImageUrl } from '../../../../utils/utils';

export type BrandColorCollectionData = {
  primaryColors: string[];
  secondaryColors: string[];
  otherColors: string[];
  logos: string[];
  profilePhoto?: string | null;
};

type LogoColorsPanelProps = {
  data: BrandColorCollectionData;
  onChange: (next: OnboardingBrandKitData['colors']) => void;
  onLogosChange: (nextLogos: string[], primaryLogo?: string | null) => void;
};

type ColorSwatchesProps = {
  colors: Array<{ value: string } | string>;
  editable?: boolean;
  registerField?: (index: number) => UseFormRegisterReturn;
  getColorKey?: (index: number) => string;
  onRemove?: (index: number) => void;
};

const ColorSwatches = memo(function ColorSwatches({
  colors,
  editable = false,
  registerField,
  getColorKey,
  onRemove,
}: ColorSwatchesProps) {
  return (
    <div className="flex gap-4 overflow-hidden overflow-x-auto">
      {colors.map((colorEntry, index) => {
        const colorValue =
          typeof colorEntry === 'string' ? colorEntry : colorEntry.value;
        const field = editable ? registerField?.(index) : null;

        return (
          <div
            key={getColorKey?.(index) ?? `${colorValue}-${index}`}
            className="flex w-[60px] flex-col items-center gap-2"
          >
            <div className="border-neutral-gray-300 relative rounded-full border bg-white">

              <div className='overflow-hidden h-[52px] w-[52px] rounded-full relative'>
              {field ? (
                <input
                  type="color"
                  className=" w-full h-full scale-130 cursor-pointer"
                  {...field}
                  onChange={field.onChange}
                />
              ) : (
                <div
                  className="h-full w-full rounded-full"
                  style={{ backgroundColor: colorValue }}
                />
              )}
              </div>
              {editable && onRemove ? (
                <button
                  type="button"
                  aria-label="Remove color"
                  className="border-neutral-gray-200 absolute -top-1 -right-1 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border bg-white text-neutral-gray-700 shadow-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove(index);
                  }}
                >
                  <Icon icon="lucide:x" className="size-3" aria-hidden />
                </button>
              ) : null}
            </div>
            <div className="text-center text-[10px] uppercase">
              {colorValue}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export const LogoColorsPanel = memo(function LogoColorsPanel({
  data,
  onChange,
  onLogosChange,
}: LogoColorsPanelProps) {
  const {
    control,
    reset,
    register,
    watch,
    formState: { errors },
  } = useForm<ColorsFormData>({
    resolver: zodResolver(colorsSchema),
    defaultValues: {
      brandColors: [],
      secondaryColors: [],
      otherColors: [],
    },
  });

  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState(0);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const [pendingColorSection, setPendingColorSection] = useState<
    'brandColors' | 'secondaryColors' | 'otherColors'
  >('brandColors');
  const [colorPickerAnchor, setColorPickerAnchor] = useState({ x: 0, y: 0 });
  const hasAppendedFromCurrentPickRef = useRef(false);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(
    data.profilePhoto ?? null
  );

  const brandArray = useFieldArray({ control, name: 'brandColors' });
  const secondaryArray = useFieldArray({ control, name: 'secondaryColors' });
  const otherArray = useFieldArray({ control, name: 'otherColors' });

  const lastPublishedColorsRef = useRef<string>('');

  const serializeColors = (colors: OnboardingBrandKitData['colors']) =>
    JSON.stringify(colors);

  useEffect(() => {
    const subscription = watch((formValues) => {
      const nextColors: OnboardingBrandKitData['colors'] = {
        primary: (formValues.brandColors ?? []).map((item: any) => item?.value),
        secondary: (formValues.secondaryColors ?? []).map(
          (item: any) => item?.value
        ),
        others: (formValues.otherColors ?? []).map((item: any) => item?.value),
      };

      const serialized = serializeColors(nextColors);
      if (lastPublishedColorsRef.current === serialized) return;

      lastPublishedColorsRef.current = serialized;
      onChange(nextColors);
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const showToast = useCallback((toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  }, []);

  const initialDataHash = JSON.stringify([
    data.primaryColors,
    data.secondaryColors,
    data.otherColors ?? [],
  ]);

  useEffect(() => {
    const incoming = serializeColors({
      primary: data.primaryColors,
      secondary: data.secondaryColors,
      others: data.otherColors ?? [],
    });
    // Props update from our own watch → parent echo; reset() would remount inputs and
    // dismiss the native <input type="color"> dialog mid-selection.
    if (lastPublishedColorsRef.current === incoming) {
      return;
    }

    lastPublishedColorsRef.current = incoming;
    reset({
      brandColors: data.primaryColors.map((value) => ({ value })),
      secondaryColors: data.secondaryColors.map((value) => ({ value })),
      otherColors: (data.otherColors ?? []).map((value) => ({ value })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialDataHash, reset]);

  useEffect(() => {
    setSelectedLogo(data.profilePhoto ?? null);
  }, [data.profilePhoto]);

  const handleSetPrimaryLogo = useCallback(
    (logoUrl: string) => {
      setSelectedLogo(logoUrl);
      onLogosChange(data.logos, logoUrl);

      showToast({
        type: 'success',
        title: 'Primary logo selected',
      });
    },
    [data.logos, onLogosChange, showToast]
  );

  const handleRemoveLogo = useCallback(
    (logoUrl: string) => {
      const nextLogos = data.logos.filter((url) => url !== logoUrl);
      const nextPrimary =
        selectedLogo === logoUrl ? (nextLogos[0] ?? null) : selectedLogo;

      setSelectedLogo(nextPrimary);
      onLogosChange(nextLogos, nextPrimary);

      showToast({
        type: 'success',
        title: 'Logo removed',
      });
    },
    [data.logos, onLogosChange, selectedLogo, showToast]
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

  const sections = useMemo(
    () => [
      {
        title: 'Primary Colors',
        fieldArray: brandArray,
        name: 'brandColors' as const,
        colors: brandArray.fields,
      },
      {
        title: 'Secondary Colors',
        fieldArray: secondaryArray,
        name: 'secondaryColors' as const,
        colors: secondaryArray.fields,
      },
      {
        title: 'Other Colors',
        fieldArray: otherArray,
        name: 'otherColors' as const,
        colors: otherArray.fields,
      },
    ],
    [brandArray, secondaryArray, otherArray]
  );

  const appendBySection = {
    brandColors: brandArray.append,
    secondaryColors: secondaryArray.append,
    otherColors: otherArray.append,
  } as const;

  return (
    <div className="flex h-full flex-col gap-3 overflow-hidden">
      <div className="font-metropolis text-neutral-gray-900 flex flex-col gap-2">
        {data.logos.length > 0 ? (
          <span className="text-xs font-medium">
            Please select your primary logo
          </span>
        ) : (
          <div className="flex items-center justify-between">
            <p className="flex-1 text-xs font-medium">
              No logo candidates collected yet.
            </p>
            <Button
              size="sm"
              variant="tertiary"
              content="Add"
              className="h-7.5! w-fit!"
              disabled
            />
          </div>
        )}

        {data.logos.length > 0 && (
          <div className="flex flex-col gap-3">
            {data.logos.map((logoUrl) => {
              const isPrimary = selectedLogo === logoUrl;

              return (
                <div
                  key={logoUrl}
                  className="flex items-center justify-between gap-4"
                >
                  <img
                    src={getRawImageUrl(logoUrl)}
                    alt="Logo Candidate"
                    className={`h-12 w-auto object-contain p-1 ${isPrimary ? 'rounded-lg border-2 border-[#18181a]' : ''
                      }`}
                  />

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={'tertiary'}
                      content={isPrimary ? 'Primary' : 'Set as Primary'}
                      disabled={isPrimary}
                      onClick={() => handleSetPrimaryLogo(logoUrl)}
                      className="h-7.5! w-fit!"
                    />

                    {!isPrimary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        content="Remove"
                        className="h-7.5! w-fit!"
                        onClick={() => handleRemoveLogo(logoUrl)}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Divider className="border-t-neutral-gray-200! border-transparent!" />

      <div className="flex h-full flex-col gap-3 overflow-y-auto">
        {sections.map((section) => {
          const areColorsAvailable = section.colors.length > 0;

          return (
            <Fragment key={section.name}>
              <div
                className={`flex ${areColorsAvailable
                  ? 'flex-col'
                  : 'items-center justify-between'
                  } gap-2 text-xs leading-[18px] font-medium`}
              >
                <div>{section.title}</div>

                <div className="flex items-center justify-between gap-4">
                  {areColorsAvailable && (
                    <ColorSwatches
                      colors={section.colors}
                      editable
                      registerField={(index) =>
                        register(`${section.name}.${index}.value`)
                      }
                      getColorKey={(index) =>
                        section.fieldArray.fields[index]?.id ??
                        `${section.name}-${index}`
                      }
                      onRemove={section.fieldArray.remove}
                    />
                  )}

                  <Button
                    variant="tertiary"
                    content="Add"
                    size="sm"
                    className="h-8! w-min cursor-pointer"
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
      </div>

      {createPortal(
        <input
          ref={colorPickerRef}
          type="color"
          aria-hidden
          className="pointer-events-none fixed mt-5  h-px w-px opacity-0"
          style={{
            left: `${colorPickerAnchor.x}px`,
            top: `${colorPickerAnchor.y}px`,
          }}
          defaultValue="#2622A5"
          onChange={(e) => {
            if (hasAppendedFromCurrentPickRef.current) return;

            const selectedColor = e.target.value;
            if (!selectedColor) return;

            appendBySection[pendingColorSection]({ value: selectedColor });
            hasAppendedFromCurrentPickRef.current = true;
          }}
        />,
        document.body
      )}

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}
    </div>
  );
});