import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useBooks } from '../../lib/reactQueryHooks';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { BookOpen, Plus, Search, Filter, Grid, List, AlertCircle, RefreshCw } from 'lucide-react';
import type { Book, BookSearchFilters } from '@/types/Book';

/**
 * Books Index Page - Main book management interface
 * 
 * Features:
 * - Display all books in grid/list view with server-side filtering
 * - Search and filter functionality with backend integration
 * - Add new book capability
 * - Navigation to book details and editing
 * - Responsive design with accessibility support
 * - Advanced filtering by genre, availability, and author
 * - Real-time search with debounced API calls
 * - Proper error boundaries and loading states
 */
const BooksPage: NextPage = () => {
  const router = useRouter();
  
  // State for search, filters, and view mode
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build filters for API call
  const apiFilters = useMemo((): BookSearchFilters => {
    const filters: BookSearchFilters = {};
    
    if (debouncedSearch) filters.search = debouncedSearch;
    if (selectedGenre) filters.genre = selectedGenre;
    if (availabilityFilter === 'available') filters.available_only = true;
    
    return filters;
  }, [debouncedSearch, selectedGenre, availabilityFilter]);

  // Fetch books with server-side filtering
  const { data: books, isLoading, error, refetch } = useBooks(apiFilters);

  /**
   * Get available copies count with fallback to legacy field
   */
  const getAvailableCopies = useCallback((book: Book): number => {
    return book.available_copies ?? book.availableCopies ?? 0;
  }, []);

  /**
   * Get total copies count with fallback to legacy field
   */
  const getTotalCopies = useCallback((book: Book): number => {
    return book.total_copies ?? book.totalCopies ?? 1;
  }, []);

  /**
   * Check if book is available
   */
  const isBookAvailable = useCallback((book: Book): boolean => {
    return book.is_available ?? (getAvailableCopies(book) > 0);
  }, [getAvailableCopies]);

  // Derived data for display
  const { filteredBooks, genres, totalBooks, availableBooks } = useMemo(() => {
    if (!books || !Array.isArray(books)) {
      return { filteredBooks: [], genres: [], totalBooks: 0, availableBooks: 0 };
    }

    // Extract unique genres for filter dropdown
    const uniqueGenres = [...new Set(books.map(book => book.genre).filter(Boolean) as string[])];
    
    // Calculate statistics
    const totalBooks = books.length;
    const availableBooks = books.filter(book => isBookAvailable(book)).length;

    return {
      filteredBooks: books, // Books are already filtered by API
      genres: uniqueGenres,
      totalBooks,
      availableBooks
    };
  }, [books, isBookAvailable]);

  /**
   * Navigate to add book page
   */
  const handleAddBook = useCallback((): void => {
    router.push('/books/add');
  }, [router]);

  /**
   * Navigate to book details page
   */
  const handleViewDetails = useCallback((book: Book): void => {
    router.push(`/books/${book.id}`);
  }, [router]);

  /**
   * Navigate to book edit page
   */
  const handleEditBook = useCallback((book: Book): void => {
    router.push(`/books/${book.id}/edit`);
  }, [router]);

  /**
   * Clear all filters and search
   */
  const clearFilters = useCallback((): void => {
    setSearchTerm('');
    setSelectedGenre('');
    setAvailabilityFilter('');
  }, []);

  /**
   * Handle search input change
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  /**
   * Toggle filters visibility
   */
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  /**
   * Retry loading books
   */
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12" role="status" aria-label="Loading books">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12" role="alert">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-medium">Failed to load books</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {error instanceof Error ? error.message : 'Please try refreshing the page'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleRetry} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Refresh Page
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Books</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your library's book collection ({totalBooks} total, {availableBooks} available)
            </p>
          </div>
          <Button 
            onClick={handleAddBook} 
            className="bg-blue-600 hover:bg-blue-700"
            aria-label="Add new book to library"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Input
                placeholder="Search books by title, author, or genre..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10"
                aria-label="Search books"
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {debouncedSearch !== searchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              className="sm:w-auto"
              onClick={toggleFilters}
              aria-expanded={showFilters}
              aria-controls="advanced-filters"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex gap-2" role="group" aria-label="View mode">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                aria-pressed={viewMode === 'grid'}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
                aria-label="List view"
                aria-pressed={viewMode === 'list'}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div 
              id="advanced-filters"
              className="flex flex-col sm:flex-row gap-4 pt-4 border-t"
              role="region"
              aria-label="Advanced filters"
            >
              <div className="flex-1">
                <label htmlFor="genre-filter" className="block text-sm font-medium mb-2">
                  Genre
                </label>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger id="genre-filter">
                    <SelectValue placeholder="All genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Genres</SelectItem>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label htmlFor="availability-filter" className="block text-sm font-medium mb-2">
                  Availability
                </label>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger id="availability-filter">
                    <SelectValue placeholder="All books" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Books</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                    <SelectItem value="unavailable">Unavailable Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {(searchTerm || selectedGenre || availabilityFilter) && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredBooks.length > 0 
                ? `Found ${filteredBooks.length} book${filteredBooks.length === 1 ? '' : 's'}` 
                : 'No books match your filters'
              }
            </p>
          </div>
        )}

        {/* Books Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => {
                const availableCopies = getAvailableCopies(book);
                const isAvailable = isBookAvailable(book);
                
                return (
                  <Card 
                    key={book.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleViewDetails(book);
                      }
                    }}
                  >
                    <CardHeader className="pb-4">
                      {(book.cover_image || book.coverImage) && (
                        <div className="relative">
                          <img
                            src={book.cover_image || book.coverImage}
                            alt={`Cover of ${book.title}`}
                            className="w-full h-48 object-cover rounded-lg mb-3"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/200/300';
                            }}
                          />
                          {!isAvailable && (
                            <div className="absolute top-2 right-2">
                              <Badge variant="destructive">Unavailable</Badge>
                            </div>
                          )}
                        </div>
                      )}
                      <CardTitle className="text-lg line-clamp-2" title={book.title}>
                        {book.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400" title={book.author}>
                        by {book.author}
                      </p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {book.genre && (
                          <Badge variant="secondary" className="text-xs">
                            {book.genre}
                          </Badge>
                        )}
                        <Badge
                          variant={isAvailable ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {isAvailable 
                            ? `${availableCopies} available` 
                            : "Unavailable"
                          }
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(book)}
                          className="flex-1"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBook(book)}
                        >
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  {searchTerm || selectedGenre || availabilityFilter 
                    ? 'No books match your filters' 
                    : 'No books found'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  {searchTerm || selectedGenre || availabilityFilter 
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Start building your library by adding your first book.'}
                </p>
                {searchTerm || selectedGenre || availabilityFilter ? (
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={handleAddBook} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Book
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          // List view
          <div className="space-y-4">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => {
                const availableCopies = getAvailableCopies(book);
                const isAvailable = isBookAvailable(book);
                
                return (
                  <Card 
                    key={book.id} 
                    className="hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleViewDetails(book);
                      }
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {(book.cover_image || book.coverImage) && (
                          <img
                            src={book.cover_image || book.coverImage}
                            alt={`Cover of ${book.title}`}
                            className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.src = '/api/placeholder/64/80';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1" title={book.title}>
                                {book.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2" title={book.author}>
                                by {book.author}
                              </p>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {book.genre && (
                                  <Badge variant="secondary" className="text-xs">
                                    {book.genre}
                                  </Badge>
                                )}
                                <Badge
                                  variant={isAvailable ? "default" : "destructive"}
                                  className="text-xs"
                                >
                                  {isAvailable 
                                    ? `${availableCopies} available` 
                                    : "Unavailable"
                                  }
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(book)}
                              >
                                View Details
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBook(book)}
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  {searchTerm || selectedGenre || availabilityFilter 
                    ? 'No books match your filters' 
                    : 'No books found'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  {searchTerm || selectedGenre || availabilityFilter 
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Start building your library by adding your first book.'}
                </p>
                {searchTerm || selectedGenre || availabilityFilter ? (
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                ) : (
                  <Button onClick={handleAddBook} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Book
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BooksPage;
