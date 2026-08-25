// eslint-disable-next-line simple-import-sort/imports
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState } from 'react';

import type { ILipTryOnState } from '@/classes/tryon/categories/lip';
import { ModalWrapper } from '@/components/layout/modals/ModalWrapper';
import useTryOnUpload from '@/hooks/useTryOnUpload';
import type { IShade, ITryOnStageRef } from '@/types/tryon-engine.type';
import type { TTryOnSelection } from '@/types/tryon.type';

import LipTryOnStage, { LipTryOnStatusOverlay } from './LipTryOnStage';
import TryOnShadeSwatches from './TryOnShadeSwatches';
import TryOnSidebar from './TryOnSidebar';

interface ITryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  // The category/subCategory the user is trying on - comes straight from the product API
  // (`product.tryOn`), never picked in this modal.
  tryOn?: TTryOnSelection;
  // The product's real shade/color variants (`product.variants`, `type === 'Color'`) - never
  // invented in the UI via a color picker.
  shades: IShade[];
}

interface ITryOnFlowState {
  mode: 'live' | 'upload';
  uploadedImageUrl: string | null;
  engineState: ILipTryOnState | null;
}

const INITIAL_FLOW_STATE: ITryOnFlowState = {
  mode: 'live',
  uploadedImageUrl: null,
  engineState: null,
};

const TryOnModal = ({ isOpen, onClose, tryOn, shades }: ITryOnModalProps) => {
  const [flow, setFlow] = useState<ITryOnFlowState>(INITIAL_FLOW_STATE);

  const stageRef = useRef<ITryOnStageRef<ILipTryOnState>>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  const { previewUrl, error: uploadError, setFile, reset: resetUpload } = useTryOnUpload();

  useEffect(() => {
    if (isOpen) return;

    /**
     * `TryOnModal` itself never unmounts (it's always rendered by the parent page), so the
     * flow has to be reset explicitly on close - otherwise the next open would resume
     * mid-flow.
     */
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlow(INITIAL_FLOW_STATE);
    resetUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!previewUrl) return;

    // `uploadedImageUrl` is derived from `useTryOnUpload`'s blob preview URL, an external-system
    // side effect unsafe to run during render - same reasoning as AvatarUpload.tsx's identical
    // pattern.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFlow((prev) => ({ ...prev, uploadedImageUrl: previewUrl }));
  }, [previewUrl]);

  // Feeds the live camera's stream into the sidebar's small blurred preview - a second
  // <video> element showing the same MediaStream as the main stage (browsers support one
  // stream driving multiple <video> elements at once).
  useEffect(() => {
    if (flow.mode !== 'live' || !flow.engineState?.cameraReady) return;

    const stream = stageRef.current?.getStream();
    if (stream && cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = stream;
    }
  }, [flow.mode, flow.engineState?.cameraReady]);

  const handleModeChange = (mode: 'live' | 'upload') => {
    setFlow((prev) => ({ ...prev, mode }));
  };

  const handleModelSelect = (url: string) => {
    resetUpload();
    setFlow((prev) => ({ ...prev, mode: 'upload', uploadedImageUrl: url }));
  };

  const handleShadeSelect = (hexColor: string) => {
    stageRef.current?.setMakeupState({ color: hexColor });
  };

  const handleDownload = () => {
    const dataUrl = stageRef.current?.takeSnapshot();
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'try-on.png';
    link.click();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      header={{ title: 'Try-On', showCloseIcon: true }}
      className="h-full max-w-full min-w-[80dvw]!"
    >
      {/* Only LIP has a rendering engine built so far - see docs/tryons/README.md. */}
      {tryOn?.category !== 'LIP' ? (
        <div className="flex flex-col items-center gap-2 p-6 text-center">
          <Icon icon="solar:hourglass-linear" className="text-primary/40 size-8" />
          <p className="text-tertiary text-sm">
            {tryOn
              ? `Try-on for ${tryOn.category} is coming soon.`
              : 'This product has no try-on configured yet.'}
          </p>
        </div>
      ) : (
        // `ModalWrapper`'s scrollable content wrapper sizes itself with `w-fit` (shrink-to-fit) -
        // fine for its usual centered-dialog content, but a `flex-1` canvas panel has no
        // intrinsic width of its own to shrink-fit around (its children are all
        // absolutely-positioned), so the row would collapse to just the sidebar's width without
        // an explicit size here. `w-[min(90vw,800px)]` sidesteps that: it's a real length, not a
        // percentage of an ambiguously-sized ancestor.
        <div className="flex h-full w-full gap-3">
          <div className="border-primary/10 relative flex-1 overflow-hidden rounded-2xl border">
            <LipTryOnStage
              ref={stageRef}
              mode={flow.mode}
              uploadedImageUrl={flow.uploadedImageUrl}
              initialState={{ type: tryOn.subCategory, color: flow.engineState?.color ?? null }}
              onStateChange={(engineState) => {
                setFlow((prev) => ({ ...prev, engineState }));
              }}
            />

            <LipTryOnStatusOverlay
              mode={flow.mode}
              uploadedImageUrl={flow.uploadedImageUrl}
              state={flow.engineState}
            />

            <button
              type="button"
              aria-label="Download snapshot"
              onClick={handleDownload}
              disabled={!flow.engineState?.color}
              className="bg-primary-invert/70 text-primary border-primary/10 absolute top-3 right-3 z-3 flex size-9 cursor-pointer items-center justify-center rounded-full border backdrop-blur-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon icon="solar:download-linear" className="size-4" />
            </button>

            <TryOnShadeSwatches
              className="absolute inset-x-0 bottom-0 z-3"
              shades={shades}
              appliedColor={flow.engineState?.color ?? null}
              onSelect={handleShadeSelect}
            />
          </div>

          <div className="flex flex-col gap-2">
            <TryOnSidebar
              mode={flow.mode}
              onModeChange={handleModeChange}
              cameraVideoRef={cameraVideoRef}
              cameraReady={!!flow.engineState?.cameraReady}
              previewImageUrl={flow.uploadedImageUrl}
              onFileSelected={setFile}
              onModelSelect={handleModelSelect}
            />
            {uploadError && (
              <p className="text-primary-red text-center text-[10px]">{uploadError}</p>
            )}
          </div>
        </div>
      )}
    </ModalWrapper>
  );
};

export default TryOnModal;
