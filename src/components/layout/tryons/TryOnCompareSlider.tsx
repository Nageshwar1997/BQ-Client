import { Icon } from '@iconify/react';
import { type PointerEvent, useEffect, useRef, useState } from 'react';

import type { IObjectFitContentRect } from '@/types/tryon-types';
import { getObjectFitContentRect } from '@/utils/tryon-utils';

interface ITryOnCompareSliderProps {
  // Fires with a 0-1 fraction as the handle is dragged, throttled to at most once per animation
  // frame (see `scheduleOnDrag` below) - the caller forwards this straight to the stage ref's
  // `setComparePosition` (see TryOnModal, which also centers it at 0.5 the moment compare mode
  // turns on). For Upload mode that call triggers a full canvas redraw (`renderFrame`), so
  // firing it once per raw pointermove instead - some devices report those far faster than
  // 60/s - would mean redrawing far more often than the screen can even show.
  onDrag: (position: number) => void;
  // The canvas actually being drawn to (`stageRef.current?.getCanvas()`). Its CSS box - this
  // component's own `inset-0` container - doesn't necessarily match where the image is really
  // rendered: Upload mode uses `object-contain` (see TryOnUploadStage.tsx), which can letterbox
  // it smaller than the box; Live mode uses `object-cover`, which can crop it larger. Either way
  // `renderFrame`'s own split line is drawn in the canvas *bitmap's* coordinate space, so without
  // correcting for this, the drag handle and the line it's supposed to control visibly disagree.
  // `null` while not yet available - falls back to treating the box as the content itself.
  canvas: HTMLCanvasElement | null;
  className?: string;
}

const FULL_CONTENT_RECT: IObjectFitContentRect = { leftPercent: 0, widthPercent: 100 };

const TryOnCompareSlider = ({ canvas, onDrag, className = '' }: ITryOnCompareSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0.5);
  const [contentRect, setContentRect] = useState<IObjectFitContentRect>(FULL_CONTENT_RECT);

  // Where the canvas's rendered image actually sits within this component's own box (as a
  // horizontal offset/width, both in percent of that box) - recalculated on container resize.
  // `object-fit` is read fresh each time rather than cached: resizes are infrequent (unlike
  // pointermove, this isn't a hot path), so there's no real cost to also staying correct if a
  // future canvas ever changed it dynamically instead of via a fixed class.
  useEffect(() => {
    const container = containerRef.current;
    if (!canvas || !container) {
      setContentRect(FULL_CONTENT_RECT);
      return;
    }

    const recompute = () => {
      const box = container.getBoundingClientRect();
      setContentRect(
        getObjectFitContentRect(
          box.width,
          box.height,
          canvas.width,
          canvas.height,
          getComputedStyle(canvas).objectFit,
        ),
      );
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [canvas]);

  // Coalesces every `onDrag` call within a single animation frame down to one, keeping only the
  // latest position - the visual divider (`position` state) still updates immediately on every
  // pointermove for a smooth drag feel, only the expensive canvas-redraw side is throttled.
  const rafIdRef = useRef<number | null>(null);
  const latestPositionRef = useRef(0.5);

  useEffect(
    () => () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    },
    [],
  );

  const scheduleOnDrag = (value: number) => {
    latestPositionRef.current = value;
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      onDrag(latestPositionRef.current);
    });
  };

  // Cached per drag gesture (set on pointerdown, reused through every pointermove until the next
  // pointerdown) rather than re-measured on every single move - the container's own position
  // can't realistically change mid-gesture, so there's no need to force a layout read that often.
  const dragRectRef = useRef<DOMRect | null>(null);

  const updatePosition = (clientX: number, rect: DOMRect) => {
    const contentLeft = rect.left + (contentRect.leftPercent / 100) * rect.width;
    const contentWidth = (contentRect.widthPercent / 100) * rect.width;
    if (contentWidth <= 0) return;

    const fraction = (clientX - contentLeft) / contentWidth;
    const clamped = Math.max(0, Math.min(1, fraction));
    setPosition(clamped);
    scheduleOnDrag(clamped);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    dragRectRef.current = rect;
    updatePosition(event.clientX, rect);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    // Pointer capture (set on down) keeps this firing even once the pointer leaves the
    // container's bounds mid-drag - no need for window-level listeners.
    if (!event.currentTarget.hasPointerCapture(event.pointerId) || !dragRectRef.current) return;
    updatePosition(event.clientX, dragRectRef.current);
  };

  // Composes the content area's own offset with the drag position within it - this is what
  // actually lines the divider up with `renderFrame`'s split, not `position` alone.
  const dividerLeftPercent = contentRect.leftPercent + position * contentRect.widthPercent;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 z-4 touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* Fixed corner labels - not tied to the drag position, just marking which side is which. */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-between text-[10px]/none font-semibold text-white">
        <span className="bg-primary-invert/60 rounded-sm px-1.5 pt-1 pb-0.5 backdrop-blur-xs">
          Before
        </span>
        <span className="bg-sky-blue-burst rounded-sm px-1.5 pt-1 pb-0.5">After</span>
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-white/80"
        style={{ left: `${String(dividerLeftPercent)}%` }}
      />
      <div
        className="border-primary/10 bg-primary-invert/80 text-primary pointer-events-none absolute top-1/2 flex size-9 items-center justify-center rounded-full border shadow-md backdrop-blur-xs"
        style={{ left: `${String(dividerLeftPercent)}%`, transform: 'translate(-50%, -50%)' }}
      >
        <Icon icon="solar:arrow-left-linear" className="size-3" />
        <Icon icon="solar:arrow-right-linear" className="-ml-0.5 size-3" />
      </div>
    </div>
  );
};

export default TryOnCompareSlider;
