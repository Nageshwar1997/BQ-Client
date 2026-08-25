import { Controller, useForm, useWatch } from 'react-hook-form';
import Divider from '../../../../../components/Divider';
import Input from '../../../../../components/Input';
import type {
  LinkFormData,
  ToastCardProps,
  UpdateBrandProfileFormData,
} from '../../../../../types';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  linkSchema,
  updateBrandProfileSchema,
} from '../../../../../schema/settings.schema';
import { useRegisterSettingsHeaderActions } from '../../../../../hooks/useRegisterSettingsHeaderActions';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ImageInput from '../../../../../components/Input/ImageInput';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  YoutubeIcon,
} from '../../../../../icons';
import Button from '../../../../../components/Button';
import Modal from '../../../../../components/Modal';
import ToastCard from '../../../../../components/AlertCards/ToastCard';
import IconInput from '../../../../../components/IconInput';
import {
  useGetBrand,
  useUpdateBrand,
} from '../../../../../services/auth-service';
import { deepEqual, getImageUrl } from '../../../../../lib/utils';
import buildBrandFormData from './components/buildBrandFormData';

type BrandProfilePayload = {
  photo: File | string | null | undefined;
  name: string | undefined;
  email: string | undefined;
  instagram: string | undefined;
  facebook: string | undefined;
  x: string | undefined;
  tiktok: string | undefined;
  youtube: string | undefined;
  linkedin: string | undefined;
};

