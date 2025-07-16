import React from 'react';
import { NextPage } from 'next';
import Layout from '../../components/layout/Layout';
import BorrowerList from '../../components/borrowers/BorrowerList';

/**
 * Borrower List Page - Displays all borrowers in the library system.
 */
const BorrowersPage: NextPage = () => {
  // Handler for navigation (stubbed for now)
  const handleAddBorrower = () => {
    // Implement navigation to add borrower page if needed
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Borrowers</h1>
        <BorrowerList
          onAddBorrower={handleAddBorrower}
          onViewDetails={() => {}}
          onEditBook={() => {}}
        />
      </div>
    </Layout>
  );
};

export default BorrowersPage;
