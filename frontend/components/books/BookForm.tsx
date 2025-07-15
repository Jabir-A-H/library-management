import type { Book } from '@/types/Book';
import { useAddBook, useUpdateBook } from '@/lib/reactQueryHooks';
import { useState, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { imageUtils } from '@/lib/imageUtils';
import type { ChangeEvent } from 'react';
import * as React from 'react';

/**
 * Props for the BookForm component
 */
interface BookFormProps {
  /** Book to edit (if editing), null/undefined for creating new book */
  book?: Book | null;
  /** Callback when book is successfully saved */
  onSave: (bookData: Partial<Book>) => void;
  /** Callback when form is cancelled or closed */
  onCancel: () => void;
  /** Whether the form modal is open */
  isOpen: boolean;
}

/**
 * Internal form data interface - uses strings for all inputs to simplify form handling
 */
interface FormData {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  category: string;
  publication_year: string;
  page_count: string;
  description: string;
  tags: string[];
  cover_image: string | null;
  preview_images: string[];
  read_status: string;
  rating: string;
  total_copies: string;
  available_copies: string;
  room: string;
  shelf: string;
  column_location: string;
  row_location: string;
  location_comment: string;
  publisher: string;
  language: string;
  comments: string;
}

/**
 * Form validation errors
 */
interface FormErrors {
  title?: string;
  author?: string;
  isbn?: string;
  publication_year?: string;
  page_count?: string;
  rating?: string;
  total_copies?: string;
  available_copies?: string;
  general?: string;
}

/**
 * Preview image data structure
 */
interface PreviewImageData {
  id: string;
  data: string;
  file?: File;
}

/**
 * Category options that align with the backend categories
 */
const CATEGORY_OPTIONS = [
  'Political',
  'Language Movement',
  'Story',
  'Novel',
  'Poem',
  'Science',
  'Literature',
  'History',
  'Biography',
  'Children',
  'Technology',
  'Philosophy',
  'Religion',
  'Reference',
  'Other',
] as const;

/**
 * Reading status options matching backend enum
 */
const READ_STATUS_OPTIONS = [
  'unread',
  'reading',
  'completed',
  'on_hold',
  'dropped',
  'plan_to_read',
] as const;

/**
 * Language options for books
 */
const LANGUAGE_OPTIONS = [
  'English',
  'Bengali',
  'Hindi',
  'Urdu',
  'Arabic',
  'Other',
] as const;

/**
 * CategorySelect component for choosing or entering a custom book category
 */
interface CategorySelectProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

function CategorySelect({ value, onChange, error }: CategorySelectProps) {
  const [custom, setCustom] = useState<string>('');

  const handleCustomSubmit = useCallback(() => {
    if (custom.trim()) {
      onChange(custom.trim());
      setCustom('');
    }
  }, [custom, onChange]);

  return (
    <div className="space-y-2">
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder="Select or type category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORY_OPTIONS.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
          {custom && <SelectItem value={custom}>{custom}</SelectItem>}
        </SelectContent>
      </Select>
      <Input
        placeholder="Or type a custom category"
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        onBlur={handleCustomSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleCustomSubmit();
          }
        }}
        aria-label="Custom category input"
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

/**
 * TagInput component for entering multiple tags as chips
 */
interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  error?: string;
}

