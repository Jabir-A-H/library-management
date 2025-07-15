import { useBooks, useDeleteBook, useUpdateBook } from '@/lib/reactQueryHooks';
import BookCard from './BookCard';
// import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Heart, TrendingUp } from 'lucide-react';

import type { Book } from '@/types/Book';

interface BookListProps {
  onAddBook: () => void;
  onViewDetails: (book: Book) => void;
  onEditBook: (book: Book) => void;
  searchQuery?: string;
  selectedGenre?: string;
  selectedTags?: string[];
  sortBy?: string;
}

function BookList({
  onAddBook,
  onViewDetails,
  onEditBook,
  searchQuery,
  selectedGenre,
  selectedTags,
  sortBy,
}: BookListProps) {
  const { data: books = [], isLoading, isError } = useBooks();
  const deleteBook = useDeleteBook();
  const updateBook = useUpdateBook();

  // Filtering and sorting logic (client-side, after fetch)
  let filteredBooks = [...books];
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredBooks = filteredBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        (book.description && book.description.toLowerCase().includes(query)) ||
        (book.tags &&
          book.tags.some((tag) =>
            typeof tag === 'string'
              ? tag.toLowerCase().includes(query)
              : tag.name.toLowerCase().includes(query)
          ))
    );
  }
  if (selectedGenre && selectedGenre !== 'all') {
    filteredBooks = filteredBooks.filter(
      (book) =>
        book.genre && book.genre.toLowerCase() === selectedGenre.toLowerCase()
    );
  }
  if (selectedTags && selectedTags.length > 0) {
    filteredBooks = filteredBooks.filter((book) =>
      selectedTags.some(
        (tag) =>
          book.tags &&
          book.tags.some((bookTag) =>
            (typeof bookTag === 'string'
              ? bookTag.toLowerCase()
              : bookTag.name.toLowerCase()
            ).includes(tag.toLowerCase())
          )
      )
    );
  }
  switch (sortBy) {
    case 'title-asc':
      filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'title-desc':
      filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'author-asc':
      filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
      break;
    case 'author-desc':
      filteredBooks.sort((a, b) => b.author.localeCompare(a.author));
      break;
    case 'year-asc':
      filteredBooks.sort(
        (a, b) => (a.publication_year || 0) - (b.publication_year || 0)
      );
      break;
    case 'year-desc':
      filteredBooks.sort(
        (a, b) => (b.publication_year || 0) - (a.publication_year || 0)
      );
      break;
    case 'newest':
      filteredBooks.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
      break;
    case 'oldest':
      filteredBooks.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      });
      break;
    case 'favorites':
      filteredBooks.sort(
        (a, b) =>
          (b.isFavorite || false ? 1 : 0) - (a.isFavorite || false ? 1 : 0)
      );
      break;
    default:
      filteredBooks.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
  }

  // Toggle favorite status for a book
  const handleToggleFavorite = (bookId: string | number) => {
    const book = books.find((b: Book) => b.id === bookId);
    if (book) {
      updateBook.mutate({
        ...book,
        isFavorite: !(book.isFavorite || false),
      });
    }
  };

  // Confirm and delete a book
  const handleDeleteBook = (book: Book) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      deleteBook.mutate(Number(book.id));
    }
  };

  // Calculate stats
  const totalBooks = books.length;
  const favoriteBooks = books.filter(
    (book: Book) => book.isFavorite || false
  ).length;
  const uniqueGenres = [
    ...new Set(books.map((book: Book) => book.genre).filter(Boolean)),
  ].length;

  if (isLoading) {
    return <div className="py-16 text-center">Loading books...</div>;
  }
  if (isError) {
    return (
      <div className="py-16 text-center text-red-500">
        Failed to load books.
      </div>
    );
  }
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <BookOpen className="h-24 w-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">
          No books in your library yet
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start building your personal library by adding your first book. You
          can include cover images, descriptions, tags, and more to organize
          your collection.
        </p>
        <Button
          onClick={onAddBook}
          size="lg"
          aria-label="Add your first book"
          title="Add your first book"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Your First Book
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
          <div className="text-2xl font-bold text-foreground">{totalBooks}</div>
          <div className="text-sm text-muted-foreground">Total Books</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <div className="text-2xl font-bold text-foreground">
            {favoriteBooks}
          </div>
          <div className="text-sm text-muted-foreground">Favorites</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold text-foreground">
            {uniqueGenres}
          </div>
          <div className="text-sm text-muted-foreground">Genres</div>
        </div>
      </div>

      {/* Results info */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {filteredBooks.length} of {totalBooks} books
        </div>
        <Button
          onClick={onAddBook}
          variant="default"
          aria-label="Add book"
          title="Add book"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No books match your search
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search criteria or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onEdit={onEditBook}
              onDelete={handleDeleteBook}
              onToggleFavorite={handleToggleFavorite}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;
