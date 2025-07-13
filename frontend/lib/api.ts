import type { 
  Book, 
  BookCreate,
  BookUpdate,
  BookListResponse,
  BookSearchFilters,
  SearchFilters
} from '@/types/Book';
import type {
  Borrower,
  BorrowerCreate,
  BorrowerUpdate,
  BorrowerSearchFilters
} from '@/types/Borrower';
import type {
  LendingRecord,
  LendingCreate,
  LendingUpdate,
  LendingSearchFilters
} from '@/types/Lending';
import { 
  transformBackendBookToFrontend, 
  transformFrontendBookToBackend, 
  transformSearchFilters,
  transformBackendBorrowerToFrontend,
  transformFrontendBorrowerToBackend,
  transformBorrowerSearchFilters,
  transformBackendLendingToFrontend,
  transformFrontendLendingToBackend,
  transformLendingSearchFilters,
  type BackendBook,
  type BackendBookListResponse,
  type BackendBorrower,
  type BackendLendingRecord
} from './api-types';

// Legacy type aliases for backward compatibility
export type BorrowerCreateData = BorrowerCreate;
export type BorrowerUpdateData = BorrowerUpdate;
export type LendingCreateData = LendingCreate;

/**
 * API base URL for backend requests.
 */
const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Helper to handle API responses, throwing on error.
 */
const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: 'Network error' };
    }
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Helper to make API requests with JSON headers by default.
 */
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  const response = await fetch(url, config);
  return handleResponse(response);
};

/**
 * Helper function to build query parameters
 */
const buildQueryParams = (filters: Record<string, any>): string => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((item: string) => params.append(key, item));
      } else {
        params.append(key, String(value));
      }
    }
  });
  return params.toString();
};

