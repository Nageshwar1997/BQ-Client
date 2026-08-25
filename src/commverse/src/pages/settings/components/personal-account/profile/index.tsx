import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
// import { Icon } from '@iconify/react';
import Button from '../../../../../components/Button';
import Divider from '../../../../../components/Divider';
import Input from '../../../../../components/Input';
import IconInput from '../../../../../components/IconInput';
import ImageInput from '../../../../../components/Input/ImageInput';
import PhoneInput from '../../../../../components/PhoneInput';
import FilterDropdown from '../../../../../components/FilterDropdown';
import Modal from '../../../../../components/Modal';
import ToastCard from '../../../../../components/AlertCards/ToastCard';
import { isPhoneNumberValid } from '../../../../../schema/auth.schema';
import { useRegisterSettingsHeaderActions } from '../../../../../hooks/useRegisterSettingsHeaderActions';
import {
  useGetUserDetail,
  useUpdateProfile,
  useSendPhoneOtpForUser,
  useVerifyPhoneOtpForUser,
} from '../../../../../services/auth-service';
import {
  deepEqual,
  getChangedFields,
  getUser,
  getImageUrl,
  saveUser,
} from '../../../../../lib/utils';
import type { SelectedOption, ToastCardProps } from '../../../../../types';
import type { UserData } from '../../../../../services/api';
// import { languageData } from '../../../../../data';
import { InstagramIcon, LinkedinIcon } from '../../../../../icons';
import {
  getCountryCallingCode,
  parsePhoneNumber,
  type Country,
} from 'react-phone-number-input';

const DEFAULT_COUNTRY: Country = 'IN';
const OTP_TIMEOUT_SECONDS = 30;
const PHONE_EDITING_DISABLED = true;

type PersonalProfileFormData = {
  photo: File | string | null;
  name: string;
  email: string;
  profession: string;
  professionCustom: string;
  language: string;
  instagramUser: string;
  linkedinUser: string;
};

type PhoneEditFormData = {
  newPhone: string;
  otp: string;
};

const PROFESSION_OPTIONS = [
  'Marketing',
  'Design',
  'Sales',
  'Product',
  '3D Design',
  'Development',
  'Founder',
  'Other',
];

const resolveProfession = (
  selectedProfession: string,
  customProfession: string
) => {
  if (selectedProfession === 'Other') {
    return (customProfession ?? '').trim();
  }

  return (selectedProfession ?? '').trim();
};

const sanitizePhoneNumber = (value: string) =>
  value.replace(/\D/g, '').slice(0, 15);

const getCountryFromPhone = (
  countryCode?: string | null,
  phoneNumber?: string | null
): Country => {
  if (!phoneNumber?.trim()) return DEFAULT_COUNTRY;

  const parsed = parsePhoneNumber(
    `${countryCode ?? `+${getCountryCallingCode(DEFAULT_COUNTRY)}`}${phoneNumber ?? ''}`
  );

  return parsed?.country ?? DEFAULT_COUNTRY;
};

const getApiErrorMessage = (error: unknown, fallback: string) =>
  (
    error as {
      message?: string;
      response?: { data?: { message?: string } };
    }
  )?.response?.data?.message ??
  (error as { message?: string })?.message ??
  fallback;

const persistVerifiedPhone = (
  countryCode: string,
  number: string,
  apiUser?: UserData['user']
) => {
  const existing = getUser();

  if (!existing?.token) return;

  if (apiUser) {
    saveUser({
      token: existing.token,
      user: { ...existing.user, ...apiUser },
    });
    return;
  }

  saveUser({
    token: existing.token,
    user: {
      ...existing.user,
      phone: {
        countryCode,
        number,
        isVerified: true,
      },
    },
  });
};

