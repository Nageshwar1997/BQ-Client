import type { VisualizerProps } from '../../../../../types';
import { memo } from 'react';
import GModelViewer from '../../../../../3d/Components/GModelViewer';
import PillLoader from '../../../../../components/PillLoader';
import { useModelStore } from '../../../../../lib/store';

interface ThreeDCanvasProps {
  settings: VisualizerProps;
  modelUrl: string;
}

// -------------------- ThreeDCanvas Component --------------------
const ThreeDCanvas = memo(function ThreeDCanvas({
  settings,
  modelUrl,
}: ThreeDCanvasProps) {
  const { status } = useModelStore();

  return (
    <div className="border-neutral-gray-500 relative h-full w-full flex-1 overflow-hidden rounded-xl border-2 border-dashed">
      {(status === 'validating' || status === 'loading') && (
        <div className="bg-neutral-gray-200/70 absolute inset-0 z-10 flex items-center justify-center">
          <PillLoader description="Loading model, please wait..." />
        </div>
      )}
      <GModelViewer
        modelUrl={modelUrl}
        settings={settings}
        className="h-full w-full"
      />
    </div>
  );
});

export default ThreeDCanvas;
