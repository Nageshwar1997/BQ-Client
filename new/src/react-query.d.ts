import '@tanstack/react-query';
import type { ApiError } from './classes/ApiError';

declare module '@tanstack/react-query' {
  interface Register {
    defaultError: ApiError;
  }
}