const Profile = () => {
  const getUserDetailQuery = useGetUserDetail();
  const updateProfileQuery = useUpdateProfile();
  const sendPhoneOtpMutation = useSendPhoneOtpForUser();
  const verifyPhoneOtpMutation = useVerifyPhoneOtpForUser();
  const [toastCardProps, setToastCardProps] = useState<ToastCardProps>();
  const [toastId, setToastId] = useState<number>(0);

  // Phone update state
  const [phoneOverride, setPhoneOverride] = useState<string | null>(null);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneSendError, setPhoneSendError] = useState('');
  const [phoneSecondsLeft, setPhoneSecondsLeft] = useState(0);
  const [newPhoneCountry, setNewPhoneCountry] =
    useState<Country>(DEFAULT_COUNTRY);
  const initialFormValuesKeyRef = useRef('');

  const {
    control,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
    handleSubmit,
    reset,
  } = useForm<PersonalProfileFormData>({
    shouldFocusError: false,
    defaultValues: {
      photo: null,
      name: '',
      email: '',
      profession: '',
      professionCustom: '',
      language: '',
      instagramUser: '',
      linkedinUser: '',
    },
  });

  const phoneEditForm = useForm<PhoneEditFormData>({
    shouldFocusError: false,
    mode: 'onChange',
    defaultValues: {
      newPhone: '',
      otp: '',
    },
  });

  const {
    control: phoneEditControl,
    clearErrors: clearPhoneEditErrors,
    getValues: getPhoneEditValues,
    setError: setPhoneEditError,
    setValue: setPhoneEditValue,
    reset: resetPhoneEditForm,
    formState: { errors: phoneEditErrors },
  } = phoneEditForm;

  const watchedProfession = useWatch({
    control,
    name: 'profession',
  });
  const watchedPhoto = useWatch({
    control,
    name: 'photo',
  });
  const saveButtonLabel = watchedPhoto === null ? 'Save\u200b' : 'Save';
  const watchedNewPhone = useWatch({
    control: phoneEditControl,
    name: 'newPhone',
  });
  const watchedPhoneOtp = useWatch({
    control: phoneEditControl,
    name: 'otp',
  });

  const initialFormValues = useMemo<PersonalProfileFormData>(() => {
    const data = getUserDetailQuery.data;
    const apiProfession = (data?.profession as string) ?? '';
    const isPresetProfession = PROFESSION_OPTIONS.includes(apiProfession);
    const socialLinks = data?.socialLinks as Record<string, string> | undefined;

    return {
      photo: getImageUrl(data?.profilePhoto as string) ?? null,
      name: (data?.name as string) ?? '',
      email: (data?.email as string) ?? '',
      profession: apiProfession
        ? isPresetProfession
          ? apiProfession
          : 'Other'
        : '',
      professionCustom:
        apiProfession && !isPresetProfession ? apiProfession : '',
      language: (data?.language as string) ?? '',
      instagramUser: socialLinks?.instagram ?? '',
      linkedinUser: socialLinks?.linkedin ?? '',
    };
  }, [
    getUserDetailQuery.data?.profilePhoto,
    getUserDetailQuery.data?.name,
    getUserDetailQuery.data?.email,
    getUserDetailQuery.data?.profession,
    getUserDetailQuery.data?.language,
    getUserDetailQuery.data?.socialLinks?.instagram,
    getUserDetailQuery.data?.socialLinks?.linkedin,
  ]);

  const initialFormValuesKey = useMemo(
    () => JSON.stringify(initialFormValues),
    [initialFormValues]
  );

  const phoneData = getUserDetailQuery.data?.phone as
    | { countryCode?: string; number?: string; isVerified?: boolean }
    | undefined;
  const phone = phoneOverride ?? phoneData?.number ?? '';
  const phoneCountryCode =
    phoneData?.countryCode ?? `+${getCountryCallingCode(DEFAULT_COUNTRY)}`;
  const phoneCountry = getCountryFromPhone(phoneCountryCode, phone);
  // const otpVerified = otpVerifiedOverride ?? phoneData?.isVerified ?? false;

  // Countdown timer for phone OTP
  useEffect(() => {
    if (phoneSecondsLeft <= 0) return;

    const id = window.setTimeout(() => {
      setPhoneSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(id);
  }, [phoneSecondsLeft]);

  const userInitials = useMemo(() => {
    const name = getUserDetailQuery.data?.name?.trim() ?? '';

    if (!name) return 'VA';

    const words = name.split(/\s+/).filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }, [getUserDetailQuery.data?.name]);

  const showToast = useCallback((toast: ToastCardProps) => {
    setToastCardProps(toast);
    setToastId((prev) => prev + 1);
  }, []);

  const resetPhoneEditModal = useCallback(() => {
    setPhoneModalOpen(false);
    setPhoneOtpSent(false);
    setPhoneSendError('');
    setPhoneSecondsLeft(0);
    setNewPhoneCountry(phoneCountry);
    resetPhoneEditForm({
      newPhone: '',
      otp: '',
    });
  }, [phoneCountry, resetPhoneEditForm]);

  const handleSendPhoneOtp = useCallback(() => {
    const nextPhone = sanitizePhoneNumber(getPhoneEditValues('newPhone'));
    const countryCode = `+${getCountryCallingCode(newPhoneCountry)}`;

    if (!isPhoneNumberValid(countryCode, nextPhone)) {
      setPhoneEditError('newPhone', {
        type: 'custom',
        message: 'Please enter a valid phone number',
      });
      return;
    }

    if (nextPhone === phone && countryCode === phoneCountryCode) {
      setPhoneEditError('newPhone', {
        type: 'custom',
        message: 'New phone number must be different from the current number.',
      });
      return;
    }

    setPhoneEditValue('newPhone', nextPhone, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setPhoneEditValue('otp', '');
    clearPhoneEditErrors(['newPhone', 'otp']);
    setPhoneSendError('');

    sendPhoneOtpMutation.mutate(
      {
        phone: { countryCode, number: nextPhone },
      },
      {
        onSuccess: () => {
          setPhoneOtpSent(true);
          setPhoneSecondsLeft(OTP_TIMEOUT_SECONDS);
        },
        onError: (error: unknown) => {
          setPhoneSendError(
            getApiErrorMessage(error, 'Failed to send OTP. Please try again.')
          );
        },
      }
    );
  }, [
    clearPhoneEditErrors,
    getPhoneEditValues,
    newPhoneCountry,
    phone,
    phoneCountryCode,
    sendPhoneOtpMutation,
    setPhoneEditError,
    setPhoneEditValue,
  ]);

  const handleVerifyPhoneOtp = useCallback(() => {
    const nextPhone = sanitizePhoneNumber(getPhoneEditValues('newPhone'));
    const otp = sanitizePhoneNumber(getPhoneEditValues('otp')).slice(0, 6);
    const countryCode = `+${getCountryCallingCode(newPhoneCountry)}`;

    if (!isPhoneNumberValid(countryCode, nextPhone)) {
      setPhoneEditError('newPhone', {
        type: 'custom',
        message: 'Please enter a valid phone number',
      });
      return;
    }

    if (otp.length !== 6) {
      setPhoneEditError('otp', {
        type: 'custom',
        message: 'OTP must be 6 digits',
      });
      return;
    }

    clearPhoneEditErrors('otp');

    verifyPhoneOtpMutation.mutate(
      {
        phone: { countryCode, number: nextPhone },
        otp,
      },
      {
        onSuccess: (data) => {
          const apiUser = (data as { data?: { user?: UserData['user'] } })?.data
            ?.user;

          persistVerifiedPhone(countryCode, nextPhone, apiUser);
          setPhoneOverride(nextPhone);
          showToast({
            type: 'success',
            title: 'Phone number updated successfully!',
          });
          resetPhoneEditModal();
        },
        onError: (error: unknown) => {
          setPhoneEditError('otp', {
            type: 'custom',
            message: getApiErrorMessage(error, 'Invalid or expired OTP.'),
          });
        },
      }
    );
  }, [
    clearPhoneEditErrors,
    getPhoneEditValues,
    newPhoneCountry,
    resetPhoneEditModal,
    setPhoneEditError,
    showToast,
    verifyPhoneOtpMutation,
  ]);

  const isNewPhoneValid = isPhoneNumberValid(
    `+${getCountryCallingCode(newPhoneCountry)}`,
    sanitizePhoneNumber(watchedNewPhone ?? '')
  );
  const canResendPhoneOtp =
    phoneSecondsLeft === 0 &&
    isNewPhoneValid &&
    !(
      sanitizePhoneNumber(watchedNewPhone ?? '') === phone &&
      `+${getCountryCallingCode(newPhoneCountry)}` === phoneCountryCode
    );
  const isPhoneActionPending =
    sendPhoneOtpMutation.isPending || verifyPhoneOtpMutation.isPending;

  const onSubmit = useCallback(
    (data: PersonalProfileFormData) => {
      const resolvedOldProfession = resolveProfession(
        initialFormValues.profession,
        initialFormValues.professionCustom
      );
      const resolvedNewProfession = resolveProfession(
        data.profession,
        data.professionCustom
      );

      if (data.profession === 'Other' && !resolvedNewProfession) {
        setError('professionCustom', {
          type: 'custom',
          message: 'Please enter the profession',
        });
        return;
      }

      const isValidUrl = (val: string) => {
        if (!val.trim()) return true;
        if (!val.includes('.')) return true;
        try {
          const testUrl = val.includes('://') ? val : `https://${val}`;
          new URL(testUrl);
          return true;
        } catch {
          return false;
        }
      };

      let hasUrlError = false;
      if (!isValidUrl(data.instagramUser ?? '')) {
        setError('instagramUser', { type: 'custom', message: 'Invalid URL' });
        hasUrlError = true;
      }
      if (!isValidUrl(data.linkedinUser ?? '')) {
        setError('linkedinUser', { type: 'custom', message: 'Invalid URL' });
        hasUrlError = true;
      }
      if (hasUrlError) return;

      clearErrors('professionCustom');

      const oldBody = {
        photo: initialFormValues.photo,
        name: (initialFormValues.name ?? '').trim(),
        email: (initialFormValues.email ?? '').trim(),
        profession: resolvedOldProfession,
        language: (initialFormValues.language ?? '').trim(),
        instagramUser: (initialFormValues.instagramUser ?? '').trim(),
        linkedinUser: (initialFormValues.linkedinUser ?? '').trim(),
      };

      const newBody = {
        photo: watchedPhoto ?? null,
        name: (data.name ?? '').trim(),
        email: (data.email ?? '').trim(),
        profession: resolvedNewProfession,
        language: (data.language ?? '').trim(),
        instagramUser: (data.instagramUser ?? '').trim(),
        linkedinUser: (data.linkedinUser ?? '').trim(),
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
      const changedFields = getChangedFields(oldBody, newBody);
      const shouldRemovePhoto =
        initialFormValues.photo !== null && watchedPhoto === null;

      if (changedFields.photo && typeof changedFields.photo === 'object') {
        formData.append('profilePhoto', changedFields.photo as Blob);
      } else if (
        shouldRemovePhoto ||
        changedFields.photo === null ||
        changedFields.photo === ''
      ) {
        formData.append('profilePhoto', 'null');
      }

      if (typeof changedFields.name === 'string') {
        formData.append('name', changedFields.name);
      }

      if (typeof changedFields.profession === 'string') {
        formData.append('profession', changedFields.profession);
      }

      if (
        typeof changedFields.language === 'string' &&
        changedFields.language.trim().length > 0
      ) {
        formData.append('language', changedFields.language);
      }

      const socialLinks: Record<string, string> = {};

      if (typeof changedFields.instagramUser === 'string') {
        socialLinks.instagram = changedFields.instagramUser;
      }

      if (typeof changedFields.linkedinUser === 'string') {
        socialLinks.linkedin = changedFields.linkedinUser;
      }

      if (Object.keys(socialLinks).length > 0) {
        formData.append('socialLinks', JSON.stringify(socialLinks));
      }

      updateProfileQuery.mutate(formData, {
        onSuccess: () => {
          showToast({
            type: 'success',
            title: 'Profile updated successfully!',
          });
        },
        onError: (error) => {
          showToast({
            type: 'error',
            title: 'Unable to update profile',
            description: error.message,
          });
        },
      });
    },
    [
      clearErrors,
      initialFormValues,
      setError,
      showToast,
      updateProfileQuery,
      watchedPhoto,
    ]
  );

  const onCancel = useCallback(() => {
    reset(initialFormValues);
  }, [initialFormValues, reset]);

  useEffect(() => {
    if (initialFormValuesKeyRef.current === initialFormValuesKey) return;

    initialFormValuesKeyRef.current = initialFormValuesKey;
    reset(initialFormValues);
  }, [initialFormValues, initialFormValuesKey, reset]);

  useRegisterSettingsHeaderActions(
    useMemo(
      () => ({
        saveBtnProps: {
          content: saveButtonLabel,
          onClick: handleSubmit(onSubmit),
          isLoading: updateProfileQuery.isPending,
          disabled: updateProfileQuery.isPending,
        },
        cancelBtnProps: {
          onClick: onCancel,
          disabled: updateProfileQuery.isPending,
        },
      }),
      [
        handleSubmit,
        onCancel,
        onSubmit,
        saveButtonLabel,
        updateProfileQuery.isPending,
      ]
    )
  );

  return (
    <form className="text-neutral-gray-900 font-metropolis flex max-w-3/5 flex-col gap-3">
      <div className="leading-5 font-semibold">Your Profile</div>
      <Controller
        name="photo"
        control={control}
        render={({ field: { value, onChange } }) => (
          <ImageInput
            label="Photo"
            description={userInitials}
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
            label="Name"
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
            disabled
          />
        )}
      />
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium">Profession</label>
        <Controller
          name="profession"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FilterDropdown
              placeholder="Select profession"
              options={PROFESSION_OPTIONS.map((val) => ({
                id: val,
                label: val,
                value: val,
              }))}
              value={value}
              onChange={(val) => {
                const selectedProfession = (val as SelectedOption)?.value;
                onChange(selectedProfession);

                if (selectedProfession !== 'Other') {
                  setValue('professionCustom', '');
                  clearErrors('professionCustom');
                }
              }}
              error={errors.profession?.message}
              className={`[&>button]:h-10 [&>button]:min-w-full [&>button>span:nth-child(2)]:hidden! [&>button>svg]:size-4 ${value ? '[&>button>span:nth-child(1)]:text-neutral-gray-900!' : '[&>button>span:nth-child(1)]:text-neutral-gray-500!'}`}
            />
          )}
        />
      </div>
      {watchedProfession === 'Other' && (
        <Controller
          name="professionCustom"
          control={control}
          render={({ field: { value, onChange, name } }) => (
            <Input
              label="Enter Profession"
              type="text"
              name={name}
              value={value ?? ''}
              onChange={onChange}
              placeholder="Enter profession"
              className="placeholder:text-neutral-gray-500! h-10 text-xs!"
              error={errors.professionCustom?.message}
            />
          )}
        />
      )}
      {/* <div className="flex flex-col gap-1">
        <label className="text-xs font-medium">Language</label>
        <Controller
          name="language"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FilterDropdown
              placeholder="Select language"
              options={languageData}
              value={value}
              onChange={(val) => onChange((val as SelectedOption)?.value)}
              error={errors.language?.message}
              className={`[&>button]:h-10 [&>button]:min-w-full [&>button>span:nth-child(2)]:hidden! [&>button>svg]:size-4 ${value ? '[&>button>span:nth-child(1)]:text-neutral-gray-900!' : '[&>button>span:nth-child(1)]:text-neutral-gray-500!'}`}
            />
          )}
        />
      </div> */}

      {/* Phone Number */}
      <div className="flex flex-col gap-1">
        <PhoneInput
          label="Phone Number"
          placeholder="Enter phone number"
          value={phone}
          country={phoneCountry}
          disabled={PHONE_EDITING_DISABLED}
          readOnly
          className="border-neutral-gray-200 h-10! bg-white!"
          // rightAddon={
          //   <>
          //     {otpVerified && (
          //       <Icon
          //         icon="solar:check-circle-linear"
          //         className="text-neutral-gray-400 size-[20px]"
          //       />
          //     )}
          //     <button
          //       type="button"
          //       onClick={handleOpenPhoneEditModal}
          //       className="text-neutral-gray-600 hover:text-neutral-gray-900 cursor-pointer transition-colors"
          //       aria-label="Edit phone number"
          //     >
          //       <Icon icon="solar:pen-2-linear" className="size-[18px]" />
          //     </button>
          //   </>
          // }
        />
      </div>

      <Divider className="border-t-neutral-gray-200! border-transparent!" />

      {/* Social Links */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium">Social Links</label>
          <span className="text-neutral-gray-500 text-[11px]">
            Enter your username
          </span>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <Controller
              name="instagramUser"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <IconInput
                  type="text"
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  leftAddon={<InstagramIcon />}
                  placeholder="instagram.com/"
                  className="placeholder:text-neutral-gray-500! h-10 w-full pl-9! text-xs!"
                  error={errors.instagramUser?.message}
                />
              )}
            />
          </div>
          <div className="flex-1">
            <Controller
              name="linkedinUser"
              control={control}
              render={({ field: { value, onChange, name } }) => (
                <IconInput
                  type="text"
                  name={name}
                  value={value ?? ''}
                  onChange={onChange}
                  leftAddon={<LinkedinIcon />}
                  placeholder="linkedin.com/"
                  className="placeholder:text-neutral-gray-500! h-10 w-full pl-9! text-xs!"
                  error={errors.linkedinUser?.message}
                />
              )}
            />
          </div>
        </div>
      </div>

      <Modal
        open={phoneModalOpen}
        onClose={resetPhoneEditModal}
        className="[&>div]:h-min [&>div]:w-[460px]"
      >
        <div className="text-neutral-gray-900 flex h-full w-full flex-col gap-6 p-10">
          <div className="flex flex-col gap-2">
            <div className="text-2xl leading-7 font-bold">
              Change Phone Number
            </div>
            <div className="text-neutral-gray-600 text-sm font-medium">
              Enter your new phone number and verify it with OTP.
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Controller
              name="newPhone"
              control={phoneEditControl}
              render={({ field: { value, onChange } }) => (
                <PhoneInput
                  label="New Phone Number"
                  placeholder="Enter new phone number"
                  value={value ?? ''}
                  onChange={(nextPhone) => {
                    onChange(nextPhone);
                    setPhoneSendError('');
                    clearPhoneEditErrors(['newPhone', 'otp']);
                    if (phoneOtpSent) {
                      setPhoneOtpSent(false);
                      setPhoneSecondsLeft(0);
                      setPhoneEditValue('otp', '');
                    }
                  }}
                  country={newPhoneCountry}
                  onCountryChange={(nextCountry) => {
                    if (!nextCountry) return;
                    setNewPhoneCountry(nextCountry);
                    setPhoneSendError('');
                    clearPhoneEditErrors(['newPhone', 'otp']);
                    if (phoneOtpSent) {
                      setPhoneOtpSent(false);
                      setPhoneSecondsLeft(0);
                      setPhoneEditValue('otp', '');
                    }
                  }}
                  error={phoneEditErrors.newPhone?.message}
                  errorClassName="text-[11px] text-red-500"
                  className="border-neutral-gray-200 h-10! bg-white!"
                  rightAddon={
                    <button
                      type="button"
                      onClick={handleSendPhoneOtp}
                      disabled={
                        isPhoneActionPending ||
                        !isNewPhoneValid ||
                        sanitizePhoneNumber(value ?? '') === phone
                      }
                      className={`rounded-[6px] px-[14px] py-[7px] text-[11px] font-semibold whitespace-nowrap transition-colors ${
                        isPhoneActionPending ||
                        !isNewPhoneValid ||
                        sanitizePhoneNumber(value ?? '') === phone
                          ? 'bg-neutral-gray-500 cursor-not-allowed text-white'
                          : 'bg-neutral-gray-900 hover:bg-neutral-gray-800 text-white'
                      }`}
                    >
                      {sendPhoneOtpMutation.isPending
                        ? 'Sending...'
                        : 'Send OTP'}
                    </button>
                  }
                />
              )}
            />

            {phoneSendError && (
              <p className="font-metropolis text-[11px] text-red-500">
                {phoneSendError}
              </p>
            )}

            <div className="flex flex-col gap-3">
              <Controller
                name="otp"
                control={phoneEditControl}
                render={({ field: { value, onChange } }) => (
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter  code"
                    value={value ?? ''}
                    onChange={(e) => {
                      onChange(sanitizePhoneNumber(e.target.value).slice(0, 6));
                      clearPhoneEditErrors('otp');
                    }}
                    disabled={!phoneOtpSent || verifyPhoneOtpMutation.isPending}
                    maxLength={6}
                    className="h-10 text-xs!"
                    containerClassName="w-full"
                    error={phoneEditErrors.otp?.message}
                  />
                )}
              />
              {phoneOtpSent && (
                <div className="flex items-center justify-between gap-3">
                  <span className="font-metropolis text-neutral-gray-800 text-[11px] font-bold">
                    {phoneSecondsLeft > 0 ? `${phoneSecondsLeft} Sec` : ''}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    content={
                      sendPhoneOtpMutation.isPending ? 'Sending...' : 'Re-Send'
                    }
                    className="w-fit! px-3!"
                    onClick={handleSendPhoneOtp}
                    disabled={
                      !canResendPhoneOtp || sendPhoneOtpMutation.isPending
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3">
            <Button
              variant="secondary"
              content="Cancel"
              size="sm"
              className="h-10!"
              onClick={resetPhoneEditModal}
            />
            <Button
              content="Verify OTP"
              size="sm"
              className="h-10!"
              onClick={handleVerifyPhoneOtp}
              isLoading={verifyPhoneOtpMutation.isPending}
              disabled={
                !phoneOtpSent ||
                sanitizePhoneNumber(watchedPhoneOtp ?? '').length !== 6 ||
                verifyPhoneOtpMutation.isPending
              }
            />
          </div>
        </div>
      </Modal>

      {toastCardProps && <ToastCard key={toastId} {...toastCardProps} />}
    </form>
  );
};

export default Profile;