// Book API functions
export const bookAPI = {
  /**
   * Get all books with optional filters and pagination.
   */
  getBooks: async (
    filters: BookSearchFilters = {}, 
    skip: number = 0, 
    limit: number = 50
  ): Promise<Book[]> => {
    const params = {
      ...transformSearchFilters(filters),
      skip,
      limit
    };
    const queryString = buildQueryParams(params);
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    
    const response: BackendBookListResponse = await apiRequest(endpoint);
    
    // Transform backend response to frontend format
    return response.books.map(transformBackendBookToFrontend);
  },

  /**
   * Get a single book by ID.
   */
  getBook: async (id: number | string): Promise<Book> => {
    const backendBook: BackendBook = await apiRequest(`/books/${id}`);
    return transformBackendBookToFrontend(backendBook);
  },

  /**
   * Create a new book.
   */
  createBook: async (bookData: Partial<Book>): Promise<Book> => {
    const backendData = transformFrontendBookToBackend(bookData);
    const backendBook: BackendBook = await apiRequest('/books', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    return transformBackendBookToFrontend(backendBook);
  },

  /**
   * Update an existing book.
   */
  updateBook: async (id: number | string, bookData: Partial<Book>): Promise<Book> => {
    const backendData = transformFrontendBookToBackend(bookData);
    const backendBook: BackendBook = await apiRequest(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
    return transformBackendBookToFrontend(backendBook);
  },

  /**
   * Delete a book.
   */
  deleteBook: async (id: number | string): Promise<void> => {
    await apiRequest(`/books/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Search books by query.
   */
  searchBooks: async (query: string): Promise<Book[]> => {
    const response: BackendBookListResponse = await apiRequest(`/books?search=${encodeURIComponent(query)}`);
    return response.books.map(transformBackendBookToFrontend);
  },

  /**
   * Toggle book favorite status (frontend-only feature).
   */
  toggleFavorite: async (id: number | string): Promise<Book> => {
    // This would need to be implemented as user preferences in the backend
    // For now, just return the book unchanged
    return await bookAPI.getBook(id);
  },

  /**
   * Get books with full pagination info
   */
  getBooksWithPagination: async (
    filters: BookSearchFilters = {}, 
    skip: number = 0, 
    limit: number = 10
  ): Promise<{ books: Book[]; total: number; page: number; size: number; pages: number }> => {
    const params = {
      ...transformSearchFilters(filters),
      skip,
      limit
    };
    const queryString = buildQueryParams(params);
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    
    const response: BackendBookListResponse = await apiRequest(endpoint);
    
    return {
      books: response.books.map(transformBackendBookToFrontend),
      total: response.total,
      page: response.page,
      size: response.size,
      pages: response.pages
    };
  },
};

// Borrower API functions
export const borrowerAPI = {
  /**
   * Get all borrowers with optional filters.
   */
  getBorrowers: async (filters: BorrowerSearchFilters = {}): Promise<Borrower[]> => {
    const backendFilters = transformBorrowerSearchFilters(filters);
    const queryString = buildQueryParams(backendFilters);
    const endpoint = queryString ? `/borrowers?${queryString}` : '/borrowers';
    const backendBorrowers: BackendBorrower[] = await apiRequest(endpoint);
    return backendBorrowers.map(transformBackendBorrowerToFrontend);
  },

  /**
   * Get a single borrower by ID.
   */
  getBorrower: async (id: number | string): Promise<Borrower> => {
    const backendBorrower: BackendBorrower = await apiRequest(`/borrowers/${id}`);
    return transformBackendBorrowerToFrontend(backendBorrower);
  },

  /**
   * Create a new borrower.
   */
  createBorrower: async (borrowerData: BorrowerCreateData): Promise<Borrower> => {
    const backendData = transformFrontendBorrowerToBackend(borrowerData);
    const backendBorrower: BackendBorrower = await apiRequest('/borrowers', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    return transformBackendBorrowerToFrontend(backendBorrower);
  },

  /**
   * Update an existing borrower.
   */
  updateBorrower: async (id: number | string, borrowerData: BorrowerUpdateData): Promise<Borrower> => {
    const backendData = transformFrontendBorrowerToBackend(borrowerData);
    const backendBorrower: BackendBorrower = await apiRequest(`/borrowers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
    return transformBackendBorrowerToFrontend(backendBorrower);
  },

  /**
   * Delete a borrower.
   */
  deleteBorrower: async (id: number | string): Promise<void> => {
    await apiRequest(`/borrowers/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Deactivate a borrower.
   */
  deactivateBorrower: async (id: number | string): Promise<Borrower> => {
    const backendBorrower: BackendBorrower = await apiRequest(`/borrowers/${id}/deactivate`, {
      method: 'POST',
    });
    return transformBackendBorrowerToFrontend(backendBorrower);
  },

  /**
   * Activate a borrower.
   */
  activateBorrower: async (id: number | string): Promise<Borrower> => {
    const backendBorrower: BackendBorrower = await apiRequest(`/borrowers/${id}/activate`, {
      method: 'POST',
    });
    return transformBackendBorrowerToFrontend(backendBorrower);
  },
};

// Lending API functions
export const lendingAPI = {
  /**
   * Get all lending records with optional filters.
   */
  getLendingRecords: async (filters: LendingSearchFilters = {}): Promise<LendingRecord[]> => {
    const backendFilters = transformLendingSearchFilters(filters);
    const queryString = buildQueryParams(backendFilters);
    const endpoint = queryString ? `/lending?${queryString}` : '/lending';
    const backendRecords: BackendLendingRecord[] = await apiRequest(endpoint);
    return backendRecords.map(transformBackendLendingToFrontend);
  },

  /**
   * Create a new lending record (lend a book).
   */
  lendBook: async (lendingData: LendingCreateData): Promise<LendingRecord> => {
    const backendData = transformFrontendLendingToBackend(lendingData);
    const backendRecord: BackendLendingRecord = await apiRequest('/lending', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    return transformBackendLendingToFrontend(backendRecord);
  },

  /**
   * Return a book.
   */
  returnBook: async (recordId: number | string, returnData: Record<string, any> = {}): Promise<LendingRecord> => {
    const backendRecord: BackendLendingRecord = await apiRequest(`/lending/${recordId}/return`, {
      method: 'POST',
      body: JSON.stringify(returnData),
    });
    return transformBackendLendingToFrontend(backendRecord);
  },

  /**
   * Extend due date for a lending record.
   */
  extendDueDate: async (recordId: number | string, newDueDate: string): Promise<LendingRecord> => {
    const backendRecord: BackendLendingRecord = await apiRequest(`/lending/${recordId}/extend`, {
      method: 'POST',
      body: JSON.stringify({ due_date: newDueDate }),
    });
    return transformBackendLendingToFrontend(backendRecord);
  },

  /**
   * Mark a book as lost.
   */
  markBookLost: async (recordId: number | string): Promise<LendingRecord> => {
    const backendRecord: BackendLendingRecord = await apiRequest(`/lending/${recordId}/mark-lost`, {
      method: 'POST',
    });
    return transformBackendLendingToFrontend(backendRecord);
  },

  /**
   * Get overdue books.
   */
  getOverdueBooks: async (): Promise<LendingRecord[]> => {
    const backendRecords: BackendLendingRecord[] = await apiRequest('/lending/overdue');
    return backendRecords.map(transformBackendLendingToFrontend);
  },

  /**
   * Get lending statistics.
   */
  getStatistics: async (): Promise<any> => apiRequest('/lending/statistics'),
};

// User API functions (authentication)
export const userAPI = {
  /**
   * Login user.
   */
  login: async (username: string, password: string): Promise<{ access_token: string; token_type: string }> => apiRequest('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username,
      password,
    }),
  }),

  /**
   * Register a new user.
   */
  register: async (userData: { username: string; email: string; password: string }): Promise<any> => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  /**
   * Get current user profile.
   */
  getProfile: async (token: string): Promise<any> => apiRequest('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),

  /**
   * Refresh token.
   */
  refreshToken: async (token: string): Promise<{ access_token: string; token_type: string }> => apiRequest('/auth/refresh', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }),
};

// Export utility functions
export { buildQueryParams, handleResponse };

// Default export for convenience
export default {
  books: bookAPI,
  borrowers: borrowerAPI,
  lending: lendingAPI,
  users: userAPI,
};