const BrandProfile = () => {
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState<number>(0);
  const [modalState, setModalState] = useState<'disable' | 'open' | 'close'>(
    'close'
  );
  const initialBrandProfileKeyRef = useRef('');

  const [isLinkEntered, setIsLinkEntered] = useState<boolean>(false); // auto sync api call
  const getBrandQuery = useGetBrand();
  const updateBrandQuery = useUpdateBrand();

  const brandProfileForm = useForm<UpdateBrandProfileFormData>({
    resolver: zodResolver(updateBrandProfileSchema),
    shouldFocusError: false,
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = brandProfileForm;
  const linkForm = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    shouldFocusError: false,
    defaultValues: {
      link: '',
    },
  });
  const watchedPhoto = useWatch({
    control,
    name: 'photo',
  });
  const saveButtonLabel = watchedPhoto === null ? 'Save\u200b' : 'Save';

  const initialBrandProfileValues = useMemo(() => {
    const profile = getBrandQuery.data?.data?.profile;

    return {
      photo: getImageUrl(profile?.profilePhoto),
      name: profile?.name ?? undefined,
      email: profile?.email ?? undefined,
      instagram: profile?.socialLinks?.instagram ?? undefined,
      facebook: profile?.socialLinks?.facebook ?? undefined,
      x: profile?.socialLinks?.x ?? undefined,
      tiktok: profile?.socialLinks?.tiktok ?? undefined,
      youtube: profile?.socialLinks?.youtube ?? undefined,
      linkedin: profile?.socialLinks?.linkedin ?? undefined,
    };
  }, [
    getBrandQuery.data?.data?.profile?.profilePhoto,
    getBrandQuery.data?.data?.profile?.name,
    getBrandQuery.data?.data?.profile?.email,
    getBrandQuery.data?.data?.profile?.socialLinks?.instagram,
    getBrandQuery.data?.data?.profile?.socialLinks?.facebook,
    getBrandQuery.data?.data?.profile?.socialLinks?.x,
    getBrandQuery.data?.data?.profile?.socialLinks?.tiktok,
    getBrandQuery.data?.data?.profile?.socialLinks?.youtube,
    getBrandQuery.data?.data?.profile?.socialLinks?.linkedin,
  ]);
  const initialBrandProfileKey = useMemo(
    () => JSON.stringify(initialBrandProfileValues),
    [initialBrandProfileValues]
  );

  const showToast = (toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  };

  const onSubmit = useCallback(
    (data: UpdateBrandProfileFormData) => {
      const oldData = getBrandQuery.data?.data;
      if (!oldData) return;

      const oldBody: BrandProfilePayload = {
        photo: getImageUrl(oldData.profile.profilePhoto),
        name: oldData.profile.name ?? undefined,
        email: oldData.profile.email ?? undefined,
        instagram: oldData.profile.socialLinks?.instagram ?? undefined,
        facebook: oldData.profile.socialLinks?.facebook ?? undefined,
        x: oldData.profile.socialLinks?.x ?? undefined,
        tiktok: oldData.profile.socialLinks?.tiktok ?? undefined,
        youtube: oldData.profile.socialLinks?.youtube ?? undefined,
        linkedin: oldData.profile.socialLinks?.linkedin ?? undefined,
      };

      const newBody: BrandProfilePayload = {
        photo: watchedPhoto ?? null,
        name: data.name,
        email: data.email,
        instagram: data.instagram,
        facebook: data.facebook,
        x: data.x,
        tiktok: data.tiktok,
        youtube: data.youtube,
        linkedin: data.linkedin,
      };

      if (deepEqual(oldBody, newBody)) {
        showToast({
          type: 'warning',
          title: 'No changes found!',
          description: 'Please make some changes',
        });
      } else {
        const formData = buildBrandFormData({ oldBody, newBody });

        updateBrandQuery.mutate(formData, {
          onSuccess: () => {
            showToast({
              type: 'success',
              title: 'Updated successfully!',
            });
          },
          onError: (error) => {
            showToast({
              type: 'error',
              title: 'Unable to update!',
              description: error.message,
            });
          },
        });
      }
    },
    [getBrandQuery.data, updateBrandQuery, watchedPhoto]
  );

  const onCancel = useCallback(() => {
    reset();
  }, [reset]);

  useRegisterSettingsHeaderActions(
    useMemo(() => ({
      saveBtnProps: {
        content: saveButtonLabel,
        onClick: handleSubmit(onSubmit),
        isLoading: updateBrandQuery.isPending,
        disabled: updateBrandQuery.isPending,
      },
      cancelBtnProps: {
        onClick: onCancel,
        disabled: updateBrandQuery.isPending,
      },
    }), [handleSubmit, onCancel, onSubmit, saveButtonLabel, updateBrandQuery.isPending])
  );

  useEffect(() => {
    if (!getBrandQuery.data || getBrandQuery.isLoading || getBrandQuery.isError)
      return;
    if (initialBrandProfileKeyRef.current === initialBrandProfileKey) return;

    initialBrandProfileKeyRef.current = initialBrandProfileKey;
    reset(initialBrandProfileValues);
  }, [
    getBrandQuery.data,
    getBrandQuery.isLoading,
    getBrandQuery.isError,
    initialBrandProfileKey,
    initialBrandProfileValues,
    reset,
  ]);

  return (
    <div className="text-neutral-gray-900 font-metropolis flex max-w-3/5 flex-col gap-4">
      {/* {modalState !== 'disable' && (
        <div
          className="border-neutral-gray-200 relative flex flex-col gap-4 overflow-hidden rounded-[20px] border p-5"
          style={{
            background:
              'linear-gradient(179deg, #FFF 1.19%, rgba(255, 255, 255, 0.00) 98.8%), linear-gradient(89deg, rgba(255, 168, 0, 0.08) 0%, rgba(25, 187, 125, 0.08) 24.91%, rgba(0, 82, 204, 0.08) 48.82%, rgba(69, 164, 236, 0.08) 72.18%, rgba(184, 95, 255, 0.08) 88.31%)',
          }}
        >
          <img
            src="/assets/icons/brand-profile-bg.svg"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="flex flex-col gap-2">
            <div className="text-xl leading-[30px] font-bold">
              Auto Sync Your Brand Profile & Style
            </div>
            <div className="text-neutral-gray-700 text-xs font-medium">
              Add your brand website sync brand assets and Kit ready, You'll get
              an easy way to create outstanding designs and stay on brand.
            </div>
          </div>
          <div className="flex h-8 gap-[18px]">
            <Button
              variant="tertiary"
              content="Add Website"
              size="sm"
              className="w-min"
              onClick={() => setModalState('open')}
            />
            <Button
              variant="ghost"
              content="Skip"
              size="sm"
              className="w-min bg-transparent"
              onClick={() => setModalState('disable')}
            />
          </div>
        </div>
      )} */}

      <form className="flex flex-col gap-3">
        <div className="leading-5 font-semibold">Brand Profile</div>
        <Controller
          name="photo"
          control={control}
          render={({ field: { value, onChange } }) => (
            <ImageInput
              label="Brand logo"
              description="CO"
              previewImage={
                value === null
                  ? ''
                  : typeof value === 'string'
                    ? value
                    : undefined
              }
              onChange={(fileList) => {
                const file = fileList?.[0];
                if (file) {
                  onChange(file);
                }
              }}
              onClose={() => onChange(null)}
              errorText={errors.photo?.message as string}
            />
          )}
        />
        <Divider className="border-t-neutral-gray-200! border-transparent!" />
        <Controller
          name="name"
          control={control}
          render={({ field: { value, onChange, name } }) => (
            <Input
              label="Brand Name"
              type="text"
              name={name}
              value={value ?? ''}
              onChange={onChange}
              placeholder="Enter name"
              className="placeholder:text-neutral-gray-500! h-10 text-xs!"
              error={errors.name?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field: { value, onChange, name } }) => (
            <Input
              label="Email"
              type="email"
              name={name}
              value={value ?? ''}
              onChange={onChange}
              placeholder="Enter email"
              className="placeholder:text-neutral-gray-500! h-10 text-xs!"
              error={errors.email?.message}
            />
          )}
        />
        <Divider className="border-t-neutral-gray-200! border-transparent!" />
        <div className="flex flex-col gap-1 text-xs">
          <div className="leading-[18px] font-medium">Social Links</div>
          <div className="text-neutral-gray-600 leading-[18px] font-medium">
            Enter brand username
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <Controller
              name="instagram"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <IconInput
                  type="text"
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  leftAddon={<InstagramIcon />}
                  placeholder="instagram.com/"
                  className="placeholder:text-neutral-gray-500! h-10 pl-9! text-xs!"
                  error={errors.instagram?.message}
                />
              )}
            />
            <Controller
              name="facebook"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <IconInput
                  type="text"
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  leftAddon={<FacebookIcon />}
                  placeholder="facebook.com/"
                  className="placeholder:text-neutral-gray-500! h-10 pl-9! text-xs!"
                  error={errors.facebook?.message}
                />
              )}
            />
            <Controller
              name="x"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <IconInput
                  type="text"
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  leftAddon={<img src="/assets/icons/twitter-logo.svg" />}
                  placeholder="x.com/"
                  className="placeholder:text-neutral-gray-500! h-10 pl-9! text-xs!"
                  error={errors.x?.message}
                />
              )}
            />
            <Controller
              name="tiktok"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <IconInput
                  type="text"
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  leftAddon={<TiktokIcon />}
                  placeholder="tiktok.com/"
                  className="placeholder:text-neutral-gray-500! h-10 pl-9! text-xs!"
                  error={errors.tiktok?.message}
                />
              )}
            />
            <Controller
              name="youtube"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <IconInput
                  type="text"
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  leftAddon={<YoutubeIcon />}
                  placeholder="youtube.com/"
                  className="placeholder:text-neutral-gray-500! h-10 pl-9! text-xs!"
                  error={errors.youtube?.message}
                />
              )}
            />
            <Controller
              name="linkedin"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <IconInput
                  type="text"
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  leftAddon={<LinkedinIcon />}
                  placeholder="linkedin.com/"
                  className="placeholder:text-neutral-gray-500! h-10 pl-9! text-xs!"
                  error={errors.linkedin?.message}
                />
              )}
            />
          </div>
        </div>
      </form>

      <Modal
        open={modalState === 'open'}
        onClose={() => setModalState('close')}
        className="[&>div]:h-min [&>div]:max-h-none [&>div]:w-[516px]"
      >
        <div className="text-neutral-gray-900 flex h-full w-full flex-col items-center gap-6 p-10">
          <div className="flex flex-col gap-2 self-start">
            <div className="text-2xl leading-7 font-bold">
              Auto Sync Your Brand Profile & Style
            </div>
            <div className="text-xs leading-[18px] font-medium">
              Type or paste your brand's website link
            </div>
          </div>
          {isLinkEntered && (
            <img
              src="/assets/icons/brand-profile-auto-bg.svg"
              className="h-[234px] w-full object-cover"
            />
          )}
          <Input
            label="Brand Link"
            type="url"
            placeholder="Type & Paste Link"
            containerClassName="w-full"
            className="h-10"
            error={linkForm.formState.errors.link?.message}
            {...linkForm.register('link')}
          />
          <div className="grid w-full grid-cols-2 gap-3">
            <Button
              variant="secondary"
              content="Skip"
              disabled={isLinkEntered}
              size="sm"
              className="h-10!"
              onClick={() => setModalState('close')}
            />
            <Button
              content={isLinkEntered ? 'Scanning' : 'Confirm'}
              isLoading={isLinkEntered}
              size="sm"
              className="h-10!"
              onClick={linkForm.handleSubmit((data) => {
                console.log('link form submit', data);
                setIsLinkEntered(true);
                setTimeout(() => {
                  setIsLinkEntered(false);
                  setModalState('disable');
                  showToast({
                    type: 'success',
                    title: 'Brand auto synced successfully!',
                    description:
                      'Your brand has been auto synced successfully.',
                  });
                }, 5000);
              })}
            />
          </div>
          {isLinkEntered && (
            <div className="text-neutral-gray-700 flex items-center gap-3 text-xs font-medium">
              <div>You can keep exploring — we'll notify you when done.</div>
              <Button
                variant="link"
                size="sm"
                content="Continue"
                className="text-neutral-gray-700 text-xs!"
                onClick={() => setModalState('close')}
              />
            </div>
          )}
        </div>
      </Modal>

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}
    </div>
  );
};

export default BrandProfile;
