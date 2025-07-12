import { useState } from 'react';
import { useBorrowers } from '@/lib/reactQueryHooks';
import { User, Phone, Edit, Trash2, Plus, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


import type { Borrower } from '../types/Borrower';


interface BorrowerListProps {
  onAddBorrower: () => void;
  onViewBorrowerDetails: (borrower: Borrower) => void;
}

function BorrowerList({ onAddBorrower, onViewBorrowerDetails }: BorrowerListProps) {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const { data: borrowers = [], isLoading, isError } = useBorrowers();

  // Filter borrowers based on search and active status
  const filteredBorrowers = borrowers.filter((borrower: Borrower) => {
    const matchesSearch =
      borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (borrower.relationship && borrower.relationship.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = showInactive || borrower.is_active;
    return matchesSearch && matchesStatus;
  });

  const activeBorrowers = borrowers.filter((b: Borrower) => b.is_active);
  const inactiveBorrowers = borrowers.filter((b: Borrower) => !b.is_active);

  if (isLoading) {
    return <div className="py-16 text-center">Loading borrowers...</div>;
  }
  if (isError) {
    return <div className="py-16 text-center text-red-500">Failed to load borrowers.</div>;
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Borrowers</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage family members and friends who borrow books
          </p>
        </div>
        <Button onClick={onAddBorrower} className="bg-blue-600 hover:bg-blue-700 text-white" aria-label="Add borrower" title="Add borrower">
          <Plus className="h-4 w-4 mr-2" />
          Add Borrower
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Borrowers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeBorrowers.length}</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Borrowers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{borrowers.length}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Currently Borrowing</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {borrowers.reduce((total, borrower) => total + (borrower.current_books_count || 0), 0)}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search borrowers by name or relationship..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="show-inactive"
            checked={showInactive}
            onChange={e => setShowInactive(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="show-inactive" className="text-sm text-gray-700 dark:text-gray-300">
            Show inactive borrowers
          </label>
        </div>
      </div>

      {/* Borrowers List */}
      {filteredBorrowers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {borrowers.length === 0 ? 'No borrowers yet' : 'No borrowers found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {borrowers.length === 0
                ? 'Add family members and friends who borrow books from your library.'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {borrowers.length === 0 && (
              <Button onClick={onAddBorrower} className="bg-blue-600 hover:bg-blue-700 text-white" aria-label="Add your first borrower" title="Add your first borrower">
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Borrower
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBorrowers.map(borrower => (
            <Card key={borrower.id} className={`hover:shadow-lg transition-shadow ${!borrower.is_active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      {borrower.name}
                      {!borrower.is_active && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Inactive
                        </Badge>
                      )}
                    </CardTitle>
                    {borrower.relationship && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {borrower.relationship}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditBorrower(borrower)}
                      className="h-8 w-8 p-0"
                      aria-label="Edit borrower"
                      title="Edit borrower"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteBorrower(borrower)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      aria-label="Delete borrower"
                      title="Delete borrower"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {borrower.contact_info && (
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <Phone className="h-4 w-4 mr-2" />
                    {borrower.contact_info}
                  </div>
                )}

                {/* Current Books Count */}
                {borrower.current_books_count > 0 && (
                  <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 mb-2">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Currently borrowing {borrower.current_books_count} book{borrower.current_books_count !== 1 ? 's' : ''}
                  </div>
                )}

                {borrower.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {borrower.notes}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewBorrowerDetails(borrower)}
                    className="text-xs"
                    aria-label="View details"
                    title="View details"
                  >
                    View Details
                  </Button>
                  {borrower.current_books_count > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary */}
      {borrowers.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Showing {filteredBorrowers.length} of {borrowers.length} borrowers
          {!showInactive && inactiveBorrowers.length > 0 && (
            <span> ({inactiveBorrowers.length} inactive hidden)</span>
          )}
        </div>
      )}
    </div>
  );
}

export default BorrowerList;

