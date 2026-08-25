import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import Button from '../../../components/Button';
import IconInput from '../../../components/IconInput';
import PhoneInput from '../../../components/PhoneInput';
import { Icon } from '@iconify/react';
import { InstagramIcon, LinkedinIcon } from '../../../icons';
import {
  useGetUserDetail,
  useSavePhoneNumber,
  useUpdateProfile,
} from '../../../services/auth-service';
import {
  getCountryCallingCode,
  parsePhoneNumber,
  type Country,
} from 'react-phone-number-input';
import {
  isPhoneNumberValid,
  phoneVerificationSocialLinksSchema,
} from '../../../schema/auth.schema';
import { getUser, saveUser } from '../../../lib/utils';
import type { UserData } from '../../../services/api';

type PhoneVerificationFormData = {
  instagramUser?: string;
  linkedinUser?: string;
};

function normalizeUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  return trimmed.includes('://') ? trimmed : `https://${trimmed}`;
}

const DEFAULT_COUNTRY: Country = 'IN';
// const OTP_TIMEOUT_SECONDS = 30;

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

export default function AdditionalInformation() {
  const navigate = useNavigate();

  // Phone OTP state
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState<Country>(DEFAULT_COUNTRY);
  const [phoneError, setPhoneError] = useState('');
  // const [otpSent, setOtpSent] = useState(false);
  // const [otpVerified, setOtpVerified] = useState(false);
  // const [otp, setOtp] = useState('');
  // const [otpError, setOtpError] = useState('');
  // const [sendError, setSendError] = useState('');

  // Timer state — incremented each time OTP is (re)sent to re-trigger the effect
  // const [sendCount, setSendCount] = useState(0);
  // const [secondsLeft, setSecondsLeft] = useState(0);

  const { data: userDetail } = useGetUserDetail();
  const [isInitialized, setIsInitialized] = useState(false);

  const socialLinksForm = useForm<PhoneVerificationFormData>({
    resolver: zodResolver(phoneVerificationSocialLinksSchema),
    mode: 'onBlur',
    defaultValues: {
      instagramUser: '',
      linkedinUser: '',
    },
  });

  // Sync state from user detail once
  useEffect(() => {
    if (userDetail && !isInitialized) {
      if (userDetail.phone?.number) {
        setPhone(userDetail.phone.number);
      }
      setPhoneCountry(
        getCountryFromPhone(
          userDetail.phone?.countryCode,
          userDetail.phone?.number
        )
      );
      if (userDetail.socialLinks?.instagram) {
        socialLinksForm.setValue(
          'instagramUser',
          userDetail.socialLinks.instagram
        );
      }
      if (userDetail.socialLinks?.linkedin) {
        socialLinksForm.setValue(
          'linkedinUser',
          userDetail.socialLinks.linkedin
        );
      }
      setIsInitialized(true);
    }
  }, [userDetail, isInitialized, socialLinksForm.setValue]);

  const updateProfileMutation = useUpdateProfile();
  const savePhoneNumberMutation = useSavePhoneNumber();

  const handleSocialBlur = async (
    field: 'instagram' | 'linkedin',
    value: string
  ) => {
    const fieldName = field === 'instagram' ? 'instagramUser' : 'linkedinUser';
    const isValid = await socialLinksForm.trigger(fieldName);
    if (!isValid || !value.trim()) return;

    const currentValue = userDetail?.socialLinks?.[field] || '';
    if (value.trim() === currentValue) return;

    const urlToSend = normalizeUrl(value.trim());
    const formData = new FormData();
    formData.append(`socialLinks[${field}]`, urlToSend);
    updateProfileMutation.mutate(formData);
  };

  // Countdown timer — restarts each time sendCount increments
  // useEffect(() => {
  //   if (sendCount === 0) return;
  //   setSecondsLeft(OTP_TIMEOUT_SECONDS);
  //   const id = setInterval(() => {
  //     setSecondsLeft((prev) => {
  //       if (prev <= 1) {
  //         clearInterval(id);
  //         return 0;
  //       }
  //       return prev - 1;
  //     });
  //   }, 1000);
  //   return () => clearInterval(id);
  // }, [sendCount]);

  // const handleSendOtp = () => {
  //   const countryCode = `+${getCountryCallingCode(phoneCountry)}`;
  //   const sanitizedPhone = phone.replace(/\D/g, '');
  //
  //   if (!isPhoneNumberValid(countryCode, sanitizedPhone)) {
  //     setPhoneError('Please enter a valid phone number');
  //     return;
  //   }
  //
  //   setSendError('');
  //   setPhoneError('');
  //   sendPhoneOtpMutation.mutate(
  //     { phone: { countryCode, number: sanitizedPhone } },
  //     {
  //       onSuccess: () => {
  //         setOtpSent(true);
  //         setOtp('');
  //         setOtpError('');
  //         setSendCount((prev) => prev + 1);
  //       },
  //       onError: (err: unknown) => {
  //         const e = err as Error & { retryAfterSec?: number };
  //         const message = e?.message ?? 'Failed to send OTP. Please try again.';
  //         setSendError(message);
  //       },
  //     }
  //   );
  // };

  // const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const val = e.target.value;
  //   setOtp(val);
  //   setOtpError('');
  //   if (val.length === 6) {
  //     const countryCode = `+${getCountryCallingCode(phoneCountry)}`;
  //     verifyPhoneOtpMutation.mutate(
  //       { phone: { countryCode, number: phone }, otp: val },
  //       {
  //         onSuccess: (data) => {
  //           const existing = getUser();
  //           if (existing?.token) {
  //             const apiUser = (data as { data?: { user?: UserData['user'] } })?.data
  //               ?.user;
  //             if (apiUser) {
  //               saveUser({ token: existing.token, user: { ...existing.user, ...apiUser } });
  //             } else {
  //               saveUser({
  //                 token: existing.token,
  //                 user: {
  //                   ...existing.user,
  //                   phone: {
  //                     countryCode,
  //                     number: phone,
  //                     isVerified: true,
  //                   },
  //                 },
  //               });
  //             }
  //           }
  //           setOtpVerified(true);
  //           setOtpSent(false);
  //         },
  //         onError: (err: unknown) => {
  //           const e = err as Error & { retryAfterSec?: number };
  //           const message = e?.message ?? 'Failed to send OTP. Please try again.';
  //           setOtpError(message);
  //         },
  //       }
  //     );
  //   }
  // };

  const handleNext = () => {
    const countryCode = `+${getCountryCallingCode(phoneCountry)}`;
    const sanitizedPhone = phone.replace(/\D/g, '');

    if (!isPhoneNumberValid(countryCode, sanitizedPhone)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    setPhoneError('');
    savePhoneNumberMutation.mutate(
      { phone: { countryCode, number: sanitizedPhone } },
      {
        onSuccess: (data) => {
          console.log('🚀 ~ handleNext ~ data:', data);
          const existing = getUser();

          if (existing?.token) {
            const apiUser = (data as { data?: { user?: UserData['user'] } })
              ?.data?.user;

            if (apiUser) {
              saveUser({
                token: existing.token,
                user: { ...existing.user, ...apiUser },
              });
            } else {
              saveUser({
                token: existing.token,
                user: {
                  ...existing.user,
                  phone: {
                    countryCode,
                    number: sanitizedPhone,
                    isVerified: true,
                  },
                },
              });
            }
          }

          navigate('/dashboard');
        },
        onError: (err: unknown) => {
          const error = err as Error;
          setPhoneError(error.message || 'Failed to save phone number.');
        },
      }
    );
  };

  // const handleSkip = () => {
  //   navigate('/dashboard');
  // };

  const isPhoneValid = isPhoneNumberValid(
    `+${getCountryCallingCode(phoneCountry)}`,
    phone.replace(/\D/g, '')
  );

  return (
    <div className="flex h-screen w-screen flex-col bg-white">
      {/* Header */}
      <header className="flex h-20 shrink-0 items-center justify-center px-12">
        <img
          src="/assets/icons/Commverse Logo - Final.svg"
          alt="Logo"
          className="h-4 w-auto"
        />
      </header>

      {/* Main content */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-8 py-6">
        <div className="flex w-[544px] max-w-full flex-1 flex-col justify-between gap-4">
          <div className="flex flex-col gap-4">
            {/* Phone Number Field */}
            <div className="flex flex-col gap-2">
              <PhoneInput
                label="Phone Number"
                labelClassName="text-neutral-gray-800 text-xs font-semibold"
                placeholder="Enter phone number"
                value={phone}
                onChange={(nextPhone) => {
                  setPhone(nextPhone);
                  setPhoneError('');
                }}
                country={phoneCountry}
                onCountryChange={(nextCountry) => {
                  if (!nextCountry) return;
                  setPhoneCountry(nextCountry);
                  setPhoneError('');
                }}
                error={phoneError || undefined}
                errorClassName="text-[11px] text-red-500"
                className="border-neutral-gray-200 bg-white!"
                rightAddon={
                  userDetail?.phone?.isVerified ? (
                    <Icon
                      icon="solar:check-circle-linear"
                      className="text-neutral-gray-400 size-[20px]"
                    />
                  ) : undefined
                }
              />

              {/* {otpSent && !otpVerified && (
                <div className="mt-2 flex flex-col gap-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter login code"
                    value={otp}
                    onChange={handleOtpChange}
                    disabled={verifyPhoneOtpMutation.isPending}
                    className="border-neutral-gray-200 font-metropolis placeholder:text-neutral-gray-300 text-neutral-gray-900 focus:border-neutral-gray-900 w-full rounded-[8px] border border-solid bg-white px-[14px] py-[10px] text-[13px] transition outline-none disabled:opacity-60"
                  />
                  {otpError && (
                    <p className="font-metropolis text-[11px] text-red-500">
                      {otpError}
                    </p>
                  )}
                  <div className="mt-[2px] flex items-center justify-between">
                    <span className="font-metropolis text-neutral-gray-800 text-[11px] font-bold">
                      {secondsLeft > 0 ? `${secondsLeft} Sec` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!canResend || sendPhoneOtpMutation.isPending}
                      className={`rounded-[6px] px-[12px] py-[6px] text-[11px] font-bold transition-colors ${
                        canResend && !sendPhoneOtpMutation.isPending
                          ? 'bg-neutral-gray-900 cursor-pointer text-white hover:opacity-90'
                          : 'bg-neutral-gray-100 text-neutral-gray-700 cursor-not-allowed'
                      }`}
                    >
                      {sendPhoneOtpMutation.isPending ? 'Sending…' : 'Re-Send'}
                    </button>
                  </div>
                </div>
              )} */}
            </div>

            <div className="border-neutral-gray-100 w-full border-b" />

            {/* Social Links Form */}
            <div className="flex flex-col gap-[14px]">
              <div className="flex flex-col gap-1">
                <label className="font-metropolis text-neutral-gray-800 text-xs font-semibold">
                  Social Links (Optional)
                </label>
                <label className="font-metropolis text-neutral-gray-500 text-[11px] font-medium">
                  Enter full URL (e.g. instagram.com/yourname)
                </label>
              </div>

              <div className="flex gap-[14px]">
                <div className="flex-1">
                  <Controller
                    name="instagramUser"
                    control={socialLinksForm.control}
                    render={({ field: { value, onChange, onBlur, name } }) => (
                      <IconInput
                        type="text"
                        name={name}
                        value={value ?? ''}
                        onChange={onChange}
                        onBlur={() => {
                          onBlur();
                          handleSocialBlur('instagram', value ?? '');
                        }}
                        leftAddon={<InstagramIcon />}
                        placeholder="instagram.com/"
                        className="placeholder:text-neutral-gray-500! h-10 w-full pl-9! text-xs!"
                        error={
                          socialLinksForm.formState.errors.instagramUser
                            ?.message
                        }
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  <Controller
                    name="linkedinUser"
                    control={socialLinksForm.control}
                    render={({ field: { value, onChange, onBlur, name } }) => (
                      <IconInput
                        type="text"
                        name={name}
                        value={value ?? ''}
                        onChange={onChange}
                        onBlur={() => {
                          onBlur();
                          handleSocialBlur('linkedin', value ?? '');
                        }}
                        leftAddon={<LinkedinIcon />}
                        placeholder="linkedin.com/"
                        className="placeholder:text-neutral-gray-500! h-10 w-full pl-9! text-xs!"
                        error={
                          socialLinksForm.formState.errors.linkedinUser?.message
                        }
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-6">
            <Button
              type="button"
              content="Next"
              onClick={handleNext}
              disabled={!isPhoneValid || savePhoneNumberMutation.isPending}
              isLoading={savePhoneNumberMutation.isPending}
              className="w-full bg-[#0E38F5]! text-white hover:opacity-90! disabled:cursor-not-allowed disabled:opacity-50"
            />
            {/* <button
              type="button"
              onClick={handleSkip}
              className="text-neutral-gray-900 font-metropolis mx-auto text-[13px] font-bold transition-opacity hover:opacity-80"
            >
              Skip
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
