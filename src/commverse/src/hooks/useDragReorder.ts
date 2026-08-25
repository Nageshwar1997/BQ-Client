import { useRef, useState } from 'react';

export const useDragReorder = (onMove: (from: number, to: number) => void) => {
  const dragIdx = useRef<number | null>(null);
  const dragOverIdx = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const getRowProps = (idx: number) => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragOverIdx.current !== idx) {
        dragOverIdx.current = idx;
        setOverIdx(idx);
      }
    },
    onDrop: () => {
      const from = dragIdx.current;
      const to = dragOverIdx.current;
      if (from !== null && to !== null && from !== to) {
        onMove(from, to);
      }
      dragIdx.current = null;
      dragOverIdx.current = null;
      setDraggingIdx(null);
      setOverIdx(null);
    },
  });

  const getGripProps = (idx: number) => ({
    draggable: true as const,
    onDragStart: (e: React.DragEvent) => {
      dragIdx.current = idx;
      setDraggingIdx(idx);
      e.dataTransfer.effectAllowed = 'move';
    },
    onDragEnd: () => {
      dragIdx.current = null;
      dragOverIdx.current = null;
      setDraggingIdx(null);
      setOverIdx(null);
    },
  });

  return { getRowProps, getGripProps, draggingIdx, overIdx };
};
