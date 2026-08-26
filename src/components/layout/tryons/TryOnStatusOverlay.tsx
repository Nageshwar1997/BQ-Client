import ApiStatus from '../ApiStatus';

interface ITryOnStatusOverlayProps {
  // The stage-specific "not ready yet" message (e.g. "Waiting for camera permission...",
  // "Processing photo...").
  loadingText: string;
  // Shown as the error card's title once `error` is set - stays specific to what was loading
  // (e.g. "Camera unavailable" vs "Couldn't process photo").
  errorTitle: string;
  error?: string;
}

// One overlay, reused across every Try-On stage/category - live camera permission, upload
// processing, and any future category's own async wait. Callers own the readiness check (each
// stage knows its own signal - `cameraReady`, `imageReady`, etc.) and render this only while not
// ready, passing just that moment's copy via props.
const TryOnStatusOverlay = ({ loadingText, errorTitle, error }: ITryOnStatusOverlayProps) => (
  <div className="absolute inset-0 z-2">
    <ApiStatus
      className="scale-75"
      status={error ? 'error' : 'loading'}
      text={loadingText}
      title={errorTitle}
      description={error}
    />
  </div>
);

export default TryOnStatusOverlay;
