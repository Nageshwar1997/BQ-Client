import { Icon } from '@iconify/react';
import { useEffect, useMemo, useState } from 'react';
import Button from '../../../../../components/Button';
import ModelUploadZone from '../../../../../components/ModelUploadZone';
import ThreeDCanvas from '../ThreeDCanvas';
import type { VisualizerProps } from '../../../../../types';
import { useModelStore } from '../../../../../lib/store';
import { Versa } from '../../../../../icons';
import { useNavigate } from 'react-router';
import { MODEL_MAX_SIZE } from '../../../../../constants';
import Select3DModelFromLibrary from '../../../../../components/Select3DModelFromLibrary';
import Upload3DAssetForm from '../../../../3d-asset-library/components/Upload3DAssetForm';
import { useCreateExperience } from '../../../../../services/experience-services';
import { get3DAssetId } from '../../../../../services/api';
import ProductAssetAssignmentModal from '../../../../../components/ProductAssetAssignmentModal';
import { getDefaultPayload, handleApiError } from '../../../../../lib/utils';
import type { ProductData } from '../../../../../components/ProductListItem';
import ToastCard from '../../../../../components/AlertCards/ToastCard';

interface RightContainerProps {
  settings: VisualizerProps;
  onSettingChange: React.Dispatch<React.SetStateAction<VisualizerProps>>;
}

