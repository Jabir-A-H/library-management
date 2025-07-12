
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, BookOpen, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


import type { Book } from '../types/Book';
import type { Borrower } from '../types/Borrower';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lendingAPI } from '@/lib/api';

interface LendingFormProps {
  book: Book | null;
  borrowers: Borrower[];
  onSave: (lendingData: any) => void;
  onCancel: () => void;
  isOpen: boolean;
}

function LendingForm({ book, borrowers, onSave, onCancel, isOpen }: LendingFormProps) {
  const queryClient = useQueryClient();
  const lendBookMutation = useMutation({
    mutationFn: (data: any) => lendingAPI.lendBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lending'] });
      onCancel();
    },
    onError: (error: any) => {
      alert('Error lending book: ' + error.message);
    },
  });
  const isSubmitting = lendBookMutation.isPending;
  const [formData, setFormData] = useState<{ borrower_id: string; due_date: string; notes: string }>({
    borrower_id: '',
    due_date: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Returns the default due date (2 weeks from today) in YYYY-MM-DD format.
   */
  const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split('T')[0];
  };


  // Reset form when modal opens
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
   * Handles input changes and clears errors for the field.
   * @param {string} field
   * @param {string} value
   */
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };


  /**
   * Validates the form fields and sets errors if any.
   * @returns {boolean} True if valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.borrower_id) {
      newErrors.borrower_id = 'Please select a borrower';
    }
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    } else {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  /**
   * Handles form submission, validates, and calls onSave.
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const submitData = {
      book_id: book?.id,
      borrower_id: parseInt(formData.borrower_id, 10),
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
      notes: formData.notes?.trim() || null
    };
    lendBookMutation.mutate(submitData);
  };


  // Don't render if not open or no book provided
  if (!isOpen || !book) return null;


  // Only show active borrowers
  const activeBorrowers = borrowers.filter(borrower => borrower.is_active);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-label="Lend Book Modal">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <BookOpen className="h-6 w-6 mr-2" aria-hidden="true" />
            Lend Book
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close lending form"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <div className="p-6">
          {/* Book Information */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Book to Lend:</h3>
            <div className="flex items-start gap-4">
              {book.cover_image && (
                <img
                  src={book.cover_image}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded border"
                />
              )}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{book.title}</h4>
                <p className="text-gray-600 dark:text-gray-300">by {book.author}</p>
                {book.shelf && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Location: {book.room && `${book.room}, `}Shelf {book.shelf}{book.row && `, Row ${book.row}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Borrower Selection */}
            <div className="space-y-2">
              <Label htmlFor="borrower" className="flex items-center">
                <User className="h-4 w-4 mr-2" aria-hidden="true" />
                Borrower *
              </Label>
              <Select value={formData.borrower_id} onValueChange={(value) => handleInputChange('borrower_id', value)}>
                <SelectTrigger className={errors.borrower_id ? 'border-red-500' : ''} id="borrower">
                  <SelectValue placeholder="Select who is borrowing this book" />
                </SelectTrigger>
                <SelectContent>
                  {activeBorrowers.map(borrower => (
                    <SelectItem key={borrower.id} value={borrower.id.toString()}>
                      <div className="flex flex-col">
                        <span>{borrower.name}</span>
                        {borrower.relationship && (
                          <span className="text-sm text-gray-500">{borrower.relationship}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.borrower_id && <p className="text-red-500 text-sm">{errors.borrower_id}</p>}
              {activeBorrowers.length === 0 && (
                <p className="text-amber-600 dark:text-amber-400 text-sm">
                  No active borrowers found. Please add borrowers first.
                </p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="due_date" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                Due Date *
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                className={errors.due_date ? 'border-red-500' : ''}
                aria-invalid={!!errors.due_date}
                aria-describedby={errors.due_date ? 'due-date-error' : undefined}
              />
              {errors.due_date && <p id="due-date-error" className="text-red-500 text-sm">{errors.due_date}</p>}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Default is 2 weeks from today. You can change this as needed.
              </p>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any special notes about this lending (e.g., condition, special instructions)"
                rows={3}
              />
            </div>

            {/* Quick Due Date Presets */}
            <div className="space-y-2">
              <Label>Quick Due Date Presets:</Label>
              <div className="flex flex-wrap gap-2">
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
                    onClick={() => {
                      const date = new Date();
                      date.setDate(date.getDate() + preset.days);
                      handleInputChange('due_date', date.toISOString().split('T')[0]);
                    }}
                    className="text-xs"
                    aria-label={`Set due date to ${preset.label}`}
                  >
                    <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                aria-label="Cancel lending"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || activeBorrowers.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                aria-label="Lend book"
              >
                {isSubmitting ? 'Lending...' : 'Lend Book'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LendingForm;

