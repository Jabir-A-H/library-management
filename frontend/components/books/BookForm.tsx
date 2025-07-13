import type { Book } from '@/types/Book';
import { useAddBook, useUpdateBook } from '@/lib/reactQueryHooks';
import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { imageUtils } from '@/lib/imageUtils';

interface BookFormProps {
  book?: Book | null;
  onSave: (bookData: Partial<Book>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

interface FormData {
  title: string;
  author: string;
  genre: string;
  category: string;
  publicationYear: string;
  numPages: string;
  description: string;
  tags: string[];
  coverImage: string | null;
  previewImages: string[];
  isFavorite: boolean;
  status: string;
  readStatus: string;
}

interface FormErrors {
  title?: string;
  author?: string;
  publicationYear?: string;
}


/**
 * CategorySelect component for choosing or entering a custom book category.
 * @param {{ value: string, onChange: (val: string) => void }} props
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
  'Other',
];
interface CategorySelectProps {
  value: string;
  onChange: (val: string) => void;
}

function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [custom, setCustom] = useState<string>('');
  return (
    <div>
      <Select value={value || ''} onValueChange={(val: string) => onChange(val)}>
        <SelectTrigger>
          <SelectValue placeholder="Select or type category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORY_OPTIONS.map(opt => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
          {custom && <SelectItem value={custom}>{custom}</SelectItem>}
        </SelectContent>
      </Select>
      <Input
        className="mt-2"
        placeholder="Or type a custom category"
        value={custom}
        onChange={e => setCustom(e.target.value)}
        onBlur={() => custom && onChange(custom)}
        onKeyDown={e => {
          if (e.key === 'Enter' && custom) {
            onChange(custom);
            e.preventDefault();
          }
        }}
        aria-label="Custom category input"
      />
    </div>
  );
}

/**
 * TagInput component for entering multiple tags as chips.
 */
interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
}

function TagInput({ tags, setTags }: TagInputProps) {
  const [input, setInput] = useState<string>('');
  const addTag = (tag: string) => {
    tag = tag.trim();
    if (tag && !tags.includes(tag)) setTags([...tags, tag]);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      addTag(input);
      setInput('');
      e.preventDefault();
    } else if (e.key === 'Backspace' && !input && tags.length) {
      setTags(tags.slice(0, -1));
    }
  };
  return (
    <div className="flex flex-wrap gap-2 border rounded-md px-2 py-1 bg-background">
      {tags.map((tag: string, idx: number) => (
        <Badge key={idx} variant="secondary" className="flex items-center gap-1">
          {tag}
          <button type="button" onClick={() => setTags(tags.filter((t: string, i: number) => i !== idx))} className="ml-1 hover:text-red-500" aria-label={`Remove tag ${tag}`}> <X className="h-3 w-3" /> </button>
        </Badge>
      ))}
      <input
        className="flex-1 min-w-[120px] border-none outline-none bg-transparent"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter or ,"
        aria-label="Add tag"
      />
    </div>
  );
}

/**
 * ReadStatusSelect component for selecting the reading status of a book.
 */
const READ_STATUS_OPTIONS = [
  'Not Started',
  'Reading',
  'Completed',
  'On Hold',
  'Dropped',
  'Plan to Read',
];

interface ReadStatusSelectProps {
  value: string;
  onChange: (val: string) => void;
}

