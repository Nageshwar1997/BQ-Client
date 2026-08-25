import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, type SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import { Icon } from '@iconify/react';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import Canvas3D from '../../../3d/Components/Canvas3D';
import ToastCard from '../../../components/AlertCards/ToastCard';
import Button from '../../../components/Button';
import FilterDropdown from '../../../components/FilterDropdown';
import Input from '../../../components/Input';
import Modal from '../../../components/Modal';
import ModelUploadZone from '../../../components/ModelUploadZone';
import { defaultSettings, MODEL_MAX_SIZE } from '../../../constants';
import { useModelStore } from '../../../lib/store';
import {
  useUpdate3DAsset,
  useUpload3DAsset,
} from '../../../services/assets-service';
import { useGetCategories } from '../../../services/category-service';
import type { ModalProps, SelectedOption } from '../../../types';
import { useSpriteWorker } from '../../../webWorker/useSpriteWorker';
import { useCreateExperience } from '../../../services/experience-services';
import { getDefaultPayload, pathNameModuleMap } from '../../../lib/utils';

const fileSchema = z
  .custom<File>(
    (value): value is File =>
      typeof File !== 'undefined' && value instanceof File,
    { message: 'Model file is required' }
  )
  .refine((file) => file.size <= MODEL_MAX_SIZE, {
    message: `Model file size must be less than ${Math.floor(
      MODEL_MAX_SIZE / (1024 * 1024)
    )}MB`,
  })
  .refine((file) => /\.(glb|gltf)$/i.test(file.name), {
    message: 'Only .glb and .gltf files are supported',
  });

const upload3DAssetSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  category: z.string().trim().min(1, 'Category is required'),
  modelFile: fileSchema.optional(),
});

interface Upload3DAssetFormEditPrefillData {
  id: string;
  title: string;
  categoryId: string;
  modelUrl?: string;
}

interface Upload3DAssetFormValues {
  title: string;
  category: string;
  modelFile?: File;
}

interface Upload3DAssetFormSuccessPayload {
  _id?: string;
  title?: string;
  modelUrl?: string;
  spriteUrl?: string;
  thumbnailUrl?: string;
}

