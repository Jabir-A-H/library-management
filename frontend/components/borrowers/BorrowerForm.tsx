import { useState, useEffect } from 'react';
import { X, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


import type { Borrower } from '@/types/Borrower';
import { useAddBorrower, useUpdateBorrower } from '@/lib/reactQueryHooks';

interface BorrowerFormProps {
  borrower?: Borrower | null;
  onSave: (borrowerData: Partial<Borrower>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

function BorrowerForm({ borrower, onSave, onCancel, isOpen }: BorrowerFormProps) {
  const [formData, setFormData] = useState<Partial<Borrower>>({
    name: '',
    relationship: '',
    contact_info: '',
    notes: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({});
  const addBorrower = useAddBorrower();
  const updateBorrower = useUpdateBorrower();
  const isEdit = !!borrower;
  const isSubmitting = addBorrower.isPending || updateBorrower.isPending;

  // Relationship options
  const relationshipOptions = [
    'Family',
    'Friend',
    'Cousin',
    'Colleague',
    'Neighbor',
    'Classmate',
    'Other',
  ];

  // Initialize form data when borrower or modal open state changes
  useEffect(() => {
    if (borrower) {
      setFormData({
        name: borrower.name || '',
        relationship: borrower.relationship || '',
        contact_info: borrower.contact_info || '',
        notes: borrower.notes || '',
        is_active: borrower.is_active !== undefined ? borrower.is_active : true,
      });
    } else {
      setFormData({
        name: '',
        relationship: '',
        contact_info: '',
        notes: '',
        is_active: true,
      });
    }
    setErrors({});
  }, [borrower, isOpen]);

  // Handle input changes for all fields
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isEdit && borrower) {
      updateBorrower.mutate({ ...borrower, ...formData }, {
        onSuccess: () => onCancel(),
        onError: (error: any) => alert('Error updating borrower: ' + error.message),
      });
    } else {
      addBorrower.mutate(formData, {
        onSuccess: () => onCancel(),
        onError: (error: any) => alert('Error adding borrower: ' + error.message),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <User className="h-6 w-6 mr-2" />
            {borrower ? 'Edit Borrower' : 'Add New Borrower'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Cancel"
            title="Cancel"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Enter borrower's name"
                className={errors.name ? 'border-red-500' : ''}
                aria-invalid={!!errors.name}
                required
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select value={formData.relationship} onValueChange={value => handleInputChange('relationship', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipOptions.map(relationship => (
                    <SelectItem key={relationship} value={relationship}>{relationship}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2">
            <Label htmlFor="contact_info" className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Contact Information
            </Label>
            <Input
              id="contact_info"
              value={formData.contact_info}
              onChange={e => handleInputChange('contact_info', e.target.value)}
              placeholder="Phone number, email, or other contact details"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
              placeholder="Any additional notes about this borrower"
              rows={3}
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={e => handleInputChange('is_active', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="is_active">Active borrower</Label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (Inactive borrowers won't appear in lending forms)
            </span>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              aria-label="Cancel"
              title="Cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              aria-label={isSubmitting ? 'Saving...' : (borrower ? 'Update Borrower' : 'Add Borrower')}
              title={isSubmitting ? 'Saving...' : (borrower ? 'Update Borrower' : 'Add Borrower')}
            >
              {isSubmitting ? 'Saving...' : (borrower ? 'Update Borrower' : 'Add Borrower')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BorrowerForm;

