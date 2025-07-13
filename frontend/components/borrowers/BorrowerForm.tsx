import { useState, useEffect } from 'react';
import { X, User, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import type { Borrower, BorrowerCreate, BorrowerUpdate } from '@/types/Borrower';
import { useAddBorrower, useUpdateBorrower } from '@/lib/reactQueryHooks';

/**
 * Props for the BorrowerForm component
 */
interface BorrowerFormProps {
  /** Existing borrower data for edit mode */
  borrower?: Borrower | null;
  /** Callback when form is saved successfully */
  onSave: (borrowerData: Borrower) => void;
  /** Callback when form is cancelled */
  onCancel: () => void;
  /** Whether the form modal is open */
  isOpen: boolean;
}

/**
 * Form validation errors
 */
interface FormErrors {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  [key: string]: string | undefined;
}

/**
 * BorrowerForm component for adding and editing borrowers
 * Matches the backend SQLAlchemy model structure with proper field mapping
 */
function BorrowerForm({ borrower, onSave, onCancel, isOpen }: BorrowerFormProps) {
  // Form state using backend field names
  const [formData, setFormData] = useState<BorrowerCreate>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    address_bn: '',
    relationship: '',
    comments: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  // React Query hooks
  const addBorrower = useAddBorrower();
  const updateBorrower = useUpdateBorrower();
  
  const isEdit = !!borrower;
  const isSubmitting = addBorrower.isPending || updateBorrower.isPending;

  // Relationship options based on common library borrower relationships
  const relationshipOptions = [
    'Family Member',
    'Friend',
    'Cousin',
    'Colleague',
    'Neighbor',
    'Classmate',
    'Student',
    'Teacher',
    'Relative',
    'Other',
  ];

  /**
   * Initialize form data when borrower or modal state changes
   */
  useEffect(() => {
    if (borrower && isOpen) {
      setFormData({
        first_name: borrower.first_name || '',
        last_name: borrower.last_name || '',
        email: borrower.email || '',
        phone: borrower.phone || '',
        address: borrower.address || '',
        address_bn: borrower.address_bn || '',
        relationship: borrower.relationship || '',
        comments: borrower.comments || borrower.notes || '', // Handle legacy field
      });
    } else if (isOpen) {
      // Reset form for new borrower
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        address_bn: '',
        relationship: '',
        comments: '',
      });
    }
    setErrors({});
  }, [borrower, isOpen]);

  /**
   * Handle input changes with proper typing
   */
  const handleInputChange = <K extends keyof BorrowerCreate>(
    field: K,
    value: BorrowerCreate[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  /**
   * Validate form fields according to backend requirements
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Required fields validation
    if (!formData.first_name?.trim()) {
      newErrors.first_name = 'First name is required';
    } else if (formData.first_name.length > 100) {
      newErrors.first_name = 'First name must be less than 100 characters';
    }
    
    if (!formData.last_name?.trim()) {
      newErrors.last_name = 'Last name is required';
    } else if (formData.last_name.length > 100) {
      newErrors.last_name = 'Last name must be less than 100 characters';
    }
    
    // Email validation (optional but must be valid if provided)
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      } else if (formData.email.length > 100) {
        newErrors.email = 'Email must be less than 100 characters';
      }
    }
    
    // Phone validation (optional but must be valid if provided)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number';
      } else if (formData.phone.length > 20) {
        newErrors.phone = 'Phone number must be less than 20 characters';
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
    
    if (!validateForm()) {
      return;
    }

    try {
      if (isEdit && borrower) {
        // Update existing borrower
        const updateData: BorrowerUpdate = {
          ...formData,
          // Only include changed fields
        };
        
        updateBorrower.mutate(
          { id: borrower.id, data: updateData },
          {
            onSuccess: (updatedBorrower) => {
              onSave(updatedBorrower);
              onCancel();
            },
            onError: (error: any) => {
              console.error('Error updating borrower:', error);
              alert(`Error updating borrower: ${error.message || 'Unknown error'}`);
            },
          }
        );
      } else {
        // Create new borrower
        addBorrower.mutate(formData, {
          onSuccess: (newBorrower) => {
            onSave(newBorrower);
            onCancel();
          },
          onError: (error: any) => {
            console.error('Error adding borrower:', error);
            alert(`Error adding borrower: ${error.message || 'Unknown error'}`);
          },
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <User className="h-6 w-6 mr-2" />
            {isEdit ? 'Edit Borrower' : 'Add New Borrower'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close form"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name *
                </label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={e => handleInputChange('first_name', e.target.value)}
                  placeholder="Enter first name"
                  className={errors.first_name ? 'border-red-500 focus:border-red-500' : ''}
                  aria-invalid={!!errors.first_name}
                  disabled={isSubmitting}
                  required
                />
                {errors.first_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name *
                </label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={e => handleInputChange('last_name', e.target.value)}
                  placeholder="Enter last name"
                  className={errors.last_name ? 'border-red-500 focus:border-red-500' : ''}
                  aria-invalid={!!errors.last_name}
                  disabled={isSubmitting}
                  required
                />
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Relationship */}
            <div className="space-y-2">
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Relationship
              </label>
              <Select 
                value={formData.relationship || ''} 
                onValueChange={value => handleInputChange('relationship', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship type" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipOptions.map(relationship => (
                    <SelectItem key={relationship} value={relationship}>
                      {relationship}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                  aria-invalid={!!errors.email}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
                  aria-invalid={!!errors.phone}
                  disabled={isSubmitting}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Address Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Address (English) */}
              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address (English)
                </label>
                <Textarea
                  id="address"
                  value={formData.address || ''}
                  onChange={e => handleInputChange('address', e.target.value)}
                  placeholder="Enter address in English"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              {/* Address (Bengali) */}
              <div className="space-y-2">
                <label htmlFor="address_bn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address (বাংলা)
                </label>
                <Textarea
                  id="address_bn"
                  value={formData.address_bn || ''}
                  onChange={e => handleInputChange('address_bn', e.target.value)}
                  placeholder="ঠিকানা বাংলায় লিখুন"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Additional Information
            </h3>
            
            {/* Comments */}
            <div className="space-y-2">
              <label htmlFor="comments" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Comments & Notes
              </label>
              <Textarea
                id="comments"
                value={formData.comments || ''}
                onChange={e => handleInputChange('comments', e.target.value)}
                placeholder="Any additional notes about this borrower..."
                rows={4}
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Optional notes for internal reference (not visible to the borrower)
              </p>
            </div>
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
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-24"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </span>
              ) : (
                isEdit ? 'Update Borrower' : 'Add Borrower'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BorrowerForm;

