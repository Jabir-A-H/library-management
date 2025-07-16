import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import LendingForm from '../../components/lending/LendingForm';

/**
 * Add Lending Page - Allows users to add a new lending record.
 */
const AddLendingPage = () => {
  const router = useRouter();

  // Handler for successful lending addition
  const handleSave = () => {
    router.push('/lending');
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Add New Lending</h1>
        <LendingForm
          book={null}
          borrowers={[]}
          onSave={handleSave}
          onCancel={() => router.push('/lending')}
        />
      </div>
    </Layout>
  );
};

export default AddLendingPage;
