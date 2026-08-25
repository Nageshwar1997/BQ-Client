import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Header from '../../../components/Header';
import MainBody from '../component/MainBody';
import TryOnSidebar from '../component/TryOnSidebar';
import { tryOnSchema } from '../component/Schema';
import type { TTryOn, TTryOnForm } from '../../../types';
import { getDefaultValues } from '../utils';
import { type BaseSyntheticEvent, useEffect, useMemo, useState } from 'react';
import useQueryParams from '../../../hooks/useQueryParams';
import {
  useGetExperienceById,
  usePublishExperience,
  useUpdateExperience,
} from '../../../services/experience-services';
import { TryOnSaveWarnModal } from '../component/TryOnModals';
import PublishOptionsModal from '../../../components/PublishOptionsModal';
import type { ExperienceStatus, ExperienceType } from '../../../services/api';
import { EXPERIENCE_DOMAIN, MODULE_MAP } from '../../../constants';
import ToastCard from '../../../components/AlertCards/ToastCard';
import {
  useBeforeUnload,
  useBlocker,
  useNavigate,
  useParams,
} from 'react-router';

type TTryOnExperience = {
  _id: string;
  userId: string;
  productId: string;
  title: string;
  type: ExperienceType;
  status: ExperienceStatus;
  draftData: string;
  publishedData: string;
  draftAt: string;
  publishedAt: string;
  siteInfo: {
    siteId: string | null;
    subdomain?: string | null;
    pageTitle: string | null;
    pageDescription: string | null;
    socialImage: string | null;
    slug: string | null;
  };
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type TParsedExperience = Omit<
  TTryOnExperience,
  'draftData' | 'publishedData'
> & {
  draftData: TTryOnForm & {
    categoryId?: string;
    subCategory?: TTryOn;
  };
  publishedData: TTryOnForm & {
    categoryId?: string;
    subCategory?: TTryOn;
  };
};

const TRACKED_FORM_FIELDS: (keyof TTryOnForm)[] = [
  'type',
  'compare',
  'downloadable',
  'photoUpload',
  'patterns',
  'variants',
];

const hasFieldChanged = (previous: unknown, current: unknown) =>
  JSON.stringify(previous ?? null) !== JSON.stringify(current ?? null);

const EditTryOnCategory = () => {
  const [showPublishOptionsModal, setShowPublishOptionsModal] = useState(false);
  const [showSaveWarnModal, setShowSaveWarnModal] = useState(false);
  const [experienceTitle, setExperienceTitle] = useState('');
  const [savedSnapshot, setSavedSnapshot] = useState<{
    title: string;
    formData: Partial<TTryOnForm>;
  } | null>(null);
  const [pendingCloseAction, setPendingCloseAction] = useState<
    (() => void) | null
  >(null);

  const { expId } = useParams();
  const navigate = useNavigate();
  const { queryParams } = useQueryParams();
  const updateExperienceQuery = useUpdateExperience();
  const getExperienceByIdQuery = useGetExperienceById(expId ?? '');
  const publishExperienceQuery = usePublishExperience();

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

  useEffect(() => {
    if (!experienceRawData) return;
    setExperienceTitle(experienceRawData.title);
  }, [experienceRawData]);

  useEffect(() => {
    if (!expId || !parsedExperience?.draftData) return;

    setSavedSnapshot({
      title: parsedExperience.title?.trim() ?? '',
      formData: TRACKED_FORM_FIELDS.reduce(
        (acc, fieldKey) => ({
          ...acc,
          [fieldKey]: parsedExperience.draftData[fieldKey],
        }),
        {} as Partial<TTryOnForm>
      ),
    });
  }, [parsedExperience?.draftData, parsedExperience?.title, expId]);

  const draftData = useMemo(() => {
    return (
      JSON.parse(getExperienceByIdQuery.data?.data?.draftData ?? '{}') || {}
    );
  }, [getExperienceByIdQuery.data?.data?.draftData]);

  const colorVariants = parsedExperience?.publishedData?.variants;

  const defaultValues = useMemo(
    () =>
      getDefaultValues(parsedExperience?.draftData.subCategory ?? 'Lipstick'),
    [parsedExperience?.draftData.subCategory]
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { menuData, ...defaultData } = defaultValues;
  const methods = useForm<TTryOnForm>({
    resolver: zodResolver(tryOnSchema),
    mode: 'onChange',
    defaultValues: {
      type: defaultData.type,
      variants: defaultData.variants,
      patterns: null,
      downloadable: true,
      compare: false,
      photoUpload: false,
      title: 'New Virtual Try-on',
    },
  });
  const currentFormData = useWatch({ control: methods.control });

  const changesCount = useMemo(() => {
    if (!parsedExperience?.draftData) return 0;

    const formChanges = TRACKED_FORM_FIELDS.reduce((total, fieldKey) => {
      return (
        total +
        (hasFieldChanged(
          parsedExperience.draftData[fieldKey],
          currentFormData?.[fieldKey]
        )
          ? 1
          : 0)
      );
    }, 0);

    const titleChanges = hasFieldChanged(
      parsedExperience.title,
      experienceTitle.trim()
    )
      ? 1
      : 0;

    return formChanges + titleChanges;
  }, [
    currentFormData,
    experienceTitle,
    parsedExperience?.draftData,
    parsedExperience?.title,
  ]);

  const hasDraftPublishedDiff = useMemo(() => {
    if (!parsedExperience?.draftData) return false;
    if (!parsedExperience?.publishedData) return true;

    return TRACKED_FORM_FIELDS.some((fieldKey) =>
      hasFieldChanged(
        parsedExperience.draftData[fieldKey],
        parsedExperience.publishedData[fieldKey]
      )
    );
  }, [parsedExperience?.draftData, parsedExperience?.publishedData]);

  const canPublish = changesCount > 0 || hasDraftPublishedDiff;
  const hasRequiredSiteInfoForPublish = Boolean(
    parsedExperience?.siteInfo?.siteId && parsedExperience?.siteInfo?.slug
  );
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
  const hasDraftDataChanges = useMemo(() => {
    if (!expId) return true;
    if (!savedSnapshot) return true;

    const formHasChanges = TRACKED_FORM_FIELDS.some((fieldKey) =>
      hasFieldChanged(
        savedSnapshot.formData[fieldKey],
        currentFormData?.[fieldKey]
      )
    );

    const titleHasChanges = hasFieldChanged(
      savedSnapshot.title,
      experienceTitle.trim()
    );

    return formHasChanges || titleHasChanges;
  }, [currentFormData, experienceTitle, expId, savedSnapshot]);

  const isEyelinerOrKajal = useMemo(() => {
    return ['Eyeliner', 'Kajal'].includes(
      parsedExperience?.draftData.subCategory ?? 'Lipstick'
    );
  }, [parsedExperience?.draftData.subCategory]);

  const hasIncompleteVariants = useMemo(
    () =>
      (currentFormData?.variants ?? []).some(
        (variant) => !variant?.name?.trim() || !variant?.hexColor?.trim()
      ),
    [currentFormData?.variants]
  );

  const resolvedExperienceTitle = useMemo(
    () =>
      parsedExperience?.siteInfo?.pageTitle?.trim() ||
      experienceTitle.trim() ||
      `New ${parsedExperience?.draftData.subCategory} Try-on`,
    [
      parsedExperience?.siteInfo?.pageTitle,
      experienceTitle,
      parsedExperience?.draftData.subCategory,
    ]
  );

  const variantsSyncKey = useMemo(() => {
    const nextVariants = isEyelinerOrKajal
      ? defaultData.variants
      : colorVariants?.length
        ? colorVariants
        : defaultData.variants;
    return JSON.stringify(nextVariants ?? []);
  }, [colorVariants, defaultData.variants, isEyelinerOrKajal]);

  useEffect(() => {
    const nextVariants = JSON.parse(variantsSyncKey) as TTryOnForm['variants'];
    if (!hasFieldChanged(methods.getValues('variants'), nextVariants)) return;

    methods.setValue('variants', nextVariants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.getValues, methods.setValue, queryParams.id, variantsSyncKey]);

  useEffect(() => {
    if (draftData && Object.keys(draftData).length) {
      methods.reset({
        type: draftData.type ?? defaultData.type,
        compare: draftData.compare ?? false,
        downloadable: draftData.downloadable ?? false,
        photoUpload: draftData.photoUpload ?? false,
        patterns: draftData.patterns ?? null,
        variants: draftData.variants ?? defaultData.variants,
        title:
          draftData.title ?? parsedExperience?.title ?? 'New Virtual Try-on',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultData.type, defaultData.variants, draftData, methods.reset]);

  const onSave = async (data: TTryOnForm) => {
    if (hasIncompleteVariants) return;

    if (!hasDraftDataChanges) {
      return expId;
    }

    const serializedData = JSON.stringify({
      type: data.type,
      compare: data.compare,
      downloadable: data.downloadable,
      photoUpload: data.photoUpload,
      patterns: data.patterns,
      variants: data.variants,
      categoryId: parsedExperience?.draftData.categoryId,
      subCategory: parsedExperience?.draftData.subCategory,
    });

    const formData = {
      title: resolvedExperienceTitle,
      draftData: serializedData,
    };

    await updateExperienceQuery.mutateAsync({
      id: expId ?? '',
      data: formData,
    });

    setSavedSnapshot({
      title: formData.title.trim(),
      formData: TRACKED_FORM_FIELDS.reduce(
        (acc, fieldKey) => ({ ...acc, [fieldKey]: data[fieldKey] }),
        {} as Partial<TTryOnForm>
      ),
    });

    return expId;
  };
  const onPublish = async (data: TTryOnForm) => {
    if (hasIncompleteVariants) return;
    if (!hasRequiredSiteInfoForPublish) return;
    if (!canPublish) return;

    const serializedData = JSON.stringify({
      type: data.type,
      compare: data.compare,
      downloadable: data.downloadable,
      photoUpload: data.photoUpload,
      patterns: data.patterns,
      variants: data.variants,
      categoryId: parsedExperience?.draftData.categoryId,
      subCategory: parsedExperience?.draftData.subCategory,
    });
    const experienceId = await onSave(data);
    if (!experienceId) return;

    await updateExperienceQuery.mutateAsync({
      id: experienceId,
      data: {
        title: resolvedExperienceTitle,
        draftData: serializedData,
      },
    });

    await publishExperienceQuery.mutateAsync({
      id: experienceId,
      status: 'published',
    });
  };

  const onSubmit = async (data: TTryOnForm, event?: BaseSyntheticEvent) => {
    const submitter = (event?.nativeEvent as SubmitEvent | undefined)
      ?.submitter as HTMLButtonElement | undefined;
    const action = submitter?.value;

    if (action === 'publish') {
      await onPublish(data);
      return;
    }

    await onSave(data);
  };

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      changesCount > 0 &&
      hasDraftDataChanges &&
      currentLocation.pathname !== nextLocation.pathname
  );

  useBeforeUnload((event) => {
    if (!hasDraftDataChanges) return;
    event.preventDefault();
    event.returnValue = '';
  });

  useEffect(() => {
    if (blocker.state !== 'blocked') return;

    setPendingCloseAction(null);
    setShowSaveWarnModal(true);
  }, [blocker.state]);

  // const handleCloseWithWarning = (closeAction: () => void) => {
  //   if (changesCount <= 0) {
  //     closeAction();
  //     return;
  //   }

  //   setPendingCloseAction(() => closeAction);
  //   setShowSaveWarnModal(true);
  // };

  const handleDiscardChanges = () => {
    setShowSaveWarnModal(false);

    if (blocker.state === 'blocked') {
      blocker.proceed();
      return;
    }

    pendingCloseAction?.();
    setPendingCloseAction(null);
  };

  const handleStayOnPage = () => {
    setShowSaveWarnModal(false);

    if (blocker.state === 'blocked') {
      blocker.reset();
    }

    setPendingCloseAction(null);
  };

  const handleSaveAndExit = async () => {
    const isValid = await methods.trigger();
    if (!isValid) return;

    const values = methods.getValues();

    await onSave(values);

    setShowSaveWarnModal(false);

    if (blocker.state === 'blocked') {
      blocker.proceed();
      return;
    }

    pendingCloseAction?.();
    setPendingCloseAction(null);
  };

  return (
    <form
      id="tryon-form"
      onSubmit={methods.handleSubmit(onSubmit)}
      className="flex h-full w-full overflow-hidden"
    >
      <FormProvider {...methods}>
        <div className="flex h-full w-full overflow-hidden">
          <TryOnSidebar
            subCategoryOverride={parsedExperience?.draftData.subCategory}
          />
          <div className="flex h-full flex-1 flex-col">
            <Header
              section="virtual-try-on"
              buttons={{
                save: {
                  type: 'submit',
                  form: 'tryon-form',
                  name: 'action',
                  value: 'save',
                  disabled: !hasDraftDataChanges || hasIncompleteVariants,
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
                      experienceTitle={experienceTitle}
                      onTitleChange={(value) => setExperienceTitle(value)}
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
                        disabled:
                          !canPublish ||
                          hasIncompleteVariants ||
                          !hasRequiredSiteInfoForPublish,
                      }}
                    />
                  ),
                },
                settings: {
                  onClick: () =>
                    navigate(
                      `/${parsedExperience?.draftData.subCategory}/${expId}/settings`
                    ),
                },
              }}
            />
            <MainBody
              subCategoryOverride={parsedExperience?.draftData.subCategory}
              experienceTitle={experienceTitle}
            />
          </div>
        </div>
      </FormProvider>
      {updateExperienceQuery.isPending && (
        <ToastCard
          type="loading"
          autoClose={false}
          title="Saving your project..."
          description="Please wait, saving in progress"
        />
      )}
      {updateExperienceQuery.isError && (
        <ToastCard
          type="error"
          title="Failed to Save Project"
          description="Couldn’t save your project, please try again"
          buttonProps={{
            content: 'Try Again',
          }}
        />
      )}

      {(updateExperienceQuery.isSuccess ||
        publishExperienceQuery.isSuccess) && (
        <ToastCard
          type="success"
          title={
            publishExperienceQuery.isSuccess
              ? 'Published Successfully!'
              : 'Saved Successfully'
          }
          description={
            publishExperienceQuery.isSuccess
              ? 'Your changes are published successfully'
              : 'Your changes are saved successfully'
          }
        />
      )}
      <TryOnSaveWarnModal
        onClose={handleStayOnPage}
        open={showSaveWarnModal}
        onDiscardChanges={handleDiscardChanges}
        onSaveAndExit={handleSaveAndExit}
      />
    </form>
  );
};

export default EditTryOnCategory;
