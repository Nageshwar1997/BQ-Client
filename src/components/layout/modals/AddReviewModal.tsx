import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Service } from '../../../api-service';
import { Controller, useForm } from 'react-hook-form';
import type { TMediaOption, TReview } from '../../../types';
import { addReviewSchema } from '../../../schemas/review.schema';
import { ALLOWED_IMAGE_FORMATS, ALLOWED_VIDEO_FORMATS } from '../../../constants';
import { ModalWrapper } from './ModalWrapper';
import { Button, FileInput, Input, Textarea } from '../../ui';
import { UploadCloudIcon } from '../../../icons';
import { SelectRating } from '../../ui/Input/SelectRating';

export const reviewInitialValues = {
  title: '',
  comment: '',
  rating: 1,
  media: [],
};

type TMediaState = { files: File[]; previews: TMediaOption[] };
type TAddReviewModal = { isOpen: boolean; onClose: () => void };

const AddReviewModal = ({ onClose, isOpen }: TAddReviewModal) => {
  const addReviewQuery = Service.Review.AddReview();
  const [media, setMedia] = useState<TMediaState>({ files: [], previews: [] });

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addReviewSchema),
    defaultValues: reviewInitialValues,
  });

  const handleAddReview = (data: TReview) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('rating', data.rating.toString());
    formData.append('comment', data.comment);
    //   TODO: check file type
    data.media?.forEach((file) => {
      if (file instanceof File) {
        if (ALLOWED_IMAGE_FORMATS.includes(file.type)) {
          formData.append('images', file);
        } else if (ALLOWED_VIDEO_FORMATS.includes(file.type)) {
          formData.append('videos', file);
        }
      }
    });

    addReviewQuery.mutateAsync(formData, { onSuccess: onClose });
  };
  return (
    <ModalWrapper onClose={onClose} isOpen={isOpen} header={{ title: 'Add Review' }}>
      <form onSubmit={handleSubmit(handleAddReview)} className="flex flex-col items-center gap-5">
        <Controller
          name="rating"
          control={control}
          defaultValue={1}
          render={({ field: { onChange } }) => (
            <SelectRating
              initialValue={Number(watch('rating'))}
              onChange={(val) => onChange(val)}
              error={errors.rating?.message}
            />
          )}
        />
        <Input
          inputProps={{ placeholder: 'Enter title', name: 'title' }}
          register={register('title')}
          error={errors.title?.message}
          label="Title"
        />
        <Textarea
          textAreaProps={{
            name: 'comment',
            rows: 4,
            placeholder: 'Write your review here...',
          }}
          register={register('comment')}
          error={errors.comment?.message}
          label="Comment"
        />
        <Controller
          control={control}
          name="media"
          defaultValue={[]}
          render={({ field }) => (
            <FileInput
              label="Images / Videos"
              previews={media.previews}
              errors={
                Array.isArray(errors.media)
                  ? errors.media.map((err) => err.message)
                  : errors.media?.message
                    ? [errors.media.message]
                    : []
              }
              fileInputProps={{
                name: 'media',
                placeholder: 'Add images or videos',
                accept: [...ALLOWED_IMAGE_FORMATS, ...ALLOWED_VIDEO_FORMATS].join(', '),
                multiple: true,
                onChange: (e) => {
                  const files = Array.from(e.target.files || []);
                  const previews: TMediaOption[] = files.map((file) => ({
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith('video') ? 'video' : 'image',
                  }));

                  const newFiles = [...media.files, ...files];
                  const newPreviews = [...media.previews, ...previews];

                  setMedia({ files: newFiles, previews: newPreviews });
                  field.onChange(newFiles);
                },
              }}
              handleRemoveImage={(idx) => {
                const updatedFiles = media.files.filter((_, i) => i !== idx);
                const updatedPreviews = media.previews.filter((_, i) => i !== idx);

                setMedia({
                  files: updatedFiles,
                  previews: updatedPreviews,
                });
                field.onChange(updatedFiles);
              }}
              icons={{
                right: {
                  icon: (
                    <UploadCloudIcon className="stroke-primary opacity-50 group-hover:opacity-100" />
                  ),
                },
              }}
            />
          )}
        />
        <Button content="Submit" pattern="primary" buttonProps={{ type: 'submit' }} />
      </form>
    </ModalWrapper>
  );
};

export default AddReviewModal;
