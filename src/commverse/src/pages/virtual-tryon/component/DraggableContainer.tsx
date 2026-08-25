import { useRef, useState, useEffect, type ReactNode, type RefObject } from 'react';
import type { ITryOnCommonRef, TTryOnMode } from '../../../types';
import { Icon } from '@iconify/react';

interface Props {
  tryOnRef: RefObject<ITryOnCommonRef | null>;
  isCompareActive: boolean;
  children?: ReactNode;
  mode: TTryOnMode;
}

const DraggableContainer = ({ tryOnRef, isCompareActive, children, mode }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState(0.5);
  const [dragAreaWidth, setDragAreaWidth] = useState('100%');

  /* ================= HANDLE EXTERNAL COMPARE TOGGLE ================= */

  useEffect(() => {
    if (!isCompareActive) {
      // Compare turned OFF
      tryOnRef.current?.setComparePosition(null);
      return;
    }

    // Compare turned ON → start from center
    const frameId = requestAnimationFrame(() => setPosition(0.5));
    tryOnRef.current?.setComparePosition(0.5);
    return () => cancelAnimationFrame(frameId);
  }, [isCompareActive, tryOnRef]);

  useEffect(() => {
    if (mode === 'live') {
      const frameId = requestAnimationFrame(() => setDragAreaWidth('100%'));
      return () => cancelAnimationFrame(frameId);
    }

    const canvas = tryOnRef.current?.getCanvas?.();
    if (!canvas) {
      const frameId = requestAnimationFrame(() => setDragAreaWidth('100%'));
      return () => cancelAnimationFrame(frameId);
    }

    let isCancelled = false;

    const setWidth = (value: string) => {
      if (!isCancelled) {
        setDragAreaWidth(value);
      }
    };

    const updateWidth = () => {
      const width = canvas.getBoundingClientRect().width;
      setWidth(width > 0 ? `${width}px` : '100%');
    };

    const initFrameId = requestAnimationFrame(updateWidth);

    const observer = new ResizeObserver(updateWidth);
    observer.observe(canvas);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(initFrameId);
      observer.disconnect();
    };
  }, [mode, tryOnRef]);

  /* ================= DRAG LOGIC ================= */

  const updatePosition = (clientX: number) => {
    if (!containerRef.current || !isCompareActive) return;

    const rect = containerRef.current.getBoundingClientRect();
    const percent = (clientX - rect.left) / rect.width;

    const clamped = Math.max(0, Math.min(1, percent));

    setPosition(clamped);
    tryOnRef.current?.setComparePosition(clamped);
  };

  const startDrag = (clientX: number) => {
    if (!isCompareActive) return;
    setDragging(true);
    updatePosition(clientX);
  };

  const stopDrag = () => {
    setDragging(false);
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center select-none">
      <div
        ref={containerRef}
        className={`absolute z-1 h-full ${mode === 'live' ? 'w-full' : ''}`}
        style={{ width: dragAreaWidth }}
        onMouseDown={(e) => startDrag(e.clientX)}
        onMouseMove={(e) => dragging && updatePosition(e.clientX)}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
        onTouchEnd={stopDrag}
      >
        {isCompareActive && (
          <div className="pointer-events-none relative h-full w-full">
            <div
              className="bg-neutral-gray-100 pointer-events-auto absolute bottom-15 z-1 flex cursor-grab items-center rounded-full p-2 active:cursor-grabbing"
              style={{
                left: `${position * 100}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <Icon icon={'lucide:chevrons-left-right'} className="size-6 [&>path]:stroke-[1.5]" />
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default DraggableContainer;
