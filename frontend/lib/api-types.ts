/**
 * API types and utilities for handling data transformation between frontend and backend
 */

import type { Book, BookCreate, BookUpdate, BookSearchFilters, SearchFilters } from '@/types/Book';
import type { Borrower, BorrowerCreate, BorrowerUpdate, BorrowerSearchFilters } from '@/types/Borrower';
import type { LendingRecord, LendingCreate, LendingUpdate, LendingSearchFilters } from '@/types/Lending';

/**
 * Backend book structure as returned by the API
 */
export interface BackendBook {
  id: number;
  title: string;
  title_bn?: string;
  author: string;
  author_bn?: string;
  isbn?: string;
  genre?: string;
  publication_year?: number;
  description?: string;
  description_bn?: string;
  read_status?: string;
  rating?: number;
  room?: string;
  shelf?: string;
  column_location?: string;
  row_location?: string;
  location_comment?: string;
  publisher?: string;
  publisher_bn?: string;
  language?: string;
  page_count?: number;
  category_id?: number;
  cover_image?: string;
  total_copies?: number;
  available_copies?: number;
  comments?: string;
  is_available?: boolean;
  borrowed_count?: number;
  full_location?: string;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  tags?: Array<{
    id: number;
    name: string;
    description?: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

/**
 * Backend book list response structure
 */
export interface BackendBookListResponse {
  books: BackendBook[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

/**
 * Transform backend book data to frontend Book interface
 * Handles field name mapping and legacy compatibility
 */
export function transformBackendBookToFrontend(backendBook: BackendBook): Book {
  return {
    // Direct mapping
    id: backendBook.id,
    title: backendBook.title,
    title_bn: backendBook.title_bn,
    author: backendBook.author,
    author_bn: backendBook.author_bn,
    isbn: backendBook.isbn,
    genre: backendBook.genre,
    publication_year: backendBook.publication_year,
    description: backendBook.description,
    description_bn: backendBook.description_bn,
    read_status: backendBook.read_status,
    rating: backendBook.rating,
    room: backendBook.room,
    shelf: backendBook.shelf,
    column_location: backendBook.column_location,
    row_location: backendBook.row_location,
    location_comment: backendBook.location_comment,
    publisher: backendBook.publisher,
    publisher_bn: backendBook.publisher_bn,
    language: backendBook.language,
    page_count: backendBook.page_count,
    category_id: backendBook.category_id,
    cover_image: backendBook.cover_image,
    total_copies: backendBook.total_copies,
    available_copies: backendBook.available_copies,
    comments: backendBook.comments,
    is_available: backendBook.is_available,
    borrowed_count: backendBook.borrowed_count,
    full_location: backendBook.full_location,
    category: backendBook.category,
    tags: backendBook.tags,
    created_at: backendBook.created_at,
    updated_at: backendBook.updated_at,

    // Legacy field mappings for backward compatibility
    numPages: backendBook.page_count,
    previewImages: [], // Would need separate API call
    totalCopies: backendBook.total_copies,
    availableCopies: backendBook.available_copies,
    readStatus: backendBook.read_status,
    publicationYear: backendBook.publication_year,
    columnLocation: backendBook.column_location,
    rowLocation: backendBook.row_location,
    locationComment: backendBook.location_comment,
    coverImage: backendBook.cover_image,
    createdAt: backendBook.created_at,
    updatedAt: backendBook.updated_at,
    
    // Frontend-only fields
    isFavorite: false, // Would need separate API call or user state
    status: backendBook.is_available ? 'available' : 'unavailable',
  };
}

/**
 * Transform frontend book data to backend format for API requests
 */
export function transformFrontendBookToBackend(frontendBook: Partial<Book>): Partial<BackendBook> {
  const backend: Partial<BackendBook> = {};

  // Direct mapping
  if (frontendBook.id !== undefined) backend.id = frontendBook.id;
  if (frontendBook.title !== undefined) backend.title = frontendBook.title;
  if (frontendBook.title_bn !== undefined) backend.title_bn = frontendBook.title_bn;
  if (frontendBook.author !== undefined) backend.author = frontendBook.author;
  if (frontendBook.author_bn !== undefined) backend.author_bn = frontendBook.author_bn;
  if (frontendBook.isbn !== undefined) backend.isbn = frontendBook.isbn;
  if (frontendBook.genre !== undefined) backend.genre = frontendBook.genre;
  if (frontendBook.description !== undefined) backend.description = frontendBook.description;
  if (frontendBook.description_bn !== undefined) backend.description_bn = frontendBook.description_bn;
  if (frontendBook.rating !== undefined) backend.rating = frontendBook.rating;
  if (frontendBook.room !== undefined) backend.room = frontendBook.room;
  if (frontendBook.shelf !== undefined) backend.shelf = frontendBook.shelf;
  if (frontendBook.publisher !== undefined) backend.publisher = frontendBook.publisher;
  if (frontendBook.publisher_bn !== undefined) backend.publisher_bn = frontendBook.publisher_bn;
  if (frontendBook.language !== undefined) backend.language = frontendBook.language;
  if (frontendBook.category_id !== undefined) backend.category_id = frontendBook.category_id;
  if (frontendBook.comments !== undefined) backend.comments = frontendBook.comments;

  // Handle both new and legacy field names
  if (frontendBook.publication_year !== undefined) {
    backend.publication_year = frontendBook.publication_year;
  } else if (frontendBook.publicationYear !== undefined) {
    backend.publication_year = frontendBook.publicationYear;
  }

  if (frontendBook.read_status !== undefined) {
    backend.read_status = frontendBook.read_status;
  } else if (frontendBook.readStatus !== undefined) {
    backend.read_status = frontendBook.readStatus;
  }

  if (frontendBook.page_count !== undefined) {
    backend.page_count = frontendBook.page_count;
  } else if (frontendBook.numPages !== undefined) {
    backend.page_count = frontendBook.numPages;
  }

  if (frontendBook.column_location !== undefined) {
    backend.column_location = frontendBook.column_location;
  } else if (frontendBook.columnLocation !== undefined) {
    backend.column_location = frontendBook.columnLocation;
  }

  if (frontendBook.row_location !== undefined) {
    backend.row_location = frontendBook.row_location;
  } else if (frontendBook.rowLocation !== undefined) {
    backend.row_location = frontendBook.rowLocation;
  }

  if (frontendBook.location_comment !== undefined) {
    backend.location_comment = frontendBook.location_comment;
  } else if (frontendBook.locationComment !== undefined) {
    backend.location_comment = frontendBook.locationComment;
  }

  if (frontendBook.cover_image !== undefined) {
    backend.cover_image = frontendBook.cover_image;
  } else if (frontendBook.coverImage !== undefined) {
    backend.cover_image = frontendBook.coverImage;
  }

  if (frontendBook.total_copies !== undefined) {
    backend.total_copies = frontendBook.total_copies;
  } else if (frontendBook.totalCopies !== undefined) {
    backend.total_copies = frontendBook.totalCopies;
  }

  if (frontendBook.available_copies !== undefined) {
    backend.available_copies = frontendBook.available_copies;
  } else if (frontendBook.availableCopies !== undefined) {
    backend.available_copies = frontendBook.availableCopies;
  }

  return backend;
}

/**
 * Transform frontend search filters to backend query parameters
 */
export function transformSearchFilters(filters: BookSearchFilters | SearchFilters): Record<string, any> {
  const params: Record<string, any> = {};

  if (filters.search) params.search = filters.search;
  if ('category_id' in filters && filters.category_id) params.category_id = filters.category_id;
  if ('tag_id' in filters && filters.tag_id) params.tag_id = filters.tag_id;
  if ('available_only' in filters && filters.available_only) params.available_only = filters.available_only;
  if ('author' in filters && filters.author) params.author = filters.author;
  if ('genre' in filters && filters.genre) params.genre = filters.genre;
  if ('language' in filters && filters.language) params.language = filters.language;
  if ('read_status' in filters && filters.read_status) params.read_status = filters.read_status;
  
  // General pagination and sorting
  if ('page' in filters && filters.page) params.page = filters.page;
  if ('size' in filters && filters.size) params.size = filters.size;
  if ('sort_by' in filters && filters.sort_by) params.sort_by = filters.sort_by;
  if ('sort_order' in filters && filters.sort_order) params.sort_order = filters.sort_order;
  
  // Borrower specific filters
  if ('first_name' in filters && filters.first_name) params.first_name = filters.first_name;
  if ('last_name' in filters && filters.last_name) params.last_name = filters.last_name;
  if ('email' in filters && filters.email) params.email = filters.email;
  
  // Lending specific filters
  if ('status' in filters && filters.status) params.status = filters.status;
  if ('overdue_only' in filters && filters.overdue_only) params.overdue_only = filters.overdue_only;
  if ('borrower_id' in filters && filters.borrower_id) params.borrower_id = filters.borrower_id;
  if ('book_id' in filters && filters.book_id) params.book_id = filters.book_id;

  return params;
}

/**
 * Backend borrower structure as returned by the API
 */
export interface BackendBorrower {
  id: number;
  first_name: string;
  first_name_bn?: string;
  last_name: string;
  last_name_bn?: string;
  full_name?: string;
  full_name_bn?: string;
  email?: string;
  phone?: string;
  address?: string;
  address_bn?: string;
  relationship?: string;
  current_books_count?: number;
  active_loans_count?: number;
  comments?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Transform backend borrower data to frontend Borrower interface
 * Handles field name mapping and legacy compatibility
 */
export function transformBackendBorrowerToFrontend(backendBorrower: BackendBorrower): Borrower {
  return {
    // Direct mapping
    id: backendBorrower.id,
    first_name: backendBorrower.first_name,
    first_name_bn: backendBorrower.first_name_bn,
    last_name: backendBorrower.last_name,
    last_name_bn: backendBorrower.last_name_bn,
    full_name: backendBorrower.full_name,
    full_name_bn: backendBorrower.full_name_bn,
    email: backendBorrower.email,
    phone: backendBorrower.phone,
    address: backendBorrower.address,
    address_bn: backendBorrower.address_bn,
    relationship: backendBorrower.relationship,
    current_books_count: backendBorrower.current_books_count,
    active_loans_count: backendBorrower.active_loans_count,
    comments: backendBorrower.comments,
    created_at: backendBorrower.created_at,
    updated_at: backendBorrower.updated_at,
    
    // Legacy compatibility mapping
    name: backendBorrower.full_name || `${backendBorrower.first_name} ${backendBorrower.last_name}`.trim(),
    contact_info: backendBorrower.email || backendBorrower.phone || '',
    notes: backendBorrower.comments,
    is_active: true, // Default to active for legacy compatibility
  };
}

/**
 * Transform frontend borrower data to backend format
 * Handles field name mapping from frontend to backend
 */
export function transformFrontendBorrowerToBackend(frontendBorrower: Partial<Borrower>): Partial<BackendBorrower> {
  const result: Partial<BackendBorrower> = {};
  
  // Direct mapping
  if (frontendBorrower.id !== undefined) result.id = frontendBorrower.id;
  if (frontendBorrower.first_name !== undefined) result.first_name = frontendBorrower.first_name;
  if (frontendBorrower.first_name_bn !== undefined) result.first_name_bn = frontendBorrower.first_name_bn;
  if (frontendBorrower.last_name !== undefined) result.last_name = frontendBorrower.last_name;
  if (frontendBorrower.last_name_bn !== undefined) result.last_name_bn = frontendBorrower.last_name_bn;
  if (frontendBorrower.email !== undefined) result.email = frontendBorrower.email;
  if (frontendBorrower.phone !== undefined) result.phone = frontendBorrower.phone;
  if (frontendBorrower.address !== undefined) result.address = frontendBorrower.address;
  if (frontendBorrower.address_bn !== undefined) result.address_bn = frontendBorrower.address_bn;
  if (frontendBorrower.relationship !== undefined) result.relationship = frontendBorrower.relationship;
  if (frontendBorrower.current_books_count !== undefined) result.current_books_count = frontendBorrower.current_books_count;
  if (frontendBorrower.comments !== undefined) result.comments = frontendBorrower.comments;
  
  // Legacy compatibility - handle old field names
  if (frontendBorrower.notes !== undefined && frontendBorrower.comments === undefined) {
    result.comments = frontendBorrower.notes;
  }
  
  return result;
}

/**
 * Transform search filters for borrowers
 */
export function transformBorrowerSearchFilters(filters: BorrowerSearchFilters): Record<string, any> {
  const result: Record<string, any> = {};
  
  if (filters.search !== undefined) result.search = filters.search;
  if (filters.is_active !== undefined) result.is_active = filters.is_active;
  if (filters.relationship !== undefined) result.relationship = filters.relationship;
  
  return result;
}

/**
 * Backend lending record structure as returned by the API
 */
export interface BackendLendingRecord {
  id: number;
  book_id: number;
  borrower_id: number;
  checkout_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  notes?: string;
  is_overdue?: boolean;
  days_overdue?: number;
  book?: any; // Backend book object
  borrower?: any; // Backend borrower object
  created_at?: string;
  updated_at?: string;
}

/**
 * Transform backend lending record to frontend format
 */
export function transformBackendLendingToFrontend(backendLending: BackendLendingRecord): LendingRecord {
  return {
    id: backendLending.id,
    book_id: backendLending.book_id,
    borrower_id: backendLending.borrower_id,
    checkout_date: backendLending.checkout_date,
    due_date: backendLending.due_date,
    return_date: backendLending.return_date,
    status: backendLending.status as 'borrowed' | 'returned' | 'overdue' | 'lost',
    notes: backendLending.notes,
    is_overdue: backendLending.is_overdue,
    days_overdue: backendLending.days_overdue,
    book: backendLending.book ? transformBackendBookToFrontend(backendLending.book) : undefined,
    borrower: backendLending.borrower ? transformBackendBorrowerToFrontend(backendLending.borrower) : undefined,
    issue_date: backendLending.checkout_date, // Legacy compatibility
    created_at: backendLending.created_at,
    updated_at: backendLending.updated_at,
  };
}

/**
 * Transform frontend lending data to backend format
 */
export function transformFrontendLendingToBackend(frontendLending: Partial<LendingRecord>): Partial<BackendLendingRecord> {
  const result: Partial<BackendLendingRecord> = {};
  
  if (frontendLending.id !== undefined) result.id = frontendLending.id;
  if (frontendLending.book_id !== undefined) result.book_id = frontendLending.book_id;
  if (frontendLending.borrower_id !== undefined) result.borrower_id = frontendLending.borrower_id;
  if (frontendLending.checkout_date !== undefined) result.checkout_date = frontendLending.checkout_date;
  if (frontendLending.due_date !== undefined) result.due_date = frontendLending.due_date;
  if (frontendLending.return_date !== undefined) result.return_date = frontendLending.return_date;
  if (frontendLending.status !== undefined) result.status = frontendLending.status;
  if (frontendLending.notes !== undefined) result.notes = frontendLending.notes;
  
  return result;
}

/**
 * Transform lending search filters
 */
export function transformLendingSearchFilters(filters: LendingSearchFilters): Record<string, any> {
  const result: Record<string, any> = {};
  
  if (filters.search !== undefined) result.search = filters.search;
  if (filters.status !== undefined) result.status = filters.status;
  if (filters.overdue_only !== undefined) result.overdue_only = filters.overdue_only;
  if (filters.borrower_id !== undefined) result.borrower_id = filters.borrower_id;
  if (filters.book_id !== undefined) result.book_id = filters.book_id;
  if (filters.start_date !== undefined) result.start_date = filters.start_date;
  if (filters.end_date !== undefined) result.end_date = filters.end_date;
  
  return result;
}
