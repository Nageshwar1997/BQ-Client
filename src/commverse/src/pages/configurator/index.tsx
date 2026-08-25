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
import { useCallback, useState, useMemo } from 'react';
import { useVisualizerStore } from '../../lib/store/visualizerStore';
import { useModelStore } from '../../lib/store';
import { useNavigate } from 'react-router';

const Configurator = () => {
  const [models, setModels] = useState<IConfigModel[]>([]);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [settings, setSettings] = useState<VisualizerProps>(
    () => defaultSettings
  );

  const navigate = useNavigate();

  const { status, validationError } = useModelStore();

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
        <ProductHeader module="3d_configurator" settings={settings} />
        <RightContainer
          models={models}
          setModels={setModels}
          activeModelId={activeModelId}
          setActiveModelId={setActiveModelId}
          commonSettings={settings}
          onCommonSettingsChange={setSettings}
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

export default Configurator;
