import { useState } from 'react';
import { Heart, Eye, Edit, Trash2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Book } from '@/types/Book';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
  onToggleFavorite: (bookId: number) => void;
  onViewDetails: (book: Book) => void;
}

function BookCard({ book, onEdit, onDelete, onToggleFavorite, onViewDetails }: BookCardProps) {
  const [imageError, setImageError] = useState<boolean>(false);

  // Use coverImage as URL or base64 (backend integration needed)
  const coverImageData = (book as any).coverImage || null;
  // SVG placeholder for missing/errored images
  const placeholderImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300' viewBox='0 0 200 300'%3E%3Crect width='200' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-family='Arial, sans-serif' font-size='16'%3ENo Cover%3C/text%3E%3C/svg%3E";
  const handleImageError = () => setImageError(true);
  const displayImage = imageError || !coverImageData ? placeholderImage : coverImageData;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border border-border">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={displayImage}
          alt={book.title ? `Cover of ${book.title}` : 'Book cover'}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
        />

        {/* Favorite button overlay */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
            book.isFavorite
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
          aria-label={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          title={book.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={e => {
            e.stopPropagation();
            onToggleFavorite(book.id);
          }}
        >
          <Heart className={`h-4 w-4 ${book.isFavorite ? 'fill-current' : ''}`} />
        </Button>

        {/* Action buttons overlay - shown on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            aria-label="View details"
            title="View details"
            onClick={e => {
              e.stopPropagation();
              onViewDetails(book);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Edit book"
            title="Edit book"
            onClick={e => {
              e.stopPropagation();
              onEdit(book);
            }}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            aria-label="Delete book"
            title="Delete book"
            onClick={e => {
              e.stopPropagation();
              onDelete(book);
            }}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2 text-foreground">
          {book.title}
        </h3>
        <p className="text-muted-foreground mb-2 line-clamp-1">
          by {book.author}
        </p>

        {book.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {book.description}
          </p>
        )}

        {/* Tags */}
        {book.tags && book.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {book.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
            {book.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{book.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>{book.publicationYear || 'Unknown'}</span>
        </div>
        <div className="text-xs">
          {book.genre}
        </div>
      </CardFooter>
    </Card>
  );
}

export default BookCard;

