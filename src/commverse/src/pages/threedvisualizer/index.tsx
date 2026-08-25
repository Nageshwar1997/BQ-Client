import { useState, useMemo, useEffect } from 'react';
import VisualizerOptions from './components/VisualizerOptions';
import type { VisualizerProps } from '../../types';
import { defaultSettings } from '../../constants';
import RightContainer from './components/RightContainer';
import ProductHeader from '../../components/ProductHeader';
// import { Rotate3DIcon } from '../../icons';
import SaveWarnModal from '../../components/Overlay/SaveWarnModal';
import { useVisualizerStore } from '../../lib/store/visualizerStore';
import { useModelStore } from '../../lib/store';
import ToastCard from '../../components/AlertCards/ToastCard';
import { getSettingChanges } from '../../lib/utils';
// import Header from '../../components/Header';
// import Upload3DAssetForm from '../3d-asset-library/components/Upload3DAssetForm';

const ThreeDVisualizer = () => {
  const [showSaveWarn, setShowSaveWarn] = useState(false);
  const { status, validationError, reset } = useModelStore();

  const [settings, setSettings] = useState<VisualizerProps>(
    () => defaultSettings
  );

  const cameraControlFromStore = useVisualizerStore(
    (state) => state.cameraControl
  );

  const cameraControl = useMemo(() => {
    if (!cameraControlFromStore) return null;
    return {
      preview: cameraControlFromStore.preview,
      setCameraPosition: () => {
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
    };
  }, [cameraControlFromStore]);

  const hasSettingsChanges = useMemo(
    () => getSettingChanges(settings) > 0,
    [settings]
  );

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const handleLogoClick = () => {
    if (hasSettingsChanges) {
      setShowSaveWarn(true);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left content */}
      <div className="shrink-0">
        <VisualizerOptions
          settings={settings}
          onSettingChange={setSettings}
          cameraControl={cameraControl}
          onLogoClick={handleLogoClick}
        />
      </div>
      {/* Right Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ProductHeader module="3d_visualizer" settings={settings} />

        <RightContainer settings={settings} onSettingChange={setSettings} />
      </div>
      {showSaveWarn && <SaveWarnModal onClose={() => setShowSaveWarn(false)} />}
      {status === 'invalid' && (
        <ToastCard
          type="error"
          title={validationError?.title || 'Failed to Load Model'}
          description={validationError?.description || ''}
          buttonProps={{
            content: 'Try Again',
            onClick: () => {},
          }}
        />
      )}
    </div>
  );
};

export default ThreeDVisualizer;
