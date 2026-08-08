import type { TProductDescriptionAndContentZodSchema } from '@beautinique/frontend-types';
import type { AxiosProgressEvent } from 'axios';
import type Quill from 'quill';
import type { RefObject } from 'react';

import type { SELLER_STEPPER_STEP_COUNT } from '@/constants/form.constants';

import type { IQuillImageRef } from './component.type';

export type TSellerStepNumber = (typeof SELLER_STEPPER_STEP_COUNT)[number];

export type TProductContentFields = keyof Omit<
  TProductDescriptionAndContentZodSchema,
  'shortDescription' | 'step'
>;

export type TProductQuillRefs = Record<TProductContentFields, RefObject<Quill | null>>;

export type TProductQuillImageRefs = Record<TProductContentFields, RefObject<IQuillImageRef[]>>;

export interface TFormDataProgress {
  data: FormData;
  onUploadProgress?: (event: AxiosProgressEvent) => void;
}
