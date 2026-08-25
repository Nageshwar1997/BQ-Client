import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
  type SetStateAction,
} from 'react';
import { useParams } from 'react-router';
import MarkerlessOptions from './components/MarkerlessOptions';
import type { VisualizerProps } from '../../../types';
import { defaultSettings } from '../../../constants';
import ThreeDCanvas from './components/ThreeDCanvas';
import ProductHeader from '../../../components/ProductHeader';
import SaveWarnModal from '../../../components/Overlay/SaveWarnModal';
import { useModelStore } from '../../../lib/store';
import ToastCard from '../../../components/AlertCards/ToastCard';
import {
  useGetExperienceById,
  useUpdateExperience,
} from '../../../services/experience-services';
import { DynamicInput } from '../../../components/DynamicInput';

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

const ARMarkerlessAssetVisualizer = () => {
  const params = useParams<{ id?: string; experienceId?: string }>();
  const experienceId = params.experienceId ?? params.id;
  const getExperienceByIdQuery = useGetExperienceById(experienceId || '');
  const details = getExperienceByIdQuery?.data?.data;
  const draftDataValue = details?.draftData ?? null;

  const draftData = useMemo(() => {
    if (!draftDataValue) return null;
    try {
      return JSON.parse(draftDataValue);
    } catch {
      return null;
    }
  }, [draftDataValue]);

  const modelUrl =
    (details?.assets?.[0] as { modelUrl?: string } | undefined)?.modelUrl ??
    draftData?.modelUrl ??
    null;

  const [showSaveWarn, setShowSaveWarn] = useState(false);
  const { status, validationError, reset } = useModelStore();
  const scopedExperienceId = experienceId ?? '';
  const [settingsOverride, setSettingsOverride] = useState<{
    experienceId: string;
    value: VisualizerProps;
  } | null>(null);

  const settings =
    settingsOverride?.experienceId === scopedExperienceId
      ? settingsOverride.value
      : ((draftData as VisualizerProps | null) ?? defaultSettings);
  const handleSettingsChange = useCallback(
    (nextSettings: SetStateAction<VisualizerProps>) => {
      const resolvedSettings =
        typeof nextSettings === 'function'
          ? nextSettings(settings)
          : nextSettings;

      setSettingsOverride({
        experienceId: scopedExperienceId,
        value: resolvedSettings,
      });
    },
    [scopedExperienceId, settings]
  );

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <div className="flex h-screen w-full">
      <div>
        <MarkerlessOptions
          settings={settings}
          onSettingChange={handleSettingsChange}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ProductHeader module="ar_experience" settings={settings} />
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

          <div className="relative flex grow items-center justify-center overflow-hidden">
            {modelUrl && status !== 'invalid' && (
              <ThreeDCanvas settings={settings} modelUrl={modelUrl} />
            )}
          </div>
          <div className="text-neutral-gray-600 w-full pb-2 text-center text-[14px]">
            Embed and share interactive 3D viewers on your website and product
            pages
          </div>
        </div>
      </div>
      {showSaveWarn && <SaveWarnModal onClose={() => setShowSaveWarn(false)} />}
      {status === 'invalid' && (
        <ToastCard
          type="error"
          title={validationError?.title || 'Model Validation Failed'}
          description={validationError?.description || ''}
        />
      )}
    </div>
  );
};

export default ARMarkerlessAssetVisualizer;
