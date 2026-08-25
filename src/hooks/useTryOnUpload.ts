import { IMAGE_FORMATS, IMAGE_MIMES, MAX_IMAGE_SIZE } from '@beautinique/frontend-constants';
import type { TImageFormat, TImageMime } from '@beautinique/frontend-types';
import { formatFileSize } from '@beautinique/shared-utils';
import { useEffect, useState } from 'react';

// Upload-mode file handling for the Try-On flow: same size/mime/extension
// validation as `insertImageIntoQuill` in `utils/input.util.ts`, and the same
// `URL.createObjectURL`/`revokeObjectURL` preview lifecycle as `AvatarUpload.tsx`.
const useTryOnUpload = () => {
  const [file, setFileState] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

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

  const setFile = (candidate: File) => {
    if (candidate.size > MAX_IMAGE_SIZE) {
      setError(
        `Image size is ${formatFileSize(candidate.size)}. Max allowed size is ${formatFileSize(MAX_IMAGE_SIZE)}.`,
      );
      return;
    }

    const ext = candidate.name.split('.').pop()?.toLowerCase();

    if (
      !IMAGE_MIMES.includes(candidate.type as TImageMime) ||
      !ext ||
      !IMAGE_FORMATS.includes(ext as TImageFormat)
    ) {
      setError(`File extension is .${ext ?? 'unknown'}. Allowed extensions are ${IMAGE_FORMATS.join(', ')}.`);
      return;
    }

    setError('');
    setFileState(candidate);
  };

  const reset = () => {
    setFileState(null);
    setError('');
  };

  return { file, previewUrl, error, setFile, reset };
};

export default useTryOnUpload;
