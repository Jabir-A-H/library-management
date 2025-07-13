
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { Book } from '@/types/Book';
import type { Borrower } from '@/types/Borrower';
import type { LendingCreate } from '@/types/Lending';
import { useCreateLending } from '@/lib/reactQueryHooks';

/**
 * Props for the LendingForm component
 */
interface LendingFormProps {
  /** Book to be lent */
  book: Book | null;
  /** List of available borrowers */
  borrowers: Borrower[];
  /** Callback when lending is successful */
  onSave: (lendingData: LendingCreate) => void;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Whether the form modal is open */
  isOpen: boolean;
}

/**
 * Form validation errors
 */
interface FormErrors {
  borrower_id?: string;
  due_date?: string;
  [key: string]: string | undefined;
}

/**
 * Form data structure matching backend requirements
 */
interface FormData {
  borrower_id: string;
  due_date: string;
  notes: string;
}

/**
 * LendingForm component for lending books to borrowers
 * Matches the backend SQLAlchemy model structure with proper field mapping
 */
function LendingForm({ book, borrowers, onSave, onCancel, isOpen }: LendingFormProps) {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    borrower_id: '',
    due_date: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  // React Query hook for creating lending records
  const createLending = useCreateLending();
  const isSubmitting = createLending.isPending;

  /**
   * Calculate default due date (2 weeks from today)
   */
  const getDefaultDueDate = (): string => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };

  /**
   * Reset form when modal opens
   */
  useEffect(() => {
    if (isOpen) {
      setFormData({
        borrower_id: '',
        due_date: getDefaultDueDate(),
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  /**
   * Handle input changes with proper typing
   */
  const handleInputChange = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  /**
   * Validate form fields according to backend requirements
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Borrower validation
    if (!formData.borrower_id) {
      newErrors.borrower_id = 'Please select a borrower';
    }
    
    // Due date validation
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    } else {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
      
      // Check if due date is too far in the future (e.g., more than 1 year)
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 1);
      if (dueDate > maxDate) {
        newErrors.due_date = 'Due date cannot be more than 1 year from today';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission with proper error handling
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !book) {
      return;
    }

    try {
      const submitData: LendingCreate = {
        book_id: book.id,
        borrower_id: parseInt(formData.borrower_id, 10),
        due_date: formData.due_date,
        notes: formData.notes.trim() || undefined
      };

      createLending.mutate(submitData, {
        onSuccess: (newLending) => {
          onSave(submitData);
          onCancel();
        },
        onError: (error: any) => {
          console.error('Error lending book:', error);
          
          // Handle specific error cases
          let errorMessage = 'An unexpected error occurred. Please try again.';
          if (error.message) {
            if (error.message.includes('not available')) {
              errorMessage = 'This book is not available for lending.';
            } else if (error.message.includes('borrower')) {
              errorMessage = 'Invalid borrower selected.';
            } else {
              errorMessage = error.message;
            }
          }
          
          alert(`Error lending book: ${errorMessage}`);
        },
      });
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  /**
   * Set due date preset
   */
  const setDueDatePreset = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    handleInputChange('due_date', date.toISOString().split('T')[0]);
  };

  // Don't render if not open or no book provided
  if (!isOpen || !book) return null;

  // Filter active borrowers (use multiple criteria for robustness)
  const availableBorrowers = borrowers.filter(borrower => {
    // Check both current schema and legacy schema
    const isActive = borrower.is_active !== false; // Default to true if undefined
    const hasName = (borrower.first_name && borrower.last_name) || borrower.name;
    return isActive && hasName;
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="lending-form-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 
            id="lending-form-title"
            className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"
          >
            <BookOpen className="h-6 w-6 mr-2" aria-hidden="true" />
            Lend Book
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close lending form"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="p-6">
          {/* Book Information Section */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Book to Lend
            </h3>
            <div className="flex items-start gap-4">
              {(book.cover_image || book.coverImage) && (
                <img
                  src={book.cover_image || book.coverImage}
                  alt={`Cover of ${book.title}`}
                  className="w-16 h-20 object-cover rounded border shadow-sm"
                />
              )}
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white text-lg">
                  {book.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  by {book.author}
                </p>
                {book.isbn && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    ISBN: {book.isbn}
                  </p>
                )}
                
                {/* Location information */}
                {(book.room || book.shelf || book.column_location) && (
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">Location: </span>
                    {book.room && `${book.room}, `}
                    {book.shelf && `Shelf ${book.shelf}`}
                    {book.column_location && `, Column ${book.column_location}`}
                    {book.row_location && `, Row ${book.row_location}`}
                  </div>
                )}
                
                {/* Availability status */}
                <div className="mt-2 flex items-center">
                  {book.is_available !== false ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Not Available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Borrower Selection */}
            <div className="space-y-2">
              <label htmlFor="borrower" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <User className="h-4 w-4 mr-2" aria-hidden="true" />
                Select Borrower *
              </label>
              <Select 
                value={formData.borrower_id} 
                onValueChange={(value) => handleInputChange('borrower_id', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger 
                  className={errors.borrower_id ? 'border-red-500 focus:border-red-500' : ''} 
                  id="borrower"
                >
                  <SelectValue placeholder="Choose who is borrowing this book" />
                </SelectTrigger>
                <SelectContent>
                  {availableBorrowers.map(borrower => (
                    <SelectItem key={borrower.id} value={borrower.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {borrower.full_name || borrower.name || `${borrower.first_name} ${borrower.last_name}`.trim()}
                        </span>
                        {borrower.relationship && (
                          <span className="text-sm text-gray-500">{borrower.relationship}</span>
                        )}
                        {borrower.current_books_count !== undefined && borrower.current_books_count > 0 && (
                          <span className="text-xs text-blue-600">
                            Currently has {borrower.current_books_count} book(s)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.borrower_id && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.borrower_id}
                </p>
              )}
              {availableBorrowers.length === 0 && (
                <p className="text-amber-600 dark:text-amber-400 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  No active borrowers found. Please add borrowers first.
                </p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                Due Date *
              </label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                className={errors.due_date ? 'border-red-500 focus:border-red-500' : ''}
                aria-invalid={!!errors.due_date}
                aria-describedby={errors.due_date ? 'due-date-error' : 'due-date-help'}
                disabled={isSubmitting}
                required
              />
              {errors.due_date && (
                <p id="due-date-error" className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.due_date}
                </p>
              )}
              <p id="due-date-help" className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Default is 2 weeks from today. You can adjust as needed.
              </p>
            </div>

            {/* Quick Due Date Presets */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Due Date Presets
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: '1 Week', days: 7 },
                  { label: '2 Weeks', days: 14 },
                  { label: '1 Month', days: 30 },
                  { label: '2 Months', days: 60 }
                ].map(preset => (
                  <Button
                    key={preset.days}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDueDatePreset(preset.days)}
                    className="text-xs flex items-center justify-center"
                    aria-label={`Set due date to ${preset.label}`}
                    disabled={isSubmitting}
                  >
                    <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('notes', e.target.value)}
                placeholder="Any special notes about this lending (e.g., condition, special instructions, return reminders)"
                rows={3}
                disabled={isSubmitting}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                These notes will be visible when viewing the lending record.
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="min-w-24"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || availableBorrowers.length === 0 || book.is_available === false}
                className="bg-blue-600 hover:bg-blue-700 text-white min-w-24"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Lending...
                  </span>
                ) : (
                  'Lend Book'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LendingForm;

