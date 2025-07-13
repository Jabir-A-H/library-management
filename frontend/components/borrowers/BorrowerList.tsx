import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useBorrowers, useDeleteBorrower } from '@/lib/reactQueryHooks';
import { 
  User, 
  Phone, 
  Edit, 
  Trash2, 
  Plus, 
  BookOpen, 
  Clock, 
  AlertTriangle, 
  Search,
  Mail,
  MapPin,
  UserCheck,
  UserX,
  RefreshCw,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Borrower, BorrowerSearchFilters } from '@/types/Borrower';


/**
 * Props for the BorrowerList component
 */
interface BorrowerListProps {
  onAddBorrower: () => void;
  onViewBorrowerDetails: (borrower: Borrower) => void;
  onEditBorrower?: (borrower: Borrower) => void;
}

/**
 * BorrowerList Component - Display and manage borrowers
 * 
 * Features:
 * - Display all borrowers with server-side filtering
 * - Search by name, email, phone, or relationship
 * - Filter by active/inactive status
 * - Statistics dashboard with key metrics
 * - Edit and delete borrower functionality
 * - Responsive design with accessibility support
 * - Real-time search with debounced API calls
 * - Proper error boundaries and loading states
 */
const BorrowerList: React.FC<BorrowerListProps> = ({ 
  onAddBorrower, 
  onViewBorrowerDetails, 
  onEditBorrower 
}) => {
  // State for search, filters, and UI
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [relationshipFilter, setRelationshipFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Build filters for API call
  const apiFilters = useMemo((): BorrowerSearchFilters => {
    const filters: BorrowerSearchFilters = {};
    
    if (debouncedSearch) filters.search = debouncedSearch;
    if (!showInactive) filters.is_active = true;
    if (relationshipFilter) filters.relationship = relationshipFilter;
    
    return filters;
  }, [debouncedSearch, showInactive, relationshipFilter]);

  // Fetch borrowers with server-side filtering
  const { data: borrowers = [], isLoading, error, refetch } = useBorrowers(apiFilters);
  const deleteMutation = useDeleteBorrower();

  /**
   * Get borrower's display name with fallback to legacy field
   */
  const getBorrowerName = useCallback((borrower: Borrower): string => {
    if (borrower.full_name) return borrower.full_name;
    if (borrower.name) return borrower.name;
    if (borrower.first_name && borrower.last_name) {
      return `${borrower.first_name} ${borrower.last_name}`;
    }
    return borrower.first_name || borrower.last_name || 'Unnamed Borrower';
  }, []);

  /**
   * Get borrower's contact information
   */
  const getBorrowerContact = useCallback((borrower: Borrower): string | null => {
    return borrower.contact_info || borrower.email || borrower.phone || null;
  }, []);

  /**
   * Get current books count with fallback
   */
  const getCurrentBooksCount = useCallback((borrower: Borrower): number => {
    return borrower.current_books_count ?? borrower.active_loans_count ?? 0;
  }, []);

  /**
   * Check if borrower is active
   */
  const isBorrowerActive = useCallback((borrower: Borrower): boolean => {
    return borrower.is_active !== false; // Default to true if not specified
  }, []);

  /**
   * Get borrower notes with fallback
   */
  const getBorrowerNotes = useCallback((borrower: Borrower): string | null => {
    return borrower.notes || borrower.comments || null;
  }, []);

  // Calculate statistics from filtered borrowers
  const statistics = useMemo(() => {
    const totalBorrowers = borrowers.length;
    const activeBorrowers = borrowers.filter(b => isBorrowerActive(b)).length;
    const totalBooksOut = borrowers.reduce((total, borrower) => 
      total + getCurrentBooksCount(borrower), 0
    );
    const borrowersWithBooks = borrowers.filter(b => getCurrentBooksCount(b) > 0).length;

    return {
      totalBorrowers,
      activeBorrowers,
      inactiveBorrowers: totalBorrowers - activeBorrowers,
      totalBooksOut,
      borrowersWithBooks
    };
  }, [borrowers, isBorrowerActive, getCurrentBooksCount]);

  // Extract unique relationships for filter dropdown
  const availableRelationships = useMemo(() => {
    const relationships = borrowers
      .map(b => b.relationship)
      .filter(Boolean) as string[];
    return [...new Set(relationships)];
  }, [borrowers]);

  /**
   * Simple toast alternative for user feedback
   */
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    // For now, use alert or console - can be replaced with a proper toast library
    if (type === 'error') {
      alert(`Error: ${message}`);
      console.error(message);
    } else {
      console.log(`Success: ${message}`);
      // Could show a temporary message in UI instead
    }
  }, []);

  /**
   * Handle edit borrower
   */
  const handleEditBorrower = useCallback((borrower: Borrower): void => {
    if (onEditBorrower) {
      onEditBorrower(borrower);
    } else {
      showToast('Edit functionality not available', 'error');
    }
  }, [onEditBorrower, showToast]);

  /**
   * Handle delete borrower with confirmation
   */
  const handleDeleteBorrower = useCallback(async (borrower: Borrower): Promise<void> => {
    const borrowerName = getBorrowerName(borrower);
    const currentBooks = getCurrentBooksCount(borrower);
    
    if (currentBooks > 0) {
      showToast(`Cannot delete ${borrowerName}. They have ${currentBooks} book(s) currently borrowed.`, 'error');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${borrowerName}? This action cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(borrower.id);
        showToast(`${borrowerName} has been deleted successfully.`, 'success');
      } catch (error) {
        console.error('Failed to delete borrower:', error);
        showToast(`Failed to delete ${borrowerName}. Please try again.`, 'error');
      }
    }
  }, [getBorrowerName, getCurrentBooksCount, deleteMutation, showToast]);

  /**
   * Clear all filters and search
   */
  const clearFilters = useCallback((): void => {
    setSearchTerm('');
    setRelationshipFilter('');
    setShowInactive(false);
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
   * Retry loading borrowers
   */
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12" role="status" aria-label="Loading borrowers">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading borrowers...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12" role="alert">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Failed to load borrowers</p>
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
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Borrowers</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage family members and friends who borrow books ({statistics.totalBorrowers} total, {statistics.activeBorrowers} active)
          </p>
        </div>
        <Button 
          onClick={onAddBorrower} 
          className="bg-blue-600 hover:bg-blue-700 text-white" 
          aria-label="Add new borrower" 
          title="Add new borrower"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Borrower
        </Button>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Borrowers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.activeBorrowers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Borrowers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.totalBorrowers}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Books Borrowed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.totalBooksOut}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">With Active Loans</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.borrowersWithBooks}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search borrowers by name, email, phone, or relationship..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10"
              aria-label="Search borrowers"
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
              <label htmlFor="relationship-filter" className="block text-sm font-medium mb-2">
                Relationship
              </label>
              <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
                <SelectTrigger id="relationship-filter">
                  <SelectValue placeholder="All relationships" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Relationships</SelectItem>
                  {availableRelationships.map(relationship => (
                    <SelectItem key={relationship} value={relationship}>{relationship}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="show-inactive"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="show-inactive" className="text-sm font-medium">
                Show inactive borrowers
              </label>
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
      {(searchTerm || relationshipFilter || showInactive) && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {borrowers.length > 0 
              ? `Found ${borrowers.length} borrower${borrowers.length === 1 ? '' : 's'}` 
              : 'No borrowers match your filters'
            }
          </p>
        </div>
      )}

      {/* Borrowers List */}
      {borrowers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm || relationshipFilter || showInactive 
                ? 'No borrowers match your filters' 
                : 'No borrowers yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || relationshipFilter || showInactive
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : 'Add family members and friends who borrow books from your library.'}
            </p>
            {searchTerm || relationshipFilter || showInactive ? (
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Button 
                onClick={onAddBorrower} 
                className="bg-blue-600 hover:bg-blue-700 text-white" 
                aria-label="Add your first borrower" 
                title="Add your first borrower"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Borrower
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {borrowers.map(borrower => {
            const borrowerName = getBorrowerName(borrower);
            const contact = getBorrowerContact(borrower);
            const currentBooks = getCurrentBooksCount(borrower);
            const isActive = isBorrowerActive(borrower);
            const notes = getBorrowerNotes(borrower);

            return (
              <Card 
                key={borrower.id} 
                className={`hover:shadow-lg transition-shadow focus-within:ring-2 focus-within:ring-blue-500 ${
                  !isActive ? 'opacity-60' : ''
                }`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onViewBorrowerDetails(borrower);
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center" title={borrowerName}>
                        <User className="h-5 w-5 mr-2 flex-shrink-0" />
                        <span className="truncate">{borrowerName}</span>
                        {!isActive && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Inactive
                          </Badge>
                        )}
                      </CardTitle>
                      {borrower.relationship && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1" title={borrower.relationship}>
                          {borrower.relationship}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBorrower(borrower)}
                        className="h-8 w-8 p-0"
                        aria-label={`Edit ${borrowerName}`}
                        title={`Edit ${borrowerName}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteBorrower(borrower)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        aria-label={`Delete ${borrowerName}`}
                        title={`Delete ${borrowerName}`}
                        disabled={currentBooks > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {/* Contact Information */}
                  {contact && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2" title={contact}>
                      {borrower.email ? (
                        <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      ) : (
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                      )}
                      <span className="truncate">{contact}</span>
                    </div>
                  )}

                  {/* Address */}
                  {borrower.address && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2" title={borrower.address}>
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{borrower.address}</span>
                    </div>
                  )}

                  {/* Current Books Count */}
                  {currentBooks > 0 && (
                    <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 mb-2">
                      <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                      Currently borrowing {currentBooks} book{currentBooks !== 1 ? 's' : ''}
                    </div>
                  )}

                  {/* Notes */}
                  {notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2" title={notes}>
                      {notes}
                    </p>
                  )}

                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewBorrowerDetails(borrower)}
                      className="text-xs"
                      aria-label={`View details for ${borrowerName}`}
                      title={`View details for ${borrowerName}`}
                    >
                      View Details
                    </Button>
                    {currentBooks > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {currentBooks} Active
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Summary */}
      {borrowers.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {borrowers.length} borrower{borrowers.length === 1 ? '' : 's'}
          {statistics.inactiveBorrowers > 0 && !showInactive && (
            <span> ({statistics.inactiveBorrowers} inactive hidden)</span>
          )}
        </div>
      )}
    </div>
  );
};

export default BorrowerList;

