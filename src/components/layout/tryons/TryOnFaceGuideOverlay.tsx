import { Icon } from '@iconify/react';

interface ITryOnFaceGuideOverlayProps {
  icon: string;
  title: string;
  description: string;
}

// One L-shaped bracket, positioned per corner by the `position` classes passed in - four of
// these (see below) read as a single scanner/viewfinder frame without needing an SVG sized to
// this component's own (variable, depends on the canvas panel) box.
const FrameCorner = ({ position, border }: { position: string; border: string }) => (
  <div className={`absolute size-8 sm:size-10 ${position} ${border}`} />
);

// Shown over the canvas whenever the current frame's `faceDetection` status isn't 'detected' -
// distinct from TryOnStatusOverlay (a one-time "still setting up" gate for camera permission/
// photo processing): this reacts continuously frame-to-frame as the user moves in and out of
// frame or too close/far. The corner-bracket frame doubles as the instruction itself (this is
// the area your face should be in) - content (icon/title/description) sits centered inside it,
// on a dimmed scrim so the frame and text stay readable over any live video/photo underneath,
// regardless of that content's own brightness or the app's own light/dark theme.
const TryOnFaceGuideOverlay = ({ icon, title, description }: ITryOnFaceGuideOverlayProps) => (
  <div className="absolute inset-0 z-2 flex items-center justify-center bg-black/45 p-6">
    <div className="relative aspect-3/4 w-full max-w-60">
      <FrameCorner
        position="top-0 left-0 rounded-tl-2xl"
        border="border-t-3 border-l-3 border-white/85"
      />
      <FrameCorner
        position="top-0 right-0 rounded-tr-2xl"
        border="border-t-3 border-r-3 border-white/85"
      />
      <FrameCorner
        position="bottom-0 left-0 rounded-bl-2xl"
        border="border-b-3 border-l-3 border-white/85"
      />
      <FrameCorner
        position="bottom-0 right-0 rounded-br-2xl"
        border="border-b-3 border-r-3 border-white/85"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 p-2 md:size-10">
          <Icon icon={icon} className="size-full text-white" />
        </div>
        <p className="text-sm font-semibold text-white sm:text-base">{title}</p>
        <p className="text-xs leading-6 text-white/70 sm:text-sm">{description}</p>
      </div>
    </div>
  </div>
);

export default TryOnFaceGuideOverlay;
