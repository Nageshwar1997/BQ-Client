import { useCallback } from 'react';
import { inferGarmentType } from '../onboarding.utils';
import type { MediaAttachment } from '../../../types/chat';
import {
  checkVtonHealthNormalized,
  enqueueFashionVton,
} from '../../../services/onboarding/onboardingApi';

type UseVtonManagerArgs = {
  checkVtonHealthMutation: {
    mutateAsync: () => Promise<{ success?: boolean } | null | undefined>;
  };
  generateFashionVtonMutation: {
    mutateAsync: (formData: FormData) => Promise<unknown>;
  };
  waitForGeneratedMediaCompletion: (
    id: string
  ) => Promise<{ outputs: { url?: string }[] }>;
  fetchGeneratedMediaResultUrlWithRetry: (id: string) => Promise<string | null>;
  getQueueDescription: (
    queuePosition?: number,
    estimatedWaitSec?: number
  ) => string;
};

export type RunVtonArgs = {
  answer: string;
  attachments: MediaAttachment[];
  category?: string | null;
  subCategory?: string | null;
  onQueue: (message: string) => void;
};

export type RunVtonResult = {
  resultUrl: string;
};

export const useVtonManager = ({
  checkVtonHealthMutation,
  generateFashionVtonMutation,
  waitForGeneratedMediaCompletion,
  fetchGeneratedMediaResultUrlWithRetry,
  getQueueDescription,
}: UseVtonManagerArgs) => {
  const runVton = useCallback(
    async ({
      answer,
      attachments,
      category,
      subCategory,
      onQueue,
    }: RunVtonArgs): Promise<RunVtonResult> => {
      const imageFiles = attachments
        .filter((attachment) => attachment.type === 'image')
        .map((attachment) => attachment.file)
        .filter((file): file is File => file instanceof File);

      if (imageFiles.length < 2) {
        throw new Error(
          'Upload your photo and one garment image to generate a virtual try-on.'
        );
      }

      const healthResponse = await checkVtonHealthNormalized(
        checkVtonHealthMutation
      );
      if (!healthResponse.ok) {
        throw new Error('VTON service is unavailable. Please try again later.');
      }

      const inferredGarmentType =
        inferGarmentType(answer) ??
        inferGarmentType(`${category ?? ''} ${subCategory ?? ''}`) ??
        'dress';

      const formData = new FormData();
      formData.append('person_image', imageFiles[0]);
      formData.append('garment_image', imageFiles[1]);
      formData.append('garment_type', inferredGarmentType);

      const queueData = await enqueueFashionVton(
        generateFashionVtonMutation,
        formData
      );

      if (!queueData.generatedMediaId.trim()) {
        throw new Error('Invalid queue response from VTON service.');
      }

      onQueue(
        `Request queued. ${getQueueDescription(
          queueData.queuePosition,
          queueData.estimatedWaitSec
        )}`
      );

      const completedMedia = await waitForGeneratedMediaCompletion(
        queueData.generatedMediaId
      );
      let resultUrl =
        completedMedia.outputs.find((output) => output.url)?.url ?? null;

      if (!resultUrl) {
        resultUrl = await fetchGeneratedMediaResultUrlWithRetry(
          queueData.generatedMediaId
        );
      }

      if (!resultUrl) {
        throw new Error('VTON did not return an output image. Please retry.');
      }

      return { resultUrl };
    },
    [
      checkVtonHealthMutation,
      fetchGeneratedMediaResultUrlWithRetry,
      generateFashionVtonMutation,
      getQueueDescription,
      waitForGeneratedMediaCompletion,
    ]
  );

  return { runVton };
};
