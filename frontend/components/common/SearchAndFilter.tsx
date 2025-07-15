import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { Book } from '@/types/Book';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchAndFilterProps {
  books: Book[];
  onSearchChange: (query: string) => void;
  onGenreChange: (genre: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  selectedGenre: string;
  selectedTags: string[];
  sortBy: string;
}

function SearchAndFilter({
  books = [],
  onSearchChange,
  onGenreChange,
  onTagsChange,
  onSortChange,
  searchQuery,
  selectedGenre,
  selectedTags,
  sortBy,
}: SearchAndFilterProps) {
  // State for showing/hiding filter panel
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // State for debounced search input
  const [tempSearchQuery, setTempSearchQuery] = useState<string>(
    searchQuery || ''
  );
  // Ref for search input for accessibility
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Get unique genres and tags from books
  const uniqueGenres = [
    ...new Set(books.map((book) => book.genre).filter(Boolean)),
  ].sort();

  // Handle both object and string tag formats
  const allTags = books.flatMap((book) => {
    if (!book.tags) return [];
    return book.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name));
  });
  const uniqueTags = [...new Set(allTags)].sort();

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(tempSearchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [tempSearchQuery, onSearchChange]);

  /**
   * Toggle a tag in the selectedTags array.
   * @param {string} tag
   */
  const handleTagToggle = useCallback(
    (tag: string) => {
      const currentTags = selectedTags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter((t) => t !== tag)
        : [...currentTags, tag];
      onTagsChange(newTags);
    },
    [selectedTags, onTagsChange]
  );

  /**
   * Clear all filters and reset search/sort.
   */
  const clearAllFilters = useCallback(() => {
    setTempSearchQuery('');
    onSearchChange('');
    onGenreChange('all');
    onTagsChange([]);
    onSortChange('newest');
  }, [onSearchChange, onGenreChange, onTagsChange, onSortChange]);

  // Whether any filters are active
  const hasActiveFilters = Boolean(
    searchQuery ||
      (selectedGenre && selectedGenre !== 'all') ||
      (selectedTags && selectedTags.length > 0)
  );

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'author-asc', label: 'Author A-Z' },
    { value: 'author-desc', label: 'Author Z-A' },
    { value: 'year-asc', label: 'Year (Old to New)' },
    { value: 'year-desc', label: 'Year (New to Old)' },
    { value: 'favorites', label: 'Favorites First' },
  ];

  return (
    <div className="space-y-4">
      {/* Search and Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
            aria-hidden="true"
          />
          <Input
            ref={searchInputRef}
            placeholder="Search books by title, author, description, or tags..."
            value={tempSearchQuery}
            onChange={(e) => setTempSearchQuery(e.target.value)}
            className="pl-10"
            aria-label="Search books"
            autoComplete="off"
          />
          {tempSearchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setTempSearchQuery('')}
              aria-label="Clear search"
              tabIndex={0}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="w-full sm:w-48">
          <Select value={sortBy || 'newest'} onValueChange={onSortChange}>
            <SelectTrigger aria-label="Sort by" title="Sort by">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Toggle */}
        <Button
          variant={showFilters ? 'default' : 'outline'}
          onClick={() => setShowFilters((v) => !v)}
          className="w-full sm:w-auto"
          aria-pressed={showFilters}
          aria-label={showFilters ? 'Hide filters' : 'Show filters'}
        >
          <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
          Filters
          {hasActiveFilters && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 p-0 text-xs"
              aria-label="Filters active"
            >
              !
            </Badge>
          )}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2" aria-live="polite">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                aria-label="Clear search filter"
                className="focus:outline-none"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          )}
          {selectedGenre && selectedGenre !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Genre: {selectedGenre}
              <button
                onClick={() => onGenreChange('all')}
                aria-label="Clear genre filter"
                className="focus:outline-none"
              >
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            </Badge>
          )}
          {selectedTags &&
            selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1"
              >
                Tag: {tag}
                <button
                  onClick={() => handleTagToggle(tag)}
                  aria-label={`Remove tag filter ${tag}`}
                  className="focus:outline-none"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </Badge>
            ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            aria-label="Clear all filters"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Expanded Filters */}
      {showFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Genre Filter */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Filter by Genre</h4>
                <Select
                  value={selectedGenre || 'all'}
                  onValueChange={onGenreChange}
                >
                  <SelectTrigger aria-label="Select genre" title="Select genre">
                    <SelectValue placeholder="Select genre..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {uniqueGenres
                      .filter((genre): genre is string => Boolean(genre))
                      .map((genre: string) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags Filter */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Filter by Tags</h4>
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {uniqueTags.length > 0 ? (
                      uniqueTags.map((tag: string) => (
                        <Badge
                          key={tag}
                          variant={
                            selectedTags && selectedTags.includes(tag)
                              ? 'default'
                              : 'outline'
                          }
                          className="cursor-pointer hover:bg-primary/80"
                          onClick={() => handleTagToggle(tag)}
                          aria-pressed={
                            selectedTags && selectedTags.includes(tag)
                          }
                          aria-label={
                            selectedTags && selectedTags.includes(tag)
                              ? `Remove tag ${tag}`
                              : `Add tag ${tag}`
                          }
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No tags available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {books.length} total books
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  aria-label="Clear all filters"
                >
                  Clear Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  aria-label="Hide filters"
                >
                  Hide Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SearchAndFilter;
