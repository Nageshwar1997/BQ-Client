import { Icon, type IconProps } from '@iconify/react';
import {
  Fragment,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from 'react';
import { Link } from 'react-router';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import Button from '../../../components/Button';
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import Divider from '../../../components/Divider';
import FilterDropdown from '../../../components/FilterDropdown';
import Input from '../../../components/Input';
import useQueryParams from '../../../hooks/useQueryParams';
import type { SelectedOption, TFashionTryOnForm } from '../../../types';
import FashionEditionList from './FashionEditionList';
import { AddIcon } from '../../../icons';
import { Tab } from '../../../components/Tab';
import ColorInput from '../../../components/Input/ColorInput';
import type { CtaKey } from './FashionSchema';
import { useDragReorder } from '../../../hooks/useDragReorder';
import { VITE_S3_BASE_URL } from '../../../env';
import { FASHION_DEFAULT_MODELS } from '../../../constants';

interface ImageItem {
  value: string | File;
}

const MAX_IMAGES = 10;
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const EMPTY_PRODUCTS: TFashionTryOnForm['products'] = [];
const EMPTY_MODEL_PHOTOS: TFashionTryOnForm['modelPhotos'] = [];
const getDefaultModelPhotos = (): TFashionTryOnForm['modelPhotos'] =>
  FASHION_DEFAULT_MODELS.map((photo) => ({ ...photo }));

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

const FashionTryOnSidebar = () => {
  const { queryParams, updateParams } = useQueryParams();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [selectedProductIdx, setSelectedProductIdx] = useState<
    number | undefined
  >();
  const [activeTab, setActiveTab] = useState<'products' | 'user-controls'>(
    'products'
  );

  const { control, reset, resetField, setValue } =
    useFormContext<TFashionTryOnForm>();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const thumbInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const watchProducts =
    useWatch({ control, name: 'products' }) ?? EMPTY_PRODUCTS;
  const modelPhotos =
    useWatch({ control, name: 'modelPhotos' }) ?? EMPTY_MODEL_PHOTOS;
  const visibleIds = useWatch({ control, name: 'visibleIds' }) ?? [];
  const activeCta = (useWatch({ control, name: 'activeCta' }) ??
    'try-on') as CtaKey;

  const resetVisibleId = (id?: string) => {
    if (id && visibleIds.includes(id)) {
      const filteredIds = visibleIds.filter((item) => item !== id);
      setValue('visibleIds', filteredIds, { shouldDirty: true });
    } else if (id) {
      setValue('visibleIds', [...visibleIds, id], { shouldDirty: true });
    } else {
      setValue('visibleIds', [], { shouldDirty: true });
    }
  };

  const handleResetAll = () => {
    reset({
      type: 'bottom',
      products: [],
      modelPhotos: getDefaultModelPhotos(),
      activeCta: 'try-on',
      cta: {
        'try-on': {
          text: 'Try Now',
          buttonColor: '#000000',
          textColor: '#FFFFFF',
        },
        'buy-now': {
          text: 'Buy Now',
          buttonColor: '#000000',
          textColor: '#FFFFFF',
        },
        retry: {
          text: 'Retry',
          buttonColor: '#E6E7EC',
          textColor: '#1C274C',
        },
      },
      photoUpload: false,
      downloadable: false,
      compare: false,
      buyNowEnabled: true,
    });
    setActiveIdx(0);
    setError('');
    resetVisibleId();
    updateParams({ remove: ['product', 'id', 'experienceId'] });
  };

  const handleResetProducts = () => {
    setValue('products', [], { shouldDirty: true, shouldValidate: true });
    setSelectedProductIdx(0);
    resetVisibleId();
  };

  const handleRemoveProduct = (index: number) => {
    const removeProductId = watchProducts[index]?._id;
    const updatedProducts = watchProducts.filter((_, i) => i !== index);
    setValue('products', updatedProducts, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSelectedProductIdx((prev) => {
      if (!prev) return;
      if (prev === index) return Math.max(0, index - 1);
      if (prev > index) return prev - 1;
      return prev;
    });
    if (removeProductId && visibleIds.includes(removeProductId)) {
      const filteredIds = visibleIds.filter((item) => item !== removeProductId);
      setValue('visibleIds', filteredIds, { shouldDirty: true });
    }
  };

  const handleMoveProduct = (from: number, to: number) => {
    if (
      from === to ||
      from < 0 ||
      to < 0 ||
      from >= watchProducts.length ||
      to >= watchProducts.length
    )
      return;

    const reorderedProducts = [...watchProducts];
    const [movedProduct] = reorderedProducts.splice(from, 1);
    reorderedProducts.splice(to, 0, movedProduct);
    setValue('products', reorderedProducts, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setSelectedProductIdx((prev) => {
      if (prev === undefined || prev === null) return prev;
      if (prev === from) return to;
      if (from < to && prev > from && prev <= to) return prev - 1;
      if (from > to && prev >= to && prev < from) return prev + 1;
      return prev;
    });
  };
  const { getRowProps, getGripProps, draggingIdx, overIdx } =
    useDragReorder(handleMoveProduct);

  const handleResetGarmentType = () =>
    resetField('type', {
      defaultValue: 'bottom',
    });

  const handleResetModelPhotos = () => {
    setValue('modelPhotos', getDefaultModelPhotos(), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setActiveIdx(0);
    setError('');
  };

  const setImages = useCallback(
    (updater: ImageItem[] | ((prev: ImageItem[]) => ImageItem[])) => {
      const newVal =
        typeof updater === 'function' ? updater(modelPhotos) : updater;
      setValue('modelPhotos', newVal, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [modelPhotos, setValue]
  );

  const validate = useCallback((files: FileList) => {
    const errs: string[] = [];
    const valid: File[] = [];

    for (const f of files) {
      if (!ACCEPTED.includes(f.type)) {
        errs.push(`${f.name}: unsupported format`);
      } else if (f.size > MAX_SIZE) {
        errs.push(`${f.name}: exceeds 5MB`);
      } else {
        valid.push(f);
      }
    }

    if (errs.length) setError(errs.join(', '));
    else setError('');

    return valid;
  }, []);

  const replaceOrAppendImage = useCallback(
    (idx: number, newImg: ImageItem) => {
      let nextActiveIdx = idx;
      setImages((prev) => {
        if (idx < prev.length) {
          const updated = [...prev];
          updated[idx] = newImg;
          return updated;
        }
        nextActiveIdx = prev.length;
        return [...prev, newImg];
      });
      setActiveIdx(nextActiveIdx);
    },
    [setImages]
  );

  const addImages = useCallback(
    (files: FileList) => {
      const valid = validate(files);
      if (!valid.length) return;
      const remaining = MAX_IMAGES - modelPhotos.length;
      const toAdd = valid.slice(0, remaining);
      if (valid.length > remaining) {
        setError(`Max ${MAX_IMAGES} image(s) allowed. Extra files ignored.`);
      }
      const newImgs = toAdd.map((f) => ({ value: f }));
      setImages((prev) => {
        const updated = [...prev, ...newImgs];
        if (prev.length === 0 && newImgs.length > 0) setActiveIdx(0);
        return updated;
      });
    },
    [modelPhotos.length, setImages, validate]
  );

  const onDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const files = e.dataTransfer.files;
      addImages(files);
    },
    [addImages]
  );

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onBrowse = () => fileInputRef.current?.click();

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      if (activeIdx >= updated.length)
        setActiveIdx(Math.max(0, updated.length - 1));
      return updated;
    });
    setError('');
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    addImages(files);
    e.target.value = '';
  };

  const onThumbFile = (e: ChangeEvent<HTMLInputElement>, slotIdx: number) => {
    const files = e.target.files;
    if (!files?.length) return;
    const valid = validate(files);
    if (!valid.length) return;
    const newImg = { value: valid[0] };
    replaceOrAppendImage(slotIdx, newImg);
    e.target.value = '';
  };

  const onThumbAdd = (idx: number) => {
    if (modelPhotos[idx]) {
      setActiveIdx(idx);
    } else {
      thumbInputRefs.current[idx]?.click();
    }
  };

  const modelPhotoPreviews = useMemo(() => {
    const objectUrls: string[] = [];
    const previews = modelPhotos.map((photo) => {
      if (photo?.value instanceof File) {
        const previewUrl = URL.createObjectURL(photo.value);
        objectUrls.push(previewUrl);
        return previewUrl;
      }

      return typeof photo?.value === 'string' ? photo.value : '';
    });

    return { previews, objectUrls };
  }, [modelPhotos]);

  useEffect(() => {
    return () => {
      modelPhotoPreviews.objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [modelPhotoPreviews.objectUrls]);

  // const shouldDisableConfig = !['preview', 'tryon'].includes(queryParams.product ?? '');
  const hasImages = modelPhotos.length > 0;

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
        {/* ${shouldDisableConfig ? 'pointer-events-none opacity-50' : ''} */}
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
        <Tab
          data={[
            { title: 'Products', id: 'products' },
            { title: 'User Controls', id: 'user-controls' },
          ]}
          variant="pill"
          defaultActiveId={activeTab}
          className="p-2! text-xs!"
          onClick={(value) => {
            setActiveTab(
              (value?.id as 'products' | 'user-controls') ?? 'products'
            );
          }}
        />
        <div className="flex flex-col gap-3 px-2">
          {activeTab === 'products' && (
            <>
              <Section
                title="Garment Type"
                iconProps={{ onClick: handleResetGarmentType }}
                titleClassName="font-medium! text-xs! leading-3.75 capitalize"
                className="gap-2!"
              >
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FilterDropdown
                      className="[&>button>svg]:text-neutral-gray-500 h-10 **:capitalize [&>button]:h-full [&>button]:min-w-full [&>button>span:nth-child(2)]:hidden! [&>button>svg]:size-5"
                      options={[
                        { id: 'top', label: 'Top', value: 'top' },
                        { id: 'bottom', label: 'Bottom', value: 'bottom' },
                        { id: 'dress', label: 'Dress', value: 'dress' },
                      ]}
                      value={field.value}
                      onChange={(val) =>
                        field.onChange((val as SelectedOption)?.value)
                      }
                    />
                  )}
                />
              </Section>

              <Divider />

              <div className="flex flex-col gap-2">
                <Section
                  title="Products"
                  iconProps={{ onClick: handleResetProducts }}
                  className="gap-2!"
                >
                  {watchProducts.map((field, index) => {
                    const isEnabled = visibleIds.includes(field?._id ?? '');

                    return (
                      <FashionEditionList
                        key={`${field?._id ?? 'product'}-${index}`}
                        id={field?._id}
                        productIndex={index}
                        variantTypeLabel="Product"
                        onRemove={handleRemoveProduct}
                        isSelected={selectedProductIdx === index}
                        onPreviewSelect={(index) => {
                          if (isEnabled) {
                            setSelectedProductIdx(index);
                          }
                        }}
                        onViewSelect={resetVisibleId}
                        draggingIdx={draggingIdx}
                        overIdx={overIdx}
                        rowProps={getRowProps(index)}
                        gripProps={getGripProps(index)}
                      />
                    );
                  })}
                </Section>

                <Divider />

                <div className="flex flex-col gap-2">
                  {queryParams.product && (
                    <Button
                      variant="outline"
                      content="Select a Product"
                      onClick={() =>
                        updateParams({ set: { product: 'select' } })
                      }
                      className="border-neutral-gray-400! hover:border-neutral-gray-500! bg-neutral-gray-300 text-neutral-gray-800! max-h-10! min-h-10! w-full! text-sm! font-medium! underline"
                      leftIcon={
                        <Icon
                          icon="solar:box-minimalistic-linear"
                          className="size-5"
                        />
                      }
                    />
                  )}
                  <Button
                    variant="outline"
                    content="Add Product"
                    onClick={() =>
                      updateParams({ set: { product: 'add-new' } })
                    }
                    className="border-neutral-gray-400! hover:border-neutral-gray-500! bg-neutral-gray-300 text-neutral-gray-800! max-h-10! min-h-10! w-full! text-sm! font-medium! underline"
                    leftIcon={<Icon icon="lucide:plus" className="size-5" />}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === 'user-controls' && (
            <>
              {/* Upload / Preview Area */}
              <Section
                title="Model Photos"
                iconProps={{ onClick: handleResetModelPhotos }}
                // titleClassName="font-medium! text-xs! leading-3.75 capitalize"
                className="gap-2!"
              >
                <div className="flex flex-col gap-3">
                  <div
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onClick={!hasImages ? onBrowse : undefined}
                    className={`h-60 w-full rounded-3xl border-2 ${
                      isDragging
                        ? 'border-brand/90 bg-brand/10 cursor-default border-dashed'
                        : hasImages
                          ? 'border-neutral-gray-300 bg-neutral-gray-150 cursor-default border-solid'
                          : 'cursor-pointer border-dashed border-gray-400 bg-gray-50'
                    } relative overflow-hidden transition-all duration-200 ease-in-out`}
                  >
                    {hasImages ? (
                      <>
                        <img
                          src={
                            modelPhotoPreviews.previews[activeIdx]?.startsWith(
                              'experiences'
                            )
                              ? `${VITE_S3_BASE_URL}/${modelPhotoPreviews.previews[activeIdx]}`
                              : modelPhotoPreviews.previews[activeIdx]
                          }
                          alt={`Model photo ${activeIdx + 1}`}
                          className="size-full object-contain p-2"
                        />
                        <AddIcon
                          className="absolute top-2 right-2 size-5 rotate-45 cursor-pointer rounded-full bg-black/50 stroke-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(activeIdx);
                          }}
                        />
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                        <Icon
                          icon="solar:upload-minimalistic-linear"
                          className="text-neutral-gray-900 size-7.5"
                        />
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-neutral-gray-900 font-metropolis text-sm font-semibold">
                            Drop your product photos here
                          </span>
                          <span className="text-neutral-gray-700 font-metropolis text-xs font-normal">
                            JPG/PNG/WebP up to 5MB each
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          content="Browse Files"
                          className="w-fit! leading-none!"
                          size="sm"
                        />
                        <span className="text-neutral-gray-700 font-metropolis text-xs font-normal">
                          Upload {MAX_IMAGES} angles for best results
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED.join(',')}
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                  />

                  <div className="grid grid-cols-5 justify-center gap-2">
                    {Array.from({ length: MAX_IMAGES }).map((_, idx) => {
                      const img = modelPhotos?.[idx];
                      const isActive = hasImages && idx === activeIdx;
                      return (
                        <Fragment key={idx}>
                          <div
                            onClick={() => onThumbAdd(idx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const files = e.dataTransfer.files;
                              const valid = validate(files);
                              if (!valid.length) return;
                              const newImg = {
                                value: valid[0],
                              };
                              replaceOrAppendImage(idx, newImg);
                            }}
                            className={`bg-neutral-gray-300 relative flex items-center justify-center overflow-hidden rounded-lg ${
                              isActive
                                ? 'border-neutral-gray-900 border-[1.5px]'
                                : 'border-neutral-gray-400 border-[1.5px]'
                            } size-11 cursor-pointer`}
                          >
                            {img ? (
                              <img
                                src={
                                  modelPhotoPreviews.previews[idx]?.startsWith(
                                    'experiences'
                                  )
                                    ? `${VITE_S3_BASE_URL}/${modelPhotoPreviews.previews[idx]}`
                                    : modelPhotoPreviews.previews[idx]
                                }
                                alt={`Model thumbnail ${idx + 1}`}
                                className="size-full object-cover"
                              />
                            ) : (
                              <AddIcon className="stroke-neutral-gray-600 size-6" />
                            )}
                          </div>
                          <input
                            ref={(el) => {
                              thumbInputRefs.current[idx] = el;
                            }}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={(e) => onThumbFile(e, idx)}
                            className="hidden"
                          />
                        </Fragment>
                      );
                    })}
                  </div>
                  {error && (
                    <span className="font-metropolis text-ui-error text-xs">
                      {error}
                    </span>
                  )}
                </div>
              </Section>

              <Divider />

              {/* CTA */}
              <Section title="CTA">
                <Controller
                  name="activeCta"
                  control={control}
                  render={({ field }) => (
                    <Tab
                      data={[
                        { title: 'Try-On', id: 'try-on' },
                        { title: 'Buy Now', id: 'buy-now' },
                        { title: 'Retry', id: 'retry' },
                      ]}
                      variant="toggle"
                      defaultActiveId={field.value ?? 'try-on'}
                      className="p-2! text-xs!"
                      onClick={(value) => {
                        field.onChange(value.id);
                      }}
                    />
                  )}
                />
              </Section>

              {activeCta === 'buy-now' && (
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-neutral-gray-900 text-[13px] font-semibold">
                    Enable Buy Now Links
                  </span>
                  <Controller
                    name="buyNowEnabled"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        isOn={field.value ?? true}
                        onToggle={field.onChange}
                      />
                    )}
                  />
                </div>
              )}

              <Controller
                key={`cta-text-${activeCta}`}
                name={`cta.${activeCta}.text`}
                control={control}
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    label="Button Text"
                    placeholder={activeCta}
                    error={fieldState.error?.message}
                    className="placeholder:capitalize"
                  />
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <Controller
                  key={`cta-button-color-${activeCta}`}
                  name={`cta.${activeCta}.buttonColor`}
                  control={control}
                  rules={{
                    required: 'Button text/color is required',
                    pattern: {
                      value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      message: 'Enter a valid hex color (e.g., #FF5733)',
                    },
                  }}
                  render={({ field, formState }) => {
                    const hasError =
                      formState.errors?.cta?.[activeCta]?.buttonColor?.message;
                    return (
                      <ColorInput
                        {...field}
                        label="Button Color"
                        placeholder="#000000"
                        className={`h-10! px-3! py-3! text-xs ${
                          hasError
                            ? 'border-ui-error! hover:border-ui-error!'
                            : ''
                        }`}
                        containerClassName="flex-1 [&>label]:font-medium"
                        error={hasError}
                      />
                    );
                  }}
                />
                <Controller
                  key={`cta-text-color-${activeCta}`}
                  name={`cta.${activeCta}.textColor`}
                  control={control}
                  rules={{
                    required: 'Button text/color is required',
                    pattern: {
                      value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                      message: 'Enter a valid hex color (e.g., #FF5733)',
                    },
                  }}
                  render={({ field, formState }) => {
                    const hasError =
                      formState.errors?.cta?.[activeCta]?.textColor?.message;
                    return (
                      <ColorInput
                        {...field}
                        label="Text Color"
                        placeholder="#000000"
                        className={`h-10! px-3! py-3! text-xs ${
                          hasError
                            ? 'border-ui-error! hover:border-ui-error!'
                            : ''
                        }`}
                        containerClassName="flex-1 [&>label]:font-medium"
                        error={hasError}
                      />
                    );
                  }}
                />
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
                      <ToggleSwitch
                        isOn={field.value}
                        onToggle={field.onChange}
                      />
                    )}
                  />
                </div>
                <span className="text-neutral-gray-600 text-xs leading-3.75 font-normal">
                  Allow your users upload a photo for try-on along with live
                  camera input
                </span>
              </div>

              <Divider />

              <div className="flex flex-col items-start gap-3">
                <div className="flex w-full items-center justify-between gap-1">
                  <span className="text-neutral-gray-900 text-[13px] font-semibold">
                    Downloadable
                  </span>
                  <Controller
                    name="downloadable"
                    control={control}
                    render={({ field }) => (
                      <ToggleSwitch
                        isOn={field.value}
                        onToggle={field.onChange}
                      />
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
                      <ToggleSwitch
                        isOn={field.value}
                        onToggle={field.onChange}
                      />
                    )}
                  />
                </div>
                <span className="text-neutral-gray-600 text-xs leading-3.75 font-normal">
                  Allows your customers compare before & after applying lipstick
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FashionTryOnSidebar;
