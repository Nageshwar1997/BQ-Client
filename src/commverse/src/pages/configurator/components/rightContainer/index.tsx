import { Icon } from '@iconify/react';
import ConfiguratorCanvas from '../../../../3d/Components/configCanvas';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import ModelUploadZone from '../../../../components/ModelUploadZone';
import type { IConfigModel, VisualizerProps } from '../../../../types';
import { validateModel } from '../../../../3d/Utils';
import { useModelStore } from '../../../../lib/store';
import {
  MODEL_MAX_SIZE,
  TOTAL_MODEL_MAX_SIZE,
  VARIANT_DROPDOWN_OPTIONS,
} from '../../../../constants';
import FilterDropdown from '../../../../components/FilterDropdown';
// import { useGetCategories } from '../../../../services/category-service';
import { useGet3DAssets } from '../../../../services/assets-service';
import { get3DAssetId } from '../../../../services/api';
import { useNavigate } from 'react-router';
import { useState, useMemo, useEffect, useRef, memo } from 'react';
import { CheckIcon, Versa } from '../../../../icons';
import Select3DModelFromLibrary from '../../../../components/Select3DModelFromLibrary';
import Upload3DAssetForm from '../../../3d-asset-library/components/Upload3DAssetForm';
import PillLoader from '../../../../components/PillLoader';
import { DynamicInput } from '../../../../components/DynamicInput';

interface IEditionOptionButtonProps {
  edition: {
    name?: string;
    imageUrl?: string;
    color?: string;
  };
  eIdx: number;
  variantIdx: number;
  isSelected: boolean;
  textOnly: boolean;
  variantType: string;
  onSelect: (vIdx: number, eIdx: number) => void;
}

const EditionOptionButton = memo(
  ({
    edition,
    eIdx,
    variantIdx,
    isSelected,
    textOnly,
    onSelect,
    variantType,
  }: IEditionOptionButtonProps) => {
    if (textOnly) {
      return (
        <button
          onClick={() => {
            console.log(`Edition ${eIdx} of variant ${variantIdx} selected`);
            onSelect(variantIdx, eIdx);
          }}
          className={`rounded-lg px-4 py-2 text-[13px] font-semibold transition-all duration-300 ${
            isSelected
              ? 'bg-neutral-gray-900 text-white shadow-lg'
              : 'border-neutral-gray-300 text-neutral-gray-900 border bg-white'
          }`}
        >
          {edition.name || `Option ${eIdx + 1}`}
        </button>
      );
    }

    useEffect(() => {
      console.log('Variant type in EditionOptionButton:', variantType);
    }, [variantType]);

    return (
      <div className="flex flex-col items-center justify-end gap-2.5">
        <span className="text-neutral-gray-900 shadow-custom-xs line-clamp-3 max-w-[80px] rounded-md bg-white px-2 py-0.5 text-center text-[11px] font-semibold break-words whitespace-normal">
          {edition.name || `Option ${eIdx + 1}`}
        </span>
        <button
          onClick={() => onSelect(variantIdx, eIdx)}
          className={`relative flex h-12 max-h-12 min-h-12 w-12 max-w-12 min-w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
            isSelected
              ? 'border-neutral-gray-900 shadow-lg'
              : 'border-white shadow-md'
          }`}
          style={{
            backgroundColor:
              edition.color && variantType === 'pipette'
                ? edition.color || 'black'
                : 'transparent',
          }}
        >
          {variantType !== 'pipette' && edition.imageUrl && (
            <img
              src={edition.imageUrl}
              alt={edition.name}
              className="h-full w-full rounded-full object-cover"
            />
          )}
          {isSelected && (
            <span className="pointer-events-none absolute inset-0 z-2 flex items-center justify-center">
              <CheckIcon className="h-[24px] w-[24px]" />
            </span>
          )}
        </button>
      </div>
    );
  },
  (prev, next) =>
    prev.edition === next.edition &&
    prev.eIdx === next.eIdx &&
    prev.variantIdx === next.variantIdx &&
    prev.isSelected === next.isSelected &&
    prev.textOnly === next.textOnly &&
    prev.variantType === next.variantType
);

interface IRightContainerProps {
  models: IConfigModel[];
  setModels: React.Dispatch<React.SetStateAction<IConfigModel[]>>;
  activeModelId: string | null;
  setActiveModelId: React.Dispatch<React.SetStateAction<string | null>>;
  commonSettings: VisualizerProps;
  onCommonSettingsChange: React.Dispatch<React.SetStateAction<VisualizerProps>>;
  experienceTitle?: string;
  onTitleSubmit?: (value: string) => void;
}

interface TValidationReport {
  isValid: boolean;
  message: {
    title: string;
    description: string;
  };
}

interface LibraryAsset {
  _id?: string;
  id?: string;
  title?: string;
  modelUrl?: string;
  category?: { name: string; _id: string } | string | null;
  fileSize?: string;
  image?: string;
  spriteUrl?: string;
  linkedProductId?: string;
  productNameLinkedTo?: string | null;
  isAIGenerated?: boolean;
}

interface UploadedAssetPayload {
  _id?: string;
  id?: string;
  title?: string;
  modelUrl?: string;
}

interface ConfiguratorAssetDataEntry {
  assetId: string | null;
  modelUrl: string;
}

// Helper to check if an edition has a model (either File or URL from saved data)
const editionHasModel = (edition: {
  modelFile?: File | null;
  modelUrl?: string | null;
}) => !!(edition.modelFile || edition.modelUrl);

