/**
 * Category interface matching the backend SQLAlchemy model structure
 * Ensures type safety between frontend and backend
 */
export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number | null;
  created_at?: string;
  updated_at?: string;
  // Optional: nested children for tree structures
  children?: Category[];
}
