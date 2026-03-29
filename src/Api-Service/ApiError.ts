export type TFieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  fieldErrors?: TFieldErrors;
  globalErrors?: string[];

  constructor(params: { message: string; fieldErrors?: TFieldErrors; globalErrors?: string[] }) {
    super(params.message);

    this.fieldErrors = params.fieldErrors;
    this.globalErrors = params.globalErrors;
  }
}
