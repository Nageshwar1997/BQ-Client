import Button from '../../../components/Button';
import useQueryParams from '../../../hooks/useQueryParams';
import { DynamicInput } from '../../../components/DynamicInput';
import { Controller, useFormContext } from 'react-hook-form';
import type { TFashionTryOnForm } from '../../../types';
import {
  useGetExperienceById,
  useUpdateExperience,
} from '../../../services/experience-services';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import ToastCard from '../../../components/AlertCards/ToastCard';

const FashionTryOnSubHeader = () => {
  const { queryParams } = useQueryParams();
  const { expId } = useParams();

  const { control, getValues, setValue } = useFormContext<TFashionTryOnForm>();

  const experienceId = expId ?? queryParams.experienceId;
  const getExperienceByIdQuery = useGetExperienceById(experienceId || '');
  const updateExperienceQuery = useUpdateExperience();

  const details = getExperienceByIdQuery?.data?.data;
  const hasLinkedProduct = Boolean(queryParams.id);

  useEffect(() => {
    const detailsTitle = details?.title?.trim();
    if (!detailsTitle) return;

    const currentTitle = getValues('title')?.trim();
    if (!currentTitle || currentTitle === 'New Fashion Try-on') {
      setValue('title', detailsTitle, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [details?.title, getValues, setValue]);

  return (
    <div className="text-neutral-gray-900 font-metropolis flex items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <DynamicInput
              value={field.value ?? ''}
              defaultText="New Fashion Try-on"
              onSubmit={(title) => {
                const newTitle = title.trim() || 'New Fashion Try-on';
                field.onChange(newTitle);

                if (!experienceId) return;
                if ((details?.title || '').trim() === newTitle) return;

                updateExperienceQuery.mutate({
                  id: experienceId,
                  data: { title: newTitle },
                });
              }}
            />
          )}
        />
      </div>
      <div className="flex items-center gap-2">
        <h5 className="font-bold">Product:</h5>
        <Button
          variant="link"
          content={hasLinkedProduct ? 'Linked Product' : 'Link Product'}
          className="text-xs!"
        />
      </div>
      {updateExperienceQuery.isPending && (
        <ToastCard
          type="loading"
          autoClose={false}
          title="Updating experience title..."
          description="Please wait, updation in progress"
        />
      )}
      {updateExperienceQuery.isError && (
        <ToastCard
          type="error"
          title="Failed to update experience title"
          description="Couldn't update experience title, please try again"
          buttonProps={{
            content: 'Try Again',
          }}
        />
      )}
      {updateExperienceQuery.isSuccess && (
        <ToastCard
          type="success"
          title="Updated successfully"
          description="Experience title updated successfully"
        />
      )}
    </div>
  );
};

export default FashionTryOnSubHeader;
