export type CreativeStudioMediaType = 'image' | 'video';

export const AI_CREATIVE_STUDIO_PROMPT_LIMITS: Record<
  CreativeStudioMediaType,
  number
> = {
  image: 500,
  video: 500,
};

export const AI_CREATIVE_STUDIO_MAX_IMAGE_FILE_SIZE_MB = 20;
export const AI_CREATIVE_STUDIO_MAX_IMAGE_FILE_SIZE_BYTES =
  AI_CREATIVE_STUDIO_MAX_IMAGE_FILE_SIZE_MB * 1024 * 1024;

export const getCreativeStudioPromptCharacterLimit = (
  mediaType: CreativeStudioMediaType
) => AI_CREATIVE_STUDIO_PROMPT_LIMITS[mediaType];

export const getCreativeStudioMaxPromptCharacterLimit = () =>
  Math.max(...Object.values(AI_CREATIVE_STUDIO_PROMPT_LIMITS));

export const getCreativeStudioImageFileSizeError = (file: File) => {
  if (file.size <= AI_CREATIVE_STUDIO_MAX_IMAGE_FILE_SIZE_BYTES) {
    return null;
  }

  return `File too large. Maximum allowed size is ${AI_CREATIVE_STUDIO_MAX_IMAGE_FILE_SIZE_MB} MB per file.`;
};

export const getCreativeStudioPromptLengthError = (
  prompt: string,
  mediaType: CreativeStudioMediaType
) => {
  const trimmedPrompt = prompt.trim();

  if (!trimmedPrompt) return null;

  const limit = getCreativeStudioPromptCharacterLimit(mediaType);

  if (trimmedPrompt.length <= limit) return null;

  return `${
    mediaType === 'image' ? 'Image' : 'Video'
  } prompts must be ${limit} characters or less.`;
};

export const validateGenerateMediaPayload = (payload: {
  mediaType: CreativeStudioMediaType;
  images: File[];
  prompt: string;
}) => {
  const trimmedPrompt = payload.prompt.trim();

  if (!trimmedPrompt) {
    throw new Error('Prompt is required.');
  }

  const promptLengthError = getCreativeStudioPromptLengthError(
    trimmedPrompt,
    payload.mediaType
  );

  if (promptLengthError) {
    throw new Error(promptLengthError);
  }

  if (payload.mediaType === 'image' && payload.images.length > 1) {
    throw new Error('Image mode supports only 1 image.');
  }

  if (payload.mediaType === 'video' && payload.images.length > 2) {
    throw new Error('Video mode supports maximum 2 images.');
  }

  for (const image of payload.images) {
    const fileSizeError = getCreativeStudioImageFileSizeError(image);

    if (fileSizeError) {
      throw new Error(fileSizeError);
    }
  }
};