function ReadStatusSelect({ value, onChange }: ReadStatusSelectProps) {
  return (
    <Select value={value || ''} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select read status" />
      </SelectTrigger>
      <SelectContent>
        {READ_STATUS_OPTIONS.map(opt => (
          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/**
 * Returns a new book template object with default values.
 * This is a local fallback if not provided by storage.js.
 * @returns {object}
 */
function createBookTemplate() {
  return {
    title: '',
    author: '',
    genre: '',
    category: '',
    publicationYear: '',
    numPages: '',
    description: '',
    tags: [],
    coverImage: null,
    previewImages: [],
    isFavorite: false,
    status: 'available',
    readStatus: 'Not Started',
  };
}


/**
 * BookForm component for adding or editing a book, including cover, preview images, and tags.
 */
function BookForm({ book, onSave, onCancel, isOpen }: BookFormProps) {
  const [formData, setFormData] = useState<FormData>(createBookTemplate());
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);
  const [previewImages, setPreviewImages] = useState<Array<{id: string, data: string}>>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const addBook = useAddBook();
  const updateBook = useUpdateBook();
  const isEdit = !!book;
  const isSubmitting = addBook.isPending || updateBook.isPending;

  // Initialize form data and images when book prop changes
  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        genre: book.genre || '',
        category: book.category || '',
        publicationYear: book.publicationYear ? String(book.publicationYear) : '',
        numPages: book.numPages ? String(book.numPages) : '',
        description: book.description || '',
        tags: book.tags || [],
        coverImage: book.coverImage || null,
        previewImages: book.previewImages || [],
        isFavorite: book.isFavorite || false,
        status: book.status || 'available',
        readStatus: book.readStatus || 'Not Started',
      });
      // TODO: Load cover image and preview images from backend if/when supported
      setCoverImagePreview(null);
      setPreviewImages([]);
    } else {
      setFormData(createBookTemplate());
      setCoverImagePreview(null);
      setPreviewImages([]);
    }
  }, [book]);

  // Handle input changes for text fields
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle cover image upload
  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!imageUtils.isValidImageFile(file)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WebP) under 5MB');
      return;
    }
    try {
      // TODO: Upload image to backend and get URL or ID
      // For now, just preview locally
      const dataURL = await imageUtils.fileToDataURL(file);
      setCoverImagePreview(dataURL as string);
      setFormData(prev => ({ ...prev, coverImage: dataURL as string }));
    } catch (error) {
      console.error('Error uploading cover image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  // Handle preview images upload (multiple)
  const handlePreviewImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const validFiles = files.filter(file => imageUtils.isValidImageFile(file));
    if (validFiles.length !== files.length) {
      alert('Some files were skipped. Please select valid image files (JPEG, PNG, GIF, WebP) under 5MB');
    }
    try {
      const newPreviews: Array<{id: string, data: string}> = [];
      for (const file of validFiles) {
        const dataURL = await imageUtils.fileToDataURL(file);
        newPreviews.push({ id: dataURL as string, data: dataURL as string });
      }
      setPreviewImages(prev => [...prev, ...newPreviews]);
      setFormData(prev => ({
        ...prev,
        previewImages: [...prev.previewImages, ...newPreviews.map(p => p.id)]
      }));
    } catch (error) {
      console.error('Error uploading preview images:', error);
      alert('Error uploading images. Please try again.');
    }
  };

  // Remove cover image
  const removeCoverImage = () => {
    setCoverImagePreview(null);
    setFormData(prev => ({
      ...prev,
      coverImage: null
    }));
  };

  // Remove a preview image
  const removePreviewImage = (imageId: string) => {
    setPreviewImages(prev => prev.filter(img => img.id !== imageId));
    setFormData(prev => ({
      ...prev,
      previewImages: prev.previewImages.filter(id => id !== imageId)
    }));
  };



  // Validate form fields
  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (
      formData.publicationYear &&
      (isNaN(Number(formData.publicationYear)) ||
        Number(formData.publicationYear) < 0 ||
        Number(formData.publicationYear) > new Date().getFullYear())
    ) {
      newErrors.publicationYear = 'Please enter a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  // Helper to convert form data to Book format
  const toBookFormat = (data: FormData): Partial<Book> => {
    return {
      title: data.title,
      author: data.author,
      genre: data.genre || undefined,
      category: data.category || undefined,
      publicationYear: data.publicationYear ? Number(data.publicationYear) : undefined,
      numPages: data.numPages ? Number(data.numPages) : undefined,
      description: data.description || undefined,
      tags: data.tags,
      coverImage: data.coverImage || undefined,
      previewImages: data.previewImages,
      isFavorite: data.isFavorite,
      status: data.status as 'available' | 'checked_out' | 'lost' | 'damaged',
      readStatus: data.readStatus || undefined,
    };
  };

  // Helper to convert to backend snake_case format if needed
  const toBackendFormat = (data: FormData) => {
    return {
      title: data.title,
      author: data.author,
      genre: data.genre || null,
      category: data.category || null,
      publication_year: data.publicationYear ? Number(data.publicationYear) : null,
      num_pages: data.numPages ? Number(data.numPages) : null,
      description: data.description || null,
      tags: data.tags,
      cover_image: data.coverImage,
      preview_images: data.previewImages,
      is_favorite: data.isFavorite,
      status: data.status,
      read_status: data.readStatus,
    };
  };

  // Handle form submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    // Determine if we should use backend format (snake_case) or frontend format
    const isBackendAPI = process.env.NODE_ENV === 'production' || window.location.href.includes('localhost:8000');
    
    try {
      if (isEdit && book) {
        const dataToSend = isBackendAPI ? toBackendFormat(formData) : toBookFormat(formData);
        updateBook.mutate({ ...book, ...dataToSend } as Book, {
          onSuccess: () => {
            onSave(dataToSend);
            onCancel();
          },
          onError: (error: any) => {
            console.error('Error updating book:', error);
            alert('Error updating book: ' + (error.message || 'Unknown error'));
          },
        });
      } else {
        const dataToSend = isBackendAPI ? toBackendFormat(formData) : toBookFormat(formData);
        addBook.mutate(dataToSend as any, {
          onSuccess: (newBook) => {
            onSave(newBook || dataToSend);
            onCancel();
          },
          onError: (error: any) => {
            console.error('Error adding book:', error);
            alert('Error adding book: ' + (error.message || 'Unknown error'));
          },
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{book ? 'Edit Book' : 'Add New Book'}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} aria-label="Cancel" title="Cancel">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => handleInputChange('title', e.target.value)}
                  placeholder="Enter book title"
                  className={errors.title ? 'border-red-500' : ''}
                  aria-invalid={!!errors.title}
                  required
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={e => handleInputChange('author', e.target.value)}
                  placeholder="Enter author name"
                  className={errors.author ? 'border-red-500' : ''}
                  aria-invalid={!!errors.author}
                  required
                />
                {errors.author && <p className="text-sm text-red-500">{errors.author}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={e => handleInputChange('genre', e.target.value)}
                  placeholder="e.g., Fiction, Non-fiction, Mystery"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category/Subject</Label>
                <CategorySelect
                  value={formData.category}
                  onChange={value => handleInputChange('category', value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="publicationYear">Publication Year</Label>
                <Input
                  id="publicationYear"
                  type="number"
                  value={formData.publicationYear}
                  onChange={e => handleInputChange('publicationYear', e.target.value)}
                  placeholder="e.g., 2023"
                  min="0"
                  max={new Date().getFullYear()}
                  className={errors.publicationYear ? 'border-red-500' : ''}
                  aria-invalid={!!errors.publicationYear}
                />
                {errors.publicationYear && <p className="text-sm text-red-500">{errors.publicationYear}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="numPages">Total Number of Pages</Label>
                <Input
                  id="numPages"
                  type="number"
                  value={formData.numPages}
                  onChange={e => handleInputChange('numPages', e.target.value)}
                  placeholder="e.g., 250"
                  min="1"
                />
              </div>
            </div>
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                placeholder="Enter a brief description of the book"
                rows={3}
              />
            </div>
            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput
                tags={formData.tags}
                setTags={tags => setFormData(prev => ({ ...prev, tags }))}
              />
            </div>
            {/* Read Status */}
            <div className="space-y-2">
              <Label htmlFor="readStatus">Read Status</Label>
              <ReadStatusSelect
                value={formData.readStatus}
                onChange={value => handleInputChange('readStatus', value)}
              />
            </div>
            {/* Cover Image */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                {coverImagePreview ? (
                  <div className="flex items-start gap-4">
                    <img
                      src={coverImagePreview}
                      alt="Cover preview"
                      className="w-32 h-48 object-cover rounded shadow-lg border"
                      style={{ maxWidth: '8rem', maxHeight: '12rem', objectFit: 'cover' }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">Cover image uploaded</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeCoverImage}
                        aria-label="Remove cover image"
                        title="Remove cover image"
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
                    <Label htmlFor="cover-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose Image
                        </span>
                      </Button>
                    </Label>
                  </div>
                )}
              </div>
            </div>
            {/* Preview Images */}
            <div className="space-y-2">
              <Label>Preview Images (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {previewImages.map(image => (
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
                        title="Remove preview image"
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
                  <Label htmlFor="preview-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Add Preview Images
                      </span>
                    </Button>
                  </Label>
                  <p className="text-xs text-muted-foreground mt-2">
                    You can upload multiple images (sample pages, spine, etc.)
                  </p>
                </div>
              </div>
            </div>
            {/* Form Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} aria-label="Cancel" title="Cancel">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} aria-label={isSubmitting ? 'Saving...' : (book ? 'Update Book' : 'Add Book')}>
                {isSubmitting ? 'Saving...' : (book ? 'Update Book' : 'Add Book')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default BookForm;

