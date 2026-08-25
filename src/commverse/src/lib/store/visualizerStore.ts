import { create } from 'zustand';

export interface CameraControl {
  set: () => void;
  preview: () => void;
  getCameraPosition: () => { x: number; y: number; z: number };
}

interface VisualizerState {
  cameraControl: CameraControl | null;
  setCameraControl: (control: CameraControl | null) => void;
}

export const useVisualizerStore = create<VisualizerState>((set) => ({
  cameraControl: null,
  setCameraControl: (control) => set({ cameraControl: control }),
}));
