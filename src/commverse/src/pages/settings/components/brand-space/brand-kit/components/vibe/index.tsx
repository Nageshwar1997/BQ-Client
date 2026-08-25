import { Controller, useFieldArray, useForm } from 'react-hook-form';
import Input from '../../../../../../../components/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  ToastCardProps,
  UpdateVibeFormData,
  VibeFormData,
} from '../../../../../../../types';
import {
  brandVoiceValues,
  updateVibeSchema,
  vibeSchema,
} from '../../../../../../../schema/settings.schema';
import Divider from '../../../../../../../components/Divider';
import ToggleGroup from '../../../../../../../components/ToggleGroup';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../../../../../../components/Button';
import { Icon } from '@iconify/react';
import Modal from '../../../../../../../components/Modal';
import { useRegisterSettingsHeaderActions } from '../../../../../../../hooks/useRegisterSettingsHeaderActions';
import ToastCard from '../../../../../../../components/AlertCards/ToastCard';
import {
  useAddBrandItem,
  useDeleteBrandItem,
  useEditBrandItem,
  useGetBrand,
  useUpdateBrand,
} from '../../../../../../../services/auth-service';
import { deepEqual } from '../../../../../../../lib/utils';

type ModalStateType =
  | 'writingStyle'
  | 'preferredTerms'
  | 'forbiddenTerms'
  | null;

type ApiWritingStyle = {
  _id?: string;
  name?: string | null;
  instruction?: string | null;
  tag?: string | null;
};

type VoiceValue = (typeof brandVoiceValues)[number];

type ApiVibe = {
  archetype?: string | null;
  description?: string | null;
  preferredTerms?: string[];
  forbiddenTerms?: string[];
  voice?: {
    confident?: VoiceValue;
    energetic?: VoiceValue;
    professional?: VoiceValue;
    trust?: VoiceValue;
    friendly?: VoiceValue;
    authority?: VoiceValue;
  };
  writingStyle?: ApiWritingStyle[];
};

