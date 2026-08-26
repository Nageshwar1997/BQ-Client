import { Icon } from '@iconify/react';
import { type PointerEvent, useRef, useState } from 'react';

interface ITryOnCompareSliderProps {
  // Fires with a 0-1 fraction as the handle is dragged - the caller forwards this straight to
  // the stage ref's `setComparePosition` (see TryOnModal, which also centers it at 0.5 the
  // moment compare mode turns on). The engine already does the actual split-screen render (see
  // TryOnEngineBase.renderFrame) - this is just the draggable handle driving it.
  onDrag: (position: number) => void;
  className?: string;
}

const TryOnCompareSlider = ({ onDrag, className = '' }: ITryOnCompareSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0.5);

  const updatePosition = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const fraction = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, fraction));
    setPosition(clamped);
    onDrag(clamped);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePosition(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    // Pointer capture (set on down) keeps this firing even once the pointer leaves the
    // container's bounds mid-drag - no need for window-level listeners.
    if (event.currentTarget.hasPointerCapture(event.pointerId)) updatePosition(event.clientX);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-4 touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* Fixed corner labels - not tied to the drag position, just marking which side is which. */}
      <div className="pointer-events-none absolute inset-x-3 top-3 flex justify-between text-[10px] font-semibold text-white">
        <span className="bg-primary-invert/60 rounded-sm px-1.5 py-0.5 backdrop-blur-xs">
          Before
        </span>
        <span className="bg-sky-blue-burst rounded-sm px-1.5 py-0.5">After</span>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white/80"
        style={{ left: `${String(position * 100)}%` }}
      />
      <div
        className="border-primary/10 bg-primary-invert/80 text-primary pointer-events-none absolute top-1/2 flex size-9 items-center justify-center rounded-full border shadow-md backdrop-blur-xs"
        style={{ left: `${String(position * 100)}%`, transform: 'translate(-50%, -50%)' }}
      >
        <Icon icon="solar:arrow-left-linear" className="size-3" />
        <Icon icon="solar:arrow-right-linear" className="-ml-0.5 size-3" />
      </div>
    </div>
  );
};

export default TryOnCompareSlider;
