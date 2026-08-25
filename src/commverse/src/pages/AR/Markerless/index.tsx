import { useEffect, useState } from 'react';
import MarkerlessOptions from './components/MarkerlessOptions';
import type { VisualizerProps } from '../../../types';
import { defaultSettings } from '../../../constants';
import RightContainer from './components/RightContainer';
import ProductHeader from '../../../components/ProductHeader';
import SaveWarnModal from '../../../components/Overlay/SaveWarnModal';
import { useModelStore } from '../../../lib/store';
import ToastCard from '../../../components/AlertCards/ToastCard';

const MarkerlessAR = () => {
  const [showSaveWarn, setShowSaveWarn] = useState(false);
  const { status, validationError, reset } = useModelStore();

  const [settings, setSettings] = useState<VisualizerProps>(
    () => defaultSettings
  );

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <div className="flex h-screen w-full">
      <div>
        <MarkerlessOptions settings={settings} onSettingChange={setSettings} />
      </div>
      <div className="flex w-full flex-col">
        <ProductHeader module="ar_experience" settings={settings} />
        <RightContainer settings={settings} onSettingChange={setSettings} />
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

export default MarkerlessAR;
