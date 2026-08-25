import { Icon } from '@iconify/react';
import { Controller, useFormContext } from 'react-hook-form';
import { Fragment } from 'react/jsx-runtime';
import FilterDropdown from '../../../components/FilterDropdown';
import type { SelectedOption } from '../../../types';
import Divider from '../../../components/Divider';
import Input from '../../../components/Input';
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import { visitorsData } from '../../../data';
import type { StoreFormType } from '..';

const validateOptionalUrl = (value: string) => {
  const trimmedValue = value.trim();
  const errorMsg = 'Enter a valid URL';

  if (!trimmedValue) return true;

  try {
    const parsed = new URL(trimmedValue);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
      ? true
      : errorMsg;
  } catch {
    return errorMsg;
  }
};

const StepSix = () => {
  const {
    control,
    resetField,
    register,
    formState: { errors },
  } = useFormContext<StoreFormType>();

  return (
    <Fragment>
      <p className="text-xs/normal">Controls to tweak your experience</p>
      <div className="flex flex-col gap-3 px-2">
        <div className="flex items-center justify-between gap-2 py-1">
          <label className="h-4 grow text-[13px]/[16.25px] font-semibold">
            Currency Conversion
          </label>
          <Controller
            name="experienceSettings.currencyConversion"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                isOn={field.value ?? false}
                onToggle={field.onChange}
              />
            )}
          />
        </div>
        <Divider className="my-[7px]!" />
        <div className="flex gap-2 py-1">
          <div className="grow text-[13px] leading-4 font-semibold">
            Site Settings
          </div>
          <Icon
            icon="solar:restart-linear"
            className="text-neutral-gray-800 size-4 cursor-pointer"
            onClick={() => {
              resetField('experienceSettings.maxConcurrentVisitors');
              resetField('experienceSettings.loadingScreenMessage');
            }}
          />
        </div>
        <Controller
          name="experienceSettings.maxConcurrentVisitors"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FilterDropdown
              outerLabel="Maximum Concurrent Visitors"
              placeholder="Select visitors"
              options={visitorsData}
              value={value}
              onChange={(val) => onChange((val as SelectedOption)?.value)}
              error={errors.experienceSettings?.maxConcurrentVisitors?.message}
              className={`[&>button]:h-10 [&>button]:min-w-full [&>button>span:nth-child(2)]:hidden! [&>button>svg]:size-4 [&>h3]:mb-2 ${
                value
                  ? '[&>button>span:nth-child(1)]:text-neutral-gray-900!'
                  : '[&>button>span:nth-child(1)]:text-neutral-gray-500!'
              }`}
            />
          )}
        />
        <Input
          type="text"
          placeholder="Enter the loading screen message"
          label="Loading Screen Message"
          containerClassName="gap-2!"
          className="text-xs!"
          {...register('experienceSettings.loadingScreenMessage')}
        />
        <Divider className="my-[7px]!" />
        <div className="flex gap-2 py-1">
          <div className="grow text-[13px] leading-4 font-semibold">
            Legal Information
          </div>
          <Icon
            icon="solar:restart-linear"
            className="text-neutral-gray-800 size-4 cursor-pointer"
            onClick={() => {
              resetField(
                'experienceSettings.legalInformation.privacyPolicyUrl'
              );
              resetField(
                'experienceSettings.legalInformation.termsAndConditionsUrl'
              );
              resetField('experienceSettings.legalInformation.refundPolicyUrl');
            }}
          />
        </div>
        <Input
          type="text"
          placeholder="Enter URL"
          label="Privacy Policy"
          containerClassName="gap-2!"
          className="text-xs!"
          error={
            errors.experienceSettings?.legalInformation?.privacyPolicyUrl
              ?.message as string
          }
          {...register('experienceSettings.legalInformation.privacyPolicyUrl', {
            validate: validateOptionalUrl,
          })}
        />
        <Input
          type="text"
          placeholder="Enter URL"
          label="Terms & Conditions"
          containerClassName="gap-2!"
          className="text-xs!"
          error={
            errors.experienceSettings?.legalInformation?.termsAndConditionsUrl
              ?.message as string
          }
          {...register(
            'experienceSettings.legalInformation.termsAndConditionsUrl',
            {
              validate: validateOptionalUrl,
            }
          )}
        />
        <Input
          type="text"
          placeholder="Enter URL"
          label="Refund Policy"
          containerClassName="gap-2!"
          className="text-xs!"
          error={
            errors.experienceSettings?.legalInformation?.refundPolicyUrl
              ?.message as string
          }
          {...register('experienceSettings.legalInformation.refundPolicyUrl', {
            validate: validateOptionalUrl,
          })}
        />
      </div>
    </Fragment>
  );
};

export default StepSix;
