/**
 * Common/shared types and utility types for the frontend
 */

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Pagination info for paginated API responses
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Option type for select/dropdown components
export interface Option<T = string | number> {
  label: string;
  value: T;
}
