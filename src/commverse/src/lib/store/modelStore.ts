import { create } from 'zustand';

export type ModelStatus =
  | 'validating'
  | 'loading'
  | 'invalid'
  | 'ready'
  | 'idle';

export interface ValidationError {
  title: string;
  description: string;
}

interface ModelState {
  status: ModelStatus;
  validationError: ValidationError | null;
  cachedBlobUrl: string | null;
  setStatus: (status: ModelStatus) => void;
  setValidationError: (error: ValidationError | null) => void;
  setCachedBlobUrl: (url: string | null) => void;
  reset: () => void;
}

export const useModelStore = create<ModelState>((set, get) => ({
  status: 'idle',
  validationError: null,
  cachedBlobUrl: null,
  setStatus: (status) => set({ status }),
  setValidationError: (validationError) => set({ validationError }),
  setCachedBlobUrl: (newBlobUrl) => {
    // Revoke the previous blob URL to free memory before setting new one
    const currentBlobUrl = get().cachedBlobUrl;
    if (currentBlobUrl && currentBlobUrl !== newBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
    }
    set({ cachedBlobUrl: newBlobUrl });
  },
  reset: () => {
    // Revoke the cached blob URL to free memory
    const currentBlobUrl = get().cachedBlobUrl;
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
    }
    set({ status: 'idle', validationError: null, cachedBlobUrl: null });
  },
}));
