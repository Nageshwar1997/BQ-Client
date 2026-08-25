import { useEffect, useMemo, useState } from 'react';
import useQueryParams from '../../hooks/useQueryParams';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  FormProvider,
  useWatch,
  type SubmitHandler,
} from 'react-hook-form';
import Header from '../../components/Header';
import PublishOptionsModal from '../../components/PublishOptionsModal';
import {
  useCreateExperience,
  useUpdateExperience,
  useGetExperienceById,
  usePublishExperience,
  useUploadExperienceImages,
} from '../../services/experience-services';
import { useGetProductCMSById } from '../../services/product-service';
import type { CurrencyCode, IProductResponse } from '../../types';
import FashionMainBody from './components/FashionMainBody';
import { fashionTryOnSchema } from './components/FashionSchema';
import FashionTryOnSidebar from './components/FashionTryOnSidebar';
import FashionTryOnModals from './components/FashionTryOnModals';
import { useSyncFashionProductLinks } from './hooks/useSyncFashionProductLinks';
import type { TTryOnExperience } from '../virtual-tryon/tryon[category]';
import type z from 'zod';
import { TryOnSaveWarnModal } from '../virtual-tryon/component/TryOnModals';
import { useBlocker, useNavigate, useParams } from 'react-router';
import {
  CURRENCY_SYMBOL,
  EXPERIENCE_DOMAIN,
  FASHION_DEFAULT_MODELS,
  MODULE_MAP,
} from '../../constants';
import ToastCard from '../../components/AlertCards/ToastCard';
import { getProductPreviewImage, handleApiError } from '../../lib/utils';

type TFashionTryOnFormInput = z.input<typeof fashionTryOnSchema>;
type TFashionTryOnForm = z.output<typeof fashionTryOnSchema>;

type TParsedExperience = Omit<
  TTryOnExperience,
  'draftData' | 'publishedData'
> & {
  draftData: TFashionTryOnForm & {
    selectedProducts: TFashionTryOnForm['products'];
  };
  publishedData: TFashionTryOnForm & {
    selectedProducts: TFashionTryOnForm['products'];
  };
};

type TFashionTryOnSavedData = Partial<TFashionTryOnForm> & {
  selectedProducts?: TFashionTryOnForm['products'];
};

export const DEFAULT_CTA_VALUES: TFashionTryOnForm['cta'] = {
  'try-on': {
    text: 'Try Now',
    buttonColor: '#002dff',
    textColor: '#FFFFFF',
  },
  'buy-now': {
    text: 'Buy Now',
    buttonColor: '#000000',
    textColor: '#FFFFFF',
  },
  retry: {
    text: 'Retry',
    buttonColor: '#EAEBF1',
    textColor: '#18181A',
  },
};

const mergeCtaValues = (
  source: unknown,
  fallback: TFashionTryOnForm['cta']
): TFashionTryOnForm['cta'] => {
  const cta =
    source && typeof source === 'object'
      ? (source as Partial<TFashionTryOnForm['cta']>)
      : {};

  return {
    'try-on': {
      ...fallback['try-on'],
      ...(cta['try-on'] ?? {}),
    },
    'buy-now': {
      ...fallback['buy-now'],
      ...(cta['buy-now'] ?? {}),
    },
    retry: {
      ...fallback.retry,
      ...(cta.retry ?? {}),
    },
  };
};

const hasFieldChanged = (previous: unknown, current: unknown) =>
  JSON.stringify(previous ?? null) !== JSON.stringify(current ?? null);

const getVisibleIdsFromSavedData = (
  source?: TFashionTryOnSavedData | null
): string[] | undefined => {
  if (!source) return undefined;
  if (Array.isArray(source.visibleIds)) return source.visibleIds;

  if (Array.isArray(source.selectedProducts)) {
    return source.selectedProducts
      .map((item) => item?._id)
      .filter((id): id is string => Boolean(id));
  }

  return undefined;
};

const normalizeVisibleIds = (source?: TFashionTryOnSavedData | null) =>
  getVisibleIdsFromSavedData(source) ?? [];

