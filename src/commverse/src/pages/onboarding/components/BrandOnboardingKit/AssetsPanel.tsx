import { Fragment, useCallback, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import Button from '../../../../components/Button';
import Divider from '../../../../components/Divider';
import Modal from '../../../../components/Modal';
import Input from '../../../../components/Input';
import ImageInput from '../../../../components/Input/ImageInput';
import TagInput from '../../../../components/Input/TagInput';
import ToastCard from '../../../../components/AlertCards/ToastCard';
import { assetsSchema } from '../../../../schema/settings.schema';
import {
  useAddBrandItem,
  useDeleteBrandItem,
  useEditBrandItem,
} from '../../../../services/auth-service';
import type { AssetsFormData, ToastCardProps } from '../../../../types';
import type { OnboardingAssetItem, OnboardingBrandKitData } from '../../../../types/onboarding';
import type { SectionKey } from './types';

export function AssetsPanel({
  data,
  onChange,
}: {
  data: OnboardingBrandKitData['assets'];
  onChange: (next: OnboardingBrandKitData['assets']) => void;
}) {
  const addBrandItemQuery = useAddBrandItem();
  const editBrandItemQuery = useEditBrandItem();
  const deleteBrandItemQuery = useDeleteBrandItem();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    register,
    formState: { errors },
  } = useForm<AssetsFormData>({
    resolver: zodResolver(assetsSchema),
  });

  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState(0);
  const [activeSection, setActiveSection] = useState<
    'Characters' | 'Poses' | 'Backgrounds' | null
  >(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

  const photo = useWatch({
    control,
    name: 'photo',
  });

  const showToast = (toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  };

  const allAssets = useMemo(
    () => [
      {
        title: 'Characters' as const,
        section: 'characters' as const,
        items: data.characters,
      },
      {
        title: 'Poses' as const,
        section: 'poses' as const,
        items: data.poses,
      },
      {
        title: 'Backgrounds' as const,
        section: 'backgrounds' as const,
        items: data.backgrounds,
      },
    ],
    [data]
  );

  const activeSectionConfig = useMemo(
    () => allAssets.find((asset) => asset.title === activeSection),
    [allAssets, activeSection]
  );

  const handleModalClose = useCallback(() => {
    reset();
    setActiveSection(null);
    setEditingItemId(null);
    setSelectedPhotoFile(null);
  }, [reset]);

  const onSubmit = (formData: AssetsFormData) => {
    if (!activeSectionConfig) return;

    const tags = (formData.tags ?? [])
      .map((tag) => tag.value.trim())
      .filter(Boolean)
      .join(',');
    const sectionKey = activeSectionConfig.section;

    const imageValue =
      selectedPhotoFile != null
        ? URL.createObjectURL(selectedPhotoFile)
        : typeof formData.photo === 'string'
          ? formData.photo
          : '';

    const nextItem: OnboardingAssetItem = {
      id: editingItemId ?? crypto.randomUUID(),
      image: imageValue,
      name: formData.name,
      tag: tags,
    };

    if (editingItemId) {
      const body = new FormData();
      body.append('name', formData.name);
      body.append('tag', tags);
      if (selectedPhotoFile) {
        body.append('image', selectedPhotoFile);
      } else if (typeof formData.photo === 'string') {
        body.append('image', formData.photo);
      }

      editBrandItemQuery.mutate(
        {
          section: sectionKey,
          itemId: editingItemId,
          body,
        },
        {
          onSuccess: () => {
            onChange({
              ...data,
              [sectionKey]: data[sectionKey].map((item) =>
                item.id === editingItemId ? nextItem : item
              ),
            });
            showToast({ type: 'success', title: 'Updated successfully!' });
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

    const body = new FormData();
    body.append('name', formData.name);
    body.append('tag', tags);
    if (selectedPhotoFile) {
      body.append('image', selectedPhotoFile);
    } else if (typeof formData.photo === 'string') {
      body.append('image', formData.photo);
    }

    addBrandItemQuery.mutate(
      { section: sectionKey, body },
      {
        onSuccess: () => {
          onChange({
            ...data,
            [sectionKey]: [...data[sectionKey], nextItem],
          });
          showToast({ type: 'success', title: 'Added successfully!' });
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
  };

  const onDelete = useCallback(
    (section: SectionKey, itemId: string) => {
      deleteBrandItemQuery.mutate(
        { section, itemId },
        {
          onSuccess: () => {
            onChange({
              ...data,
              [section]: data[section].filter((item) => item.id !== itemId),
            });
            showToast({ type: 'success', title: 'Deleted successfully!' });
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
    },
    [data, deleteBrandItemQuery, onChange]
  );

  return (
    <div className="flex h-full flex-col gap-3 overflow-y-scroll">
      {allAssets.map((asset, index) => {
        return (
          <Fragment key={index}>
            <div className="flex flex-col gap-2 text-xs leading-[18px] font-medium">
              <div className="flex items-center justify-between">
                <div>{asset.title}</div>
                <Button
                  variant="tertiary"
                  content="Add"
                  size="sm"
                  className="h-8! w-min"
                  onClick={() => {
                    setEditingItemId(null);
                    setSelectedPhotoFile(null);
                    setActiveSection(asset.title);
                  }}
                />
              </div>
              {asset.items.length ? (
                <div className="grid grid-cols-3 items-center justify-between gap-3">
                  {asset.items.map((item) => {
                    const tags = item.tag
                      .split(',')
                      .map((tag) => tag.trim())
                      .filter(Boolean);

                    return (
                      <div
                        key={item.id}
                        className="border-neutral-gray-200 bg-neutral-gray-100 flex h-[228px] flex-col overflow-hidden rounded-xl border"
                      >
                        <img
                          src={item.image}
                          className="max-h-[150px] min-h-[150px] w-full grow object-cover"
                        />
                        <div className="flex grow flex-col p-3 leading-[18px]">
                          <div className="text-neutral-gray-900 grow text-sm font-medium">
                            {item.name}
                          </div>
                          {tags.length > 0 && (
                            <div className="text-neutral-gray-600 flex flex-wrap items-center gap-1 text-xs">
                              {tags.map((tag, tagIndex) => (
                                <Fragment key={tagIndex}>
                                  <span>{tag}</span>
                                  {tagIndex !== tags.length - 1 && (
                                    <span className="text-neutral-gray-600">
                                      •
                                    </span>
                                  )}
                                </Fragment>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 flex items-center justify-end gap-2">
                            <Icon
                              icon="solar:pen-linear"
                              className="text-neutral-gray-700 h-6 w-6 cursor-pointer rounded-md p-1"
                              onClick={() => {
                                setActiveSection(asset.title);
                                setEditingItemId(item.id);
                                setSelectedPhotoFile(null);
                                reset({
                                  name: item.name,
                                  tags: tags.map((tag) => ({ value: tag })),
                                  photo: item.image,
                                });
                              }}
                            />
                            <Icon
                              icon="solar:trash-bin-trash-linear"
                              className="text-ui-error h-6 w-6 cursor-pointer rounded-md p-1"
                              onClick={() => onDelete(asset.section, item.id)}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <Divider className="border-t-neutral-gray-200! border-transparent!" />
          </Fragment>
        );
      })}

      <Modal
        open={activeSection !== null}
        onClose={handleModalClose}
        className="[&>div]:h-min [&>div]:max-h-none [&>div]:w-[516px]"
      >
        <div className="text-neutral-gray-900 flex h-full w-full flex-col items-center gap-6 p-10">
          <div className="self-start text-2xl leading-7 font-bold">
            {editingItemId ? 'Edit Asset' : 'Add Asset'}
          </div>
          <Input
            label="Enter Name"
            type="text"
            placeholder="Name of the Asset"
            containerClassName="w-full"
            className="h-10 text-xs!"
            error={errors.name?.message}
            {...register('name')}
          />
          <Controller
            name="tags"
            control={control}
            defaultValue={[]}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TagInput
                label="Tag (optional)"
                setValue={onChange}
                placeholder="Enter tags"
                selectedTagsData={value}
                errorText={error?.message}
                className="[&>div:last-child]:opacity-100!"
                multiSelect={true}
              />
            )}
          />
          <div className="flex w-full flex-col gap-1">
            <ImageInput
              label="Drop your Images here"
              description="JPG/PNG/WebP upto 5MB each"
              variant="brand-kit"
              previewImage={typeof photo === 'string' ? photo : undefined}
              onChange={(fileList) => {
                const file = fileList?.[0];
                if (file) {
                  setSelectedPhotoFile(file);
                  setValue('photo', file, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }
              }}
              onClose={() => {
                setSelectedPhotoFile(null);
                setValue('photo', null, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              errorText={errors.photo?.message as string}
            />
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
              content={editingItemId ? 'Save' : 'Submit'}
              size="sm"
              className="h-10!"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </div>
      </Modal>

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}
    </div>
  );
}
