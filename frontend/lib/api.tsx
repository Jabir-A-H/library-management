import type { Book } from '../types/Book';
import type { Borrower } from '../types/Borrower';

/**
 * API base URL for backend requests.
 */
const API_BASE_URL: string = typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_API_URL
  ? (window as any).NEXT_PUBLIC_API_URL
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api');

// Additional types for API
interface LendingRecord {
  id: number;
  book_id: number;
  borrower_id: number;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  notes?: string;
}

interface SearchFilters {
  author?: string;
  genre?: string;
  category?: string;
  tags?: string[];
  status?: string;
}

interface BookCreateData extends Omit<Book, 'id' | 'createdAt' | 'updatedAt'> {}
interface BookUpdateData extends Partial<BookCreateData> {}
interface BorrowerCreateData extends Omit<Borrower, 'id'> {}
interface BorrowerUpdateData extends Partial<BorrowerCreateData> {}

interface LendingCreateData {
  book_id: number;
  borrower_id: number;
  due_date: string;
  notes?: string;
}

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
   * Get all books with optional filters.
   */
  getBooks: async (filters: SearchFilters = {}): Promise<Book[]> => {
    const queryString = buildQueryParams(filters);
    const endpoint = queryString ? `/books?${queryString}` : '/books';
    return apiRequest(endpoint);
  },

  /**
   * Get a single book by ID.
   */
  getBook: async (id: number | string): Promise<Book> => apiRequest(`/books/${id}`),

  /**
   * Create a new book.
   */
  createBook: async (bookData: BookCreateData): Promise<Book> => apiRequest('/books', {
    method: 'POST',
    body: JSON.stringify(bookData),
  }),

  /**
   * Update an existing book.
   */
  updateBook: async (id: number | string, bookData: BookUpdateData): Promise<Book> => apiRequest(`/books/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  }),

  /**
   * Delete a book.
   */
  deleteBook: async (id: number | string): Promise<void> => apiRequest(`/books/${id}`, {
    method: 'DELETE',
  }),

  /**
   * Search books by query.
   */
  searchBooks: async (query: string): Promise<Book[]> => apiRequest(`/books/search?q=${encodeURIComponent(query)}`),

  /**
   * Toggle book favorite status.
   */
  toggleFavorite: async (id: number | string): Promise<Book> => apiRequest(`/books/${id}/favorite`, {
    method: 'POST',
  }),
};

// Borrower API functions
export const borrowerAPI = {
  /**
   * Get all borrowers with optional filters.
   */
  getBorrowers: async (filters: SearchFilters = {}): Promise<Borrower[]> => {
    const queryString = buildQueryParams(filters);
    const endpoint = queryString ? `/borrowers?${queryString}` : '/borrowers';
    return apiRequest(endpoint);
  },

  /**
   * Get a single borrower by ID.
   */
  getBorrower: async (id: number | string): Promise<Borrower> => apiRequest(`/borrowers/${id}`),

  /**
   * Create a new borrower.
   */
  createBorrower: async (borrowerData: BorrowerCreateData): Promise<Borrower> => apiRequest('/borrowers', {
    method: 'POST',
    body: JSON.stringify(borrowerData),
  }),

  /**
   * Update an existing borrower.
   */
  updateBorrower: async (id: number | string, borrowerData: BorrowerUpdateData): Promise<Borrower> => apiRequest(`/borrowers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(borrowerData),
  }),

  /**
   * Delete a borrower.
   */
  deleteBorrower: async (id: number | string): Promise<void> => apiRequest(`/borrowers/${id}`, {
    method: 'DELETE',
  }),

  /**
   * Deactivate a borrower.
   */
  deactivateBorrower: async (id: number | string): Promise<Borrower> => apiRequest(`/borrowers/${id}/deactivate`, {
    method: 'POST',
  }),

  /**
   * Activate a borrower.
   */
  activateBorrower: async (id: number | string): Promise<Borrower> => apiRequest(`/borrowers/${id}/activate`, {
    method: 'POST',
  }),
};

// Lending API functions
export const lendingAPI = {
  /**
   * Get all lending records with optional filters.
   */
  getLendingRecords: async (filters: SearchFilters = {}): Promise<LendingRecord[]> => {
    const queryString = buildQueryParams(filters);
    const endpoint = queryString ? `/lending?${queryString}` : '/lending';
    return apiRequest(endpoint);
  },

  /**
   * Create a new lending record (lend a book).
   */
  lendBook: async (lendingData: LendingCreateData): Promise<LendingRecord> => apiRequest('/lending', {
    method: 'POST',
    body: JSON.stringify(lendingData),
  }),

  /**
   * Return a book.
   */
  returnBook: async (recordId: number | string, returnData: Record<string, any> = {}): Promise<LendingRecord> => apiRequest(`/lending/${recordId}/return`, {
    method: 'POST',
    body: JSON.stringify(returnData),
  }),

  /**
   * Extend due date for a lending record.
   */
  extendDueDate: async (recordId: number | string, newDueDate: string): Promise<LendingRecord> => apiRequest(`/lending/${recordId}/extend`, {
    method: 'POST',
    body: JSON.stringify({ due_date: newDueDate }),
  }),

  /**
   * Mark a book as lost.
   */
  markBookLost: async (recordId: number | string): Promise<LendingRecord> => apiRequest(`/lending/${recordId}/mark-lost`, {
    method: 'POST',
  }),

  /**
   * Get overdue books.
   */
  getOverdueBooks: async (): Promise<LendingRecord[]> => apiRequest('/lending/overdue'),

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
