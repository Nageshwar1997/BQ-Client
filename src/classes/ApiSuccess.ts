class ApiSuccess<T = unknown> {
  message: string;
  data?: T;
  statusCode: number;

  constructor(params: { message: string; data: T; statusCode?: number }) {
    this.message = params.message;
    this.data = params.data;
    this.statusCode = params.statusCode ?? 200;
  }
}

export default ApiSuccess;