function TagInput({ tags, setTags, error }: TagInputProps) {
  const [input, setInput] = useState<string>('');

  const addTag = useCallback(
    (tag: string) => {
      const trimmedTag = tag.trim();
      if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
      }
    },
    [tags, setTags]
  );

  const removeTag = useCallback(
    (index: number) => {
      setTags(tags.filter((_, i) => i !== index));
    },
    [tags, setTags]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
        e.preventDefault();
        addTag(input);
        setInput('');
      } else if (e.key === 'Backspace' && !input && tags.length) {
        e.preventDefault();
        setTags(tags.slice(0, -1));
      }
    },
    [input, tags, addTag, setTags]
  );

  return (
    <div className="space-y-2">
      <div
        className={`flex flex-wrap gap-2 border rounded-md px-2 py-1 bg-background min-h-[2.5rem] ${
          error ? 'border-red-500' : ''
        }`}
      >
        {tags.map((tag: string, idx: number) => (
          <Badge
            key={idx}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="ml-1 hover:text-red-500 focus:outline-none"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          className="flex-1 min-w-[120px] border-none outline-none bg-transparent"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type and press Enter or ,"
          aria-label="Add tag"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

/**
 * ReadStatusSelect component for selecting the reading status of a book
 */
interface ReadStatusSelectProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

function ReadStatusSelect({ value, onChange, error }: ReadStatusSelectProps) {
  return (
    <div className="space-y-2">
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder="Select read status" />
        </SelectTrigger>
        <SelectContent>
          {READ_STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

/**
 * Creates a new book template with default values matching the backend schema
 */
function createBookTemplate(): FormData {
  return {
    title: '',
    author: '',
    isbn: '',
    genre: '',
    category: '',
    publication_year: '',
    page_count: '',
    description: '',
    tags: [],
    cover_image: null,
    preview_images: [],
    read_status: 'unread',
    rating: '',
    total_copies: '1',
    available_copies: '1',
    room: '',
    shelf: '',
    column_location: '',
    row_location: '',
    location_comment: '',
    publisher: '',
    language: 'English',
    comments: '',
  };
}

/**
 * Language selection component
 */
interface LanguageSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_OPTIONS.map((language) => (
          <SelectItem key={language} value={language}>
            {language}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

/**
 * BookForm component for adding or editing books with comprehensive validation and error handling
 */
function BookForm({ book, onSave, onCancel, isOpen }: BookFormProps) {
  const [formData, setFormData] = useState<FormData>(createBookTemplate());
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );
  const [previewImages, setPreviewImages] = useState<PreviewImageData[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBook = useAddBook();
  const updateBook = useUpdateBook();
  const isEdit = Boolean(book?.id);

  /**
   * Initialize form data when book prop changes
   */
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        genre: book.genre || '',
        category:
          typeof book.category === 'string'
            ? book.category
            : book.category?.name || '',
        publication_year: book.publication_year
          ? String(book.publication_year)
          : '',
        page_count: book.page_count ? String(book.page_count) : '',
        description: book.description || '',
        tags: Array.isArray(book.tags)
          ? book.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name))
          : [],
        cover_image: book.cover_image || null,
        preview_images: book.preview_images || [],
        read_status: book.read_status || 'unread',
        rating: book.rating ? String(book.rating) : '',
        total_copies: book.total_copies ? String(book.total_copies) : '1',
        available_copies: book.available_copies
          ? String(book.available_copies)
          : '1',
        room: book.room || '',
        shelf: book.shelf || '',
        column_location: book.column_location || '',
        row_location: book.row_location || '',
        location_comment: book.location_comment || '',
        publisher: book.publisher || '',
        language: book.language || 'English',
        comments: book.comments || '',
      });
      setCoverImagePreview(book.cover_image || null);
      setPreviewImages([]);
    } else {
      setFormData(createBookTemplate());
      setCoverImagePreview(null);
      setPreviewImages([]);
    }
    setErrors({});
  }, [book]);

  /**
   * Handle input changes for form fields
   */
  const handleInputChange = useCallback(
    (field: keyof FormData, value: string | string[]) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  /**
   * Validate form data
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Title must be less than 255 characters';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    } else if (formData.author.length > 255) {
      newErrors.author = 'Author must be less than 255 characters';
    }

    // ISBN validation
    if (formData.isbn && formData.isbn.length > 20) {
      newErrors.isbn = 'ISBN must be less than 20 characters';
    }

    // Publication year validation
    if (formData.publication_year) {
      const year = Number(formData.publication_year);
      if (isNaN(year) || year < 0 || year > new Date().getFullYear()) {
        newErrors.publication_year = 'Please enter a valid year';
      }
    }

    // Page count validation
    if (formData.page_count) {
      const pages = Number(formData.page_count);
      if (isNaN(pages) || pages < 1) {
        newErrors.page_count = 'Page count must be a positive number';
      }
    }

    // Rating validation
    if (formData.rating) {
      const rating = Number(formData.rating);
      if (isNaN(rating) || rating < 1 || rating > 5) {
        newErrors.rating = 'Rating must be between 1 and 5';
      }
    }

    // Copies validation
    const totalCopies = Number(formData.total_copies);
    const availableCopies = Number(formData.available_copies);

    if (isNaN(totalCopies) || totalCopies < 1) {
      newErrors.total_copies = 'Total copies must be at least 1';
    }

    if (isNaN(availableCopies) || availableCopies < 0) {
      newErrors.available_copies = 'Available copies cannot be negative';
    }

    if (
      !isNaN(totalCopies) &&
      !isNaN(availableCopies) &&
      availableCopies > totalCopies
    ) {
      newErrors.available_copies =
        'Available copies cannot exceed total copies';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Handle cover image upload
   */
  const handleCoverImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!imageUtils.isValidImageFile(file)) {
        setErrors((prev) => ({
          ...prev,
          general:
            'Please select a valid image file (JPEG, PNG, GIF, WebP) under 5MB',
        }));
        return;
      }

      try {
        const dataURL = await imageUtils.fileToDataURL(file);
        setCoverImagePreview(dataURL as string);
        setFormData((prev) => ({ ...prev, cover_image: dataURL as string }));
        setErrors((prev) => ({ ...prev, general: undefined }));
      } catch (error) {
        console.error('Error uploading cover image:', error);
        setErrors((prev) => ({
          ...prev,
          general: 'Error uploading image. Please try again.',
        }));
      }
    },
    []
  );

  /**
   * Handle multiple preview images upload
   */
  const handlePreviewImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) return;

      const validFiles = files.filter((file) =>
        imageUtils.isValidImageFile(file)
      );
      if (validFiles.length !== files.length) {
        setErrors((prev) => ({
          ...prev,
          general:
            'Some files were skipped. Please select valid image files (JPEG, PNG, GIF, WebP) under 5MB',
        }));
      }

      try {
        const newPreviews: PreviewImageData[] = [];
        for (const file of validFiles) {
          const dataURL = await imageUtils.fileToDataURL(file);
          newPreviews.push({
            id: `preview_${Date.now()}_${Math.random()}`,
            data: dataURL as string,
            file,
          });
        }

        setPreviewImages((prev) => [...prev, ...newPreviews]);
        setFormData((prev) => ({
          ...prev,
          preview_images: [
            ...prev.preview_images,
            ...newPreviews.map((p) => p.data),
          ],
        }));
        setErrors((prev) => ({ ...prev, general: undefined }));
      } catch (error) {
        console.error('Error uploading preview images:', error);
        setErrors((prev) => ({
          ...prev,
          general: 'Error uploading images. Please try again.',
        }));
      }
    },
    []
  );

  /**
   * Remove cover image
   */
  const removeCoverImage = useCallback(() => {
    setCoverImagePreview(null);
    setFormData((prev) => ({ ...prev, cover_image: null }));
  }, []);

  /**
   * Remove a preview image
   */
  const removePreviewImage = useCallback(
    (imageId: string) => {
      setPreviewImages((prev) => prev.filter((img) => img.id !== imageId));
      setFormData((prev) => ({
        ...prev,
        preview_images: prev.preview_images.filter((_, index) => {
          const imgToRemove = previewImages.find((img) => img.id === imageId);
          return imgToRemove
            ? prev.preview_images[index] !== imgToRemove.data
            : true;
        }),
      }));
    },
    [previewImages]
  );

  /**
   * Convert form data to Book format for API
   */
  const toBookFormat = useCallback((data: FormData): Partial<Book> => {
    return {
      title: data.title,
      author: data.author,
      isbn: data.isbn || undefined,
      genre: data.genre || undefined,
      category: data.category || undefined,
      publication_year: data.publication_year
        ? Number(data.publication_year)
        : undefined,
      page_count: data.page_count ? Number(data.page_count) : undefined,
      description: data.description || undefined,
      tags: data.tags,
      cover_image: data.cover_image || undefined,
      preview_images: data.preview_images,
      read_status: data.read_status || undefined,
      rating: data.rating ? Number(data.rating) : undefined,
      total_copies: Number(data.total_copies),
      available_copies: Number(data.available_copies),
      room: data.room || undefined,
      shelf: data.shelf || undefined,
      column_location: data.column_location || undefined,
      row_location: data.row_location || undefined,
      location_comment: data.location_comment || undefined,
      publisher: data.publisher || undefined,
      language: data.language,
      comments: data.comments || undefined,
    };
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!validateForm() || isSubmitting) return;

      setIsSubmitting(true);
      setErrors((prev) => ({ ...prev, general: undefined }));

      try {
        const bookData = toBookFormat(formData);

        if (isEdit && book) {
          await updateBook.mutateAsync({ ...book, ...bookData } as Book);
          onSave(bookData);
        } else {
          const newBook = await addBook.mutateAsync(bookData as any);
          onSave(newBook || bookData);
        }

        onCancel();
      } catch (error: any) {
        console.error('Error saving book:', error);
        setErrors((prev) => ({
          ...prev,
          general: `Error ${isEdit ? 'updating' : 'adding'} book: ${
            error.message || 'Unknown error'
          }`,
        }));
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      validateForm,
      isSubmitting,
      toBookFormat,
      isEdit,
      book,
      updateBook,
      addBook,
      onSave,
      onCancel,
    ]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            {isEdit ? 'Edit Book' : 'Add New Book'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            aria-label="Cancel"
            title="Cancel"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter book title"
                    className={errors.title ? 'border-red-500' : ''}
                    required
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="author" className="text-sm font-medium">
                    Author *
                  </label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      handleInputChange('author', e.target.value)
                    }
                    placeholder="Enter author name"
                    className={errors.author ? 'border-red-500' : ''}
                    required
                  />
                  {errors.author && (
                    <p className="text-sm text-red-500">{errors.author}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="isbn" className="text-sm font-medium">
                    ISBN
                  </label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    placeholder="978-0-123456-78-9"
                    className={errors.isbn ? 'border-red-500' : ''}
                  />
                  {errors.isbn && (
                    <p className="text-sm text-red-500">{errors.isbn}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="publisher" className="text-sm font-medium">
                    Publisher
                  </label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) =>
                      handleInputChange('publisher', e.target.value)
                    }
                    placeholder="Enter publisher name"
                  />
                </div>
              </div>
            </div>

            {/* Classification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Classification
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="genre" className="text-sm font-medium">
                    Genre
                  </label>
                  <Input
                    id="genre"
                    value={formData.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    placeholder="e.g., Fiction, Mystery, Science"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <CategorySelect
                    value={formData.category}
                    onChange={(value) => handleInputChange('category', value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="language" className="text-sm font-medium">
                    Language
                  </label>
                  <LanguageSelect
                    value={formData.language}
                    onChange={(value) => handleInputChange('language', value)}
                  />
                </div>
              </div>
            </div>

            {/* Publication Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Publication Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="publication_year"
                    className="text-sm font-medium"
                  >
                    Publication Year
                  </label>
                  <Input
                    id="publication_year"
                    type="number"
                    value={formData.publication_year}
                    onChange={(e) =>
                      handleInputChange('publication_year', e.target.value)
                    }
                    placeholder="YYYY"
                    min="0"
                    max={new Date().getFullYear()}
                    className={errors.publication_year ? 'border-red-500' : ''}
                  />
                  {errors.publication_year && (
                    <p className="text-sm text-red-500">
                      {errors.publication_year}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="page_count" className="text-sm font-medium">
                    Number of Pages
                  </label>
                  <Input
                    id="page_count"
                    type="number"
                    value={formData.page_count}
                    onChange={(e) =>
                      handleInputChange('page_count', e.target.value)
                    }
                    placeholder="Enter page count"
                    min="1"
                    className={errors.page_count ? 'border-red-500' : ''}
                  />
                  {errors.page_count && (
                    <p className="text-sm text-red-500">{errors.page_count}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="rating" className="text-sm font-medium">
                    Rating (1-5)
                  </label>
                  <Input
                    id="rating"
                    type="number"
                    value={formData.rating}
                    onChange={(e) =>
                      handleInputChange('rating', e.target.value)
                    }
                    placeholder="1-5"
                    min="1"
                    max="5"
                    step="0.1"
                    className={errors.rating ? 'border-red-500' : ''}
                  />
                  {errors.rating && (
                    <p className="text-sm text-red-500">{errors.rating}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Inventory & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Inventory & Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label htmlFor="total_copies" className="text-sm font-medium">
                    Total Copies
                  </label>
                  <Input
                    id="total_copies"
                    type="number"
                    value={formData.total_copies}
                    onChange={(e) =>
                      handleInputChange('total_copies', e.target.value)
                    }
                    placeholder="1"
                    min="1"
                    className={errors.total_copies ? 'border-red-500' : ''}
                  />
                  {errors.total_copies && (
                    <p className="text-sm text-red-500">
                      {errors.total_copies}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="available_copies"
                    className="text-sm font-medium"
                  >
                    Available Copies
                  </label>
                  <Input
                    id="available_copies"
                    type="number"
                    value={formData.available_copies}
                    onChange={(e) =>
                      handleInputChange('available_copies', e.target.value)
                    }
                    placeholder="1"
                    min="0"
                    className={errors.available_copies ? 'border-red-500' : ''}
                  />
                  {errors.available_copies && (
                    <p className="text-sm text-red-500">
                      {errors.available_copies}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="read_status" className="text-sm font-medium">
                    Read Status
                  </label>
                  <ReadStatusSelect
                    value={formData.read_status}
                    onChange={(value) =>
                      handleInputChange('read_status', value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label htmlFor="room" className="text-sm font-medium">
                    Room
                  </label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) => handleInputChange('room', e.target.value)}
                    placeholder="e.g., Main Hall"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="shelf" className="text-sm font-medium">
                    Shelf
                  </label>
                  <Input
                    id="shelf"
                    value={formData.shelf}
                    onChange={(e) => handleInputChange('shelf', e.target.value)}
                    placeholder="e.g., A1, B2"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="column_location"
                    className="text-sm font-medium"
                  >
                    Column
                  </label>
                  <Input
                    id="column_location"
                    value={formData.column_location}
                    onChange={(e) =>
                      handleInputChange('column_location', e.target.value)
                    }
                    placeholder="e.g., 1, 2, 3"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="row_location" className="text-sm font-medium">
                    Row
                  </label>
                  <Input
                    id="row_location"
                    value={formData.row_location}
                    onChange={(e) =>
                      handleInputChange('row_location', e.target.value)
                    }
                    placeholder="e.g., Top, Middle, Bottom"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="location_comment"
                  className="text-sm font-medium"
                >
                  Location Comment
                </label>
                <Input
                  id="location_comment"
                  value={formData.location_comment}
                  onChange={(e) =>
                    handleInputChange('location_comment', e.target.value)
                  }
                  placeholder="Additional location details"
                />
              </div>
            </div>

            {/* Description & Comments */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">
                Description & Comments
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Enter book description or summary"
                    rows={3}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="comments" className="text-sm font-medium">
                    Comments
                  </label>
                  <textarea
                    id="comments"
                    value={formData.comments}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      handleInputChange('comments', e.target.value)
                    }
                    placeholder="Additional notes or comments"
                    rows={2}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Tags</h3>
              <TagInput
                tags={formData.tags}
                setTags={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              />
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Images</h3>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  {coverImagePreview ? (
                    <div className="flex items-start gap-4">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="w-32 h-48 object-cover rounded shadow-lg border"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">
                          Cover image uploaded
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeCoverImage}
                          aria-label="Remove cover image"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a cover image for your book
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label htmlFor="cover-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Image
                          </span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Images */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Preview Images (Optional)
                </label>
                <div className="border-2 border-dashed border-border rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {previewImages.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.data}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removePreviewImage(image.id)}
                          aria-label="Remove preview image"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePreviewImageUpload}
                      className="hidden"
                      id="preview-upload"
                    />
                    <label htmlFor="preview-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Add Preview Images
                        </span>
                      </Button>
                    </label>
                    <p className="text-xs text-muted-foreground mt-2">
                      You can upload multiple images (sample pages, spine, etc.)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {isEdit ? 'Updating...' : 'Adding...'}
                  </>
                ) : isEdit ? (
                  'Update Book'
                ) : (
                  'Add Book'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default BookForm;
