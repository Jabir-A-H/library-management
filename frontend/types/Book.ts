/**
 * Book interface matching the backend SQLAlchemy model structure
 * This ensures type safety between frontend and backend
 */
export interface Book {
  // Primary fields
  id: number;
  title: string;
  title_bn?: string;
  author: string;
  author_bn?: string;
  isbn?: string;
  
  // Classification and metadata
  genre?: string;
  publication_year?: number;
  description?: string;
  description_bn?: string;
  read_status?: string;
  rating?: number;
  
  // Location tracking
  room?: string;
  shelf?: string;
  column_location?: string;
  row_location?: string;
  location_comment?: string;
  
  // Publishing information
  publisher?: string;
  publisher_bn?: string;
  language?: string;
  page_count?: number;
  
  // Categorization and tagging
  category_id?: number;
  category?: {
    id: number;
    name: string;
    description?: string;
  } | string; // Union type to support both backend object and legacy string
  tags?: Array<{
    id: number;
    name: string;
    description?: string;
  }> | string[]; // Union type to support both backend objects and legacy strings
  
  // Media and images
  cover_image?: string;
  preview_images?: string[];
  
  // Inventory management
  total_copies?: number;
  available_copies?: number;
  
  // Additional notes
  comments?: string;
  
  // Computed properties from backend
  is_available?: boolean;
  borrowed_count?: number;
  full_location?: string;
  
  // Legacy fields for backward compatibility
  numPages?: number; // maps to page_count
  previewImages?: string[]; // maps to preview_images
  totalCopies?: number; // maps to total_copies
  availableCopies?: number; // maps to available_copies
  readStatus?: string; // maps to read_status
  publicationYear?: number; // maps to publication_year
  isFavorite?: boolean; // for frontend state
  status?: string; // for frontend state
  columnLocation?: string; // maps to column_location
  rowLocation?: string; // maps to row_location
  locationComment?: string; // maps to location_comment
  coverImage?: string; // maps to cover_image
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  createdAt?: string; // legacy
  updatedAt?: string; // legacy
}

/**
 * Type for creating a new book (excludes computed and generated fields)
 */
export type BookCreate = Omit<Book, 
  'id' | 'created_at' | 'updated_at' | 'createdAt' | 'updatedAt' | 
  'is_available' | 'borrowed_count' | 'full_location' | 'category' | 'tags'
>;

/**
 * Type for updating a book (all fields optional except id)
 */
export type BookUpdate = Partial<BookCreate> & {
  id: number;
};

/**
 * API response structure for book lists
 */
export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

/**
 * Search filters for book queries
 */
export interface BookSearchFilters {
  search?: string;
  category_id?: number;
  tag_id?: number;
  available_only?: boolean;
  author?: string;
  genre?: string;
  language?: string;
  read_status?: string;
}

/**
 * Borrower interface matching the backend SQLAlchemy model
 */
export interface Borrower {
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
  created_at?: string;
  updated_at?: string;
  
  // Computed properties
  full_name?: string;
  full_name_bn?: string;
  active_loans_count?: number;
}

/**
 * Type for creating a new borrower
 */
export type BorrowerCreateData = Omit<Borrower, 
  'id' | 'created_at' | 'updated_at' | 'full_name' | 'full_name_bn' | 'active_loans_count'
>;

/**
 * Type for updating a borrower
 */
export type BorrowerUpdateData = Partial<BorrowerCreateData>;

/**
 * Lending Record interface matching the backend SQLAlchemy model
 */
export interface LendingRecord {
  id: number;
  book_id: number;
  borrower_id: number;
  checkout_date: string;
  due_date: string;
  return_date?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // Related objects (may be populated by backend)
  book?: Book;
  borrower?: Borrower;
  
  // Computed properties
  is_overdue?: boolean;
  days_overdue?: number;
  issue_date?: string; // alias for checkout_date
}

/**
 * Type for creating a new lending record
 */
export type LendingCreateData = {
  book_id: number;
  borrower_id: number;
  due_date: string;
  notes?: string;
};

/**
 * General search filters interface
 */
export interface SearchFilters {
  search?: string;
  page?: number;
  size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  
  // Book specific filters
  category_id?: number;
  tag_id?: number;
  available_only?: boolean;
  author?: string;
  genre?: string;
  language?: string;
  read_status?: string;
  
  // Borrower specific filters
  first_name?: string;
  last_name?: string;
  email?: string;
  
  // Lending specific filters
  status?: string;
  overdue_only?: boolean;
  borrower_id?: number;
  book_id?: number;
}
