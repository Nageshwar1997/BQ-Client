import '@tanstack/react-query';
import type { ApiError } from './Api-Service/ApiError';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}
