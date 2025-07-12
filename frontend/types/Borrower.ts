export interface Borrower {
  id: number;
  name: string;
  relationship?: string;
  contact_info?: string;
  notes?: string;
  is_active: boolean;
  current_books_count?: number;
}
