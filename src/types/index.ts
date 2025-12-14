/**
 * Common type definitions
 */

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type ID = string | number;
