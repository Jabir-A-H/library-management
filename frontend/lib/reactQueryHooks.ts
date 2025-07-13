import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { borrowerAPI, lendingAPI, bookAPI } from './api';
import type { Borrower, BorrowerCreate, BorrowerUpdate, BorrowerSearchFilters } from '@/types/Borrower';
import type { Book, BookSearchFilters } from '@/types/Book';
import type { LendingRecord, LendingCreate, LendingSearchFilters } from '@/types/Lending';

// --- Borrower hooks ---

// Fetch all borrowers
export function useBorrowers(filters: BorrowerSearchFilters = {}) {
  return useQuery<Borrower[]>({
    queryKey: ['borrowers', filters],
    queryFn: () => borrowerAPI.getBorrowers(filters),
  });
}

// Fetch a single borrower
export function useBorrower(id: string | number) {
  return useQuery<Borrower>({
    queryKey: ['borrowers', id],
    queryFn: () => borrowerAPI.getBorrower(id),
    enabled: !!id,
  });
}

// Add a new borrower
export function useAddBorrower() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (borrower: BorrowerCreate) => borrowerAPI.createBorrower(borrower),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] });
    },
  });
}

// Update a borrower
export function useUpdateBorrower() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: BorrowerUpdate }) => 
      borrowerAPI.updateBorrower(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] });
    },
  });
}

// Delete a borrower
export function useDeleteBorrower() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (borrowerId: number) => borrowerAPI.deleteBorrower(borrowerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] });
    },
  });
}

// --- Book hooks ---

// Fetch all books
export function useBooks(filters: BookSearchFilters = {}) {
  return useQuery<Book[]>({
    queryKey: ['books', filters],
    queryFn: () => bookAPI.getBooks(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
  });
}

// Fetch a single book
export function useBook(id: string | number) {
  return useQuery<Book>({
    queryKey: ['books', id],
    queryFn: () => bookAPI.getBook(id),
    enabled: !!id,
  });
}

// Add a new book
export function useAddBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => bookAPI.createBook(book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

// Update a book
export function useUpdateBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (book: Book) => bookAPI.updateBook(book.id, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

// Delete a book
export function useDeleteBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookId: number) => bookAPI.deleteBook(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

// --- Lending hooks ---

// Fetch lending records
export function useLendingRecords(filters: LendingSearchFilters = {}) {
  return useQuery<LendingRecord[]>({
    queryKey: ['lending', filters],
    queryFn: () => lendingAPI.getLendingRecords(filters),
  });
}

// Create a new lending record
export function useCreateLending() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lending: LendingCreate) => lendingAPI.lendBook(lending),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lending'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrowers'] });
    },
  });
}

// Return a book
export function useReturnBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recordId, returnData }: { recordId: number; returnData?: Record<string, any> }) => 
      lendingAPI.returnBook(recordId, returnData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lending'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrowers'] });
    },
  });
}

// Extend due date
export function useExtendDueDate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ recordId, newDueDate }: { recordId: number; newDueDate: string }) => 
      lendingAPI.extendDueDate(recordId, newDueDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lending'] });
    },
  });
}