const FashionTryOn = () => {
  const [showPublishOptionsModal, setShowPublishOptionsModal] = useState(false);
  const [showSaveWarnModal, setShowSaveWarnModal] = useState(false);
  const [pendingCloseAction, setPendingCloseAction] = useState<
    (() => void) | null
  >(null);
  const { queryParams, updateParams } = useQueryParams();
  const navigate = useNavigate();
  const { expId } = useParams();
  const activeExperienceId = expId ?? queryParams.experienceId ?? '';
  const {
    rememberProductLink,
    resetProductLinkSnapshot,
    syncProductLinks,
  } = useSyncFashionProductLinks();

  const getProductByIdQuery = useGetProductCMSById(queryParams.id ?? '');
  const createExperienceQuery = useCreateExperience();
  const updateExperienceQuery = useUpdateExperience();
  const getExperienceByIdQuery = useGetExperienceById(activeExperienceId);
  const publishExperienceQuery = usePublishExperience();
  const uploadImages = useUploadExperienceImages();

  const product: IProductResponse = getProductByIdQuery.data?.data ?? {};
  const experienceRawData = getExperienceByIdQuery.data?.data;
  const parsedExperience: TParsedExperience | null = useMemo(() => {
    if (!experienceRawData) return null;
    return {
      ...experienceRawData,
      ...(experienceRawData.draftData && {
        draftData: JSON.parse(experienceRawData.draftData),
      }),
      ...(experienceRawData.publishedData && {
        publishedData: JSON.parse(experienceRawData.publishedData),
      }),
    };
  }, [experienceRawData]);

  const publishedExperienceLink = useMemo(() => {
    const subdomain = parsedExperience?.siteInfo?.subdomain?.trim();
    const slug = parsedExperience?.siteInfo?.slug?.trim();
    const type = parsedExperience?.type;

    if (!subdomain || !slug || !type) return undefined;

    return `${subdomain}${EXPERIENCE_DOMAIN}/${slug}${MODULE_MAP[type] ? `/${MODULE_MAP[type]}` : `/${type}`}`;
  }, [
    parsedExperience?.siteInfo?.slug,
    parsedExperience?.siteInfo?.subdomain,
    parsedExperience?.type,
  ]);

  const draftData = useMemo(() => {
    return (
      JSON.parse(getExperienceByIdQuery.data?.data?.draftData ?? '{}') || {}
    );
  }, [getExperienceByIdQuery.data?.data?.draftData]);

  const methods = useForm<TFashionTryOnFormInput, unknown, TFashionTryOnForm>({
    resolver: zodResolver(fashionTryOnSchema),
    mode: 'onChange',
    shouldUnregister: false,
    defaultValues: {
      title: experienceRawData?.title ?? 'New Fashion Try-on',
      activeCta: 'try-on',
      cta: DEFAULT_CTA_VALUES,
      products: [],
      modelPhotos: FASHION_DEFAULT_MODELS,
      type: 'bottom',
      downloadable: true,
      compare: false,
      photoUpload: false,
      buyNowEnabled: true,
      visibleIds: [],
    },
  });

  const currentFormData = useWatch({ control: methods.control });
  const changesCount = useMemo(() => {
    if (!parsedExperience?.draftData) return 0;
    const draftVisibleIds = normalizeVisibleIds(parsedExperience.draftData);

    const fieldsToCompare: (keyof TFashionTryOnForm)[] = [
      'buyNowEnabled',
      'compare',
      'cta',
      'downloadable',
      'modelPhotos',
      'photoUpload',
      'products',
      'type',
      'visibleIds',
    ];

    const formChanges = fieldsToCompare.reduce((total, fieldKey) => {
      const draftValue =
        fieldKey === 'visibleIds'
          ? draftVisibleIds
          : parsedExperience.draftData[fieldKey];
      const currentValue =
        fieldKey === 'visibleIds'
          ? (currentFormData?.visibleIds ?? [])
          : currentFormData?.[fieldKey];

      return total + (hasFieldChanged(draftValue, currentValue) ? 1 : 0);
    }, 0);

    const titleChanges = hasFieldChanged(
      parsedExperience.title,
      currentFormData?.title?.trim()
    )
      ? 1
      : 0;

    return formChanges + titleChanges;
  }, [currentFormData, parsedExperience?.draftData, parsedExperience?.title]);

  const hasDraftPublishedDiff = useMemo(() => {
    if (!parsedExperience?.draftData) return false;
    if (!parsedExperience?.publishedData) return true;
    const draftVisibleIds = normalizeVisibleIds(parsedExperience.draftData);
    const publishedVisibleIds = normalizeVisibleIds(
      parsedExperience.publishedData
    );

    const fieldsToCompare: (keyof TFashionTryOnForm)[] = [
      'type',
      'compare',
      'downloadable',
      'photoUpload',
      'buyNowEnabled',
      'products',
      'modelPhotos',
      'cta',
      'visibleIds',
    ];

    return fieldsToCompare.some((fieldKey) => {
      const draftValue =
        fieldKey === 'visibleIds'
          ? draftVisibleIds
          : parsedExperience.draftData[fieldKey];
      const publishedValue =
        fieldKey === 'visibleIds'
          ? publishedVisibleIds
          : parsedExperience.publishedData[fieldKey];

      return hasFieldChanged(draftValue, publishedValue);
    });
  }, [parsedExperience?.draftData, parsedExperience?.publishedData]);

  const canPublish = changesCount > 0 || hasDraftPublishedDiff;
  const hasDraftDataChanges = useMemo(() => {
    if (!activeExperienceId) return true;
    return changesCount > 0;
  }, [activeExperienceId, changesCount]);
  const hasRequiredSiteInfoForPublish = Boolean(
    parsedExperience?.siteInfo?.siteId && parsedExperience?.siteInfo?.slug
  );

  const blocker = useBlocker(
    queryParams.product === 'add-new'
      ? false
      : ({ currentLocation, nextLocation }) =>
          changesCount > 0 && currentLocation.pathname !== nextLocation.pathname
  );

  const handleCreateExperience = async () => {
    const values = methods.getValues();
    if (!product) return;
    await syncProductLinks(values.products);
    const currentVisibleIds = values.visibleIds ?? [];
    const selectedProducts =
      values.products?.filter((item) => currentVisibleIds.includes(item._id)) ??
      [];

    const formData = {
      type: 'fashion_tryon',
      status: 'draft',
      title: values.title,
      productId: product._id,
      draftData: JSON.stringify({
        type: values.type,
        compare: values.compare,
        downloadable: values.downloadable,
        photoUpload: values.photoUpload,
        buyNowEnabled: values.buyNowEnabled,
        products: values.products,
        modelPhotos: values.modelPhotos,
        cta: values.cta,
        selectedProducts,
        visibleIds: currentVisibleIds,
      }),
    };

    await createExperienceQuery.mutateAsync(formData, {
      onSuccess: async (data) => {
        updateParams({
          set: { experienceId: data.data._id, product: 'preview' },
        });
      },
    });
  };

  const onSave = async (data: TFashionTryOnForm) => {
    if (!activeExperienceId) {
      await handleCreateExperience();
      return;
    }
    await syncProductLinks(data.products);
    const currentVisibleIds = data.visibleIds ?? [];
    let isFileIncludes = false;

    const finalImagesUrls: { value: string }[] = [];

    const imagesFormData = new FormData();
    data.modelPhotos.forEach((file) => {
      if (file.value instanceof File) {
        imagesFormData.append('images', file.value);
        isFileIncludes = true;
      } else {
        finalImagesUrls.push({ value: file.value });
      }
    });

    if (isFileIncludes) {
      await uploadImages.mutateAsync(imagesFormData, {
        onSuccess: (data) => {
          if (data.data) {
            finalImagesUrls.push(
              ...data.data.map((item: string) => ({ value: item }))
            );
          }
        },
      });
    }

    const selectedProducts = data.products?.filter((item) =>
      currentVisibleIds.includes(item._id)
    );

    const serializedData = JSON.stringify({
      buyNowEnabled: data.buyNowEnabled,
      compare: data.compare,
      cta: data.cta,
      downloadable: data.downloadable,
      modelPhotos: finalImagesUrls,
      photoUpload: data.photoUpload,
      products: data.products,
      selectedProducts: selectedProducts,
      visibleIds: currentVisibleIds,
      type: data.type,
    });

    const formData = {
      title: data.title?.trim() || product.productName,
      draftData: serializedData,
    };

    await updateExperienceQuery.mutateAsync({
      id: activeExperienceId,
      data: formData,
    });

    return activeExperienceId;
  };

  const onPublish = async (data: TFashionTryOnForm) => {
    if (!product) return;
    if (!hasRequiredSiteInfoForPublish) return;
    if (!canPublish) return;
    const experienceId = await onSave(data);
    if (!experienceId) return;

    await publishExperienceQuery.mutateAsync({
      id: experienceId,
      status: 'published',
    });
  };

  const onSubmit: SubmitHandler<TFashionTryOnForm> = async (data, event) => {
    const submitter = (event?.nativeEvent as SubmitEvent | undefined)
      ?.submitter as HTMLButtonElement | undefined;
    const action = submitter?.value;

    if (action === 'publish') {
      await onPublish(data);
      return;
    }

    await onSave(data);
  };

  useEffect(() => {
    const data = parsedExperience?.draftData;
    if (!data) return;
    const resolvedVisibleIds = normalizeVisibleIds(data);
    resetProductLinkSnapshot(data?.products);

    methods.setValue('buyNowEnabled', data?.buyNowEnabled);
    methods.setValue('compare', data?.compare);
    methods.setValue('cta', data?.cta);
    methods.setValue('downloadable', data?.downloadable);
    methods.setValue('modelPhotos', data?.modelPhotos);
    methods.setValue('photoUpload', data?.photoUpload);
    methods.setValue('products', data?.products);
    methods.setValue('type', data?.type);
    methods.setValue('visibleIds', resolvedVisibleIds);
  }, [parsedExperience?.draftData]);

  useEffect(() => {
    if (draftData && Object.keys(draftData).length) {
      const currentValues = methods.getValues();
      const fallbackCta = mergeCtaValues(currentValues.cta, DEFAULT_CTA_VALUES);
      const resolvedVisibleIds = getVisibleIdsFromSavedData(
        draftData as TFashionTryOnSavedData
      );
      resetProductLinkSnapshot(draftData.products);
      methods.reset({
        title:
          experienceRawData?.title ??
          currentValues.title ??
          'New Fashion Try-on',
        type: draftData.type ?? 'bottom',
        compare: draftData.compare ?? false,
        downloadable: draftData.downloadable ?? false,
        photoUpload: draftData.photoUpload ?? false,
        buyNowEnabled: draftData.buyNowEnabled ?? true,
        products: draftData.products ?? null,
        modelPhotos: draftData.modelPhotos ?? currentValues.modelPhotos ?? [],
        cta: mergeCtaValues(draftData.cta, fallbackCta),
        activeCta: draftData.activeCta ?? currentValues.activeCta ?? 'try-on',
        visibleIds: resolvedVisibleIds ?? currentValues.visibleIds ?? [],
      });
    }
  }, [draftData, experienceRawData?.title, methods]);

  useEffect(() => {
    if (!queryParams.id || !product?._id) return;

    const existingProducts = methods.getValues('products') ?? [];
    if (existingProducts.some((item) => item?._id === product._id)) return;

    const productToAdd = {
      ...product,
      _id: product._id,
      image: getProductPreviewImage(product),
      name: product.productName ?? '',
      fileName: product.media?.images?.[0]?.filename ?? '',
      url: product.productLink ?? '',
      price:
        `${CURRENCY_SYMBOL[product.price?.currency as CurrencyCode] ?? ''} ${product.price?.amount ?? ''}`.trim(),
    };

    methods.setValue('products', [...existingProducts, productToAdd], {
      shouldDirty: true,
      shouldValidate: true,
    });
    rememberProductLink(product._id, product.productLink);
  }, [methods, product, queryParams.id, rememberProductLink]);

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    setPendingCloseAction(null);
    setShowSaveWarnModal(true);
  }, [blocker.state]);

  useEffect(() => {
    if (!expId) return;
    if (!queryParams.experienceId) return;
    updateParams({ remove: ['experienceId'] });
  }, [expId, queryParams.experienceId, updateParams]);

  return (
    <form
      id="tryon-form"
      onSubmit={methods.handleSubmit(onSubmit)}
      className="flex h-full w-full overflow-hidden"
    >
      <FormProvider {...methods}>
        <div className="flex h-full w-full overflow-hidden">
          <FashionTryOnSidebar />
          <div className="flex h-full flex-1 flex-col">
            <Header
              section="virtual-try-on"
              buttons={{
                save: {
                  type: 'submit',
                  form: 'tryon-form',
                  name: 'action',
                  value: 'save',
                  disabled:
                    (!queryParams.product && !activeExperienceId) ||
                    !hasDraftDataChanges,
                },
                publish: {
                  // disabled: !hasRequiredSiteInfoForPublish,
                  onMouseDown: (e) => e.stopPropagation(),
                  onClick: (e) => {
                    // if (!hasRequiredSiteInfoForPublish) return;
                    if (publishExperienceQuery.isPending) return;
                    e.stopPropagation();
                    setShowPublishOptionsModal((prev) => !prev);
                  },
                  ...(publishExperienceQuery.isPending &&
                    !showPublishOptionsModal && {
                      content: 'Publishing',
                    }),
                  isLoading:
                    publishExperienceQuery.isPending &&
                    !showPublishOptionsModal,
                  className: `${showPublishOptionsModal ? 'bg-brand-pressed' : ''}`,
                  modalContent: showPublishOptionsModal && (
                    <PublishOptionsModal
                      experienceData={parsedExperience}
                      publishedLink={publishedExperienceLink}
                      publishedAt={parsedExperience?.publishedAt}
                      changes={changesCount}
                      onClose={() => setShowPublishOptionsModal(false)}
                      experienceTitle={currentFormData?.title ?? ''}
                      onTitleChange={(value) =>
                        methods.setValue('title', value, { shouldDirty: true })
                      }
                      publishStatus={
                        parsedExperience?.status === 'published'
                          ? 'Published'
                          : updateExperienceQuery.isPending
                            ? 'Publishing'
                            : publishExperienceQuery.isPending
                              ? 'Publishing'
                              : 'Not Published'
                      }
                      issues={0}
                      isPublishing={publishExperienceQuery.isPending}
                      buttonProps={{
                        type: 'submit',
                        form: 'tryon-form',
                        name: 'action',
                        value: 'publish',
                        disabled: !canPublish || !hasRequiredSiteInfoForPublish,
                      }}
                    />
                  ),
                },
                settings: {
                  disabled: !activeExperienceId,
                  onClick: () =>
                    navigate(`/fashion_tryon/${activeExperienceId}/settings`),
                },
              }}
            />
            <FashionMainBody />
          </div>
        </div>
        <FashionTryOnModals
          product={product}
          // onSelectProduct={addProduct}
        />
      </FormProvider>
      {updateExperienceQuery.isPending && (
        <ToastCard
          type="loading"
          autoClose={false}
          title="Saving your project..."
          description="Please wait, saving in progress"
        />
      )}
      {updateExperienceQuery.isError && !createExperienceQuery.isError && (
        <ToastCard
          type="error"
          title="Failed to Save Project"
          description="Couldn't save your project, please try again"
          buttonProps={{
            content: 'Try Again',
          }}
        />
      )}
      {createExperienceQuery.isError && (
        <ToastCard
          type="error"
          title="Failed to Select Project"
          description={handleApiError({
            error: createExperienceQuery.error as Error,
            fallback: "Couldn't select your project, please try again",
          })}
        />
      )}
      {(updateExperienceQuery.isSuccess ||
        createExperienceQuery.isSuccess ||
        publishExperienceQuery.isSuccess) && (
        <ToastCard
          type="success"
          title={
            createExperienceQuery.isSuccess
              ? 'Created Successfully!'
              : publishExperienceQuery.isSuccess
                ? 'Published Successfully!'
                : 'Saved Successfully'
          }
          description={
            createExperienceQuery.isSuccess
              ? 'Successfully created your experience'
              : publishExperienceQuery.isSuccess
                ? 'Your changes are published successfully'
                : 'Your changes are saved successfully'
          }
        />
      )}

      <TryOnSaveWarnModal
        onClose={() => {
          setShowSaveWarnModal(false);
          if (blocker.state === 'blocked') {
            blocker.reset();
          }
          setPendingCloseAction(null);
        }}
        open={showSaveWarnModal}
        onDiscardChanges={() => {
          setShowSaveWarnModal(false);
          if (blocker.state === 'blocked') {
            blocker.proceed();
            return;
          }
          pendingCloseAction?.();
          setPendingCloseAction(null);
        }}
        onSaveAndExit={async () => {
          const isValid = await methods.trigger();
          if (!isValid) return;
          const values = fashionTryOnSchema.parse(methods.getValues());
          await onSave(values);
          setShowSaveWarnModal(false);
          if (blocker.state === 'blocked') {
            blocker.proceed();
            return;
          }
          pendingCloseAction?.();
          setPendingCloseAction(null);
        }}
      />
    </form>
  );
};

export default FashionTryOn;
