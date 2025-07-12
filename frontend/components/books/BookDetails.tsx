import { useState } from 'react';
import { X, Heart, Edit, Calendar, Tag, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';



import type { Book } from '../types/Book';

interface BookDetailsProps {
  book: Book | null;
  onClose: () => void;
  onEdit: (book: Book) => void;
  onToggleFavorite: (bookId: number) => void;
  isOpen: boolean;
}

function BookDetails({ book, onClose, onEdit, onToggleFavorite, isOpen }: BookDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);

  if (!isOpen || !book) return null;

  // Use coverImage and previewImages as URLs or base64 (backend integration needed)
  const coverImageData = book.coverImage || null;
  const previewImages = book.previewImages ? book.previewImages.filter(Boolean) : [];
  // All images for the viewer (cover + previews)
  const allImages = [coverImageData, ...previewImages].filter(Boolean);

  // SVG placeholder for missing/errored images
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial, sans-serif' font-size='16'%3ENo Cover%3C/text%3E%3C/svg%3E";

  // Open the image viewer modal at a specific image index
  const openImageViewer = (index: number = 0) => {
    setCurrentImageIndex(index);
    setShowImageViewer(true);
  };

  // Go to next image in viewer
  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % allImages.length);
  };

  // Go to previous image in viewer
  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + allImages.length) % allImages.length);
  };

  // Toggle favorite and close modal to refresh view
  const handleToggleFavorite = () => {
    if (book) {
      onToggleFavorite(book.id);
      onClose();
    }
  };

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{book.title}</CardTitle>
              <p className="text-lg text-muted-foreground">by {book.author}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={book.isFavorite ? 'text-red-500 hover:text-red-600' : 'hover:text-red-500'}
                aria-label={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                title={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-5 w-5 ${book.isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(book)} aria-label="Edit book" title="Edit book">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close details" title="Close details">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cover Image */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  <img
                    src={coverImageData || placeholderImage}
                    alt={book.title ? `Cover of ${book.title}` : 'Book cover'}
                    className="w-full max-w-sm mx-auto rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => coverImageData && openImageViewer(0)}
                  />
                  {allImages.length > 1 && (
                    <p className="text-center text-sm text-muted-foreground mt-2">
                      Click to view all images ({allImages.length})
                    </p>
                  )}
                </div>
              </div>

              {/* Book Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {book.genre && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Genre</h4>
                      <p className="text-foreground">{book.genre}</p>
                    </div>
                  )}
                  {book.publicationYear && (
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">Publication Year</h4>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-foreground">{book.publicationYear}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                {book.description && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Description</h4>
                    <p className="text-foreground leading-relaxed">{book.description}</p>
                  </div>
                )}

                {/* Tags */}
                {book.tags && book.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {book.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview Images */}
                {previewImages.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      Preview Images
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {previewImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => openImageViewer(index + 1)} // +1 because cover is at index 0
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Metadata */}
                <div className="pt-4 border-t text-sm text-muted-foreground">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>Added: {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'Unknown'}</div>
                    <div>Updated: {book.updatedAt ? new Date(book.updatedAt).toLocaleDateString() : 'Unknown'}</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Image Viewer Modal */}
      {showImageViewer && allImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-60">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setShowImageViewer(false)}
              aria-label="Close image viewer"
              title="Close image viewer"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation Buttons */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={prevImage}
                  aria-label="Previous image"
                  title="Previous image"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={nextImage}
                  aria-label="Next image"
                  title="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image */}
            <img
              src={allImages[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {allImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BookDetails;

