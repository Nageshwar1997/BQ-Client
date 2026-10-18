import type { TFieldErrors, TGlobalErrors } from '@beautinique/frontend-types';

import type { IErrorResponse } from '@/types/api.type';

class ApiError extends Error {
  fieldErrors?: TFieldErrors;
  globalErrors?: TGlobalErrors;
  /** The HTTP status of the answer, when there was one (404: not found). */
  statusCode?: number;

  constructor(
    params: Pick<IErrorResponse, 'fieldErrors' | 'globalErrors'> & {
      message: string;
      statusCode?: number;
    },
  ) {
    super(params.message);

    this.fieldErrors = params.fieldErrors;
    this.globalErrors = params.globalErrors;
    this.statusCode = params.statusCode;
  }
}

export default ApiError;
