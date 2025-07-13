import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { borrowerAPI, lendingAPI, bookAPI } from './api';
import type { Borrower } from '@/types/Borrower';
import type { Book } from '@/types/Book';

// --- Borrower hooks ---

// Fetch all borrowers
export function useBorrowers(activeOnly = true) {
  return useQuery<Borrower[]>({
    queryKey: ['borrowers', { activeOnly }],
    queryFn: () => borrowerAPI.getBorrowers({}), // Pass empty object instead of boolean
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
    mutationFn: (borrower: Omit<Borrower, 'id'>) => borrowerAPI.createBorrower(borrower),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowers'] });
    },
  });
}

// Update a borrower
export function useUpdateBorrower() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (borrower: Borrower) => borrowerAPI.updateBorrower(borrower.id, borrower),
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
export function useBooks() {
  return useQuery<Book[]>({
    queryKey: ['books'],
    queryFn: () => bookAPI.getBooks(),
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
export function useLendingRecords() {
  return useQuery({
    queryKey: ['lending'],
    queryFn: () => lendingAPI.getLendingRecords(),
  });
}

// Create a new lending record
export function useCreateLending() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lending: any) => lendingAPI.lendBook(lending),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lending'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

// Return a book
export function useReturnBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lendingId: number) => lendingAPI.returnBook(lendingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lending'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}