const Upload3DAssetForm = ({
  open,
  onClose,
  editPrefillData,
  onUploadSuccess,
}: Pick<ModalProps, 'open' | 'onClose'> & {
  editPrefillData?: Upload3DAssetFormEditPrefillData | null;
  onUploadSuccess?: (asset: Upload3DAssetFormSuccessPayload) => void;
}) => {
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const { pathname } = useLocation();
  const [isObjectModelUrl, setIsObjectModelUrl] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [uploadedAssetId, setUploadedAssetId] = useState<string | null>(null);
  const [successPreviewUrl, setSuccessPreviewUrl] = useState<string | null>(
    null
  );
  const [successAction, setSuccessAction] = useState<'uploaded' | 'updated'>(
    'uploaded'
  );
  const { reset } = useModelStore.getState();
  const isEditMode = Boolean(editPrefillData?.id);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { status, validationError } = useModelStore();

  const { generate, isLoading: isSpriteGenerating, error } = useSpriteWorker();

  const upload3DForm = useForm<Upload3DAssetFormValues>({
    resolver: zodResolver(upload3DAssetSchema),
  });
  const categoriesQuery = useGetCategories();
  const upload3DAssetQuery = useUpload3DAsset();
  const createExp = useCreateExperience();
  const update3DAssetQuery = useUpdate3DAsset(editPrefillData?.id);
  const isUploadingOrGenerating =
    upload3DAssetQuery.isPending ||
    update3DAssetQuery.isPending ||
    isSpriteGenerating;
  const watchedTitle = upload3DForm.watch('title');
  const watchedCategory = upload3DForm.watch('category');
  const watchedModelFile = upload3DForm.watch('modelFile');
  const hasBaseRequiredValues = Boolean(
    watchedTitle?.trim() && watchedCategory?.trim()
  );
  const initialTitle = editPrefillData?.title?.trim() ?? '';
  const initialCategory = editPrefillData?.categoryId?.trim() ?? '';
  const hasEditChanges =
    watchedTitle?.trim() !== initialTitle ||
    watchedCategory?.trim() !== initialCategory ||
    watchedModelFile instanceof File;
  const canSubmitCreate =
    hasBaseRequiredValues &&
    watchedModelFile instanceof File &&
    status === 'ready' &&
    !isUploadingOrGenerating;
  const canSubmitEdit =
    hasBaseRequiredValues && hasEditChanges && !isUploadingOrGenerating;
  const spriteSize = 512 / 2;
  const frames = 15;

  const categoryFilterOptions =
    categoriesQuery.data?.map((category: { _id: string; name: string }) => ({
      id: category._id,
      label: category.name,
    })) ?? [];

  // Revoke object URL on modelUrl
  useEffect(() => {
    if (!modelUrl || !isObjectModelUrl) return;
    return () => URL.revokeObjectURL(modelUrl);
  }, [modelUrl, isObjectModelUrl]);

  useEffect(() => {
    if (!open) return;

    setStep('form');
    setUploadedAssetId(null);
    setSuccessPreviewUrl(null);
    setSuccessAction('uploaded');

    if (editPrefillData) {
      upload3DForm.reset({
        title: editPrefillData.title,
        category: editPrefillData.categoryId,
      });
      setModelUrl(editPrefillData.modelUrl ?? null);
      setIsObjectModelUrl(false);
      setUploadError(null);
      return;
    }

    upload3DForm.reset();
    setUploadError(null);
    setModelUrl(null);
    setIsObjectModelUrl(false);
  }, [open, editPrefillData, upload3DForm]);

  // Revoke object URL if model is invalid
  useEffect(() => {
    if (status === 'invalid' && isObjectModelUrl) {
      URL.revokeObjectURL(modelUrl ?? '');
      setModelUrl(null);
      setIsObjectModelUrl(false);
      upload3DForm.resetField('modelFile');
    }
  }, [status, isObjectModelUrl, modelUrl, upload3DForm]);

  const handleFileUpload = (
    file: File,
    onFieldChange?: (file: File) => void
  ) => {
    reset();

    setModelUrl((prev) => {
      if (prev && isObjectModelUrl) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
    if (onFieldChange) {
      onFieldChange(file);
    }
    setIsObjectModelUrl(true);
  };

  const disposeFile = () => {
    if (modelUrl && isObjectModelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
    setModelUrl(null);
    setIsObjectModelUrl(false);
  };

  const handleClose = () => {
    upload3DForm.reset();
    setUploadError(null);
    setStep('form');
    setUploadedAssetId(null);
    setSuccessPreviewUrl(null);
    setSuccessAction('uploaded');
    disposeFile();
    onClose();
  };

  const handleSuccessClose = () => {
    const assetId = uploadedAssetId;
    handleClose();
    if (assetId) {
      navigate(`/3d-asset-library/${assetId}`);
    }
  };

  const handleSubmit: SubmitHandler<Upload3DAssetFormValues> = async (data) => {
    try {
      setUploadError(null);

      const uploadData = new FormData();
      if (data?.modelFile) {
        uploadData.append('modelFile', data.modelFile);
      }
      uploadData.append('title', data?.title);
      uploadData.append('categoryId', data?.category);
      try {
        if (data?.modelFile) {
          const { spriteFile, thumbnailFile } = await generate(
            data.modelFile,
            '/assets/hdri/studio.jpg'
          );
          uploadData.append('spriteFile', spriteFile);
          uploadData.append('thumbnailFile', thumbnailFile);
        }
      } catch (workerError) {
        console.error(workerError);
        return;
      }

      const mutationQuery = isEditMode
        ? update3DAssetQuery
        : upload3DAssetQuery;
      mutationQuery.mutate(uploadData, {
        onSuccess: async (res) => {
          if (res.success) {
            queryClient.invalidateQueries({ queryKey: ['get-3d-assets'] });
            const imagePreview = res.data?.spriteUrl ?? res.data?.thumbnailUrl;
            const assetId = res.data?._id ?? editPrefillData?.id ?? null;
            setUploadedAssetId(assetId);
            setSuccessPreviewUrl(imagePreview ?? null);
            setSuccessAction(isEditMode ? 'updated' : 'uploaded');
            if (onUploadSuccess && res.data) {
              onUploadSuccess(res.data as Upload3DAssetFormSuccessPayload);
              handleClose();
              return;
            }
            if (
              !isEditMode &&
              (pathname === '/3d-visualizer' || pathname === '/ar-experience')
            ) {
              try {
                const payLoad = getDefaultPayload(
                  res.data.modelUrl,
                  '',
                  assetId,
                  pathNameModuleMap[pathname]
                );
                await createExp.mutateAsync(payLoad, {
                  onSuccess: (res) => {
                    navigate(`${pathname}/${res.data._id}`);
                  },
                });
              } catch (error) {
                console.error('Save failed:', error);
              }
            } else {
              setStep('success');
            }
            return;
          }
        },
        onError: (error) => {
          if (error.message.includes('already exists')) {
            upload3DForm.setError('title', {
              type: 'custom',
              message: error.message,
            });
            setUploadError(null);
          } else {
            setUploadError('Usage limit exceeded for your current plan');
          }
        },
      });
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={step === 'success' ? handleSuccessClose : handleClose}
        className={`z-50! ${step === 'success'
            ? '[&>div]:h-[550px]! [&>div]:max-w-240! [&>div]:min-w-240 [&>div]:overflow-hidden!'
            : '[&>div]:min-w-260'
          }`}
      >
        {step === 'form' && (
          <div className="p-10">
            {/* Header */}
            <div className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <Icon
                  icon="solar:arrow-left-linear"
                  className="size-8 cursor-pointer"
                  onClick={handleClose}
                />
                <h2 className="text-2xl font-bold">
                  {isEditMode ? 'Edit 3D Model' : 'Upload a New 3D Model'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  content="Cancel"
                  onClick={handleClose}
                />
                <Button
                  content={
                    isUploadingOrGenerating
                      ? isEditMode
                        ? 'Updating....'
                        : 'Uploading...'
                      : isEditMode
                        ? 'Update'
                        : 'Done'
                  }
                  disabled={isEditMode ? !canSubmitEdit : !canSubmitCreate}
                  isLoading={isUploadingOrGenerating}
                  onClick={upload3DForm.handleSubmit(handleSubmit)}
                />
              </div>
            </div>

            <div className="flex w-full items-start gap-8 pt-5">
              <div className="flex w-full flex-col gap-2">
                <Input
                  placeholder="Name of the Product"
                  label="Product Name"
                  {...upload3DForm.register('title')}
                  type="text"
                  error={upload3DForm.formState.errors.title?.message}
                />

                <Controller
                  name="category"
                  control={upload3DForm.control}
                  render={({ field }) => (
                    <FilterDropdown
                      options={categoryFilterOptions}
                      outerLabel="Category"
                      value={field.value}
                      placeholder="Select Category"
                      className="[&>button]:w-full! [&>button]:px-3.5! [&>button]:py-2.5! [&>button>span:first-child]:font-thin!"
                      onChange={(selected) =>
                        field.onChange((selected as SelectedOption)?.id ?? '')
                      }
                      error={upload3DForm.formState.errors.category?.message}
                    />
                  )}
                />
              </div>

              {/* Right: Model upload / preview */}
              <Controller
                name="modelFile"
                control={upload3DForm.control}
                render={({ field }) => (
                  <div className="flex h-125 w-full flex-col items-center justify-center gap-2">
                    <input
                      ref={replaceInputRef}
                      type="file"
                      accept=".glb,.gltf"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        field.onChange(file);
                        handleFileUpload(file);
                        event.target.value = '';
                      }}
                    />
                    <div className="flex h-full w-full items-center justify-center">
                      {field.value || modelUrl ? (
                        <div className="relative h-full w-full">
                          {modelUrl && (
                            <Canvas3D
                              modelUrl={modelUrl}
                              settings={defaultSettings}
                              viewer={true}
                            />
                          )}
                          <div className="absolute right-3 bottom-3">
                            <Button
                              variant="ghost"
                              disabled={isUploadingOrGenerating}
                              content="Replace 3D Model"
                              className="w-fit! px-3! py-2! text-xs!"
                              leftIcon={
                                <Icon
                                  icon="solar:upload-minimalistic-linear"
                                  className="size-4"
                                />
                              }
                              onClick={() => replaceInputRef.current?.click()}
                            />
                          </div>
                        </div>
                      ) : (
                        <ModelUploadZone
                          onModelUpload={(file: File) => {
                            field.onChange(file);
                            handleFileUpload(file);
                          }}
                          validationText="Unable to fetch generated model"
                        >
                          {({ openFileDialog }) => (
                            <div className="text-neutral-gray-900 flex flex-col items-center gap-3">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-[14px]">
                                  Drop your 3D Models here
                                </span>
                                <span className="text-neutral-gray-600 text-[12px]">
                                  .glb file, upto{' '}
                                  {Math.floor(MODEL_MAX_SIZE / (1024 * 1024))}MB
                                </span>
                              </div>
                              <Button
                                variant="tertiary"
                                onClick={openFileDialog}
                                leftIcon={
                                  <Icon icon="solar:upload-minimalistic-linear" />
                                }
                                content="Upload"
                                className="w-fit!"
                              />
                            </div>
                          )}
                        </ModelUploadZone>
                      )}
                    </div>
                    {upload3DForm.formState.errors.modelFile?.message && (
                      <p className="text-ui-error w-full text-xs">
                        {upload3DForm.formState.errors.modelFile.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="flex h-full w-full flex-row-reverse items-center gap-8 p-10">
            <div className="flex flex-1 flex-col items-center justify-center gap-10 px-5">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative flex size-24 items-center justify-center">
                  <div className="bg-ui-success-light mb-6 rounded-full p-2">
                    <Icon
                      icon="solar:check-circle-bold"
                      className="text-ui-success size-24"
                    />
                  </div>
                </div>
                <h2 className="text-neutral-gray-900 font-metropolis text-2xl leading-[1.2] font-bold">
                  3D Model {successAction} to
                  <br />
                  library successfully!
                </h2>
              </div>

              <Button
                variant="secondary"
                size="sm"
                content="Close"
                className="w-fit! px-4! py-2.5!"
                onClick={handleSuccessClose}
              />
            </div>

            <div className="bg-neutral-gray-200 h-full flex-1 overflow-hidden rounded-3xl">
              {successPreviewUrl ? (
                <div className="group flex h-full w-full items-center justify-center rounded-2xl bg-[#EFF0F6]">
                  <div
                    className="group-hover:animate-ghost h-full w-65 bg-left bg-no-repeat"
                    style={
                      {
                        backgroundSize: `${spriteSize * frames}px ${spriteSize}px`,
                        backgroundImage: `url(${successPreviewUrl})`,
                        backgroundPositionY: '50%',
                        transform: 'scale(2)',
                        ['--to-x']: `${-(spriteSize * frames)}px`,
                        ['--from-x']: '0px',
                        ['--to-y']: '50%',
                        ['--from-y']: '50%',
                        ['--frameRate']: `steps(${frames})`,
                      } as CSSProperties
                    }
                  />
                </div>
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
          </div>
        )}
      </Modal>

      {status === 'invalid' && (
        <ToastCard
          type="error"
          title={validationError?.title}
          description={validationError?.description}
        />
      )}

      {uploadError && (
        <ToastCard
          type="error"
          title="Upload failed"
          description={uploadError}
        />
      )}

      {error && (
        <ToastCard
          type="error"
          title={'Sprite Generation Error'}
          description={error}
        />
      )}
    </>
  );
};

export default Upload3DAssetForm;