const handleModelValidation = async (
  modelUrl: string
): Promise<TValidationReport> => {
  const validationReport = await validateModel(modelUrl);
  const report: TValidationReport = {
    isValid: false,
    message: {
      title: '',
      description: '',
    },
  };

  if (validationReport.modelSize > MODEL_MAX_SIZE) {
    report.message = {
      title: 'File size Exceeds Limit',
      description: `Please upload a model smaller than ${Math.round(MODEL_MAX_SIZE / (1024 * 1024))}MB.`,
    };
    URL.revokeObjectURL(modelUrl);
    return report;
  } else if (
    validationReport.extensionsRequired?.includes(
      'KHR_materials_pbrSpecularGlossiness'
    )
  ) {
    report.message = {
      title: 'Model Validation Failed',
      description:
        'Model uses unsupported KHR_materials_pbrSpecularGlossiness extension',
    };
    URL.revokeObjectURL(modelUrl);
    return report;
  }

  report.isValid = true;
  return report;
};

const RightContainer = ({
  models,
  setModels,
  activeModelId,
  setActiveModelId,
  commonSettings,
  onCommonSettingsChange,
  experienceTitle,
  onTitleSubmit,
}: IRightContainerProps) => {
  const { setStatus, setValidationError } = useModelStore();
  const navigate = useNavigate();
  // const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewerModelLoading, setIsViewerModelLoading] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [isSelectLibraryOpen, setIsSelectLibraryOpen] = useState(false);
  const [selectedLibraryModelId, setSelectedLibraryModelId] = useState<
    string | null
  >(null);
  const [customBucketName, setCustomBucketName] = useState<string>('');
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [selectedEditionMap, setSelectedEditionMap] = useState<
    Record<number, number>
  >({});
  const [draftTitle, setDraftTitle] = useState<string>(experienceTitle || '');
  const editingEditionBlobUrlRef = useRef<{ file: File; url: string } | null>(
    null
  );
  const mainModelsRef = useRef<IConfigModel[]>(models);
  // Mirror of activeModelId prop — safe to read inside effects without adding to deps.
  const activeModelIdRef = useRef<string | null>(activeModelId);
  const variantShapeRef = useRef<number[]>(
    commonSettings.variants.map((variant) => variant.editions.length)
  );

  // Keep base models snapshot for fallback when variant editions don't have model files.
  useEffect(() => {
    if (models.length > 0 && !models[0].id.startsWith('edition-')) {
      mainModelsRef.current = models;
    }
  }, [models]);

  // Keep activeModelIdRef in sync so effects can read the latest value without stale closures.
  useEffect(() => {
    activeModelIdRef.current = activeModelId;
  }, [activeModelId]);

  useEffect(() => {
    setDraftTitle(experienceTitle || '');
  }, [experienceTitle]);

  // Sync bottom variant tab and 3D model when an edition is selected in configurator options.
  useEffect(() => {
    if (!commonSettings.editingEdition) return;

    const { vIdx, eIdx } = commonSettings.editingEdition;
    const editingEdition = commonSettings.variants[vIdx]?.editions[eIdx];
    setActiveVariantIdx(vIdx);
    if (editingEdition?.visible !== false && editionHasModel(editingEdition)) {
      setSelectedEditionMap((prev) => ({
        ...prev,
        [vIdx]: eIdx,
      }));

      // Also load the model if it isn't already active — keeps the right container
      // 3D viewer in sync so clicking the same button afterwards is always a no-op.
      const targetModelId = `edition-${vIdx}-${eIdx}`;
      if (activeModelIdRef.current !== targetModelId) {
        const url = editingEdition.modelFile
          ? URL.createObjectURL(editingEdition.modelFile)
          : editingEdition.modelUrl!;
        setModels([
          {
            id: targetModelId,
            url,
            name: editingEdition.modelFile?.name || 'Saved model',
            modelTransform: editingEdition.modelTransform ?? {
              scale: 1,
              rotation: { x: 0, y: 0, z: 0 },
            },
          },
        ]);
        setActiveModelId(targetModelId);
        setStatus('loading');
      }
    }
  }, [commonSettings.editingEdition]);

  // Ensure the most recently added variant/edition is selected.
  useEffect(() => {
    const currentShape = commonSettings.variants.map(
      (variant) => variant.editions.length
    );
    const previousShape = variantShapeRef.current;

    if (currentShape.length > previousShape.length) {
      const latestVariantIdx = currentShape.length - 1;
      const latestEditionIdx = Math.max(currentShape[latestVariantIdx] - 1, 0);
      const latestEdition =
        commonSettings.variants[latestVariantIdx]?.editions[latestEditionIdx];
      setActiveVariantIdx(latestVariantIdx);
      if (latestEdition?.visible !== false && editionHasModel(latestEdition)) {
        setSelectedEditionMap((prev) => ({
          ...prev,
          [latestVariantIdx]: latestEditionIdx,
        }));
      }
      variantShapeRef.current = currentShape;
      return;
    }

    for (
      let variantIdx = 0;
      variantIdx < currentShape.length;
      variantIdx += 1
    ) {
      const currentEditionCount = currentShape[variantIdx] ?? 0;
      const previousEditionCount = previousShape[variantIdx] ?? 0;

      if (currentEditionCount > previousEditionCount) {
        const latestEditionIdx = currentEditionCount - 1;
        const latestEdition =
          commonSettings.variants[variantIdx]?.editions[latestEditionIdx];
        setActiveVariantIdx(variantIdx);
        if (
          latestEdition?.visible !== false &&
          editionHasModel(latestEdition)
        ) {
          setSelectedEditionMap((prev) => ({
            ...prev,
            [variantIdx]: latestEditionIdx,
          }));
        }
        break;
      }
    }

    variantShapeRef.current = currentShape;
  }, [commonSettings.variants]);

  // When the active edition model becomes hidden via the visibility toggle, revert to the base model.
  useEffect(() => {
    if (!activeModelId || !activeModelId.startsWith('edition-')) return;

    const parts = activeModelId.split('-');
    const vIdx = parseInt(parts[1], 10);
    const eIdx = parseInt(parts[2], 10);
    const activeEdition = commonSettings.variants[vIdx]?.editions[eIdx];

    if (activeEdition?.visible === false) {
      if (mainModelsRef.current.length > 0) {
        setModels(mainModelsRef.current);
        setActiveModelId(mainModelsRef.current[0].id);
      }
      setSelectedEditionMap((prev) => {
        const next = { ...prev };
        delete next[vIdx];
        return next;
      });
    }
  }, [commonSettings.variants]);

  // Clamp activeVariantIdx when variants are deleted
  useEffect(() => {
    if (commonSettings.variants.length === 0) {
      setActiveVariantIdx(0);
    } else if (activeVariantIdx >= commonSettings.variants.length) {
      setActiveVariantIdx(commonSettings.variants.length - 1);
    }
  }, [commonSettings.variants.length, activeVariantIdx]);

  // const categoriesQuery = useGetCategories();
  const assetsQuery = useGet3DAssets();

  // const categoryFilterOptions = useMemo(() => {
  //   if (categoriesQuery?.data) {
  //     return categoriesQuery?.data?.map(
  //       (category: { _id: string; slug: string; name: string }) => ({
  //         id: category._id,
  //         value: category.slug,
  //         label: category.name,
  //       })
  //     );
  //   }
  //   return [];
  // }, [categoriesQuery?.data]);

  const getVariantTypeLabel = (type: string) =>
    VARIANT_DROPDOWN_OPTIONS.find((option) => option.id === type)?.label ||
    type;

  const getAssetIdentifier = (asset: { _id?: string; id?: string }) =>
    asset._id ?? asset.id ?? null;

  const upsertAssetData = (
    existing: ConfiguratorAssetDataEntry[] | null | undefined,
    assetId: string | null,
    modelUrl?: string | null
  ): ConfiguratorAssetDataEntry[] => {
    if (!modelUrl) return existing ?? [];

    const current = existing ?? [];
    if (assetId) {
      const filtered = current.filter((item) => item.assetId !== assetId);
      return [...filtered, { assetId, modelUrl }];
    }

    const hasLocalEntry = current.some(
      (item) => item.assetId === null && item.modelUrl === modelUrl
    );
    return hasLocalEntry ? current : [...current, { assetId: null, modelUrl }];
  };

  const editingEditionData = useMemo(() => {
    if (!commonSettings.editingEdition) return null;
    const { vIdx, eIdx } = commonSettings.editingEdition;
    const edition = commonSettings.variants[vIdx]?.editions[eIdx];
    if (!edition) return null;

    return {
      vIdx,
      eIdx,
      modelFile: edition.modelFile ?? null,
      modelUrl: edition.modelUrl ?? null,
      modelTransform: edition.modelTransform ?? {
        scale: 1,
        rotation: { x: 0, y: 0, z: 0 },
      },
    };
  }, [commonSettings.editingEdition, commonSettings.variants]);

  const editingEditionModelUrl = useMemo(() => {
    if (!editingEditionData) {
      if (editingEditionBlobUrlRef.current) {
        URL.revokeObjectURL(editingEditionBlobUrlRef.current.url);
        editingEditionBlobUrlRef.current = null;
      }
      return null;
    }

    if (editingEditionData.modelFile) {
      const existingBlob = editingEditionBlobUrlRef.current;
      if (existingBlob?.file === editingEditionData.modelFile) {
        return existingBlob.url;
      }

      if (existingBlob) {
        URL.revokeObjectURL(existingBlob.url);
      }

      const blobUrl = URL.createObjectURL(editingEditionData.modelFile);
      editingEditionBlobUrlRef.current = {
        file: editingEditionData.modelFile,
        url: blobUrl,
      };

      return blobUrl;
    }

    if (editingEditionBlobUrlRef.current) {
      URL.revokeObjectURL(editingEditionBlobUrlRef.current.url);
      editingEditionBlobUrlRef.current = null;
    }

    return editingEditionData.modelUrl;
  }, [editingEditionData?.modelFile, editingEditionData?.modelUrl]);

  const editingEditionModel = useMemo(() => {
    if (!editingEditionData || !editingEditionModelUrl) return null;

    return {
      id: `editing-${editingEditionData.vIdx}-${editingEditionData.eIdx}`,
      url: editingEditionModelUrl,
      name: editingEditionData.modelFile?.name ?? 'Saved model',
      modelTransform: editingEditionData.modelTransform,
    };
  }, [
    editingEditionData?.vIdx,
    editingEditionData?.eIdx,
    editingEditionData?.modelFile?.name,
    editingEditionData?.modelTransform,
    editingEditionModelUrl,
  ]);

  useEffect(() => {
    return () => {
      if (editingEditionBlobUrlRef.current) {
        URL.revokeObjectURL(editingEditionBlobUrlRef.current.url);
        editingEditionBlobUrlRef.current = null;
      }
    };
  }, []);

  const displayModels = useMemo(
    () => (editingEditionModel ? [editingEditionModel] : models),
    [editingEditionModel, models]
  );
  const displayActiveId = editingEditionModel
    ? editingEditionModel.id
    : activeModelId;

  const canvasCommonSettings = useMemo(
    () => commonSettings,
    [
      commonSettings.camera.position.x,
      commonSettings.camera.position.y,
      commonSettings.camera.position.z,
      commonSettings.environment,
      commonSettings.shadowIntensity,
      commonSettings.modelTransform.scale,
      commonSettings.modelTransform.rotationAxis.x,
      commonSettings.modelTransform.rotationAxis.y,
      commonSettings.modelTransform.rotationAxis.z,
      commonSettings.zoom.min,
      commonSettings.zoom.max,
    ]
  );

  const isEditingEditionWithModel = !!editingEditionModel;

  // const productFilters = [
  //   {
  //     label: 'Category',
  //     icon: <Icon icon="solar:widget-2-linear" className="size-4" />,
  //     options: categoryFilterOptions,
  //   },
  // ];

  const handleEditionSelect = (vIdx: number, eIdx: number) => {
    // Early return when the selection map and editingEdition are already in sync with this edition.
    // The sync effect above ensures the 3D model is also loaded whenever editingEdition is set,
    // so we don't need to check activeModelId here to decide whether to skip.
    console.log('Selecting edition:', { vIdx, eIdx });
    if (
      selectedEditionMap[vIdx] === eIdx &&
      commonSettings.editingEdition?.vIdx === vIdx &&
      commonSettings.editingEdition?.eIdx === eIdx
    ) {
      console.log('Selected same edition, no action taken');
      return;
    }
    setSelectedEditionMap((prev) => ({
      ...prev,
      [vIdx]: eIdx,
    }));
    onCommonSettingsChange((prev) => ({
      ...prev,
      editingEdition: { vIdx, eIdx },
    }));

    const selectedVariant = commonSettings.variants[vIdx];
    const selectedEdition = selectedVariant.editions[eIdx];

    if (selectedEdition.modelFile || selectedEdition.modelUrl) {
      setStatus('loading'); // Show loader while model is loading
      const url = selectedEdition.modelFile
        ? URL.createObjectURL(selectedEdition.modelFile)
        : selectedEdition.modelUrl!;
      const modelId = `edition-${vIdx}-${eIdx}`;

      const variantModel = {
        id: modelId,
        url,
        name: selectedEdition.modelFile?.name || 'Saved model',
        modelTransform: selectedEdition.modelTransform ?? {
          scale: 1,
          rotation: { x: 0, y: 0, z: 0 },
        },
      };

      setModels([variantModel]);
      setActiveModelId(modelId);
    } else {
      // Revert to main model if this variant doesn't have one
      if (mainModelsRef.current.length > 0) {
        setModels(mainModelsRef.current);
        setActiveModelId(mainModelsRef.current[0].id);
      }
    }
  };

  const handleAddVariant = () => {
    if (!selectedBucket) return;
    const newVariantIdx = commonSettings.variants.length;

    onCommonSettingsChange((prev) => ({
      ...prev,
      editingEdition: { vIdx: newVariantIdx, eIdx: 0 },
      variants: [
        ...prev.variants,
        {
          selectedType: selectedBucket,
          customType:
            selectedBucket === 'other' ? customBucketName || 'custom' : '',
          activeTabId: selectedBucket === 'colour' ? 'pipette' : 'image',
          editions: [
            {
              name: '',
              imageUrl: '',
              color: selectedBucket === 'colour' ? '#000000' : '',
              visible: true,
              modelUrl: null,
              modelId: null,
              modelFile: null,
            },
          ],
        },
      ],
    }));

    setActiveVariantIdx(newVariantIdx);
    if (selectedBucket === 'other') {
      setCustomBucketName('');
    }
  };

  const handleModelUpload = async (file: File) => {
    const modelUrl = URL.createObjectURL(file);

    setStatus('validating');

    // Check individual file size
    if (file.size > MODEL_MAX_SIZE) {
      setStatus('invalid');
      setValidationError({
        title: 'File Size Exceeds Limit',
        description: `Each model must be smaller than ${Math.round(MODEL_MAX_SIZE / (1024 * 1024))}MB.`,
      });
      URL.revokeObjectURL(modelUrl);
      return;
    }

    // Calculate total size of all existing models
    let totalSize = file.size;

    // Add size from existing models in the models array
    for (const model of models) {
      if (model.url.startsWith('blob:')) {
        // For blob URLs, we need to estimate or track size differently
        // Since we can't get size from blob URL directly, we'll track it via variants
      }
    }

    // Add size from all variant editions
    for (const variant of commonSettings.variants) {
      for (const edition of variant.editions) {
        if (edition.modelFile) {
          totalSize += edition.modelFile.size;
        }
      }
    }

    // Check total size limit
    if (totalSize > TOTAL_MODEL_MAX_SIZE) {
      setStatus('invalid');
      setValidationError({
        title: 'Total Upload Size Exceeded',
        description: `Total model uploads cannot exceed ${Math.round(TOTAL_MODEL_MAX_SIZE / (1024 * 1024))}MB. Current total: ${Math.round(totalSize / (1024 * 1024))}MB.`,
      });
      URL.revokeObjectURL(modelUrl);
      return;
    }

    const validationReport = await handleModelValidation(modelUrl);
    if (!validationReport.isValid) {
      setStatus('invalid');
      setValidationError(validationReport.message);
      return;
    }

    if (commonSettings.editingEdition) {
      const { vIdx, eIdx } = commonSettings.editingEdition;
      const modelId = `edition-${vIdx}-${eIdx}`;

      const variantModel = {
        id: modelId,
        url: modelUrl,
        name: file.name,
        modelTransform: {
          scale: 1,
          rotation: { x: 0, y: 0, z: 0 },
        },
      };

      onCommonSettingsChange((prev) => {
        const newVariants = [...prev.variants];
        const newEditions = [...newVariants[vIdx].editions];
        newEditions[eIdx] = {
          ...newEditions[eIdx],
          modelFile: file,
          modelUrl,
          modelId: null,
          modelTransform: { scale: 1, rotation: { x: 0, y: 0, z: 0 } },
        };
        newVariants[vIdx] = {
          ...newVariants[vIdx],
          editions: newEditions,
        };
        return {
          ...prev,
          variants: newVariants,
          editingEdition: null,
          modelFile: file,
          modelUrl,
          assetId: null,
          assetData: upsertAssetData(prev.assetData, null, modelUrl),
        };
      });

      setSelectedEditionMap((prev) => ({
        ...prev,
        [vIdx]: eIdx,
      }));
      setModels([variantModel]);
      setActiveModelId(modelId);
      setStatus('idle');
      return;
    }

    setStatus('loading');
    const modelId = crypto.randomUUID();
    const newModel = {
      id: modelId,
      url: modelUrl,
      name: file.name,
      modelTransform: {
        scale: 1,
        rotation: { x: 0, y: 0, z: 0 },
      },
    };

    setModels((prev) => [...prev, newModel]);
    mainModelsRef.current = [...mainModelsRef.current, newModel];
    setActiveModelId(modelId);
    onCommonSettingsChange((prev) => ({
      ...prev,
      modelFile: file,
      modelUrl,
      assetId: null,
      assetData: upsertAssetData(prev.assetData, null, modelUrl),
    }));
  };

  const handleOpenSelectFromLibrary = () => {
    setIsSelectLibraryOpen(true);
  };

  const handleCloseSelectFromLibrary = () => {
    setIsSelectLibraryOpen(false);
    setSelectedLibraryModelId(null);
  };

  const handleUploadedAssetSuccess = async (asset: UploadedAssetPayload) => {
    if (!asset.modelUrl) return;

    const modelName = asset.title ?? 'Uploaded model';
    const assetId = getAssetIdentifier(asset);

    if (commonSettings.editingEdition) {
      setIsViewerModelLoading(true);
      const { vIdx, eIdx } = commonSettings.editingEdition;
      const modelId = `edition-${vIdx}-${eIdx}`;

      setSelectedEditionMap((prev) => ({ ...prev, [vIdx]: eIdx }));
      setModels([
        {
          id: modelId,
          url: asset.modelUrl as string,
          name: modelName,
          modelTransform: {
            scale: 1,
            rotation: { x: 0, y: 0, z: 0 },
          },
        },
      ]);
      setActiveModelId(modelId);
      onCommonSettingsChange((prev) => {
        const newVariants = [...prev.variants];
        const newEditions = [...newVariants[vIdx].editions];
        newEditions[eIdx] = {
          ...newEditions[eIdx],
          modelFile: null,
          modelUrl: asset.modelUrl,
          modelId: assetId ?? null,
        };
        newVariants[vIdx] = {
          ...newVariants[vIdx],
          editions: newEditions,
        };
        return {
          ...prev,
          variants: newVariants,
          modelUrl: asset.modelUrl,
          assetId: assetId ? [assetId] : prev.assetId,
          assetData: upsertAssetData(prev.assetData, assetId, asset.modelUrl),
        };
      });

      try {
        const res = await fetch(asset.modelUrl);
        const blob = await res.blob();
        const file = new File([blob], `${modelName}.glb`, {
          type: 'model/gltf-binary',
        });
        onCommonSettingsChange((prev) => {
          const newVariants = [...prev.variants];
          const newEditions = [...newVariants[vIdx].editions];
          newEditions[eIdx] = {
            ...newEditions[eIdx],
            modelFile: file,
            modelUrl: asset.modelUrl,
            modelId: assetId ?? null,
            modelTransform: { scale: 1, rotation: { x: 0, y: 0, z: 0 } },
          };
          newVariants[vIdx] = {
            ...newVariants[vIdx],
            editions: newEditions,
          };
          return {
            ...prev,
            variants: newVariants,
            editingEdition: null,
            modelFile: file,
            modelUrl: asset.modelUrl,
            assetId: assetId ? [assetId] : prev.assetId,
            assetData: upsertAssetData(prev.assetData, assetId, asset.modelUrl),
          };
        });
      } catch (error) {
        console.error('Failed to persist uploaded model into edition:', error);
        onCommonSettingsChange((prev) => {
          const newVariants = [...prev.variants];
          const newEditions = [...newVariants[vIdx].editions];
          newEditions[eIdx] = {
            ...newEditions[eIdx],
            modelFile: null,
            modelUrl: asset.modelUrl,
            modelId: assetId ?? null,
            modelTransform: { scale: 1, rotation: { x: 0, y: 0, z: 0 } },
          };
          newVariants[vIdx] = {
            ...newVariants[vIdx],
            editions: newEditions,
          };
          return {
            ...prev,
            variants: newVariants,
            modelUrl: asset.modelUrl,
            assetId: assetId ? [assetId] : prev.assetId,
            assetData: upsertAssetData(prev.assetData, assetId, asset.modelUrl),
          };
        });
      } finally {
        setIsViewerModelLoading(false);
      }

      return;
    }

    const modelId = crypto.randomUUID();
    const newModel = {
      id: modelId,
      url: asset.modelUrl,
      name: modelName,
      modelTransform: {
        scale: 1,
        rotation: { x: 0, y: 0, z: 0 },
      },
    };

    setModels((prev) => [...prev, newModel]);
    mainModelsRef.current = [...mainModelsRef.current, newModel];
    setActiveModelId(modelId);
    onCommonSettingsChange((prev) => ({
      ...prev,
      modelUrl: asset.modelUrl,
      assetId: assetId ? [assetId] : prev.assetId,
      assetData: upsertAssetData(prev.assetData, assetId, asset.modelUrl),
    }));
    try {
      const res = await fetch(asset.modelUrl);
      const blob = await res.blob();
      const file = new File([blob], `${modelName}.glb`, {
        type: 'model/gltf-binary',
      });
      onCommonSettingsChange((prev) => ({
        ...prev,
        modelFile: file,
        modelUrl: asset.modelUrl,
        assetId: assetId ? [assetId] : prev.assetId,
        assetData: upsertAssetData(prev.assetData, assetId, asset.modelUrl),
      }));
    } catch (error) {
      console.error('Failed to persist uploaded model in settings:', error);
    }
    setIsViewerModelLoading(false);
  };

  function parseFileSize(size: string) {
    const [value, unit] = size.split(' ');
    const num = parseFloat(value);

    switch (unit) {
      case 'KB':
        return num * 1024;
      case 'MB':
        return num * 1024 * 1024;
      case 'GB':
        return num * 1024 * 1024 * 1024;
      default:
        return num;
    }
  }

  const handleConfirmLibraryModel = async () => {
    if (!selectedLibraryModelId) return;

    let asset =
      libraryAssets.find(
        (a) =>
          String(a._id ?? a.id ?? '') === String(selectedLibraryModelId ?? '')
      ) ?? null;

    if (!asset) {
      try {
        const response = await get3DAssetId(selectedLibraryModelId);
        const fetchedAsset = response?.data as LibraryAsset | undefined;
        asset = fetchedAsset ?? null;
      } catch (error) {
        console.error('Failed to fetch selected library model:', error);
      }
    }

    const fileSize = parseFileSize(asset?.fileSize || '');

    // Check individual file size
    if (fileSize && fileSize > MODEL_MAX_SIZE) {
      setStatus('invalid');
      setValidationError({
        title: 'File Size Exceeds Limit',
        description: `Each model must be smaller than ${Math.round(MODEL_MAX_SIZE / (1024 * 1024))}MB.`,
      });
      handleCloseSelectFromLibrary();
      return;
    }

    let totalSize = fileSize;

    // Add size from all variant editions
    for (const variant of commonSettings.variants) {
      for (const edition of variant.editions) {
        if (edition.modelFile) {
          totalSize += edition.modelFile.size;
        }
      }
    }

    // Check total size limit
    if (totalSize > TOTAL_MODEL_MAX_SIZE) {
      setStatus('invalid');
      setValidationError({
        title: 'Total Upload Size Exceeded',
        description: `Total model uploads cannot exceed ${Math.round(TOTAL_MODEL_MAX_SIZE / (1024 * 1024))}MB. Current total: ${Math.round(totalSize / (1024 * 1024))}MB.`,
      });
      return;
    }

    if (!asset?.modelUrl) return;
    const selectedAssetId = getAssetIdentifier(asset);

    if (commonSettings.editingEdition) {
      const { vIdx, eIdx } = commonSettings.editingEdition;
      const modelId = `edition-${vIdx}-${eIdx}`;

      // Load selected library model into viewer immediately
      setSelectedEditionMap((prev) => ({ ...prev, [vIdx]: eIdx }));
      setModels([
        {
          id: modelId,
          url: asset.modelUrl,
          name: asset.title ?? 'Selected model',
          modelTransform: {
            scale: 1,
            rotation: { x: 0, y: 0, z: 0 },
          },
        },
      ]);
      setActiveModelId(modelId);
      onCommonSettingsChange((prev) => {
        const newVariants = [...prev.variants];
        const newEditions = [...newVariants[vIdx].editions];
        newEditions[eIdx] = {
          ...newEditions[eIdx],
          modelFile: null,
          modelUrl: asset.modelUrl,
          modelId: selectedAssetId ?? null,
          modelTransform: { scale: 1, rotation: { x: 0, y: 0, z: 0 } },
        };
        newVariants[vIdx] = {
          ...newVariants[vIdx],
          editions: newEditions,
        };
        return {
          ...prev,
          variants: newVariants,
          modelUrl: asset.modelUrl,
          assetId: selectedAssetId ? [selectedAssetId] : prev.assetId,
          assetData: upsertAssetData(
            prev.assetData,
            selectedAssetId,
            asset.modelUrl
          ),
        };
      });

      // Persist as File for edition data when available
      fetch(asset.modelUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], asset.title || 'model.glb', {
            type: 'model/gltf-binary',
          });
          onCommonSettingsChange((prev) => {
            const newVariants = [...prev.variants];
            const newEditions = [...newVariants[vIdx].editions];
            newEditions[eIdx] = {
              ...newEditions[eIdx],
              modelFile: file,
              modelUrl: asset.modelUrl,
              modelId: selectedAssetId ?? null,
            };
            newVariants[vIdx] = {
              ...newVariants[vIdx],
              editions: newEditions,
            };
            return {
              ...prev,
              variants: newVariants,
              editingEdition: null,
              modelFile: file,
              modelUrl: asset.modelUrl,
              assetId: selectedAssetId ? [selectedAssetId] : prev.assetId,
              assetData: upsertAssetData(
                prev.assetData,
                selectedAssetId,
                asset.modelUrl
              ),
            };
          });
        })
        .catch(() => {
          onCommonSettingsChange((prev) => {
            const newVariants = [...prev.variants];
            const newEditions = [...newVariants[vIdx].editions];
            newEditions[eIdx] = {
              ...newEditions[eIdx],
              modelFile: null,
              modelUrl: asset.modelUrl,
              modelId: selectedAssetId ?? null,
            };
            newVariants[vIdx] = {
              ...newVariants[vIdx],
              editions: newEditions,
            };
            return {
              ...prev,
              variants: newVariants,
              editingEdition: null,
              modelUrl: asset.modelUrl,
              assetId: selectedAssetId ? [selectedAssetId] : prev.assetId,
              assetData: upsertAssetData(
                prev.assetData,
                selectedAssetId,
                asset.modelUrl
              ),
            };
          });
        });

      handleCloseSelectFromLibrary();
      return;
    }

    const modelId = crypto.randomUUID();
    const selectedModel = {
      id: modelId,
      url: asset.modelUrl,
      name: asset.title ?? 'Selected model',
      modelTransform: {
        scale: 1,
        rotation: { x: 0, y: 0, z: 0 },
      },
    };

    setModels((prev) => [...prev, selectedModel]);
    mainModelsRef.current = [...mainModelsRef.current, selectedModel];
    setActiveModelId(modelId);
    onCommonSettingsChange((prev) => ({
      ...prev,
      modelUrl: asset.modelUrl,
      assetId: selectedAssetId ? [selectedAssetId] : prev.assetId,
      assetData: upsertAssetData(
        prev.assetData,
        selectedAssetId,
        asset.modelUrl
      ),
    }));
    fetch(asset.modelUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], asset.title || 'model.glb', {
          type: 'model/gltf-binary',
        });
        onCommonSettingsChange((prev) => ({
          ...prev,
          modelFile: file,
          modelUrl: asset.modelUrl,
          assetId: selectedAssetId ? [selectedAssetId] : prev.assetId,
          assetData: upsertAssetData(
            prev.assetData,
            selectedAssetId,
            asset.modelUrl
          ),
        }));
      })
      .catch((error) => {
        console.error('Failed to persist selected library model:', error);
      });
    handleCloseSelectFromLibrary();
  };
  /* --- START DEMO CODE --- */
  const libraryAssets =
    // const demoAsset = {
    //   _id: 'demo-asset-id',
    //   title: 'Mahindra XUV300 Demo Asset',
    //   modelUrl: '/assets/models/xuv3.glb',
    //   category: 'Automobile',
    //   fileSize: '12MB',
    //   image: '/assets/images/ghost.png',
    //   linkedProductId: 'demo-xuv3-product',
    //   productNameLinkedTo: 'Mahindra XUV300 Demo',
    // };
    (assetsQuery?.data?.data as LibraryAsset[] | undefined) ?? [];
  /* --- END DEMO CODE --- */

  return (
    <>
      <div className="font-metropolis text-neutral-gray-900 flex h-full w-full flex-col items-center justify-center gap-6 px-8 py-3">
        <div className="flex w-full items-center justify-between">
          <span className="text-neutral-gray-900 text-[20px] font-bold">
            <DynamicInput
              value={draftTitle}
              defaultText="New 3D Configurator Experience"
              onSubmit={(value) => {
                setDraftTitle(value);
                onTitleSubmit?.(value);
              }}
            />
          </span>
          {/* Product linking */}
          {/* <div className="flex items-center gap-1.5">
            <span className="text-neutral-gray-900 text-[14px] font-semibold">
              Product:{' '}
            </span>
            <a
              className="text-primary-500 hover:text-primary-600 flex items-center gap-1 text-[13px] font-medium underline transition-colors"
              href="#"
            >
              Traditional Tribal Designer Wooden Stool
            </a>
            <Icon
              icon="solar:arrow-right-up-linear"
              className="text-neutral-gray-500"
              width={14}
            />
            <Icon
              icon="solar:link-linear"
              className="text-neutral-gray-500"
              width={14}
            />
          </div> */}
        </div>

        {(models.length === 0 ||
          commonSettings.editingEdition ||
          commonSettings.variants.length === 0) &&
        !isEditingEditionWithModel ? (
          isViewerModelLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <PillLoader description="Loading model in viewer..." />
            </div>
          ) : (
            <ModelUploadZone
              onModelUpload={handleModelUpload}
              validationText="We support only GLB format currently"
              className="h-full"
            >
              {() => (
                <>
                  {/* Main model chips removed as per user request */}
                  {!isSelectLibraryOpen && (
                    <>
                      {!commonSettings.editingEdition &&
                      commonSettings.variants.length === 0 ? (
                        <>
                          <div className="flex flex-col items-center gap-3">
                            <span className="text-[14px] font-medium">
                              Start by adding a variant type
                            </span>
                            <div
                              className={`flex w-full max-w-lg items-center justify-center gap-4 ${selectedBucket === 'other' ? 'flex-col' : ''}`}
                            >
                              <FilterDropdown
                                placeholder="Select Variant"
                                options={VARIANT_DROPDOWN_OPTIONS}
                                className="min-w-64! [&>button]:h-11!"
                                value={selectedBucket}
                                onChange={(val) =>
                                  setSelectedBucket(
                                    (val as { id: string })?.id ?? null
                                  )
                                }
                              />

                              {selectedBucket === 'other' && (
                                <Input
                                  placeholder="Variant Type Name"
                                  className="h-11! min-w-64!"
                                  value={customBucketName}
                                  onChange={(e: any) =>
                                    setCustomBucketName(e.target.value)
                                  }
                                />
                              )}

                              <Button
                                content="Add New Variant"
                                variant="secondary"
                                className="h-11! rounded-lg! px-6! font-semibold!"
                                onClick={handleAddVariant}
                                disabled={
                                  selectedBucket === 'other' &&
                                  !customBucketName
                                }
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center gap-3">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[14px] font-medium">
                                Drop your 3D Model here
                              </span>
                              <span className="text-[12px]">
                                GLB format, up to 50 MB per model,and a total of
                                250MB
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
                            <div className="border-neutral-gray-500 w-[145px] border-t"></div>
                            <span className="font-neutral-gray-700 text-[14px]">
                              or
                            </span>
                            <div className="border-neutral-gray-500 w-[145px] border-t"></div>
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
                    </>
                  )}
                </>
              )}
            </ModelUploadZone>
          )
        ) : (
          <>
            {/* Canvas */}
            <div className="border-neutral-gray-300 relative flex h-full w-full flex-1 overflow-hidden rounded-[32px] border bg-[#F7F8FA]">
              <ConfiguratorCanvas
                models={displayModels}
                activeModelId={displayActiveId}
                commonSettings={canvasCommonSettings}
              />

              {/* Variant Selection Overlay */}
              {commonSettings.variants.length > 0 && (
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end">
                  {/* Options List */}
                  {commonSettings.variants[
                    Math.min(
                      activeVariantIdx,
                      commonSettings.variants.length - 1
                    )
                  ] && (
                    <div className="pointer-events-auto mb-6 flex flex-wrap justify-center gap-6 px-4">
                      {commonSettings.variants[
                        Math.min(
                          activeVariantIdx,
                          commonSettings.variants.length - 1
                        )
                      ].editions
                        .map((edition, eIdx) => ({ edition, eIdx }))
                        .filter(
                          ({ edition }) =>
                            edition.visible !== false &&
                            editionHasModel(edition)
                        )
                        .map(({ edition, eIdx }) => {
                          const safeActiveVariantIdx = Math.min(
                            activeVariantIdx,
                            commonSettings.variants.length - 1
                          );
                          const isModelActive =
                            activeModelId ===
                            `edition-${safeActiveVariantIdx}-${eIdx}`;

                          // If ANY edition in this variant has a model, we only show tick on the ACTIVE model
                          // Otherwise, we show tick on the selected index in the map
                          const variantHasAnyModels =
                            commonSettings.variants[
                              safeActiveVariantIdx
                            ]?.editions?.some((e) => editionHasModel(e)) ??
                            false;

                          const isEditingCurrentVariant =
                            commonSettings.editingEdition?.vIdx ===
                            safeActiveVariantIdx;
                          const isEditingCurrentEdition =
                            commonSettings.editingEdition?.eIdx === eIdx;
                          const editingEditionIdx =
                            commonSettings.editingEdition?.eIdx;
                          const activeEditingEdition = isEditingCurrentVariant
                            ? commonSettings.variants[safeActiveVariantIdx]
                                ?.editions[editingEditionIdx ?? -1]
                            : null;
                          const shouldUseEditingSelection =
                            !!activeEditingEdition &&
                            activeEditingEdition.visible !== false &&
                            editionHasModel(activeEditingEdition);
                          const selectedEditionIdxForActiveVariant =
                            selectedEditionMap[safeActiveVariantIdx];

                          const isSelected =
                            isEditingCurrentVariant && shouldUseEditingSelection
                              ? Boolean(isEditingCurrentEdition)
                              : selectedEditionIdxForActiveVariant !== undefined
                                ? selectedEditionIdxForActiveVariant === eIdx
                                : variantHasAnyModels
                                  ? isModelActive
                                  : (selectedEditionMap[safeActiveVariantIdx] ??
                                      0) === eIdx;

                          return (
                            <EditionOptionButton
                              key={eIdx}
                              edition={edition}
                              eIdx={eIdx}
                              variantIdx={safeActiveVariantIdx}
                              isSelected={isSelected}
                              textOnly={commonSettings.textOnly}
                              onSelect={handleEditionSelect}
                              variantType={
                                commonSettings.variants[safeActiveVariantIdx]
                                  .activeTabId
                              }
                            />
                          );
                        })}
                    </div>
                  )}

                  {/* Bottom Tab Navigation */}
                  <div
                    className={`pointer-events-auto flex ${
                      commonSettings.menuPlacement === 'floating'
                        ? 'border-neutral-gray-200 mx-auto mb-6 w-fit min-w-[320px] gap-2 rounded-[18px] border bg-white p-1.5 shadow-lg'
                        : 'w-full border-t border-white/20 bg-white'
                    }`}
                  >
                    {commonSettings.variants
                      .map((variant, originalIdx) => ({
                        ...variant,
                        originalIdx,
                      }))
                      .filter((variant) =>
                        variant.editions.some(
                          (e) => e.visible !== false && editionHasModel(e)
                        )
                      )
                      .map((variant, idx, filteredArr) => (
                        <button
                          key={variant.originalIdx}
                          onClick={() => {
                            const vIdx = variant.originalIdx;
                            // Early return if clicking on the already active variant
                            if (activeVariantIdx === vIdx) return;
                            setActiveVariantIdx(vIdx);

                            // Auto-select first edition with a model for this variant type
                            const firstEditionWithModelIdx =
                              variant.editions.findIndex(
                                (e) => e.visible !== false && editionHasModel(e)
                              );

                            if (firstEditionWithModelIdx !== -1) {
                              handleEditionSelect(
                                vIdx,
                                firstEditionWithModelIdx
                              );
                            }
                          }}
                          className={`flex-1 tracking-wide uppercase transition-all duration-300 ${
                            commonSettings.menuPlacement === 'floating'
                              ? `rounded-[12px] px-8 py-2.5 text-[13px] font-bold ${
                                  activeVariantIdx === variant.originalIdx
                                    ? 'bg-neutral-gray-900 text-white'
                                    : 'text-neutral-gray-900 hover:bg-neutral-gray-100'
                                }`
                              : `py-3.5 text-[14px] font-bold ${
                                  activeVariantIdx === variant.originalIdx
                                    ? 'bg-neutral-gray-900 text-white'
                                    : 'text-neutral-gray-900 hover:bg-white/40'
                                } ${idx === 0 ? 'rounded-bl-[32px]' : ''} ${
                                  idx === filteredArr.length - 1
                                    ? 'rounded-br-[32px]'
                                    : ''
                                }`
                          }`}
                        >
                          {variant.customType ||
                            getVariantTypeLabel(variant.selectedType)}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-auto flex w-full justify-center pt-2">
          <span className="text-neutral-gray-600 text-[12px]">
            Embed and share interactive 3D viewers for web and PDPs
          </span>
        </div>
      </div>

      <Select3DModelFromLibrary
        open={isSelectLibraryOpen}
        selectedModelId={selectedLibraryModelId}
        onSelectModel={setSelectedLibraryModelId}
        onClose={handleCloseSelectFromLibrary}
        onConfirm={handleConfirmLibraryModel}
      />
      {isUploadModalOpen && (
        <Upload3DAssetForm
          open={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadedAssetSuccess}
        />
      )}
    </>
  );
};

export default RightContainer;