const RightContainer = ({ settings, onSettingChange }: RightContainerProps) => {
  const { status, reset } = useModelStore();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const createExperience = useCreateExperience();

  const [isSelectLibraryOpen, setIsSelectLibraryOpen] = useState(false);
  const [isProductSelectionOpen, setIsProductSelectionOpen] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    title: string;
    description?: string;
  }>({ open: false, type: 'success', title: '' });

  const showToast = (
    type: 'success' | 'error',
    title: string,
    description?: string
  ) => {
    setToast({ open: true, type, title, description });
    setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 5000);
  };
  const handleModelUpload = (file: File) => {
    reset();
    onSettingChange((prev) => ({
      ...prev,
      modelFile: file,
    }));
  };

  // Memoize the model URL so it only changes when the model file changes
  const modelUrl = useMemo(() => {
    if (settings.modelFile) {
      return URL.createObjectURL(settings.modelFile);
    }
    return null;
  }, [settings.modelFile]);

  useEffect(() => {
    if (!modelUrl) return;
    return () => {
      URL.revokeObjectURL(modelUrl);
    };
  }, [modelUrl]);

  const handleOpenSelectFromLibrary = () => {
    setIsSelectLibraryOpen(true);
  };

  const handleOpenProductSelection = () => {
    setIsProductSelectionOpen(true);
  };

  const handleCloseSelectFromLibrary = () => {
    setIsSelectLibraryOpen(false);
  };

  const handleConfirmSelectedModel = async () => {
    if (!selectedModelId) return;

    try {
      const assetResponse = await get3DAssetId(selectedModelId);
      const modelUrl = assetResponse?.data?.modelUrl;

      if (!modelUrl) {
        return;
      }

      const productId = assetResponse?.data?.productId || '';

      const payload = getDefaultPayload(
        modelUrl,
        productId,
        selectedModelId,
        'ar_experience'
      );

      const response = await createExperience.mutateAsync(payload);
      const experienceId = response?.data?._id;

      if (!experienceId) {
        return;
      }

      navigate(`/ar-experience/${experienceId}`);
      setIsSelectLibraryOpen(false);
    } catch (error) {
      showToast(
        'error',
        'Failed to Create Experience',
        handleApiError({
          error: error as Error,
          fallback: 'There was an error creating the experience.',
        })
      );
      console.error('Failed to create AR experience:', error);
    }
  };

  const handleCreateExperience = async (
    assetId: string | null,
    selectedProduct: ProductData | null
  ) => {
    if (!assetId || !selectedProduct) return;

    try {
      const assetResponse = await get3DAssetId(assetId);
      const modelUrl = assetResponse?.data?.modelUrl;

      if (!modelUrl) {
        return;
      }

      const payload = getDefaultPayload(
        modelUrl,
        selectedProduct.id,
        assetId,
        'ar_experience'
      );

      if (!payload) {
        return;
      }

      const response = await createExperience.mutateAsync(payload);
      const experienceId = response?.data?._id;

      if (!experienceId) {
        return;
      }

      navigate(`/ar-experience/${experienceId}`);
      setIsProductSelectionOpen(false);
    } catch (error) {
      showToast(
        'error',
        'Failed to Create Experience',
        handleApiError({
          error: error as Error,
          fallback: 'There was an error creating the experience.',
        })
      );
      console.error('Failed to create AR experience:', error);
    }
  };

  return (
    <>
      <div className="font-metropolis text-neutral-gray-900 flex h-full w-full flex-col items-center justify-center gap-6 px-8 py-6">
        <div className="flex w-full justify-between">
          <span className="text-[20px] font-normal">
            New AR Markerless Experience
          </span>
          <div>
            <span className="text-[16px] font-semibold">Product: </span>
            <a className="text-[12px] font-medium underline" href="">
              Link Product
            </a>
          </div>
        </div>

        {status !== 'invalid' && modelUrl ? (
          <ThreeDCanvas settings={settings} modelUrl={modelUrl} />
        ) : (
          <ModelUploadZone
            onModelUpload={handleModelUpload}
            validationText="Please upload a GLB File"
          >
            {() => (
              <>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-[14px] font-medium">
                    Use the 3D model from product inventory
                  </span>
                  <Button
                    content="Select a Product"
                    variant="tertiary"
                    onClick={handleOpenProductSelection}
                    className="w-auto!"
                    leftIcon={
                      <Icon
                        icon="solar:box-minimalistic-linear"
                        width={20}
                        height={20}
                      />
                    }
                  />
                </div>

                <div className="inline-flex items-center gap-4">
                  <div className="border-neutral-gray-500 w-36.25 border-t"></div>
                  <span className="font-neutral-gray-700 text-[14px]">or</span>
                  <div className="border-neutral-gray-500 w-36.25 border-t"></div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[14px] font-medium">
                      Drop your 3D Model here
                    </span>
                    <span className="text-[12px]">
                      GLB format, up to{' '}
                      {Math.floor(MODEL_MAX_SIZE / (1024 * 1024))}MB
                    </span>
                  </div>

                  <div className="inline-flex gap-3">
                    <div>
                      <Button
                        content="Upload"
                        variant="outline"
                        onClick={() => setIsUploadModalOpen(true)}
                        leftIcon={
                          <Icon
                            icon="solar:upload-minimalistic-linear"
                            width={20}
                            height={20}
                          />
                        }
                        className="font-medium!"
                      />
                    </div>

                    <div>
                      <Button
                        content="Select from 3D Library"
                        variant="outline"
                        onClick={handleOpenSelectFromLibrary}
                        leftIcon={
                          <Icon
                            icon="solar:library-linear"
                            width={20}
                            height={20}
                          />
                        }
                        className="font-medium!"
                      />
                    </div>
                  </div>

                  <div></div>
                </div>

                <div className="inline-flex items-center gap-4">
                  <div className="border-neutral-gray-500 w-36.25 border-t"></div>
                  <span className="font-neutral-gray-700 text-[14px]">or</span>
                  <div className="border-neutral-gray-500 w-36.25 border-t"></div>
                </div>

                <div>
                  <Button
                    variant="gradient"
                    content="Generate a 3D Model"
                    leftIcon={<Versa />}
                    onClick={() => navigate('/versa-ai')}
                  />
                </div>
              </>
            )}
          </ModelUploadZone>
        )}

        <div className="text-neutral-gray-600 text-[14px]">
          Embed and share interactive 3D viewers for web and PDPs
        </div>
      </div>
      {isUploadModalOpen && (
        <Upload3DAssetForm
          open={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
        />
      )}

      <Select3DModelFromLibrary
        open={isSelectLibraryOpen}
        selectedModelId={selectedModelId}
        onSelectModel={setSelectedModelId}
        selectedModelIds={selectedModelIds}
        onSelectModels={setSelectedModelIds}
        onClose={handleCloseSelectFromLibrary}
        onConfirm={handleConfirmSelectedModel}
      />

      {isProductSelectionOpen && (
        <ProductAssetAssignmentModal
          open={isProductSelectionOpen}
          onClose={() => setIsProductSelectionOpen(false)}
          products={[]}
          preselectedAssetId={selectedModelId}
          modelInteractionVariant="selectable"
          modelConfirmButtonLabel="Continue"
          onModelConfirm={({ selectedAssetId, selectedProduct }) => {
            if (!selectedAssetId) return;
            handleCreateExperience(selectedAssetId, selectedProduct);
            setSelectedModelId(selectedAssetId);
            navigate(`/ar-experience/${selectedAssetId}`);
            setIsProductSelectionOpen(false);
          }}
        />
      )}

      {toast.open && (
        <ToastCard
          type={toast.type}
          title={toast.title}
          description={toast.description}
          autoClose={false}
        />
      )}
    </>
  );
};

export default RightContainer;
