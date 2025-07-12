import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useBook } from '../../lib/reactQueryHooks';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Edit, BookOpen, Calendar, MapPin, Tag, FileText } from 'lucide-react';

interface BookDetailPageProps {
  id: string;
}

/**
 * Book Detail Page - View detailed book information
 * 
 * Features:
 * - View all book details
 * - Edit book information
 * - View lending history
 * - Track book location
 * - Manage book tags
 */
const BookDetailPage: NextPage<BookDetailPageProps> = ({ id }) => {
  const router = useRouter();
  const { data: book, isLoading, error } = useBook(id);

  const handleBack = (): void => {
    router.push('/books');
  };

  const handleEdit = (): void => {
    router.push(`/books/edit/${id}`);
  };

  const handleLendBook = (): void => {
    router.push(`/lending/add?bookId=${id}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading book details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <BookOpen className="h-12 w-12 mx-auto mb-2" />
              <p className="text-lg font-medium">Book not found</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">The requested book could not be found</p>
            </div>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Books
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const publicationDate = book.publication_date ? new Date(book.publication_date) : null;
  const acquisitionDate = book.acquisition_date ? new Date(book.acquisition_date) : null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {book.title}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                by {book.author}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleEdit} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={handleLendBook} className="bg-blue-600 hover:bg-blue-700">
              <BookOpen className="h-4 w-4 mr-2" />
              Lend Book
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Cover and Quick Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                  {book.cover_image_url ? (
                    <img 
                      src={book.cover_image_url} 
                      alt={book.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">No cover image</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</span>
                    <Badge variant={book.status === 'available' ? 'default' : 'secondary'}>
                      {book.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Condition</span>
                    <Badge variant="outline">{book.condition}</Badge>
                  </div>
                  {book.isbn && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">ISBN</span>
                      <span className="text-sm font-mono">{book.isbn}</span>
                    </div>
                  )}
                  {book.page_count && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Pages</span>
                      <span className="text-sm">{book.page_count}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</p>
                        <p className="text-lg font-semibold">{book.title}</p>
                      </div>
                      {book.title_bn && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Title (Bengali)</p>
                          <p className="text-lg font-semibold">{book.title_bn}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Author</p>
                        <p>{book.author}</p>
                      </div>
                      {book.author_bn && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Author (Bengali)</p>
                          <p>{book.author_bn}</p>
                        </div>
                      )}
                      {book.publisher && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Publisher</p>
                          <p>{book.publisher}</p>
                        </div>
                      )}
                      {book.publisher_bn && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Publisher (Bengali)</p>
                          <p>{book.publisher_bn}</p>
                        </div>
                      )}
                      {book.category && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Category</p>
                          <Badge variant="outline">{book.category.name}</Badge>
                        </div>
                      )}
                      {book.language && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Language</p>
                          <p>{book.language}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Publication Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Publication Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {book.publication_year && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Publication Year</p>
                          <p>{book.publication_year}</p>
                        </div>
                      )}
                      {publicationDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Publication Date</p>
                          <p>{publicationDate.toLocaleDateString()}</p>
                        </div>
                      )}
                      {book.edition && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Edition</p>
                          <p>{book.edition}</p>
                        </div>
                      )}
                      {book.isbn && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ISBN</p>
                          <p className="font-mono">{book.isbn}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {book.room && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Room</p>
                          <p>{book.room}</p>
                        </div>
                      )}
                      {book.shelf && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shelf</p>
                          <p>{book.shelf}</p>
                        </div>
                      )}
                      {book.position && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Position</p>
                          <p>{book.position}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                {book.tags && book.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {book.tags.map((tag) => (
                          <Badge key={tag.id} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="description" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      {book.description ? (
                        <p className="whitespace-pre-wrap">{book.description}</p>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">No description available</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {book.summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{book.summary}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {book.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="whitespace-pre-wrap">{book.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Acquisition Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {acquisitionDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Acquisition Date</p>
                          <p>{acquisitionDate.toLocaleDateString()}</p>
                        </div>
                      )}
                      {book.acquisition_cost && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Acquisition Cost</p>
                          <p>${book.acquisition_cost}</p>
                        </div>
                      )}
                      {book.source && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Source</p>
                          <p>{book.source}</p>
                        </div>
                      )}
                      {book.donor && (
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Donor</p>
                          <p>{book.donor}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lending History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Lending history functionality coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  
  return {
    props: {
      id: id as string,
    },
  };
};

export default BookDetailPage;
