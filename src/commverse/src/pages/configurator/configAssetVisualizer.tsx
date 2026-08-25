import ProductHeader from '../../components/ProductHeader';
import { defaultSettings } from '../../constants';
import ConfiguratorOptions from './components/configuratorOptions';
import ToastCard from '../../components/AlertCards/ToastCard';
import RightContainer from './components/rightContainer';
import type {
  IConfigModel,
  TModelTransform,
  VisualizerProps,
} from '../../types';
import { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { useVisualizerStore } from '../../lib/store/visualizerStore';
import { useModelStore } from '../../lib/store';
import {
  useGetExperienceById,
  useUpdateExperience,
} from '../../services/experience-services';
import { useNavigate, useParams } from 'react-router';

// Shape of persisted configurator data
interface ConfiguratorDraftData extends VisualizerProps {
  models?: Array<{
    id: string;
    url: string;
    name: string;
    modelTransform?: {
      scale: number;
      rotation: { x: number; y: number; z: number };
    };
  }>;
  activeModelId?: string | null;
}

const ConfiguratorAssetVisualizer = () => {
  const params = useParams<{ id?: string; experienceId?: string }>();
  const experienceId = params.experienceId ?? params.id;
  const getExperienceByIdQuery = useGetExperienceById(experienceId || '');
  const details = getExperienceByIdQuery?.data?.data;
  const updateExperienceMutation = useUpdateExperience();

  const draftData = useMemo((): ConfiguratorDraftData | null => {
    if (!details?.draftData) return null;
    try {
      return JSON.parse(details.draftData) as ConfiguratorDraftData;
    } catch {
      return null;
    }
  }, [details?.draftData]);

  const hasHydratedRef = useRef(false);
  const [models, setModels] = useState<IConfigModel[]>([]);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [settings, setSettings] = useState<VisualizerProps>(
    () => defaultSettings
  );
  const navigate = useNavigate();

  // Get store functions early to use in effects
  const { reset, setStatus, status, validationError } = useModelStore();

  // Reset hydration flag when experience changes
  useEffect(() => {
    hasHydratedRef.current = false;
  }, [experienceId]);

  // Hydrate all state from draftData when loaded
  useEffect(() => {
    if (!draftData || hasHydratedRef.current) return;

    // Hydrate settings (strip out models/activeModelId which are handled separately)
    const {
      models: savedModels,
      activeModelId: savedActiveId,
      ...settingsData
    } = draftData;
    setSettings({ ...defaultSettings, ...settingsData });

    // Hydrate models if present
    if (Array.isArray(savedModels) && savedModels.length > 0) {
      setStatus('loading'); // Set loading state before hydrating models
      const hydratedModels: IConfigModel[] = savedModels.map((m) => ({
        id: m.id,
        url: m.url,
        name: m.name,
        modelTransform: m.modelTransform ?? {
          scale: 1,
          rotation: { x: 0, y: 0, z: 0 },
        },
      }));
      setModels(hydratedModels);
      setActiveModelId(savedActiveId ?? hydratedModels[0]?.id ?? null);
    }

    hasHydratedRef.current = true;
  }, [draftData, setStatus]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleModelTransformChange = useCallback(
    (updatedTransform: TModelTransform) => {
      // Update the active model's transform
      setModels((prevModels) =>
        prevModels.map((model) =>
          model.id === activeModelId
            ? { ...model, modelTransform: updatedTransform }
            : model
        )
      );

      // Also sync transform to the current editing edition
      setSettings((prev) => {
        if (!prev.editingEdition) return prev;
        const { vIdx, eIdx } = prev.editingEdition;
        const variants = [...prev.variants];
        if (variants[vIdx]?.editions[eIdx]) {
          variants[vIdx] = {
            ...variants[vIdx],
            editions: variants[vIdx].editions.map((ed, idx) =>
              idx === eIdx ? { ...ed, modelTransform: updatedTransform } : ed
            ),
          };
        }
        return { ...prev, variants };
      });
    },
    [activeModelId]
  );

  const activeModel = models.find((m) => m.id === activeModelId) ?? null;

  const cameraControlFromStore = useVisualizerStore(
    (state) => state.cameraControl
  );

  const cameraControl = useMemo(() => {
    if (!cameraControlFromStore) return null;
    return {
      setCameraPosition: () => {
        cameraControlFromStore.set();
        const pos = cameraControlFromStore.getCameraPosition();

        const roundedPos = {
          x: Number(pos.x.toFixed(2)),
          y: Number(pos.y.toFixed(2)),
          z: Number(pos.z.toFixed(2)),
        };

        setSettings((prev) => ({
          ...prev,
          camera: {
            ...prev.camera,
            position: roundedPos,
          },
        }));
      },
      preview: cameraControlFromStore.preview,
    };
  }, [cameraControlFromStore]);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="shrink-0">
        <ConfiguratorOptions
          commonSettings={settings}
          onCommonSettingsChange={setSettings}
          modelTransform={activeModel?.modelTransform ?? null}
          onModelTransformChange={handleModelTransformChange}
          cameraControl={cameraControl}
          onLogoClick={() => {
            navigate('/');
          }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ProductHeader
          module="3d_configurator"
          settings={
            {
              ...settings,
              // Include models and activeModelId for save/publish
              models: models.map((m) => ({
                id: m.id,
                url: m.url,
                name: m.name,
                modelTransform: m.modelTransform,
              })),
              activeModelId,
            } as VisualizerProps
          }
        />
        <RightContainer
          models={models}
          setModels={setModels}
          activeModelId={activeModelId}
          setActiveModelId={setActiveModelId}
          commonSettings={settings}
          onCommonSettingsChange={setSettings}
          experienceTitle={details?.title}
          onTitleSubmit={(title) => {
            const id = experienceId || details?._id || details?.id;
            if (!id) return;

            if ((details?.title || '').trim() === title.trim()) {
              return;
            }

            updateExperienceMutation.mutate(
              {
                id,
                data: { title },
              },
              {
                onSuccess: () => {
                  getExperienceByIdQuery.refetch();
                },
              }
            );
          }}
        />
      </div>
      {status === 'invalid' && validationError && (
        <ToastCard
          type="error"
          title={validationError.title}
          description={validationError.description}
          buttonProps={{
            content: 'Dismiss',
          }}
        />
      )}
    </div>
  );
};

export default ConfiguratorAssetVisualizer;
