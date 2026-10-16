import { IMAGE_FORMATS, IMAGE_MIMES, MB } from '@beautinique/frontend-constants';
import type { TImageFormat, TImageMime } from '@beautinique/frontend-types';
import { formatFileSize } from '@beautinique/shared-utils';
import { useEffect, useState } from 'react';

import { toaster } from '@/utils/toaster';

const ALLOWED_FILE_SIZE = 5 * MB;

// Upload-mode file handling for the Try-On flow: same size/mime/extension
// validation as `insertImageIntoQuill` in `utils/input.util.ts`, and the same
// `URL.createObjectURL`/`revokeObjectURL` preview lifecycle as `AvatarUpload.tsx`.
//
// A rejected file is reported through a toast (not an inline error in the modal) - the toaster is
// app-wide and sits above the modal, and there's no leftover error state to clear afterwards.
const useTryOnUpload = () => {
  const [file, setFileState] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      /**
       * previewUrl is derived from URL.createObjectURL(), an external-system side effect
       * unsafe to run during render, so this branch can't be computed with a plain useMemo.
       */
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Returns whether `candidate` was actually accepted - the caller (TryOnModal) needs this to
  // know whether it's safe to advance the flow into the 'tryon' step, which mounts the engine
  // against `file`/`previewUrl` - advancing on a rejected file would mount it against nothing,
  // stuck showing a "processing..." loading overlay forever since no image ever arrives, right
  // alongside this hook's own rejection toast.
  const setFile = (candidate: File): boolean => {
    if (candidate.size > ALLOWED_FILE_SIZE) {
      toaster.error({
        title: 'Photo is too large',
        description: `This photo is ${formatFileSize(candidate.size)}. Please choose one under ${formatFileSize(ALLOWED_FILE_SIZE)}.`,
      });
      return false;
    }

    const ext = candidate.name.split('.').pop()?.toLowerCase();

    if (
      !IMAGE_MIMES.includes(candidate.type as TImageMime) ||
      !ext ||
      !IMAGE_FORMATS.includes(ext as TImageFormat)
    ) {
      toaster.error({
        title: 'Unsupported photo type',
        description: `.${ext ?? 'unknown'} files aren't supported. Please use ${IMAGE_FORMATS.join(', ')}.`,
      });
      return false;
    }

    setFileState(candidate);
    return true;
  };

  const reset = () => {
    setFileState(null);
  };

  return { file, previewUrl, setFile, reset };
};

export default useTryOnUpload;
