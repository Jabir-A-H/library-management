import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import BookForm from '../../components/books/BookForm';

/**
 * Add Book Page - Allows users to add a new book to the library.
 */
const AddBookPage: NextPage = () => {
  const router = useRouter();

  // Handler for successful book addition
  const handleSave = () => {
    // Redirect to books list after adding
    router.push('/books');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Add New Book</h1>
        <BookForm onSave={handleSave} onCancel={() => router.push('/books')} />
      </div>
    </Layout>
  );
};

export default AddBookPage;
