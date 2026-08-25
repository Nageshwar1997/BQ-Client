import { useEffect, useState } from 'react';
import { defaultSettings } from '../../../constants';
import Canvas3D from '../../../3d/Components/Canvas3D';

export const VersaAiModelViewer = ({
  url,
  versions,
  selectedIdx,
  onOptionClick,
  onModelLoaded,
}: {
  url?: string;
  versions?: string[];
  selectedIdx?: number;
  onOptionClick?: (idx: number) => void;
  onModelLoaded?: () => void;
}) => {
  const [internalSelectedIdx, setInternalSelectedIdx] = useState(0);
  const resolvedSelectedIdx =
    typeof selectedIdx === 'number' ? selectedIdx : internalSelectedIdx;
  const fallbackVersionThumbnail = '/assets/images/thumbnail.webp';

  useEffect(() => {
    if (typeof selectedIdx === 'number') {
      setInternalSelectedIdx(selectedIdx);
    }
  }, [selectedIdx]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      {url && (
        <Canvas3D
          settings={defaultSettings}
          modelUrl={url}
          viewer={true}
          onModelLoaded={onModelLoaded}
        />
      )}
      {versions && (
        <div className="bg-neutral-gray-100 border-neutral-gray-300 absolute bottom-3 left-3 flex-col rounded-xl border p-3">
          <div className="flex flex-col gap-2">
            <p className="text-neutral-gray-600 font-metropolis text-[10px]/[13px] font-semibold">
              Versions
            </p>
            <div className="flex items-center gap-2">
              {versions.map((version, idx) => (
                <div
                  className={`size-11 shrink-0 cursor-pointer rounded-lg border p-2 ${resolvedSelectedIdx === idx ? 'border-neutral-gray-500!' : 'border-neutral-gray-300'}`}
                  key={`${version}-${idx}`}
                  onClick={() => {
                    onOptionClick?.(idx);
                    setInternalSelectedIdx(idx);
                  }}
                >
                  <img
                    src={version || fallbackVersionThumbnail}
                    alt={`version-${idx}`}
                    className="size-full object-cover"
                    onError={(event) => {
                      const target = event.currentTarget;
                      if (target.src.includes(fallbackVersionThumbnail)) return;
                      target.src = fallbackVersionThumbnail;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
