import { Icon } from '@iconify/react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Fragment } from 'react/jsx-runtime';
import FilterDropdown from '../../../components/FilterDropdown';
import Divider from '../../../components/Divider';
import Input from '../../../components/Input';
import ColorInput from '../../../components/Input/ColorInput';
import { fontsData } from '../../../data';
import type { SelectedOption } from '../../../types';
import { ToggleSwitch } from '../../../components/ToggleSwitch';
import { UserLogoPrevComponent } from '../../threedvisualizer/components/VisualizerOptions';
import type { StoreFormType } from '..';

const StepThree = () => {
  const {
    control,
    register,
    resetField,
    clearErrors,
    setError,
    setValue,
    formState: { errors },
  } = useFormContext<StoreFormType>();

  const brandingGlobalSettings = useWatch({
    control,
    name: 'branding.globalSettings',
    defaultValue: false,
  });
  const interfaceGlobalSettings = useWatch({
    control,
    name: 'interface.globalSettings',
    defaultValue: false,
  });

  return (
    <Fragment>
      <p className="text-xs/normal">Controls to tweak your experience</p>
      <div className="flex flex-col gap-3 px-2">
        <label className="h-6 py-1 text-[13px]/[16.25px] font-semibold">
          Store Information
        </label>
        <Input
          type="text"
          placeholder="Enter name of the storefront"
          label="Storefront Name"
          containerClassName="gap-2!"
          {...register('storefrontName')}
        />
        <Divider className="my-[7px]!" />
        <div className="flex items-center justify-between gap-2 py-1">
          <label className="h-4 grow text-[13px]/[16.25px] font-semibold">
            Branding
          </label>
          <Icon
            icon="solar:restart-linear"
            className="text-neutral-gray-800 size-4 cursor-pointer"
            onClick={() => {
              resetField('branding');
              clearErrors('branding.logo');
            }}
          />
        </div>
        <div className="flex items-center justify-between gap-2 py-1">
          <label className="h-4 grow text-[13px]/[16.25px] font-semibold">
            Use Global Settings
          </label>
          <Controller
            name="branding.globalSettings"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                isOn={field.value ?? false}
                onToggle={(isOn) => {
                  field.onChange(isOn);
                  if (!isOn) {
                    clearErrors('branding.logo');
                  }
                }}
              />
            )}
          />
        </div>
        {brandingGlobalSettings && (
          <Controller
            name="branding.logo"
            control={control}
            rules={{
              validate: (value) => {
                if (!brandingGlobalSettings) return true;
                return value ? true : 'Logo is required';
              },
            }}
            render={({ field }) => (
              <div className="flex flex-col gap-2">
                <UserLogoPrevComponent
                  logo={field.value ?? null}
                  onLogoUpload={(file) => {
                    field.onChange(file);
                    setValue('step', 3, { shouldDirty: false });
                    clearErrors('branding.logo');
                  }}
                  onLogoRemove={() => {
                    field.onChange(null);
                    setValue('step', 3, { shouldDirty: false });
                  }}
                  onLogoUploadError={(error) => {
                    setError('branding.logo', {
                      type: 'manual',
                      message: error,
                    });
                  }}
                  hdriPreview={null}
                  bgColor="#F2F4F7"
                  groundedEnabled={false}
                  opacity={100}
                />
                {errors.branding?.logo?.message && (
                  <span className="font-metropolis text-ui-error! flex items-center gap-1 text-xs font-normal">
                    <Icon
                      icon="solar:info-circle-outline"
                      className="h-4 min-w-4"
                    />
                    {errors.branding.logo.message as string}
                  </span>
                )}
              </div>
            )}
          />
        )}
        <Divider className="my-[7px]!" />
        <div className="flex items-center justify-between gap-2 py-1">
          <label className="h-4 grow text-[13px]/[16.25px] font-semibold">
            Interface
          </label>
          <Icon
            icon="solar:restart-linear"
            className="text-neutral-gray-800 size-4 cursor-pointer"
            onClick={() => resetField('interface')}
          />
        </div>
        <div className="flex items-center justify-between gap-2 py-1">
          <label className="h-4 grow text-[13px]/[16.25px] font-semibold">
            Use Global Settings
          </label>
          <Controller
            name="interface.globalSettings"
            control={control}
            render={({ field }) => (
              <ToggleSwitch
                isOn={field.value ?? false}
                onToggle={field.onChange}
              />
            )}
          />
        </div>
        <div className="flex items-center justify-between gap-2 py-1">
          <label className="h-4 grow text-[13px]/[16.25px] font-semibold">
            Font
          </label>
          <Icon
            icon="solar:restart-linear"
            className="text-neutral-gray-800 size-4 cursor-pointer"
            onClick={() => resetField('interface.font')}
          />
        </div>
        <Controller
          name="interface.font"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FilterDropdown
              placeholder="Select font"
              options={fontsData}
              value={value}
              onChange={(val) => {
                if (interfaceGlobalSettings) return;
                onChange((val as SelectedOption)?.value);
              }}
              error={errors.interface?.font?.message as string}
              className={`[&>button]:h-10 [&>button]:min-w-full [&>button>span:nth-child(2)]:hidden! [&>button>svg]:size-4 ${
                value
                  ? '[&>button>span:nth-child(1)]:text-neutral-gray-900!'
                  : '[&>button>span:nth-child(1)]:text-neutral-gray-500!'
              } ${interfaceGlobalSettings ? 'pointer-events-none opacity-60' : ''}`}
            />
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <Controller
            name="interface.backgroundColor"
            control={control}
            rules={{
              pattern: {
                value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                message: 'Enter a valid hex color (e.g., #FF5733)',
              },
            }}
            render={({ field, formState }) => {
              const hasError =
                formState.errors?.interface?.backgroundColor?.message;
              return (
                <ColorInput
                  {...field}
                  label="Background"
                  placeholder="#FFFFFF"
                  className={`h-10! px-3! py-3! text-xs ${
                    hasError ? 'border-ui-error! hover:border-ui-error!' : ''
                  }`}
                  containerClassName="flex-1 [&>label]:font-medium"
                  error={hasError}
                  disabled={interfaceGlobalSettings}
                />
              );
            }}
          />
          <Controller
            name="interface.textColor"
            control={control}
            rules={{
              pattern: {
                value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                message: 'Enter a valid hex color (e.g., #FF5733)',
              },
            }}
            render={({ field, formState }) => {
              const hasError = formState.errors.interface?.textColor?.message;
              return (
                <ColorInput
                  {...field}
                  label="Text"
                  placeholder="#000000"
                  className={`h-10! px-3! py-3! text-xs ${
                    hasError ? 'border-ui-error! hover:border-ui-error!' : ''
                  }`}
                  containerClassName="flex-1 [&>label]:font-medium"
                  error={hasError}
                  disabled={interfaceGlobalSettings}
                />
              );
            }}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default StepThree;
