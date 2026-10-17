import type { AxiosProgressEvent } from 'axios';

import type { SELLER_STEPPER_STEP_COUNT } from '@/constants/form.constants';

export type TSellerStepNumber = (typeof SELLER_STEPPER_STEP_COUNT)[number];

export interface TFormDataProgress {
  data: FormData;
  onUploadProgress?: (event: AxiosProgressEvent) => void;
}
