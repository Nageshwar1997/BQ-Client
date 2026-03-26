export class ApiError extends Error {
  errors?: { field: string; message: string }[];

  constructor(message: string, errors?: { field: string; message: string }[]) {
    super(message);
    this.errors = errors;
  }
}
