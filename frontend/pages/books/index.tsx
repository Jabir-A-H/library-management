import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useBooks } from '../../lib/reactQueryHooks';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { BookOpen, Plus, Search, Filter, Grid, List, AlertCircle } from 'lucide-react';
import type { Book } from '@/types/Book';

/**
 * Books Index Page - Main book management interface
 * 
 * Features:
 * - Display all books in grid/list view
 * - Search and filter functionality
 * - Add new book capability
 * - Navigation to book details
 * - Responsive design
 * - Advanced filtering by genre, availability, and author
 */
const BooksPage: NextPage = () => {
  const router = useRouter();
  const { data: books, isLoading, error } = useBooks();
  
  // State for search, filters, and view mode
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Derived data for filtering
  const { filteredBooks, genres, totalBooks, availableBooks } = useMemo(() => {
    if (!books || !Array.isArray(books)) {
      return { filteredBooks: [], genres: [], totalBooks: 0, availableBooks: 0 };
    }

    // Extract unique genres
    const uniqueGenres = [...new Set(books.map(book => book.genre).filter(Boolean) as string[])];
    
    // Calculate totals
    const totalBooks = books.length;
    const availableBooks = books.filter(book => book.available_copies > 0).length;

    // Filter books based on search and filters
    const filtered = books.filter(book => {
      const matchesSearch = !searchTerm || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.genre?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGenre = selectedGenre === 'all' || book.genre === selectedGenre;
      
      const matchesAvailability = availabilityFilter === 'all' || 
        (availabilityFilter === 'available' && book.available_copies > 0) ||
        (availabilityFilter === 'unavailable' && book.available_copies === 0);

      return matchesSearch && matchesGenre && matchesAvailability;
    });

    return {
      filteredBooks: filtered,
      genres: uniqueGenres,
      totalBooks,
      availableBooks
    };
  }, [books, searchTerm, selectedGenre, availabilityFilter]);

  const handleAddBook = (): void => {
    router.push('/books/add');
  };

  const handleViewDetails = (book: Book): void => {
    router.push(`/books/${book.id}`);
  };

  const handleEditBook = (book: Book): void => {
    router.push(`/books/${book.id}/edit`);
  };

  const clearFilters = (): void => {
    setSearchTerm('');
    setSelectedGenre('all');
    setAvailabilityFilter('all');
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
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
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <AlertCircle className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-medium">Failed to load books</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {error instanceof Error ? error.message : 'Please try refreshing the page'}
              </p>
              <Button onClick={() => window.location.reload()} variant="outline">
                Retry
              </Button>
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
          <Button onClick={handleAddBook} className="bg-blue-600 hover:bg-blue-700">
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <Button 
              variant="outline" 
              className="sm:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <div className="flex gap-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Genre</label>
                <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="All genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Availability</label>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All books" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Books</SelectItem>
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
        {filteredBooks.length !== totalBooks && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredBooks.length} of {totalBooks} books
            </p>
          </div>
        )}

        {/* Books Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    {book.cover_image && (
                      <div className="relative">
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-full h-48 object-cover rounded-lg mb-3"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/200/300';
                          }}
                        />
                        {book.available_copies === 0 && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="destructive">Unavailable</Badge>
                          </div>
                        )}
                      </div>
                    )}
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">by {book.author}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {book.genre && (
                        <Badge variant="secondary" className="text-xs">
                          {book.genre}
                        </Badge>
                      )}
                      <Badge
                        variant={book.available_copies > 0 ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {book.available_copies > 0 ? `${book.available_copies} available` : "Unavailable"}
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
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  {searchTerm || selectedGenre !== 'all' || availabilityFilter !== 'all' 
                    ? 'No books match your filters' 
                    : 'No books found'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  {searchTerm || selectedGenre !== 'all' || availabilityFilter !== 'all' 
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Start building your library by adding your first book.'}
                </p>
                {searchTerm || selectedGenre !== 'all' || availabilityFilter !== 'all' ? (
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
              filteredBooks.map((book) => (
                <Card key={book.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {book.cover_image && (
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-16 h-20 object-cover rounded-lg flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/64/80';
                          }}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              by {book.author}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {book.genre && (
                                <Badge variant="secondary" className="text-xs">
                                  {book.genre}
                                </Badge>
                              )}
                              <Badge
                                variant={book.available_copies > 0 ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {book.available_copies > 0 ? `${book.available_copies} available` : "Unavailable"}
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
              ))
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  {searchTerm || selectedGenre !== 'all' || availabilityFilter !== 'all' 
                    ? 'No books match your filters' 
                    : 'No books found'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  {searchTerm || selectedGenre !== 'all' || availabilityFilter !== 'all' 
                    ? 'Try adjusting your search or filters to find what you\'re looking for.'
                    : 'Start building your library by adding your first book.'}
                </p>
                {searchTerm || selectedGenre !== 'all' || availabilityFilter !== 'all' ? (
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
