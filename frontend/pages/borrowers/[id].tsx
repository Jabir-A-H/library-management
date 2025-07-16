import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import BorrowerForm from '../../components/borrowers/BorrowerForm';

/**
 * Borrower Details Page - Displays and edits a single borrower's details.
 */
const BorrowerDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Placeholder: Fetch borrower data by id if needed
  // const borrower = ...

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Borrower Details</h1>
        <BorrowerForm
          borrower={null}
          onSave={() => router.push('/borrowers')}
          onCancel={() => router.push('/borrowers')}
        />
      </div>
    </Layout>
  );
};

export default BorrowerDetailsPage;
