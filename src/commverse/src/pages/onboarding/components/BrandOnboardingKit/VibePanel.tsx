import { Fragment, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';

import Divider from '../../../../components/Divider';
import Input from '../../../../components/Input';
import ToggleGroup from '../../../../components/ToggleGroup';
import {
  brandVoiceValues,
  updateVibeSchema,
} from '../../../../schema/settings.schema';
import type { UpdateVibeFormData } from '../../../../types';
import type { VoiceValue } from '../../../../types/onboarding';

export type BrandVibeApiData = {
  description: string;
  keywords: string[];
  voice: {
    confident?: VoiceValue;
    energetic?: VoiceValue;
    professional?: VoiceValue;
    trust?: VoiceValue;
    friendly?: VoiceValue;
    authority?: VoiceValue;
  };
};

type BrandVoiceValue = NonNullable<UpdateVibeFormData['brandVoice']>;
type BrandVoiceKey = keyof BrandVoiceValue;

const DEFAULT_BRAND_VOICE: BrandVoiceValue = {
  confident: 'moderate',
  energetic: 'moderate',
  professional: 'moderate',
  trust: 'moderate',
  friendly: 'moderate',
  authority: 'moderate',
};

export function VibePanel({
  data,
  onChange,
}: {
  data: BrandVibeApiData;
  onChange: (next: BrandVibeApiData) => void;
}) {
  const brandVoice = useMemo<BrandVoiceValue>(
    () => ({
      confident:
        (data.voice?.confident ?? DEFAULT_BRAND_VOICE.confident) as VoiceValue,
      energetic:
        (data.voice?.energetic ?? DEFAULT_BRAND_VOICE.energetic) as VoiceValue,
      professional:
        (data.voice?.professional ??
          DEFAULT_BRAND_VOICE.professional) as VoiceValue,
      trust:
        (data.voice?.trust ?? DEFAULT_BRAND_VOICE.trust) as VoiceValue,
      friendly:
        (data.voice?.friendly ?? DEFAULT_BRAND_VOICE.friendly) as VoiceValue,
      authority:
        (data.voice?.authority ?? DEFAULT_BRAND_VOICE.authority) as VoiceValue,
    }),
    [data.voice]
  );

  const voiceKeys = useMemo(
    () => Object.keys(brandVoice) as BrandVoiceKey[],
    [brandVoice]
  );

  const defaultValues = useMemo<UpdateVibeFormData>(
    () => ({
      brandArchetype: data.keywords?.[0] ?? '',
      description: data.description ?? '',
      brandVoice,
    }),
    [data.description, data.keywords, brandVoice]
  );

  const vibeForm = useForm<UpdateVibeFormData>({
    resolver: zodResolver(updateVibeSchema),
    defaultValues,
    mode: 'onChange',
  });

  useEffect(() => {
    vibeForm.reset(defaultValues);
  }, [defaultValues, vibeForm]);

  useEffect(() => {
    const subscription = vibeForm.watch((formValues) => {
      const next: BrandVibeApiData = {
        description: formValues.description ?? '',
        keywords: formValues.brandArchetype
          ? [formValues.brandArchetype.trim()]
          : [],
        voice: {
          confident:
            (formValues.brandVoice?.confident ??
              DEFAULT_BRAND_VOICE.confident) as VoiceValue,
          energetic:
            (formValues.brandVoice?.energetic ??
              DEFAULT_BRAND_VOICE.energetic) as VoiceValue,
          professional:
            (formValues.brandVoice?.professional ??
              DEFAULT_BRAND_VOICE.professional) as VoiceValue,
          trust:
            (formValues.brandVoice?.trust ??
              DEFAULT_BRAND_VOICE.trust) as VoiceValue,
          friendly:
            (formValues.brandVoice?.friendly ??
              DEFAULT_BRAND_VOICE.friendly) as VoiceValue,
          authority:
            (formValues.brandVoice?.authority ??
              DEFAULT_BRAND_VOICE.authority) as VoiceValue,
        },
      };
      onChange(next);
    });
    return () => subscription.unsubscribe();
  }, [onChange, vibeForm]);

  return (
    <form className="font-metropolis flex h-full flex-col gap-3 overflow-y-auto">
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
              placeholder="Enter vibe description"
              className={`h-[120px] resize-none rounded-lg border px-3 py-2 text-xs ${vibeForm.formState.errors.description?.message
                  ? 'border-ui-error'
                  : 'border-neutral-gray-400'
                } bg-neutral-gray-100 placeholder:text-neutral-gray-500`}
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
        {voiceKeys.map((voice, index) => (
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

            {index !== voiceKeys.length - 1 && (
              <Divider className="border-t-neutral-gray-200! border-transparent!" />
            )}
          </Fragment>
        ))}
      </div>
    </form>
  );
}