const Vibe = () => {
  const [modalState, setModalState] = useState<ModalStateType>(null);
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState(0);
  const [editingWritingStyleId, setEditingWritingStyleId] = useState<
    string | null
  >(null);

  const getBrandQuery = useGetBrand();
  const updateBrandQuery = useUpdateBrand();
  const addBrandItemQuery = useAddBrandItem();
  const editBrandItemQuery = useEditBrandItem();
  const deleteBrandItemQuery = useDeleteBrandItem();

  const showToast = (toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  };

  const preferredTermsSchema = vibeSchema.shape.preferredTerms;
  const forbiddenTermsSchema = vibeSchema.shape.forbiddenTerms;

  const apiVibe = useMemo<ApiVibe>(
    () => (getBrandQuery.data?.data?.kit?.vibe ?? {}) as ApiVibe,
    [getBrandQuery.data]
  );

  const defaultValues = useMemo<UpdateVibeFormData>(
    () => ({
      brandArchetype: apiVibe.archetype ?? '',
      description: apiVibe.description ?? '',
      brandVoice: {
        confident: apiVibe.voice?.confident ?? 'moderate',
        energetic: apiVibe.voice?.energetic ?? 'moderate',
        professional: apiVibe.voice?.professional ?? 'moderate',
        trust: apiVibe.voice?.trust ?? 'moderate',
        friendly: apiVibe.voice?.friendly ?? 'moderate',
        authority: apiVibe.voice?.authority ?? 'moderate',
      },
      preferredTerms: (apiVibe.preferredTerms ?? []).map((value) => ({
        value,
      })),
      forbiddenTerms: (apiVibe.forbiddenTerms ?? []).map((value) => ({
        value,
      })),
      writingStyle: [],
    }),
    [apiVibe]
  );

  const writingStyles = useMemo(
    () =>
      (apiVibe.writingStyle ?? []).map((style) => ({
        id: style._id ?? '',
        styleName: style.name ?? '',
        instructions: style.instruction ?? '',
        tags: style.tag ?? '',
      })),
    [apiVibe]
  );

  const writingStyleDefaultValue = useMemo<
    VibeFormData['writingStyle'][number]
  >(
    () => ({
      styleName: writingStyles[0]?.styleName ?? '',
      instructions: writingStyles[0]?.instructions ?? '',
      tags: writingStyles[0]?.tags ?? '',
    }),
    [writingStyles]
  );

  const termsDefaultValue = useMemo(
    () => ({
      preferred: (defaultValues.preferredTerms ?? [])
        .map((item) => item.value)
        .join(','),
      forbidden: (defaultValues.forbiddenTerms ?? [])
        .map((item) => item.value)
        .join(','),
    }),
    [defaultValues]
  );

  const vibeForm = useForm<UpdateVibeFormData>({
    resolver: zodResolver(updateVibeSchema),
    defaultValues,
  });
  const writingStyleForm = useForm<VibeFormData['writingStyle'][number]>({
    resolver: zodResolver(vibeSchema.shape.writingStyle.element),
    defaultValues: writingStyleDefaultValue,
  });
  const preferredTermsForm = useForm<VibeFormData['preferredTerms'][number]>({
    resolver: zodResolver(preferredTermsSchema.element),
    defaultValues: { value: termsDefaultValue.preferred },
  });
  const forbiddenTermsForm = useForm<VibeFormData['forbiddenTerms'][number]>({
    resolver: zodResolver(forbiddenTermsSchema.element),
    defaultValues: { value: termsDefaultValue.forbidden },
  });

  const preferredTermsArray = useFieldArray({
    control: vibeForm.control,
    name: 'preferredTerms',
  });
  const forbiddenTermsArray = useFieldArray({
    control: vibeForm.control,
    name: 'forbiddenTerms',
  });

  const voices = [
    'confident',
    'energetic',
    'professional',
    'trust',
    'friendly',
    'authority',
  ] as const;

  const handleModalClose = useCallback(() => {
    writingStyleForm.reset(writingStyleDefaultValue);
    setModalState(null);
    setEditingWritingStyleId(null);
  }, [writingStyleForm, writingStyleDefaultValue]);

  const onSubmit = useCallback(
    (data: UpdateVibeFormData) => {
      const oldBody = {
        archetype: apiVibe.archetype ?? '',
        description: apiVibe.description ?? '',
        voice: {
          confident: apiVibe.voice?.confident ?? 'moderate',
          energetic: apiVibe.voice?.energetic ?? 'moderate',
          professional: apiVibe.voice?.professional ?? 'moderate',
          trust: apiVibe.voice?.trust ?? 'moderate',
          friendly: apiVibe.voice?.friendly ?? 'moderate',
          authority: apiVibe.voice?.authority ?? 'moderate',
        },
        preferredTerms: apiVibe.preferredTerms ?? [],
        forbiddenTerms: apiVibe.forbiddenTerms ?? [],
      };

      const newBody = {
        archetype: data.brandArchetype ?? '',
        description: data.description ?? '',
        voice: {
          confident: data.brandVoice?.confident ?? 'moderate',
          energetic: data.brandVoice?.energetic ?? 'moderate',
          professional: data.brandVoice?.professional ?? 'moderate',
          trust: data.brandVoice?.trust ?? 'moderate',
          friendly: data.brandVoice?.friendly ?? 'moderate',
          authority: data.brandVoice?.authority ?? 'moderate',
        },
        preferredTerms: (data.preferredTerms ?? []).map((v) => v.value),
        forbiddenTerms: (data.forbiddenTerms ?? []).map((v) => v.value),
      };

      if (deepEqual(oldBody, newBody)) {
        showToast({
          type: 'warning',
          title: 'No changes found!',
          description: 'Please make some changes',
        });
        return;
      }

      const formData = new FormData();
      formData.append(
        'kit',
        JSON.stringify({
          vibe: newBody,
        })
      );

      updateBrandQuery.mutate(formData, {
        onSuccess: () => {
          showToast({
            type: 'success',
            title: 'Updated successfully!',
          });
          handleModalClose();
        },
        onError: (error) => {
          showToast({
            type: 'error',
            title: 'Unable to update!',
            description: error.message,
          });
        },
      });
    },
    [apiVibe, updateBrandQuery, handleModalClose]
  );

  const onCancel = useCallback(() => {
    vibeForm.reset(defaultValues);
    preferredTermsForm.reset({
      value: termsDefaultValue.preferred,
    });
    forbiddenTermsForm.reset({
      value: termsDefaultValue.forbidden,
    });
    handleModalClose();
  }, [
    vibeForm,
    defaultValues,
    preferredTermsForm,
    forbiddenTermsForm,
    termsDefaultValue,
    handleModalClose,
  ]);

  useRegisterSettingsHeaderActions(
    useMemo(() => ({
      saveBtnProps: {
        onClick: vibeForm.handleSubmit(onSubmit),
        isLoading: updateBrandQuery.isPending,
        disabled: updateBrandQuery.isPending,
      },
      cancelBtnProps: {
        onClick: onCancel,
        disabled: updateBrandQuery.isPending,
      },
    }), [vibeForm, onSubmit, onCancel, updateBrandQuery.isPending])
  );

  useEffect(() => {
    if (!getBrandQuery.data || getBrandQuery.isLoading || getBrandQuery.isError)
      return;

    vibeForm.reset(defaultValues);
    preferredTermsForm.reset({
      value: termsDefaultValue.preferred,
    });
    forbiddenTermsForm.reset({
      value: termsDefaultValue.forbidden,
    });
  }, [
    getBrandQuery.data,
    getBrandQuery.isLoading,
    getBrandQuery.isError,
    vibeForm,
    preferredTermsForm,
    forbiddenTermsForm,
    defaultValues,
    termsDefaultValue,
  ]);

  return (
    <form className="font-metropolis flex h-full flex-col gap-3 overflow-y-scroll">
      <Controller
        name="brandArchetype"
        control={vibeForm.control}
        render={({ field: { value, onChange, name } }) => (
          <Input
            label="Brand Archetype"
            type="text"
            name={name}
            value={value ?? ''}
            onChange={onChange}
            placeholder="Enter brand archetype"
            containerClassName="w-full"
            className="h-10 text-xs!"
            error={vibeForm.formState.errors.brandArchetype?.message}
          />
        )}
      />
      <Divider className="border-t-neutral-gray-200! border-transparent!" />

      <div className="flex flex-col gap-1">
        <div className="text-xs font-medium">Description</div>
        <Controller
          name="description"
          control={vibeForm.control}
          render={({ field: { value, onChange, name } }) => (
            <textarea
              name={name}
              value={value ?? ''}
              onChange={onChange}
              placeholder="My Description"
              className={`h-[86px] border ${vibeForm.formState.errors.description?.message ? 'border-ui-error' : 'border-neutral-gray-400'} bg-neutral-gray-100 placeholder:text-neutral-gray-500 resize-none rounded-lg px-3 py-2 text-xs`}
            />
          )}
        />
        {vibeForm.formState.errors.description?.message && (
          <span className="font-metropolis text-ui-error! flex gap-1 text-xs font-normal">
            <Icon icon="solar:info-circle-outline" className="h-4 min-w-4" />
            {vibeForm.formState.errors.description.message}
          </span>
        )}
      </div>
      <Divider className="border-t-neutral-gray-200! border-transparent!" />

      <div className="text-xs font-medium text-gray-700">Brand Voice</div>
      <div className="flex flex-col gap-0.5">
        {voices.map((voice, index) => (
          <Fragment key={voice}>
            <div className="flex items-center justify-between">
              <div className="text-neutral-gray-600 text-xs leading-[18px] font-medium capitalize">
                {voice}
              </div>
              <Controller
                name={`brandVoice.${voice}`}
                control={vibeForm.control}
                render={({ field: { onChange, value } }) => (
                  <ToggleGroup
                    data={[...brandVoiceValues]}
                    value={value}
                    onSelect={onChange}
                  />
                )}
              />
            </div>
            {vibeForm.formState.errors.brandVoice?.[voice]?.message && (
              <span className="font-metropolis text-ui-error! flex gap-1 text-xs font-normal">
                <Icon
                  icon="solar:info-circle-outline"
                  className="h-4 min-w-4"
                />
                {vibeForm.formState.errors.brandVoice?.[voice]?.message}
              </span>
            )}
            {index !== voices.length - 1 && (
              <Divider className="border-t-neutral-gray-200! border-transparent!" />
            )}
          </Fragment>
        ))}
      </div>
      <Divider className="border-t-neutral-gray-200! border-transparent!" />

      <div className="flex items-center justify-between">
        <div className="text-xs font-medium">Writing Style</div>
        <Button
          variant="tertiary"
          content="Add"
          size="sm"
          className="h-8! w-min!"
          onClick={() => {
            writingStyleForm.reset({
              styleName: '',
              instructions: '',
              tags: '',
            });
            setEditingWritingStyleId(null);
            setModalState('writingStyle');
          }}
        />
      </div>
      {writingStyles.map((style) => (
        <div
          key={style.id}
          className="border-neutral-gray-400 bg-neutral-gray-100 flex justify-between rounded-[20px] border p-4"
        >
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="text-neutral-gray-600 text-xs leading-4">
                {style.styleName}
              </div>
              <div className="text-sm leading-[21px] font-medium">
                {style.instructions}
              </div>
            </div>
            <div className="flex gap-2">
              {style.tags
                ?.split(',')
                ?.map((v: string) => v.trim())
                ?.filter(Boolean)
                ?.map((tag, tagIndex) => (
                  <div
                    key={tagIndex}
                    className="border-neutral-gray-400 bg-neutral-gray-300 rounded-[30px] border px-3 py-1 text-xs leading-[18px]"
                  >
                    {tag}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex items-start gap-1">
            <Icon
              icon="solar:pen-linear"
              className="text-neutral-gray-700 h-8 w-8 cursor-pointer p-1.5"
              onClick={() => {
                if (!style.id) return;
                writingStyleForm.reset({
                  styleName: style.styleName,
                  instructions: style.instructions,
                  tags: style.tags,
                });
                setEditingWritingStyleId(style.id);
                setModalState('writingStyle');
              }}
            />
            <Icon
              icon="solar:trash-bin-trash-linear"
              className="text-ui-error! h-8 w-8 cursor-pointer p-1.5"
              onClick={() => {
                if (!style.id) return;
                deleteBrandItemQuery.mutate(
                  { section: 'writing-style', itemId: style.id },
                  {
                    onSuccess: () => {
                      showToast({
                        type: 'success',
                        title: 'Deleted successfully!',
                      });
                    },
                    onError: (error) => {
                      showToast({
                        type: 'error',
                        title: 'Unable to delete!',
                        description: error.message,
                      });
                    },
                  }
                );
              }}
            />
          </div>
        </div>
      ))}
      {vibeForm.formState.errors.writingStyle?.message && (
        <span className="font-metropolis text-ui-error! flex gap-1 text-xs font-normal">
          <Icon icon="solar:info-circle-outline" className="h-4 min-w-4" />
          {vibeForm.formState.errors.writingStyle?.message}
        </span>
      )}
      <Divider className="border-t-neutral-gray-200! border-transparent!" />

      <div className="flex items-center justify-between">
        <div className="text-xs font-medium">Preferred Terms</div>
        <Button
          variant="tertiary"
          content="Edit"
          size="sm"
          className="h-8! w-min!"
          onClick={() => setModalState('preferredTerms')}
        />
      </div>
      {preferredTermsArray.fields.length > 0 && (
        <div className="border-neutral-gray-400 bg-neutral-gray-100 flex gap-2 rounded-[20px] border p-4">
          {preferredTermsArray.fields.map((item) => (
            <div
              key={item.id}
              className="border-neutral-gray-400 bg-neutral-gray-300 rounded-[30px] border px-3 py-1 text-xs"
            >
              {item.value}
            </div>
          ))}
        </div>
      )}
      {vibeForm.formState.errors.preferredTerms?.message && (
        <span className="font-metropolis text-ui-error! flex gap-1 text-xs font-normal">
          <Icon icon="solar:info-circle-outline" className="h-4 min-w-4" />
          {vibeForm.formState.errors.preferredTerms?.message}
        </span>
      )}
      <Divider className="border-t-neutral-gray-200! border-transparent!" />

      <div className="flex items-center justify-between">
        <div className="text-xs font-medium">Forbidden Terms</div>
        <Button
          variant="tertiary"
          content="Edit"
          size="sm"
          className="h-8! w-min!"
          onClick={() => setModalState('forbiddenTerms')}
        />
      </div>
      {forbiddenTermsArray.fields.length > 0 && (
        <div className="border-neutral-gray-400 bg-neutral-gray-100 flex gap-2 rounded-[20px] border p-4">
          {forbiddenTermsArray.fields.map((item) => (
            <div
              key={item.id}
              className="border-neutral-gray-400 bg-neutral-gray-300 rounded-[30px] border px-3 py-1 text-xs"
            >
              {item.value}
            </div>
          ))}
        </div>
      )}
      {vibeForm.formState.errors.forbiddenTerms?.message && (
        <span className="font-metropolis text-ui-error! flex gap-1 text-xs font-normal">
          <Icon icon="solar:info-circle-outline" className="h-4 min-w-4" />
          {vibeForm.formState.errors.forbiddenTerms?.message}
        </span>
      )}

      <Modal
        open={modalState !== null}
        onClose={handleModalClose}
        className="[&>div]:h-min [&>div]:max-h-none [&>div]:w-[516px]"
      >
        <div className="text-neutral-gray-900 flex h-full w-full flex-col items-center gap-6 p-10">
          {modalState === 'writingStyle' ? (
            <Fragment>
              <div className="self-start text-2xl leading-7 font-bold">
                {editingWritingStyleId
                  ? 'Edit Writing Style'
                  : 'Add Writing Style'}
              </div>
              <div className="flex w-full flex-col gap-5">
                <Input
                  label="Style Name"
                  type="text"
                  placeholder="eg. call to action"
                  containerClassName="w-full"
                  className="h-10"
                  error={writingStyleForm.formState.errors.styleName?.message}
                  {...writingStyleForm.register('styleName')}
                />
                <Input
                  label="Instructions"
                  type="text"
                  placeholder="eg. direct purchase-driven cta"
                  containerClassName="w-full"
                  className="h-10"
                  error={
                    writingStyleForm.formState.errors.instructions?.message
                  }
                  {...writingStyleForm.register('instructions')}
                />
                <div className="flex flex-col gap-1">
                  <Input
                    label="Tag"
                    type="text"
                    placeholder="eg. sales,urgent"
                    containerClassName="w-full"
                    className="h-10"
                    error={writingStyleForm.formState.errors.tags?.message}
                    {...writingStyleForm.register('tags')}
                  />
                  <div className="text-neutral-gray-600 text-[10px] leading-3.5">
                    Enter a comma after each tag
                  </div>
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  content="Cancel"
                  size="sm"
                  className="h-10!"
                  disabled={
                    addBrandItemQuery.isPending || editBrandItemQuery.isPending
                  }
                  onClick={handleModalClose}
                />
                <Button
                  content={
                    editingWritingStyleId ? 'Update Style' : 'Save Style'
                  }
                  size="sm"
                  className="h-10!"
                  isLoading={
                    addBrandItemQuery.isPending || editBrandItemQuery.isPending
                  }
                  disabled={
                    addBrandItemQuery.isPending || editBrandItemQuery.isPending
                  }
                  onClick={writingStyleForm.handleSubmit((data) => {
                    const formData = new FormData();
                    formData.append('name', data.styleName);
                    formData.append('instruction', data.instructions);
                    formData.append('tag', data.tags);

                    if (editingWritingStyleId) {
                      editBrandItemQuery.mutate(
                        {
                          section: 'writing-style',
                          itemId: editingWritingStyleId,
                          body: formData,
                        },
                        {
                          onSuccess: () => {
                            showToast({
                              type: 'success',
                              title: 'Updated successfully!',
                            });
                            handleModalClose();
                          },
                          onError: (error) => {
                            showToast({
                              type: 'error',
                              title: 'Unable to update!',
                              description: error.message,
                            });
                          },
                        }
                      );
                      return;
                    }

                    addBrandItemQuery.mutate(
                      { section: 'writing-style', body: formData },
                      {
                        onSuccess: () => {
                          showToast({
                            type: 'success',
                            title: 'Added successfully!',
                          });
                          handleModalClose();
                        },
                        onError: (error) => {
                          showToast({
                            type: 'error',
                            title: 'Unable to add!',
                            description: error.message,
                          });
                        },
                      }
                    );
                  })}
                />
              </div>
            </Fragment>
          ) : modalState === 'preferredTerms' ? (
            <Fragment>
              <div className="self-start text-2xl leading-7 font-bold">
                {preferredTermsArray.fields.length > 0
                  ? 'Edit Preferred Terms'
                  : 'Add Preferred Terms'}
              </div>
              <div className="flex w-full flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <Controller
                    control={preferredTermsForm.control}
                    name="value"
                    render={({ field: { value, onChange } }) => (
                      <Input
                        label="Enter terms"
                        type="text"
                        placeholder="eg. top picks for you, big deals"
                        containerClassName="w-full"
                        className="h-10"
                        value={value}
                        onChange={onChange}
                        error={
                          preferredTermsForm.formState.errors.value?.message
                        }
                      />
                    )}
                  />
                  <div className="text-neutral-gray-600 text-[10px] leading-3.5">
                    Enter a comma after each tag
                  </div>
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  content="Cancel"
                  size="sm"
                  className="h-10!"
                  onClick={handleModalClose}
                />
                <Button
                  content={
                    preferredTermsArray.fields.length > 0
                      ? 'Update Terms'
                      : 'Save Terms'
                  }
                  size="sm"
                  className="h-10!"
                  onClick={preferredTermsForm.handleSubmit((data) => {
                    const values = data.value
                      .split(',')
                      .map((v) => v.trim())
                      .filter(Boolean)
                      .map((v) => ({ value: v }));

                    const result = preferredTermsSchema.safeParse(values);
                    if (!result.success) {
                      preferredTermsForm.setError('value', {
                        message: result.error.issues[0].message,
                      });
                      return;
                    }
                    preferredTermsArray.replace(values);
                    handleModalClose();
                  })}
                />
              </div>
            </Fragment>
          ) : (
            <Fragment>
              <div className="self-start text-2xl leading-7 font-bold">
                {forbiddenTermsArray.fields.length > 0
                  ? 'Edit Forbidden Terms'
                  : 'Add Forbidden Terms'}
              </div>
              <div className="flex w-full flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <Input
                    label="Tag"
                    type="text"
                    placeholder="eg. sales,urgent"
                    containerClassName="w-full"
                    className="h-10"
                    error={forbiddenTermsForm.formState.errors.value?.message}
                    {...forbiddenTermsForm.register('value')}
                  />
                  <div className="text-neutral-gray-600 text-[10px] leading-3.5">
                    Enter a comma after each tag
                  </div>
                </div>
              </div>
              <div className="grid w-full grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  content="Cancel"
                  size="sm"
                  className="h-10!"
                  onClick={handleModalClose}
                />
                <Button
                  content={
                    forbiddenTermsArray.fields.length > 0
                      ? 'Update Terms'
                      : 'Save Terms'
                  }
                  size="sm"
                  className="h-10!"
                  onClick={forbiddenTermsForm.handleSubmit((data) => {
                    const values = data.value
                      .split(',')
                      .map((v) => v.trim())
                      .filter(Boolean)
                      .map((v) => ({ value: v }));

                    const result = forbiddenTermsSchema.safeParse(values);
                    if (!result.success) {
                      forbiddenTermsForm.setError('value', {
                        message: result.error.issues[0].message,
                      });
                      return;
                    }
                    forbiddenTermsArray.replace(values);
                    handleModalClose();
                  })}
                />
              </div>
            </Fragment>
          )}
        </div>
      </Modal>

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}
    </form>
  );
};

export default Vibe;
