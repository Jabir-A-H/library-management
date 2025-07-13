/**
 * Lending types matching the backend SQLAlchemy model structure
 * This ensures type safety between frontend and backend
 */

import type { Book } from './Book';
import type { Borrower } from './Borrower';

/**
 * Lending Record interface matching the backend SQLAlchemy model
 */
export interface LendingRecord {
  // Primary fields
  id: number;
  book_id: number;
  borrower_id: number;
  checkout_date: string;
  due_date: string;
  return_date?: string;
  status: 'borrowed' | 'returned' | 'overdue' | 'lost';
  notes?: string;
  
  // Related objects (may be populated by backend)
  book?: Book;
  borrower?: Borrower;
  
  // Computed properties from backend
  is_overdue?: boolean;
  days_overdue?: number;
  
  // Legacy compatibility
  issue_date?: string; // alias for checkout_date
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
}

/**
 * Type for creating a new lending record
 */
export type LendingCreate = {
  book_id: number;
  borrower_id: number;
  due_date: string;
  notes?: string;
};

/**
 * Type for updating a lending record
 */
export type LendingUpdate = {
  due_date?: string;
  return_date?: string;
  status?: 'borrowed' | 'returned' | 'overdue' | 'lost';
  notes?: string;
};

/**
 * Type for returning a book
 */
export type BookReturn = {
  return_date?: string;
  notes?: string;
};

/**
 * Type for extending due date
 */
export type LendingExtend = {
  new_due_date: string;
  notes?: string;
};

/**
 * Search filters for lending queries
 */
export interface LendingSearchFilters {
  search?: string;
  status?: string;
  overdue_only?: boolean;
  borrower_id?: number;
  book_id?: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Lending statistics interface
 */
export interface LendingStatistics {
  total_active_loans: number;
  total_overdue_loans: number;
  total_books_lent: number;
  total_books_returned: number;
  average_loan_duration: number;
  most_borrowed_books: Array<{
    book: Book;
    loan_count: number;
  }>;
  top_borrowers: Array<{
    borrower: Borrower;
    loan_count: number;
  }>;
}
