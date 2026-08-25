import { memo, useState, useMemo } from 'react';
import { useParams } from 'react-router';

import VisualizerOptions from './components/VisualizerOptions';
import ProductHeader from '../../components/ProductHeader';
import ThreeDCanvas from './components/ThreeDCanvas';
// import SaveWarnModal from '../../components/Overlay/SaveWarnModal';
import ToastCard from '../../components/AlertCards/ToastCard';

import { useVisualizerStore } from '../../lib/store/visualizerStore';
import { useModelStore } from '../../lib/store';
import {
  useGetExperienceById,
  useUpdateExperience,
} from '../../services/experience-services';
import { defaultSettings } from '../../constants';

import type { VisualizerProps } from '../../types';
import { DynamicInput } from '../../components/DynamicInput';

interface ExperienceTitleInputProps {
  title?: string;
  experienceId?: string;
  detailId?: string;
}

const ExperienceTitleInput = memo(function ExperienceTitleInput({
  title,
  experienceId,
  detailId,
}: ExperienceTitleInputProps) {
  const updateExperienceMutation = useUpdateExperience();

  return (
    <DynamicInput
      value={title ?? ''}
      defaultText="New 3D Viualizer experience"
      onSubmit={(nextTitle) => {
        const id = detailId || experienceId;
        if (!id) return;

        if ((title || '').trim() === nextTitle.trim()) {
          return;
        }

        updateExperienceMutation.mutate({
          id,
          data: { title: nextTitle },
        });
      }}
    />
  );
});

const ThreeDAssetVisualizer = () => {
  const params = useParams<{ id?: string; experienceId?: string }>();
  const experienceId = params.experienceId ?? params.id;
  const getExperienceByIdQuery = useGetExperienceById(experienceId || '');
  const details = getExperienceByIdQuery?.data?.data;

  const draftData = useMemo(() => {
    if (!details) return null;
    if (!details.draftData) return null;
    try {
      return JSON.parse(details.draftData);
    } catch {
      return null;
    }
  }, [details]);

  // const [showSaveWarn, setShowSaveWarn] = useState(false);
  const { status, validationError } = useModelStore();
  const [localSettingsState, setLocalSettingsState] = useState<{
    experienceId: string | null;
    settings: VisualizerProps | null;
  }>({
    experienceId: null,
    settings: null,
  });

  const baseSettings = useMemo(
    () => (draftData as VisualizerProps | null) ?? defaultSettings,
    [draftData]
  );

  const cameraControlFromStore = useVisualizerStore(
    (state) => state.cameraControl
  );

  const localSettings =
    localSettingsState.experienceId === experienceId
      ? localSettingsState.settings
      : null;

  const cameraControl = useMemo(() => {
    if (!cameraControlFromStore) return null;
    return {
      preview: cameraControlFromStore.preview,
      setCameraPosition: () => {
        const pos = cameraControlFromStore.getCameraPosition();
        setLocalSettingsState((prevState) => {
          const currentSettings =
            prevState.experienceId === experienceId
              ? (prevState.settings ?? baseSettings)
              : baseSettings;
          return {
            experienceId: experienceId ?? null,
            settings: {
              ...currentSettings,
              camera: {
                ...currentSettings.camera,
                position: {
                  x: Number(pos.x.toFixed(2)),
                  y: Number(pos.y.toFixed(2)),
                  z: Number(pos.z.toFixed(2)),
                },
              },
            },
          };
        });
      },
    };
  }, [baseSettings, cameraControlFromStore, experienceId]);

  const assetModelUrl =
    (details?.assets?.[0] as { modelUrl?: string } | undefined)?.modelUrl ??
    draftData?.modelUrl ??
    null;

  const settings = useMemo(() => {
    const resolvedSettings = localSettings ?? baseSettings;
    if (!assetModelUrl || !resolvedSettings.modelFile) return resolvedSettings;
    return { ...resolvedSettings, modelFile: null };
  }, [assetModelUrl, baseSettings, localSettings]);

  const modelUrl = settings.modelFile
    ? URL.createObjectURL(settings.modelFile)
    : assetModelUrl;

  const setSettings = (
    next: VisualizerProps | ((prev: VisualizerProps) => VisualizerProps)
  ) => {
    setLocalSettingsState((prevState) => {
      const currentSettings =
        prevState.experienceId === experienceId
          ? (prevState.settings ?? baseSettings)
          : baseSettings;
      const resolvedNext =
        typeof next === 'function' ? next(currentSettings) : next;
      return {
        experienceId: experienceId ?? null,
        settings: resolvedNext,
      };
    });
  };

  const handleLogoClick = () => {
    // if (hasSettingsChanges) navigate('/home');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left panel */}
      <div className="shrink-0">
        <VisualizerOptions
          settings={settings}
          onSettingChange={setSettings}
          cameraControl={cameraControl}
          onLogoClick={handleLogoClick}
        />
      </div>
      {/* Right panel */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ProductHeader module="3d_visualizer" settings={settings} />
        <div className="flex grow flex-col gap-4 pr-10 pl-10">
          <div className="flex w-full justify-between">
            <span className="font-metropolis text-[20px] font-normal">
              <ExperienceTitleInput
                title={details?.title}
                experienceId={experienceId}
                detailId={details?._id || details?.id}
              />
            </span>
          </div>

          <div className="relative flex grow items-center overflow-hidden">
            {modelUrl && status !== 'invalid' && (
              <ThreeDCanvas
                assetId={details?.assetIds?.[0] || ''}
                experienceId={details?._id || details?.id || experienceId}
                key={modelUrl}
                settings={settings}
                modelUrl={modelUrl}
              />
            )}
          </div>
          <div className="text-neutral-gray-600 w-full pb-2 text-center text-[14px]">
            Embed and share interactive 3D viewers on your website and product
            pages
          </div>
        </div>
      </div>
      {/* {showSaveWarn && <SaveWarnModal onClose={() => setShowSaveWarn(false)} />} */}
      {status === 'invalid' && (
        <ToastCard
          type="error"
          title={validationError?.title || 'Failed to Load Model'}
          description={validationError?.description || ''}
          buttonProps={{ content: 'Try Again', onClick: () => {} }}
        />
      )}
    </div>
  );
};

export default ThreeDAssetVisualizer;
