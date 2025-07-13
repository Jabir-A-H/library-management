/**
 * Borrower interface matching the backend SQLAlchemy model structure
 * This ensures type safety between frontend and backend
 */
export interface Borrower {
  // Primary fields
  id: number;
  first_name: string;
  first_name_bn?: string;
  last_name: string;
  last_name_bn?: string;
  email?: string;
  phone?: string;
  address?: string;
  address_bn?: string;
  relationship?: string;
  current_books_count?: number;
  comments?: string;
  
  // Computed properties from backend
  full_name?: string;
  full_name_bn?: string;
  active_loans_count?: number;
  
  // Legacy fields for backward compatibility
  name?: string; // maps to full_name
  contact_info?: string; // maps to email or phone
  notes?: string; // maps to comments
  is_active?: boolean; // for frontend state
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

/**
 * Type for creating a new borrower (excludes computed and generated fields)
 */
export type BorrowerCreate = Omit<Borrower, 
  'id' | 'created_at' | 'updated_at' | 'full_name' | 'full_name_bn' | 'active_loans_count'
>;

/**
 * Type for updating a borrower (all fields optional)
 */
export type BorrowerUpdate = Partial<BorrowerCreate>;

/**
 * Search filters for borrower queries
 */
export interface BorrowerSearchFilters {
  search?: string;
  is_active?: boolean;
  relationship?: string;
}
