import Button from '../../../components/Button';
import { useGetCosmeticCategory } from '../../../hooks/useGetCosmeticCategory';
import useQueryParams from '../../../hooks/useQueryParams';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { DynamicInput } from '../../../components/DynamicInput';
import type { TTryOnForm } from '../../../types';
import { useEffect } from 'react';
import { useUpdateExperience } from '../../../services/experience-services';

interface TryOnSubHeaderProps {
  experienceTitle?: string;
}

const TryOnSubHeader = ({ experienceTitle }: TryOnSubHeaderProps) => {
  const { expId } = useGetCosmeticCategory();
  const { queryParams } = useQueryParams();
  const { control, setValue } = useFormContext<TTryOnForm>();
  const watchedTitle = useWatch({ control, name: 'title' });
  const updateExperienceQuery = useUpdateExperience();

  const resolvedExperienceId = queryParams.experienceId || expId || '';
  const defaultText = 'New Fashion Try-on';

  useEffect(() => {
    const trimmed = experienceTitle?.trim();
    if (!trimmed) return;
    setValue('title', trimmed, { shouldDirty: false });
  }, [experienceTitle, setValue]);

  return (
    <div className="text-neutral-gray-900 flex items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <DynamicInput
              value={field.value ?? ''}
              defaultText={defaultText}
              onSubmit={async (title) => {
                const newTitle = title.trim() || defaultText;
                field.onChange(newTitle);

                if (!resolvedExperienceId) return;
                if ((watchedTitle || '').trim() === newTitle) return;

                await updateExperienceQuery.mutateAsync({
                  id: resolvedExperienceId,
                  data: { title: newTitle },
                });
              }}
            />
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <h5 className="font-bold">Product:</h5>
        <Button variant="link" content="Link Product" className="text-xs!" />
      </div>
    </div>
  );
};

export default TryOnSubHeader;
